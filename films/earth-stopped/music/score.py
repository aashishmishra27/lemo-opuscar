"""Original score, synthesized in numpy from events.json (one cue per chapter; mutes cut the music and its tails).
Palette from the style: theremin-like lead, analog bass, square arpeggio, drum machine; one genre cue per world.
Usage: python music/score.py  → music/score.wav"""
import json, os, numpy as np, soundfile as sf
from scipy.signal import lfilter, butter, sosfilt, fftconvolve
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); SR = 48000
E = json.load(open(os.path.join(HERE, 'events.json'))); DUR = E['dur']; N = int(DUR * SR) + SR
L = np.zeros(N, np.float32); Rt = np.zeros(N, np.float32)
rng = np.random.default_rng(11)
def mtof(m): return 440 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(d * SR)) / SR
def lp(x, f): return sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'high', fs=SR, output='sos'), x)
def bp(x, a, b): return sosfilt(butter(2, [a, b], 'band', fs=SR, output='sos'), x)
def put(x, t, g=1.0, pan=0.0):
    i = int(t * SR); n = min(len(x), N - i)
    if n <= 0 or i < 0: return
    L[i:i + n] += (x[:n] * g * np.sqrt((1 - pan) / 2)).astype(np.float32); Rt[i:i + n] += (x[:n] * g * np.sqrt((1 + pan) / 2)).astype(np.float32)
def adsr(n, a=.005, r=.08):
    e = np.ones(n); A = min(n, int(a * SR)); Rr = min(n, int(r * SR))
    e[:A] = np.linspace(0, 1, A); e[n - Rr:] *= np.linspace(1, 0, Rr); return e
# —— instruments ——
def theremin(notes, t0, beat, g=.22):
    """notes: [(start_beat, dur_beats, midi)] legato line with ~70 ms portamento and delayed vibrato"""
    if not notes: return
    end = max(s + d for s, d, _ in notes); n = int(end * beat * SR) + SR // 2
    f = np.zeros(n); amp = np.zeros(n); vib = np.zeros(n)
    prev = mtof(notes[0][2])
    for s, d, m in notes:
        a, b = int(s * beat * SR), int((s + d) * beat * SR); tgt = mtof(m); k = np.arange(b - a)
        f[a:b] = tgt + (prev - tgt) * np.exp(-k / (.07 * SR / 3)); prev = tgt
        amp[a:b] = 1; vib[a:b] = np.clip((k / SR - .15) / .3, 0, 1)
    tv = np.arange(n) / SR
    f = f * (1 + .012 * vib * np.sin(2 * np.pi * 5.6 * tv))
    amp = np.convolve(amp, np.ones(int(.04 * SR)) / int(.04 * SR), 'same')
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = (np.sin(ph) + .18 * np.sin(2 * ph) + .08 * np.sin(3 * ph)) * amp
    put(x, t0, g, .1)
def square(m, d, g=.05):
    t = tt(d); x = np.sign(np.sin(2 * np.pi * mtof(m) * t)) * np.exp(-t / .09); return lp(x, 3500) * g
def bass(m, d, g=.35):
    t = tt(d); f = mtof(m); x = np.sin(2 * np.pi * f * t) + .35 * np.sin(4 * np.pi * f * t) + .15 * np.sin(6 * np.pi * f * t)
    return x * adsr(len(t), .004, .05) * np.exp(-t / 1.2) * g
def kick(g=.6):
    t = tt(.35); return np.sin(2 * np.pi * np.cumsum(50 + 110 * np.exp(-t / .03)) / SR) * np.exp(-t / .12) * g
def snare(g=.25):
    t = tt(.2); return (bp(rng.standard_normal(len(t)), 1500, 7000) * .8 + np.sin(2 * np.pi * 190 * t) * .5) * np.exp(-t / .06) * g
def hat(g=.08, d=.05):
    t = tt(d); return hp(rng.standard_normal(len(t)), 7000) * np.exp(-t / (d / 3)) * g
def brush(g=.06):
    t = tt(.25); return bp(rng.standard_normal(len(t)), 2000, 9000) * np.sin(np.pi * t / .25) * g
def pluck(m, d=1.2, g=.2, bright=.5):
    f = mtof(m); Lg = max(2, int(SR / f)); n = int(d * SR)
    x = np.zeros(n); burst = rng.standard_normal(Lg); x[:Lg] = lp(burst, 1500 + 6000 * bright)
    a = np.zeros(Lg + 2); a[0] = 1; a[Lg] = -.497; a[Lg + 1] = -.497
    return lfilter([1], a, x) * g
def rhodes(m, d, g=.12):
    t = tt(d); f = mtof(m); I = 2.2 * np.exp(-t / .25)
    return np.sin(2 * np.pi * f * t + I * np.sin(2 * np.pi * f * t)) * np.exp(-t / 1.6) * adsr(len(t), .003, .3) * g
def pad(ms, d, g=.06, vowel=True):
    t = tt(d); x = np.zeros(len(t))
    for m in ms:
        for det in (-.12, .12): x += 2 * ((mtof(m + det) * t) % 1) - 1
    x = bp(x, 400, 1100) * .7 + lp(x, 800) * .3 if vowel else lp(x, 1500)
    e = np.minimum(1, np.minimum(t / .8, (d - t) / .8)); return x * e * g
def strings_trem(ms, d, g=.05):
    t = tt(d); x = np.zeros(len(t))
    for m in ms:
        for det in (-.08, 0, .08): x += 2 * ((mtof(m + det) * t) % 1) - 1
    x = lp(x, 2500) * (.6 + .4 * np.sin(2 * np.pi * 12 * t)); e = np.minimum(1, np.minimum(t / .3, (d - t) / .3)); return x * e * g
def vibes(m, d=1.2, g=.12):
    t = tt(d); f = mtof(m); return (np.sin(2 * np.pi * f * t) + .25 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t / .1)) * np.exp(-t / .9) * (1 + .3 * np.sin(2 * np.pi * 5 * t)) * g
def toy(m, d=.8, g=.12):
    t = tt(d); f = mtof(m); return (np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * 2.76 * f * t) * np.exp(-t / .05)) * np.exp(-t / .35) * g
def drone(m, d, g=.08):
    t = tt(d); x = sum(np.sin(2 * np.pi * mtof(m + k) * t + k) for k in (0, 7, 12)) / 3; e = np.minimum(1, np.minimum(t / 2, (d - t) / 2)); return lp(x, 900) * e * g

cues = {e['name']: (e['t'], e['t1']) for e in E['ev'] if e['type'] == 'cue'}
ev = E['ev']
def grid(t0, t1, bpm): b = 60 / bpm; return b, int((t1 - t0) / b)
def first(tp): return next(e['t'] for e in ev if e['type'] == tp)
# —— cold open: toy-piano lullaby until the brake, then the title hit ——
t0, t1 = cues['cold']; b = 60 / 72; title = next(e['t'] for e in ev if e['type'] == 'slam')
lull = [72, 76, 79, 76, 74, 77, 81, 77, 72, 76, 79, 84, 83, 79, 74, 72]
for i in range(int((title - 1 - t0) / b)):
    put(toy(lull[i % 16], 1.0), t0 + .3 + i * b, .9, -.2)
    if i % 4 == 0: put(toy(48 + [0, 5, 7, 5][(i // 4) % 4], 1.6, .08), t0 + .3 + i * b, .8, .2)
b = 60 / 112
theremin([(0, 2, 62), (2, 1, 65), (3, 1, 69), (4, 3, 74)], title, b, .26)
for k in range(8): put(kick(), title + k * b * 2); put(snare(), title + b + k * b * 2)
for k in range(32): put(square([50, 57, 62, 65][k % 4] + 12, .12), title + k * b / 2, 1.0, .2)
# —— Ch1: main theme, D minor, 112 bpm ——
t0, t1 = cues['ch1']; b, nb = grid(t0, t1, 112)
mel = [(0, 1, 62), (1, 1, 65), (2, 1, 69), (3, 1, 67), (4, 1, 65), (5, 1, 64), (6, 2, 62), (8, 1, 69), (9, .5, 70), (9.5, .5, 69), (10, 1, 65), (11, 1, 67), (12, 3, 64), (15, 1, 61)]
prog = [(50, [62, 65, 69]), (46, [62, 65, 70]), (48, [60, 64, 67]), (45, [61, 64, 69])]
for bar in range(nb // 4):
    tb = t0 + bar * 4 * b; root, ch = prog[bar % 4]
    for k in range(4): put(bass(root - 12 + (7 if k == 2 else 0), b * .9), tb + k * b)
    for k in range(16): put(square(ch[k % 3] + (12 if k % 8 > 5 else 0), .1), tb + k * b / 4, .8, .25)
    for k in range(4): put(kick(.45), tb + k * b) if k % 2 == 0 else put(snare(.18), tb + k * b)
    for k in range(8): put(hat(), tb + k * b / 2, 1, -.2)
    if bar % 4 == 0 and bar % 8 != 4: theremin(mel, tb, b, .16)
# —— Ch2: surf guitar panic, E minor, 150 bpm ——
t0, t1 = cues['ch2']; b, nb = grid(t0, t1, 150)
riff = [52, 52, 55, 57, 58, 57, 55, 52]
for bar in range(nb // 4):
    tb = t0 + bar * 4 * b
    for k in range(16): put(pluck(riff[(k // 2) % 8] + (12 if bar % 4 == 3 else 0), .3, .16, .8), tb + k * b / 4, 1, -.3)
    for k in range(4): put(bass(40 + [0, 0, 3, 5][bar % 4], b * .8, .3), tb + k * b)
    for k in range(4): put(kick(.4), tb + k * b); put(snare(.16), tb + k * b + b / 2) if k % 2 else None
    for k in range(8): put(hat(.06), tb + k * b / 2)
# —— Ch3: tremolo strings + pounding bass, 96 bpm ——
t0, t1 = cues['ch3']; b, nb = grid(t0, t1, 96)
ch3 = [[50, 53, 57], [49, 53, 56], [46, 50, 53], [45, 49, 52]]
for bar in range(nb // 2):
    tb = t0 + bar * 2 * b; c = ch3[bar % 4]
    put(strings_trem([m + 12 for m in c], 2 * b + .1, .05), tb, 1, .15)
    for k in range(8): put(bass(c[0] - 12, b * .45, .28), tb + k * b / 4)
    put(kick(.5), tb); put(kick(.4), tb + b * 1.5)
# —— Ch4: elevator bossa, 100 bpm (kazoo stings come from the mix) ——
t0, t1 = cues['ch4']; b, nb = grid(t0, t1, 100)
bossa = [(57, [67, 72, 76]), (50, [66, 72, 76]), (55, [66, 71, 74]), (48, [64, 67, 71])]
pat = [0, 1.5, 3, 4.5, 6]
for bar in range(nb // 8):
    tb = t0 + bar * 8 * b; root, ch = bossa[bar % 4]
    put(bass(root - 12, b * 1.4, .25), tb); put(bass(root - 5, b * 1.2, .2), tb + 3 * b); put(bass(root - 12, b * 1.4, .25), tb + 4 * b); put(bass(root - 5, b * 1.2, .2), tb + 7 * b)
    for p in pat:
        for j, m in enumerate(ch): put(pluck(m - 12, .8, .07, .3), tb + p * b / 2 * 2 + j * .012, 1, .2)
    for k in range(16): put(hat(.03, .04), tb + k * b / 2, 1, -.3)
    for p in (0, 3, 6): put(snare(.05), tb + p * b)
# —— Ch5: warm Rhodes + aah pad, sad theremin, 72 bpm ——
t0, t1 = cues['ch5']; b, nb = grid(t0, t1, 72)
ch5 = [[57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65], [52, 55, 59, 62]]
for bar in range(nb // 4):
    tb = t0 + bar * 4 * b; c = ch5[bar % 4]
    for j, m in enumerate(c): put(rhodes(m, 4 * b), tb + j * .02, 1, -.15 + j * .1)
    put(pad(c[:3], 4 * b + .2, .05), tb, 1, .1); put(bass(c[0] - 24, 4 * b, .22), tb)
    if bar % 4 == 2: theremin([(0, 2, 76), (2, 1, 74), (3, 1, 72), (4, 4, 71)], tb, b, .1)
# —— Ch6: brushed swing + vibes + walking bass, 120 bpm ——
t0, t1 = cues['ch6']; b, nb = grid(t0, t1, 120)
walk = [41, 43, 45, 46, 48, 46, 45, 43, 38, 40, 41, 43, 45, 43, 41, 40]
for k in range(nb):
    put(bass(walk[k % 16], b * .9, .25), t0 + k * b)
    put(brush(), t0 + k * b + (b * .66 if k % 2 else 0)); put(hat(.04, .06), t0 + k * b + b * .66)
for bar in range(nb // 4):
    tb = t0 + bar * 4 * b
    for p, m in [(0, 77), (1.66, 76), (2, 72), (3, 74)] if bar % 2 == 0 else [(0, 72), (1.66, 69), (2.66, 70), (3.5, 65)]: put(vibes(m, 1.4), tb + p * b, 1, .25)
# —— Ch7: theremin alone over a drone, 60 bpm ——
t0, t1 = cues['ch7']; b = 1.0
put(drone(38, t1 - t0, .07), t0)
for s in (4, 26, 52):
    if t0 + s + 8 < t1: theremin([(0, 2, 62), (2, 2, 61), (4, 2, 58), (6, 3, 57)], t0 + s, b, .12)
# —— cliffhanger: silence except the sting ——
st = next(e['t'] for e in ev if e['type'] == 'sting')
theremin([(0, .5, 62), (.5, .5, 61), (1, 2.5, 55)], st, .5, .22)
put(drone(26 + 12, 4, .1), st)

# —— spring reverb + mutes (music and its tails cut together) ——
ir = rng.standard_normal(int(1.4 * SR)) * np.exp(-np.arange(int(1.4 * SR)) / SR / .35); ir = lp(ir, 4000); ir /= np.abs(ir).sum() / 6
for ch in (L, Rt): ch += fftconvolve(ch, ir)[:N].astype(np.float32) * .25
gain = np.ones(N, np.float32)
for e in ev:
    if e['type'] != 'mute': continue
    a, b2 = int(e['t'] * SR), int((e['t'] + e['d']) * SR); r = int(.02 * SR)
    gain[a:b2] = 0; gain[max(0, a - r):a] = np.minimum(gain[max(0, a - r):a], np.linspace(1, 0, a - max(0, a - r)))
    gain[b2:b2 + int(.3 * SR)] = np.minimum(gain[b2:b2 + int(.3 * SR)], np.linspace(0, 1, len(gain[b2:b2 + int(.3 * SR)])))
mus = np.stack([L * gain, Rt * gain], 1)[:int(DUR * SR)]
mus = mus / (np.abs(mus).max() + 1e-9) * .8
sf.write(os.path.join(HERE, 'music', 'score.wav'), mus, SR)
print('score', mus.shape, 'peak', np.abs(mus).max())
