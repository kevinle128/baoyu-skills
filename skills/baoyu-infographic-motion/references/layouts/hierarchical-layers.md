# hierarchical-layers

Stacked levels where each one rests on the one below: a pyramid of needs, maturity, priority or effort.

## Use when / Avoid when

- **Use when**: maturity models, "hierarchy of needs" ideas, tech stacks built bottom up, priority tiers, effort vs value stories.
- **Avoid when**: levels are parallel, not dependent (use `bento-grid`), or the order is time, not rank (use `linear-progression`).

## Structure

- **Pyramid column** (520 px): 3–7 tiers. Each tier is a `clip-path` trapezoid computed from `--i` (0 = apex) with a label, plus an anchor dot on the slanted right edge.
- **Label cards** (right column, same grid rows): name, effort share, one line, effort bar.
- **Connectors**: one straight edge and one beam per tier, from the tier's anchor dot to its label card.
- **Lower row**: swap panel with a count-up share for the active tier, and a ring gauge.

## Motion recipe

- **Master cycle** `main`, `data-step="1.6"`, **bottom → top** (foundation is index 0, apex is the last index). `data-sfx="thump"` gives each layer weight.
- **Layer lift**: the active tier's shape and text rise 10 px (`translate` from `--on`); its tint grows, and finished tiers keep a stronger tint through `--done`, so the pyramid "builds" layer by layer and resets at the wrap.
- **Beams**: the beam for tier *k* draws from its anchor to the label card when the tier activates (`data-sfx-end="packet"`); the label card border glows at the same time.
- **Count-up**: `data-count` in each swap; `data-counter` in the header reads LAYER NN / 05.
- **Ambient**: ring gauge `data-jitter`, `data-ticker` band stat.
- **Length**: 5 × 1.6 s × 3 = 24 s.

## Skeleton

Portrait 1080×1350. Paste it over the `index.html` that `main.ts init` creates, then replace the content.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>The Data Science Pyramid</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-body { display: flex; flex-direction: column; gap: 22px; }
  .stack { position: relative; display: grid; grid-template-columns: 520px 1fr; column-gap: 60px; row-gap: 8px; }
  .tier { position: relative; grid-column: 1; height: 132px; display: grid; place-items: end center; padding-bottom: 14px; }
  .tier .shape { position: absolute; inset: 0; --wt: calc(6% + var(--i) * 8.8%); --wb: calc(6% + (var(--i) + 1) * 8.8%); translate: 0 calc(var(--on) * -10px); clip-path: polygon(calc(50% - var(--wt)) 0, calc(50% + var(--wt)) 0, calc(50% + var(--wb)) 100%, calc(50% - var(--wb)) 100%); background: color-mix(in oklab, var(--item) calc(20% + max(var(--on), var(--done)) * 30% + var(--on) * 20%), var(--panel)); }
  .tier .t { position: relative; translate: 0 calc(var(--on) * -10px); text-align: center; display: flex; flex-direction: column; gap: 2px; }
  .tier .t b { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 22px; line-height: 1; text-transform: var(--title-case); }
  .tier .t span { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.08em; color: color-mix(in oklab, var(--ink) 70%, transparent); }
  .anchor { position: absolute; top: 50%; left: calc(50% + 6% + (var(--i) + 0.5) * 8.8%); width: 12px; height: 12px; margin: -6px 0 0 -6px; border-radius: 50%; background: var(--item); box-shadow: 0 0 0 calc(var(--on) * 6px) color-mix(in oklab, var(--item) 30%, transparent); }
  .lab { grid-column: 2; height: 132px; padding: 14px 18px; display: flex; flex-direction: column; gap: 6px; }
  .lab .top { display: flex; justify-content: space-between; align-items: baseline; }
  .lab b { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 21px; text-transform: var(--title-case); color: color-mix(in oklab, var(--item) calc(var(--on) * 100%), var(--ink)); }
  .lab p { font-size: 13px; color: var(--muted); line-height: 1.35; }
  .lab .mi-bar { height: 5px; margin-top: auto; }
  .lab .mi-bar > i { width: calc(var(--e) * 100%); }
  .lower { flex: 1; display: grid; grid-template-columns: 1.5fr 1fr; gap: 22px; }
  .lower .mi-swap { padding: 18px 22px; display: grid; grid-template-columns: auto 1fr; gap: 4px 20px; align-content: center; }
  .lower .big { grid-row: 1 / 4; font-family: var(--font-display); font-weight: var(--title-weight); font-size: 70px; line-height: 1; color: var(--item); font-variant-numeric: tabular-nums; align-self: center; }
  .lower p { font-size: 14px; color: var(--muted); line-height: 1.4; }
  .lower .gauge { display: flex; gap: 18px; align-items: center; padding: 18px 22px; }
  .lower .mi-ring { --size: 110px; }
  .lower .gauge b { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 38px; line-height: 1; display: block; }
</style>
</head>
<body data-canvas="portrait" data-cycles="3" data-sfx="soft" data-fps="30" data-poster="0.9">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">DATA TEAM / MATURITY MODEL / 2026</span><span class="mi-meta">LAYER <span data-counter="main">01</span> / 05 &middot; BOTTOM UP</span></div>
    <h1 class="mi-title">AI sits on a <em>pyramid</em></h1>
    <div class="mi-sub"><span>COLLECT</span><span class="sep">&gt;</span><span>STORE</span><span class="sep">&gt;</span><span>CLEAN</span><span class="sep">&gt;</span><span>MEASURE</span><span class="sep">&gt;</span><span>LEARN</span></div>
    <div class="mi-rule" data-progress="main"></div>
  </header>

  <section class="mi-body" data-cycle="main" data-step="1.6" data-sfx="thump" data-accent data-master>
    <div class="stack">
      <svg class="mi-svg">
        <path class="mi-edge" data-link="#a4 #l4@left" data-shape="straight"></path>
        <path class="mi-edge" data-link="#a3 #l3@left" data-shape="straight"></path>
        <path class="mi-edge" data-link="#a2 #l2@left" data-shape="straight"></path>
        <path class="mi-edge" data-link="#a1 #l1@left" data-shape="straight"></path>
        <path class="mi-edge" data-link="#a0 #l0@left" data-shape="straight"></path>
        <path class="mi-beam" data-link="#a4 #l4@left" data-shape="straight" data-beam data-item="main" data-index="4" style="--item: var(--c5)" data-sfx-end="packet"></path>
        <path class="mi-beam" data-link="#a3 #l3@left" data-shape="straight" data-beam data-item="main" data-index="3" style="--item: var(--c4)" data-sfx-end="packet"></path>
        <path class="mi-beam" data-link="#a2 #l2@left" data-shape="straight" data-beam data-item="main" data-index="2" style="--item: var(--c3)" data-sfx-end="packet"></path>
        <path class="mi-beam" data-link="#a1 #l1@left" data-shape="straight" data-beam data-item="main" data-index="1" style="--item: var(--c2)" data-sfx-end="packet"></path>
        <path class="mi-beam" data-link="#a0 #l0@left" data-shape="straight" data-beam data-item="main" data-index="0" style="--item: var(--c1)" data-sfx-end="packet"></path>
      </svg>

      <div class="tier" data-item="main" data-index="4" data-color="var(--c5)" style="--item: var(--c5); --i: 0; grid-row: 1"><i class="shape"></i><i id="a4" class="anchor"></i><div class="t"><span>L5</span><b>Learn</b></div></div>
      <div class="tier" data-item="main" data-index="3" data-color="var(--c4)" style="--item: var(--c4); --i: 1; grid-row: 2"><i class="shape"></i><i id="a3" class="anchor"></i><div class="t"><span>L4</span><b>Measure</b></div></div>
      <div class="tier" data-item="main" data-index="2" data-color="var(--c3)" style="--item: var(--c3); --i: 2; grid-row: 3"><i class="shape"></i><i id="a2" class="anchor"></i><div class="t"><span>L3</span><b>Clean + explore</b></div></div>
      <div class="tier" data-item="main" data-index="1" data-color="var(--c2)" style="--item: var(--c2); --i: 3; grid-row: 4"><i class="shape"></i><i id="a1" class="anchor"></i><div class="t"><span>L2</span><b>Move + store</b></div></div>
      <div class="tier" data-item="main" data-index="0" data-color="var(--c1)" style="--item: var(--c1); --i: 4; grid-row: 5"><i class="shape"></i><i id="a0" class="anchor"></i><div class="t"><span>L1 / FOUNDATION</span><b>Collect</b></div></div>

      <div id="l4" class="mi-card lab" data-item="main" data-index="4" style="--item: var(--c5); --e: .08; grid-row: 1"><div class="top"><b>ML + AI</b><span class="mi-label">8% effort</span></div><p>Models, experiments, deep learning</p><span class="mi-bar"><i></i></span></div>
      <div id="l3" class="mi-card lab" data-item="main" data-index="3" style="--item: var(--c4); --e: .14; grid-row: 2"><div class="top"><b>Analytics</b><span class="mi-label">14% effort</span></div><p>Metrics, segments, A/B tests</p><span class="mi-bar"><i></i></span></div>
      <div id="l2" class="mi-card lab" data-item="main" data-index="2" style="--item: var(--c3); --e: .22; grid-row: 3"><div class="top"><b>Prep</b><span class="mi-label">22% effort</span></div><p>Cleaning, anomaly checks, labels</p><span class="mi-bar"><i></i></span></div>
      <div id="l1" class="mi-card lab" data-item="main" data-index="1" style="--item: var(--c2); --e: .26; grid-row: 4"><div class="top"><b>Pipelines</b><span class="mi-label">26% effort</span></div><p>ETL, warehouse, data contracts</p><span class="mi-bar"><i></i></span></div>
      <div id="l0" class="mi-card lab" data-item="main" data-index="0" style="--item: var(--c1); --e: .30; grid-row: 5"><div class="top"><b>Instrumentation</b><span class="mi-label">30% effort</span></div><p>Events, logging, sensors, user input</p><span class="mi-bar"><i></i></span></div>
    </div>

    <div class="lower">
      <div class="mi-card mi-swap-host">
        <div class="mi-swap" data-item="main" data-index="0" style="--item: var(--c1)"><span class="big" data-count="92" data-suffix="%">92%</span><span class="mi-label acc">L1 / COLLECT</span><p>of teams have event tracking. Only 41% trust it.</p></div>
        <div class="mi-swap" data-item="main" data-index="1" style="--item: var(--c2)"><span class="big" data-count="78" data-suffix="%">78%</span><span class="mi-label acc">L2 / STORE</span><p>run a central warehouse with daily loads.</p></div>
        <div class="mi-swap" data-item="main" data-index="2" style="--item: var(--c3)"><span class="big" data-count="54" data-suffix="%">54%</span><span class="mi-label acc">L3 / CLEAN</span><p>test data quality before it reaches a dashboard.</p></div>
        <div class="mi-swap" data-item="main" data-index="3" style="--item: var(--c4)"><span class="big" data-count="37" data-suffix="%">37%</span><span class="mi-label acc">L4 / MEASURE</span><p>run controlled experiments every month.</p></div>
        <div class="mi-swap" data-item="main" data-index="4" style="--item: var(--c5)"><span class="big" data-count="12" data-suffix="%">12%</span><span class="mi-label acc">L5 / LEARN</span><p>have a model in production that moves a KPI.</p></div>
      </div>
      <div class="mi-card gauge"><div class="mi-ring" data-bar="0.3" data-jitter="0.02" style="--item: var(--c1)"></div><div><span class="mi-label">FOUNDATION SHARE</span><b>30%</b><span class="mi-label">of total effort</span></div></div>
    </div>
  </section>

  <section class="mi-band">
    <div class="mi-stat" style="--item: var(--c1)"><span class="mi-stat-v">5</span><span class="mi-stat-l">Layers, built bottom up</span></div>
    <div class="mi-stat" style="--item: var(--c3)"><span class="mi-stat-v">78%</span><span class="mi-stat-l">Effort below analytics</span></div>
    <div class="mi-stat" style="--item: var(--c5)"><span class="mi-stat-v" data-ticker="12" data-jitter="0.6" data-suffix="%">12%</span><span class="mi-stat-l">Teams with AI in prod</span></div>
  </section>

  <footer class="mi-foot"><span>SOURCE / DATA TEAM SURVEY, N=412</span><span class="path">COLLECT &gt; STORE &gt; CLEAN &gt; MEASURE &gt; LEARN</span><span class="mark">studio</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Item count**: add tiers with `--i` 0…n−1 and `grid-row` 1…n, and change the half-width step so the base reaches 50%: `6% + n·s = 50%` (5 tiers → `s = 8.8%`, 4 tiers → `11%`, 6 tiers → `7.3%`). Use the same `s` in `.anchor`. Reduce tier height to keep `n × height` under ~680 px.
- **Top-down order**: to read apex first, give the apex index 0 and reverse the other indices.
- **Concentric variant**: replace the trapezoids with nested circles (absolute, centred, `width: calc(160px + var(--i) * 110px)`), paint the largest first, and link each ring's right edge anchor to its label card the same way.
- **Landscape**: pyramid 700 px wide on the left, labels and detail on the right.
- **Pitfalls**: connectors are measured once, so animate the shape and text, never the `.tier` box or the `.anchor`. Do not `scale` the base tier: it would cross the page padding.
