"""out/raw/<id>.wav (Kokoro, 24 kHz) → voices/<id>.wav (48 kHz, per-character processing) + voices/dur.json + voices/lips.json
NOVA: light saturation + 180 Hz bump (gravel, deadpan). BUNTY: resampled +10 % (higher, quicker), presence boost.
lips: mouth openness o and brightness b per 1/24 s (RMS + spectral centroid)."""
import json, os, numpy as np, soundfile as sf, soxr
from scipy.signal import lfilter
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 48000
L = json.load(open(os.path.join(HERE, 'lines.json')))
UP = {'N': 1.0, 'B': 1.1}
os.makedirs(os.path.join(HERE, 'voices'), exist_ok=True)
def peq(x, f, gain_db, q=1.0):
    A = 10 ** (gain_db / 40); w = 2 * np.pi * f / SR; al = np.sin(w) / (2 * q)
    b = np.array([1 + al * A, -2 * np.cos(w), 1 - al * A]); a = np.array([1 + al / A, -2 * np.cos(w), 1 - al / A])
    return lfilter(b / a[0], a / a[0], x)
dur, lips = {}, {}
for l in L:
    y, sr = sf.read(os.path.join(HERE, 'out/raw', l['id'] + '.wav'))
    if y.ndim > 1: y = y.mean(1)
    if l.get('cut'):   # trim a release artefact after the last word (fraction of the raw take), 40 ms fade
        y = y[:int(len(y) * l['cut'])].copy(); f = int(.04 * sr); y[-f:] *= np.linspace(1, 0, f)
    y = soxr.resample(y, sr * UP[l['who']], SR)
    y = y / (np.abs(y).max() + 1e-9) * .9
    if l['who'] == 'N':
        sat = np.tanh(y * 2.2) / np.tanh(2.2); y = .75 * y + .25 * sat
        y = peq(y, 180, 2.5, .8); y = peq(y, 2800, -1.0, 1.0)
    else:
        y = peq(y, 3400, 2.5, .9)
    y = np.concatenate([y, np.zeros(int(.03 * SR))])
    y = (y / (np.abs(y).max() + 1e-9) * .9).astype(np.float32)
    sf.write(os.path.join(HERE, 'voices', l['id'] + '.wav'), y, SR)
    dur[l['id']] = round(len(y) / SR, 3)
    hop = SR // 24; win = int(.05 * SR); n = len(y) // hop + 1
    o, b, rms, cen = [], [], [], []
    fr = np.fft.rfftfreq(2048, 1 / SR)
    for i in range(n):
        seg = y[max(0, i * hop - win // 2): i * hop + win // 2]
        if len(seg) < 64: rms.append(0); cen.append(0); continue
        X = np.abs(np.fft.rfft(seg * np.hanning(len(seg)), 2048))
        rms.append(np.sqrt((seg ** 2).mean())); cen.append((X * fr).sum() / (X.sum() + 1e-9))
    rms = np.array(rms); p = np.percentile(rms, 95) + 1e-9
    lips[l['id']] = {'o': [round(float(np.clip((r / p - .1) / .8, 0, 1)), 2) for r in rms], 'b': [round(float(np.clip((c - 1200) / 2600, 0, 1)), 2) for c in cen]}
json.dump(dur, open(os.path.join(HERE, 'voices/dur.json'), 'w'), indent=0)
json.dump(lips, open(os.path.join(HERE, 'voices/lips.json'), 'w'))
print(len(dur), 'lines, total %.1f s' % sum(dur.values()))
