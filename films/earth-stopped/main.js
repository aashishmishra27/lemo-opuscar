// The Day Earth Stopped — Sci-Fi Sitcom Toon. Page contract: window.DUR, render(t), EV, TEXTS, READY.
import { clamp, lerp, seg, ss, eo, ei, back, hash, TAU } from '/core/lib.js';
import { W, H, INK, init, frame, g, push, pop, translate, rotate, scale, reset, shape, fillOnly, stroke, ell, arc, rr, rect, text, screenRect } from './toon.js';
import { build, subsOf, q } from './timeline.js';
import { R, initRig, cam, portal, lt, le } from './rig.js';
import { setIndia } from './sets.js';
import * as S1 from './shots1.js';
import * as S2 from './shots2.js';
import * as S3 from './shots3.js';

init(document.getElementById('c'));
const J = async f => { try { const r = await fetch(f); if (r.ok) return await r.json(); } catch (e) { } return null; };
const DURS = (await J('voices/dur.json')) || {}, LIPS = (await J('voices/lips.json')) || {};
setIndia(await J('india.json'));
const T = build(DURS); initRig(T, LIPS);
const SH = { ...S1.SH, ...S2.SH, ...S3.SH }, EVS = { ...S1.EVS, ...S2.EVS, ...S3.EVS };
const shotAt = t => { for (const s of T.shots) if (t < s.t1) return s; return T.shots[T.shots.length - 1]; };
const WIPES = T.chapters.filter(c => !['cold', 'end'].includes(c.id)).map(c => c.t0);

// —— portal swirl wipe between chapters (covers the cut) ——
function wipe(t) {
  for (const tc of WIPES) {
    const d = Math.abs(t - tc), hw = .3; if (d > hw) continue;
    const u = 1 - d / hw, Rr = 1400 * Math.pow(u, .6);
    reset(); portal(960, 540, Rr, t, { open: 1, sx: 1, spin: 2.2 });
    if (d < .03) screenRect('#E9FFFE', .7);
  }
}
// —— chapter readout: retro terminal tag, typed in ——
function tag(t) {
  for (const c of T.chapters) {
    if (!c.tag) continue;
    const a = c.t0 + .35, b = a + 4.6; if (t < a || t >= b) continue;
    const [l1, l2] = c.tag, u = t - a, n = Math.floor(u * 30), s1 = l1.slice(0, n), s2 = l2.slice(0, Math.max(0, n - l1.length));
    const pop_ = back(seg(t, a, a + .18), 2.2) * (1 - ss(seg(t, b - .2, b)));
    reset(); push(); translate(64, 56); scale(pop_);
    g.font = '400 56px VT323'; const w1 = Math.max(g.measureText(l1).width, g.measureText(l2).width * 44 / 56) + 70;
    shape(rr(0, 0, Math.max(340, w1), 120, 12), { fill: c.col, lw: 7 });
    text('▶ ' + s1 + (n < l1.length && Math.floor(t * 6) % 2 ? '█' : ''), 24, 38, { font: '400 56px VT323', fill: c.fg, align: 'left' });
    text(s2, 28, 88, { font: '400 44px VT323', fill: c.fg, align: 'left' });
    pop();
    R.tx.push({ id: 'tag_' + c.id, text: l1 + ' ' + l2, x0: 64, y0: 56, x1: 64 + w1, y1: 176 });
  }
}
// —— subtitles: rounded heavy sans, white with a black outline, speaker pill ——
const WHO = { N: ['NOVA', '#F2A33A'], B: ['BUNTY', '#FF6B5B'] };
export const SUBS = subsOf(T);
function wrapSub(str) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.font = '800 50px "Baloo 2"';
  if (g.measureText(str).width < 1250) return [str];
  const mid = str.length / 2; let best = -1;
  for (let i = 0; i < str.length; i++) if (str[i] === ' ' && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
  return [str.slice(0, best), str.slice(best + 1)];
}
function subs(t) {
  const act = SUBS.filter(s => t >= s.t0 && t < s.t1).slice(-2);
  let y = H - 82;
  for (let i = act.length - 1; i >= 0; i--) {
    const s = act[i], a = i === act.length - 1 ? 1 : .7, lines = wrapSub(s.text), [nm, col] = WHO[s.who];
    const p = back(seg(t, s.t0, s.t0 + .12), 2);
    g.setTransform(1, 0, 0, 1, 0, 0); g.font = '800 50px "Baloo 2"';
    const tw = Math.max(...lines.map(l => g.measureText(l).width)); g.font = '800 26px "Baloo 2"'; const nw = g.measureText(nm).width + 34;
    const total = nw + 22 + tw, x0 = (W - total) / 2, y0 = y - (lines.length - 1) * 64;
    reset(); g.globalAlpha = a;
    push(); translate(x0 + nw / 2, y0 - 4); scale(p); translate(-nw / 2, 0);
    shape(rr(0, -22, nw, 44, 14), { fill: col, lw: 5 }); text(nm, nw / 2, 2, { font: '800 26px "Baloo 2"', fill: '#fff', outlineW: 6 });
    pop();
    lines.forEach((l, k) => text(l, x0 + nw + 22, y0 + k * 64, { font: '800 50px "Baloo 2"', fill: '#fff', align: 'left', outlineW: 11 }));
    g.globalAlpha = 1;
    y = y0 - 80;
  }
}

function render(t) {
  R.tx = [];
  frame(t);
  reset(); screenRect('#000');
  const sh = shotAt(t), u = t - sh.t0;
  if (t >= T.shots[T.shots.length - 1].t1) { reset(); screenRect('#000'); return; }
  const f = SH[sh.id];
  if (f) f(t, u, sh);
  else { reset(); screenRect('#333'); text(sh.id, 960, 540, { font: '800 120px "Baloo 2"', fill: '#fff' }); }
  wipe(t); tag(t); subs(t);
}

// —— sound events for the mixer and the score ——
function events() {
  const ev = [], add = (type, t, o = {}) => ev.push({ type, t: +(+t).toFixed(3), ...o });
  for (const L of T.lines) add('vo', L.t0, { id: L.id, who: L.who });
  for (const c of T.chapters) add('cue', c.t0, { name: c.id, t1: c.t1 });
  for (const tc of WIPES) add('portalWhoosh', tc - .22);
  let cur = null;   // ambience segments by world
  for (const s of T.shots) { if (cur && cur.w === s.w) cur.b = s.t1; else { if (cur) add('amb', cur.a, { w: cur.w, d: +(cur.b - cur.a).toFixed(3) }); cur = { a: s.t0, b: s.t1, w: s.w }; } }
  add('amb', cur.a, { w: cur.w, d: +(cur.b - cur.a).toFixed(3) });
  for (const s of T.shots) if (EVS[s.id]) EVS[s.id](s, add);
  return ev.sort((a, b) => a.t - b.t);
}

window.render = render; window.DUR = T.DUR; window.EV = events(); window.SUBS = SUBS; window.TL = T;
window.TEXTS = t => { render(t); return R.tx.slice(); };
for (const f of ['800 50px "Baloo 2"', '400 60px "Lilita One"', '400 40px VT323']) await document.fonts.load(f);
render(parseFloat(new URLSearchParams(location.search).get('t') ?? '2'));
window.READY = true;
