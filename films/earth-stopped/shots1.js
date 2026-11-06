// shots1.js — Cold open, Ch1 (The Speed You Can't Feel), Ch2 (The First Second)
import { clamp, lerp, seg, ss, eo, ei, eio, back, hash, TAU } from '/core/lib.js';
import { W, H, INK, g, push, pop, translate, rotate, scale, reset, shape, fillOnly, stroke, ell, arc, spline, rr, rect, quad, noodle, dot, text, screenRect, bands } from './toon.js';
import { C, nova, bunty, gloop, terra, moon, chai, spinBrake, hand, remote, tumbler, clipboard, phone, star4, eye, mouth } from './chars.js';
import * as St from './sets.js';
import { R, cam, shakeAt, talk, N, B, walkLegs, landSq, popIn, portal, portalOpen, callout, speedLines, lt, le, P01, q } from './rig.js';

export const SH = {}, EVS = {};
const FL = 900;   // bedroom floor line for feet
// —— bedroom helpers ——
const buntyInBed = (t, o = {}) => { push(); translate(640, 676); rotate(-1.5); bunty(B(t, { x: 0, y: 0, s: .8, armR: { h: [60, -40], bend: 10 }, armL: { h: [-20, 60], bend: -10 }, ...o })); pop(); St.quiltShape(150, 0); };

// ———————————— COLD OPEN ————————————
SH.S01 = (t, u, sh) => {
  cam(lerp(930, 900, ss(u / sh.d)), 520, lerp(1.04, 1.1, ss(u / sh.d)));
  St.bedroom(t, { ring: t < lt(sh, 1) ? 1 : 0 });
  const k1 = lt(sh, 1);
  buntyInBed(t, { lid: t < k1 ? .6 : .3, brow: 1.2, cowlick: -.4, mouth: { ...talk('B', t), sm: -.6 }, armR: t < k1 - .6 ? { h: [80, -60], bend: 20 } : { h: [60, -40], bend: 10 } });
  nova(N(t, { x: 1290, y: FL, s: .86, face: -1, look: [.3, .2], lid: .55, browUp: t > k1 ? ss(P01(t, k1, k1 + .3)) : 0, armR: { h: [-30, 150], bend: 30 }, holdL: 'tumbler', armL: { h: [40, 120], bend: -40 } }));
  gloop({ x: 720, y: 905, s: .45, t, look: [-.5, -.3], blink: hash(Math.floor(t * 2)) > .85 });
};
EVS.S01 = (sh, add) => { add('alarm', sh.t0, { d: lt(sh, 1) - sh.t0 - .1 }); add('cloth', sh.t0 + .7); add('roomtone', sh.t0); };
SH.S02 = (t, u, sh) => {
  const tc = sh.t0 + .35, lev = ss(P01(t, tc - .12, tc)), dip = Math.sin(P01(t, tc - .35, tc - .12) * Math.PI) * .12;
  cam(1610, 520, 2.6 + u * .04, { shake: shakeAt(t, tc, 22, .45), t });
  St.bedroom(t, { lever: Math.max(0, lev - dip), needle: ss(P01(t, tc, tc + .4)) });
  // Nova's hand on the lever knob
  const la = lerp(-1.25, .55, Math.max(0, lev - dip)), kx = 1530 + .8 * (118 + Math.sin(la) * 132), ky = 642 + .8 * (-96 - Math.cos(la) * 132);
  push(); translate(kx, ky); shape(noodle([0, 0], [160, -120], 20, 30, 34), { fill: C.suit, lw: 7 }); pop();
  hand(kx, ky, -2.4 + la * .3, 18, C.nSkin, { fist: true });
};
EVS.S02 = (sh, add) => { add('clunk', sh.t0 + .35); add('mute', sh.t0 + .3, { d: .1 }); };
SH.S03 = (t, u, sh) => {
  const k = ss(P01(u, 0, sh.d)), cx = lerp(700, 2300, eo(P01(u, 0, 1.2))) + u * 80;
  cam(cx, 520, 1, { rot: -.05, shake: shakeAt(t, sh.t0, 10, .6), t });
  St.bedroom(t, { lever: 1, needle: 1, quilt: 0 });
  const bx = cx - 120 + Math.sin(u * 3) * 20, by = 560 + Math.sin(u * 2) * 20;
  St.quiltShape(bx - 900, by - 560);
  push(); translate(bx, by); rotate(-1.25);
  bunty(B(t, { x: 0, y: 200, s: 1.05, sq: .86, nerv: 1, eyeS: 1.15, pupil: 2.6, cowlick: 1, armR: { h: [120, -40], bend: 10 }, armL: { h: [120, 20], bend: -10 }, legL: [-30, 0], legR: [-40, -10], mouth: { o: .7, w: .8, sm: -.8 } }));
  pop();
  chai(bx + 260, by - 120, .7, { a: t * 3, t, full: 1 });
  push(); translate(bx + 360, by + 140); rotate(t * 5); shape(ell(0, 0, 40, 40, 20), { fill: '#E23B3B', lw: 6 }); pop();
  push(); translate(bx - 300, by + 200); rotate(-t * 2); shape(rr(-20, -150, 40, 260, 12), { fill: '#E8C88A', lw: 6 }); pop();
  reset(); speedLines(t, 18, { sp: 3600, col: 'rgba(255,255,255,.85)' });
};
EVS.S03 = (sh, add) => { add('whooshBig', sh.t0 + .05); add('cloth', sh.t0 + .2); add('mute', sh.t0 + sh.d - .02, { d: .1 }); };
SH.S04 = (t, u, sh) => {
  const k1 = lt(sh, 1) - .15;
  if (t < k1) {   // frozen reaction close-up: only eyes and mouth move
    cam(1500, 380, 2.1);
    St.bedroom(sh.t0, { lever: 1, needle: 1, quilt: 0 });
    push(); translate(1500, 420); rotate(-1.3);
    bunty(B(t, { x: 0, y: 200, s: .85, nerv: .9, eyeS: 1.2, pupil: 2.4, cowlick: 1, sweat: u * .8, look: [Math.sin(u * 2) * .4, -.3], armR: { h: [120, -40], bend: 10 }, armL: { h: [120, 20], bend: -10 }, headTilt: 0, sq: 1, mouth: { ...talk('B', t), o: talk('B', t).o * 1.3 + .1, sm: -.9 } }));
    pop();
    chai(1820, 240, .7, { a: -.6, t: sh.t0, full: 1, steam: 0 });
    shape(spline([[1860, 180], [1900, 150], [1930, 190], [1900, 220]]), { fill: C.chai, lw: 5 });
  } else {
    cam(1150, 460, 1.15);
    St.bedroom(sh.t0, { lever: 1, needle: 1, quilt: 0 });
    push(); translate(560, 360); rotate(-1.3); bunty(B(sh.t0, { x: 0, y: 200, s: .7, nerv: 0, eyeS: 1.2, pupil: 2.4, cowlick: 1, armR: { h: [120, -40], bend: 10 }, armL: { h: [120, 20], bend: -10 }, mouth: { o: .6, w: .8, sm: -.8 }, blink: false })); pop();
    nova(N(t, { x: 1250, y: FL, s: .86, face: -1, look: [.2, 0], lid: .55, holdL: 'tumbler', armL: { h: [40, 120], bend: -40 }, armR: { h: [-20, 160], bend: 20 } }));
  }
};
EVS.S04 = (sh, add) => { add('mute', sh.t0, { d: lt(sh, 1) - sh.t0 }); add('tick', sh.t0 + .5); add('tick', sh.t0 + 1.5); };
SH.S05 = (t, u, sh) => {
  cam(1290, 330, lerp(2.1, 2.5, ss(u / sh.d)));
  St.bedroom(t, { lever: 1, quilt: 0 });
  nova(N(t, { x: 1290, y: FL, s: .86, face: -1, look: [0, 0], lid: .5, browUp: .7, holdL: 'tumbler', armL: { h: [40, 120], bend: -40 } }));
};
SH.S06 = (t, u, sh) => { cam(980, 470, lerp(1.05, 1.15, u / sh.d)); St.nightSky(t, { cloud: 1 - .06 * ss(P01(u, .5, sh.d)), moonR: 150 }); };
EVS.S06 = (sh, add) => { add('lowHit', lt(sh, 0) + .9); };
SH.S07 = (t, u, sh) => {
  const k1 = lt(sh, 1), pr = le(sh, 1) - .5, rush = P01(t, sh.t1 - .45, sh.t1);
  const whip = P01(t, k1 - .3, k1);
  cam(lerp(780, 1100, ss(whip)), 470, lerp(1.25, 1.1, ss(whip)) * lerp(1, 6, ei(rush)));
  St.bedroom(sh.t0, { lever: 1, quilt: 0 });
  push(); translate(560, 360); rotate(-1.3); bunty(B(t, { x: 0, y: 200, s: .7, nerv: .9, eyeS: 1.2, pupil: 2.4, cowlick: 1, armR: { h: [120, -40], bend: 10 }, armL: { h: [120, 20], bend: -10 }, mouth: { ...talk('B', t), o: talk('B', t).o * 1.3, sm: -.9 } })); pop();
  gloop({ x: 520, y: 880, s: .4, t, look: [.6, -.4] });
  const press = t > pr && t < pr + .2 ? 1 : 0;
  nova(N(t, { x: 1350, y: FL, s: .86, face: -1, lid: .55, look: [-.3, 0], holdR: 'remote', armR: { h: [-110, 60], bend: 30 }, press }));
  if (rush > 0 || t > pr) portal(1000, 470, 190, t, { open: portalOpen(t, pr + .05) });
};
EVS.S07 = (sh, add) => { const pr = le(sh, 1) - .5; add('click', pr); add('portalOpen', pr + .05); add('whooshBig', sh.t1 - .4); };
SH.S08 = (t, u, sh) => {   // title over the portal swirl
  reset(); screenRect('#2B2366');
  cam(960, 540, 1); portal(960, 540, 900, t, { open: 1, sx: 1, spin: 1.4 });
  reset(); screenRect('#2B2366', .25);
  titleArt(t, u);
};
EVS.S08 = (sh, add) => { add('slam', sh.t0 + .55); add('portalHum', sh.t0, { d: sh.d }); };
export function titleArt(t, u, k = 1) {
  const s = u < .55 ? 0 : back(clamp((q(u) - .55) / .3), 2.4);
  if (s <= 0) return;
  reset(); translate(960, 520); scale(s * k); rotate(-.05);
  const ring = (a0, a1) => { const P = arc(0, 30, 640, 120, a0, a1, 40); stroke(P, 26, { boil: .5 }); stroke(P, 12, { line: '#FF5D8F', boil: .5 }); };
  push(); rotate(.1); ring(Math.PI, TAU); pop();
  terra({ x: 0, y: -40, R: 110, rot: .3, face: 'dizzy', t });
  text('THE DAY EARTH', 0, 100, { font: '400 128px "Lilita One"', fill: '#FFB627', outlineW: 26, outlineCol: INK });
  text('STOPPED', 0, 230, { font: '400 168px "Lilita One"', fill: '#FFB627', outlineW: 30, outlineCol: INK });
  push(); rotate(.1); ring(0, Math.PI); pop();
  for (let i = 0; i < 4; i++) { const x = [-640, 650, -470, 520][i], y = [-80, -60, 260, 250][i], r = 18 + 10 * Math.sin(t * 5 + i * 1.7); shape(star4(x, y, r), { fill: '#FFF4E0', lw: 5 }); }
  R.tx.push({ id: 'title', text: 'THE DAY EARTH STOPPED', x0: 300, y0: 520, x1: 1620, y1: 800 });
}

// ———————————— CH1 · THE SPEED YOU CAN'T FEEL (space classroom) ————————————
const classN = (t, o = {}) => nova(N(t, { x: 640, y: 890, s: .8, look: [.4, 0], ...o }));
const classB = (t, o = {}) => bunty(B(t, { x: 980, y: 900, s: .9, face: -1, holdR: 'chai', armR: { h: [50, 40], bend: 30 }, look: [.4, 0], ...o }));
SH.S09 = (t, u, sh) => {
  cam(860, 560, lerp(1.0, 1.06, u / sh.d));
  St.classroom(t, {});
  classN(t, { look: [.5, .1] });
  classB(t, { lid: .3, mouth: { o: 0, sm: .4 }, armR: { h: [40, -40 + Math.sin(u * 2) * 10], bend: 40 }, look: [-.4, -.2] });
  gloop({ x: 1240, y: 900, s: .5, t, look: [-.6, -.3] });
};
EVS.S09 = (sh, add) => { add('slurp', sh.t0 + .5, { d: .5 }); add('spaceHum', sh.t0); };
SH.S10 = (t, u, sh) => {
  const z = lerp(3.0, 1.0, eo(P01(u, .1, 1.6)));
  cam(960, lerp(260, 560, eo(P01(u, .1, 1.6))), z);
  St.space(t, {});
  terra({ x: 960, y: 640, R: 330, rot: t * .5, face: 'sleepy', t, arrows: 1, bulge: .03 });
  St.platform(960, 240, .2);
  nova(N(t, { x: 920, y: 236, s: .12 })); bunty(B(t, { x: 990, y: 238, s: .14, face: -1 }));
  callout('23 h 56 min', 1450, 230, t, lt(sh, 1) + .6, { size: 66 });
};
EVS.S10 = (sh, add) => { add('whoosh', sh.t0 + .1); add('pop', lt(sh, 1) + .6); };
SH.S11 = (t, u, sh) => {
  cam(960, 540, 1);
  St.space(t, { n: 40 });
  // the curved horizon of Terra
  shape(ell(960, 2600, 2400, 2000, 120), { fill: C.ocean, lw: 8, shade: () => { for (let i = 0; i < 9; i++) { const x = ((i * 400 - t * 900) % 3600) - 400; fillOnly(ell(x, 680, 150, 60, 16), C.land, { boil: .4 }); } } });
  const k2 = lt(sh, 1);
  if (t > k2 - .3) {   // plane + sound wave race; the ground wins
    const v = t - k2 + .3; push(); translate(-200 + v * 520, 380); shape(spline([[-90, 0], [60, -14], [100, 0], [60, 14]]), { fill: '#F4F1E8', lw: 6 }); shape([[-10, 0], [30, -60], [50, -56], [30, 0]], { fill: '#C9CED6', lw: 5 }); pop();
    for (let k = 0; k < 3; k++) stroke(arc(-300 + v * 640 + k * 26, 260, 40, 60, -1, 1, 10), 6, { line: '#FFF4E0' });
  }
  bunty(B(t, { x: 300, y: 1080, s: 1.1, look: [.8, -.5], armR: t > k2 ? { h: [140, -120], bend: 30 } : { h: [20, 90], bend: 10 }, eyeS: 1.1 }));
  callout('1,670 km/h', 1380, 230, t, lt(sh, 0) + 2.2, { size: 80 });
};
EVS.S11 = (sh, add) => { add('jet', lt(sh, 1) - .3, { d: 2.5 }); add('sonic', lt(sh, 2) + .3); add('pop', lt(sh, 0) + 2.2); };
SH.S12 = (t, u, sh) => {
  cam(960, 540, 1);
  St.indiaMap(t, {});
  const L0 = sh.lines[0], f = x => L0.t0 + L0.d * x;
  St.cityPin('Chennai', t, popIn(t, f(.1)), {}); St.cityPin('Bengaluru', t, popIn(t, f(.17)), { lab: 'Bengaluru' });
  St.cityPin('Mumbai', t, popIn(t, f(.5))); St.cityPin('Delhi', t, popIn(t, f(.76)));
  if (t < lt(sh, 1)) { callout('~1,600', 1560, 760, t, f(.12), { size: 60 }); callout('1,580', 330, 440, t, f(.5), { size: 60 }); callout('1,465', 1560, 210, t, f(.76), { size: 60 }); }
  else {   // inset: the North Pole, a cake slowly turning
    reset(); translate(1560, 300);
    shape(ell(0, 0, 230, 230, 50), { fill: '#2B2366', lw: 8, shade: () => { fillOnly(ell(0, 0, 150, 150, 40), C.ice, { boil: .3 }); } });
    push(); rotate(t * .8); shape(ell(0, 10, 80, 40, 30), { fill: '#FFB0C0', lw: 6 }); shape(rr(-80, -30, 160, 40, 14), { fill: '#F4E9D8', lw: 6 }); shape(ell(0, -30, 80, 30, 30), { fill: '#FF8FC8', lw: 6 }); stroke([[0, -40], [0, -90]], 6); pop();
    callout('≈ 0 km/h', 1560, 590, t, lt(sh, 1) + 1.0, { size: 56 });
  }
  R.tx.push({ id: 'cities', text: 'Chennai Bengaluru Mumbai Delhi', x0: 560, y0: 70, x1: 1360, y1: 1010 });
};
EVS.S12 = (sh, add) => { const L0 = sh.lines[0]; [.1, .17, .5, .76].forEach(x => add('boing', L0.t0 + L0.d * x, { v: .5 })); add('pop', lt(sh, 1)); add('ding', lt(sh, 1) + 1.0, { v: .4 }); };
SH.S13 = (t, u, sh) => {
  const k1 = lt(sh, 1);
  cam(1000, 520, 2.0);
  St.classroom(t, {});
  const tilt = Math.sin(u * 2.4) * .35;
  bunty(B(t, { x: 980, y: 900, s: .9, face: -1, holdR: 'chai', armR: { h: [80, -10], bend: 30, ra: tilt }, look: [.5, .3], brow: 1.3, nerv: .3 }));
  if (t > k1 - .2) { const v = ss(P01(t, k1 - .2, k1 + .2)); push(); translate(lerp(1600, 1320, v), 400); hand(0, 0, Math.PI, 26, C.nSkin); pop(); }
};
SH.S14 = (t, u, sh) => {
  cam(960, 540, lerp(1, 1.1, u / sh.d));
  St.space(t, { col: '#1E1A4D', n: 50 });
  const form = ss(P01(u, 2, sh.d - .6));
  push(); translate(960, 560); rotate(-.3); scale(1, .42);
  for (let k = 0; k < 7; k++) { const r = 160 + k * 70; const a0 = t * (.6 - k * .05); stroke(arc(0, 0, r, r, a0, a0 + 4.2, 40), 26 - k * 2, { line: k % 2 ? '#F7B32B' : '#FF5D8F' }); }
  pop();
  St.bigSun(960, 560, 70, t);
  terra({ x: 960 + Math.cos(t * .6) * 330, y: 560 + Math.sin(t * .6) * 140, R: lerp(30, 70, form), rot: t, face: form > .8 ? 'sleepy' : 'none', t });
  reset(); fillOnly(rect(0, 0, 1920, 1080), 'rgba(20,10,50,.0)', { boil: 0 });
  callout('4,500,000,000 years ago', 960, 120, t, sh.t0 + .5, { size: 54, fill: '#FFF4E0' });
};
SH.S15 = (t, u, sh) => {
  cam(960, 540, 1);
  St.space(t, {});
  terra({ x: 700, y: 560, R: 300, rot: t * .5, face: 'happy', t, arrows: .8 });
  nova(N(t, { x: 1450, y: 900 + Math.sin(t * 1.3) * 10, s: .75, face: -1, armR: { h: [-120, -40], bend: 20, fist: true }, look: [-.3, -.2], lean: .1 }));
  // a bicycle brake lever with its cable connected to nothing
  const sq = Math.sin(P01(u, 2.2, 2.6) * Math.PI);
  push(); translate(1270, 470); rotate(-.3); shape(rr(-20, -10, 120, 24, 10), { fill: '#3d3542', lw: 5 }); push(); rotate(sq * .3); shape(rr(10, 10, 110, 14, 6), { fill: C.steel, lw: 5 }); pop(); stroke(spline([[0, 0], [-60, 60], [-30, 130], [-80, 200]], false), 4); pop();
};
EVS.S15 = (sh, add) => { add('squeak', sh.t0 + 2.3); add('squeak', sh.t0 + 2.9, { v: .6 }); };
SH.S16 = (t, u, sh) => {
  const br = sh.t1 - 1.0, slosh = P01(t, br, br + .5);
  cam(960, 540, 1, { shake: shakeAt(t, br, 8, .3), t });
  reset(); screenRect('#FFF4E0');
  for (let k = 0; k < 3; k++) { const x = 340 + k * 520; shape(rr(x, 180, 260, 320, 120), { fill: '#C9CED6', lw: 7, shade: () => { fillOnly(rr(x + 30, 210, 200, 260, 100), '#2B2366', { boil: 0 }); for (let i = 0; i < 3; i++) { const cx = ((i * 220 + (t < br ? t * 500 : br * 500)) % 600) + x - 100; fillOnly(ell(cx, 300 + i * 60, 70, 26, 14), '#FFF4E0', { boil: .3 }); } } }); }
  fillOnly(rect(0, 620, 1920, 460), '#E8D8B8', { boil: 0 });
  shape(rr(620, 520, 380, 420, 40), { fill: '#3A6EA5', lw: 7 });
  bunty(B(t, { x: 820, y: 1000, s: 1.0, look: t > br ? [0, .6] : [.5, -.2], eyeS: t > br ? 1.2 : 1, nerv: t > br ? .6 : 0 }));
  shape(rr(1000, 760, 260, 24, 6), { fill: '#C9CED6', lw: 6 });
  chai(1120, 760, .8, { t, full: 1, a: Math.sin(slosh * Math.PI * 3) * .3 * (1 - slosh) });
  if (slosh > 0 && slosh < 1) shape(spline([[1150, 660], [1200, 640], [1230, 680]]), { fill: C.chai, lw: 5 });
};
EVS.S16 = (sh, add) => { add('cabin', sh.t0, { d: sh.d }); add('thunk', sh.t1 - 1.0); add('splash', sh.t1 - .9, { v: .5 }); };
SH.S17 = (t, u, sh) => {
  const dx = u * 60;
  cam(860 + dx, 560, 1);
  St.space(t, {}); terra({ x: 1700 + dx * .3, y: 520, R: 520, rot: t * .12, face: 'sleepy', t });
  St.platform(860 + dx, 870, 1.15);
  const ar = (x, y) => { push(); translate(x, y); shape([[-60, -10], [40, -10], [40, -26], [80, 0], [40, 26], [40, 10], [-60, 10]], { fill: '#F7B32B', lw: 5 }); pop(); };
  nova(N(t, { x: 560 + dx, y: 890, s: .8, look: [.4, -.5] })); ar(560 + dx, 260);
  bunty(B(t, { x: 860 + dx, y: 900, s: .9, look: [-.2, -.6], holdR: 'chai', armR: { h: [50, 40], bend: 30 } })); ar(860 + dx, 460);
  chai(1100 + dx, 800, .8, { t, full: 1 }); ar(1100 + dx, 640);
  gloop({ x: 1300 + dx, y: 900, s: .55, t, melt: .2, look: [-.3, -.6] }); ar(1300 + dx, 760);
};
SH.S18 = (t, u, sh) => {
  const k1 = lt(sh, 1) - .1;
  if (t < k1) {
    cam(960, 540, 1); St.space(t, { n: 30 });
    bunty(B(t, { x: 1250, y: 1500, s: 2.2, face: -1, look: [-.8, .3], eyeS: 1.2, pupil: 5, mouth: { ...talk('B', t), sm: .2 } }));
    chai(760, 860, 3.2, { t, full: 1, flames: 1 });
    gloop({ x: 360, y: 1180, s: 1.3, t, look: [.8, -.2] });
  } else {
    cam(640, 330, 2.4); St.classroom(t, {});
    classN(t, { look: [0, 0], lid: .6, browUp: .6 });
  }
};
EVS.S18 = (sh, add) => { add('rocket', sh.t0 + .3, { d: 1.6 }); };
SH.S19 = (t, u, sh) => {
  cam(960, 540, 1); St.space(t, {});
  const k1 = lt(sh, 1), sqz = Math.sin(P01(t, k1 + .4, k1 + 1.4) * Math.PI);
  terra({ x: 960, y: 560, R: 300, rot: t * .3, face: sqz > .2 ? 'clench' : 'worried', t, bulge: .13 - sqz * .05 });
  // tailor's tape measure around the equator
  push(); translate(960, 560); const w = 300 * (1.13 - sqz * .05);
  shape([...arc(0, 0, w + 8, 40, 0, Math.PI, 30), ...arc(0, 0, w + 8, 20, Math.PI, 0, 30)], { fill: '#FFD23F', lw: 5, shade: () => { for (let k = 0; k < 24; k++) { const x = -w + k * w / 12; stroke([[x, 18], [x, 34]], 3); } } });
  pop();
  callout('+21 km', 960, 180, t, k1 + .5, { size: 76 });
};
EVS.S19 = (sh, add) => { add('tape', lt(sh, 1) + .4); add('squeak', lt(sh, 1) + .9); };
SH.S20 = (t, u, sh) => {
  cam(960, 540, 1);
  reset(); screenRect('#2B2366'); cam(960, 540, 1); St.stars(t, { n: 40 });
  // slice of Earth: centre dot bottom-left, curved surface with two cartoon mountains
  const c = [300, 1950];
  shape(arc(c[0], c[1], 1500, 1500, -1.9, -.3, 60).concat([c]), { fill: '#7A2E1F', lw: 8, shade: () => fillOnly(arc(c[0], c[1], 1420, 1420, -1.9, -.3, 60).concat([c]), '#E84A2F', { boil: .3 }) });
  dot(c[0], c[1] - 10, 14, '#FFD23F');
  const mtn = (a, h, snow, face) => { const x = c[0] + Math.cos(a) * 1500, y = c[1] + Math.sin(a) * 1500; push(); translate(x, y); rotate(a + Math.PI / 2); shape([[-130, 10], [0, -h], [130, 10]], { fill: '#8C6E4E', lw: 7, shade: () => fillOnly([[-40, -h + 70], [0, -h], [40, -h + 70], [10, -h + 56], [-10, -h + 72]], '#F4F1E8', { boil: .3 }) }); if (face) { eye(-24, -h * .45, 12, 14, { lw: 4, skin: '#8C6E4E', look: [0, -1] }); eye(24, -h * .45, 12, 14, { lw: 4, skin: '#8C6E4E', look: [0, -1] }); } pop(); return [x + Math.cos(a) * h, y + Math.sin(a) * h]; };
  const ev = mtn(-1.45, 230, 1, 0), ch = mtn(-.75, 200, 1, 0);
  const d1 = ss(P01(t, lt(sh, 0) + .5, lt(sh, 0) + 1.6)), d2 = ss(P01(t, lt(sh, 1) - .1, lt(sh, 1) + 1.2));
  const dash = (to, d, col) => { const pts = []; for (let i = 0; i < 20 * d; i++) { const a = i / 20, b = (i + .55) / 20; pts.push([lerp(c[0], to[0], a), lerp(c[1], to[1], a)], [lerp(c[0], to[0], b), lerp(c[1], to[1], b)]); } for (let i = 0; i + 1 < pts.length; i += 2) stroke([pts[i], pts[i + 1]], 7, { line: col }); };
  dash([ev[0] + Math.cos(-1.45) * 0, ev[1]], d1, '#FFF4E0'); dash([ch[0] + Math.cos(-.75) * 60, ch[1] + Math.sin(-.75) * 60], d2, '#FFD23F');
  callout('Everest', ev[0] - 10, ev[1] - 70, t, lt(sh, 0) + .3, { size: 48, fill: '#FFF4E0' });
  callout('Chimborazo  +2 km', ch[0] + 140, ch[1] - 90, t, lt(sh, 1) + .3, { size: 52 });
};
EVS.S20 = (sh, add) => { add('ding', lt(sh, 1) + 1.2); };
SH.S21 = (t, u, sh) => {
  cam(960, 560, 1); reset(); screenRect('#2B2366'); cam(960, 560, 1); St.stars(t, { n: 40 });
  shape(rect(-400, 860, 2800, 400), { fill: '#7A2E1F', lw: 7 });
  const droop = ss(P01(u, .4, 1.4));
  push(); translate(900, 870); shape([[-420, 0], [0, -620], [420, 0]], { fill: '#8C6E4E', lw: 8, shade: () => fillOnly([[-150, -400], [0, -620], [150, -400], [60, -420], [0, -380], [-60, -420]], '#F4F1E8', { boil: .3 }) });
  eye(-60, -260, 30, 34, { lw: 6, skin: '#8C6E4E', lid: .4 + droop * .2, look: [.3, .5] }); eye(60, -260, 30, 34, { lw: 6, skin: '#8C6E4E', lid: .4 + droop * .2, look: [.3, .5] });
  mouth(0, -160, 70, { sm: -.9 }); stroke([[0, -620], [0, -760]], 6);
  push(); translate(0, -760); rotate(droop * 1.3); shape([[0, 0], [110, 20], [0, 60]], { fill: '#E23B3B', lw: 5 }); pop();
  pop();
  bunty(B(t, { x: 1460, y: 900, s: .8, face: -1, look: [-.6, -.3], brow: 1.4, armR: { h: [-140, -40 + Math.abs(Math.sin(u * 5)) * -30], bend: 20 }, mouth: { ...talk('B', t), sm: -.6 } }));
};
EVS.S21 = (sh, add) => { add('sadTrombone', sh.t0 + .4); };
SH.S22 = (t, u, sh) => {
  cam(960, 540, 1); St.space(t, {});
  const tide = .7 + .3 * Math.sin(t);
  terra({ x: 700, y: 560, R: 280, rot: t * .25, face: 'sleepy', t, tide: [0, tide], arrows: .6 });
  moon({ x: 1600, y: 520, R: 110, face: 'sleepy' });
  for (let k = 0; k < 4; k++) { const ph = (t * 1.5 + k / 4) % 1; dot(980 + ph * 60, 520 - 40 + k * 26 - ph * 30, 10 * (1 - ph), '#FFF4E0'); }
  push(); translate(985, 560); rotate(.1); shape(rr(-14, -60, 28, 120, 8), { fill: '#3d3542', lw: 5 }); pop();
  callout('+2 ms per century', 960, 930, t, lt(sh, 1) + .5, { size: 60 });
};
SH.S23 = (t, u, sh) => {
  cam(860, 560, 1.05); St.classroom(t, {});
  const k1 = lt(sh, 1), k2 = lt(sh, 2), flip = P01(t, k1 + .3, k2 - .2);
  bunty(B(t, { x: 820, y: 900, s: .9, holdR: 'pillow', armR: { h: [40, 20], bend: 30 }, armL: { h: [80, 10], bend: -20 }, look: [.4, -.4], happy: t < k1, cowlick: t > k2 ? -1 : .5, beard: flip > 0 && flip < 1 ? Math.floor(flip * 3) / 3 + .3 : 0, brow: t > k2 ? 1.5 : .6 }));
  // flip calendar
  push(); translate(1300, 380); shape(rr(-110, -120, 220, 240, 10), { fill: '#FFF4E0', lw: 7, shade: () => fillOnly(rect(-120, -130, 240, 60), '#E23B3B', { boil: .3 }) });
  if (flip > 0 && flip < 1) { const ph = (t * 8) % 1; push(); translate(0, -70); scale(1, 1 - ph); shape(rr(-110, 0, 220, 190, 6), { fill: '#FFF4E0', lw: 5 }); pop(); }
  pop();
  nova(N(t, { x: 480, y: 890, s: .78, look: [.5, 0], lid: .6 }));
  if (flip > 0) callout('17,000,000 years', 1300, 660, t, k1 + .3, { size: 54, dur: k2 - k1 + 1 });
};
EVS.S23 = (sh, add) => { add('calendar', lt(sh, 1) + .3, { d: lt(sh, 2) - lt(sh, 1) - .5 }); add('kazoo', lt(sh, 2) - .1); };
SH.S24 = (t, u, sh) => {
  cam(900, 560, 1.15); St.classroom(t, { table: false });
  shape(rr(940, 640, 260, 240, 10), { fill: '#F7B32B', lw: 7, shade: () => fillOnly(rect(1100, 630, 120, 260), '#C77F1E', { boil: .3 }) });
  fillOnly([[900, 0], [1240, 0], [1160, 640], [980, 640]], 'rgba(255,244,224,.22)', { boil: 0 });
  spinBrake(1070, 640, .8, { t });
  nova(N(t, { x: 720, y: 890, s: .8, look: [.6, 0], browUp: .5, armR: { h: [140, 60], bend: -20 } }));
  gloop({ x: 1300, y: 900, s: .5, t, look: [-.7, -.4], o: .5 + .4 * Math.sin(t * 9) });
};
EVS.S24 = (sh, add) => { add('ding', sh.t0 + .2, { v: .5 }); add('slurp', sh.t0 + 1.2, { d: .6, v: .6 }); };
SH.S25 = (t, u, sh) => {
  const L = sh.lines[0], you = L.t0 + L.d * .78;
  cam(700, 420, lerp(1.6, 2.1, ss(u / sh.d)), { shake: shakeAt(t, you, 10, .25), t });
  St.space(t, {});
  terra({ x: 1150, y: 520, R: 440, rot: t * .1, face: 'none', t });
  shape(spline([[1080, 380], [1110, 300], [1200, 290], [1240, 360], [1190, 430], [1150, 470], [1150, 520], [1130, 520], [1128, 450], [1180, 400], [1190, 350], [1150, 330], [1110, 350], [1100, 390]]), { fill: '#FFF4E0', lw: 6 });
  shape(ell(1140, 580, 22, 22, 14), { fill: '#FFF4E0', lw: 6 });
  St.platform(700, 880, .8);
  nova(N(t, { x: 700, y: 880, s: .8, look: [0, 0], lid: .45, browUp: .4 }));
};
EVS.S25 = (sh, add) => { add('mute', le(sh, 0) - .3, { d: sh.t1 - le(sh, 0) + .3 }); add('tick', le(sh, 0) + .3); add('tick', le(sh, 0) + 1.3); add('portalOpen', sh.t1 - .35, { v: .6 }); };

// ———————————— CH2 · THE FIRST SECOND (city street at dawn, observer deck) ————————————
const deck = (t, x = 960, y = 960, s = .9) => St.platform(x, y, s, { w: 560 });
SH.S26 = (t, u, sh) => {
  cam(960, 520, 1.0);
  St.street(t, { v: 'dawn' });
  deck(t);
  nova(N(t, { x: 820, y: 975, s: .72, holdR: 'clip', armR: { h: [60, 60], bend: 40 }, look: [.4, 0], lid: .5, browUp: t > lt(sh, 1) + 2 ? .6 : 0 }));
  bunty(B(t, { x: 1090, y: 980, s: .78, face: -1, holdR: 'chai', armR: { h: [50, 40], bend: 30 }, look: [.4, -.2] }));
  gloop({ x: 1260, y: 980, s: .4, t, look: [-.5, -.3] });
};
EVS.S26 = (sh, add) => { add('cityDawn', sh.t0); add('paper', lt(sh, 0) + .2, { v: .5 }); };
SH.S27 = (t, u, sh) => {
  cam(960, 540, 1);
  St.cutaway(t, { R: 380 });
  const L = sh.lines[0]; const hits = [.45, .62, .8].map(x => L.t0 + L.d * x);
  hits.forEach((h, i) => { if (t > h) { push(); translate(960, 540); const r = [380 * .93, 380 * .7, 380 * .4][i]; stroke(ell(0, 0, r, r, 40), 10, { line: '#FFF4E0' }); pop(); } });
  push(); translate(960 + 320, 540 - 300); rotate(.15); shape(Array.from({ length: 8 }, (_, i) => [Math.cos(i / 8 * TAU + Math.PI / 8) * 90, Math.sin(i / 8 * TAU + Math.PI / 8) * 90]), { fill: '#E23B3B', lw: 7 }); shape(rr(-50, -12, 100, 24, 6), { fill: '#FFF4E0', lw: 5 }); pop();
  if (t > lt(sh, 1)) for (let i = 0; i < 10; i++) { const a = i / 10 * TAU, r = 430 + ((t * 300 + i * 40) % 200); push(); translate(960 + Math.cos(a) * r, 540 + Math.sin(a) * r); rotate(a + Math.PI / 2); shape([[-14, 0], [0, -30], [14, 0]], { fill: '#FFD23F', lw: 4 }); pop(); }
};
EVS.S27 = (sh, add) => { const L = sh.lines[0]; [.45, .62, .8].forEach(x => add('thunk', L.t0 + L.d * x)); add('whoosh', lt(sh, 1) + .2, { v: .6 }); };
SH.S28 = (t, u, sh) => {
  const pull = le(sh, 1) + .1;
  cam(960, 560, 1.35, { shake: shakeAt(t, pull + .1, 20, .5), t });
  St.street(t, { v: 'dawn', jolt: t > pull + .1 ? Math.sin((t - pull) * 60) * 10 * Math.max(0, 1 - (t - pull) * 2) : 0 });
  deck(t);
  spinBrake(1180, 960, .55, { lever: ss(P01(t, pull, pull + .12)), needle: ss(P01(t, pull + .1, pull + .4)), t });
  nova(N(t, { x: 1040, y: 975, s: .72, face: 1, look: [.5, .4], lid: .55, armR: t > pull - .3 ? { h: [150, 30], bend: 10, fist: true } : { h: [16, 188], bend: 16 } }));
  bunty(B(t, { x: 760, y: 980, s: .78, holdR: 'chai', armR: { h: [50, 40], bend: 30 }, look: [0, 0], lid: .55, brow: 0, mouth: { ...talk('B', t), sm: -.1 } }));
};
EVS.S28 = (sh, add) => { add('clunk', le(sh, 1) + .2); add('rumble', le(sh, 1) + .25, { d: 1.5 }); };
SH.S29 = (t, u, sh) => {
  const hit = lt(sh, 1) + .55;
  cam(960, 540, lerp(1.0, 1.08, u / sh.d), { shake: shakeAt(t, hit, 18, .35), t });
  reset(); screenRect('#7A2E1F'); cam(960, 540, lerp(1.0, 1.08, u / sh.d));
  for (const [x, y] of [[300, 200], [1620, 220], [320, 860], [1600, 880]]) { shape(ell(x, y, 24, 24, 14), { fill: '#C9CED6', lw: 5 }); stroke([[x - 12, y], [x + 12, y]], 4); }
  shape(ell(960, 540, 360, 360, 60), { fill: '#C9CED6', lw: 9 });
  shape(ell(960, 540, 310, 310, 60), { fill: '#FFF4E0', lw: 7, shade: () => { for (let k = 0; k <= 10; k++) { const a = lerp(-3.6, .5, k / 10); stroke([[960 + Math.cos(a) * 250, 540 + Math.sin(a) * 250], [960 + Math.cos(a) * 290, 540 + Math.sin(a) * 290]], 6); } fillOnly(arc(960, 540, 290, 290, -.2, .5, 10).concat(arc(960, 540, 230, 230, .5, -.2, 10)), '#E23B3B', { boil: .3 }); } });
  const v = ss(P01(t, sh.t0 + .3, hit)), a = lerp(-3.6, .62, v) + (t > hit ? Math.sin(t * 60) * .04 : 0);
  stroke([[960, 540], [960 + Math.cos(a) * 270, 540 + Math.sin(a) * 270]], 10, { line: '#E23B3B' }); dot(960, 540, 18);
  if (t > hit) { stroke([[900, 300], [980, 420], [940, 520], [1060, 640], [1010, 760]], 6); stroke([[980, 420], [1100, 380]], 5); }
  callout('47 g', 960, 860, t, hit, { size: 120 });
};
EVS.S29 = (sh, add) => { add('gauge', sh.t0 + .3, { d: lt(sh, 1) + .55 - sh.t0 - .3 }); add('glassCrack', lt(sh, 1) + .55); };
SH.S30 = (t, u, sh) => {
  cam(960, 540, 1);
  reset(); screenRect('#FFB38A'); cam(960, 540, 1);
  bands(['#FFD23F', '#FFB38A', '#E84A2F'], -100, 1100);
  shape([[200, 1100], [300, 300], [1600, 300], [1720, 1100]], { fill: '#5B6270', lw: 8, shade: () => fillOnly([[340, 340], [1580, 340], [1640, 700], [280, 700]], 'rgba(159,211,255,.45)', { boil: .2 }) });
  const out = ss(P01(u, 1.0, 1.8));
  push(); translate(960, 1040);
  shape(rr(-170, -260, 340, 300, 60), { fill: '#3A6EA5', lw: 7 });
  push(); translate(0, -420); rotate(out * .5);
  shape(ell(0, 0, 160, 150, 40), { fill: '#C9CED6', lw: 7, shade: () => fillOnly(ell(0, 20, 120, 100, 30), C.bSkin, { boil: .3 }) });
  eye(-44, 10, 34, 36, { look: [0, -out], lid: 0, pupil: 5, skin: C.bSkin }); eye(44, 10, 34, 36, { look: [0, -out], pupil: 5, skin: C.bSkin });
  mouth(0, 90, 50, { o: out * .5, sm: -.5 });
  pop(); pop();
  shape(rr(1360, 760, 220, 160, 12), { fill: '#3d3542', lw: 6, shade: () => { fillOnly(ell(1470, 840, 60, 60, 20), '#FFF4E0', { boil: .2 }); stroke([[1470, 840], [1470 + Math.cos(-2.4 + out) * 50, 840 + Math.sin(-2.4 + out) * 50]], 5, { line: '#E23B3B' }); } });
  callout('9 g', 1470, 680, t, sh.t0 + .3, { size: 64 });
};
EVS.S30 = (sh, add) => { add('cockpitAlarm', sh.t0 + .2, { d: 1.2 }); add('woozy', sh.t0 + 1.0); };
SH.S31 = (t, u, sh) => {
  const k1 = lt(sh, 1) - .1;
  if (t < k1) {
    cam(840, 690, 1.9); St.street(t, { v: 'dawn' }); deck(t);
    const gulp = Math.sin(P01(t, le(sh, 0) - .2, le(sh, 0) + .3) * Math.PI);
    bunty(B(t, { x: 760, y: 980, s: .78, holdR: 'chai', armR: { h: [50, 40], bend: 30 }, nerv: .6, sweat: u, look: [.4, -.3], brow: 1.4, sq: 1 - gulp * .04, mouth: { ...talk('B', t), sm: -.8 } }));
    // thought bubble: a pancake with a cowlick and a sleep mask
    for (const [x, y, r] of [[950, 520, 14], [1010, 470, 22]]) shape(ell(x, y, r, r, 16), { fill: '#FFF4E0', lw: 5 });
    shape(spline([[1020, 380], [1060, 300], [1160, 280], [1240, 320], [1250, 400], [1180, 440], [1060, 440]]), { fill: '#FFF4E0', lw: 6 });
    shape(ell(1140, 380, 80, 22, 24), { fill: '#C9CED6', lw: 5 }); shape(ell(1140, 368, 64, 18, 24), { fill: '#E8B060', lw: 5 });
    shape(noodle([1140, 352], [1150, 322], 6, 10, 4), { fill: C.bHair, lw: 4 }); shape(rr(1100, 354, 80, 12, 5), { fill: C.mask, lw: 3 });
    if (u > 1) shape(spline([[1170, 362], [1180, 380], [1176, 400], [1168, 384]]), { fill: '#C77F1E', lw: 4 });
  } else { cam(1040, 470, 2.2); St.street(t, { v: 'dawn' }); deck(t); nova(N(t, { x: 1040, y: 975, s: .72, face: -1, look: [0, 0], lid: .6, browUp: .3 })); }
};
EVS.S31 = (sh, add) => { add('gulp', le(sh, 0)); };
SH.S32 = (t, u, sh) => {
  const L = sh.lines[0], hit = L.t0 + .2, dmg = ss(P01(t, hit, hit + .8));
  cam(960, 520, .95, { shake: shakeAt(t, hit, 26, .6), t });
  St.street(t, { v: 'dawn', dmg, jolt: t > hit ? Math.sin((t - hit) * 50) * 14 * Math.max(0, 1 - (t - hit) * 1.5) : 0, auto: 1 });
  if (dmg > 0) for (let i = 0; i < 8; i++) { const ph = P01(t, hit + i * .05, hit + .8 + i * .05); dot(200 + i * 210, 300 + ph * 400, 14 * (1 - ph) + 2, '#E9E1C9'); }
};
EVS.S32 = (sh, add) => { const h = lt(sh, 0) + .2; add('rumble', h, { d: 2.2 }); add('crack', h + .1); add('snap', h + .5); add('crack', h + .9, { v: .7 }); };
SH.S33 = (t, u, sh) => {
  const k1 = lt(sh, 1), go = P01(t, k1 - .1, k1 + 1.4), pan = eo(go) * 600;
  cam(960 + pan, 520, .95, { rot: -.03 * go });
  St.street(t, { v: 'dawn', dmg: 1, auto: 0, stall: 1, wind: go > 0 ? .4 : 0 });
  const fly = (x0, y0, i, draw) => { const x = x0 + eo(go) * (1400 + i * 200) + go * 600, y = y0 - Math.sin(go * Math.PI) * (80 + i * 20); push(); translate(x, y); rotate(go * (2 + i)); draw(); pop(); };
  fly(1300, 880, 0, () => St.autoRick(0, 0, .9));
  fly(380, 560, 1, () => chai(0, 0, .5, { full: 1, steam: 0 }));
  fly(500, 620, 2, () => chai(0, 0, .5, { full: 1, steam: 0 }));
  fly(700, 760, 3, () => St.cow(0, 0, .7, t, { dazed: 1 }));
  for (let i = 0; i < 4; i++) fly(200 + i * 230, 800, i, () => { shape(ell(0, -100, 26, 26, 14), { fill: '#3A2A4A', lw: 5 }); shape(rr(-24, -76, 48, 70, 16), { fill: ['#3A6EA5', '#E23B3B', '#58B05A', '#FFD23F'][i], lw: 5 }); });
  fly(900, 700, 2, () => shape(rr(-50, -34, 100, 68, 4), { fill: '#FFF4E0', lw: 5 }));
  reset(); if (go > 0) speedLines(t, 16, { sp: 3400, col: 'rgba(255,244,224,.8)' });
};
EVS.S33 = (sh, add) => { add('massWhoosh', lt(sh, 1) - .1); add('moo', lt(sh, 1) + .3); add('clinks', lt(sh, 1) + .1); };
SH.S34 = (t, u, sh) => {
  const k1 = lt(sh, 1), dive = P01(t, k1 - .1, k1 + .4);
  cam(960, 540, 1.1);
  St.street(t, { v: 'dawn', dmg: 1, auto: 0, wind: .4 });
  deck(t);
  chai(lerp(200, 1500, P01(u, 0, sh.d)), 380 + Math.sin(u * 1.5) * 30, 1.1, { a: u * 1.2, full: 1, steam: 0 });
  const by = 980 - Math.sin(Math.min(dive, 1) * Math.PI) * 120, bx = 760 + eo(dive) * 120 - ss(P01(t, k1 + .5, k1 + .9)) * 120;
  bunty(B(t, { x: bx, y: by, s: .78, holdR: 'chai', lean: dive > 0 ? .5 * (1 - P01(t, k1 + .5, k1 + .9)) : 0, nerv: .8, eyeS: 1.25, pupil: 2.6, look: [.7, -.6], armL: dive > 0 ? { h: [160, -100], bend: 20 } : undefined, armR: { h: [50, 40], bend: 30 }, mouth: { ...talk('B', t), o: talk('B', t).o * 1.4 } }));
  nova(N(t, { x: 560, y: 975, s: .72, look: [.6, 0], lid: .55, armR: dive > 0 ? { h: [220, -40], bend: 10, fist: true } : undefined }));
};
EVS.S34 = (sh, add) => { add('whoosh', lt(sh, 1) - .1, { v: .6 }); add('cloth', lt(sh, 1) + .5); };
SH.S35 = (t, u, sh) => {
  cam(960, 540, lerp(1, 1.06, u / sh.d));
  St.indiaMap(t, { land: '#E84A2F', sea: '#4A2B57', paper: '#7A2E1F', arrows: 1, storm: .1 + .25 * ss(u / sh.d) });
  callout('?', 300, 540, t, sh.t1 - 2.2, { size: 140, fill: '#E9E1C9' });
};
EVS.S35 = (sh, add) => { add('rumble', sh.t0, { d: sh.d, v: .5 }); };
SH.S36 = (t, u, sh) => {
  const ding = sh.t0 + .75;
  cam(960, 540, 1.25); St.street(t, { v: 'dawn', dmg: 1, auto: 0 }); deck(t);
  const p = t > ding;
  nova(N(t, { x: 820, y: 975, s: .72, look: [.3, 0], lid: .45, browUp: p ? .8 : 0, armR: p ? { h: [40, -150], bend: 10, fist: false } : undefined, mouth: p ? { ...talk('N', t), skew: .7, sm: .3 } : undefined }));
  bunty(B(t, { x: 1090, y: 980, s: .78, face: -1, holdR: 'chai', armR: { h: [50, 40], bend: 30 }, look: [.6, -.2] }));
  gloop({ x: 1260, y: 980, s: .4, t });
};
EVS.S36 = (sh, add) => { add('mute', sh.t0, { d: .75 }); add('rumble', sh.t0, { d: .7, v: .5 }); add('ding', sh.t0 + .75); };
SH.S37 = (t, u, sh) => {
  cam(960, 540, 1); St.space(t, { col: '#7A2E1F', starCol: '#FFD23F' });
  push(); translate(960, 540);
  shape(ell(0, 0, 420, 420, 60), { fill: C.ocean, lw: 8, shade: () => { for (let k = 0; k < 6; k++) { const a = k + .5; fillOnly(ell(Math.cos(a) * 300, Math.sin(a) * 300, 90, 60, 16), C.land, { boil: .4 }); } fillOnly(ell(0, 0, 130, 130, 30), C.ice, { boil: .3 }); } });
  const sh_ = ss(P01(t, lt(sh, 0) + .5, lt(sh, 0) + 2.5));
  [[360, 1], [260, .7], [160, .4]].forEach(([r, f]) => { stroke(ell(0, 0, r, r, 50), 5, { line: '#F7B32B' }); const L = 160 * f * (1 - sh_ * .3); push(); translate(r, 0); shape([[-8, 0], [-8, -L + 20], [-24, -L + 20], [0, -L], [24, -L + 20], [8, -L + 20], [8, 0]], { fill: '#FFD23F', lw: 5 }); pop(); });
  dot(0, 0, 10);
  pop();
  // a tiny polar bear on the cap, barely wobbling
  push(); translate(960, 540); rotate(Math.sin(t * 3) * .03); shape(ell(0, 0, 50, 30, 18), { fill: '#FFFFFF', lw: 5 }); shape(ell(40, -20, 24, 20, 14), { fill: '#FFFFFF', lw: 5 }); dot(52, -24, 3); dot(60, -16, 4); pop();
};
SH.S38 = (t, u, sh) => {
  reset(); screenRect('#FFF4E0');
  // left: a calm research station on white ice, two penguins
  cam(960, 540, 1); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.beginPath(); g.rect(0, 0, 955, 1080); g.clip();
  fillOnly(rect(-1000, -1000, 3000, 3000), '#DFF3FF', { boil: 0 }); shape(rect(-1000, 640, 3000, 1000), { fill: '#FFFFFF', lw: 7 });
  shape(rr(140, 440, 360, 200, 20), { fill: '#E23B3B', lw: 7 }); shape(rr(200, 500, 70, 70, 8), { fill: '#9fd3ff', lw: 5 }); stroke([[440, 440], [440, 300]], 6); shape([[440, 300], [520, 320], [440, 340]], { fill: '#F7B32B', lw: 4 });
  for (const [x, ph] of [[640, 0], [780, 1.3]]) { const b = (Math.floor(q(t) * 12 + ph * 10) % 40) < 2; push(); translate(x, 760); shape(ell(0, -80, 50, 90, 24), { fill: '#1E1428', lw: 6 }); shape(ell(8, -70, 34, 66, 20), { fill: '#FFFFFF', lw: 4 }); dot(-6, -140, b ? 2 : 6, '#fff'); shape([[16, -128], [40, -122], [16, -116]], { fill: '#F7B32B', lw: 4 }); pop(); }
  g.restore();
  // right: Bunty typing on his phone
  cam(1440 - 960 + 480, 540, 1); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.beginPath(); g.rect(965, 0, 955, 1080); g.clip();
  reset(); translate(965, 0); fillOnly(rect(0, 0, 960, 1080), '#FFB38A', { boil: 0 }); bands(['#FFD23F', '#FFB38A'], 0, 700, 0, 960);
  bunty(B(t, { x: 480, y: 1120, s: 1.3, face: -1, holdR: 'phone', armR: { h: [60, -60 + Math.sin(t * 30) * 6], bend: 30 }, look: [.3, .6], brow: .8, nerv: .4, mouth: { ...talk('B', t), sm: .1 } }));
  g.restore();
  reset(); fillOnly(rect(955, 0, 10, 1080), INK, { boil: 0 });
};
EVS.S38 = (sh, add) => { add('phoneTap', lt(sh, 1) - .2, { d: 1.6 }); };
SH.S39 = (t, u, sh) => {
  cam(960, 540, lerp(1.08, 1, ss(u / sh.d))); St.space(t, { col: '#2B2366' });
  St.bigSun(520, 540, 230, t);
  terra({ x: 1550, y: 560, R: 120, rot: t * .5, face: 'worried', t });
  St.hourglass(1040, 560, 1.0, P01(t, lt(sh, 1), le(sh, 1)));
  callout('9 MIN', 1040, 860, t, lt(sh, 1) + 1.2, { size: 96 });
};
EVS.S39 = (sh, add) => { add('shimmer', lt(sh, 1) + .2); add('pop', lt(sh, 1) + 1.2); };
SH.S40 = (t, u, sh) => {
  const z = lerp(2.6, .9, ss(P01(u, .2, sh.d - .5)));
  cam(960, 540, z); St.space(t, { col: '#1E1A4D', n: 30 });
  for (let i = -6; i <= 6; i++) for (let j = -4; j <= 2; j++) St.asteroid(960 + i * 150, 420 + j * 130, 32, i + j + t * .3);
  shape(rect(-2000, 820, 6000, 1400), { fill: '#3E8A43', lw: 7 });
  St.dino(960, 840, .8, { shock: ss(P01(u, 1, 2)), look: [0, -1] });
  callout('× 500,000', 1500, 180, t, lt(sh, 1) + .8, { size: 84 });
};
EVS.S40 = (sh, add) => { add('whoosh', sh.t0 + .3, { v: .5 }); add('gulp', lt(sh, 1) + 1.4); };
SH.S41 = (t, u, sh) => {
  const k1 = lt(sh, 1), op = sh.t1 - 1.2, rush = P01(t, sh.t1 - .4, sh.t1);
  cam(960, 560, 1.25 * lerp(1, 6, ei(rush)));
  St.street(t, { v: 'dawn', dmg: 1, auto: 0 });
  portal(960, 420, 200, t, { open: portalOpen(t, op) });
  deck(t);
  const turn = ss(P01(t, lt(sh, 0), le(sh, 0)));
  bunty(B(t, { x: 760, y: 980, s: .78, holdR: 'chai', armR: { h: [50, 40], bend: 30 }, look: [lerp(-.3, .7, turn), 0], lid: .3, brow: .4 }));
  nova(N(t, { x: 1060, y: 975, s: .72, face: -1, lid: .6, holdR: 'tumbler', armR: { h: [-30, 80 - Math.sin(P01(t, lt(sh, 0) + .3, lt(sh, 0) + 1.5) * Math.PI) * 60], bend: 40 } }));
};
EVS.S41 = (sh, add) => { add('slurp', lt(sh, 0) + .4, { d: .5, v: .5 }); add('portalOpen', sh.t1 - 1.2); add('whooshBig', sh.t1 - .4); };
