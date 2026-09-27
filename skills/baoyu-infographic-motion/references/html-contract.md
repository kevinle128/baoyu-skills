# HTML Contract

Every animated infographic is one folder with four files. `main.ts init` creates them.

```
<work-dir>/
├── index.html     # the infographic (you write the content)
├── motion.css     # shared page chrome + primitive styles (do not edit)
├── style.css      # the chosen style (copy of assets/styles/<style>.css)
└── motion.js      # runtime (do not edit)
```

## Page skeleton

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Short title</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>/* layout rules for this page only */</style>
</head>
<body data-canvas="portrait" data-cycles="3" data-sfx="soft" data-fps="30" data-poster="0.9">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">…</header>
  <section class="mi-body" data-cycle="main" data-step="1.5" data-sfx="blip" data-accent data-master>
    …layout…
  </section>
  <section class="mi-band">…stats…</section>
  <footer class="mi-foot">…</footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

`motion.js` MUST be the last element in `<body>`. `style.css` MUST come after `motion.css`.

## `<body>` settings

| Attribute | Default | Meaning |
|-----------|---------|---------|
| `data-canvas` | `portrait` | `portrait` 1080×1350, `square` 1080×1080, `story` 1080×1920, `landscape` 1920×1080, `paper` 1200×1600 (3:4 document page; export with `--scale 1.5` for 1800×2400), or `WxH` |
| `data-cycles` | `2` | Video length = master cycle period × cycles (+ outro) |
| `data-duration` | — | Fixed length in seconds. Overrides `data-cycles` |
| `data-outro` | `0` | Extra seconds at the end with no cycle cues (for an outro banner) |
| `data-loop` | `true` | `false` = one-shot video (pad fades in/out, GIF plays once) |
| `data-fps` | `30` | Export frame rate |
| `data-sfx` | `soft` | Sound profile: `soft`, `music`, `none` |
| `data-poster` | `0` | Time (s) of the poster / thumbnail frame |

URL query overrides any of them for a quick test: `index.html?cycles=1&t=2.4`.

## Page chrome (use on every page)

| Class | Content |
|-------|---------|
| `.mi-top` > `.mi-crumb` + `.mi-meta` | Breadcrumb left, counter / clock right |
| `.mi-title` with `<em>` | Headline, the `<em>` word takes the accent colour |
| `.mi-sub` with `<span class="sep">&gt;</span>` | One-line path of key ideas |
| `.mi-rule[data-progress="<cycle>"]` | Underline that fills with cycle progress |
| `.mi-body` | Main area (flex: 1). Put the layout here |
| `.mi-band` (`--cols`) > `.mi-stat` > `.mi-stat-v` + `.mi-stat-l` | Bottom stats |
| `.mi-foot` > spans + `.path` + `.mark` | Source, path, wordmark |

Building blocks: `.mi-card`, `.mi-row`, `.mi-label` (`.acc` = accent), `.mi-chip`, `.mi-badge`, `.mi-bar > i`, `.mi-ring`,
`.mi-code` > `.mi-code-line`, `.mi-hub`, `.mi-svg` (full-size SVG overlay for connectors), `.mi-edge`, `.mi-beam`,
`.mi-swap-host` > `.mi-swap`, `.mi-log`, `.mi-starfield`, `.mi-scan`, `.mi-bg` (absolute background layer).
Helpers: `.mi-dim` (fade when not active), `.mi-seen` (dim until active or done), `.mi-lift`, `.mi-tint`.

Set a per-element colour with `style="--item: var(--c3)"`. Style tokens: `--c1`…`--c6`, `--accent`, `--ink`,
`--muted`, `--line`, `--panel`, `--panel2`, `--bg`.

## Rules

1. **Frame 0 is the finished infographic.** Everything is visible at t = 0. Motion keeps the picture alive
   (highlight cycle, packets, pulses). Do not build the page from empty. Use `data-enter` only for an outro.
   Exception: a layout may build up from empty when its reference format does (e.g. `swarm-fanout`); then
   `data-poster` must point at the full state and the layout md must say so.
2. **All motion comes from the clock.** Style with the CSS variables that the runtime writes
   (`--on`, `--p`, `--done`, `--value`, `--pulse`, `--phase`, `--in`, `--flash`). Do not use CSS
   `transition`, do not toggle classes from your own timers, do not use `setInterval` / `requestAnimationFrame`.
   Infinite CSS `@keyframes` are allowed; the runtime stretches them so they loop cleanly.
   Custom JS: define `window.MotionSetup = (Motion) => Motion.on((t) => { … })` before `motion.js`.
3. **Fixed canvas.** Lay out in CSS pixels for the canvas size. Nothing may overflow `.mi-page`. Check the
   poster PNG before exporting video.
4. **Text is real text.** Keep it short: title ≤ 8 words, card titles ≤ 4 words, rows ≤ 40 characters.
   Minimum font size 12 px at 1080 wide.
5. **Fonts.** Only Google Fonts through `@import` in the style file, or system fonts. The runtime waits for
   fonts before it measures connectors.
6. **Reserved names.** The runtime writes `--mi-w` / `--mi-h` (canvas size) on `<html>` and per-item variables
   (`--on`, `--p`, `--done`, `--age`, `--value`, …). Do not reuse these names for your own variables.
   With `data-order`, every item needs an explicit `data-index` or a stable document order, because
   order numbers refer to item numbers.
7. **Connectors.** Use `data-link="#a #b"` on `<path>` inside `.mi-svg`. Do not hand-write coordinates.
8. **Loop length.** Pick `data-step` × items × `data-cycles` between 12 and 30 s. Nested cycles loop best
   when their period divides the master period.
9. **Offline safe.** No external scripts, no network calls except Google Fonts.
