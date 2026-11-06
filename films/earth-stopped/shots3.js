// shots3.js — Ch6 (1,000 Years Later), Ch7 (The Twist), the cliffhanger
import { clamp, lerp, seg, ss, eo, ei, back, hash, TAU } from '/core/lib.js';
import { W, H, INK, g, push, pop, translate, rotate, scale, reset, shape, fillOnly, stroke, ell, arc, spline, rr, rect, quad, noodle, dot, text, screenRect, bands } from './toon.js';
import { C, nova, bunty, gloop, terra, moon, chai, spinBrake, hand, remote, tumbler, star4, eye, mouth } from './chars.js';
import * as St from './sets.js';
import { R, cam, shakeAt, talk, N, B, walkLegs, landSq, popIn, portal, portalOpen, callout, lt, le, P01, q } from './rig.js';
export const SH = {}, EVS = {};
const deck = (x = 960, y = 960, s = .9) => St.platform(x, y, s, { w: 560 });
const FL = 900;
const tape = (w, k = 1) => shape([...arc(0, 0, w + 8, 40 * k, 0, Math.PI, 30), ...arc(0, 0, w + 8, 20 * k, Math.PI, 0, 30)], { fill: '#FFD23F', lw: 5, shade: () => { for (let i = 0; i < 24; i++) { const x = -w + i * w / 12; stroke([[x, 18], [x, 34]], 3); } } });
function planet(x, y, R_, col, colS, face, t, o = {}) {
  push(); translate(x, y);
  shape(ell(0, 0, R_, R_, 50), { fill: col, lw: 8, shade: () => { fillOnly(spline([[R_ * .3, -R_ * 1.1], [R_ * 1.2, -R_ * .2], [R_ * 1.1, R_ * 1.1], [-R_ * .4, R_ * 1.2], [R_ * .55, R_ * .4]]), colS, { boil: .3 }); if (o.bands) for (let k = 0; k < 4; k++) fillOnly(rect(-R_, -R_ * .6 + k * R_ * .35, R_ * 2, R_ * .12), colS, { boil: .4 }); if (o.craters) for (const [cx, cy, r] of [[-.4, -.3, .16], [.3, .4, .12], [-.3, .5, .1]]) fillOnly(ell(cx * R_, cy * R_, r * R_, r * R_, 12), colS, { boil: .3 }); } });
  const s = R_ / 120; push(); scale(s);
  const sk = col, lk = o.look || [0, 0];
  if (face === 'slow') { const b = (Math.sin(t * 1.2) + 1) / 2; eye(-32, -6, 20, 22, { lw: 5, skin: sk, lid: .45 + b * .5, look: lk }); eye(32, -6, 20, 22, { lw: 5, skin: sk, lid: .45 + b * .5, look: lk }); mouth(0, 40, 30, { sm: .1, lw: 5 }); }
  else if (face === 'smug') { eye(-32, -6, 20, 22, { lw: 5, skin: sk, lid: .5, look: [.5, 0] }); eye(32, -6, 20, 22, { lw: 5, skin: sk, lid: .5, look: [.5, 0] }); mouth(0, 40, 34, { sm: .6, skew: .6, lw: 5 }); }
  else if (face === 'sad') { eye(-32, -6, 20, 22, { lw: 5, skin: sk, lid: .3, look: [0, .5] }); eye(32, -6, 20, 22, { lw: 5, skin: sk, lid: .3, look: [0, .5] }); mouth(0, 42, 30, { sm: -.8, lw: 5 }); }
  else if (face === 'shock') { eye(-32, -6, 22, 24, { lw: 5, skin: sk, pupil: 3 }); eye(32, -6, 22, 24, { lw: 5, skin: sk, pupil: 3 }); mouth(0, 44, 24, { o: .8, w: .7, lw: 5 }); }
  pop(); pop();
}

// ———————————— CH6 · 1,000 YEARS LATER ————————————
SH.S95 = (t, u, sh) => {
  cam(960, 540, lerp(1.2, .95, ss(P01(u, .2, sh.d))));
  St.newEarth(t, {});
  portal(960, 420, 200, t, { open: 1 - ei(P01(u, .3, .7)) });
  deck();
  nova(N(t, { x: 860, y: 975, s: .72, armR: { h: [150, -60], bend: 10 }, armL: { h: [-150, -60], bend: -10 }, look: [.2, -.2], lid: .4 }));
  bunty(B(t, { x: 1110, y: 980, s: .78, face: -1, holdR: 'chai', chaiFull: 0, armR: { h: [50, 40], bend: 30 }, look: [-.3, -.4], eyeS: 1.15 }));
  gloop({ x: 1290, y: 980, s: .4, t, look: [-.4, -.6] });
};
EVS.S95 = (sh, add) => { add('portalClose', sh.t0 + .4); add('thinWind', sh.t0, { d: sh.d }); };
SH.S96 = (t, u, sh) => { cam(lerp(700, 1200, ss(u / sh.d)), 520, .9); St.seafront(t, { dry: 1 }); const tw = (u * 260) % 2600; push(); translate(-300 + tw, 960); rotate(u * 4); stroke(ell(0, 0, 40, 40, 16), 5, { line: '#A88F58' }); stroke([[-30, -20], [30, 20]], 4, { line: '#A88F58' }); pop(); };
EVS.S96 = (sh, add) => { add('thinWind', sh.t0, { d: sh.d }); };
SH.S97 = (t, u, sh) => {
  cam(960, 560, 1.2); St.newEarth(t, {});
  const n = Math.min(6, Math.floor(P01(u, .3, 2.2) * 6) + (u > .3 ? 1 : 0));
  bunty(B(t, { x: 960, y: 900, s: .8, look: [0, .3], eyeS: 1.1, armR: { h: [80, -20], bend: 10 }, armL: { h: [-80, -20], bend: -10 } }));
  if (n > 0) { const w = 120 * Math.pow(1.55, n), h = 90 * Math.pow(1.35, n); shape(rr(960 - w / 2, 700 - h / 2 + n * 20, w, h, 6), { fill: '#FFF4E0', lw: 6, shade: () => { for (let i = 1; i < 4; i++) stroke([[960 - w / 2 + i * w / 4, 700 - h], [960 - w / 2 + i * w / 4, 700 + h]], 3, { line: '#D9C7A3' }); fillOnly(ell(960, 700 + n * 20, w * .25, h * .12, 20), '#9FE3C1', { boil: .3 }); } }); }
  if (n >= 5) shape(noodle([960, 600], [lerp(990, 960, P01(u, 2.2, 2.6)), lerp(500, 560, P01(u, 2.2, 2.6))], 10, 22, 8), { fill: C.bHair, lw: 5 });
  gloop({ x: 1300, y: 905, s: .45, t, look: [-.8, -.3], o: .6 });
};
EVS.S97 = (sh, add) => { for (let i = 0; i < 6; i++) add('paper', sh.t0 + .3 + i * .32, { v: .5 + i * .08 }); };
SH.S98 = (t, u, sh) => { cam(960, 540, 1); St.space(t, { col: '#2F4858' }); terra({ x: 960, y: 540, R: 360, rot: 1 + u * .25, mode: 'new', face: 'happy', t }); };
SH.S99 = (t, u, sh) => {
  cam(960, 540, lerp(1.04, 1, u / sh.d)); reset(); screenRect('#F6E7C1'); cam(960, 540, lerp(1.04, 1, u / sh.d));
  shape(rect(260, 140, 1400, 760), { fill: C.ocean, lw: 8, shade: () => {
    fillOnly(rect(250, 140, 1420, 120), C.ice, { boil: .3 }); fillOnly(rect(250, 780, 1420, 130), C.ice, { boil: .3 });
    const top = [], bot = []; for (let i = 0; i <= 20; i++) { const x = 250 + i * 71; top.push([x, 330 + Math.sin(i * 1.3) * 26 + Math.sin(i * .5) * 20]); bot.push([x, 700 + Math.sin(i * 1.1 + 2) * 26]); }
    fillOnly([...top, ...bot.reverse()], '#9FE3C1', { boil: .4 });
    for (let i = 0; i < 7; i++) fillOnly(ell(340 + i * 200, 500 + Math.sin(i) * 60, 70, 40, 14), '#FF7F6A', { boil: .4 });
    for (let k = 0; k < 4; k++) stroke(arc(400 + k * 360, 210, 60, 14, Math.PI * 1.1, Math.PI * 1.9, 8), 3, { line: 'rgba(255,255,255,.5)' });
  } });
  callout('POLAR SEA', 960, 220, t, sh.t0 + .1, { size: 52, fill: '#FFF4E0' });
  callout('POLAR SEA', 960, 830, t, sh.t0 + .1, { size: 52, fill: '#FFF4E0', id: 'ps2' });
  callout('ONE CONTINENT', 960, 520, t, sh.t0 + .1, { size: 64, fill: '#FFB627' });
};
SH.S100 = (t, u, sh) => {
  cam(960, 540, 1); reset(); screenRect('#E84A2F'); cam(960, 540, 1);
  push(); translate(1200, 560); shape([[0, 0], ...arc(0, 0, 420, 420, -1.2, .6, 30)], { fill: '#7A2E1F', lw: 8, shade: () => { fillOnly([[0, 0], ...arc(0, 0, 360, 360, -1.2, .6, 30)], '#E84A2F', { boil: .3 }); fillOnly([[0, 0], ...arc(0, 0, 200, 200, -1.2, .6, 30)], '#FFB38A', { boil: .3 }); fillOnly([[0, 0], ...arc(0, 0, 100, 100, -1.2, .6, 30)], '#FFD23F', { boil: .3 }); } });
  for (let k = 0; k < 3; k++) { const a = -.9 + k * .5, r0 = 230 + ((t * 20 + k * 30) % 100); stroke(arc(0, 0, r0, r0, a, a + .3, 8), 6); } pop();
  push(); translate(500, 300); rotate(.5); shape(rr(-20, -260, 40, 300, 18), { fill: '#C9CED6', lw: 6 }); shape(ell(0, 60, 70, 46, 18), { fill: '#C9CED6', lw: 6 }); pop();
  const dl = (u * .25) % 1; shape(spline([[480, 360], [520, 360], [510, 400 + dl * 300], [500, 440 + dl * 340], [490, 400 + dl * 300]]), { fill: '#F7B32B', lw: 5 });
  shape(ell(500, 940, 140, 30, 20), { fill: '#F7B32B', lw: 5 });
};
EVS.S100 = (sh, add) => { add('drip', sh.t0 + 1.5); add('drip', sh.t0 + 4.2); };
SH.S101 = (t, u, sh) => {
  cam(960, 540, 1); St.space(t, { col: '#2F4858' });
  const v = ss(P01(u, .3, sh.d - .3));
  terra({ x: 960, y: 560, R: 300, rot: 1, mode: 'new', face: v > .6 ? 'relief' : 'clench', t, bulge: .13 * (1 - v) });
  push(); translate(960, 560); tape(300 * (1 + .13 * (1 - v))); pop();
};
EVS.S101 = (sh, add) => { add('tape', sh.t0 + .3); add('sigh', sh.t1 - .6, { v: .5 }); };
SH.S102 = (t, u, sh) => {
  const L = sh.lines[0], f = x => L.t0 + L.d * x;
  cam(960, 560, 1.15, { shake: Math.max(shakeAt(t, f(.2), 20, .5), shakeAt(t, f(.5), 16, .4)), t });
  St.newEarth(t, { crack: ss(P01(t, f(.45), f(.75))) });
  deck();
  nova(N(t, { x: 860, y: 975, s: .72, look: [.4, .3], lid: .5 }));
  bunty(B(t, { x: 990, y: 985, s: .7, face: -1, lean: .3, nerv: .9, sweat: u, eyeS: 1.15, pupil: 2.6, cowlick: 1, armR: { h: [-150, -20], bend: 10, fist: true }, armL: { h: [-130, 10], bend: -10, fist: true } }));
};
EVS.S102 = (sh, add) => { const L = sh.lines[0]; add('quake', L.t0 + L.d * .2, { d: 2 }); add('crack', L.t0 + L.d * .5); };
SH.S103 = (t, u, sh) => {
  const L = sh.lines[0], f = x => L.t0 + L.d * x;
  reset(); screenRect('#000');
  const panel = (i, draw) => { const x0 = i * 640 + (i ? 4 : 0); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.beginPath(); g.rect(x0, 0, 632, 1080); g.clip(); reset(); translate(x0, 0); draw(); g.restore(); };
  if (t > sh.t0) panel(0, () => { fillOnly(rect(0, 0, 640, 1080), '#8C6E4E', { boil: 0 }); fillOnly(rect(0, 0, 640, 260), '#9FE3C1', { boil: 0 }); for (let i = 0; i < 6; i++) { const x = 90 + (i % 3) * 200, y = 460 + Math.floor(i / 3) * 260; shape(ell(x, y, 70, 70, 24), { fill: '#6E5238', lw: 6 }); shape(ell(x, y, 46, 46, 20), { fill: i % 2 ? '#FFD23F' : '#F7B32B', lw: 5 }); stroke([[x, y - 46], [x, y + 46]], 3); } });
  if (t > f(.35)) panel(1, () => { fillOnly(rect(0, 0, 640, 1080), '#DFF3FF', { boil: 0 }); shape(rect(-20, 600, 700, 500), { fill: '#3A6EA5', lw: 7, shade: () => { for (let k = 0; k < 5; k++) stroke(arc(80 + k * 120 + (t * 30 % 120), 680 + (k % 2) * 60, 40, 10, Math.PI * 1.1, Math.PI * 1.9, 8), 4, { line: '#fff' }); } }); for (let i = 0; i < 3; i++) { push(); translate(140 + i * 180, 620 + Math.sin(t * 2 + i) * 6); shape([[-60, 0], [60, 0], [44, 36], [-44, 36]], { fill: ['#E23B3B', '#FFD23F', '#F4F1E8'][i], lw: 6 }); stroke([[0, 0], [0, -110]], 5); shape([[4, -104], [60, -30], [4, -30]], { fill: '#F4F1E8', lw: 5 }); pop(); } });
  if (t > f(.68)) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.beginPath(); g.rect(1288, 0, 632, 1080); g.clip(); cam(95, 640, .8); St.twilightPlain(t, {}); for (let i = 0; i < 5; i++) { push(); translate(-200 + i * 150 + u * 30, 880); scale(.3); shape(ell(0, -360, 40, 44, 16), { fill: '#3A2B5E', lw: 7 }); shape(rr(-50, -320, 100, 200, 30), { fill: '#3A2B5E', lw: 7 }); for (const s_ of [-1, 1]) shape(noodle([s_ * 20, -130], [s_ * 20 + Math.sin(q(t) * 6 + i) * 30 * s_, 0], 0, 30, 26), { fill: '#3A2B5E', lw: 6 }); pop(); } g.restore(); }
  reset(); for (const x of [636, 1284]) fillOnly(rect(x - 4, 0, 8, 1080), INK, { boil: 0 });
};
EVS.S103 = (sh, add) => { const L = sh.lines[0]; [.35, .68].forEach(x => add('pop', L.t0 + L.d * x)); add('pop', sh.t0 + .05); };
SH.S104 = (t, u, sh) => { cam(960, 540, .85); St.cutaway(t, { R: 360, swirl: 1, messy: ss(P01(t, lt(sh, 1) + .5, sh.t1)), field: 1 }); };
SH.S105 = (t, u, sh) => {
  cam(860, 470, 2.0); St.newEarth(t, {}); deck();
  const sh_ = Math.sin(P01(t, lt(sh, 1), lt(sh, 1) + .6) * Math.PI);
  nova(N(t, { x: 860, y: 975, s: .72, look: [0, 0], lid: .45, browUp: .6, armR: { h: [110, 60 - sh_ * 60], bend: -40 }, armL: { h: [-110, 60 - sh_ * 60], bend: 40 } }));
};
SH.S106 = (t, u, sh) => {
  cam(960, 540, 1); St.space(t, { col: '#3A2B5E' });
  planet(760, 540, 260, '#F2D7A0', '#D9B97A', 'slow', t, { bands: 1 });
  push(); translate(1400, 540); shape(rr(-130, -150, 260, 300, 14), { fill: '#FFF4E0', lw: 7, shade: () => fillOnly(rect(-140, -160, 280, 70), '#E23B3B', { boil: .3 }) }); const pg = (u * .12) % 1; push(); translate(0, -90); scale(1, 1 - pg); shape(rr(-130, 0, 260, 240, 6), { fill: '#FFF4E0', lw: 5 }); pop(); pop();
  callout('DAY > YEAR', 1400, 820, t, lt(sh, 0) + 2.2, { size: 60 });
};
EVS.S106 = (sh, add) => { add('yawn', sh.t0 + .8, { v: .5 }); };
SH.S107 = (t, u, sh) => {
  const k2 = lt(sh, 2) - .1;
  if (t < k2) {
    cam(960, 540, 1); St.space(t, { col: '#3A2B5E' });
    planet(760, 540, 160, '#A8A3A0', '#7E7975', 'smug', t, { craters: 1 });
    push(); translate(760, 540); for (let k = 1; k <= 2; k++) { const r = 160 * (1 + k * .4); stroke(arc(-r * .46, 0, r * .58, r * .82, -Math.PI / 2, Math.PI / 2, 20), 5, { line: '#C9C3E6' }); stroke(arc(r * .46, 0, r * .58, r * .82, Math.PI / 2, Math.PI * 1.5, 20), 5, { line: '#C9C3E6' }); } pop();
    bunty(B(t, { x: 1500, y: 1060, s: 1.0, face: -1, look: [-.5, -.3], brow: 1.3 }));
  } else {
    cam(960, 540, 1); reset(); screenRect('#E8D8B8'); cam(960, 540, 1);
    shape(rr(560, 160, 800, 440, 12), { fill: '#2F4A3F', lw: 8, shade: () => { for (let i = 0; i < 8; i++) stroke(spline([[620 + (i % 4) * 180, 230 + Math.floor(i / 4) * 160], [660 + (i % 4) * 180, 200 + Math.floor(i / 4) * 160], [700 + (i % 4) * 180, 250 + Math.floor(i / 4) * 160], [740 + (i % 4) * 180, 220 + Math.floor(i / 4) * 160]], false), 5, { line: '#E8F0E0' }); } });
    const arg = Math.floor(q(t) * 6) % 2;
    for (const [x, f, col] of [[520, 1, '#3A6EA5'], [1400, -1, '#A4502E']]) { push(); translate(x, 1040); scale(f, 1); shape(rr(-110, -380, 220, 380, 50), { fill: col, lw: 7, shade: () => fillOnly(rect(20, -390, 100, 400), 'rgba(0,0,0,.18)', { boil: .3 }) }); shape(ell(0, -470, 90, 100, 24), { fill: '#E0A878', lw: 7 }); eye(18, -480, 22, 24, { lw: 5, skin: '#E0A878', look: [.8, 0] }); mouth(30, -420, 40, { o: arg === (f > 0 ? 1 : 0) ? .7 : .1, lw: 5 }); shape(noodle([60, -320], [200, -380 - arg * 30], 20, 30, 24), { fill: col, lw: 6 }); hand(200, -380 - arg * 30, -.4, 18, '#E0A878'); pop(); }
  }
};
EVS.S107 = (sh, add) => { add('hmph', sh.t0 + .8, { v: .6 }); add('argue', lt(sh, 2), { d: le(sh, 2) - lt(sh, 2) + .4 }); };
SH.S108 = (t, u, sh) => {
  cam(960, 540, 1); St.space(t, { col: '#1E1A4D' });
  planet(1100, 560, 200, '#C2502E', '#9A3A20', 'sad', t, { craters: 1 });
  for (let i = 0; i < 14; i++) { const y = 200 + i * 55, x = ((hash(i) * 1400 + t * 500) % 1400) - 500; stroke([[x, y], [x + 200, y]], 6, { line: '#FFD23F' }); }
  for (let k = 0; k < 6; k++) { const ph = (t * .4 + k / 6) % 1; stroke(spline([[1250 + ph * 500, 420 + k * 50], [1350 + ph * 600, 400 + k * 50], [1450 + ph * 700, 430 + k * 50]], false), 6, { line: `rgba(201,195,230,${1 - ph})` }); }
};
EVS.S108 = (sh, add) => { add('wind', sh.t0, { d: sh.d, v: .4 }); };
SH.S108b = (t, u, sh) => {
  cam(860, 470, lerp(1.9, 2.5, ss(u / sh.d))); St.newEarth(t, {}); deck();
  nova(N(t, { x: 860, y: 975, s: .72, look: [0, 0], lid: .45 }));
};
EVS.S108b = (sh, add) => { add('mute', le(sh, 1) - .2, { d: sh.t1 - le(sh, 1) + 2.2 }); add('hum', le(sh, 1), { d: 4.5 }); };

// ———————————— CH7 · THE TWIST ————————————
SH.S109 = (t, u, sh) => {
  cam(960, 540, 1); St.space(t, { col: '#2A2440' });
  const k1 = lt(sh, 1);
  terra({ x: 640, y: 560, R: 260, rot: t * .3, face: 'sleepy', t, arrows: .7, tide: t > k1 ? [0, ss(P01(t, k1, k1 + 1.5))] : null });
  moon({ x: 1500, y: 500, R: 120, face: 'sleepy' });
};
SH.S110 = (t, u, sh) => {
  cam(960, 540, 1); reset(); screenRect('#8A7FB8'); cam(960, 540, 1); bands(['#6E6498', '#8A7FB8', '#B0A8D8'], -200, 600);
  moon({ x: 520, y: 260, R: 170, face: 'none' });
  shape(rect(-200, 640, 2400, 600), { fill: '#6E7A4A', lw: 7, shade: () => { for (let k = 0; k < 5; k++) stroke(arc(200 + k * 380 + (t * 40 % 380), 700 + (k % 2) * 40, 80, 14, Math.PI * 1.1, Math.PI * 1.9, 8), 4, { line: '#C9C3E6' }); } });
  for (const [x, w] of [[300, 260], [1500, 340]]) shape(spline([[x - w, 660], [x - w * .6, 560], [x, 520], [x + w * .6, 570], [x + w, 660]]), { fill: '#7B5B3A', lw: 7 });
  push(); translate(1200, 340); shape(ell(0, 0, 200, 200, 50), { fill: '#FFF4E0', lw: 8 }); for (let k = 0; k < 19; k++) { const a = k / 19 * TAU - Math.PI / 2; stroke([[Math.cos(a) * 170, Math.sin(a) * 170], [Math.cos(a) * 192, Math.sin(a) * 192]], k % 19 === 0 ? 8 : 5); } const hh = t * 3; stroke([[0, 0], [Math.cos(hh) * 100, Math.sin(hh) * 100]], 9); stroke([[0, 0], [Math.cos(hh * 6) * 150, Math.sin(hh * 6) * 150]], 6); dot(0, 0, 12); pop();
  callout('19 HOURS', 1200, 620, t, lt(sh, 0) + 2.4, { size: 70 });
  callout('1.4 billion years ago', 960, 980, t, lt(sh, 0) + .3, { size: 48, fill: '#FFF4E0' });
};
EVS.S110 = (sh, add) => { add('clockSpin', sh.t0 + .3, { d: sh.d - .6, v: .6 }); };
SH.S111 = (t, u, sh) => {
  cam(960, 540, 1); St.space(t, { col: '#2A2440' });
  terra({ x: 260, y: 820, R: 380, rot: 1.2, face: 'none', t });
  push(); translate(330, 450); rotate(.4); shape(rr(-50, -40, 100, 60, 10), { fill: '#F4F1E8', lw: 6 }); shape(arc(0, -40, 50, 50, Math.PI, TAU, 16), { fill: '#F4F1E8', lw: 6 }); pop();
  moon({ x: 1500, y: 300, R: 170, face: 'sleepy' });
  push(); translate(1420, 400); rotate(-.3); shape(rr(-30, -20, 60, 40, 4), { fill: '#C9CED6', lw: 5 }); pop();
  const ph = ((t - sh.t0) * .8) % 1, a = [370, 420], b = [1400, 400];
  const p0 = ph < .5 ? 0 : (ph - .5) * 2, p1 = ph < .5 ? ph * 2 : 1;
  stroke([[lerp(a[0], b[0], p0), lerp(a[1], b[1], p0)], [lerp(a[0], b[0], p1), lerp(a[1], b[1], p1)]], 6, { line: '#E23B3B' });
  if (t > lt(sh, 0) + .5) { push(); translate(1250, 860); shape(rr(-250, -110, 500, 220, 20), { fill: '#FFF4E0', lw: 7 }); pop(); bunty(B(t, { x: 1150, y: 1180, s: .62, face: 1, look: [.6, -.2], armR: { h: [120, -80], bend: 10 }, armL: { h: [60, -90], bend: -10 } })); push(); translate(1340, 860); shape(rr(-20, -60, 40, 120, 4), { fill: '#FFD23F', lw: 5 }); for (let k = 0; k < 6; k++) stroke([[-20, -50 + k * 20], [-6, -50 + k * 20]], 3); pop(); }
  callout('+3.8 cm / year', 960, 120, t, lt(sh, 0) + 2.0, { size: 64 });
};
EVS.S111 = (sh, add) => { for (let k = 0; k < Math.floor(sh.d * .8); k++) add('laser', sh.t0 + k / .8, { v: .4 }); };
SH.S112 = (t, u, sh) => {
  cam(860, 470, lerp(2.1, 2.5, ss(u / sh.d)));
  reset(); screenRect('#2A2440'); cam(860, 470, lerp(2.1, 2.5, ss(u / sh.d))); St.stars(t, { n: 60, seed: 4 });
  deck();
  nova(N(t, { x: 860, y: 975, s: .72, look: [0, 0], lid: .5, browUp: .5 }));
};
SH.S113 = (t, u, sh) => { cam(980, 470, lerp(1.05, 1.12, u / sh.d)); St.nightSky(t, { cloud: 1 - .5 * ss(P01(u, .3, sh.d)), moonR: 150 }); };
SH.S114 = (t, u, sh) => {
  cam(980, 470, lerp(1.12, 1.2, u / sh.d));
  const op = ss(P01(t, le(sh, 0) - .2, le(sh, 0) + .6));
  St.nightSky(t, { cloud: .5 - .5 * ss(P01(u, 0, .6)), moonR: 150, moonFace: op > .1 ? 'open' : 'closed', moonLid: lerp(.95, .4, op) });
};
EVS.S114 = (sh, add) => { add('shimmer', le(sh, 0) - .1); };
SH.S115 = (t, u, sh) => {
  cam(960, 540, 1); St.space(t, { col: '#2A2440' });
  const k1 = lt(sh, 1);
  terra({ x: 640, y: 560, R: 260, rot: 1, mode: 'new', face: 'sad', t, tide: [0, .8] });
  moon({ x: 1500, y: 520, R: 110, face: 'open' });
  if (t > k1) {
    const v = ss(P01(t, k1, k1 + .4)); reset(); push(); translate(1500, 860); scale(v);
    shape(ell(0, 0, 240, 150, 40), { fill: '#FFF4E0', lw: 7 });
    const a = (t - k1) * .4; shape(ell(0, 30, 150, 44, 30), { fill: '#E23B3B', lw: 6 }); for (let k = 0; k < 4; k++) { const b = a + k * Math.PI / 2; stroke([[0, 20], [Math.cos(b) * 140, 30 + Math.sin(b) * 40]], 5); } stroke([[0, 20], [0, -60]], 6);
    hand(-150 + Math.sin(t * 2) * 10, 0, -.3, 24, C.nSkin);
    pop();
  }
};
SH.S116 = (t, u, sh) => {
  const k1 = lt(sh, 1);
  if (t < k1 - .1) {
    cam(960, 540, 1); St.space(t, { col: '#2A2440' });
    const v = ss(P01(u, .5, sh.d));
    terra({ x: 700, y: 560, R: 280, rot: 1 + v * 1.4, mode: 'new', face: 'relief', t, arrows: v, tide: [0, .8] });
    moon({ x: 1500, y: 520, R: 110, face: 'smile' });
    callout('1 spin / 27 days', 960, 960, t, le(sh, 0) - 2.6, { size: 60 });
  } else {
    cam(960, 560, 1.3); reset(); screenRect('#2A2440'); cam(960, 560, 1.3); St.stars(t, { n: 60 }); deck();
    const j = Math.abs(Math.sin(q(t) * 7));
    bunty(B(t, { x: 1000, y: 980 - j * 50, s: .78, happy: true, sq: landSq(t, k1 + .3), armR: { h: [60, -170], bend: 10 }, armL: { h: [-60, -170], bend: -10 }, mouth: { ...talk('B', t), sm: .9 } }));
    nova(N(t, { x: 780, y: 975, s: .72, look: [.5, 0], lid: .55 }));
  }
};
EVS.S116 = (sh, add) => { add('boing', lt(sh, 1) + .3, { v: .5 }); };
SH.S117 = (t, u, sh) => {
  cam(960, 540, 1); St.space(t, { col: '#2A2440' });
  const v = ss(P01(t, lt(sh, 1), sh.t1));
  terra({ x: 560, y: 560, R: 220, rot: t * .2, mode: 'new', face: 'relief', t, arrows: .6 });
  moon({ x: 1400, y: 500, R: 120, face: v > .3 ? 'tired' : 'open' });
  push(); translate(1400, 760); shape(rr(-150, -30, 300, 60, 14), { fill: '#3d3542', lw: 6, shade: () => fillOnly(rect(-150, -30, 300 * (1 - v * .8), 60), '#C9C3E6', { boil: .3 }) }); pop();
  for (let k = 0; k < 5; k++) { const ph = (t * .9 + k / 5) % 1; if (v > 0) dot(lerp(1280, 800, ph), 500 + Math.sin(ph * Math.PI) * -80, 10, '#C9C3E6'); }
};
EVS.S117 = (sh, add) => { add('mute', lt(sh, 0) - .3, { d: .5 }); add('drainDown', lt(sh, 1), { d: sh.t1 - lt(sh, 1) }); };
SH.S118 = (t, u, sh) => {
  cam(960, 540, lerp(1, 1.12, u / sh.d)); St.space(t, { col: '#2A2440', n: 40 });
  terra({ x: 960, y: 540, R: 110, rot: t * .2, mode: 'new', face: 'worried', t });
  const v = ss(P01(t, lt(sh, 1) - .3, sh.t1 - .5)), P = [];
  for (let i = 0; i <= 80; i++) { const a = i / 80 * TAU * 2.2, r = lerp(430, 200, i / 80); P.push([960 + Math.cos(a) * r, 540 + Math.sin(a) * r * .9]); }
  const n = Math.max(2, Math.floor(v * P.length));
  for (let i = 0; i + 1 < n; i += 2) stroke([P[i], P[i + 1]], 5, { line: '#C9C3E6' });
  const e = P[n - 1]; moon({ x: e[0], y: e[1], R: 50, face: 'tired' });
};
EVS.S118 = (sh, add) => { add('whoosh', lt(sh, 1) - .3, { v: .5 }); add('mute', le(sh, 1) - .1, { d: sh.t1 - le(sh, 1) + .4 }); };
SH.S119 = (t, u, sh) => {
  cam(960, 540, 1); St.space(t, { col: '#1E1A4D' });
  planet(960, 560, 200, '#C2502E', '#9A3A20', 'shock', t, { craters: 1 });
  const L = sh.lines[0], br = L.t0 + L.d * .75;
  if (t < br) { const a = t * 1.4, r = lerp(380, 260, P01(u, 0, br - sh.t0)); push(); translate(960 + Math.cos(a) * r, 560 + Math.sin(a) * r * .5); rotate(a); shape(spline([[-50, -10], [-30, -36], [20, -34], [52, -6], [36, 28], [-24, 30]]), { fill: '#8A7F7A', lw: 6, shade: () => dot(10, 0, 8, '#6E625C') }); pop(); }
  else { const v = ss(P01(t, br, br + 1.2)); push(); translate(960, 560); scale(1, .5); for (let i = 0; i < 26; i++) { const a = i / 26 * TAU + t * .8 + hash(i) * .2 * (1 - v), r = 260 + (hash(i * 3) - .5) * 40 * v; shape(ell(Math.cos(a) * r, Math.sin(a) * r, 12, 10, 8), { fill: '#8A7F7A', lw: 4 }); } pop(); }
};
EVS.S119 = (sh, add) => { const L = sh.lines[0]; add('crack', L.t0 + L.d * .75); add('tinkle', L.t0 + L.d * .78); };
SH.S120 = (t, u, sh) => {
  cam(980, 400, lerp(1.6, 1.9, ss(u / sh.d)));
  St.bedroom(t, { sky: 'night', moonR: 120, lever: 1, needle: 1, brake: true });
  push(); translate(1000, 900); shape(spline([[-80, 0], [-70, -300], [0, -480], [70, -300], [80, 0]]), { fill: '#1E1428', lw: 7 }); shape(ell(0, -540, 60, 70, 20), { fill: '#1E1428', lw: 7 }); shape(ell(-10, -640, 40, 38, 18), { fill: '#1E1428', lw: 7 }); stroke(arc(-10, -640, 74, 16, Math.PI, TAU, 16), 7, { line: '#8D93A0' }); pop();
};
SH.S121 = (t, u, sh) => {
  const flip = le(sh, 0) + .1;
  cam(900, 520, 1.05, { shake: shakeAt(t, flip + .1, 10, .4), t });
  St.bedroom(t, { sky: t > flip + .2 ? 'dawn' : 'night', moonR: t > flip + .2 ? 0 : 120, lever: 1 - ss(P01(t, flip, flip + .12)), clock: t > flip + .3 ? 59 : 58 });
  push(); translate(560, 700); bunty(B(t, { x: 0, y: 0, s: .82, nerv: .8, eyeS: 1.25, pupil: 2.6, cowlick: 1, look: [.5, -.1], armR: { h: [80, -120], bend: 10 }, mouth: { ...talk('B', t), o: talk('B', t).o * 1.2 } })); pop(); St.quiltShape(200, 40);
  nova(N(t, { x: 1340, y: FL, s: .86, face: 1, look: [.6, .3], lid: .55, armR: t > flip - .4 ? { h: [150, 10], bend: 10, fist: true } : undefined }));
};
EVS.S121 = (sh, add) => { const fl = le(sh, 0) + .1; add('clunk', fl); add('spinUp', fl + .1); add('tick', fl + .5); add('roomtone', fl); };

// ———————————— CLIFFHANGER ————————————
SH.S122 = (t, u, sh) => {
  cam(860, 500, 1.2);
  St.bedroom(t, { moonR: 46, moonA: .55, clock: 59 });
  push(); translate(560, 700); bunty(B(t, { x: 0, y: 0, s: .82, look: [.3, -.3], brow: .8, armR: t > lt(sh, 1) - .3 ? { h: [70, -150], bend: 10 } : { h: [50, -40], bend: 20, fist: true }, mouth: { ...talk('B', t), sm: 0 } })); pop(); St.quiltShape(200, 40);
};
EVS.S122 = (sh, add) => { add('mute', le(sh, 1) - .3, { d: sh.t1 - le(sh, 1) + 2.6 }); };
SH.S123 = (t, u, sh) => {
  cam(1340, 330, 2.2);
  St.bedroom(t, { moonR: 46, moonA: .55, clock: 59 });
  const turn = ss(P01(u, .3, 1.8));
  nova(N(t, { x: 1340, y: FL, s: .86, face: turn > .5 ? -1 : 1, look: [0, 0], lid: .35, browUp: 0, brow: -.3, mouth: { ...talk('N', t), sm: -.4, skew: 0 } }));
};
EVS.S123 = (sh, add) => { add('tick', sh.t0 + .4); add('tick', sh.t0 + 1.4); add('lowHit', lt(sh, 0)); };
SH.S124 = (t, u, sh) => {
  cam(1100, 380, 2.0);
  const fade = ss(P01(u, .6, 2.2));
  St.bedroom(t, { moonR: 46, moonA: .55 * (1 - fade), clock: 59 });
  if (fade > .5) { push(); translate(790 + 380 * .45, 170 + 400 * .38); for (let i = 0; i < 16; i += 2) stroke(arc(0, 0, 46, 46, i / 16 * TAU, (i + 1) / 16 * TAU, 4), 4, { line: 'rgba(30,20,40,.6)' }); pop(); }
};
EVS.S124 = (sh, add) => { add('sting', le(sh, 0) - .1); };
SH.S125 = (t, u, sh) => {
  cam(900, 520, 1.1);
  St.bedroom(t, { clock: 59, quilt: 0 });
  const hide = ss(P01(t, le(sh, 0) - .2, le(sh, 0) + .3));
  push(); translate(640, 676); rotate(-1.5); bunty(B(t, { x: 0, y: 0, s: .8, look: [.4, -.3], brow: 1.3, mouth: { ...talk('B', t), sm: .2 } })); pop();
  St.quiltShape(150 - hide * 60, -hide * 40);
  nova(N(t, { x: 1290, y: FL, s: .86, face: -1, look: [.3, .2], lid: .6, holdL: 'tumbler', armL: { h: [40, 120], bend: -40 } }));
  if (t > le(sh, 1) + .35) { reset(); screenRect('#000'); }
};
EVS.S125 = (sh, add) => { add('cloth', le(sh, 0) - .2); add('cut', le(sh, 1) + .35); };
