// chars.js — the cast: NOVA, BUNTY, GLOOP, TERRA (Earth with a face), the MOON, and props.
// Local coordinates: origin at the feet, y down; face = 1 looks right (3/4 view), -1 mirrors.
import { clamp, lerp, hash, TAU } from '/core/lib.js';
import { INK, push, pop, translate, rotate, scale, shape, fillOnly, stroke, ell, arc, spline, rr, rect, noodle, quad, dot, text, S } from './toon.js';

export const C = {
  white: '#FFFFFF', mouthIn: '#4a1a2a', tongue: '#e8637a', sweat: '#bfe9ff',
  // Nova
  nSkin: '#B9784F', nSkinS: '#94593A', nHair: '#3B1F4A', nHairS: '#26122F', ring: '#C9CED6', ringS: '#8D93A0',
  suit: '#F2A33A', suitS: '#C77F1E', belt: '#1F8A8A', beltS: '#16696A', brass: '#D9B44A', boot: '#4A2B57', bootS: '#341C3F',
  // Bunty
  bSkin: '#8E5A3C', bSkinS: '#6E4029', bHair: '#1A1420', hood: '#FF6B5B', hoodS: '#D94A3E', pj: '#9C8CE0', pjS: '#7A69C9',
  mask: '#5B3F8C', maskS: '#432C6A', rocket: '#FFD23F', fin: '#E23B3B', sock: '#F4E9D8', sockS: '#D8C9B2',
  // Gloop
  gl: '#FF8FC8', glS: '#D9609E', drool: '#FFD1E8',
  // props
  chai: '#B5713A', glass: '#F4E9D8', steel: '#C9CED6', steelS: '#8D93A0', red: '#E23B3B', toast: '#D9DEE6',
  // planets
  ocean: '#2E7FD1', oceanS: '#225E9C', land: '#58B05A', landS: '#3E8A43', ice: '#F4F1E8', moon: '#C9C3E6', moonS: '#8A7FB8', moonC: '#A79DD0',
};

// —— face parts ——
export function eye(cx, cy, rx, ry, { lid = 0, look = [0, 0], pupil = 4.5, skin = C.nSkin, closed = false, lw = 6, jitter = 0, lower = 0, swirl = 0, happy = false } = {}) {
  if (closed) { stroke(arc(cx, cy + ry * .15, rx * .8, ry * .45, Math.PI * .1, Math.PI * .9, 14), lw); return; }
  if (happy) { stroke(arc(cx, cy + ry * .3, rx * .8, ry * .6, Math.PI * 1.1, Math.PI * 1.9, 14), lw); return; }
  shape(ell(cx, cy, rx, ry, 36), {
    fill: C.white, lw, shade: () => {
      if (swirl) { const P = []; for (let i = 0; i < 40; i++) { const a = i * .45 + swirl, r = i / 40 * Math.min(rx, ry) * .85; P.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } stroke(P, lw * .6); }
      else dot(cx + look[0] * rx * .55 + jitter, cy + look[1] * ry * .5, pupil);
      if (lid > 0) {
        const yl = cy - ry + lid * 2 * ry;
        fillOnly([[cx - rx * 1.3, cy - ry * 1.4], [cx + rx * 1.3, cy - ry * 1.4], [cx + rx * 1.3, yl], [cx - rx * 1.3, yl + ry * .08]], skin, { boil: .5 });
        stroke([[cx - rx * 1.2, yl + ry * .08], [cx + rx * 1.2, yl]], lw);
      }
      if (lower > 0) { const yb = cy + ry - lower * 2 * ry; fillOnly([[cx - rx * 1.3, yb], [cx + rx * 1.3, yb], [cx + rx * 1.3, cy + ry * 1.4], [cx - rx * 1.3, cy + ry * 1.4]], skin, { boil: .5 }); stroke([[cx - rx * 1.2, yb], [cx + rx * 1.2, yb]], lw * .8); }
    }
  });
}
export function mouth(cx, cy, mw, { o = 0, w = 1, sm = 0, skew = 0, lw = 6, teeth = true, tongue = true } = {}) {
  const hw = mw * w / 2, k = mw * .22, lc = [cx - hw, cy - sm * k + skew * k], rc = [cx + hw, cy - sm * k - skew * k];
  if (o < .07) { stroke(quad(lc, [cx, cy + sm * k * 1.2], rc, 12), lw); return; }
  const h = o * mw * .62;
  const up = quad(lc, [cx, cy - h * .25 + sm * k * .4], rc, 12), dn = quad(rc, [cx, cy + h + sm * k * .6], lc, 14);
  shape([...up, ...dn], {
    fill: C.mouthIn, lw, shade: () => {
      if (teeth && o > .22) fillOnly(rect(cx - hw * 1.2, cy - h, hw * 2.4, h * .32 + 6), C.white, { boil: .3 });
      if (tongue) fillOnly(ell(cx + hw * .15, cy + h * .95, hw * .6, h * .45, 20), C.tongue, { boil: .3 });
    }
  });
}
export function hand(x, y, ang, r = 18, col = C.nSkin, { fist = false, lw = 6 } = {}) {
  push(); translate(x, y); rotate(ang);
  const pts = fist ? spline([[-r * .6, -r * .8], [r * .7, -r * .9], [r * 1.1, -r * .1], [r * .8, r * .8], [-r * .5, r * .9], [-r * .9, 0]])
    : spline([[-r * .5, -r * .85], [r * .5, -r * 1.05], [r * 1.35, -r * .75], [r * 1.05, -r * .3], [r * 1.5, -r * .1], [r * 1.1, r * .3], [r * 1.35, r * .7], [r * .6, r * .95], [-r * .6, r * .8], [-r * .95, 0]]);
  shape(pts, { fill: col, lw });
  if (!fist) stroke([[r * .2, -r * .15], [r * .75, -r * .45]], lw * .6);
  pop();
}
export const sweat = (x, y, s = 1) => shape(spline([[x, y - 16 * s], [x + 9 * s, y + 4 * s], [x, y + 12 * s], [x - 9 * s, y + 4 * s]]), { fill: C.sweat, lw: 5 });
const star4 = (x, y, r) => [[x, y - r], [x + r * .28, y - r * .28], [x + r, y], [x + r * .28, y + r * .28], [x, y + r], [x - r * .28, y + r * .28], [x - r, y], [x - r * .28, y - r * .28]];
export { star4 };

// —— props ——
export function chai(x, y, s = 1, { full = 1, a = 0, t = 0, steam = 1, flames = 0 } = {}) {
  push(); translate(x, y); rotate(a); scale(s);
  if (flames > 0) for (let k = 0; k < 3; k++) { const L = (40 + 20 * Math.sin(t * 30 + k * 2)) * flames; shape(spline([[-14 + k * 14 - 8, 4], [-14 + k * 14 + 8, 4], [-14 + k * 14, 4 + L]]), { fill: k === 1 ? '#FFD23F' : '#FF8A3C', lw: 5 }); }
  const cup = [[-26, -70], [26, -70], [20, 0], [-20, 0]];
  shape(cup, { fill: C.glass, lw: 6, shade: () => { if (full > 0) fillOnly([[-30, -70 + (1 - full) * 60 + 10], [30, -70 + (1 - full) * 60 + 10], [30, 4], [-30, 4]], C.chai, { boil: .3 }); fillOnly(rect(8, -76, 10, 80), 'rgba(255,255,255,.55)', { boil: .2 }); } });
  stroke([[-25, -56], [25, -56]], 3, { line: '#9b8f7c' });
  if (full > 0 && steam) for (let k = 0; k < 2; k++) { const ph = (t * 1.2 + k * .5) % 1, y0 = -84 - ph * 34, x0 = -10 + k * 20; stroke(spline([[x0, y0], [x0 + 8, y0 - 14], [x0 - 5, y0 - 28]], false), 4, { line: `rgba(255,255,255,${.85 * (1 - ph)})` }); }
  pop();
}
export function remote(x, y, a = 0, { press = 0 } = {}) {
  push(); translate(x, y); rotate(a);
  stroke(spline([[6, -36], [12, -58], [2, -72], [12, -88]], false), 5); dot(12, -88, 6, C.red);
  shape(rr(-20, -40, 40, 72, 8), { fill: '#8d96a3', lw: 6, shade: () => fillOnly(rect(6, -44, 20, 80), '#6c7482', { boil: .3 }) });
  shape(ell(0, -18 + press * 3, 12, 10 - press * 3, 18), { fill: press ? '#ff7b6b' : C.red, lw: 5 });
  shape(rr(-15, 4, 30, 16, 3), { fill: '#f3e27a', lw: 4 });
  for (const bx of [-8, 0, 8]) dot(bx, 12, 2.5, INK);
  pop();
}
// The Spin Brake: a TV remote duct-taped to a chrome toaster, big red lever, cracked dial. lever: 0 up → 1 down
export function spinBrake(x, y, s = 1, { lever = 0, needle = 0, t = 0 } = {}) {
  push(); translate(x, y); scale(s);
  shape(rr(-110, -150, 220, 150, 26), { fill: C.toast, lw: 7, shade: () => { fillOnly(rect(40, -160, 90, 170), '#AEB5C0', { boil: .3 }); fillOnly(rect(-120, -60, 260, 12), '#AEB5C0', { boil: .3 }); } });
  for (const sx of [-50, 10]) shape(rr(sx, -160, 44, 18, 6), { fill: '#3d3542', lw: 5 });
  // remote taped on the front
  push(); translate(-40, -78); rotate(-.12);
  shape(rr(-30, -40, 60, 86, 8), { fill: '#8d96a3', lw: 6 });
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) dot(-12 + j * 24, -20 + i * 18, 4.5, i === 0 && j === 0 ? C.red : '#f3e27a');
  pop();
  for (const ty of [-112, -48]) shape([[-90, ty - 9], [10, ty - 15], [12, ty + 7], [-88, ty + 13]], { fill: '#c7c2a8', lw: 4, alpha: .92 });
  // cracked dial
  shape(ell(62, -86, 34, 34, 28), { fill: '#FFF4E0', lw: 6, shade: () => { stroke([[44, -110], [58, -92], [52, -78], [70, -62]], 3); } });
  const na = lerp(-2.4, -.7, needle) + (needle > .99 ? Math.sin(t * 50) * .08 : 0);
  stroke([[62, -86], [62 + Math.cos(na) * 26, -86 + Math.sin(na) * 26]], 5, { line: C.red }); dot(62, -86, 5);
  // lever (pivot on the right side)
  const la = lerp(-1.25, .55, lever);
  push(); translate(118, -96); rotate(la);
  shape(noodle([0, 0], [0, -120], 0, 16, 14), { fill: '#6c7482', lw: 6 });
  shape(ell(0, -132, 26, 24, 22), { fill: C.red, lw: 6, shade: () => fillOnly(ell(8, -126, 14, 14, 14), '#B42828', { boil: .3 }) });
  pop();
  shape(ell(118, -96, 16, 16, 16), { fill: '#3d3542', lw: 5 });
  pop();
}
export function tumbler(x, y, s = 1, a = 0) { push(); translate(x, y); rotate(a); scale(s); shape([[-20, -66], [20, -66], [16, 0], [-16, 0]], { fill: C.steel, lw: 6, shade: () => fillOnly(rect(4, -70, 20, 74), C.steelS, { boil: .3 }) }); stroke([[-20, -56], [20, -56]], 3); pop(); }
export function clipboard(x, y, s = 1, a = 0) { push(); translate(x, y); rotate(a); scale(s); shape(rr(-44, -60, 88, 116, 6), { fill: '#C9A06A', lw: 6 }); shape(rr(-34, -46, 68, 92, 3), { fill: '#FFF4E0', lw: 4, shade: () => { for (let k = 0; k < 5; k++) stroke([[-24, -30 + k * 16], [20 - (k % 2) * 14, -30 + k * 16]], 3, { line: '#8a7f6a' }); } }); shape(rr(-18, -68, 36, 16, 4), { fill: '#6c7482', lw: 5 }); pop(); }
export function phone(x, y, s = 1, a = 0, glowScr = '#9fd3ff') { push(); translate(x, y); rotate(a); scale(s); shape(rr(-20, -38, 40, 76, 8), { fill: '#3d3542', lw: 5 }); fillOnly(rr(-14, -30, 28, 58, 4), glowScr, { boil: .3 }); pop(); }

// ———————————— NOVA ————————————
// P: {x,y,s,face,lean,bob,sq, lid,look,brow,browUp,mouth:{o,w,sm,skew},blink,closed,happy, armR/armL:{h:[dx,dy],bend}, holdR/holdL, legL/legR, headTilt, sweat, hair:[dx], ringTilt}
export function nova(P) {
  const f = P.face ?? 1;
  push(); translate(P.x, P.y + (P.bob || 0)); scale((P.s ?? 1) * f, (P.s ?? 1) * (P.sq ?? 1));
  const legL = P.legL || [0, 0], legR = P.legR || [0, 0];
  for (const [sx, lg] of [[-1, legL], [1, legR]]) {
    const hip = [sx * 22, -250], ank = [sx * 26 + lg[0], -36 + lg[1]];
    shape(noodle(hip, ank, sx * -4, 40, 32), { fill: C.suit, lw: 7, shade: () => fillOnly(rect(sx > 0 ? 10 : -200, -260, 200, 260), sx > 0 ? C.suitS : 'rgba(0,0,0,0)', { boil: .3 }) });
    shape(spline([[ank[0] - 22, ank[1] + 34], [ank[0] - 22, ank[1] - 8], [ank[0] + 16, ank[1] - 8], [ank[0] + 44, ank[1] + 18], [ank[0] + 44, ank[1] + 36]]), { fill: C.boot, lw: 7, shade: () => fillOnly(rect(ank[0] - 40, ank[1] + 26, 110, 20), C.bootS, { boil: .3 }) });
  }
  push(); rotate(P.lean ?? .02);
  const shB = [-40, -462], shF = [42, -460];
  const armB = P.armL || { h: [-12, 190], bend: -16 }, armF = P.armR || { h: [16, 188], bend: 16 };
  const drawArm = (sh, arm, hold) => {
    const hp = [sh[0] + arm.h[0], sh[1] + arm.h[1]], ang = Math.atan2(hp[1] - sh[1], hp[0] - sh[0]);
    shape(noodle(sh, hp, arm.bend ?? 0, 30, 24), { fill: C.nSkin, lw: 7 });
    const el = [sh[0] + arm.h[0] * .5 + Math.cos(ang + Math.PI / 2) * (arm.bend ?? 0) * .5, sh[1] + arm.h[1] * .5 + Math.sin(ang + Math.PI / 2) * (arm.bend ?? 0) * .5];
    shape(noodle(sh, el, (arm.bend ?? 0) * .25, 40, 36), { fill: C.suit, lw: 7 });
    if (hold === 'remote') { hand(hp[0], hp[1], ang, 18, C.nSkin, { fist: true }); remote(hp[0] + 6, hp[1] - 22, -(P.lean ?? 0) + (arm.ra || 0), { press: P.press || 0 }); return; }
    if (hold === 'tumbler') { tumbler(hp[0] + 6, hp[1] + 30, .9, arm.ra || 0); hand(hp[0], hp[1], ang, 18, C.nSkin, { fist: true }); return; }
    if (hold === 'clip') { clipboard(hp[0] + 20, hp[1] - 10, .9, .1); hand(hp[0], hp[1], ang, 18, C.nSkin, { fist: true }); return; }
    if (hold === 'mask') { hand(hp[0], hp[1], ang, 18, C.nSkin, { fist: true }); shape(ell(hp[0] + 24, hp[1] - 20, 22, 16, 16), { fill: '#bfe9ff', lw: 5 }); stroke([[hp[0] + 6, hp[1] - 20], [hp[0] - 8, hp[1] + 10]], 3); return; }
    hand(hp[0], hp[1], ang, 18, C.nSkin, { fist: !!arm.fist });
  };
  drawArm(shB, armB, P.holdL);
  // jumpsuit torso
  const body = spline([[0, -476], [44, -466], [56, -400], [50, -320], [54, -250], [0, -236], [-54, -250], [-50, -320], [-56, -400], [-44, -466]]);
  shape(body, {
    fill: C.suit, lw: 7, shade: () => {
      fillOnly(spline([[22, -480], [70, -460], [80, -320], [70, -230], [30, -230], [36, -330]]), C.suitS, { boil: .4 });
      fillOnly([[-14, -478], [14, -478], [0, -444]], C.nSkin, { boil: .4 });
    }
  });
  stroke([[0, -444], [0, -288]], 5);                        // zip
  for (const [px, py] of [[-34, -420], [14, -420], [-34, -370], [14, -370]]) {   // 4 chest pockets full of junk
    if (px > 0 && py < -400) { stroke([[px + 6, py - 4], [px + 2, py - 30]], 5); dot(px + 2, py - 32, 4, '#3d3542'); }
    if (px < 0 && py < -400) shape(ell(px + 12, py - 8, 7, 10, 10), { fill: '#C9CED6', lw: 4 });
    if (px > 0 && py > -400) shape(rr(px + 2, py - 18, 8, 22, 2), { fill: C.red, lw: 3 });
    shape(rr(px, py, 22, 26, 3), { fill: C.suit, lw: 4 });
  }
  shape(rr(-58, -296, 116, 26, 6), { fill: C.belt, lw: 6, shade: () => fillOnly(rect(20, -300, 50, 40), C.beltS, { boil: .3 }) });
  shape(rr(-14, -298, 28, 30, 4), { fill: C.brass, lw: 5 });
  // neck + head
  shape(noodle([4, -470], [8, -510], 0, 24, 24), { fill: C.nSkin, lw: 6 });
  push(); translate(10, -588); rotate(P.headTilt ?? .04);
  novaHead(P);
  pop();
  drawArm(shF, armF, P.holdR);
  pop();
  if (P.sweat != null) sweat(110, -620 + (P.sweat % 1) * 20, 1);
  pop();
}
function novaHead(P) {
  // bun + floating ring (back half behind the bun)
  const rt = P.ringTilt ?? -.22, bx = -8, by = -128;
  push(); translate(bx, by); rotate(rt); stroke(arc(0, 0, 82, 18, Math.PI, TAU, 26), 13); stroke(arc(0, 0, 82, 18, Math.PI, TAU, 26), 6, { line: C.ring }); pop();
  shape(ell(bx, by, 46, 44, 32), { fill: C.nHair, lw: 7, shade: () => { fillOnly(ell(bx + 18, by + 10, 30, 32, 20), C.nHairS, { boil: .3 }); stroke(arc(bx - 4, by, 28, 26, -2.4, -.6, 12), 3, { line: '#5a3470' }); } });
  push(); translate(bx, by); rotate(rt); stroke(arc(0, 0, 82, 18, 0, Math.PI, 26), 13); stroke(arc(0, 0, 82, 18, 0, Math.PI, 26), 6, { line: C.ring }); pop();
  // ear
  shape(ell(-50, 4, 12, 18, 16), { fill: C.nSkin, lw: 6, shade: () => fillOnly(ell(-47, 6, 5, 9, 10), C.nSkinS, { boil: .3 }) });
  // head: long narrow oval, pointed chin
  const HD = spline([[-4, -92], [40, -84], [60, -40], [62, 20], [46, 70], [14, 100], [-14, 86], [-46, 50], [-60, -6], [-52, -60]]);
  shape(HD, {
    fill: C.nSkin, lw: 7, shade: () => {
      fillOnly(spline([[-70, -10], [-50, 60], [0, 104], [-80, 110]]), C.nSkinS, { boil: .3 });
      // hair cap + side fringe (left)
      fillOnly(spline([[-70, -40], [-50, -96], [10, -110], [62, -76], [60, -50], [20, -70], [-20, -66], [-44, -30], [-58, 10]]), C.nHair, { boil: .4 });
    }
  });
  shape(spline([[-36, -72], [-10, -80], [-2, -56], [-22, -26], [-40, -12], [-50, -30]]), { fill: C.nHair, lw: 6 });   // fringe
  // eyes (big, touching in 3/4), heavy lids, eye bags
  const lid = P.blink ? 1 : clamp(P.lid ?? .5, 0, 1), look = P.look || [0, 0];
  const eo = { lid: P.closed ? 0 : lid, look, closed: P.closed, happy: P.happy, pupil: 4.5, skin: C.nSkin };
  eye(4, -8, 26, 30, eo); eye(44, -10, 20, 26, { ...eo, pupil: 4 });
  if (!P.closed && !P.happy) for (const [ex, rx] of [[4, 20], [44, 15]]) stroke(arc(ex, 26, rx, 7, Math.PI * .2, Math.PI * .8, 10), 3.5);
  // brows: flat; browUp raises the far brow (signature "Flat Brow")
  const br = P.brow ?? 0, bu = P.browUp ?? 0;
  shape(rr(-18, -50 - br * 8, 40, 10, 5), { fill: C.nHair, lw: 4 });
  push(); translate(44, -48 - br * 8 - bu * 16); rotate(-bu * .25); shape(rr(-16, -5, 34, 10, 5), { fill: C.nHair, lw: 4 }); pop();
  // nose (part of the outline)
  stroke(spline([[30, 4], [42, 30], [30, 36]], false), 5);
  const m = P.mouth || {};
  mouth(28 + (m.skew || 0) * 4, 62, 44, { o: m.o || 0, w: m.w ?? 1, sm: m.sm ?? -.1, skew: m.skew ?? .35, lw: 5 });
}

// ———————————— BUNTY ————————————
// P: {x,y,s,face,lean,bob,sq,t, nerv, look, eyeS, pupil, blink, brow, mouth, armR/armL, holdR ('chai'|'phone'|'tv'), legL/legR, headTilt, sweat, cowlick (−1 droop … 1 straight), maskDown, beard, blanket}
export function bunty(P) {
  const f = P.face ?? 1, ner = P.nerv ?? 0, t = P.t || 0;
  const jit = ner ? (hash(Math.floor(t * 12) * 3.3) - .5) * 7 * ner : 0;
  push(); translate(P.x + jit, P.y + (P.bob || 0)); scale((P.s ?? 1) * f, (P.s ?? 1) * (P.sq ?? 1));
  const legL = P.legL || [0, 0], legR = P.legR || [0, 0];
  for (const [sx, lg] of [[-1, legL], [1, legR]]) {
    const hip = [sx * 26, -104], ank = [sx * 30 + lg[0], -26 + lg[1]];
    shape(noodle(hip, ank, 0, 40, 36), { fill: C.pj, lw: 6, shade: () => { for (let k = 0; k < 4; k++) fillOnly(rect(-200, -100 + k * 20 + lg[1] * .3, 400, 6), C.pjS, { boil: .3 }); for (let k = 0; k < 3; k++) fillOnly(rect(sx * 30 - 22 + k * 16, -110, 5, 100), C.pjS, { boil: .3 }); } });
    if (sx < 0) {   // left foot: plain sock
      shape(spline([[ank[0] - 22, ank[1] + 24], [ank[0] - 20, ank[1] - 4], [ank[0] + 12, ank[1] - 6], [ank[0] + 34, ank[1] + 10], [ank[0] + 30, ank[1] + 26]]), { fill: C.sock, lw: 6, shade: () => fillOnly(rect(ank[0] - 30, ank[1] + 16, 80, 20), C.sockS, { boil: .3 }) });
    } else {        // right foot: fuzzy rocket slipper
      const ax = ank[0], ay = ank[1];
      shape([[ax - 4, ay + 4], [ax - 18, ay - 14], [ax - 10, ay + 10]], { fill: C.fin, lw: 5 });
      shape([[ax - 4, ay + 26], [ax - 24, ay + 34], [ax - 8, ay + 14]], { fill: C.fin, lw: 5 });
      shape(spline([[ax - 18, ay + 26], [ax - 18, ay - 2], [ax + 20, ay - 6], [ax + 58, ay + 10], [ax + 20, ay + 28]]), { fill: C.rocket, lw: 6, shade: () => { fillOnly(rect(ax - 30, ay + 18, 100, 20), '#E0B32A', { boil: .3 }); dot(ax + 20, ay + 8, 6, '#9fd3ff'); } });
    }
  }
  push(); rotate(P.lean ?? 0);
  const shB = [-52, -222], shF = [52, -222];
  const armB = P.armL || { h: [-14, 96], bend: -14 }, armF = P.armR || { h: [14, 96], bend: 14 };
  const drawArm = (sh, arm, hold) => {
    const hp = [sh[0] + arm.h[0], sh[1] + arm.h[1]], ang = Math.atan2(hp[1] - sh[1], hp[0] - sh[0]);
    shape(noodle(sh, hp, arm.bend ?? 0, 36, 30), { fill: C.hood, lw: 6, shade: () => fillOnly(ell(hp[0], hp[1], 20, 20, 12), C.hoodS, { boil: .3 }) });
    if (hold === 'chai') { chai(hp[0] + 8, hp[1] + 10, .62, { full: P.chaiFull ?? 1, t, a: arm.ra || 0 }); hand(hp[0], hp[1], ang, 14, C.bSkin, { fist: true }); return; }
    if (hold === 'phone') { phone(hp[0] + 6, hp[1] - 18, .9, -.2); hand(hp[0], hp[1], ang, 14, C.bSkin, { fist: true }); return; }
    if (hold === 'pillow') { shape(rr(hp[0] - 50, hp[1] - 36, 100, 70, 26), { fill: '#F4E9D8', lw: 6 }); hand(hp[0], hp[1], ang, 14, C.bSkin, { fist: true }); return; }
    hand(hp[0], hp[1], ang, 14, C.bSkin, { fist: !!arm.fist });
  };
  drawArm(shB, armB, P.holdL);
  // hoodie: pear-shaped
  const hb = spline([[0, -250], [52, -236], [74, -170], [78, -112], [0, -96], [-78, -112], [-74, -170], [-52, -236]]);
  shape(hb, {
    fill: C.hood, lw: 7, shade: () => {
      fillOnly(spline([[30, -260], [86, -220], [96, -100], [40, -90], [60, -170]]), C.hoodS, { boil: .4 });
      fillOnly(rect(-90, -122, 180, 30), C.hoodS, { boil: .3 });
    }
  });
  // moon patch + pocket
  shape(spline([[-34, -200], [-10, -214], [-4, -180], [-24, -156], [-46, -170], [-26, -176], [-22, -194]]), { fill: '#FFFFFF', lw: 4 });
  stroke(spline([[-40, -136], [0, -128], [40, -136]], false), 4);
  // hood bunched behind neck
  shape(spline([[-58, -248], [0, -268], [58, -248], [40, -232], [0, -240], [-40, -232]]), { fill: C.hood, lw: 6 });
  for (const sx of [-16, 16]) stroke([[sx, -244], [sx + sx * .1, -200]], 4, { line: '#FFF4E0' });
  // head
  push(); translate(0, -330); rotate(P.headTilt ?? 0);
  buntyHead(P, ner);
  pop();
  drawArm(shF, armF, P.holdR);
  pop();
  if (P.blanket) shape(spline([[-96, -236], [0, -250], [96, -236], [104, -60], [0, -40], [-104, -60]]), { fill: '#7FA8C9', lw: 7, shade: () => { for (let k = 0; k < 4; k++) fillOnly(rect(-120, -220 + k * 44, 240, 14), '#5E8BAF', { boil: .3 }); } });
  if (P.sweat != null) { const u = P.sweat % 1; sweat(-96, -420 + u * 40, 1); sweat(100, -400 + ((u + .5) % 1) * 40, .8); }
  pop();
}
function buntyHead(P, ner) {
  for (const sx of [-1, 1]) shape(ell(sx * 92, 8, 20, 26, 16), { fill: C.bSkin, lw: 6, shade: () => fillOnly(ell(sx * 90, 10, 8, 14, 10), C.bSkinS, { boil: .3 }) });
  const head = spline([[0, -84], [62, -78], [94, -30], [96, 30], [70, 74], [0, 86], [-70, 74], [-96, 30], [-94, -30], [-62, -78]]);
  shape(head, {
    fill: C.bSkin, lw: 7, shade: () => {
      fillOnly(ell(54, 40, 60, 70, 30), C.bSkinS, { boil: .3 });
      fillOnly(spline([[-110, -10], [-90, -70], [-40, -100], [40, -104], [96, -70], [110, -10], [70, -48], [20, -60], [-30, -56], [-80, -40]]), C.bHair, { boil: .4 });
      if (P.beard) fillOnly(spline([[-90, 20], [0, 50], [90, 20], [80, 100 + P.beard * 60], [0, 120 + P.beard * 90], [-80, 100 + P.beard * 60]]), '#9b9b9b', { boil: .4 });
    }
  });
  // messy mop tufts + cowlick
  for (const [x, y, a] of [[-70, -62, -.6], [-30, -82, -.2], [20, -84, .2], [64, -64, .6]]) shape(spline([[x - 18, y + 8], [x + Math.sin(a) * 30, y - 26], [x + 18, y + 8]]), { fill: C.bHair, lw: 5 });
  const cw = P.cowlick ?? 0;
  shape(noodle([0, -84], [lerp(46, 4, (cw + 1) / 2), lerp(-104, -168, (cw + 1) / 2)], lerp(-20, 8, (cw + 1) / 2), 22, 8), { fill: C.bHair, lw: 5 });
  // sleep mask on forehead (or pulled down over the eyes)
  if (P.maskDown) {
    shape(rr(-96, -26, 192, 56, 24), { fill: C.mask, lw: 6, shade: () => fillOnly(rect(-100, 14, 200, 20), C.maskS, { boil: .3 }) });
    stroke(arc(-40, 0, 20, 10, Math.PI * .1, Math.PI * .9, 8), 4, { line: '#FFF4E0' }); stroke(arc(40, 0, 20, 10, Math.PI * .1, Math.PI * .9, 8), 4, { line: '#FFF4E0' });
  } else {
    shape(rr(-96, -76, 192, 30, 14), { fill: C.mask, lw: 6, shade: () => fillOnly(rect(-100, -56, 200, 12), C.maskS, { boil: .3 }) });
  }
  // brows (worried by default: inner ends up)
  const br = P.brow ?? 1;
  if (!P.maskDown) { stroke([[-74, -34 + br * 2], [-28, -42 - br * 8]], 8); stroke([[74, -34 + br * 2], [28, -42 - br * 8]], 8); }
  // eyes: huge, touching, trembling pupils
  const look = P.look || [0, 0], shake = ner ? (hash(Math.floor((P.t || 0) * 24) * 1.7) - .5) * 4 * ner : 0, es = P.eyeS ?? 1;
  if (!P.maskDown) for (const ex of [-34, 34]) eye(ex, 4, 34 * es, 38 * es, { lid: P.blink ? 1 : (P.lid ?? 0), look, pupil: P.pupil ?? 4, skin: C.bSkin, jitter: shake, lw: 6, closed: P.closed, happy: P.happy, swirl: P.swirl });
  shape(ell(0, 48, 12, 9, 12), { fill: C.bSkinS, lw: 5 });
  const m = P.mouth || {};
  mouth(0, 66 + ((P.mouthS ?? 1) - 1) * 8, 46 * (P.mouthS ?? 1), { o: m.o || 0, w: m.w ?? 1, sm: m.sm ?? -.3, skew: m.skew || 0, lw: 6, teeth: true });
}

// ———————————— GLOOP ————————————
// P: {x,y,s,sq,t,look,o (mouth),melt,blink,mask,shock,flat (flag in wind)}
export function gloop(P) {
  const t = P.t || 0, s = P.s ?? 1, melt = P.melt ?? 0, sq = (P.sq ?? 1) * (1 - melt * .35);
  push(); translate(P.x, P.y); scale(s * (1 + melt * .4), s * sq);
  if (P.flat) { rotate(-Math.PI / 2 * P.flat); }
  // puddle
  shape(ell(0, 0, 70 + melt * 30, 12, 24), { fill: C.gl, lw: 5 });
  const wob = Math.sin(t * 7) * 4;
  const body = spline([[-66, -6], [-62, -70], [-30 + wob * .5, -130], [0 + wob, -168], [30 + wob * .5, -130], [62, -70], [66, -6]]);
  shape(body, {
    fill: C.gl, lw: 7, shade: () => { fillOnly(ell(36, -50, 40, 70, 24), C.glS, { boil: .4 }); fillOnly(ell(-30, -110, 8, 18, 10), 'rgba(255,255,255,.5)', { boil: .2 }); }
  });
  for (const [dx, L] of [[-50, 22], [42, 30]]) shape(spline([[dx - 8, -8], [dx + 8, -8], [dx + 6, -8 + L * .7], [dx, -8 + L], [dx - 6, -8 + L * .7]]), { fill: C.gl, lw: 5 });
  // three eyes in a row (middle biggest)
  const look = P.look || [0, 0];
  [[-30, -86, 14, 16], [2, -96, 22, 25], [34, -84, 12, 14]].forEach(([x, y, rx, ry], i) => {
    if (P.blink || melt > .5) stroke(arc(x, y + 4, rx * .8, ry * .6, Math.PI * 1.1, Math.PI * 1.9, 10), 5);
    else eye(x, y, rx * (P.shock ? 1.3 : 1), ry * (P.shock ? 1.3 : 1), { look, pupil: P.shock ? 2.5 : 3.5, lw: 5, skin: C.gl });
  });
  if (P.mask) shape(rr(-50, -112, 100, 36, 16), { fill: '#3F6FA0', lw: 5 });
  // mouth: wide, drooling, two tiny teeth
  const o = P.o ?? .15;
  shape([...quad([-36, -46], [0, -40], [36, -46], 10), ...quad([36, -46], [0, -46 + 30 * o + 8], [-36, -46], 10)], { fill: C.mouthIn, lw: 5, shade: () => { fillOnly(rect(-14, -50, 10, 12), C.white, { boil: .2 }); fillOnly(rect(6, -50, 10, 12), C.white, { boil: .2 }); } });
  shape(spline([[22, -42], [30, -42], [28, -24], [26, -18], [24, -24]]), { fill: C.drool, lw: 4 });
  pop();
}

// ———————————— TERRA ————————————
// Abstract cartoon continents (not real geography) on a sphere; face sits on top of the map.
// P: {x,y,R,rot,mode:'normal'|'new'|'stopped',face:'sleepy'|'happy'|'shock'|'dizzy'|'worried'|'sad'|'thirsty'|'relief'|'clench'|'none', bulge, split (0..1 day side right), t, look, arrows, tide:[angle,amount], drain}
const BLOBS = [[0.3, .5, .45], [1.4, .25, .55], [2.2, -.35, .42], [3.3, .4, .6], [4.3, -.2, .5], [5.3, .55, .38], [5.8, -.45, .35], [2.9, -.6, .3]];
export function terra(P) {
  const R = P.R ?? 220, rot = P.rot ?? 0, bul = P.bulge ?? 0, t = P.t || 0, mode = P.mode || 'normal';
  push(); translate(P.x, P.y); scale(1 + bul, 1 - bul * .5);
  const disc = ell(0, 0, R, R, 72);
  shape(disc, {
    fill: mode === 'new' ? '#3E8A6A' : C.ocean, lw: 8, shade: () => {
      if (mode === 'new') {
        fillOnly(rect(-R * 1.2, -R * .62, R * 2.4, R * 1.24), '#9FE3C1', { boil: .3 });
        for (let i = 0; i < 6; i++) { const a = rot + i * 1.05, x = Math.sin(a) * R * .8; if (Math.cos(a) > 0) fillOnly(ell(x, (hash(i) - .5) * R * .6, R * .22 * Math.cos(a), R * .14, 18), '#FF7F6A', { boil: .3 }); }
        fillOnly(rect(-R * 1.2, -R * 1.2, R * 2.4, R * .58), C.ocean, { boil: .3 }); fillOnly(rect(-R * 1.2, R * .62, R * 2.4, R * .6), C.ocean, { boil: .3 });
        fillOnly(rect(-R * 1.2, -R * 1.2, R * 2.4, R * .25), C.ice, { boil: .3 }); fillOnly(rect(-R * 1.2, R * .95, R * 2.4, R * .3), C.ice, { boil: .3 });
      } else {
        const drain = P.drain ?? 0;
        if (drain > 0) { fillOnly(rect(-R * 1.2, -R * .62 * drain, R * 2.4, R * 1.24 * drain), '#B98A52', { boil: .3 }); }
        for (const [lon, lat, sz] of BLOBS) {
          const a = lon - rot, c = Math.cos(a); if (c < -.1) continue;
          const x = Math.sin(a) * Math.cos(lat) * R, y = -Math.sin(lat) * R, w = sz * R * .45 * Math.max(.15, c), h = sz * R * .38;
          const pts = []; for (let k = 0; k < 9; k++) { const b = k / 9 * TAU, rr_ = 1 + .25 * Math.sin(b * 3 + lon * 5); pts.push([x + Math.cos(b) * w * rr_, y + Math.sin(b) * h * rr_]); }
          fillOnly(spline(pts), drain > 0 ? '#C99A5E' : C.land, { boil: .4 });
        }
        fillOnly(rect(-R * 1.2, -R * 1.2, R * 2.4, R * .22), C.ice, { boil: .3 }); fillOnly(rect(-R * 1.2, R * .98, R * 2.4, R * .25), C.ice, { boil: .3 });
      }
      // flat hard shadow (light from upper left)
      fillOnly(spline([[R * .3, -R * 1.1], [R * 1.2, -R * .2], [R * 1.1, R * 1.1], [-R * .4, R * 1.2], [R * .55, R * .4]]), 'rgba(20,10,40,.22)', { boil: .3 });
      if (P.split != null) {   // day side right, night side left
        const sx = lerp(-R * 1.3, R * 1.3, 1 - P.split);
        fillOnly(rect(-R * 1.3, -R * 1.3, sx + R * 1.3, R * 2.6), 'rgba(16,26,61,.78)', { boil: .3 });
        fillOnly(rect(sx - 10, -R * 1.3, 22, R * 2.6), 'rgba(255,138,138,.85)', { boil: .3 });
        if (P.splitHot) fillOnly(rect(sx + 12, -R * 1.3, R * 2.6, R * 2.6), 'rgba(194,65,12,.45)', { boil: .3 });
      }
    }
  });
  if (P.tide) { const [ang, amt] = P.tide; push(); rotate(ang); fillOnly(ell(0, 0, R * (1 + .16 * amt), R * (1 - .04 * amt), 60), 'rgba(46,127,209,.45)', { boil: .5 }); stroke(ell(0, 0, R * (1 + .16 * amt), R * (1 - .04 * amt), 60), 4, { line: 'rgba(30,20,40,.5)' }); pop(); shape(disc, { line: INK, lw: 8, stroke: true }); }
  // face
  const fc = P.face ?? 'sleepy', look = P.look || [0, 0], fs = R / 220;
  if (fc !== 'none') {
    push(); scale(fs);
    const ey = -20, ex = 48;
    const E = (x, o) => eye(x, ey, 30, 34, { lw: 6, skin: C.ocean, look, ...o });
    if (fc === 'sleepy') { E(-ex, { lid: .55 }); E(ex, { lid: .55 }); mouth(0, 60, 50, { sm: .6 }); }
    else if (fc === 'happy') { E(-ex, { happy: true }); E(ex, { happy: true }); mouth(0, 56, 60, { o: .5, sm: .9 }); }
    else if (fc === 'relief') { E(-ex, { lid: .35 }); E(ex, { lid: .35 }); mouth(0, 60, 56, { sm: .8 }); }
    else if (fc === 'shock') { E(-ex, { pupil: 3 }); E(ex, { pupil: 3 }); mouth(0, 62, 40, { o: .8, w: .7 }); }
    else if (fc === 'dizzy') { E(-ex, { swirl: t * 9 }); E(ex, { swirl: -t * 9 }); mouth(0, 60, 50, { sm: -.5, skew: .5 }); }
    else if (fc === 'worried') { E(-ex, { pupil: 4, look: [.2, -.3] }); E(ex, { pupil: 4, look: [.2, -.3] }); mouth(0, 62, 46, { sm: -.7 }); stroke([[-80, -70], [-30, -80]], 7); stroke([[80, -70], [30, -80]], 7); }
    else if (fc === 'clench') { E(-ex, { closed: true }); E(ex, { closed: true }); shape(rr(-34, 48, 68, 24, 8), { fill: '#fff', lw: 5 }); stroke([[-34, 60], [34, 60]], 3); }
    else if (fc === 'thirsty') { E(-ex, { lid: .3, look: [0, .6] }); E(ex, { lid: .3, look: [0, .6] }); mouth(0, 62, 40, { o: .4, w: .6, sm: -.4 }); }
    else if (fc === 'sad') { E(-ex, { lid: .3, look: [0, .4] }); E(ex, { lid: .3, look: [0, .4] }); mouth(0, 66, 44, { sm: -.8 }); }
    pop();
  }
  // saffron motion arrows around the equator (when spinning)
  if (P.arrows) {
    const a = P.arrows;
    for (let k = 0; k < 3; k++) {
      const off = ((t * .6 + k / 3) % 1);
      push(); translate(0, R * .05);
      const a0 = Math.PI * (.15 + off * .7), P_ = arc(0, 0, R * 1.18, R * .32, a0, a0 + .45, 10);
      stroke(P_, 13, { alpha: a }); stroke(P_, 7, { line: '#F7B32B', alpha: a });
      const e = P_[P_.length - 1], d = P_[P_.length - 2], an = Math.atan2(e[1] - d[1], e[0] - d[0]);
      shape([[e[0] + Math.cos(an) * 18, e[1] + Math.sin(an) * 18], [e[0] + Math.cos(an + 2.3) * 16, e[1] + Math.sin(an + 2.3) * 16], [e[0] + Math.cos(an - 2.3) * 16, e[1] + Math.sin(an - 2.3) * 16]], { fill: '#F7B32B', lw: 5, alpha: a });
      pop();
    }
  }
  pop();
}

// ———————————— THE MOON ————————————
export function moon(P) {
  const R = P.R ?? 120, fc = P.face ?? 'sleepy';
  push(); translate(P.x, P.y); if (P.a) rotate(P.a);
  shape(ell(0, 0, R, R, 60), {
    fill: C.moon, lw: 8, shade: () => {
      fillOnly(spline([[R * .3, -R * 1.1], [R * 1.2, -R * .2], [R * 1.1, R * 1.1], [-R * .4, R * 1.2], [R * .55, R * .4]]), C.moonS, { boil: .3 });
      for (const [x, y, r] of [[-.45, -.45, .2], [.5, .45, .16], [-.55, .4, .12]]) shape(ell(x * R, y * R, r * R, r * R * .9, 18), { fill: C.moonC, lw: 4 });
    }
  });
  if (fc !== 'none') {
    const s = R / 120; push(); scale(s);
    const o = { lw: 5, skin: C.moon, look: P.look || [0, 0] };
    if (fc === 'closed') { eye(-32, -6, 18, 20, { ...o, closed: true }); eye(32, -6, 18, 20, { ...o, closed: true }); mouth(0, 38, 30, { sm: .4, lw: 5 }); }
    else if (fc === 'tired') { eye(-32, -6, 18, 20, { ...o, lid: .6 }); eye(32, -6, 18, 20, { ...o, lid: .6 }); for (const x of [-32, 32]) stroke(arc(x, 18, 14, 5, Math.PI * .2, Math.PI * .8, 8), 3); mouth(0, 40, 30, { sm: -.5, lw: 5 }); }
    else if (fc === 'smile') { eye(-32, -6, 18, 20, { ...o, happy: true }); eye(32, -6, 18, 20, { ...o, happy: true }); mouth(0, 36, 36, { o: .3, sm: .9, lw: 5 }); }
    else { eye(-32, -6, 18, 20, { ...o, lid: P.lid ?? .45 }); eye(32, -6, 18, 20, { ...o, lid: P.lid ?? .45 }); mouth(0, 38, 30, { sm: .5, lw: 5 }); }
    pop();
  }
  pop();
}
