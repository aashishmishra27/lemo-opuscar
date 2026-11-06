// script.js → lines.json (for core/tts/tts.py and core/tts/asr_check.py)
import fs from 'fs';
import { SHOTS, VOICE } from '../script.js';
const out = [];
for (const s of SHOTS) s.lines.forEach(([who, sub, tts, o], k) => {
  const v = VOICE[who];
  out.push({ id: `${s.id}_${k}`, who, text: (tts || sub).replace(/[…—]/g, ', ').replace(/ ,/g, ',').replace(/,\s*,/g, ',').replace(/^,\s*/, ''), sub, voice: v.voice, speed: o?.speed ?? v.speed, ...(o?.cut ? { cut: o.cut } : {}) });
});
fs.writeFileSync(new URL('../lines.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(out.length, 'lines,', out.reduce((a, l) => a + l.text.split(/\s+/).length, 0), 'words');
