import type { MusicId } from './shared';

// Background music made in the browser with the Web Audio API: no audio files, nothing to
// license. Both melodies are centuries-old public-domain compositions (Pachelbel's Canon,
// Wagner's Bridal Chorus), played here as a soft music box. Never starts without a tap.

export const MUSIC: { id: MusicId; name: string; hint: string }[] = [
  { id: '', name: 'No music', hint: 'Quiet and simple' },
  { id: 'canon', name: 'Canon in D (music box)', hint: 'The classic wedding piece, soft and gentle' },
  { id: 'bridal', name: 'Here Comes the Bride (music box)', hint: 'The traditional bridal march' },
  { id: 'chimes', name: 'Soft chimes', hint: 'Light, slow bell tones' },
];

const N: Record<string, number> = {};
['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].forEach((n, i) => {
  for (let o = 2; o <= 6; o++) N[`${n}${o}`] = 440 * Math.pow(2, (i - 9 + (o - 4) * 12) / 12);
});

type Note = [string, number]; // [pitch or '-' for rest, beats]

function canon(): { notes: Note[][]; bpm: number } {
  // bass + arpeggio + the canon's top line, 8 chords of 2 beats
  const chords = [['D3', 'A3', 'D4', 'F#4'], ['A2', 'E3', 'A3', 'C#4'], ['B2', 'F#3', 'B3', 'D4'], ['F#2', 'C#3', 'F#3', 'A3'], ['G2', 'D3', 'G3', 'B3'], ['D3', 'A3', 'D4', 'F#4'], ['G2', 'D3', 'G3', 'B3'], ['A2', 'E3', 'A3', 'C#4']];
  const arp: Note[] = chords.flatMap((c) => [[c[0], 0.5], [c[1], 0.5], [c[2], 0.5], [c[3], 0.5]] as Note[]);
  const top: Note[] = [['F#5', 2], ['E5', 2], ['D5', 2], ['C#5', 2], ['B4', 2], ['A4', 2], ['B4', 2], ['C#5', 2]];
  const top2: Note[] = [['D5', 1], ['C#5', 1], ['B4', 1], ['A4', 1], ['G4', 1], ['F#4', 1], ['G4', 1], ['E4', 1], ['D4', 1], ['F#4', 1], ['A4', 1], ['G4', 1], ['F#4', 1], ['D4', 1], ['F#4', 1], ['E4', 1]];
  return { notes: [[...arp, ...arp], [...top, ...top2]], bpm: 72 };
}

function bridal(): { notes: Note[][]; bpm: number } {
  const mel: Note[] = [
    ['G4', 1], ['C5', 0.75], ['C5', 0.25], ['C5', 2],
    ['G4', 1], ['D5', 0.75], ['B4', 0.25], ['C5', 2],
    ['G4', 1], ['C5', 0.75], ['F5', 0.25], ['F5', 1], ['E5', 0.75], ['D5', 0.25],
    ['C5', 1], ['B4', 0.75], ['C5', 0.25], ['D5', 2],
    ['G4', 1], ['C5', 0.75], ['C5', 0.25], ['C5', 2],
    ['G4', 1], ['D5', 0.75], ['B4', 0.25], ['C5', 2],
    ['G4', 1], ['C5', 0.75], ['E5', 0.25], ['G5', 1], ['E5', 0.75], ['C5', 0.25],
    ['A4', 1], ['D5', 0.75], ['E5', 0.25], ['C5', 2], ['-', 2],
  ];
  const bass: Note[] = [['C3', 4], ['G2', 4], ['F2', 4], ['G2', 4], ['C3', 4], ['G2', 4], ['C3', 2], ['E3', 2], ['F3', 2], ['G2', 2], ['C3', 4]];
  return { notes: [mel, bass], bpm: 66 };
}

function chimes(): { notes: Note[][]; bpm: number } {
  const p = ['C5', 'D5', 'E5', 'G5', 'A5', 'C6', 'A5', 'G5', 'E5', 'G5', 'D5', 'E5', 'C5', 'G4', 'A4', 'C5'];
  return { notes: [p.map((n) => [n, 1.5] as Note), [['C3', 6], ['A2', 6], ['F2', 6], ['G2', 6]]], bpm: 60 };
}

export class MusicBox {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer = 0;
  playing = false;

  async play(id: MusicId) {
    if (!id) return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    this.stop();
    const ctx = new AC();
    this.ctx = ctx;
    await ctx.resume();
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 1.2);
    // a little room: feedback delay as a soft reverb
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.23;
    const fb = ctx.createGain();
    fb.gain.value = 0.28;
    const wet = ctx.createGain();
    wet.gain.value = 0.32;
    master.connect(ctx.destination);
    master.connect(delay);
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(wet);
    wet.connect(ctx.destination);
    this.master = master;
    this.playing = true;

    const song = id === 'canon' ? canon() : id === 'bridal' ? bridal() : chimes();
    const beat = 60 / song.bpm;
    const loopBeats = Math.max(...song.notes.map((v) => v.reduce((a, n) => a + n[1], 0)));
    let start = ctx.currentTime + 0.15;
    const schedule = () => {
      if (!this.ctx || !this.master) return;
      song.notes.forEach((voice, vi) => {
        let t = start;
        for (const [pitch, len] of voice) {
          if (pitch !== '-' && N[pitch]) this.tone(N[pitch], t, len * beat, vi === 0 ? 0.22 : 0.12, id === 'chimes');
          t += len * beat;
        }
      });
      start += loopBeats * beat;
    };
    schedule();
    // keep one loop ahead
    this.timer = window.setInterval(() => {
      if (this.ctx && start - this.ctx.currentTime < loopBeats * beat * 0.5) schedule();
    }, 1000);
  }

  private tone(freq: number, at: number, dur: number, vol: number, bell: boolean) {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    o1.type = 'sine';
    o2.type = 'triangle';
    o1.frequency.value = freq;
    o2.frequency.value = freq * (bell ? 2.76 : 2);
    const g2 = ctx.createGain();
    g2.gain.value = bell ? 0.18 : 0.08;
    o1.connect(g);
    o2.connect(g2);
    g2.connect(g);
    g.connect(this.master!);
    const decay = Math.max(0.6, Math.min(bell ? 3.2 : 1.8, dur * 2.2));
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(vol, at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, at + decay);
    o1.start(at);
    o2.start(at);
    o1.stop(at + decay + 0.05);
    o2.stop(at + decay + 0.05);
  }

  stop() {
    window.clearInterval(this.timer);
    this.playing = false;
    if (this.ctx) {
      const c = this.ctx;
      try {
        this.master?.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.4);
      } catch { /* closed */ }
      window.setTimeout(() => c.close().catch(() => {}), 500);
    }
    this.ctx = null;
    this.master = null;
  }
}
