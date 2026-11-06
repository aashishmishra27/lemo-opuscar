// timeline.js — lays the script out in time from the measured voice durations (voices/dur.json).
// Every shot: t0, t1; every line: id, who, t0, d, sub. Chapter boundaries = first shot of each chapter.
import { SHOTS, CHAPTERS } from './script.js';
export const ANIM_FPS = 12;
export const q = t => Math.floor(t * ANIM_FPS + 1e-6) / ANIM_FPS;

export function build(DURS) {
  let t = 0; const shots = [], lines = [];
  for (const s of SHOTS) {
    const sh = { ...s, t0: t, lines: [] };
    if (!s.lines.length) { t += s.dur; }
    else {
      let c = t + (s.pre ?? .35);
      s.lines.forEach(([who, sub, tts, o], k) => {
        const id = `${s.id}_${k}`, d = DURS[id] ?? (sub.length * .065);
        if (k > 0) c += o?.gap ?? .3;
        const L = { id, who, sub, t0: +c.toFixed(3), d, shot: s.id, k };
        sh.lines.push(L); lines.push(L); c += d;
      });
      t = Math.max(c + (s.post ?? .4), t + (s.min ?? 0));
    }
    sh.t1 = +t.toFixed(3); sh.d = sh.t1 - sh.t0; shots.push(sh);
  }
  const chapters = CHAPTERS.map(c => { const f = shots.find(s => s.ch === c.id), l = [...shots].reverse().find(s => s.ch === c.id); return { ...c, t0: f.t0, t1: l.t1 }; });
  return { shots, lines, chapters, DUR: +(t + .8).toFixed(3) };   // + a beat of black after the last shot
}

// Subtitle intervals (on screen and in the .srt): hold ≥ max(1.8 s, speech + 0.45 s, 0.9 + chars/17), clipped before a chapter wipe or a silent beat
export function subsOf(T) {
  const WIPES = T.chapters.filter(c => !['cold', 'end'].includes(c.id)).map(c => c.t0);
  const CUTS = [...WIPES, ...['S04', 'S25', 'S57', 'S72', 'S109', 'S123'].map(id => T.shots.find(s => s.id === id).t0)].sort((a, b) => a - b);
  return T.lines.map(L => {
    let t1 = L.t0 + Math.max(L.d + .45, 1.8, .9 + L.sub.length / 17);
    const nx = T.lines.find(M => M.t0 > L.t0 + .01); if (nx && t1 > nx.t0 + 1.2) t1 = Math.max(nx.t0 + 1.2, L.t0 + L.d + .45);
    const cut = CUTS.find(c => c > L.t0 + .1); if (cut && t1 > cut) t1 = Math.max(cut - .04, L.t0 + L.d + .1);
    return { id: L.id, t0: L.t0, t1, who: L.who, text: L.sub };
  });
}
