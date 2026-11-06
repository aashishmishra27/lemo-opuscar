// rig.js — shared helpers for every shot: camera, lip sync, default poses, the cyan portal, on-screen callouts.
import { clamp, lerp, seg, ss, eo, ei, back, hash, vnoise, TAU } from '/core/lib.js';
import { W, H, INK, g, push, pop, translate, rotate, scale, reset, shape, fillOnly, stroke, ell, arc, spline, rr, rect, dot, text } from './toon.js';
import { q } from './timeline.js';
export { q };
export const R = { lines: [], lips: {}, byId: {}, tx: [] };
export function initRig(T, lips) { R.lines = T.lines; R.lips = lips; R.byId = Object.fromEntries(T.lines.map(l => [l.id, l])); R.T = T; }
export const lt = (sh, k) => sh.lines[k].t0;                 // absolute start of line k of a shot
export const le = (sh, k) => sh.lines[k].t0 + sh.lines[k].d; // absolute end
export const P01 = (t, a, b) => clamp((t - a) / (b - a));

// —— camera ——
export function cam(cx, cy, z = 1, { rot = 0, shake = 0, t = 0 } = {}) {
  reset(); translate(W / 2, H / 2);
  if (shake) { const f = Math.floor(t * 24); translate((hash(f) - .5) * shake * 2, (hash(f + 77) - .5) * shake * 2); }
  scale(z); if (rot) rotate(rot); translate(-cx, -cy);
}
export const shakeAt = (t, t0, amp = 14, d = .35) => t >= t0 && t < t0 + d ? amp * (1 - (t - t0) / d) : 0;

// —— lip sync (stepped at 12 fps) ——
export function talk(who, t) {
  const tq = q(t);
  for (const L of R.lines) {
    if (L.who !== who || tq < L.t0 || tq >= L.t0 + L.d) continue;
    const k = Math.floor((tq - L.t0) * 24), lp = R.lips[L.id];
    const o = lp ? (lp.o[k] ?? 0) : .5 * (1 + Math.sin(tq * 20)) / 2, b = lp ? (lp.b[k] ?? .5) : .5;
    return { o, w: .8 + .45 * b - .2 * o, talking: true, id: L.id };
  }
  return { o: 0, w: 1, talking: false };
}
export const blinks = (t, seed = 1, every = 3.1) => { const k = Math.floor(q(t) * 12), n = Math.round(every * 12), c = Math.floor(k / n); return hash(c * 7.1 + seed) > .25 && (k % n) === Math.floor(hash(c + seed * 3) * (n - 3)) + 0 || (k % n) === Math.floor(hash(c + seed * 3) * (n - 3)) + 1 && hash(c * 7.1 + seed) > .25; };

// —— default poses ——
export function N(t, o = {}) {
  const m = talk('N', t), tq = q(t);
  return { x: 0, y: 0, s: 1, face: 1, lid: .5, look: [0, 0], blink: blinks(t, 2, 3.4), mouth: { o: m.o, w: m.w, sm: -.1, skew: .35 }, sq: 1 + .008 * Math.sin(tq * 2.3), headTilt: .04 + (m.talking ? (m.o - .3) * .06 : 0), ...o };
}
export function B(t, o = {}) {
  const m = talk('B', t), tq = q(t);
  return { x: 0, y: 0, s: 1, face: 1, t, nerv: .25, look: [0, 0], blink: blinks(t, 5, 2.6), mouth: { o: m.o * 1.15, w: m.w, sm: -.3 }, sq: 1 + .012 * Math.sin(tq * 3.1), headTilt: m.talking ? (m.o - .3) * .1 : Math.sin(tq * 1.7) * .03, ...o };
}
export const walkLegs = (tq, on, amp = 20) => on ? [[Math.sin(tq * 12) * amp, -Math.max(0, Math.cos(tq * 12)) * 14], [-Math.sin(tq * 12) * amp, -Math.max(0, -Math.cos(tq * 12)) * 14]] : [[0, 0], [0, 0]];
export const landSq = (t, tl) => { const u = t - tl; if (u < 0 || u > .5) return 1; return 1 - .22 * Math.exp(-u * 9) * Math.cos(u * 30); };
export const popIn = (t, t0, d = .3) => t < t0 ? 0 : back(clamp((t - t0) / d), 1.7);

// —— the portal: the ONLY glowing thing; electric cyan ——
export function portal(cx, cy, r, t, { open = 1, sx = .74, spin = 1 } = {}) {
  if (open <= .001) return;
  const Rr = r * open;
  push(); translate(cx, cy); scale(sx, 1);
  fillOnly(ell(0, 0, Rr * 1.55, Rr * 1.45, 48), 'rgba(56,242,232,.14)', { boil: .6 });
  fillOnly(ell(0, 0, Rr * 1.28, Rr * 1.22, 48), 'rgba(56,242,232,.2)', { boil: .6 });
  const rim = []; const NR = 22;
  for (let i = 0; i < NR; i++) { const a = i / NR * TAU, k = 1 + .09 * (vnoise(i * 1.7 + t * 3) - .5) * 2 + .05 * Math.sin(a * 5 + t * 6); rim.push([Math.cos(a) * Rr * k, Math.sin(a) * Rr * k]); }
  shape(spline(rim), {
    fill: '#38F2E8', lw: 8, shade: () => {
      fillOnly(ell(0, 0, Rr * .9, Rr * .9, 40), '#8FFAF4', { boil: .3 });
      for (let k = 0; k < 5; k++) {
        const pts = [], pts2 = [];
        for (let j = 0; j <= 22; j++) { const u = j / 22, rr_ = Rr * (1 - u) * .95, a = k / 5 * TAU + u * 3.6 + t * 2.6 * spin; pts.push([Math.cos(a) * rr_, Math.sin(a) * rr_]); const a2 = a + .55 * (1 - u * .7); pts2.push([Math.cos(a2) * rr_, Math.sin(a2) * rr_]); }
        fillOnly([...pts, ...pts2.reverse()], k % 2 ? '#C8FFFB' : '#1FB8C9', { boil: .4 });
      }
      fillOnly(ell(0, 0, Rr * .3, Rr * .3, 24), '#E9FFFE', { boil: .5 });
      fillOnly(ell(0, 0, Rr * .14, Rr * .14, 16), '#FFFFFF', { boil: .5 });
    }
  });
  for (let i = 0; i < 12; i++) { const a = hash(i) * TAU + t * (1.5 + hash(i + 4) * 2), d = Rr * (1.05 + .25 * ((t * .8 + hash(i + 9)) % 1)); dot(Math.cos(a) * d, Math.sin(a) * d, 5 + hash(i + 2) * 4, i % 3 ? '#8FFAF4' : '#FFFFFF'); }
  if (open > .6) for (let i = 0; i < 3; i++) { const u = (t * .9 + i / 3) % 1, x = (-.4 + i * .4) * Rr, y0 = Rr * .92; shape(spline([[x - 10, y0], [x + 10, y0], [x + 7, y0 + 20 + u * 40], [x, y0 + 32 + u * 50], [x - 7, y0 + 20 + u * 40]]), { fill: '#38F2E8', lw: 6 }); }
  pop();
}
export const portalOpen = (t, t0, t1 = 1e9) => t < t0 ? 0 : t < t1 ? back(clamp((t - t0) / .32), 1.7) : 1 - ei(clamp((t - t1) / .3));

// —— on-screen callouts (numbers, labels) in screen space; also registered for the reading-time check ——
export function callout(str, x, y, t, t0, { size = 64, fill = '#FFB627', rot = -.04, id = null, dur = 99, bgc = null } = {}) {
  if (t < t0 || t > t0 + dur) return;
  const s = back(clamp((q(t) - t0) / .25), 2.2);
  reset(); translate(x, y); scale(s); rotate(rot);
  g.font = `400 ${size}px "Lilita One"`; const w = g.measureText(str).width;
  if (bgc) shape(rr(-w / 2 - 26, -size * .62, w + 52, size * 1.24, 18), { fill: bgc, lw: 7 });
  text(str, 0, 4, { font: `400 ${size}px "Lilita One"`, fill, outlineW: Math.max(10, size * .2), outlineCol: INK });
  R.tx.push({ id: id || str, text: str, x0: x - w / 2, y0: y - size / 2, x1: x + w / 2, y1: y + size / 2 });
}
// speed lines / small helpers
export function speedLines(t, n = 14, { y0 = 100, y1 = 980, col = 'rgba(255,255,255,.8)', len = 360, sp = 3000, dir = 1 } = {}) {
  for (let i = 0; i < n; i++) { const y = lerp(y0, y1, hash(i * 3.7)), x = ((hash(i) * 2600 + t * sp) % 2600) - 340; stroke([[dir > 0 ? x : 1920 - x, y], [dir > 0 ? x + len : 1920 - x - len, y]], 6, { line: col }); }
}
