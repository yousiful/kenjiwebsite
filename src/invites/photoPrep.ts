// Photos are prepared in the host's browser: resized (a 1600px copy for the gallery and an
// 800px copy for the card), and given a focus point so every crop keeps the faces in view.
// Face finding uses the browser's built-in FaceDetector where it exists; elsewhere a
// center-weighted look at skin tones and detail picks the most interesting spot.

export interface PreparedPhoto { data: string; small: string; fx: number; fy: number; w: number; h: number }

type Detector = { detect: (src: CanvasImageSource) => Promise<{ boundingBox: DOMRectReadOnly }[]> };

async function decode(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.src = url;
  try {
    await img.decode();
    return img;
  } finally {
    // the decoded image stays usable after the URL is released
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

function toJpeg(img: CanvasImageSource, w: number, h: number, maxBytes: number): string {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('This browser could not prepare the photo.');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, w, h);
  let q = 0.84;
  let data = c.toDataURL('image/jpeg', q);
  while (data.length * 0.75 > maxBytes && q > 0.4) {
    q -= 0.12;
    data = c.toDataURL('image/jpeg', q);
  }
  return data.split(',')[1];
}

/** Center of the faces the browser can find, or null. */
async function faceFocus(img: HTMLImageElement): Promise<[number, number] | null> {
  const FD = (window as unknown as { FaceDetector?: new (o: { fastMode: boolean; maxDetectedFaces: number }) => Detector }).FaceDetector;
  if (!FD) return null;
  try {
    const faces = await new FD({ fastMode: true, maxDetectedFaces: 8 }).detect(img);
    if (!faces.length) return null;
    let x0 = Infinity, y0 = Infinity, x1 = 0, y1 = 0;
    for (const f of faces) {
      const b = f.boundingBox;
      x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height);
    }
    return [(x0 + x1) / 2 / img.naturalWidth, (y0 + y1) / 2 / img.naturalHeight];
  } catch {
    return null;
  }
}

/** No face finder: weigh skin tones and detail, favouring the middle and upper part of the frame. */
export function saliencyFocus(px: Uint8ClampedArray, w: number, h: number): [number, number] {
  let sx = 0, sy = 0, sw = 0;
  const lum = (i: number) => px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114;
  for (let y = 0; y < h - 1; y++) {
    for (let x = 0; x < w - 1; x++) {
      const i = (y * w + x) * 4;
      const r = px[i], g = px[i + 1], b = px[i + 2];
      const skin = r > 95 && g > 40 && b > 20 && r > g && r > b && r - Math.min(g, b) > 15 && Math.abs(r - g) > 12 ? 1 : 0;
      const edge = (Math.abs(lum(i) - lum(i + 4)) + Math.abs(lum(i) - lum(i + w * 4))) / 255;
      const nx = x / w - 0.5;
      const ny = y / h - 0.42;
      const center = Math.exp(-(nx * nx + ny * ny) / (2 * 0.28 * 0.28));
      const wgt = (0.6 * edge + 1.4 * skin) * center + 0.002;
      sx += wgt * x; sy += wgt * y; sw += wgt;
    }
  }
  const fx = sx / sw / w;
  const fy = sy / sw / h;
  // keep a little of the plain center so a busy background never pulls the crop to an edge
  const clamp = (v: number) => Math.min(0.85, Math.max(0.15, v));
  return [clamp(0.7 * fx + 0.3 * 0.5), clamp(0.7 * fy + 0.3 * 0.42)];
}

export async function preparePhoto(file: File): Promise<PreparedPhoto> {
  if (!file.type.startsWith('image/')) throw new Error('Please choose a photo.');
  let img: HTMLImageElement;
  try {
    img = await decode(file);
  } catch {
    throw new Error("We couldn't open that photo. Please try a different one.");
  }
  const W = img.naturalWidth;
  const H = img.naturalHeight;
  const fit = (max: number) => { const s = Math.min(1, max / Math.max(W, H)); return [Math.round(W * s), Math.round(H * s)] as const; };
  const [fw, fh] = fit(1600);
  const [sw, sh] = fit(800);
  const data = toJpeg(img, fw, fh, 2.8 * 1024 * 1024);
  const small = toJpeg(img, sw, sh, 550 * 1024);
  let focus = await faceFocus(img);
  if (!focus) {
    const [tw, th] = fit(96);
    const c = document.createElement('canvas');
    c.width = tw; c.height = th;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.drawImage(img, 0, 0, tw, th);
      focus = saliencyFocus(ctx.getImageData(0, 0, tw, th).data, tw, th);
    }
  }
  const [fx, fy] = focus || [0.5, 0.42];
  return { data, small, fx: Math.round(fx * 1000) / 1000, fy: Math.round(fy * 1000) / 1000, w: W, h: H };
}
