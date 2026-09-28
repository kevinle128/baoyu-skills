# circular-flow

A repeating cycle of 4–8 phases around a hub: the process has no end, the last phase feeds the first.

## Use when / Avoid when

- **Use when**: feedback loops, DevOps / PDCA / OODA cycles, product flywheels, lifecycles, sprint rituals.
- **Avoid when**: the steps have a clear start and finish (use `linear-progression`), or phases are unequal in weight (use `funnel` or `hierarchical-layers`).

## Structure

- **Ring** (600×600, left): 6 phase cards placed on a circle with CSS `cos()` / `sin()` from `--a`, a track circle, a rotating tick ring, an inner dashed orbit with packets, and a `.mi-hub` in the centre showing the phase counter.
- **Side column** (right): detail `.mi-swap-host` (one swap per phase: title, sentence, count-up number, two key-values) and an event-stream log.
- **Phase strip** (full width): one card per phase with a live sparkline, key number and step bar.
- 4–8 phases. 6 is ideal; with 4 use angles −90/0/90/180, with 8 step 45°.

## Motion recipe

- **Master cycle** `main`, `data-step="1.5"`; node card, swap and strip card share `data-index`. `data-accent` follows each phase colour, so the hub ring, tick ring and title accent change together.
- **Active arc**: six hand-drawn arc paths (`A 215,215 0 0 1 …`) in the ring's own `viewBox="0 0 600 600"`, each a `data-beam` with the index of the phase it arrives at. The arc draws from the previous node to the new one with a travelling dot; the last arc (index 0) closes the loop.
- **Nested / ambient**: tick ring `data-spin="30"`, inner orbit `data-packets="6"` (loop-safe), hub `data-pulse="3"`, event log every 0.75 s, strip sparklines, `data-ticker` band stats.
- **Sound**: `blip` per phase, `packet` when an arc lands.
- **Length**: 6 × 1.5 s × 3 cycles = 27 s.

## Skeleton

Portrait 1080×1350. Paste it over the `index.html` that `main.ts init` creates, then replace the content.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>The Delivery Loop</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-body { display: grid; grid-template-columns: 600px 1fr; grid-template-rows: 600px 1fr; gap: 22px 26px; }
  .ring { position: relative; width: 600px; height: 600px; }
  .ring svg { position: absolute; inset: 0; width: 600px; height: 600px; overflow: visible; }
  .ring .track { fill: none; stroke: var(--line); stroke-width: 3; }
  .ring .ticks { fill: none; stroke: color-mix(in oklab, var(--accent) 45%, var(--line)); stroke-width: 10; stroke-dasharray: 2 14; }
  .ring .inner { fill: none; stroke: var(--line); stroke-width: 1.5; stroke-dasharray: 6 8; }
  .ring .mi-beam { stroke-width: 6; }
  .ring .node { position: absolute; width: 150px; height: 84px; left: calc(300px + cos(var(--a)) * 215px - 75px); top: calc(300px + sin(var(--a)) * 215px - 42px); padding: 12px 14px; display: flex; flex-direction: column; justify-content: space-between; background: color-mix(in oklab, var(--item) calc(var(--on) * 14%), var(--panel)); scale: calc(1 + var(--on) * 0.08); }
  .node .mi-label { display: flex; justify-content: space-between; font-size: 12px; }
  .node b { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 24px; text-transform: var(--title-case); color: color-mix(in oklab, var(--item) calc(var(--on) * 100%), var(--ink)); }
  .ring .hub { position: absolute; left: 190px; top: 190px; width: 220px; height: 220px; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 4px; }
  .hub .n { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 64px; line-height: 1; color: var(--accent); }
  .hub .mi-label { font-size: 12px; }
  .side { display: flex; flex-direction: column; gap: 16px; }
  .side .mi-swap-host { height: 330px; }
  .side .mi-swap { padding: 22px; display: flex; flex-direction: column; gap: 10px; }
  .side h4 { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 34px; line-height: 1; text-transform: var(--title-case); color: var(--item); }
  .side p { font-size: 14px; line-height: 1.45; color: var(--muted); }
  .kv { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 14px; padding: 7px 0; border-top: 1px dashed var(--line); }
  .kv span:last-child { font-weight: 600; color: var(--item); }
  .big { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 56px; line-height: 1; color: var(--ink); font-variant-numeric: tabular-nums; }
  .log { background: var(--code-bg); color: var(--code-ink); border-radius: calc(var(--radius) * 0.7); padding: 14px 16px; flex: 1; }
  .log .mi-log { --row-h: 27px; --rows: 7; font-size: 13px; }
  .log .k { color: var(--code-accent); }
  .strip { grid-column: 1 / -1; display: flex; flex-direction: column; gap: 12px; }
  .segs { flex: 1; display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
  .segs .mi-card { padding: 14px; display: flex; flex-direction: column; gap: 6px; background: color-mix(in oklab, var(--item) calc(var(--on) * 10%), var(--panel)); }
  .segs b { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 21px; text-transform: var(--title-case); color: color-mix(in oklab, var(--item) calc(var(--on) * 100%), var(--ink)); }
  .segs .v { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 34px; line-height: 1; color: var(--item); font-variant-numeric: tabular-nums; margin-top: auto; }
  .segs .sp { width: 100%; flex: 1; min-height: 0; }
  .segs small { font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
  .segs .mi-bar { height: 5px; margin-top: 6px; }
  .segs .mi-bar > i { width: calc(max(var(--p), var(--done)) * 100%); }
</style>
</head>
<body data-canvas="portrait" data-cycles="3" data-sfx="soft" data-fps="30" data-poster="0.9">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">PLATFORM ENG / DELIVERY HANDBOOK / CH 03</span><span class="mi-meta">LOOP #184 &middot; PHASE <span data-counter="main">01</span> / 06</span></div>
    <h1 class="mi-title">The delivery loop <em>never stops</em></h1>
    <div class="mi-sub"><span>PLAN</span><span class="sep">&gt;</span><span>BUILD</span><span class="sep">&gt;</span><span>SHIP</span><span class="sep">&gt;</span><span>LEARN</span><span class="sep">&gt;</span><span>REPEAT</span></div>
    <div class="mi-rule" data-progress="main"></div>
  </header>

  <section class="mi-body" data-cycle="main" data-step="1.5" data-sfx="blip" data-accent data-master>
    <div class="ring">
      <svg viewBox="0 0 600 600">
        <circle class="ticks" cx="300" cy="300" r="268" data-spin="30"></circle>
        <circle class="track" cx="300" cy="300" r="215"></circle>
        <circle class="inner" cx="300" cy="300" r="150" data-packets="6" data-period="6" data-r="4"></circle>
        <path class="mi-beam" d="M300,85 A215,215 0 0 1 486.2,192.5" data-beam data-item="main" data-index="1" style="--item: var(--c2)" data-sfx-end="packet"></path>
        <path class="mi-beam" d="M486.2,192.5 A215,215 0 0 1 486.2,407.5" data-beam data-item="main" data-index="2" style="--item: var(--c3)" data-sfx-end="packet"></path>
        <path class="mi-beam" d="M486.2,407.5 A215,215 0 0 1 300,515" data-beam data-item="main" data-index="3" style="--item: var(--c4)" data-sfx-end="packet"></path>
        <path class="mi-beam" d="M300,515 A215,215 0 0 1 113.8,407.5" data-beam data-item="main" data-index="4" style="--item: var(--c5)" data-sfx-end="packet"></path>
        <path class="mi-beam" d="M113.8,407.5 A215,215 0 0 1 113.8,192.5" data-beam data-item="main" data-index="5" style="--item: var(--c6)" data-sfx-end="packet"></path>
        <path class="mi-beam" d="M113.8,192.5 A215,215 0 0 1 300,85" data-beam data-item="main" data-index="0" style="--item: var(--c1)" data-sfx-end="packet"></path>
      </svg>
      <div class="mi-hub hub" data-pulse="3"><span class="mi-label">PHASE</span><span class="n" data-counter="main">01</span><span class="mi-label">14-DAY CYCLE</span></div>
      <div class="mi-card node" data-item="main" data-index="0" data-color="var(--c1)" style="--a: -90deg; --item: var(--c1)"><span class="mi-label"><span>01</span><span>D1&ndash;2</span></span><b>Plan</b></div>
      <div class="mi-card node" data-item="main" data-index="1" data-color="var(--c2)" style="--a: -30deg; --item: var(--c2)"><span class="mi-label"><span>02</span><span>D3&ndash;7</span></span><b>Code</b></div>
      <div class="mi-card node" data-item="main" data-index="2" data-color="var(--c3)" style="--a: 30deg; --item: var(--c3)"><span class="mi-label"><span>03</span><span>CI</span></span><b>Build</b></div>
      <div class="mi-card node" data-item="main" data-index="3" data-color="var(--c4)" style="--a: 90deg; --item: var(--c4)"><span class="mi-label"><span>04</span><span>CI</span></span><b>Test</b></div>
      <div class="mi-card node" data-item="main" data-index="4" data-color="var(--c5)" style="--a: 150deg; --item: var(--c5)"><span class="mi-label"><span>05</span><span>D10</span></span><b>Release</b></div>
      <div class="mi-card node" data-item="main" data-index="5" data-color="var(--c6)" style="--a: 210deg; --item: var(--c6)"><span class="mi-label"><span>06</span><span>24/7</span></span><b>Monitor</b></div>
    </div>

    <div class="side">
      <div class="mi-card mi-swap-host">
        <div class="mi-swap" data-item="main" data-index="0" style="--item: var(--c1)"><span class="mi-label acc">PHASE 01</span><h4>Plan</h4><p>Pick the smallest slice that moves one metric.</p><span class="big" data-count="12">12</span><div class="kv"><span>tickets</span><span>12</span></div><div class="kv"><span>owner</span><span>PM + TL</span></div></div>
        <div class="mi-swap" data-item="main" data-index="1" style="--item: var(--c2)"><span class="mi-label acc">PHASE 02</span><h4>Code</h4><p>Trunk-based. Feature flags hide half-done work.</p><span class="big" data-count="38">38</span><div class="kv"><span>pull requests</span><span>38</span></div><div class="kv"><span>review time</span><span>3.2 h</span></div></div>
        <div class="mi-swap" data-item="main" data-index="2" style="--item: var(--c3)"><span class="mi-label acc">PHASE 03</span><h4>Build</h4><p>Cached, hermetic builds on every push.</p><span class="big" data-count="6.4" data-suffix="m">6.4m</span><div class="kv"><span>median build</span><span>6.4 min</span></div><div class="kv"><span>cache hit</span><span>91%</span></div></div>
        <div class="mi-swap" data-item="main" data-index="3" style="--item: var(--c4)"><span class="mi-label acc">PHASE 04</span><h4>Test</h4><p>Unit, contract and smoke suites gate the merge.</p><span class="big" data-count="4210">4210</span><div class="kv"><span>tests run</span><span>4,210</span></div><div class="kv"><span>flaky</span><span>0.4%</span></div></div>
        <div class="mi-swap" data-item="main" data-index="4" style="--item: var(--c5)"><span class="mi-label acc">PHASE 05</span><h4>Release</h4><p>Progressive rollout: 1%, 10%, 50%, 100%.</p><span class="big" data-count="4">4</span><div class="kv"><span>waves</span><span>4</span></div><div class="kv"><span>rollbacks</span><span>0</span></div></div>
        <div class="mi-swap" data-item="main" data-index="5" style="--item: var(--c6)"><span class="mi-label acc">PHASE 06</span><h4>Monitor</h4><p>SLOs and user signals feed the next plan.</p><span class="big" data-count="99.95" data-suffix="%">99.95%</span><div class="kv"><span>availability</span><span>99.95%</span></div><div class="kv"><span>alerts</span><span>2</span></div></div>
      </div>
      <div class="mi-label">EVENT STREAM</div>
      <div class="log">
        <div class="mi-log" data-log="0.75" data-rows="7">
          <div data-line><span class="k">plan</span> sprint 184 scoped</div>
          <div data-line><span class="k">git</span> merge #4412 to main</div>
          <div data-line><span class="k">ci</span> build 9f2c cached</div>
          <div data-line><span class="k">test</span> 4210 passed</div>
          <div data-line><span class="k">cd</span> wave 2 at 10%</div>
          <div data-line><span class="k">slo</span> p99 182ms ok</div>
          <div data-line><span class="k">obs</span> signup +3.1%</div>
          <div data-line><span class="k">plan</span> feedback filed</div>
        </div>
      </div>
    </div>

    <div class="strip">
      <div class="mi-label" style="display:flex;justify-content:space-between"><span class="acc">LOOP #184 PROGRESS</span><span>CYCLE TIME 14 D / DEPLOYS 11</span></div>
      <div class="segs">
        <div class="mi-card" data-item="main" data-index="0" style="--item: var(--c1)"><span class="mi-label">01</span><b>PLAN</b><svg class="sp" viewBox="0 0 120 50" preserveAspectRatio="none" data-sparkline="14"></svg><span class="v">12</span><small>tickets</small><span class="mi-bar"><i></i></span></div>
        <div class="mi-card" data-item="main" data-index="1" style="--item: var(--c2)"><span class="mi-label">02</span><b>CODE</b><svg class="sp" viewBox="0 0 120 50" preserveAspectRatio="none" data-sparkline="14"></svg><span class="v">38</span><small>PRs merged</small><span class="mi-bar"><i></i></span></div>
        <div class="mi-card" data-item="main" data-index="2" style="--item: var(--c3)"><span class="mi-label">03</span><b>BUILD</b><svg class="sp" viewBox="0 0 120 50" preserveAspectRatio="none" data-sparkline="14"></svg><span class="v">6.4m</span><small>median build</small><span class="mi-bar"><i></i></span></div>
        <div class="mi-card" data-item="main" data-index="3" style="--item: var(--c4)"><span class="mi-label">04</span><b>TEST</b><svg class="sp" viewBox="0 0 120 50" preserveAspectRatio="none" data-sparkline="14"></svg><span class="v">4.2K</span><small>tests run</small><span class="mi-bar"><i></i></span></div>
        <div class="mi-card" data-item="main" data-index="4" style="--item: var(--c5)"><span class="mi-label">05</span><b>RELEASE</b><svg class="sp" viewBox="0 0 120 50" preserveAspectRatio="none" data-sparkline="14"></svg><span class="v">4</span><small>rollout waves</small><span class="mi-bar"><i></i></span></div>
        <div class="mi-card" data-item="main" data-index="5" style="--item: var(--c6)"><span class="mi-label">06</span><b>MONITOR</b><svg class="sp" viewBox="0 0 120 50" preserveAspectRatio="none" data-sparkline="14"></svg><span class="v">2</span><small>alerts fired</small><span class="mi-bar"><i></i></span></div>
      </div>
    </div>
  </section>

  <section class="mi-band">
    <div class="mi-stat" style="--item: var(--c1)"><span class="mi-stat-v">14 d</span><span class="mi-stat-l">Loop cycle time</span></div>
    <div class="mi-stat" style="--item: var(--c3)"><span class="mi-stat-v" data-ticker="11" data-jitter="0.4">11</span><span class="mi-stat-l">Deploys per week</span></div>
    <div class="mi-stat" style="--item: var(--c2)"><span class="mi-stat-v" data-ticker="1.8" data-jitter="0.1" data-decimals="1" data-suffix="%">1.8%</span><span class="mi-stat-l">Change failure rate</span></div>
  </section>

  <footer class="mi-foot"><span>SOURCE / DORA METRICS 2026</span><span class="path">PLAN &gt; CODE &gt; BUILD &gt; TEST &gt; RELEASE &gt; MONITOR</span><span class="mark">studio</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Item count**: set each node's `--a` to `-90deg + k × 360/n`. Recompute the arc end points as `(300 + 215·cos a, 300 + 215·sin a)` and write one arc per gap; use large-arc flag `0` while the gap is under 180°. Change `repeat(6, 1fr)` in `.segs`.
- **Square 1080×1080**: drop the phase strip; keep ring + side column.
- **Story 1080×1920**: stack the ring (centred, 720×720 with `R = 260`) above the side column and strip.
- **Landscape**: ring left, side column and strip stacked on the right.
- **Data-spin variant**: to rotate the whole ring of nodes, wrap the nodes in a `data-spin` element and counter-rotate each card with the same period and `data-spin="-N"`; keep arcs static.
- **Pitfalls**: arcs are hand-drawn in the ring's `viewBox`, so change `R` or the ring size in both CSS and path data. Node cards over 160 px wide collide at 6 phases.
