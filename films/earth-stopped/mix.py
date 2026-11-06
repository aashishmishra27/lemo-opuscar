"""Mix: procedural foley (events.json) + voices + ducked score + ambience per world → mix.wav
Usage: python mix.py (after core/render/events.mjs, voice.py, music/score.py)"""
import sys, os, json, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '../../core/audio'))
from sfx import SR, t_, env_exp, bp, lp, hp, norm, click, clack, whoosh, pop, ding, thump, creak, rumble, compress, limit, add
from scipy.ndimage import maximum_filter1d, uniform_filter1d
from scipy.signal import fftconvolve
E = json.load(open(os.path.join(HERE, 'events.json'))); DUR = E['dur']; N = int(DUR * SR)
rng = np.random.default_rng(7)
def nz(d): return rng.standard_normal(len(t_(d)))
def sweep(f0, f1, d, c=1.0): tt = t_(d); f = f0 * (f1 / f0) ** ((tt / d) ** c); return np.sin(2 * np.pi * np.cumsum(f) / SR)
def fade(x, a=.01, r=.05):
    x = x.copy(); n = len(x); A, R = min(n, int(a * SR)), min(n, int(r * SR)); x[:A] *= np.linspace(0, 1, A); x[n - R:] *= np.linspace(1, 0, R); return x
def win(d): tt = t_(d); return np.sin(np.pi * tt / d)
def bpsweep(x, f0, f1, q=.35):
    out = np.zeros_like(x); n = len(x)
    for i in range(0, n, 480):
        f = f0 * (f1 / f0) ** (i / max(1, n)); s = bp(x[max(0, i - 2400):i + 480], f * (1 - q), min(f * (1 + q), 20000)); out[i:i + 480] = s[-len(out[i:i + 480]):]
    return out
def brownish(d): w = np.cumsum(nz(d)); w -= np.linspace(w[0], w[-1], len(w)); return norm(hp(w, 20))
def tone(f, d, tau=.2): tt = t_(d); return np.sin(2 * np.pi * f * tt) * np.exp(-tt / tau)
def seq(parts):
    out = np.zeros(int(max(o + len(p) / SR for o, p in parts) * SR) + 10)
    for o, p in parts: i = int(o * SR); out[i:i + len(p)] += p
    return out
def drainf(d):
    out = np.zeros(len(t_(d)))
    for _ in range(int(d * 14)):
        b = sweep(300 + 200 * rng.random(), 800 + 300 * rng.random(), .07) * win(.07); i = int(rng.random() * max(1, len(out) - len(b)))
        out[i:i + len(b)] += b[:len(out) - i]
    return fade(norm(lp(out, 2000)), .05, .2)
# —— foley (all synthesized). Each returns a mono buffer; d = duration when the event has one ——
FX = {
 'alarm': (lambda d: norm(np.sign(np.sin(2 * np.pi * 2200 * t_(d))) * (np.sin(2 * np.pi * 8 * t_(d)) > 0) * .5), .18),
 'cloth': (lambda d: norm(lp(nz(.3), 1500) * win(.3) ** 2), .15),
 'clunk': (lambda d: norm(seq([(0, clack(.6)), (0, thump(1, 55)), (.02, tone(180, .3, .08))])), .8),
 'whooshBig': (lambda d: norm(whoosh(.5)), .5), 'whoosh': (lambda d: norm(whoosh(.35)), .35), 'massWhoosh': (lambda d: norm(whoosh(.8) + lp(nz(.8), 400) * win(.8)), .6),
 'tick': (lambda d: norm(hp(nz(.03), 2500) * env_exp(.03, .004)), .12),
 'lowHit': (lambda d: norm(np.sin(2 * np.pi * np.cumsum(45 + 40 * np.exp(-t_(1.6) / .08)) / SR) * env_exp(1.6, .6)), .6),
 'click': (lambda d: norm(click(1.0)), .4), 'dialClick': (lambda d: norm(seq([(k * .18, click(1.4, .6)) for k in range(int(d / .18))])), .25),
 'portalOpen': (lambda d: norm(np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-t_(1.5) / .12)) / SR) * env_exp(1.5, .45) + bpsweep(nz(1.5), 6000, 300) * env_exp(1.5, .5) * .7 + sweep(260, 900, 1.5) * win(1.5) * .3), .6),
 'portalClose': (lambda d: norm(np.concatenate([bpsweep(nz(.4), 300, 3000)[::-1] * np.linspace(0, 1, len(t_(.4))) ** 2, thump(1, 55)])), .45),
 'portalWhoosh': (lambda d: norm(bpsweep(nz(.45), 400, 4000) * win(.45) ** 2 + sweep(200, 900, .45) * win(.45) * .3), .5),
 'portalHum': (lambda d: fade(norm(np.sin(2 * np.pi * 55 * t_(d)) * .6 + bp(nz(d), 300, 900) * .4), .3, .4), .15),
 'slam': (lambda d: norm(np.sin(2 * np.pi * np.cumsum(40 + 90 * np.exp(-t_(1) / .05)) / SR) * env_exp(1, .3) + bp(nz(1), 1000, 7000) * env_exp(1, .05) * .6), .7),
 'slurp': (lambda d: fade(norm(bp(nz(d), 900, 3200) * (.3 + (rng.random(len(t_(d))) > .999) * 3)), .02, .05), .3),
 'pop': (lambda d: norm(pop(1)), .35), 'boing': (lambda d: norm(np.sin(2 * np.pi * np.cumsum(180 * (1 + .35 * np.sin(2 * np.pi * 16 * t_(.6)) * np.exp(-t_(.6) / .25))) / SR) * env_exp(.6, .2)), .3),
 'ding': (lambda d: norm(ding(1)), .35), 'chime': (lambda d: norm(seq([(0, tone(1568, 2.0, .8)), (.12, tone(2093, 2.0, .8)), (.24, tone(2637, 2.0, .9))])), .3),
 'squeak': (lambda d: norm(np.sin(2 * np.pi * (2000 + 500 * np.sin(2 * np.pi * 30 * t_(.12))) * t_(.12)) * win(.12)), .12),
 'jet': (lambda d: fade(norm(bp(nz(d), 300, 3000) * np.sin(np.pi * t_(d) / d)), .1, .3), .25),
 'sonic': (lambda d: norm(seq([(0, thump(1, 50)), (.1, thump(.8, 60))]) + 0), .6),
 'cabin': (lambda d: fade(norm(lp(brownish(d), 250)), .2, .3), .12),
 'thunk': (lambda d: norm(thump(1, 90)), .5), 'splash': (lambda d: norm(bp(nz(.4), 600, 4000) * env_exp(.4, .08)), .25),
 'rocket': (lambda d: fade(norm(bp(nz(d), 200, 2500)), .05, .2), .12),
 'tape': (lambda d: norm(bp(nz(.5), 2000, 6000) * (np.sin(2 * np.pi * 40 * t_(.5)) > 0) * win(.5)), .2),
 'sadTrombone': (lambda d: norm(np.concatenate([lp(np.sign(np.sin(2 * np.pi * f * t_(.38))) * win(.38), 1800) for f in (293, 277, 261)] + [lp(np.sign(np.sin(2 * np.pi * np.cumsum(246 + 6 * np.sin(2 * np.pi * 6 * t_(1.0))) / SR)) * win(1.0), 1800)])), .3),
 'kazoo': (lambda d: norm(lp(np.sign(np.sin(2 * np.pi * np.cumsum(300 * (1 - .3 * t_(.6) / .6) * (1 + .03 * np.sin(2 * np.pi * 7 * t_(.6)))) / SR)) * win(.6), 2500)), .25),
 'calendar': (lambda d: norm(seq([(k * .08, hp(nz(.05), 2500) * env_exp(.05, .01)) for k in range(int(d / .08))])), .2),
 'paper': (lambda d: norm(hp(nz(.25), 2500) * (rng.random(len(t_(.25))) > .6) * win(.25)), .25),
 'rumble': (lambda d: fade(norm(lp(brownish(d), 120) * env_exp(d, d / 2.5)), .02, .2), .8),
 'quake': (lambda d: fade(norm(lp(brownish(d), 100) * (.6 + .4 * np.sin(2 * np.pi * 7 * t_(d)))), .02, .3), .8),
 'gauge': (lambda d: fade(norm(sweep(300, 2400, d) * .5), .02, .02), .15), 'glassCrack': (lambda d: norm(seq([(k * .03, clack(2 + rng.random(), .8)) for k in range(6)])), .5),
 'cockpitAlarm': (lambda d: norm(np.sin(2 * np.pi * 900 * t_(d)) * (np.sin(2 * np.pi * 4 * t_(d)) > 0)), .15),
 'woozy': (lambda d: norm(sweep(1200, 200, .9, .7) * win(.9)), .25),
 'crack': (lambda d: norm(bp(nz(.25), 800, 6000) * env_exp(.25, .04) + thump(.6, 70)[:len(t_(.25))]), .55), 'snap': (lambda d: norm(clack(.7) + 0), .5),
 'moo': (lambda d: norm(lp(np.sign(np.sin(2 * np.pi * np.cumsum(140 + 30 * np.sin(np.pi * t_(1.0))) / SR)) * win(1.0), 900)), .3),
 'clinks': (lambda d: norm(seq([(k * .07, tone(2600 + 400 * rng.random(), .3, .08)) for k in range(5)])), .2),
 'shimmer': (lambda d: norm(seq([(k * .06, tone(1500 * 2 ** (k / 6), .9, .4)) for k in range(10)])), .2),
 'phoneTap': (lambda d: norm(seq([(k * .11, click(2.2, .5)) for k in range(int(d / .11))])), .2),
 'flap': (lambda d: fade(norm(bp(nz(d), 300, 2500) * (.5 + .5 * np.sin(2 * np.pi * 14 * t_(d)))), .05, .1), .18),
 'rip': (lambda d: norm(bp(nz(.6), 1000, 6000) * (rng.random(len(t_(.6))) > .5) * win(.6)), .35),
 'creak': (lambda d: norm(creak(1)), .3), 'fire': (lambda d: fade(norm(bp(nz(d), 300, 3000) * (rng.random(len(t_(d))) > .995) * 4 + lp(nz(d), 400) * .3), .1, .2), .2),
 'glorp': (lambda d: norm(lp(np.sin(2 * np.pi * np.cumsum(260 + 500 * win(.5)) / SR) * (1 + .6 * np.sin(2 * np.pi * 28 * t_(.5))) * win(.5), 1800)), .5),
 'squish': (lambda d: norm(bpsweep(nz(.2), 600, 2500, .5) * env_exp(.2, .05)), .35),
 'boom': (lambda d: norm(np.sin(2 * np.pi * np.cumsum(35 + 80 * np.exp(-t_(1.5) / .06)) / SR) * env_exp(1.5, .5) + lp(nz(1.5), 800) * env_exp(1.5, .3)), .7),
 'waveRoar': (lambda d: fade(norm(lp(brownish(d), 900) * (.5 + .5 * t_(d) / d)), .3, .05), .45),
 'lapping': (lambda d: fade(norm(lp(nz(d), 700) * (.3 + .7 * (np.sin(2 * np.pi * .5 * t_(d)) > .3))), .3, .3), .15),
 'drain': (lambda d: drainf(d), .25),
 'gurgle': (lambda d: FX['drain'][0](d), .2), 'drainDown': (lambda d: fade(norm(sweep(800, 120, d) * .5), .05, .3), .15),
 'chirp': (lambda d: norm(sweep(3000, 4500, .08) * win(.08)), .2), 'blip': (lambda d: norm(tone(1700, .06, .03)), .3),
 'clockSpin': (lambda d: norm(seq([(k * .05, hp(nz(.02), 2500) * env_exp(.02, .003)) for k in range(int(d / .05))])), .15),
 'slosh': (lambda d: norm(lp(nz(.6), 900) * win(.6)), .25), 'slide': (lambda d: fade(norm(bp(nz(d), 400, 2000) * win(d)), .05, .1), .2),
 'dim': (lambda d: norm(thump(.6, 80)), .35), 'windHush': (lambda d: fade(norm(lp(brownish(d), 600)), .5, .5), .12),
 'wind': (lambda d: fade(norm(bp(brownish(d), 150, 1200) * (.6 + .4 * np.sin(2 * np.pi * .3 * t_(d)))), .3, .4), .35),
 'chatter': (lambda d: norm(seq([(k * .07, clack(1.8, .4)) for k in range(int(d / .07))])), .2),
 'heat': (lambda d: fade(norm(bp(nz(d), 2000, 8000) * (rng.random(len(t_(d))) > .99)), .2, .2), .12),
 'icyWind': (lambda d: fade(norm(bp(brownish(d), 400, 2500) * (.5 + .5 * np.sin(2 * np.pi * .2 * t_(d)))), .3, .3), .3),
 'icicle': (lambda d: norm(seq([(0, tone(3200, .5, .1)), (.06, tone(2700, .4, .08))])), .4),
 'wheeze': (lambda d: fade(norm(bp(nz(d), 1500, 5000) * np.abs(np.sin(2 * np.pi * 1.6 * t_(d)))), .05, .1), .12),
 'breeze': (lambda d: fade(norm(lp(brownish(d), 500)), .5, .5), .15), 'thinWind': (lambda d: fade(norm(bp(brownish(d), 600, 3000)), .5, .5), .12),
 'steps': (lambda d: norm(seq([(k * .42, lp(nz(.06), 1800) * env_exp(.06, .015)) for k in range(int(d / .42))])), .3),
 'creakCart': (lambda d: norm(creak(1)), .2),
 'snore': (lambda d: fade(norm(seq([(k * 1.6, lp(nz(.8), 400) * win(.8)) for k in range(max(1, int(d / 1.6)))])), .05, .1), .25),
 'drip': (lambda d: norm(sweep(900, 2600, .05) * env_exp(.05, .02)), .3), 'sigh': (lambda d: norm(bp(nz(.9), 400, 2000) * win(.9)), .2),
 'yawn': (lambda d: norm(lp(np.sin(2 * np.pi * np.cumsum(220 - 100 * t_(1.4) / 1.4) / SR) * win(1.4), 1000)), .2),
 'hmph': (lambda d: norm(bp(nz(.25), 300, 1500) * env_exp(.25, .07)), .3),
 'argue': (lambda d: norm(seq([(k * .13, bp(nz(.11), 300 + 500 * (k % 3), 1500 + 600 * (k % 2)) * win(.11)) for k in range(int(d / .13))])), .18),
 'hum': (lambda d: fade(norm(np.sin(2 * np.pi * 120 * t_(d)) + .5 * np.sin(2 * np.pi * 240 * t_(d))), .1, .3), .03),
 'laser': (lambda d: norm(sweep(2400, 600, .18) * env_exp(.18, .06)), .2),
 'tinkle': (lambda d: norm(seq([(k * .05, tone(3000 + 1500 * rng.random(), .3, .06)) for k in range(10)])), .2),
 'spinUp': (lambda d: norm(sweep(80, 600, 1.0) * win(1.0)), .3),
 'sting': (lambda d: norm(thump(1, 45)), .5), 'static': (lambda d: fade(norm(hp(nz(d), 1500)), .01, .1), .12), 'cut': (lambda d: np.zeros(10), 0), 'mute': None,
 'gulp': (lambda d: norm(lp(sweep(420, 110, .22, .6) * env_exp(.22, .07), 1200)), .45),
 'roomtone': (lambda d: np.zeros(10), 0), 'spaceHum': (lambda d: np.zeros(10), 0), 'cityDawn': (lambda d: np.zeros(10), 0), 'calm': (lambda d: np.zeros(10), 0),
}
sfx = np.zeros((N, 2)); vob = np.zeros((N, 2)); amb = np.zeros((N, 2))
missing = set()
for e in E['ev']:
    ty = e['type']
    if ty in ('vo', 'amb', 'cue', 'mute'): continue
    if ty not in FX or FX[ty] is None: missing.add(ty); continue
    f, gn = FX[ty]; d = e.get('d', .5)
    if gn <= 0: continue
    x = f(max(.1, d)) * e.get('v', 1.0)
    add(sfx, x, e['t'], gn, float(rng.uniform(-.25, .25)))
if missing: print('no sound for', missing)
# —— ambience beds per world ——
def bed(w, d):
    tt = t_(d)
    if w in ('bed', 'bedNight'):
        x = lp(brownish(d), 300) * .02 + (np.sin(2 * np.pi * 120 * tt) + .4 * np.sin(2 * np.pi * 240 * tt)) * .004
        for k in range(int(d)): s = int(k * SR); tk = hp(nz(.025), 2500) * env_exp(.025, .003) * .05; x[s:s + len(tk)] += tk[:len(x) - s]
        return x
    if w in ('class', 'space', 'moon', 'title', 'sky'): return lp(brownish(d), 200) * .025 + np.sin(2 * np.pi * 55 * tt) * .006
    if w == 'street':
        x = lp(brownish(d), 500) * .03
        for k in range(int(d / 1.7)): s = int((k * 1.7 + rng.random()) * SR); c = sweep(3000, 4200, .07) * win(.07) * .03; x[s:s + len(c)] += c[:len(x) - s]
        return x
    if w in ('storm', 'ocean'): return bp(brownish(d), 120, 1500) * .09 * (.7 + .3 * np.sin(2 * np.pi * .21 * tt))
    if w == 'map': return lp(brownish(d), 300) * .02
    if w == 'dawn': return np.sin(2 * np.pi * 60 * tt) * .004 + lp(brownish(d), 200) * .01
    if w in ('night', 'split', 'twilight', 'hot', 'new'): return bp(brownish(d), 300, 2000) * .03
    return lp(brownish(d), 300) * .02
for e in E['ev']:
    if e['type'] == 'amb': add(amb, fade(bed(e['w'], e['d']), .05, .05), e['t'], 1.0)
# —— voices: compress, balance by RMS, a touch of room ——
for e in E['ev']:
    if e['type'] != 'vo': continue
    y, _ = sf.read(os.path.join(HERE, 'voices', e['id'] + '.wav'))
    y = compress(y / np.abs(y).max(), .28, 3.2); y = y / (np.sqrt((y ** 2).mean()) + 1e-9) * .12
    add(vob, y, e['t'], 1.0 if e['who'] == 'N' else .95, .08 if e['who'] == 'N' else -.08)
er = np.zeros(int(.09 * SR)); er[0] = 1
for dly, gdb in [(.011, .22), (.019, .16), (.031, .1), (.047, .07), (.067, .04)]: er[int(dly * SR)] += gdb
vob = np.stack([fftconvolve(vob[:, c], er)[:N] for c in range(2)], 1)
# —— score, ducked ~7 dB under dialogue ——
mus, _ = sf.read(os.path.join(HERE, 'music', 'score.wav'))
mus = mus[:N] if len(mus) >= N else np.pad(mus, ((0, N - len(mus)), (0, 0)))
act = (np.abs(vob).max(1) > .01).astype(float)
duck = 1 - .55 * np.clip(uniform_filter1d(maximum_filter1d(act, int(.3 * SR)), int(.15 * SR)), 0, 1)
mix = mus * .45 * duck[:, None] + sfx * .7 + vob + amb * .9
for c in range(2): mix[:, c] = limit(mix[:, c], .55)
sf.write(os.path.join(HERE, 'mix.wav'), mix.astype(np.float32), SR)
def db(x): return 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-9)
print('mix peak %.2f rms %.1f | voice %.1f music %.1f sfx %.1f amb %.1f' % (np.abs(mix).max(), db(mix), db(vob), db(mus * .45 * duck[:, None]), db(sfx * .7), db(amb)))
