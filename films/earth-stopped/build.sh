#!/bin/sh
# Rebuild "The Day Earth Stopped" from scratch: sh films/earth-stopped/build.sh
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$(cd "$HERE/../.." && pwd)}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the library folder"; exit 1; }
PY="$LIB/.venv/bin/python"
cd "$HERE"
[ -f data/world-atlas/land-50m.json ] && node tools/india.mjs data/world-atlas/land-50m.json india.json   # map data (Natural Earth via npm world-atlas, clipped; no borders); india.json is kept in the repo
node tools/lines.mjs                                               # script.js → lines.json
"$PY" "$LIB/core/tts/tts.py" lines.json out/raw                    # 1. Kokoro voices
"$PY" voice.py                                                     # 2. per-character processing + lip sync
cd "$LIB"
node core/render/events.mjs "$HERE"                                # 3. timeline → events.json
"$PY" "$HERE/music/score.py"                                       # 4. synthesized score
"$PY" "$HERE/mix.py"                                               # 5. foley + voices + ducked score → mix.wav
node "$HERE/tools/subs.mjs" && "$PY" core/render/srt.py "$HERE/out/cues.json" "$HERE/earth-stopped.srt"   # 6. subtitles
node core/render/video.mjs "$HERE" --fps 24 --workers 4 --out "$HERE/out/video.mp4"                         # 7. frames
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/mix.wav" "$HERE/earth-stopped.mp4" 24 0                   # 8. mux, −14 LUFS, no grain
