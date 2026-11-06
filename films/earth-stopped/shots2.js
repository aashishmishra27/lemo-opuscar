// shots2.js — Ch3 (The First Hour), Ch4 (The First Day), Ch5 (The First Year)
import { clamp, lerp, seg, ss, eo, ei, back, hash, TAU } from '/core/lib.js';
import { W, H, INK, g, push, pop, translate, rotate, scale, reset, shape, fillOnly, stroke, ell, arc, spline, rr, rect, quad, noodle, dot, text, screenRect, bands } from './toon.js';
import { C, nova, bunty, gloop, terra, moon, chai, spinBrake, hand, remote, tumbler, phone, star4, eye, mouth } from './chars.js';
import * as St from './sets.js';
import { R, cam, shakeAt, talk, N, B, walkLegs, landSq, popIn, portal, portalOpen, callout, speedLines, lt, le, P01, q } from './rig.js';
export const SH = {}, EVS = {};
const deck = (x = 960, y = 960, s = .9) => St.platform(x, y, s, { w: 560 });

// ———————————— CH3 · THE FIRST HOUR (storm) ————————————
SH.S42 = (t, u, sh) => {
  cam(960, 520, 1.0);
  St.street(t, { v: 'storm', dmg: 1, wind: 1, auto: 0 });
  portal(960, 420, 200, t, { open: 1 - ei(P01(u, .3, .7)) });
  deck();
  nova(N(t, { x: 820, y: 975, s: .72, lean: -.06, look: [.3, 0], lid: .5 }));
  bunty(B(t, { x: 1090, y: 980, s: .78, face: -1, lean: .12, nerv: .7, sweat: u, holdR: 'chai', armR: { h: [50, 40], bend: 30 }, look: [-.6, 0], cowlick: 1 }));
  gloop({ x: 1260, y: 980, s: .4, t, sq: .8, look: [-.5, 0] });
};
EVS.S42 = (sh, add) => { add('portalClose', sh.t0 + .4); };
SH.S43 = (t, u, sh) => { cam(800 + u * 160, 460, .8); St.street(t, { v: 'storm', dmg: 1, wind: 1, auto: 0, stall: 0 }); };
SH.S44 = (t, u, sh) => {
  cam(960, 560, 1.35); St.street(t, { v: 'storm', dmg: 1, wind: 1, auto: 0 }); deck();
  const fl = Math.sin(q(t) * 24) * .04;
  nova(N(t, { x: 820, y: 975, s: .72, lean: .04, ringTilt: -.22 + fl * 3, look: [.4, 0], lid: .5 }));
  bunty(B(t, { x: 960, y: 985, s: .7, face: -1, lean: .35 + fl, nerv: .9, sweat: u * 1.5, eyeS: 1.15, pupil: 2.6, cowlick: 1, armR: { h: [-150, -20], bend: 10, fist: true }, armL: { h: [-130, 10], bend: -10, fist: true }, holdR: null, sq: 1 + Math.sin(t * 30) * .02 }));
  push(); translate(1200, 940); rotate(.06); gloop({ x: 0, y: 0, s: .45, t, flat: .85 + fl * 2, look: [0, -1] }); pop();
};
EVS.S44 = (sh, add) => { add('flap', sh.t0 + .2, { d: sh.d - .3 }); };
SH.S45 = (t, u, sh) => {
  cam(960, 540, 1); St.space(t, { col: '#3A3070' });
  terra({ x: 960, y: 560, R: 300, rot: 1, face: 'shock', t });
  push(); translate(960, 560); const a0 = t * 1.6;
  stroke(ell(0, 0, 360, 360, 60), 14, { line: 'rgba(91,75,115,.55)', boil: .7 });
  for (let k = 0; k < 6; k++) { const a = a0 + k / 6 * TAU; const P = arc(0, 0, 360, 360, a, a + .5, 10); stroke(P, 12); stroke(P, 6, { line: '#E9E1C9' }); const e = P[P.length - 1]; push(); translate(e[0], e[1]); rotate(a + .5 + Math.PI / 2); shape([[-16, -12], [16, 0], [-16, 12]], { fill: '#E9E1C9', lw: 4 }); pop(); }
  pop();
};
EVS.S45 = (sh, add) => { add('wind', sh.t0, { d: sh.d, v: .5 }); };
SH.S46 = (t, u, sh) => {
  cam(960, 540, 1, { shake: shakeAt(t, lt(sh, 1) + 1.0, 14, .4), t });
  St.indiaMap(t, { land: '#B8A35A', sea: '#5B4B73', paper: '#7B5B3A', streaks: 1, shock: t > lt(sh, 1) ? P01(t, lt(sh, 1), le(sh, 1)) : 0 });
  callout('1,600 km/h', 1600, 300, t, lt(sh, 0) + 2.2, { size: 70 });
  callout('SUPERSONIC', 1600, 820, t, lt(sh, 1) + 1.0, { size: 76, fill: '#E9E1C9' });
};
EVS.S46 = (sh, add) => { add('sonic', lt(sh, 1) + 1.0); };
SH.S47 = (t, u, sh) => {
  cam(960, 540, 1); reset(); screenRect('#5B4B73'); cam(960, 540, 1);
  const k1 = lt(sh, 1), b1 = ss(P01(t, k1 + .2, k1 + .8)), b2 = back(P01(t, k1 + 1.6, k1 + 2.4), 1.4);
  shape(rect(-100, 900, 2200, 300), { fill: '#3A2E52', lw: 7 });
  shape(rect(720, 900 - 160 * b1, 180, 160 * b1 + 4), { fill: '#E9E1C9', lw: 7 });
  if (b1 > .5) { push(); translate(810, 840 - 160 * b1); for (let k = 0; k < 3; k++) stroke(arc(0, 0, 18 + k * 14, 18 + k * 14, k, k + 4, 14), 5); pop(); }
  shape(rect(1080, 900 - 680 * b2, 180, 680 * b2 + 4), { fill: '#FFD23F', lw: 7 });
  if (b2 > .5) { push(); translate(1170, 860 - 680 * b2); for (let k = 0; k < 3; k++) stroke([[-60, -20 + k * 20], [60, -20 + k * 20]], 6); pop(); }
  if (b1 > .5) callout('~300', 810, 650, t, k1 + .6, { size: 64 });
  if (b2 > .5) callout('1,600', 1170, 140, t, k1 + 2.0, { size: 64 });
  bunty(B(t, { x: 300, y: 1130, s: 1.2, look: [.8, -.2], eyeS: t > k1 + 2 ? 1.25 : 1, mouth: { ...talk('B', t), o: t > k1 + 2.2 && !talk('B', t).talking ? .8 : talk('B', t).o } }));
};
EVS.S47 = (sh, add) => { add('pop', lt(sh, 1) + .6); add('boing', lt(sh, 1) + 2.0); };
SH.S48 = (t, u, sh) => {
  const L = sh.lines[0], f = x => L.t0 + L.d * x;
  cam(960, 520, 1, { shake: 6, t });
  St.countryside(t, { peel: ss(P01(t, f(.05), f(.4))), fly: ss(P01(t, f(.3), f(.9))) });
};
EVS.S48 = (sh, add) => { const L = sh.lines[0]; add('rip', L.t0 + L.d * .1); add('whoosh', L.t0 + L.d * .35); add('crack', L.t0 + L.d * .6, { v: .7 }); };
SH.S49 = (t, u, sh) => {
  cam(1680, 330, 1.9, { shake: 4, t });
  St.street(t, { v: 'storm', dmg: 1, wind: 1, auto: 0, stall: 0 });
  push(); translate(1700, 290); rotate(-.06);
  const fl = Math.sin(q(t) * 30) * .1;
  St.cow(170, 30, .6, t, { flap: 1, a: -Math.PI / 2 + 1.55 + fl });
  pop();
};
EVS.S49 = (sh, add) => { add('moo', sh.t0 + .6); add('flap', sh.t0, { d: sh.d }); add('creak', sh.t0 + 1.6); };
SH.S50 = (t, u, sh) => {
  cam(960, 540, 1); reset(); screenRect('#9C8A48'); cam(960, 540, 1);
  shape(rect(-200, 520, 2400, 700), { fill: '#7B5B3A', lw: 7, shade: () => { for (let i = 0; i < 9; i++) stroke([[i * 260 - 100, 540], [i * 260 - 60, 700], [i * 260 - 120, 860], [i * 260 - 40, 1100]], 5); } });
  for (let i = 0; i < 8; i++) { const ph = (t * .8 + i / 8) % 1, x = 100 + i * 240; stroke(spline([[x, 520 - ph * 300], [x + 20, 480 - ph * 300], [x - 10, 440 - ph * 300], [x + 14, 400 - ph * 300]], false), 7, { line: `rgba(255,138,60,${1 - ph})` }); }
  for (const [x, s] of [[520, 1], [1200, .8], [1560, 1.2]]) { const fl = Math.sin(q(t) * 20 + x) * 10; shape(spline([[x - 50 * s, 560], [x - 30 * s, 470 + fl], [x, 400 * 1 + fl], [x + 30 * s, 470 - fl], [x + 50 * s, 560]]), { fill: '#FF8A3C', lw: 6, shade: () => fillOnly(ell(x, 540, 26 * s, 50 * s, 14), '#FFD23F', { boil: .3 }) }); }
  for (let i = 0; i < 6; i++) { const ph = (t * .5 + i / 6) % 1; shape(ell(300 + i * 280 + ph * 400, 300 - ph * 200, 50 + ph * 40, 34 + ph * 26, 14), { fill: 'rgba(233,225,201,.8)', lw: 5 }); }
};
EVS.S50 = (sh, add) => { add('fire', sh.t0, { d: sh.d }); };
SH.S51 = (t, u, sh) => {
  const L = sh.lines[0], popT = L.t0 + L.d * .45;
  cam(960, 540, 1.3); St.street(t, { v: 'storm', dmg: 1, wind: .6, auto: 0 }); deck();
  nova(N(t, { x: 820, y: 975, s: .72, happy: true, mouth: { ...talk('N', t), sm: .9, skew: 0 }, armR: { h: [60, -120], bend: 10, fist: true }, look: [.3, 0] }));
  bunty(B(t, { x: 1090, y: 980, s: .78, face: -1, holdR: 'chai', armR: { h: [50, 40], bend: 30 }, look: [.4, -.4], brow: 1.3, blink: t > popT && t < popT + .1 }));
  if (t < popT) { push(); translate(960, 520); for (let k = 0; k < 3; k++) stroke(arc(0, 0, 20 + k * 16, 20 + k * 16, k + t * 6, k + t * 6 + 4, 14), 6); pop(); }
  else if (t < popT + .3) { const v = P01(t, popT, popT + .3); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; dot(960 + Math.cos(a) * 60 * v, 520 + Math.sin(a) * 60 * v, 6 * (1 - v)); } }
};
EVS.S51 = (sh, add) => { const L = sh.lines[0]; add('pop', L.t0 + L.d * .45); };
SH.S52 = (t, u, sh) => {
  cam(960, 560, 1); St.street(t, { v: 'storm', dmg: 1, wind: .3, auto: 0 });
  const sl = P01(u, 1.0, 2.2), up = ss(P01(u, .4, 1.0));
  bunty(B(t, { x: 1250, y: 1500, s: 2.0, face: -1, look: [-.9, -.3], holdR: 'chai', chaiFull: 1 - sl, armR: { h: [120, 80], bend: 30 } }));
  gloop({ x: 760, y: 1180 - up * 120, s: 1.4 * (1 + up * .2), sq: 1 + up * .25, t, look: [.8, -.6], o: sl > 0 && sl < 1 ? .9 : .3, melt: u > 2.4 ? .8 : 0 });
};
EVS.S52 = (sh, add) => { add('glorp', sh.t0 + .5); add('slurp', sh.t0 + 1.0, { d: 1.2 }); add('squish', sh.t0 + 2.4); };
SH.S53 = (t, u, sh) => {
  cam(960, 540, 1); St.space(t, { col: '#5B4B73', n: 20 });
  shape(rect(-400, 800, 2800, 500), { fill: '#7B5B3A', lw: 7 });
  const v = P01(u, .3, 1.6), x = lerp(-200, 1100, v), y = lerp(100, 700, v);
  if (v < 1) { push(); translate(x, y); rotate(t * 4); for (let k = 0; k < 4; k++) stroke(arc(0, 0, 40 + k * 26, 40 + k * 26, k, k + 3.6, 16), 9, { line: '#E9E1C9' }); pop(); for (let k = 1; k < 5; k++) stroke([[x - k * 90, y - k * 40], [x - k * 90 - 120, y - k * 54]], 6, { line: 'rgba(233,225,201,.6)' }); }
  else for (let i = 0; i < 10; i++) { const p = P01(u, 1.6, 2.6), a = i / 10 * Math.PI; shape(ell(1100 + Math.cos(a) * 200 * p, 760 - Math.sin(a) * 160 * p, 40, 30, 12), { fill: '#E9E1C9', lw: 4, alpha: 1 - p }); }
  St.dino(600, 820, .75, { shock: 1, look: [1, -.4] });
};
EVS.S53 = (sh, add) => { add('whooshBig', sh.t0 + .3); add('boom', sh.t0 + 1.6); };
SH.S54 = (t, u, sh) => {
  cam(960, 540, 1); St.street(t, { v: 'storm', dmg: 1, wind: .6, auto: 0, stall: 0 });
  const rise = ss(P01(u, .5, sh.d));
  shape([[-200, 800 - rise * 380], ...spline([[400, 800 - rise * 400], [1100, 800 - rise * 460], [1700, 800 - rise * 420]], false), [2200, 800 - rise * 380], [2200, 800], [-200, 800]], { fill: '#4A3C5E', lw: 7, shade: () => fillOnly(rect(-200, 790 - rise * 470, 2400, 40), '#E9E1C9', { boil: .6 }) });
  bunty(B(t, { x: 960, y: 1450, s: 2.0, nerv: .9, eyeS: 1.25, pupil: 2.6, cowlick: 1, holdR: 'chai', chaiFull: 0, armR: { h: [60, 40], bend: 30 }, look: [0, -.2], mouth: { ...talk('B', t), o: talk('B', t).o * 1.4 } }));
};
EVS.S54 = (sh, add) => { add('waveRoar', sh.t0 + .5, { d: sh.d, v: .5 }); };
SH.S55 = (t, u, sh) => { cam(960 + u * 120, 540, 1); St.oceanWide(t, { wall: 1 }); };
EVS.S55 = (sh, add) => { add('waveRoar', sh.t0, { d: sh.d + 1 }); };
SH.S56 = (t, u, sh) => {
  cam(960, 520, lerp(.85, .95, u / sh.d), { shake: 5 * P01(u, 0, sh.d), t });
  St.seafront(t, { wave: ss(P01(u, .2, sh.d)) * .9 });
};
EVS.S56 = (sh, add) => { add('waveRoar', sh.t0, { d: sh.d, v: 1.2 }); add('mute', sh.t1 - .05, { d: 1.3 }); };
SH.S57 = (t, u, sh) => { cam(960, 560, lerp(1, 1.06, u / sh.d)); St.oceanWide(t, { ripples: 1 }); };
EVS.S57 = (sh, add) => { add('lapping', sh.t0 + 1.2, { d: sh.d - 1.2 }); };
SH.S58 = (t, u, sh) => {
  const op = sh.t1 - 1.2, rush = P01(t, sh.t1 - .4, sh.t1);
  cam(960, 700, 1.3 * lerp(1, 6, ei(rush)));
  St.street(t, { v: 'storm', dmg: 1, wind: .2, auto: 0 });
  portal(960, 520, 180, t, { open: portalOpen(t, op) });
  deck();
  push(); translate(960, 960); shape(ell(0, 0, 150, 26, 30), { fill: '#3A6EA5', lw: 6, shade: () => { for (let k = 0; k < 3; k++) stroke(arc(0, 0, 30 + k * 34, 6 + k * 6, t * 3 + k, t * 3 + k + 4, 14), 3, { line: '#9fd3ff' }); } }); shape(ell(0, 0, 26, 7, 12), { fill: INK, lw: 4 }); pop();
  nova(N(t, { x: 760, y: 975, s: .72, lean: .25, look: [.6, .9], lid: .4 }));
  bunty(B(t, { x: 1160, y: 980, s: .78, face: -1, lean: .25, look: [.6, .9], holdR: 'chai', chaiFull: 0, armR: { h: [50, 40], bend: 30 } }));
  gloop({ x: 1330, y: 980, s: .4, t, look: [-.8, .6] });
};
EVS.S58 = (sh, add) => { add('drain', sh.t0 + .3, { d: 1.6 }); add('portalOpen', sh.t1 - 1.2); add('whooshBig', sh.t1 - .4); };

// ———————————— CH4 · THE FIRST DAY (frozen dawn) ————————————
SH.S59 = (t, u, sh) => {
  cam(960, 520, 1.0);
  St.street(t, { v: 'frozen', dmg: 1, auto: 0, cowRoof: 1 });
  portal(960, 420, 200, t, { open: 1 - ei(P01(u, .3, .7)) });
  deck();
  const pt = ss(P01(t, le(sh, 0) - 1, le(sh, 0) - .6));
  nova(N(t, { x: 820, y: 975, s: .72, look: [.6, -.6], armR: pt > 0 ? { h: [lerp(16, 120, pt), lerp(188, -150, pt)], bend: 10 } : undefined }));
  bunty(B(t, { x: 1090, y: 980, s: .78, face: -1, holdR: 'chai', chaiFull: 0, armR: { h: [50, 40], bend: 30 }, look: [pt > .5 ? -.2 : -.6, pt > .5 ? -.8 : 0] }));
  gloop({ x: 1260, y: 980, s: .4, t, look: [0, -1] });
};
EVS.S59 = (sh, add) => { add('portalClose', sh.t0 + .4); add('calm', sh.t0); };
SH.S60 = (t, u, sh) => {
  cam(960, 480, lerp(1, 1.08, u / sh.d));
  reset(); screenRect('#FFF3C4'); cam(960, 480, lerp(1, 1.08, u / sh.d)); bands(['#FFF3C4', '#FFF0B8', '#FFE7A6', '#F6D9A8'], -300, 900);
  shape(arc(1500, 860, 160, 160, Math.PI, TAU, 30).concat([[1660, 860]]), { fill: '#FFFFFF', lw: 7 });
  shape(rect(-400, 860, 2800, 400), { fill: '#3A6EA5', lw: 7 });
  // silhouettes looking up (dark flat shapes)
  push(); translate(560, 1100); shape(spline([[-60, 0], [-50, -300], [0, -420], [50, -300], [60, 0]]), { fill: '#3A6EA5', lw: 7 }); shape(ell(0, -470, 50, 60, 20), { fill: '#3A6EA5', lw: 7 }); shape(ell(-6, -560, 36, 34, 18), { fill: '#3A6EA5', lw: 7 }); stroke(arc(-6, -560, 70, 16, Math.PI, TAU, 16), 7); pop();
  push(); translate(820, 1100); shape(spline([[-90, 0], [-80, -200], [0, -250], [80, -200], [90, 0]]), { fill: '#3A6EA5', lw: 7 }); shape(ell(0, -320, 90, 80, 24), { fill: '#3A6EA5', lw: 7 }); shape(noodle([0, -400], [10, -470], 6, 18, 6), { fill: '#3A6EA5', lw: 5 }); pop();
  const bx = lerp(-100, 1300, P01(u, .4, 2.2)), stop = u > 2.2 && u < 3.2;
  if (u < 4.5) { const x = stop ? 1300 : u < 2.2 ? bx : lerp(1300, 2200, P01(u, 3.2, 4.5)); push(); translate(x, 300); shape(ell(0, 0, 26, 18, 12), { fill: INK, lw: 4 }); const wf = stop ? 0 : Math.sin(t * 30) * 20; stroke([[-4, -2], [-30, -14 - wf]], 6); stroke([[4, -2], [30, -14 - wf]], 6); pop(); }
};
EVS.S60 = (sh, add) => { add('chirp', sh.t0 + 2.4, { v: .6 }); add('chirp', sh.t0 + 2.9, { v: .5 }); };
SH.S61 = (t, u, sh) => {
  const L = sh.lines[0], conf = P01(t, L.t0 + L.d * .7, L.t0 + L.d * .9);
  cam(560, 520, 1.25);
  St.bedroom(t, { spin: 1, cal: u * 4, lever: 1, needle: 1 });
  push(); translate(640, 676); rotate(-1.5); bunty(B(t, { x: 0, y: 0, s: .8, maskDown: conf < .5, happy: conf < .5, mouth: { o: 0, sm: conf < .5 ? .8 : -.4 }, armR: conf > .5 ? { h: [60, -170], bend: 10 } : { h: [60, -40], bend: 10 }, look: [.3, -.2], brow: 1.3 })); pop(); St.quiltShape(150, 0);
};
EVS.S61 = (sh, add) => { add('clockSpin', sh.t0, { d: sh.d }); add('calendar', sh.t0 + .3, { d: sh.d - .6 }); };
const stormSpiral = (cx, cy, r, dir, t, open = 0) => { for (let k = 0; k < 3; k++) { const P = []; for (let j = 0; j < 24; j++) { const v = j / 24, a = dir * (v * 5 * (1 - open) + t * 3) + k * TAU / 3; P.push([cx + Math.cos(a) * r * v + (open ? (v - .5) * r * 2 * open : 0), cy + Math.sin(a) * r * v * (1 - open)]); } stroke(P, 7, { line: '#FFF4E0' }); } };
SH.S62 = (t, u, sh) => {
  cam(960, 540, 1); St.space(t, { col: '#1E1A4D' });
  terra({ x: 960, y: 540, R: 330, rot: t * .5, face: 'sleepy', t, arrows: .8 });
  stormSpiral(900, 380, 90, -1, t); stormSpiral(1020, 720, 90, 1, t);
  callout('↺', 700, 330, t, lt(sh, 0) + 1.2, { size: 80, fill: '#FFF4E0' }); callout('↻', 1230, 760, t, lt(sh, 0) + 1.6, { size: 80, fill: '#FFF4E0' });
};
SH.S63 = (t, u, sh) => {
  cam(960, 540, 1); St.space(t, { col: '#1E1A4D' });
  terra({ x: 960, y: 540, R: 330, rot: 1, face: 'shock', t });
  fillOnly(rect(630, 520, 660, 40), 'rgba(255,244,224,.25)', { boil: .3 });
  const op = ss(P01(t, lt(sh, 1), lt(sh, 1) + 1.0));
  stormSpiral(900, 380, 90, -1, t * (1 - op), op); stormSpiral(1020, 720, 90, 1, t * (1 - op), op);
};
EVS.S63 = (sh, add) => { add('boing', lt(sh, 1) + .2, { v: .5 }); add('boing', lt(sh, 1) + .5, { v: .4 }); };
SH.S64 = (t, u, sh) => {
  cam(960, 560, 1); St.space(t, { col: '#1E1A4D' });
  terra({ x: 960, y: 600, R: 300, rot: 1, face: 'worried', t, split: .5 });
  const v = ss(P01(u, .4, 1.6)), P = arc(960, 640, 420, 380, -.4, -.4 - 2.3 * v, 30);
  if (v > 0) { stroke(P, 26); stroke(P, 16, { line: '#FF8A8A' }); const e = P[P.length - 1], d = P[P.length - 2], a = Math.atan2(e[1] - d[1], e[0] - d[0]); push(); translate(e[0], e[1]); rotate(a); shape([[30, 0], [-14, -30], [-14, 30]], { fill: '#FF8A8A', lw: 6 }); pop(); }
  callout('HOT', 1300, 900, t, lt(sh, 0) + .8, { size: 60, fill: '#F59E0B' }); callout('FROZEN', 600, 900, t, lt(sh, 0) + 2.0, { size: 60, fill: '#9fd3ff' });
};
EVS.S64 = (sh, add) => { add('wind', sh.t0 + .4, { d: sh.d - .4, v: .5 }); };
SH.S65 = (t, u, sh) => {
  cam(1560, 380, 1.6);
  St.street(t, { v: 'frozen', dmg: 1, auto: 0, cowRoof: 1 });
  bunty(B(t, { x: 1460, y: 440, s: .7, face: 1, look: [.5, .4], happy: t < lt(sh, 1), armR: { h: [80, 0], bend: 30 }, armL: { h: [60, 10], bend: -20 } }));
  push(); translate(1580, 340); shape(rr(-70, -56, 140, 100, 10), { fill: '#3d3542', lw: 6, shade: () => { fillOnly(rect(-56, -44, 112, 76), '#58B05A', { boil: .3 }); fillOnly(rect(-12, -40, 24, 68), '#E8C88A', { boil: .2 }); } }); pop();
  nova(N(t, { x: 1250, y: 440, s: .6, face: 1, look: [.6, .2], lid: .55, browUp: t > lt(sh, 1) ? .6 : 0, lean: -.05 }));
};
SH.S66 = (t, u, sh) => {
  const k1 = lt(sh, 1) - .1;
  if (t < k1) {
    cam(960, 540, 1); St.space(t, { col: '#1E1A4D' });
    terra({ x: 960, y: 560, R: 230, rot: 1, face: 'none', t });
    stroke(ell(960, 560, 400, 400, 60), 4, { line: 'rgba(255,244,224,.6)' });
    const a = -1.1 + ss(P01(u, .6, sh.d)) * 1.8; St.satellite(960 + Math.cos(a) * 400, 560 + Math.sin(a) * 400, .9, a + Math.PI / 2);
    push(); translate(960 + Math.cos(-1.1) * 235, 560 + Math.sin(-1.1) * 235); rotate(-1.1 + Math.PI / 2); shape(arc(0, 0, 30, 14, 0, Math.PI, 10), { fill: '#E9E6F2', lw: 4 }); pop();
    const dd = ss(P01(u, 1, 2)); stroke([[960 + Math.cos(-1.1) * 250, 560 + Math.sin(-1.1) * 250], [960 + Math.cos(a) * 380, 560 + Math.sin(a) * 380]], 4, { line: `rgba(255,210,63,${1 - dd})` });
  } else {
    cam(1580, 360, 3.0, { shake: shakeAt(t, k1 + .1, 12, .5), t });
    St.street(t, { v: 'frozen', dmg: 1, auto: 0 });
    push(); translate(1580, 340); shape(rr(-70, -56, 140, 100, 10), { fill: '#3d3542', lw: 6, shade: () => { for (let k = 0; k < 8; k++) fillOnly(rect(-56, -44 + k * 10, 112, 5), hash(k + Math.floor(t * 24)) > .5 ? '#E9E6F2' : '#8d96a3', { boil: 0 }); } }); pop();
    bunty(B(t, { x: 1460, y: 440, s: .7, face: 1, look: [.3, -.2], eyeS: 1.2, cowlick: 1, nerv: .8, mouth: { ...talk('B', t), o: talk('B', t).o * 1.5 }, armR: { h: [80, -120], bend: 20 }, armL: { h: [60, -130], bend: -20 } }));
  }
};
EVS.S66 = (sh, add) => { add('blip', sh.t0 + 1.0); add('static', lt(sh, 1) - .1, { d: 1.6 }); };
SH.S67 = (t, u, sh) => {
  cam(960, 540, 1); St.space(t, {});
  const loose = ss(P01(t, lt(sh, 1), lt(sh, 1) + 1));
  terra({ x: 960, y: 560, R: 300, rot: 1, face: 'worried', t, bulge: .13 });
  push(); translate(960, 560); scale(1.13, 1); stroke(ell(0, 0, 320 + Math.sin(t * 14) * 8 * loose, 60 + Math.sin(t * 11) * 10 * loose, 40), 16, { line: 'rgba(46,127,209,.85)' }); pop();
  push(); translate(960, 560); const w = 300 * 1.13 + loose * 20;
  shape([...arc(0, 0, w + 8, 40, 0, Math.PI, 30), ...arc(0, 0, w + 8, 20, Math.PI, 0, 30)], { fill: '#FFD23F', lw: 5, shade: () => { for (let k = 0; k < 24; k++) { const x = -w + k * w / 12; stroke([[x, 18], [x, 34]], 3); } } });
  pop();
};
EVS.S67 = (sh, add) => { add('tape', sh.t0 + .3); add('slosh', lt(sh, 1) + .4, { v: .6 }); };
SH.S68 = (t, u, sh) => {
  cam(960, 560, 1); St.space(t, { col: '#2B2366', n: 30 });
  shape([[-200, 1100], [-200, 860], ...spline([[100, 860], [600, 700], [960, 470], [1320, 700], [1820, 860]], false), [2200, 860], [2200, 1100]], { fill: '#8C6E4E', lw: 8 });
  const v = ss(P01(t, lt(sh, 1) - .2, sh.t1));
  for (const s of [-1, 1]) { const x0 = 960 + s * lerp(140, 700, v); shape(spline([[x0 - 120, 720 + lerp(-180, 110, v) * 1], [x0 + 120, 720 + lerp(-180, 120, v)], [x0 + 100 * s, 760 + lerp(-160, 120, v)], [x0 - 100 * s, 760 + lerp(-160, 120, v)]]), { fill: C.ocean, lw: 6 }); }
  nova(N(t, { x: 960, y: 480, s: .3, look: [0, .5] }));
  callout('EQUATOR', 960, 980, t, lt(sh, 0) + 1, { size: 50, fill: '#FFF4E0' });
  callout('POLE', 140, 980, t, lt(sh, 0) + 1.3, { size: 46, fill: '#9fd3ff' }); callout('POLE', 1780, 980, t, lt(sh, 0) + 1.3, { size: 46, fill: '#9fd3ff', id: 'pole2' });
};
EVS.S68 = (sh, add) => { add('slide', lt(sh, 1), { d: 1.5 }); };
SH.S69 = (t, u, sh) => {
  cam(960, 560, 1); reset(); screenRect('#FFF3C4'); cam(960, 560, 1);
  for (let k = 0; k < 8; k++) for (let j = 0; j < 5; j++) stroke(rect(k * 260 - 40, j * 220 - 40, 260, 220), 3, { line: '#E8D8A8', closed: true });
  const v = ss(P01(u, .3, 1.8));
  shape(rr(260, 520, 1400, 400, 160), { fill: '#FFFFFF', lw: 8, shade: () => { fillOnly(spline([[260, 900], [700, 860], [960, 700], [1220, 860], [1660, 900], [1660, 1000], [260, 1000]]), '#E9E6F2', { boil: .3 }); for (const s of [-1, 1]) fillOnly(rect(960 + s * lerp(100, 520, v) - 200, lerp(700, 800, v), 400, 400), '#9fd3ff', { boil: .4 }); } });
  stroke(arc(960, 520, 700, 40, Math.PI, TAU, 30), 8);
  const gx = lerp(960, 600, ss(P01(u, .8, 1.8))), gy = lerp(660, 780, ss(P01(u, .8, 1.8)));
  gloop({ x: gx, y: gy, s: .55, t, sq: landSq(t, sh.t0 + 1.8), look: [-.4, .3], o: .6 });
  push(); translate(lerp(1000, 1380, ss(P01(u, .9, 1.9))), lerp(640, 760, ss(P01(u, .9, 1.9)))); shape(ell(0, 0, 50, 34, 18), { fill: '#FFD23F', lw: 6 }); shape(ell(30, -40, 28, 26, 14), { fill: '#FFD23F', lw: 6 }); shape([[52, -40], [80, -34], [52, -28]], { fill: '#F7B32B', lw: 4 }); dot(34, -46, 4); pop();
};
EVS.S69 = (sh, add) => { add('drain', sh.t0 + .3, { d: 1.5 }); add('glorp', sh.t0 + 1.8); add('squeak', sh.t0 + 1.9); };
SH.S70 = (t, u, sh) => {
  cam(960, 540, lerp(1, 1.1, u / sh.d)); St.space(t, {});
  const v = ss(P01(u, .2, sh.d));
  terra({ x: 960, y: 540, R: 330, rot: 1 + u * .05, face: 'thirsty', t, drain: .2 + v * .7 });
  for (let i = 0; i < 6; i++) { const ph = (t * .7 + i / 6) % 1, x = 760 + (i % 3) * 200; for (const s of [-1, 1]) { const y = 540 + s * (60 + ph * 200); push(); translate(x, y); rotate(s > 0 ? Math.PI / 2 : -Math.PI / 2); shape([[-20, -8], [14, -8], [14, -18], [34, 0], [14, 18], [14, 8], [-20, 8]], { fill: '#9fd3ff', lw: 4, alpha: 1 - ph }); pop(); } }
};
EVS.S70 = (sh, add) => { add('gurgle', sh.t0 + .3, { d: sh.d - .5 }); };
SH.S71 = (t, u, sh) => {
  const set = P01(t, le(sh, 1) - .6, sh.t1 - .6), dk = Math.floor(set * 3) / 3;
  cam(960, 520, 1.0);
  St.street(t, { v: set > .66 ? 'night' : 'frozen', dmg: 1, auto: 0, cowRoof: 1, sunX: 1640, sunY: 640 + ss(set) * 260, dark: set > .66 ? 0 : dk * .5 });
  deck();
  nova(N(t, { x: 820, y: 975, s: .72, look: [.6, -.2], lid: .5 }));
  bunty(B(t, { x: 1090, y: 980, s: .78, face: 1, look: [.7, -.2], holdR: 'chai', chaiFull: 0, armR: { h: [50, 40], bend: 30 }, brow: .8 }));
  if (t > sh.t1 - .6) { reset(); screenRect('#000'); }
};
EVS.S71 = (sh, add) => { const s0 = le(sh, 1) - .6; [0, .6, 1.2].forEach(d => add('dim', s0 + d)); add('mute', sh.t1 - .6, { d: 1.8 }); };
SH.S72 = (t, u, sh) => {
  const rise = ss(P01(t, sh.t0 + .3, sh.t1));
  cam(lerp(860, 760, rise), 540, 1.05);
  St.street(t, { v: 'night', dmg: 1, auto: 0, cowRoof: 1, snow: 1, sunLeft: 1 });
  // the sun peeking up on the LEFT horizon
  shape(arc(250, 790 - rise * 60, 110, 110, Math.PI, TAU, 24).concat([[360, 790 - rise * 60]]), { fill: '#FFF3C4', lw: 6 });
  fillOnly(rect(-1600, 790, 4000, 400), '#1E2C5A', { boil: 0 }); stroke([[-1600, 790], [3600, 790]], 6);
  deck();
  const turn = ss(P01(t, lt(sh, 0) - .6, lt(sh, 0)));
  bunty(B(t, { x: 1090, y: 980, s: .78, face: turn > .5 ? -1 : 1, blanket: 1, look: [.7, -.2], mouth: { o: turn > .5 ? .7 : 0, w: .7, sm: -.5 } }));
  nova(N(t, { x: 820, y: 975, s: .72, face: -1, look: [.5, -.2], lid: .5 }));
  callout('W', 250, 600, t, lt(sh, 0) + .4, { size: 80, fill: '#FFF3C4' });
};
EVS.S72 = (sh, add) => { add('mute', sh.t0, { d: lt(sh, 0) - sh.t0 }); add('chime', lt(sh, 0) - .2); add('windHush', sh.t0, { d: sh.d }); };
SH.S73 = (t, u, sh) => {
  cam(960, 540, 1); St.space(t, { col: '#101A3D' });
  St.bigSun(960, 540, 90, t);
  stroke(ell(960, 540, 380, 380, 60), 5, { line: 'rgba(255,244,224,.5)', closed: true });
  const a = -Math.PI / 2 + ss(P01(u, .3, sh.d - .3)) * TAU * .85;
  for (const k of [0, 1, 2, 3]) { const b = -Math.PI / 2 + k * Math.PI / 2; if (Math.abs(b - a) > .2 && b < a) { push(); translate(960 + Math.cos(b) * 380, 540 + Math.sin(b) * 380); g.globalAlpha = .4; terra({ x: 0, y: 0, R: 50, rot: 1, face: 'none', t }); g.globalAlpha = 1; pop(); } }
  const x = 960 + Math.cos(a) * 380, y = 540 + Math.sin(a) * 380;
  terra({ x, y, R: 70, rot: 1, face: 'none', t });
  push(); translate(x, y); shape(spline([[0, -100], [-14, -76], [0, -70], [14, -76]]), { fill: '#E23B3B', lw: 5 }); stroke([[0, -70], [0, -40]], 5); pop();
};
SH.S74 = (t, u, sh) => {
  const op = sh.t1 - 1.0, rush = P01(t, sh.t1 - .4, sh.t1);
  cam(760, 600, .9 * lerp(1, 6, ei(rush)));
  St.street(t, { v: 'night', dmg: 1, auto: 0, cowRoof: 1, snow: 1 });
  shape(arc(250, 730, 110, 110, Math.PI, TAU, 24).concat([[360, 730]]), { fill: '#FFF3C4', lw: 6 });
  fillOnly(rect(-1600, 790, 4000, 400), '#1E2C5A', { boil: 0 }); stroke([[-1600, 790], [3600, 790]], 6);
  portal(960, 440, 180, t, { open: portalOpen(t, op) });
  deck();
  bunty(B(t, { x: 1090, y: 980, s: .78, face: -1, blanket: 1, look: [.7, -.2], blink: false, mouth: { o: .5, w: .6, sm: -.4 } }));
  nova(N(t, { x: 820, y: 975, s: .72, face: -1, look: [.5, -.2], lid: .5 }));
};
EVS.S74 = (sh, add) => { add('mute', le(sh, 0), { d: sh.t1 - le(sh, 0) - 1.1 }); add('portalOpen', sh.t1 - 1.0); add('whooshBig', sh.t1 - .4); };

// ———————————— CH5 · THE FIRST YEAR ————————————
SH.S75 = (t, u, sh) => {
  cam(960, 540, 1); St.space(t, { col: '#2E2148' });
  terra({ x: 960, y: 560, R: 330, rot: 1, face: 'worried', t, split: .5 + u * .01, splitHot: 1 });
  callout('1 DAY = 1 YEAR', 960, 970, t, sh.t0 + .5, { size: 64, fill: '#FF8A8A' });
};
EVS.S75 = (sh, add) => { add('chatter', sh.t0 + 1, { d: 1.2, v: .4 }); };
SH.S76 = (t, u, sh) => {
  reset(); screenRect('#000');
  const half = (x0, draw) => { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.beginPath(); g.rect(x0, 0, 955, 1080); g.clip(); draw(); g.restore(); };
  half(0, () => { cam(960 + 480, 520, 1); St.street(t, { v: 'hot', dmg: 1, auto: 0, sunX: 1440, sunY: 260 }); });
  half(965, () => { cam(960 - 480, 520, 1); St.street(t, { v: 'night', dmg: 1, auto: 0, snow: 1 }); });
  reset(); fillOnly(rect(955, 0, 10, 1080), INK, { boil: 0 });
  callout('6 months', 480, 140, t, lt(sh, 0) + .3, { size: 60, fill: '#F59E0B' }); callout('6 months', 1440, 140, t, lt(sh, 0) + 1.1, { size: 60, fill: '#9fd3ff', id: '6m2' });
};
SH.S77 = (t, u, sh) => {
  cam(1090, 640, 2.2); St.twilightPlain(t, {}); deck();
  bunty(B(t, { x: 1090, y: 980, s: .78, face: -1, blanket: 1, holdR: 'chai', chaiFull: 0, armR: { h: [50, 40], bend: 30 }, nerv: .5, look: [-.3, -.2], brow: 1.4, cowlick: .4 }));
  for (let k = 0; k < 3; k++) { const ph = (t * .8 + k / 3) % 1; shape(ell(990 - ph * 60, 640 - ph * 60, 14 + ph * 20, 10 + ph * 14, 12), { fill: 'rgba(255,255,255,.7)', lw: 3, alpha: 1 - ph }); }
};
EVS.S77 = (sh, add) => { add('chatter', sh.t0 + .2, { d: sh.d - .4, v: .5 }); };
SH.S78 = (t, u, sh) => {
  cam(960, 540, 1); reset(); screenRect('#F59E0B'); cam(960, 540, 1);
  bands(['#F59E0B', '#E97A1A', '#F59E0B'], -100, 520);
  shape(ell(1500, 200, 110, 110, 40), { fill: '#FFFFFF', lw: 7 });
  const cr = P01(u, .2, sh.d);
  shape(rect(-200, 520, 2400, 700), { fill: '#C2410C', lw: 7, shade: () => { for (let i = 0; i < 12; i++) { const x = (i % 4) * 520 - 100, y = 560 + Math.floor(i / 4) * 180; stroke([[x, y], [x + 120 * cr, y + 60], [x + 80 * cr, y + 140 * cr]], 5); } } });
  const dr = Math.floor(P01(u, .5, sh.d - .3) * 3) / 3;
  push(); translate(700, 560); shape(noodle([0, 0], [40, -320], -30, 34, 22), { fill: '#8C6E4E', lw: 6 }); for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * .6 + dr * 1.2 * Math.sign(k - 2 + .1); shape(noodle([40, -320], [40 + Math.cos(a) * 160, -320 + Math.sin(a) * 100 + 40 + dr * 120], 30, 32, 6), { fill: dr > .6 ? '#A88F58' : '#8A8A3A', lw: 5 }); } pop();
  for (let i = 0; i < 6; i++) { const ph = (t * .8 + i / 6) % 1, x = 200 + i * 300; stroke(spline([[x, 520 - ph * 300], [x + 20, 480 - ph * 300], [x - 10, 440 - ph * 300]], false), 6, { line: `rgba(255,243,196,${1 - ph})` }); }
};
EVS.S78 = (sh, add) => { add('heat', sh.t0, { d: sh.d }); };
SH.S79 = (t, u, sh) => {
  cam(1300, 420, 1.4); St.street(t, { v: 'night', dmg: 1, auto: 0, snow: 1, cowRoof: 1 });
  const drop = P01(u, 2.0, 2.5);
  if (drop > 0 && drop < 1) shape([[1300 - 8, 520 + drop * 260], [1300 + 8, 520 + drop * 260], [1300, 560 + drop * 260]], { fill: '#DFF3FF', lw: 4 });
};
EVS.S79 = (sh, add) => { add('icyWind', sh.t0, { d: sh.d }); add('icicle', sh.t0 + 2.5); add('moo', sh.t0 + .8, { v: .4 }); };
SH.S80 = (t, u, sh) => {
  cam(960, 540, 1); reset(); screenRect('#101A3D'); cam(960, 540, 1); St.stars(t, { n: 30, seed: 9 });
  shape(rect(-200, 760, 2400, 500), { fill: '#24305C', lw: 7 });
  const st = Math.floor(P01(u, .2, sh.d - .6) * 3 - 1e-6);
  [480, 960, 1440].forEach((x, i) => {
    const on = i <= st, kind = i;
    push(); translate(x, 760); shape([[-90, -160], [90, -160], [70, 0], [-70, 0]], { fill: '#C9663C', lw: 7 }); shape(rr(-100, -180, 200, 30, 8), { fill: '#A4502E', lw: 6 });
    if (on || i === 0) {
      const col = kind === 0 ? '#58B05A' : kind === 1 ? '#8A9A4A' : '#8d8d8d', droop = kind * .6;
      stroke(spline([[0, -170], [10, -260], [-10, -340]], false), 7, { line: col });
      if (kind < 2) for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * .55 + droop * Math.sign(k - 2 + .1) * .6; shape(spline([[0, -200 - k * 30], [Math.cos(a) * 70, -200 - k * 30 + Math.sin(a) * 30 + droop * 40], [Math.cos(a) * 30, -200 - k * 30 + 14]]), { fill: col, lw: 5 }); }
    }
    pop();
  });
};
SH.S81 = (t, u, sh) => { cam(960, 540, 1); St.space(t, {}); terra({ x: 960, y: 540 + Math.sin(u * .8) * 40, R: 360, rot: t * .1, mode: 'new', face: 'shock', t }); };
SH.S82 = (t, u, sh) => { cam(960, 540, lerp(1, 1.08, u / sh.d)); St.space(t, {}); terra({ x: 960, y: 540, R: 360, rot: t * .6, mode: 'new', face: 'happy', t }); };
SH.S83 = (t, u, sh) => {
  const L = sh.lines[0], off = L.t0 + L.d * .55;
  cam(960, 560, 1.3); reset(); screenRect('#F6E7C1'); cam(960, 560, 1.3);
  bands(['#FFFFFF', '#F3F6FA', '#E8EEF4'], -200, 760);
  shape(rect(-400, 760, 2800, 500), { fill: '#D9C7A3', lw: 7 });
  const huff = Math.sin(q(t) * 14);
  bunty(B(t, { x: 820, y: 900, s: .8, nerv: .5, sweat: u, look: [.5, -.3], lean: .1, mouth: { o: .5 + .3 * huff, w: .7, sm: -.5 }, mouthS: 1.1 + huff * .05, sq: 1 + huff * .02 }));
  nova(N(t, { x: 1150, y: 900, s: .72, face: -1, lid: .6, look: [.4, 0], holdR: t > off ? 'mask' : null, armR: t > off ? { h: [-130, 50], bend: 20 } : undefined }));
};
EVS.S83 = (sh, add) => { add('wheeze', sh.t0 + .3, { d: sh.d - .6, v: .5 }); };
SH.S84 = (t, u, sh) => {
  cam(lerp(900, 980, u / sh.d), 600, .95); St.twilightPlain(t, {});
  nova(N(t, { x: 820, y: 880, s: .45, look: [.6, -.2] }));
  bunty(B(t, { x: 960, y: 885, s: .5, look: [.6, -.3], blanket: 1 }));
  gloop({ x: 1080, y: 885, s: .28, t });
};
EVS.S84 = (sh, add) => { add('breeze', sh.t0, { d: sh.d }); };
SH.S85 = (t, u, sh) => {
  cam(960, 540, 1); St.space(t, { col: '#2E2148' });
  terra({ x: 960, y: 540, R: 360, rot: 1, mode: 'new', face: 'none', t, split: .45 + ss(P01(u, .5, sh.d)) * .15 });
  const x = 960 + lerp(-.1, -.4, 1 - ss(P01(u, .5, sh.d))) * 0;
  push(); translate(1140, 180); shape([[-60, -12], [40, -12], [40, -30], [90, 0], [40, 30], [40, 12], [-60, 12]], { fill: '#FF8A8A', lw: 5 }); pop();
  callout('EAST →', 1140, 110, t, sh.t0 + .3, { size: 50, fill: '#FF8A8A' });
};
SH.S86 = (t, u, sh) => {
  const tq = q(t), dx = u * 160;
  cam(960 + dx, 600, 1); St.twilightPlain(t, { sunX: 2400 + dx });
  fillOnly(rect(-1600 + dx * 0, 700, 1300 + dx * .95 + 520, 400), 'rgba(16,26,61,.55)', { boil: .3 });
  bunty(B(t, { x: 900 + dx, y: 940, s: .8, blanket: 1, legL: walkLegs(tq, true)[0], legR: walkLegs(tq, true)[1], look: [-.6, 0], nerv: .3 }));
  callout('4.6 km/h', 1500, 220, t, lt(sh, 0) + 1.8, { size: 76, fill: '#FFB627' });
};
EVS.S86 = (sh, add) => { add('steps', sh.t0, { d: sh.d }); };
SH.S87 = (t, u, sh) => {
  const tq = q(t);
  cam(960 + u * 40, 620, .8); St.twilightPlain(t, { sunX: 2000 });
  for (let i = 0; i < 12; i++) { const x = -400 + i * 190 + u * 40, y = 860 + (i % 3) * 30, s = .32 + (i % 3) * .04; if (i === 6) { nova(N(t, { x, y, s, legL: walkLegs(tq + i, true, 14)[0], legR: walkLegs(tq + i, true, 14)[1] })); continue; } if (i === 7) { bunty(B(t, { x, y, s: s * 1.1, blanket: 1, legL: walkLegs(tq + i, true, 14)[0], legR: walkLegs(tq + i, true, 14)[1] })); continue; }
    push(); translate(x, y); scale(s); const b = Math.abs(Math.sin(tq * 6 + i)) * 10; shape(ell(0, -360 - b, 40, 44, 16), { fill: '#3A2B5E', lw: 7 }); shape(rr(-50, -320 - b, 100, 200, 30), { fill: '#3A2B5E', lw: 7 }); for (const s_ of [-1, 1]) shape(noodle([s_ * 20, -130 - b], [s_ * 20 + Math.sin(tq * 6 + i) * 30 * s_, 0], 0, 30, 26), { fill: '#3A2B5E', lw: 6 }); if (i % 4 === 1) { shape(rr(60, -160, 140, 90, 10), { fill: '#5E3A62', lw: 6 }); shape(ell(100, -60, 26, 26, 12), { fill: '#3A2B5E', lw: 5 }); } pop(); }
};
EVS.S87 = (sh, add) => { add('steps', sh.t0, { d: sh.d, v: 1.3 }); add('creak', sh.t0 + 1.2, { v: .5 }); };
SH.S88 = (t, u, sh) => {
  const tq = q(t), stop = lt(sh, 1) + .9, catchup = sh.t1 - .8;
  cam(960 + u * 60, 600, 1.4); St.twilightPlain(t, { sunX: 2200 + u * 60 });
  nova(N(t, { x: 1050 + u * 60, y: 940, s: .7, legL: walkLegs(tq, true)[0], legR: walkLegs(tq, true)[1], look: [.6, 0], lid: .55 }));
  const bs = t < stop ? u * 60 : t < catchup ? (stop - sh.t0) * 60 : (stop - sh.t0) * 60 + (t - catchup) * 260;
  const walking = t < stop || t > catchup;
  bunty(B(t, { x: 760 + bs, y: 945, s: .72, blanket: 1, legL: walkLegs(tq, walking)[0], legR: walkLegs(tq, walking)[1], look: [.6, -.2], eyeS: t > stop ? 1.15 : 1, brow: 1.4 }));
};
EVS.S88 = (sh, add) => { add('steps', sh.t0, { d: lt(sh, 1) + .9 - sh.t0 }); add('mute', le(sh, 1), { d: 1.0 }); add('steps', sh.t1 - .8, { d: .8, v: 1.4 }); };
const field = (t, fade) => { push(); translate(960, 560); for (let k = 1; k <= 4; k++) { const r = 360 * (1 + k * .32); const a = clamp(fade * 4 - (4 - k), 0, 1); if (a <= 0) continue; g.globalAlpha = a; stroke(arc(-r * .46, 0, r * .58, r * .82, -Math.PI / 2, Math.PI / 2, 26), 7, { line: '#C9C3E6' }); stroke(arc(r * .46, 0, r * .58, r * .82, Math.PI / 2, Math.PI * 1.5, 26), 7, { line: '#C9C3E6' }); g.globalAlpha = 1; } pop(); };
SH.S89 = (t, u, sh) => { cam(960, 560, .9); St.space(t, { col: '#101A3D' }); field(t, 1); terra({ x: 960, y: 560, R: 300, rot: 1, mode: 'new', face: 'sleepy', t }); };
SH.S90 = (t, u, sh) => { cam(960, 560, lerp(.9, 1, u / sh.d)); St.space(t, { col: '#101A3D' }); const f = 1 - ss(P01(u, .3, sh.d)) * .85; field(t, Math.floor(f * 8) / 8 + (Math.floor(t * 12) % 2 ? .05 : 0)); terra({ x: 960, y: 560, R: 300, rot: 1, mode: 'new', face: 'worried', t, look: [0, -.8] }); };
EVS.S90 = (sh, add) => { add('dim', sh.t0 + .8); add('dim', sh.t0 + 1.6); add('lowHit', le(sh, 0) - .2, { v: .6 }); };
SH.S91 = (t, u, sh) => {
  const L = sh.lines[0], f = x => L.t0 + L.d * x;
  reset(); screenRect('#000');
  const panel = (i, draw) => { const x0 = i * 640 + (i ? 4 : 0); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.beginPath(); g.rect(x0, 0, 632, 1080); g.clip(); draw(x0); g.restore(); };
  if (t > f(.3)) panel(0, x0 => { cam(960 - x0 + 640 - 320, 620, 1); St.twilightPlain(t, {}); for (let i = 0; i < 4; i++) { push(); translate(800 + i * 120 + u * 40, 860 + (i % 2) * 30); shape(ell(0, -60, 60, 36, 16), { fill: '#A4502E', lw: 6 }); shape(noodle([40, -80], [70, -150], 0, 20, 14), { fill: '#A4502E', lw: 5 }); shape(ell(80, -160, 24, 18, 12), { fill: '#A4502E', lw: 5 }); for (const lx of [-30, 30]) shape(rr(lx - 8, -40, 16, 40, 6), { fill: '#A4502E', lw: 4 }); pop(); } });
  if (t > f(.55)) panel(1, x0 => { reset(); screenRect('#24305C'); cam(320, 620, 1); shape(ell(320, 900, 300, 200, 30), { fill: '#F4F1E8', lw: 7 }); shape(ell(320, 860, 150, 90, 24), { fill: '#3A2A20', lw: 7 }); shape(ell(250, 820, 120, 80, 24), { fill: '#7A5230', lw: 7 }); eye(220, 810, 14, 10, { closed: true, lw: 5 }); for (let k = 0; k < 3; k++) { const ph = (t * .6 + k / 3) % 1; text('z', 380 + ph * 60, 700 - ph * 120, { font: '800 50px "Baloo 2"', fill: '#fff', outlineW: 6 }); } });
  if (t > f(.8)) panel(2, x0 => { reset(); screenRect('#5E3A62'); cam(320, 620, 1); shape(rect(-200, 820, 1200, 400), { fill: '#8E4E7A', lw: 7 }); shape(ell(320, 830, 110, 40, 20), { fill: '#3A2B5E', lw: 6 }); const up = back(P01(t, f(.8), f(.8) + .4), 2); push(); translate(320, 830 - 60 * up); shape(ell(0, 0, 60, 60, 20), { fill: '#7A6E80', lw: 6 }); dot(-18, -10, 6); dot(18, -10, 6); shape(ell(0, 14, 14, 10, 10), { fill: '#FF8FC8', lw: 4 }); pop(); });
  reset(); for (const x of [636, 1280]) fillOnly(rect(x - 4, 0, 8, 1080), INK, { boil: 0 });
};
EVS.S91 = (sh, add) => { const L = sh.lines[0]; [.3, .55, .8].forEach(x => add('pop', L.t0 + L.d * x)); add('snore', L.t0 + L.d * .6, { d: 1.6, v: .5 }); };
SH.S92 = (t, u, sh) => {
  const k = le(sh, 0) - .4, lie = ss(P01(t, k - .6, k)), pull = ss(P01(t, sh.t1 - .7, sh.t1 - .3));
  cam(960, 640, 1.3); St.street(t, { v: 'night', dmg: 1, auto: 0, snow: 1, stall: 0 });
  shape(ell(760, 980, 220, 90, 30), { fill: '#F4F1E8', lw: 7 });
  gloop({ x: 760, y: 970, s: .55, t, mask: 1, melt: .5 });
  const sn = (t * .7) % 1; shape(ell(840 + sn * 30, 820 - sn * 40, 16 + sn * 26, 14 + sn * 22, 14), { fill: 'rgba(255,255,255,.6)', lw: 4 });
  push(); translate(lerp(1080, 1000, lie), 980); rotate(lerp(0, -1.4, lie * (1 - pull))); bunty(B(t, { x: 0, y: 0, s: .72, blanket: 1, happy: lie > .5 && pull < .5, maskDown: lie > .8 && pull < .5, mouth: { ...talk('B', t), sm: .5 } })); pop();
  if (pull > 0 || t > sh.t1 - 1.2) nova(N(t, { x: 1350 - (1 - ss(P01(t, sh.t1 - 1.2, sh.t1 - .8))) * 400, y: 975, s: .72, face: -1, lid: .6, armR: { h: [-160, 20], bend: 10, fist: true } }));
};
EVS.S92 = (sh, add) => { add('snore', sh.t0 + .2, { d: sh.d - .4, v: .6 }); add('cloth', sh.t1 - .7); };
SH.S93 = (t, u, sh) => {
  cam(960, 560, 1.3); St.twilightPlain(t, {}); deck();
  nova(N(t, { x: 880, y: 975, s: .72, holdR: 'remote', armR: { h: [80, 40], bend: 30, ra: Math.sin(q(t) * 6) * .3 }, look: [.5, .2], lid: .5 }));
  bunty(B(t, { x: 1120, y: 980, s: .78, face: -1, blanket: 1, nerv: .5, armR: { h: [-30, -110], bend: 20 }, armL: { h: [-10, -110], bend: -20 }, look: [.5, 0] }));
};
EVS.S93 = (sh, add) => { add('dialClick', sh.t0 + .5, { d: 1.6 }); };
SH.S94 = (t, u, sh) => {
  const op = sh.t0 + .45, rush = P01(t, sh.t1 - .4, sh.t1);
  cam(900, 520, 1.5 * lerp(1, 6, ei(rush)));
  St.twilightPlain(t, {});
  portal(980, 500, 260, t, { open: portalOpen(t, op) });
  deck();
  nova(N(t, { x: 820, y: 975, s: .72, happy: true, mouth: { ...talk('N', t), sm: .9, skew: 0 }, look: [.4, 0] }));
};
EVS.S94 = (sh, add) => { add('portalOpen', sh.t0 + .45); add('whooshBig', sh.t1 - .4); };
