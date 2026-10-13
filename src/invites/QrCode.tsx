import { useEffect, useState } from 'react';

/** QR code drawn client-side as SVG (qrcode-generator is loaded only when a QR is shown). */
export default function QrCode({ text, label }: { text: string; label: string }) {
  const [svg, setSvg] = useState('');
  useEffect(() => {
    let alive = true;
    import('qrcode-generator').then(({ default: qrcode }) => {
      const qr = qrcode(0, 'M');
      qr.addData(text);
      qr.make();
      if (alive) setSvg(qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true }));
    });
    return () => { alive = false; };
  }, [text]);
  return (
    <figure style={{ margin: 0 }}>
      <div className="kv-qr" role="img" aria-label={label} dangerouslySetInnerHTML={{ __html: svg }} data-testid="qr" />
    </figure>
  );
}
