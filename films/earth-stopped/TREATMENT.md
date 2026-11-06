# The Day Earth Stopped — Treatment

Style: Sci-Fi Sitcom Toon (`styles/scifi-toon/STYLE.md`). English, 16:9, 1920×1080, 24 fps, ~14 min.
Topic: "What if the Earth suddenly stopped spinning?" for curious 16–35 viewers, mostly on phones.
Cast (original): NOVA (deadpan inventor, ringed plum bun, mustard jumpsuit), BUNTY (nervous 19-year-old in coral pyjama hoodie, one rocket slipper), GLOOP (pink three-eyed blob, non-verbal), TERRA (Earth with a face), the MOON.

## 1. Three candidate structures
1. **One world, many clocks** — the duo stays put; Nova's remote skips them forward in time (1 s → 1 h → 1 day → 1 year → 1,000 years). Each skip is a portal jump into a new palette world. Clear timeline promise, natural chapter breaks, the style's native "parallel worlds" move used for time.
2. **The tech-support call** — Nova on a stopped Earth, Bunty on a spinning one, split screen; she talks him through each disaster. Strong comedy, but split screens are hard to read on phones and the science timeline gets muddled.
3. **The job interview** — five "future Earths" interview to replace ours, each a genre cue. Funny, but turns a physics story into a list and buries the timeline.

**Chosen: 1.** The brief asks for a timeline; the style's portal/world-palette grammar maps one-to-one onto time jumps, and a petty goal (Bunty wants five more minutes of sleep) gives the comic engine "huge sci-fi means for a tiny want".

## 2. Logline and arc
To give Bunty five more minutes of sleep, Nova stops the Earth — and drags him through the next thousand years of consequences until the Moon, the only thing that could restart the planet, reveals its price.
- Setup: bedroom at dawn, the brake, the fling east (hook) and the promise ("one thing in your night sky…").
- Development: speed you can't feel → first second → first hour → first day → first year → 1,000 years; stakes rise from your body to the planet's shape.
- Turn: dead air — "Is Earth already slowing down?" "Yes." The Moon restarts Earth… by falling toward us.
- Ending: lever back up, clock ticks to 6:59, "What if we lost the Moon?" "That's worse." Callback: "Five more minutes?" "No."

## 3. Benchmark
- Learn from adult-swim-era sci-fi sitcoms (grammar only): reaction close-ups after every absurd image, dead-air reversals, a two-hander with mismatched reactions. Learn from long-form science explainers: one idea per picture, recurring diagrams (the same Terra, the same tape-measure) so the viewer never re-learns a visual.
- Don't take: any show's characters, colour combos, portal gun look, catchphrases, logo lettering, any explainer channel's bird/character designs or music.

## 4. Shot list
The full 125-shot list (framing, angle, move, duration, reason, continuity) is the production bible delivered in chat (Step 5 Parts 1–4) and is implemented in `shots.js`. Grammar per chapter:
- Cold open: medium-wide two-shot (relationship) → insert lever (the absurd detail) → wide whip (the fling) → reaction CU on freeze (the laugh is on the face) → direct-address CU push-in (the promise).
- Ch1–Ch7: each chapter opens on a wide establishing shot of its world through the portal, explains with one recurring diagram (Terra, map, cross-section), and pays every absurd image with a reaction CU of Bunty or Nova. Signature shot: the west sunrise (S71–S72): India's frozen dawn sun sinks in the EAST, black, and rises on the left.
- Camera moves used: slow push-in (cold silences), rush zoom into portal (world jumps), whip pan (argument/double take), shake on key word (panic), slow pan (storm, dry seafront), pull-back scale reveals (asteroids, planet).

## 5. Beat sheet
Driven by the voice: every line's duration comes from TTS (`voices/dur.json`) and the timeline is computed in `timeline.js` (gaps, holds and silences declared per line). Chapter targets: 0:00 cold open · 0:45 Ch1 · 2:45 Ch2 · 4:30 Ch3 · 6:30 Ch4 · 8:30 Ch5 · 10:45 Ch6 · 12:19 Ch7 · 13:40 cliffhanger · ~14:10 end.

## 6. Cue map
One cue per world, cut on the chapter's portal wipe; each cue's first beat is the cut.
| Section | Tempo | Instrumentation |
|---|---|---|
| Cold open | 70 → hit | toy-piano lullaby, hard cut, theremin title hit |
| Ch1 Speed | 112 | main theme: theremin lead, square arpeggio, analog bass, drum machine (minor) |
| Ch2 First second | 150 | surf guitar (Karplus–Strong) + fast drum machine |
| Ch3 First hour | 96 | tremolo strings (synth) + pounding bass, wind bed |
| Ch4 First day | 100 | elevator bossa: nylon guitar (KS) + brushes; kazoo stings on gags |
| Ch5 First year | 72 | warm Rhodes (FM) + "aah" pad, sad theremin |
| Ch6 1,000 years | 120 swing | vibraphone + brushed swing + walking bass |
| Ch7 Twist | 60 | theremin alone over a drone |
| Cliffhanger | — | silence, one low hit, 3-note theremin sting |
Music ducks −7 dB under dialogue; hard cuts with tails at the silences in §7.

## 7. Sound design
| Section | Ambience | Foley | Music state |
|---|---|---|---|
| Bedroom | room tone, clock tick | alarm, quilt, lever CLUNK, fling whoosh | lullaby → silence on freeze |
| Space classroom | soft hum | pops, boings, tape zip, jet flyby, sonic pop | theme |
| First second | city dawn bed | rumble, snaps, mass whoosh, moo, gauge crack | surf; cut after "YOU" |
| First hour | howling wind | debris thuds, flag flap, wave roar | strings; HARD CUT at the wave |
| First day | dead calm hum | static, blip, clock spin, bathtub glug | bossa; silence at the sunsets |
| First year | heat crackle / icy wind | footsteps, cart creak, icicle tink | Rhodes; 1 s silence "no days anymore" |
| 1,000 years | thin wind | paper unfolds, quake | vibes swing |
| Twist | hum only | laser pew, shimmer on Moon, crack | silence "Yes." · silence "toward us" |
| Cliffhanger | clock tick | lever, tick 6:58→6:59 | silence, low hit, sting |
Real silences: the freeze (0:10), "Yes." (12:15), "…toward us" (13:20), "That's worse" (13:45). J/L-cuts: the alarm runs over the portal into the title; the storm wind leads into Ch3 under the portal.

## 8. Subtitles and titles
Baloo 2 ExtraBold ~50 px, white with ~11 px black outline, bottom centre, speaker pill on the left (Nova #F2A33A, Bunty #FF6B5B) with a boiling outline. World tag: VT323 terminal text top-left (`T+00:00:01 // FIRST SECOND`) typed in, in the chapter's accent colour. Title: chunky display (Lilita One) in saffron #FFB627, purple-black outline, popped on 12 fps steps; never acid green, never slime drips. On-screen numbers (1,670 km/h, 47 g, 4.6 km/h…) as short chunky labels in the same lettering.

## Fact-check fixes carried into the script
Walk EAST to stay in the sunset; India is frozen at SUNRISE (not noon); "Is Earth already slowing down?".
