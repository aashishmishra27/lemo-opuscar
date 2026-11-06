// Usage: node tools/india.mjs data/world-atlas/land-50m.json india.json
// Natural Earth 1:50m land (via world-atlas, public domain): decodes the TopoJSON itself (no third-party code),
// clips every ring (Sutherland–Hodgman) to lon 66..84.5, lat 6..29.2: a regional view of peninsular India,
// no borders, and a box that keeps every China-administered or disputed area out of frame (DIRECTOR.md §13).
import fs from 'fs';
const [src, dst] = process.argv.slice(2);
const topo = JSON.parse(fs.readFileSync(src, 'utf8'));
const { scale: [sx, sy], translate: [tx, ty] } = topo.transform;
const arcs = topo.arcs.map(a => { let x = 0, y = 0; return a.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; }); });
const arc = i => i >= 0 ? arcs[i] : arcs[~i].slice().reverse();
const ringOf = idx => { const r = []; idx.forEach((i, k) => { const a = arc(i); r.push(...(k ? a.slice(1) : a)); }); return r; };
const B = { x0: 66, x1: 84.5, y0: 6, y1: 29.2 };
const E = [[p => p[0] >= B.x0, (a, b) => [B.x0, a[1] + (B.x0 - a[0]) / (b[0] - a[0]) * (b[1] - a[1])]],
[p => p[0] <= B.x1, (a, b) => [B.x1, a[1] + (B.x1 - a[0]) / (b[0] - a[0]) * (b[1] - a[1])]],
[p => p[1] >= B.y0, (a, b) => [a[0] + (B.y0 - a[1]) / (b[1] - a[1]) * (b[0] - a[0]), B.y0]],
[p => p[1] <= B.y1, (a, b) => [a[0] + (B.y1 - a[1]) / (b[1] - a[1]) * (b[0] - a[0]), B.y1]]];
function clip(P) {
  for (const [ins, X] of E) {
    const o = [];
    for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; if (ins(a)) { o.push(a); if (!ins(b)) o.push(X(a, b)); } else if (ins(b)) o.push(X(a, b)); }
    P = o; if (!P.length) break;
  }
  return P;
}
const out = [];
for (const g of topo.objects.land.geometries) {
  const polys = g.type === 'Polygon' ? [g.arcs] : g.arcs;
  for (const p of polys) { const c = clip(ringOf(p[0])); if (c.length > 2) out.push(c.map(([x, y]) => [+x.toFixed(2), +y.toFixed(2)])); }
}
fs.writeFileSync(dst, JSON.stringify({ box: B, rings: out }));
console.log(out.length, out.map(r => r.length).join(' '));
