// timeline → out/cues.json (the same intervals the page draws) for core/render/srt.py
import fs from 'fs';
import { build, subsOf } from '../timeline.js';
const here = new URL('..', import.meta.url).pathname;
const T = build(JSON.parse(fs.readFileSync(here + 'voices/dur.json')));
fs.mkdirSync(here + 'out', { recursive: true });
fs.writeFileSync(here + 'out/cues.json', JSON.stringify(subsOf(T).map(s => ({ t0: s.t0, t1: s.t1, text: s.text }))));
console.log('cues', T.lines.length, 'DUR', T.DUR);
