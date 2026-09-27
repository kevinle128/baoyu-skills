# Motion Primitives

All primitives are `data-*` attributes read by `motion.js`. Each one writes CSS variables or SVG attributes
from the clock time `t`, so preview and export show the same frame for the same `t`.

## focusCycle — the core

A cycle steps through its items one at a time. It drives highlights, beams, panel swaps, counters and
the accent colour.

```html
<section data-cycle="main" data-step="1.5" data-sfx="blip" data-accent data-master>
  <div class="mi-card" data-item data-color="var(--c1)">…</div>
  <div class="mi-card" data-item data-color="var(--c2)">…</div>
</section>
```

| On the cycle | Default | Meaning |
|--------------|---------|---------|
| `data-cycle="id"` | auto | Cycle name. Other elements link to it by this id |
| `data-step` | `1.2` | Seconds per item |
| `data-offset` | `0` | Start delay (s) |
| `data-fade` | `0.25` | Cross-fade time between items (s) |
| `data-sfx` | — | Sound cue on every step (`blip`, `tick`, `thump`, `pop`, …) |
| `data-accent` | off | Page `--accent` follows the active item's `data-color` (smooth colour blend) |
| `data-master` | first cycle | This cycle sets video length and the music beat |
| `data-count` | from items | Force the number of steps |
| `data-order="2,6,9,12"` | — | Scattered spotlight: step through these item numbers (1-based, by `data-index`/document order) instead of 1, 2, 3. Items not listed stay idle (`--on: 0`, never `--done`), so `.mi-row` / `.mi-seen` would dim them forever: style non-spotlight rows with your own classes. Counters show the item number |
| `data-shuffle="seed"` | — | Same, with a seeded random order of all items |

| On an item | Meaning |
|------------|---------|
| `data-item` | Member of the nearest ancestor cycle |
| `data-item="id"` | Member of cycle `id` (can be anywhere on the page) |
| `data-index="n"` | Step number. Elements with the same index light up together (card + beam + panel) |
| `data-color` | Colour used by `data-accent` |
| `data-sfx` | Overrides the cycle cue for this step |

Variables written on each item: `--on` (0→1 highlight envelope), `--p` (progress inside its step),
`--done` (1 after its step, fades to 0 when the cycle restarts), `--age` (s since step start).
Classes: `is-active`, `is-done`, `is-queued`. On the cycle element: `--index`, `--step-p`, `--cycle-p`.

Counter: `<span data-counter="main">01</span>` shows the active step number (`data-pad="2"`).
Panel swap: stack `.mi-swap` children (each `data-item="main" data-index="n"`) inside `.mi-swap-host`.
Row hop (done / reading / queued): `.mi-row[data-item]` inside a cycle already dims queued rows.

**Nested clocks.** Put small cycles inside cards (rows every 0.6 s, lines every 0.5 s) under a master
cycle (1.2–2 s). Choose periods that divide the master period for a clean loop.

## Connectors

```html
<svg class="mi-svg">
  <path class="mi-edge" data-link="#a #b"></path>
  <path class="mi-beam" data-link="#a #b" data-beam data-item="main" data-index="1" data-sfx-end="packet"></path>
  <path class="mi-edge" data-link="#b@bottom #c@top" data-shape="elbow" data-packets="3" data-period="2.5"></path>
</svg>
```

| Attribute | Meaning |
|-----------|---------|
| `data-link="#from #to"` | Computes the path between two elements. Add `@left/right/top/bottom/center` to pin a side |
| `data-shape` | `curve` (default), `straight`, `elbow` |
| `data-bend` | Curve strength (default `0.45`) |
| `data-gap` | Pixels to keep away from the boxes |
| `data-beam` | Line draws in when its item becomes active, a dot travels along it. `data-draw` = draw time, `data-reverse`, `data-dot="0"`, `data-dot-r` |
| `data-sfx-end` | Cue when the beam dot arrives |
| `data-packets="n"` | n dots flow along the path forever. `data-period` (s per trip), `data-phase-offset` (0–1), `data-r`, `data-reverse`, `data-packet-class` |

Connectors are measured once after fonts load. Do not move linked boxes with `translate`/`data-drift`; scale
anchor dots instead.

Beams and packets also work on a hand-drawn `<path d="…">`, `<line>`, `<polyline>`, `<circle>`.

## Ambient loops (loop-safe: periods snap to divide the video length)

| Attribute | Writes | Use for |
|-----------|--------|---------|
| `data-spin="20"` | `transform: rotate` (negative = reverse) | Orbit rings, dials. Wrap in `scaleY(.5)` for an elliptical orbit |
| `data-pulse="2"` | `--pulse` 0→1→0 | Hub glow, breathing dots (`.mi-hub` uses it) |
| `data-phase="4"` | `--phase` 0→1 saw | Scan line (`.mi-scan`), gradient drift, marquee |
| `data-drift="6"` | `translate` (px amplitude) | Floating cluster nodes. `data-period`, `data-seed` |
| `data-starfield="80"` | twinkling dots | Night / neon backgrounds. `data-size`, `data-seed` |
| `data-phase-offset="0.25"` | — | Shift pulse / phase between siblings |

## Data

| Attribute | Writes | Notes |
|-----------|--------|-------|
| `data-count="47.4"` | text | Counts up. With `data-item`: counts during its step (shows 0 while queued, so put it inside a `.mi-swap` panel). With `data-at`: at that time. Otherwise static. `data-from`, `data-dur`, `data-decimals`, `data-prefix`, `data-suffix`, `data-group` |
| `data-ticker="47.4"` | text | Live value that wobbles by `data-jitter` |
| `data-clock` | text | Running time `SS.CC` (`data-clock="mm:ss"`) |
| `data-bar="0.7"` / `"70%"` | `--value` | Fills during its step if `data-item`; `data-jitter` = live meter. Use `.mi-bar > i` or your own `height: calc(var(--value)*100%)` |
| `data-progress="main"` | `--value` | Progress through a cycle (`"time"` = whole video) |
| `<svg viewBox="0 0 200 40" data-sparkline="24">` | polyline | Scrolling live sparkline. `data-waves`, `data-speed` |
| `<svg viewBox="0 0 200 40" data-sine data-waves="2">` | polyline | Moving sine wave |
| `.mi-ring` + `data-bar` | `--value` | Ring gauge |

## Text

| Attribute | Behaviour |
|-----------|-----------|
| `data-type` | Typewriter reveal with caret. With `data-item` types during its step, else with `data-at` / `data-dur` |
| `data-log="0.6"` on `.mi-log` with `[data-line]` children | Terminal log: a new line scrolls in every 0.6 s and loops forever. `data-rows`, `data-sfx="type"` |

## Search, commands and reading

| Attribute | Behaviour |
|-----------|-----------|
| `data-follow="cycleId"` | Terminal line that retypes the active item's `data-cmd` each step, with a caret. `data-prefix="$ "`, `data-dur` |
| `data-grep="auth|cache|agent"` on a container | Grep filter: types each query into `[data-grep-query]`, rows `[data-grep-row]` that contain it get `--match` (lit), others get `--miss` (dimmed, styled by `motion.css`); `[data-grep-count]` shows the match count. `data-step` (s per query, loop-snapped), `data-dur` (typing time), `data-sfx`. `data-grep-row="text"` overrides the text matched |
| `data-select` on an inline span + class `.mi-select` | Text-selection sweep: `--sel` grows 0→1 like someone reading. With `data-item`: during its step; else `data-at` / `data-dur`. Value = sweep time (default 0.6 s) |
| `data-scramble="0.6"` on a number | Digits flicker randomly for 0.6 s, then settle. With `data-item`: when its step starts; with `data-at`: at that time; else at the end of every master period (frame 0 stays clean) |

## Accents and endings

| Attribute | Behaviour |
|-----------|-----------|
| `.mi-ants` class | Marching-ants dashed border (animated, loop-safe). Fades with `--on` when the element is an item |
| `data-flash="3"` on an item | `--flash` blinks when the item activates (badges: ACCEPT / REJECTED) |
| `data-enter="fade|up|down|left|right|scale|blur"` + `data-at` + `data-dur` | Writes `--in`. Use for an outro banner with `data-outro` on `<body>`; add `data-sfx="chime"` |

## Custom JS

```html
<script>
window.MotionSetup = (M) => {
  const el = document.querySelector("#spiral");
  M.on((t) => el.style.setProperty("--a", (t / M.duration) * 360 + "deg"));
  M.sfx("whoosh", 4.5);
};
</script>
<script src="motion.js"></script>
```

`Motion` API: `seek(t)`, `on(fn)`, `sfx(name, t, gain)`, `snap(period)`, `duration`, `ease.{out,in,inOut,sine,back}`,
`rng(seed)`, `meta()`.

`data-drift` writes the CSS `translate` property: it replaces any `translate` centring on the same element
(centre with `transform` instead) and it moves nodes after connectors are measured (link beams to static
elements only).
