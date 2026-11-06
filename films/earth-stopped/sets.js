// sets.js — locations and diagrams. World units = screen pixels at zoom 1 (1920×1080); sets extend past the frame for camera moves.
import { clamp, lerp, hash, vnoise, TAU } from '/core/lib.js';
import { INK, g, push, pop, translate, rotate, scale, shape, fillOnly, stroke, ell, arc, spline, rr, rect, quad, noodle, dot, text, bands, screenRect } from './toon.js';
import { C, terra, moon, spinBrake, star4, chai, eye } from './chars.js';

export const X0 = -1600, X1 = 3600, Y0 = -1400, Y1 = 2600;
export const PAL = {
  W0: { wall: '#E8D8B8', floor: '#C9AE84', wood: '#8C6E4E', woodS: '#6E5238', curtain: '#6B8F71', curtainS: '#557458' },
  W1: { bg: '#2B2366', saffron: '#F7B32B', magenta: '#FF5D8F', cream: '#FFF4E0' },
  W2: { red: '#E84A2F', yellow: '#FFD23F', peach: '#FFB38A', brick: '#7A2E1F' },
  W3: { sky: '#B8A35A', slate: '#5B4B73', debris: '#7B5B3A', dust: '#E9E1C9' },
  W4: { sky: '#FFF3C4', sand: '#F29E4C', shadow: '#3A6EA5', sun: '#FFFFFF' },
  W5: { day: '#C2410C', day2: '#F59E0B', night: '#101A3D', night2: '#5468A8', dusk: '#FF8A8A' },
  W6: { mint: '#9FE3C1', coral: '#FF7F6A', slate: '#2F4858', sand: '#F6E7C1' },
  W7: { bg: '#2A2440', moon: '#C9C3E6', lav: '#8A7FB8', hi: '#F4F1E8' },
};
const bg = col => fillOnly(rect(X0, Y0, X1 - X0, Y1 - Y0), col, { boil: 0 });
export function stars(t, { n = 70, col = '#FFF4E0', seed = 1, x0 = -900, x1 = 2900, y0 = -700, y1 = 1700, tw = 1 } = {}) {
  for (let i = 0; i < n; i++) { const x = lerp(x0, x1, hash(i * 3.1 + seed)), y = lerp(y0, y1, hash(i * 7.3 + seed)), r = (5 + hash(i + seed * 9) * 9) * (1 + .25 * tw * Math.sin(t * 2 + i)); fillOnly(star4(x, y, r), col, { boil: .3 }); }
}

// ———————————— L0 BEDROOM ————————————
// sky: 'dawn' | 'night' | 'day'; moonR: moon size in the window; sunUp 0..1; clock: minutes after 6:00; spin: clock hands spinning
export function bedroom(t, { ring = 0, sky = 'dawn', moonR = 0, moonFace = 'none', moonA = 1, clock = 58, spin = 0, brake = true, lever = 0, needle = 0, quilt = 1, fling = 0, cal = 0, frost = 0 } = {}) {
  const P = PAL.W0;
  bg(P.wall);
  for (let x = -1200; x < 3400; x += 300) stroke([[x, -1200], [x, 760]], 3, { line: '#D9C7A3' });
  // window (centre) with sky bands
  const wx = 790, wy = 170, ww = 380, wh = 400;
  shape(rr(wx - 24, wy - 24, ww + 48, wh + 48, 10), { fill: P.wood, lw: 7 });
  shape(rect(wx, wy, ww, wh), {
    fill: '#F2C48D', lw: 6, shade: () => {
      if (sky === 'dawn') { bands(['#E8D8B8', '#F6D9A8', '#F2C48D', '#FFB38A'], wy, wy + wh, wx, wx + ww); shape(arc(wx + ww * .7, wy + wh * .82, 46, 46, Math.PI, TAU, 20).concat([[wx + ww * .7 + 46, wy + wh * .82]]), { fill: '#FFF3C4', lw: 5 }); }
      else if (sky === 'night') { bands(['#1E1A4D', '#2B2366', '#3A3070'], wy, wy + wh, wx, wx + ww); stars(t, { n: 10, x0: wx, x1: wx + ww, y0: wy, y1: wy + wh * .7, seed: 4 }); }
      else { bands(['#FFF3C4', '#F6D9A8', '#F2C48D'], wy, wy + wh, wx, wx + ww); }
      if (moonR > 0) { g.globalAlpha = moonA; moon({ x: wx + ww * .45, y: wy + wh * .38, R: moonR, face: moonFace }); g.globalAlpha = 1; }
      if (frost) fillOnly(rect(wx, wy + wh - 40, ww, 40), 'rgba(255,255,255,.6)', { boil: .5 });
      // rooftops silhouette
      fillOnly([[wx, wy + wh], [wx, wy + wh - 60], [wx + 70, wy + wh - 60], [wx + 70, wy + wh - 100], [wx + 160, wy + wh - 100], [wx + 160, wy + wh - 50], [wx + 250, wy + wh - 50], [wx + 250, wy + wh - 120], [wx + 320, wy + wh - 120], [wx + 320, wy + wh - 70], [wx + ww, wy + wh - 70], [wx + ww, wy + wh]], sky === 'night' ? '#141030' : '#C9A87E', { boil: .3 });
    }
  });
  stroke([[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], 6); stroke([[wx, wy + wh / 2], [wx + ww, wy + wh / 2]], 6);
  for (const s of [-1, 1]) { const cx = s < 0 ? wx - 70 : wx + ww + 10; shape(spline([[cx, wy - 40], [cx + 60, wy - 40], [cx + 70, wy + 200], [cx + 50, wy + wh + 60], [cx - 6, wy + wh + 60], [cx + 10, wy + 200]]), { fill: P.curtain, lw: 6, shade: () => fillOnly(rect(cx + 30, wy - 60, 60, wh + 140), P.curtainS, { boil: .3 }) }); }
  shape(rr(wx - 120, wy - 52, ww + 240, 18, 8), { fill: P.wood, lw: 5 });
  // wall calendar
  shape(rr(1300, 230, 150, 170, 6), { fill: '#FFF4E0', lw: 6, shade: () => { fillOnly(rect(1290, 220, 170, 50), '#E23B3B', { boil: .3 }); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) fillOnly(rect(1316 + j * 30, 290 + i * 24, 18, 14), (i * 4 + j) === (Math.floor(cal) % 16) ? '#E23B3B' : '#D9C7A3', { boil: .2 }); } });
  if (cal > 0) { const u = cal % 1; push(); translate(1375, 240); scale(1, 1 - u); shape(rr(-75, 0, 150, 140, 4), { fill: '#FFF4E0', lw: 5 }); pop(); }
  // floor
  shape(rect(X0, 760, X1 - X0, 1200), { fill: P.floor, lw: 6 });
  for (let k = 0; k < 4; k++) stroke([[X0, 800 + k * 60 + k * k * 14], [X1, 800 + k * 60 + k * k * 14]], 4, { line: '#B4976B' });
  shape(rect(X0, 744, X1 - X0, 22), { fill: P.wood, lw: 6 });
  // bed (left)
  shape(rr(60, 520, 70, 300, 14), { fill: P.wood, lw: 7 });
  shape(rr(120, 700, 640, 130, 14), { fill: P.wood, lw: 7, shade: () => fillOnly(rect(120, 780, 640, 60), P.woodS, { boil: .3 }) });
  shape(rr(120, 640, 640, 80, 20), { fill: '#FFF4E0', lw: 6 });
  shape(rr(140, 600, 170, 70, 30), { fill: '#FFFFFF', lw: 6 });
  if (quilt > 0) quiltShape();
  bedroomFurniture(t, { ring, spin, clock, brake, lever, needle });
}
export function quiltShape(dx = 0, dy = 0) {
  push(); translate(dx, dy);
  shape(spline([[300, 630], [420, 600], [560, 612], [740, 630], [770, 720], [600, 740], [320, 736], [290, 690]]), { fill: '#7FA8C9', lw: 7, shade: () => { for (let k = 0; k < 4; k++) fillOnly(rect(280 + k * 130, 590, 50, 170), '#5E8BAF', { boil: .3 }); } });
  pop();
}
function bedroomFurniture(t, { ring, spin, clock, brake, lever, needle }) {
  const P = PAL.W0;
  // nightstand + alarm clock
  shape(rr(800, 660, 150, 160, 8), { fill: P.wood, lw: 7, shade: () => fillOnly(rect(880, 650, 80, 180), P.woodS, { boil: .3 }) });
  stroke([[812, 730], [938, 730]], 4);
  push(); translate(875 + (ring ? Math.sin(t * 60) * 4 : 0), 600 + (spin || ring ? Math.sin(t * 40) * 3 : 0)); if (ring) rotate(Math.sin(t * 50) * .08);
  for (const s of [-1, 1]) shape(ell(s * 34, -48, 18, 14, 14), { fill: '#E23B3B', lw: 5 });
  shape(ell(0, 0, 50, 50, 30), { fill: '#E23B3B', lw: 7 }); shape(ell(0, 0, 38, 38, 26), { fill: '#FFF4E0', lw: 5 });
  const mm = clock + spin * t * 60, hh = 6 + mm / 60;
  stroke([[0, 0], [Math.cos(hh / 12 * TAU - Math.PI / 2) * 20, Math.sin(hh / 12 * TAU - Math.PI / 2) * 20]], 6);
  stroke([[0, 0], [Math.cos(mm / 60 * TAU - Math.PI / 2) * 30, Math.sin(mm / 60 * TAU - Math.PI / 2) * 30]], 4);
  shape(rr(-26, 48, 52, 14, 5), { fill: '#3d3542', lw: 4 });
  pop();
  // cricket bat in the corner
  push(); translate(1800, 740); rotate(-.18); shape(rr(-24, -330, 48, 240, 14), { fill: '#E8C88A', lw: 6, shade: () => fillOnly(rect(6, -340, 24, 260), '#C9A86A', { boil: .3 }) }); shape(rr(-8, -420, 16, 100, 6), { fill: '#3d3542', lw: 5 }); pop();
  // stool + Spin Brake
  if (brake) {
    shape(rr(1440, 640, 220, 26, 8), { fill: P.wood, lw: 6 });
    for (const lx of [1460, 1620]) shape(rr(lx, 660, 22, 170, 6), { fill: P.woodS, lw: 6 });
    spinBrake(1530, 642, .8, { lever, needle, t });
  }
}

// ———————————— floating platform (observer deck / space classroom) ————————————
export function platform(x, y, s = 1, { w = 520 } = {}) {
  push(); translate(x, y); scale(s);
  shape([...arc(0, 0, w, w * .16, 0, Math.PI, 30), ...arc(0, 34, w, w * .16, Math.PI, 0, 30)].reverse(), { fill: '#C77F1E', lw: 7 });
  shape(ell(0, 0, w, w * .16, 60), { fill: '#FFF4E0', lw: 7, shade: () => fillOnly(ell(0, 0, w * .82, w * .11, 50), '#F6E6C6', { boil: .3 }) });
  stroke(arc(0, 34, w, w * .16, .2, Math.PI - .2, 30), 12, { line: '#F7B32B' });
  pop();
}

export function space(t, { col = PAL.W1.bg, n = 80, seed = 1, starCol = '#FFF4E0' } = {}) { bg(col); stars(t, { n, seed, col: starCol }); }

// ———————————— L1 SPACE CLASSROOM ————————————
export function classroom(t, { terraFace = 'sleepy', rot = null, screen = false, table = true, terraX = 1700 } = {}) {
  space(t);
  terra({ x: terraX, y: 520, R: 520, rot: rot ?? t * .12, face: terraFace, t, arrows: 0 });
  platform(860, 870, 1.15);
  if (screen) shape(rr(1050, 330, 380, 260, 18), { fill: '#FFF4E0', lw: 8, line: INK, shade: () => fillOnly(rect(1040, 320, 400, 26), '#FF5D8F', { boil: .3 }) });
  if (table) { shape(rr(1060, 780, 140, 20, 6), { fill: '#8C6E4E', lw: 6 }); for (const lx of [1074, 1176]) shape(rr(lx, 796, 12, 60, 4), { fill: '#6E5238', lw: 5 }); }
}

// ———————————— L2/L3/L4 THE STREET ————————————
// v: 'dawn' | 'storm' | 'frozen' | 'night' | 'hot' | 'twilight'; dmg 0..1; wind 0..1; jolt: px offset; sun:{x,y,show}; cowRoof: dazed cow on roof
export function street(t, { v = 'dawn', dmg = 0, wind = 0, jolt = 0, sunX = 1640, sunY = 640, sunShow = 1, cowRoof = 0, snow = 0, fly = 0, auto = 1, stall = 1, people = 0, sunLeft = 0, dark = 0 } = {}) {
  const skies = {
    dawn: ['#FFD23F', '#FFC85A', '#FFB38A'], storm: ['#9C8A48', '#B8A35A', '#C9B776'], frozen: ['#FFF3C4', '#FFF0B8', '#FFE7A6'],
    night: ['#101A3D', '#16224A', '#1E2C5A'], hot: ['#F59E0B', '#E97A1A', '#C2410C'], twilight: ['#3A2B5E', '#8E4E7A', '#FF8A8A'],
  };
  const pal = { dawn: ['#E84A2F', '#C93C26', '#7A2E1F', '#FFB38A'], storm: ['#7B5B3A', '#5B4B73', '#4A3C5E', '#B8A35A'], frozen: ['#F29E4C', '#D9853A', '#3A6EA5', '#FFF3C4'], night: ['#2E3C70', '#24305C', '#141E40', '#5468A8'], hot: ['#D9661C', '#B04A10', '#7A2E1F', '#F59E0B'], twilight: ['#7A4E78', '#5E3A62', '#2E2148', '#FF8A8A'] }[v];
  const sk = skies[v];
  bg(sk[0]); bands(sk, -1000, 800);
  // sun
  if (sunShow > 0 && v !== 'night' && v !== 'storm') { shape(ell(sunX, sunY, 110, 110, 40), { fill: v === 'frozen' ? '#FFFFFF' : '#FFF3C4', lw: 6 }); }
  if (v === 'storm' && sunShow) shape(ell(sunX, sunY, 90, 90, 30), { fill: '#D8CC9A', lw: 5 });
  if (v === 'night' && sunLeft > 0) shape(arc(-120 + 260, 770, 110, 110, Math.PI, TAU, 24).concat([[250, 770]]), { fill: '#FFF3C4', lw: 6 });
  if (v === 'night' || v === 'twilight') stars(t, { n: 40, y1: 500, seed: 3 });
  push(); translate(jolt, 0);
  // far skyline
  for (let i = 0; i < 14; i++) { const x = -900 + i * 270, h = 260 + hash(i * 1.7) * 260; fillOnly(rect(x, 760 - h, 200, h + 40), pal[3] === '#FFB38A' ? '#E86A48' : pal[1], { boil: .3, alpha: .55 }); }
  // buildings: 4 flat-roofed blocks with balconies
  const B = [[-420, 340, 420, '#E84A2F'], [40, 400, 360, '#FFB38A'], [1180, 380, 420, '#E84A2F'], [1620, 440, 380, '#FFD23F']];
  B.forEach(([x, w, h, col], i) => {
    const c = v === 'dawn' ? col : [pal[0], pal[1], pal[0], pal[1]][i];
    const lean = dmg * (i % 2 ? .02 : -.015);
    push(); translate(x + w / 2, 780); rotate(lean);
    shape(rect(-w / 2, -h, w, h), {
      fill: c, lw: 7, shade: () => {
        fillOnly(rect(w * .25, -h - 10, w * .3, h + 20), 'rgba(30,10,30,.16)', { boil: .3 });
        for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) { const wx = -w / 2 + 40 + k * (w - 80) / 3, wy = -h + 50 + r * 110; fillOnly(rect(wx, wy, 60, 66), v === 'night' ? (hash(i * 9 + r * 3 + k) > .6 ? '#FFD23F' : '#0E1530') : '#3A2A4A', { boil: .3 }); }
        if (dmg > 0) { stroke([[-w / 2 + 30, -h + 40], [-w / 2 + 70, -h + 120], [-w / 2 + 50, -h + 190], [-w / 2 + 100, -h + 260]], 5); stroke([[w / 2 - 60, -h * .4], [w / 2 - 110, -h * .3], [w / 2 - 90, -h * .15]], 5); }
        if (snow) fillOnly(rect(-w / 2 - 10, -h - 10, w + 20, 26), '#F4F1E8', { boil: .4 });
      }
    });
    for (let r = 0; r < 2; r++) { shape(rect(-w / 2 + 20, -h + 150 + r * 110, w - 40, 14), { fill: pal[2], lw: 5 }); for (let k = 0; k < 8; k++) stroke([[-w / 2 + 30 + k * (w - 60) / 7, -h + 150 + r * 110], [-w / 2 + 30 + k * (w - 60) / 7, -h + 124 + r * 110]], 3); }
    if (snow) for (let k = 0; k < 6; k++) { const ix = -w / 2 + 30 + k * (w - 60) / 5; shape([[ix - 8, -h + 164], [ix + 8, -h + 164], [ix, -h + 164 + 26 + hash(k + i) * 20]], { fill: '#DFF3FF', lw: 4 }); }
    // rooftop water tank
    shape(rr(-w / 2 + 30, -h - 70, 80, 70, 10), { fill: '#3A3A4A', lw: 6 });
    pop();
  });
  // satellite dish on the right building
  push(); translate(1720, 340); rotate(-.5 + dmg * .2);
  stroke([[0, 40], [0, -10]], 7);
  shape([...arc(0, -30, 70, 30, Math.PI * .95, Math.PI * 2.05, 18)], { fill: '#E9E6F2', lw: 6 }); stroke([[0, -30], [0, -80]], 5); dot(0, -84, 7);
  pop();
  if (cowRoof) cow(1620, 340, .55, t, { dazed: 1, blanket: snow > 0 });
  // power lines
  for (let k = 0; k < 3; k++) stroke(quad([-300, 300 + k * 18], [700, 360 + k * 24 + dmg * 40], [1700, 300 + k * 18], 18), 3);
  // palm tree (bent by wind / snapped)
  push(); translate(960, 790);
  const bend = wind * .5 + dmg * .2;
  if (dmg > .9 && v !== 'storm') { shape(noodle([0, 0], [10, -160], -10, 34, 26), { fill: '#8C6E4E', lw: 6 }); shape(noodle([20, -160], [260, -120], -40, 26, 20), { fill: '#8C6E4E', lw: 6 }); }
  else {
    const top = [Math.sin(bend) * 360, -Math.cos(bend) * 360];
    shape(noodle([0, 0], top, -60 * bend, 34, 22), { fill: '#8C6E4E', lw: 6 });
    for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + bend * 1.6 + (k - 2) * .6 * (1 - wind * .6); shape(noodle(top, [top[0] + Math.cos(a) * 170, top[1] + Math.sin(a) * 110 + 30], 30, 34, 6), { fill: v === 'night' ? '#2E5A4A' : v === 'hot' ? '#8A8A3A' : '#3E8A43', lw: 5 }); }
  }
  pop();
  // chai stall (left) with striped awning
  if (stall) {
    push(); translate(520, 790);
    shape(rect(-170, -150, 340, 150), { fill: '#8C6E4E', lw: 7 });
    if (dmg < .5 && wind < .5) { shape([[-200, -150], [200, -150], [180, -240], [-180, -240]], { fill: '#FFF4E0', lw: 7, shade: () => { for (let k = 0; k < 6; k++) fillOnly([[-200 + k * 70, -150], [-165 + k * 70, -150], [-148 + k * 70, -240], [-183 + k * 70, -240]], '#E23B3B', { boil: .3 }); } }); }
    else shape([[-180, -240], [-60, -250], [-30, -200], [-120, -170]], { fill: '#FFF4E0', lw: 6, shade: () => fillOnly(rect(-140, -260, 40, 100), '#E23B3B', { boil: .3 }) });
    if (dmg < .5) for (let k = 0; k < 4; k++) chai(-110 + k * 60, -150, .45, { t: t + k, steam: v === 'dawn' ? 1 : 0, full: 1 });
    pop();
  }
  // ground
  shape(rect(X0, 780, X1 - X0, 1000), { fill: v === 'night' ? '#1E2C5A' : v === 'frozen' ? '#F29E4C' : v === 'storm' ? '#7B5B3A' : v === 'hot' ? '#B04A10' : '#C9AE84', lw: 7 });
  stroke([[X0, 900], [X1, 900]], 4, { line: 'rgba(30,20,40,.3)' });
  if (snow) fillOnly(rect(X0, 776, X1 - X0, 60), '#F4F1E8', { boil: .4 });
  // long flat shadows to the left (sun low on the right)
  if (v === 'frozen') { for (const [x, w] of [[-420, 340], [40, 400], [1180, 380]]) fillOnly([[x, 790], [x + w, 790], [x + w - 520, 880], [x - 520, 880]], 'rgba(58,110,165,.55)', { boil: .3 }); }
  if (auto && dmg < .5) autoRick(1300, 900, .9);
  pop();
  // debris & dust streaming right
  if (wind > 0) for (let i = 0; i < 26 * wind; i++) { const sp = 2400 + hash(i) * 1600, x = ((hash(i * 3) * 4000 + t * sp) % 4000) - 1000, y = -100 + hash(i * 7) * 1000, r = 8 + hash(i * 5) * 20; push(); translate(x, y); rotate(t * 8 + i); shape(i % 3 ? rect(-r, -r * .6, r * 2, r * 1.2) : ell(0, 0, r, r * .7, 10), { fill: i % 2 ? '#7B5B3A' : '#E9E1C9', lw: 4 }); pop(); }
  if (wind > 0) for (let i = 0; i < 12; i++) { const x = ((hash(i * 9) * 4000 + t * 3000) % 4000) - 1000, y = hash(i * 11) * 900; stroke([[x, y], [x + 300, y]], 4, { line: 'rgba(233,225,201,.7)' }); }
  if (snow) for (let i = 0; i < 60; i++) { const x = (hash(i) * 2400 - 200 + Math.sin(t + i) * 20), y = ((hash(i * 3) * 1200 + t * 90) % 1200) - 100; dot(x, y, 4 + hash(i * 5) * 4, '#F4F1E8'); }
  if (dark) screenRect('#101A3D', dark);
}
export function autoRick(x, y, s = 1, a = 0) {
  push(); translate(x, y); scale(s); rotate(a);
  shape(spline([[-130, -20], [-140, -150], [-40, -200], [120, -190], [140, -40], [120, -10]]), { fill: '#FFD23F', lw: 7, shade: () => { fillOnly(rect(-150, -220, 300, 70), '#2E2E3A', { boil: .3 }); fillOnly(rect(40, -150, 120, 140), '#E0B32A', { boil: .3 }); } });
  for (const wx of [-90, 90]) { shape(ell(wx, -6, 34, 34, 20), { fill: '#2E2E3A', lw: 6 }); dot(wx, -6, 8, '#C9CED6'); }
  shape(ell(-150, -110, 14, 14, 12), { fill: '#FFF4E0', lw: 5 });
  pop();
}
export function cow(x, y, s = 1, t = 0, { dazed = 0, blanket = false, flap = 0, a = 0 } = {}) {
  push(); translate(x, y); scale(s); rotate(a);
  if (flap) { scale(1, 1); }
  const body = rr(-110, -150, 220, 110, 50);
  for (const lx of [-80, -40, 50, 85]) shape(noodle([lx, -50], [lx + (flap ? 40 : 0), flap ? -40 : 10], 0, 22, 18), { fill: '#F4F1E8', lw: 6 });
  shape(body, { fill: '#F4F1E8', lw: 7, shade: () => { fillOnly(ell(-40, -110, 40, 30, 16), INK, { boil: .3 }); fillOnly(ell(50, -80, 30, 26, 16), INK, { boil: .3 }); } });
  if (blanket) shape(rr(-80, -160, 150, 90, 20), { fill: '#7FA8C9', lw: 6, shade: () => { for (let k = 0; k < 3; k++) fillOnly(rect(-80 + k * 50, -170, 22, 110), '#E23B3B', { boil: .3 }); } });
  push(); translate(-130, -150);
  shape(ell(0, 0, 60, 50, 24), { fill: '#F4F1E8', lw: 7 });
  shape(ell(-20, 28, 40, 24, 18), { fill: '#FFB0C0', lw: 6 }); dot(-32, 28, 4); dot(-8, 28, 4);
  for (const hx of [-30, 30]) shape([[hx - 8, -40], [hx + 8, -40], [hx + (hx < 0 ? -14 : 14), -70]], { fill: '#E9E1C9', lw: 5 });
  const look = dazed ? [Math.sin(t * 3) * .5, Math.cos(t * 3) * .5] : [0, 0];
  for (const ex of [-20, 20]) { shape(ell(ex, -12, 12, 14, 12), { fill: '#fff', lw: 5, shade: () => dot(ex + look[0] * 6, -12 + look[1] * 6, 3) }); }
  pop();
  pop();
}

// ———————————— INDIA MAP (Natural Earth 1:50m, clipped to lon 66..84.5, lat 6..29.2; no borders) ————————————
let INDIA = null; export const setIndia = d => { INDIA = d; };
export const CITIES = { Chennai: [80.27, 13.08], Bengaluru: [77.59, 12.97], Mumbai: [72.88, 19.08], Delhi: [77.21, 28.61] };
// map frame: lon 66..84.5 → x mx..mx+mw ; lat 29.2..6 → y my..my+mh (equirectangular, cos(18°) aspect)
export const MAPF = { mx: 560, my: 70, mw: 800, mh: 940 };
export const proj = ([lon, lat]) => [MAPF.mx + (lon - 66) / 18.5 * MAPF.mw, MAPF.my + (29.2 - lat) / 23.2 * MAPF.mh];
export function indiaMap(t, { land = '#58B05A', landS = '#3E8A43', sea = '#2E7FD1', paper = '#FFF4E0', storm = 0, arrows = 0, streaks = 0, shock = 0 } = {}) {
  bg(paper);
  const { mx, my, mw, mh } = MAPF;
  shape(rect(mx, my, mw, mh), {
    fill: sea, lw: 8, shade: () => {
      for (let k = 0; k < 7; k++) stroke(arc(mx + mw * .5, my + mh * 1.1, 300 + k * 120, 120 + k * 40, Math.PI * 1.15, Math.PI * 1.85, 20), 3, { line: 'rgba(255,255,255,.18)' });
      if (INDIA) for (const r of INDIA.rings) { const pts = r.map(proj); fillOnly(pts, land, { boil: .4 }); }
      if (INDIA) for (const r of INDIA.rings) { if (r.length < 30) continue; stroke(r.map(proj), 5, { closed: true, boil: .6 }); }
      if (storm > 0) fillOnly(rect(mx - 20, my - 20, (mw + 40) * storm, mh + 40), 'rgba(91,75,115,.55)', { boil: .5 });
      if (streaks > 0) for (let i = 0; i < 18; i++) { const y = my + 40 + i * 50, x = mx + ((hash(i) * mw + t * 900) % (mw + 400)) - 300; stroke([[x, y], [x + 220, y]], 7, { line: 'rgba(233,225,201,.9)', alpha: streaks }); }
      if (arrows > 0) for (let i = 0; i < 9; i++) { const y = my + 120 + (i % 5) * 170, x = mx + 80 + Math.floor(i / 5) * 330 + ((t * 120) % 60); push(); translate(x, y); g.globalAlpha = arrows; shape([[0, -10], [130, -10], [130, -30], [180, 0], [130, 30], [130, 10], [0, 10]], { fill: '#FFD23F', lw: 5 }); g.globalAlpha = 1; pop(); }
      if (shock > 0) { const x = mx + mw * .3 + shock * 300; shape([[x + 120, my + mh * .5], [x - 60, my + mh * .1], [x - 30, my + mh * .5], [x - 60, my + mh * .9]], { fill: 'rgba(255,255,255,.35)', lw: 5 }); }
    }
  });
}
export function cityPin(name, t, pop_, { col = '#F7B32B', label = true, lab = null } = {}) {
  if (pop_ <= 0) return;
  const [x, y] = proj(CITIES[name]);
  push(); translate(x, y); scale(pop_);
  shape(spline([[0, 0], [-20, -34], [-14, -56], [0, -62], [14, -56], [20, -34]]), { fill: col, lw: 6 }); dot(0, -44, 7);
  pop();
  if (label && pop_ > .9) text(lab || name, x + (name === 'Mumbai' ? -30 : 30), y - 38, { font: '800 34px "Baloo 2"', fill: '#fff', align: name === 'Mumbai' ? 'right' : 'left', outlineW: 9 });
}

// ———————————— other locations ————————————
export function nightSky(t, { cloud = 1, moonR = 150, moonFace = 'none', moonLook = [0, 0], moonY = 360, moonLid = .45 } = {}) {
  bg('#1E1A4D'); bands(['#141238', '#1E1A4D', '#2B2366'], -600, 900); stars(t, { n: 60, y1: 700, seed: 6 });
  moon({ x: 980, y: moonY, R: moonR, face: moonFace, look: moonLook, lid: moonLid });
  if (cloud > 0) { const cx = 980 + (1 - cloud) * 900; shape(spline([[cx - 260, moonY + 60], [cx - 230, moonY - 40], [cx - 120, moonY - 110], [cx, moonY - 150], [cx + 130, moonY - 110], [cx + 250, moonY - 40], [cx + 280, moonY + 60], [cx, moonY + 160]]), { fill: '#8A7FB8', lw: 7, shade: () => fillOnly(rect(cx - 300, moonY + 40, 600, 140), '#6E6498', { boil: .3 }) }); }
  fillOnly([[X0, 1100], [X0, 820], [200, 820], [200, 760], [420, 760], [420, 840], [620, 840], [620, 700], [760, 700], [760, 800], [1100, 800], [1100, 740], [1300, 740], [1300, 820], [1560, 820], [1560, 690], [1700, 690], [1700, 800], [X1, 800], [X1, 1100]], '#0E0C26', { boil: .3 });
  for (const [x, y] of [[300, 790], [690, 730], [1630, 720]]) fillOnly(rect(x, y, 26, 30), '#FFD23F', { boil: .2 });
}
export function seafront(t, { wave = 0, dry = 0, pal = 'storm' } = {}) {
  const P = PAL.W3, D = PAL.W6;
  bg(dry ? D.mint : P.sky); bands(dry ? ['#C9F0DC', D.mint, '#FFD0C2'] : ['#9C8A48', P.sky, '#C9B776'], -800, 700);
  // towers
  for (let i = 0; i < 6; i++) { const x = 820 + i * 180, h = 300 + hash(i * 3) * 260; shape(rect(x, 640 - h, 140, h + 30), { fill: dry ? '#D9C7A3' : '#6A5B80', lw: 6, shade: () => { for (let r = 0; r < 6; r++) fillOnly(rect(x + 20, 640 - h + 30 + r * 50, 100, 18), dry ? '#B49A72' : '#4A3C5E', { boil: .2 }); if (dry) fillOnly(rect(x, 640 - h, 140, 40), 'rgba(80,60,40,.25)', { boil: .3 }); } }); }
  // curved promenade + lamp posts
  shape([[X0, 700], ...quad([-200, 640], [900, 760], [2400, 640], 20), [X1, 640], [X1, 1600], [X0, 1600]], { fill: dry ? D.sand : '#B9B2A0', lw: 7 });
  stroke(quad([-200, 680], [900, 800], [2400, 680], 20), 10, { line: dry ? '#9a8a6a' : '#6E6A60' });
  for (let i = 0; i < 9; i++) { const x = -100 + i * 300, y = 640 + 120 * (1 - Math.pow((x - 900) / 1300, 2)) * .55; push(); translate(x, y); rotate(dry ? (hash(i) - .5) * .2 : 0); stroke([[0, 0], [0, -220]], 8); stroke(quad([0, -220], [20, -250], [50, -236], 6), 6); shape(ell(50, -228, 16, 12, 10), { fill: dry ? '#9a8a6a' : '#FFF3C4', lw: 5 }); pop(); }
  if (dry) {   // dry plain where the sea was + a ship on its side
    shape(rect(X0, 860, X1 - X0, 900), { fill: D.sand, lw: 7 }); for (let k = 0; k < 5; k++) stroke([[X0, 900 + k * 50], [X1, 900 + k * 50]], 3, { line: '#E0CDA0' });
    push(); translate(500, 980); rotate(-.35); shape([[-260, -40], [260, -40], [200, 80], [-220, 80]], { fill: '#A4502E', lw: 7, shade: () => fillOnly(rect(-280, 20, 560, 70), '#7A3A22', { boil: .3 }) }); shape(rr(-120, -140, 200, 100, 10), { fill: '#F4F1E8', lw: 6 }); shape(rr(10, -230, 50, 100, 6), { fill: '#E23B3B', lw: 6 }); pop();
  } else {
    shape(rect(X0, 860, X1 - X0, 900), { fill: '#5B4B73', lw: 7, shade: () => { for (let k = 0; k < 8; k++) stroke(arc(k * 300 - 200 + (t * 120 % 300), 900 + (k % 3) * 60, 70, 18, Math.PI * 1.1, Math.PI * 1.9, 8), 4, { line: '#E9E1C9' }); } });
  }
  if (wave > 0) {   // a towering flat wave from the left (west)
    const H = 1300 * wave, x = -400 + wave * 600;
    shape([[X0, 1600], [X0, 860 - H], ...spline([[x - 300, 860 - H], [x + 100, 860 - H * 1.05], [x + 300, 860 - H * .85], [x + 380, 860 - H * .6], [x + 240, 860 - H * .55]], false), [x + 500, 860], [x + 700, 1600]], { fill: '#5B4B73', lw: 8, shade: () => { fillOnly(rect(X0, 860 - H - 40, x - X0 + 300, 80), '#E9E1C9', { boil: .6 }); for (let k = 0; k < 6; k++) stroke(arc(x - 200 - k * 160, 860 - H * .6 + k * 60, 90, 30, Math.PI * 1.1, Math.PI * 1.9, 10), 5, { line: '#E9E1C9' }); } });
  }
}
export function oceanWide(t, { wall = 0, ripples = 0 } = {}) {
  bg('#B8A35A'); bands(['#9C8A48', '#B8A35A', '#D8CC9A'], -800, 560);
  shape(rect(X0, 560, X1 - X0, 1200), { fill: '#5B4B73', lw: 7 });
  for (let k = 0; k < 40; k++) { const x = (hash(k) * 4000 - 1000 + (wall ? t * 600 : 0)) % 4000 - 600, y = 600 + hash(k * 3) * 480; const yy = ripples ? (y - ((t * 60 + hash(k) * 480) % 480)) : y; stroke(arc(x, ripples ? Math.max(580, yy) : y, 60, 14, Math.PI * 1.1, Math.PI * 1.9, 8), 4, { line: '#E9E1C9' }); }
  if (wall > 0) { const x = -800 + ((t * 500) % 600) * wall; shape([[x - 2000, 1600], [x - 2000, 300], ...spline([[x - 400, 300], [x, 260], [x + 160, 340], [x + 120, 420], [x + 300, 560]], false), [x + 600, 1600]], { fill: '#4A3C5E', lw: 8, shade: () => fillOnly(rect(x - 2000, 250, 2200, 60), '#E9E1C9', { boil: .6 }) }); }
  if (wall > 0) shape(rect(1500, 470, 1200, 120), { fill: '#7B5B3A', lw: 6 });   // distant coast (right)
}
export function countryside(t, { peel = 0, fly = 0 } = {}) {
  const P = PAL.W3;
  bg(P.sky); bands(['#9C8A48', P.sky, '#C9B776'], -800, 620);
  shape(rect(X0, 640, X1 - X0, 1000), { fill: '#7B5B3A', lw: 7 });
  // the green field peeling up like a carpet
  const px = lerp(1900, 300, peel);
  shape([[200, 660], [px, 660], ...spline([[px, 660], [px + 60, 560], [px + 140, 520], [px + 200, 580]], false), [px + 210, 700], [2200, 760], [2200, 1100], [200, 1100]].slice(0, 2).concat([[px, 980], [200, 980]]), { fill: '#58B05A', lw: 7 });
  if (peel > 0) shape(spline([[px - 20, 660], [px + 80, 520], [px + 220, 470], [px + 260, 600], [px + 120, 640]]), { fill: '#3E8A43', lw: 7 });
  // house losing its roof
  push(); translate(1500, 700); shape(rect(-120, -150, 240, 150), { fill: '#E9E1C9', lw: 7 }); shape(rect(-30, -90, 60, 90), { fill: '#7B5B3A', lw: 6 }); pop();
  const rx = 1500 + fly * 900, ry = 520 - fly * 300;
  push(); translate(rx, ry); rotate(fly * 3); shape([[-150, 30], [150, 30], [0, -80]], { fill: '#C93C26', lw: 7 }); pop();
  // flying trees
  for (let i = 0; i < 4; i++) { const u = clamp(fly * 1.4 - i * .15, 0, 1), x = 400 + i * 260 + u * 1600, y = 640 - u * 400 * (1 - u * .3); push(); translate(x, y); rotate(u * 4); shape(noodle([0, 0], [0, -120], 0, 20, 14), { fill: '#8C6E4E', lw: 6 }); shape(ell(0, -150, 70, 60, 20), { fill: '#3E8A43', lw: 6 }); pop(); }
}
export function twilightPlain(t, { sunX = 1700, dusk = 1 } = {}) {
  const P = PAL.W5;
  bg(P.night);
  // night (left) → dusk band → day glow (right), flat vertical bands across the sky
  const cols = ['#101A3D', '#1E2C5A', '#3A2B5E', '#8E4E7A', '#FF8A8A', '#F59E0B'];
  cols.forEach((c, i) => fillOnly(rect(-1600 + i * 620, -1400, 640, 2300), c, { boil: 0 }));
  stars(t, { n: 30, x0: -800, x1: 600, y1: 500, seed: 8 });
  shape(arc(sunX, 700, 120, 120, Math.PI, TAU, 24).concat([[sunX + 120, 700]]), { fill: '#FFF3C4', lw: 6 });
  shape(rect(X0, 700, X1 - X0, 1000), { fill: '#5E3A62', lw: 7, shade: () => { fillOnly(rect(900, 690, 2800, 1000), '#8E4E7A', { boil: .3 }); fillOnly(rect(-1600, 690, 1400, 1000), '#24305C', { boil: .3 }); for (let k = 0; k < 6; k++) stroke([[X0, 760 + k * 60 + k * k * 10], [X1, 760 + k * 60 + k * k * 10]], 3, { line: 'rgba(255,138,138,.4)' }); } });
  for (let i = 0; i < 18; i++) { const x = -600 + i * 140, y = 760 + hash(i) * 200; if (x < 300) fillOnly(ell(x, y, 30, 8, 10), '#DFF3FF', { boil: .3 }); }
}
export function newEarth(t, { crack = 0 } = {}) {
  const P = PAL.W6;
  bg(P.mint); bands(['#C9F0DC', P.mint, '#FFC0B0', P.coral], -900, 700);
  for (let i = 0; i < 6; i++) { const x = -300 + i * 480, h = 160 + hash(i * 5) * 220; shape(spline([[x - 160, 720], [x - 80, 720 - h], [x + 40, 720 - h * 1.1], [x + 160, 720]]), { fill: P.slate, lw: 7, shade: () => fillOnly(rect(x, 400, 200, 400), '#22394A', { boil: .3 }) }); }
  shape(rect(X0, 700, X1 - X0, 1000), { fill: P.sand, lw: 7, shade: () => { fillOnly(rect(X0, 700, X1 - X0, 60), '#FFC0B0', { boil: .3 }); for (let k = 0; k < 6; k++) stroke([[X0, 780 + k * 60 + k * k * 12], [X1, 780 + k * 60 + k * k * 12]], 3, { line: '#E0CDA0' }); } });
  if (crack > 0) { const pts = []; for (let i = 0; i <= 12; i++) pts.push([lerp(-200, 2200, i / 12 * crack), 860 + (i % 2 ? -40 : 40) + Math.sin(i) * 20]); stroke(pts, 12); }
}

// ———————————— diagrams ————————————
export function cutaway(t, { x = 960, y = 540, R = 380, layers = 1, swirl = 0, messy = 0, field = 0, honey = 0 } = {}) {
  bg(PAL.W2.red);
  push(); translate(x, y);
  const L = [[1, '#7A2E1F'], [.86, '#E84A2F'], [.55, '#FFB38A'], [.28, '#FFD23F']];
  shape(ell(0, 0, R, R, 64), { fill: '#7A2E1F', lw: 8 });
  L.forEach(([r, c], i) => { if (i === 0) return; shape(ell(0, 0, R * r, R * r, 48), { fill: c, lw: 6 }); });
  if (swirl) { for (let k = 0; k < 4; k++) { const P = []; for (let j = 0; j < 30; j++) { const u = j / 30, a = k * Math.PI / 2 + u * 4 + t * 1.2 + (messy ? Math.sin(u * 20 + t * 3) * messy * 1.5 : 0); P.push([Math.cos(a) * R * (.3 + u * .24), Math.sin(a) * R * (.3 + u * .24)]); } stroke(P, 5); } }
  if (honey) for (let k = 0; k < 6; k++) { const a = k / 6 * TAU + t * .15; stroke(arc(0, 0, R * .7, R * .7, a, a + .5, 10), 5, { line: '#7A2E1F' }); }
  if (field > 0) for (let k = 1; k <= 3; k++) { const r = R * (1.2 + k * .35); g.globalAlpha = field; stroke(arc(-r * .5, 0, r * .62, r * .9, -Math.PI / 2, Math.PI / 2, 24), 6, { line: '#C9C3E6' }); stroke(arc(r * .5, 0, r * .62, r * .9, Math.PI / 2, Math.PI * 1.5, 24), 6, { line: '#C9C3E6' }); g.globalAlpha = 1; }
  pop();
}
export function bigSun(x, y, R, t) {
  for (let k = 0; k < 24; k++) { const a = k / 24 * TAU + t * .2, r0 = R * 1.12, r1 = R * (1.4 + .12 * Math.sin(t * 4 + k)); shape([[Math.cos(a - .05) * r0 + x, Math.sin(a - .05) * r0 + y], [Math.cos(a) * r1 + x, Math.sin(a) * r1 + y], [Math.cos(a + .05) * r0 + x, Math.sin(a + .05) * r0 + y]], { fill: '#FFD23F', lw: 5 }); }
  shape(ell(x, y, R, R, 50), { fill: '#FFD23F', lw: 8, shade: () => fillOnly(ell(x + R * .3, y + R * .3, R * .8, R * .8, 30), '#F7B32B', { boil: .3 }) });
}
export function hourglass(x, y, s, u) {
  push(); translate(x, y); scale(s);
  shape(rr(-80, -150, 160, 20, 6), { fill: '#8C6E4E', lw: 6 }); shape(rr(-80, 130, 160, 20, 6), { fill: '#8C6E4E', lw: 6 });
  shape([[-60, -130], [60, -130], [8, 0], [60, 130], [-60, 130], [-8, 0]], { fill: 'rgba(255,255,255,.5)', lw: 6, shade: () => { fillOnly([[-60 + u * 52, -130 + u * 120], [60 - u * 52, -130 + u * 120], [6, -4], [-6, -4]], '#F7B32B', { boil: .3 }); fillOnly([[-60, 130], [60, 130], [60 - (1 - u) * 50, 130 - u * 90], [-60 + (1 - u) * 50, 130 - u * 90]], '#F7B32B', { boil: .3 }); } });
  pop();
}
export function dino(x, y, s = 1, { shock = 0, look = [0, -1] } = {}) {
  push(); translate(x, y); scale(s);
  shape(spline([[-150, 0], [-160, -80], [-40, -130], [80, -110], [120, -40], [100, 0]]), { fill: '#7FB069', lw: 7, shade: () => fillOnly(rect(-170, -50, 330, 60), '#5E8C4C', { boil: .3 }) });
  shape(noodle([60, -100], [140, -330], -30, 46, 30), { fill: '#7FB069', lw: 7 });
  shape(ell(160, -360, 50, 32, 18), { fill: '#7FB069', lw: 7 });
  eye(170, -370, 13 * (1 + shock * .4), 15 * (1 + shock * .4), { look, pupil: shock ? 2.5 : 3.5, lw: 5, skin: '#7FB069' });
  for (const lx of [-110, -50, 30, 80]) shape(rr(lx - 16, -20, 32, 60, 10), { fill: '#7FB069', lw: 6 });
  shape(noodle([-150, -40], [-300, 10], 20, 34, 6), { fill: '#7FB069', lw: 6 });
  pop();
}
export function asteroid(x, y, r, a = 0, col = '#8A7F7A') { push(); translate(x, y); rotate(a); shape(spline([[-r, 0], [-r * .6, -r * .8], [r * .3, -r], [r, -r * .3], [r * .8, r * .6], [-r * .2, r * .9]]), { fill: col, lw: 5, shade: () => dot(r * .2, -r * .1, r * .2, '#6E625C') }); pop(); }
export function satellite(x, y, s = 1, a = 0) { push(); translate(x, y); rotate(a); scale(s); shape(rr(-30, -24, 60, 48, 6), { fill: '#C9CED6', lw: 6 }); for (const sx of [-1, 1]) shape(rect(sx > 0 ? 40 : -120, -18, 80, 36), { fill: '#3A6EA5', lw: 5, shade: () => { for (let k = 0; k < 3; k++) stroke([[sx > 0 ? 60 + k * 20 : -100 + k * 20, -18], [sx > 0 ? 60 + k * 20 : -100 + k * 20, 18]], 2); } }); stroke([[0, -24], [0, -50]], 4); dot(0, -54, 6, '#E23B3B'); pop(); }
export function portalRing(t) { return t; }
