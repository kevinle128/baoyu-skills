# winding-roadmap

A journey along a winding road: milestones in order, with where you are now and where you are going.

## Use when / Avoid when

- **Use when**: product or company roadmaps, learning paths, career paths, customer journeys, multi-quarter plans with a destination.
- **Avoid when**: fewer than 5 steps (use `linear-progression`), or the steps repeat (use `circular-flow`).

## Structure

- **Map**: three serpentine rows in a `1fr` grid; row 2 runs right to left (`direction: rtl`). 3 milestones per row (6–9 in total), the last one is the goal (diamond dot, dashed card).
- **Milestone**: a dot on the road and a card below it (quarter, status chip DONE / NOW / NEXT / GOAL, title, one line, owner, progress bar).
- **Road**: every segment is drawn three times with the same `data-link`: a thick `.road`, a dashed `.lane` centre line, and a `.mi-beam`. Row ends connect with U-turns: `#d2@right #d3@right` and `#d5@left #d6@left` with `data-bend="0.55"`.
- **Journey bar**: `data-progress` bar and counter under the map.

## Motion recipe

- **Master cycle** `main`, `data-step="1.4"`, one milestone per step.
- **Travelling dot**: the beam into milestone *k* has `data-index="k"` and `data-dot-r="9"`, so a large dot drives along the S-curve from the previous stop, including around the U-turns. Finished beams stay drawn (`--done`), so the travelled road fills in the milestone colours and resets on the wrap.
- **Milestone pop**: the dot scales up 45% with a halo ring (`--on`), fills solid once reached (`--done`); the card lifts 6 px and tints. `data-sfx-end="pop"` fires on arrival.
- **Accent**: each milestone's `data-color` drives the page accent (title word, progress, counter).
- **Sound**: `tick` on each step, `pop` on arrival.
- **Length**: 9 × 1.4 s × 2 = 25.2 s.

## Skeleton

Portrait 1080×1350. Paste it over the `index.html` that `main.ts init` creates, then replace the content.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Road to Platform</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-body { display: flex; flex-direction: column; gap: 16px; }
  .map { position: relative; flex: 1; min-height: 0; display: grid; grid-template-rows: repeat(3, 1fr); }
  .map .mi-svg { z-index: 0; }
  .road { fill: none; stroke: color-mix(in oklab, var(--ink) 12%, var(--line)); stroke-width: 22; stroke-linecap: round; }
  .lane { fill: none; stroke: var(--bg); stroke-width: 2; stroke-dasharray: 10 10; }
  .map .mi-beam { stroke-width: 8; }
  .map .mi-beam-dot { stroke: var(--bg); stroke-width: 3; }
  .row { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(3, 1fr); padding: 0 104px; }
  .row.rev { direction: rtl; }
  .row.rev > * { direction: ltr; }
  .ms { display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .dot { width: 30px; height: 30px; border-radius: 50%; background: color-mix(in oklab, var(--item) calc(max(var(--on), var(--done)) * 100%), var(--panel)); border: 4px solid var(--item); scale: calc(1 + var(--on) * 0.45); box-shadow: 0 0 0 calc(var(--on) * 10px) color-mix(in oklab, var(--item) 22%, transparent); }
  .ms.done .dot { background: var(--item); }
  .card { width: 204px; padding: 14px 16px; display: flex; flex-direction: column; gap: 5px; translate: 0 calc(var(--on) * -6px); background: color-mix(in oklab, var(--item) calc(var(--on) * 12%), var(--panel)); }
  .card .mi-label { display: flex; justify-content: space-between; align-items: center; }
  .card .mi-chip { font-size: 11px; padding: 2px 7px; }
  .card b { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 21px; line-height: 1.05; text-transform: var(--title-case); }
  .card .meta { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 12px; color: var(--muted); margin-top: 4px; }
  .card .mi-bar { height: 5px; }
  .card .mi-bar > i { width: calc(var(--pv) * 100%); }
  .card small { font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
  .ms.done .mi-chip { background: color-mix(in oklab, var(--item) 14%, transparent); }
  .ms.now .mi-chip { background: var(--item); color: var(--bg); }
  .ms.goal .card { border-width: 2px; border-style: dashed; border-color: var(--item); }
  .ms.goal .dot { border-radius: 6px; rotate: 45deg; }
  .status { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 18px; padding: 14px 20px; }
  .status .mi-bar { height: 10px; }
  .status b { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 30px; color: var(--accent); }
</style>
</head>
<body data-canvas="portrait" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="0.9">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">COMPANY / PRODUCT ROADMAP / 2026&ndash;2028</span><span class="mi-meta">MILESTONE <span data-counter="main">01</span> / 09</span></div>
    <h1 class="mi-title">The road to <em>platform</em></h1>
    <div class="mi-sub"><span>BETA</span><span class="sep">&gt;</span><span>TRUST</span><span class="sep">&gt;</span><span>ECOSYSTEM</span><span class="sep">&gt;</span><span>SCALE</span></div>
    <div class="mi-rule" data-progress="main"></div>
  </header>

  <section class="mi-body" data-cycle="main" data-step="1.4" data-sfx="tick" data-accent data-master>
    <div class="map">
      <svg class="mi-svg">
        <path class="road" data-link="#d0 #d1"></path>
        <path class="road" data-link="#d1 #d2"></path>
        <path class="road" data-link="#d2@right #d3@right" data-bend="0.55"></path>
        <path class="road" data-link="#d3 #d4"></path>
        <path class="road" data-link="#d4 #d5"></path>
        <path class="road" data-link="#d5@left #d6@left" data-bend="0.55"></path>
        <path class="road" data-link="#d6 #d7"></path>
        <path class="road" data-link="#d7 #d8"></path>
        <path class="lane" data-link="#d0 #d1"></path>
        <path class="lane" data-link="#d1 #d2"></path>
        <path class="lane" data-link="#d2@right #d3@right" data-bend="0.55"></path>
        <path class="lane" data-link="#d3 #d4"></path>
        <path class="lane" data-link="#d4 #d5"></path>
        <path class="lane" data-link="#d5@left #d6@left" data-bend="0.55"></path>
        <path class="lane" data-link="#d6 #d7"></path>
        <path class="lane" data-link="#d7 #d8"></path>
        <path class="mi-beam" data-link="#d0 #d1" data-beam data-item="main" data-index="1" data-dot-r="9" style="--item: var(--c1)" data-sfx-end="pop"></path>
        <path class="mi-beam" data-link="#d1 #d2" data-beam data-item="main" data-index="2" data-dot-r="9" style="--item: var(--c2)" data-sfx-end="pop"></path>
        <path class="mi-beam" data-link="#d2@right #d3@right" data-bend="0.55" data-beam data-item="main" data-index="3" data-dot-r="9" style="--item: var(--c2)" data-sfx-end="pop"></path>
        <path class="mi-beam" data-link="#d3 #d4" data-beam data-item="main" data-index="4" data-dot-r="9" style="--item: var(--c3)" data-sfx-end="pop"></path>
        <path class="mi-beam" data-link="#d4 #d5" data-beam data-item="main" data-index="5" data-dot-r="9" style="--item: var(--c3)" data-sfx-end="pop"></path>
        <path class="mi-beam" data-link="#d5@left #d6@left" data-bend="0.55" data-beam data-item="main" data-index="6" data-dot-r="9" style="--item: var(--c4)" data-sfx-end="pop"></path>
        <path class="mi-beam" data-link="#d6 #d7" data-beam data-item="main" data-index="7" data-dot-r="9" style="--item: var(--c4)" data-sfx-end="pop"></path>
        <path class="mi-beam" data-link="#d7 #d8" data-beam data-item="main" data-index="8" data-dot-r="9" style="--item: var(--c5)" data-sfx-end="pop"></path>
      </svg>
      <div class="row">
        <div class="ms done" data-item="main" data-index="0" data-color="var(--c1)" style="--item: var(--c1)"><i id="d0" class="dot"></i><div class="mi-card card"><span class="mi-label"><span>Q1 26</span><span class="mi-chip">DONE</span></span><b>Private beta</b><small>40 design partners</small><span class="meta"><span>owner: product</span><span>100%</span></span><span class="mi-bar" style="--pv: 1"><i></i></span></div></div>
        <div class="ms done" data-item="main" data-index="1" data-color="var(--c1)" style="--item: var(--c1)"><i id="d1" class="dot"></i><div class="mi-card card"><span class="mi-label"><span>Q2 26</span><span class="mi-chip">DONE</span></span><b>Public API</b><small>usage billing live</small><span class="meta"><span>owner: platform</span><span>100%</span></span><span class="mi-bar" style="--pv: 1"><i></i></span></div></div>
        <div class="ms done" data-item="main" data-index="2" data-color="var(--c2)" style="--item: var(--c2)"><i id="d2" class="dot"></i><div class="mi-card card"><span class="mi-label"><span>Q3 26</span><span class="mi-chip">DONE</span></span><b>SOC 2 Type II</b><small>audit window closed</small><span class="meta"><span>owner: security</span><span>100%</span></span><span class="mi-bar" style="--pv: 1"><i></i></span></div></div>
      </div>
      <div class="row rev">
        <div class="ms now" data-item="main" data-index="3" data-color="var(--c2)" style="--item: var(--c2)"><i id="d3" class="dot"></i><div class="mi-card card"><span class="mi-label"><span>Q4 26</span><span class="mi-chip">NOW</span></span><b>EU region</b><small>data residency</small><span class="meta"><span>owner: infra</span><span>60%</span></span><span class="mi-bar" style="--pv: 0.6"><i></i></span></div></div>
        <div class="ms next" data-item="main" data-index="4" data-color="var(--c3)" style="--item: var(--c3)"><i id="d4" class="dot"></i><div class="mi-card card"><span class="mi-label"><span>Q1 27</span><span class="mi-chip">NEXT</span></span><b>Agents SDK</b><small>TS + Python</small><span class="meta"><span>owner: devex</span><span>15%</span></span><span class="mi-bar" style="--pv: 0.15"><i></i></span></div></div>
        <div class="ms next" data-item="main" data-index="5" data-color="var(--c3)" style="--item: var(--c3)"><i id="d5" class="dot"></i><div class="mi-card card"><span class="mi-label"><span>Q2 27</span><span class="mi-chip">NEXT</span></span><b>Marketplace</b><small>3rd-party tools</small><span class="meta"><span>owner: bizdev</span><span>5%</span></span><span class="mi-bar" style="--pv: 0.05"><i></i></span></div></div>
      </div>
      <div class="row">
        <div class="ms next" data-item="main" data-index="6" data-color="var(--c4)" style="--item: var(--c4)"><i id="d6" class="dot"></i><div class="mi-card card"><span class="mi-label"><span>Q3 27</span><span class="mi-chip">NEXT</span></span><b>On-prem</b><small>air-gapped deploy</small><span class="meta"><span>owner: infra</span><span>0%</span></span><span class="mi-bar" style="--pv: 0"><i></i></span></div></div>
        <div class="ms next" data-item="main" data-index="7" data-color="var(--c4)" style="--item: var(--c4)"><i id="d7" class="dot"></i><div class="mi-card card"><span class="mi-label"><span>Q4 27</span><span class="mi-chip">NEXT</span></span><b>1K customers</b><small>net retention 125%</small><span class="meta"><span>owner: sales</span><span>32%</span></span><span class="mi-bar" style="--pv: 0.32"><i></i></span></div></div>
        <div class="ms goal" data-item="main" data-index="8" data-color="var(--c5)" style="--item: var(--c5)"><i id="d8" class="dot"></i><div class="mi-card card"><span class="mi-label"><span>2028</span><span class="mi-chip">GOAL</span></span><b>Platform</b><small>default AI stack</small><span class="meta"><span>owner: everyone</span><span>12%</span></span><span class="mi-bar" style="--pv: 0.12"><i></i></span></div></div>
      </div>
    </div>
    <div class="mi-card status"><span class="mi-label acc">JOURNEY</span><span class="mi-bar" data-progress="main"><i></i></span><b><span data-counter="main">01</span> / 09</b></div>
  </section>

  <section class="mi-band">
    <div class="mi-stat" style="--item: var(--c1)"><span class="mi-stat-v">3 / 9</span><span class="mi-stat-l">Milestones shipped</span></div>
    <div class="mi-stat" style="--item: var(--c2)"><span class="mi-stat-v">Q4 26</span><span class="mi-stat-l">You are here</span></div>
    <div class="mi-stat" style="--item: var(--c5)"><span class="mi-stat-v" data-ticker="1000" data-jitter="0" data-group>1,000</span><span class="mi-stat-l">Customer goal, 2027</span></div>
  </section>

  <footer class="mi-foot"><span>SOURCE / BOARD DECK, SEPT 2026</span><span class="path">BETA &gt; API &gt; TRUST &gt; ECOSYSTEM &gt; PLATFORM</span><span class="mark">studio</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Item count**: 2 rows × 3 (6 stops) or 3 rows × 3 (9). For 4 per row, set `repeat(4, 1fr)`, reduce card width to 170 px and padding to 90 px. Every U-turn joins the last dot of one row to the first dot of the next on the same side (`@right @right` on odd turns, `@left @left` on even turns).
- **Story 1080×1920**: 4 rows × 3 stops (12 milestones) at the same card size.
- **Landscape**: 2 rows × 5 stops, row padding 140 px.
- **Pitfalls**: the side padding of `.row` (104 px) is the room for the U-turn bulge; with `data-bend="0.55"` the curve extends about 0.75 × 0.55 × row height past the dot. Cards must end before it, so keep card width ≤ 210 px. Connectors are measured once at load: never move the `.dot` with `translate` (only `scale` around its centre).
