# Sound Effects

All sound is synthesized in the browser by `motion.js` (WebAudio). No audio files are shipped, so there
are no licence issues. Preview (`♪ on` button) and export use the same synth, so what you hear in preview
is what the MP4 contains. Export renders the track with `OfflineAudioContext`, then ffmpeg normalizes the
loudness and muxes it. GIFs have no sound.

## Profiles (`<body data-sfx>` or `--sfx`)

| Profile | Bed | Grid | Loudness | Use for |
|---------|-----|------|----------|---------|
| `soft` (default) | Quiet pad chord | Tick every half step (0.25–0.6 s) | −16 LUFS | Research, explainers, calm data |
| `music` | Pad with chord changes | Kick on each master step, hat on off-beats (+ riser for one-shot videos) | −14 LUFS | Social posts, energetic topics, launches |
| `none` | — | — | — | Silent MP4 |

The master cycle step (`data-step` on the `data-master` cycle) is the beat. `data-step="0.6"` = 100 BPM
kick, `0.5` = 120 BPM, `1.5` = 40 BPM (use `soft`). For `music`, a step of 0.5–0.75 s works best.

`--music <file>` mixes the user's own track under the cues (`--music-volume`, default 0.35). The file is
looped or trimmed to the video length. Only use music the user owns or has a licence for.

## Cues

| Name | Sound | Put it on |
|------|-------|-----------|
| `tick` | Short high click | Fast nested clocks (rows every 0.3–0.6 s) |
| `blip` | Clean sine plip | Master focus step (default choice) |
| `thump` | Low soft hit | Master step in dark / heavy styles |
| `pop` | Bubble pop | Badges, cells, milestones appearing |
| `packet` | Tiny data burst | `data-sfx-end` when a beam dot arrives |
| `type` | Key click | `data-log` lines, typewriter text |
| `whoosh` | Air sweep | Panel swaps, big transitions (use rarely) |
| `chime` | Bell chord | Outro banner, final result |
| `success` | Two rising notes | ACCEPT / pass badges |
| `error` | Two low buzzes | REJECTED / fail badges |
| `riser` | Noise sweep up | Before a reveal (via `Motion.sfx("riser", t)`) |

Where cues come from:
- `data-sfx` on a `data-cycle` → one cue per step; `data-sfx` on an item overrides its step.
- `data-sfx-end` on a beam → cue when the dot arrives.
- `data-sfx` on `data-log` → cue per new line (`data-gain` default 0.6).
- `data-sfx` on a `data-enter` element → cue at `data-at`.
- `Motion.sfx(name, t, gain)` in `MotionSetup`.

## Rules

1. One main cue per master step. Add at most one more layer (packets or ticks). More sounds = noise.
2. Nested fast clocks: leave them silent or use `tick` with `data-gain="0.4"`.
3. Keep `success` / `error` / `chime` for real events, not every step.
4. Check the cue count in the export JSON (`cues`). For a 24 s video, 20–60 cues is normal.
