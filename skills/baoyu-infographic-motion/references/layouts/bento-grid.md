# bento-grid

A grid of mixed-size tiles, each a self-contained module with its own live widget. Also covers **dense-modules** (coordinate-labelled, high-density module pages).

## Use when / Avoid when

- **Use when**: dashboards and status overviews, feature highlights, "everything about X" summaries, product guides, dense-modules pages with 6–8 typed modules (selection array, spec scale, deep dive, pitfalls, quick reference).
- **Avoid when**: the content is one sequence (use `linear-progression`) or one comparison (use `comparison-matrix`).

## Structure

- **Grid**: `.mi-body` as a 4 × 4 grid (`repeat(4, 1fr)` both ways), 6–9 tiles. Sizes: one 2×2 hero, 2×1 wide tiles, 1×1 small tiles, 1×2 tall tiles.
- **Tile anatomy**: header row with a coordinate label (`A-01 / NAME`) and a meta tag, then one widget: big ticker number, sparkline, sine, ring gauge, bar list, log, status list, or histogram.
- **Tile widgets in the skeleton**: A hero (ticker + sparkline + 3 KPIs), B sine wave, C ring gauge, D cost ticker + sparkline, E bar list with jitter, F terminal log (code colours), G model list with pulsing status dots, H 30-day histogram + budget bar.
- Band with 4 stats.

## Motion recipe

- **Master cycle** `main`, `data-step="1.5"`, tiles in DOM order (auto index). The active tile gets the card glow and a light tint; its coordinate label takes the tile colour; `data-accent` recolours the header.
- **Live mini-widgets run all the time**, independent of the spotlight: `data-ticker`, `data-sparkline`, `data-sine`, `data-bar` + `data-jitter`, `data-log`, `data-pulse` with `data-phase-offset` on the status dots, `data-clock` in the header.
- **Sound**: `blip` per tile; add `data-sfx="type"` on the log for a terminal feel.
- **Length**: 8 × 1.5 s × 2 = 24 s.

## Skeleton

Portrait 1080×1350. Paste it over the `index.html` that `main.ts init` creates, then replace the content.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>LLM Gateway Live Ops</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-body { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(4, 1fr); gap: 16px; }
  .tile { padding: 16px 18px; display: flex; flex-direction: column; gap: 8px; min-height: 0; overflow: hidden; background: color-mix(in oklab, var(--item, var(--accent)) calc(var(--on) * 7%), var(--panel)); }
  .tile .hd { display: flex; justify-content: space-between; align-items: baseline; }
  .tile .hd .mi-label:first-child { color: color-mix(in oklab, var(--item) calc(var(--on) * 100%), var(--muted)); }
  .tile h3 { font-size: 22px; }
  .v { font-family: var(--font-display); font-weight: var(--title-weight); line-height: 1; color: var(--item); font-variant-numeric: tabular-nums; }
  .a { grid-column: 1 / 3; grid-row: 1 / 3; }
  .a .v { font-size: 92px; }
  .a svg { width: 100%; flex: 1; min-height: 0; }
  .a .kvs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; border-top: 1px dashed var(--line); padding-top: 10px; }
  .kvs div { display: flex; flex-direction: column; gap: 2px; font-family: var(--font-mono); font-size: 12px; color: var(--muted); text-transform: var(--label-case); letter-spacing: 0.06em; }
  .kvs b { font-family: var(--font-display); font-size: 24px; color: var(--ink); letter-spacing: 0; }
  .b { grid-column: 3 / 5; grid-row: 1; }
  .b svg { width: 100%; flex: 1; min-height: 0; }
  .b .v { font-size: 38px; }
  .c { grid-column: 3; grid-row: 2; align-items: center; }
  .c .mi-ring { --size: 104px; margin-top: 4px; }
  .c .ringv { position: relative; display: grid; place-items: center; }
  .c .ringv b { position: absolute; font-family: var(--font-display); font-size: 26px; }
  .d { grid-column: 4; grid-row: 2; }
  .d .v { font-size: 50px; }
  .d .mini { width: 100%; flex: 1; min-height: 0; }
  .e { grid-column: 1 / 3; grid-row: 3; }
  .bars { display: flex; flex-direction: column; gap: 9px; flex: 1; justify-content: center; }
  .bars div { display: grid; grid-template-columns: 70px 1fr 50px; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 13px; }
  .bars b { text-align: right; font-weight: 600; }
  .f { grid-column: 3; grid-row: 3 / 5; background: color-mix(in oklab, var(--code-accent) calc(var(--on) * 8%), var(--code-bg)); color: var(--code-ink); border-color: color-mix(in oklab, var(--code-accent) calc(var(--on) * 100%), var(--line)); }
  .f .hd .mi-label { color: var(--code-accent) !important; }
  .f .mi-log { --row-h: 34px; --rows: 10; font-size: 12px; }
  .f .ok { color: var(--code-accent); }
  .g { grid-column: 4; grid-row: 3 / 5; }
  .models { display: flex; flex-direction: column; gap: 10px; }
  .models div { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 8px; background: var(--panel2); font-family: var(--font-mono); font-size: 13px; }
  .models i { width: 9px; height: 9px; border-radius: 50%; background: var(--item); box-shadow: 0 0 calc(var(--pulse) * 10px) var(--item); }
  .models em { margin-left: auto; font-style: normal; color: var(--muted); font-size: 12px; }
  .h { grid-column: 1 / 3; grid-row: 4; }
  .hist { display: flex; align-items: flex-end; gap: 4px; flex: 1; min-height: 0; }
  .hist i { flex: 1; height: var(--hh); border-radius: 2px 2px 0 0; background: color-mix(in oklab, var(--item) 55%, var(--line)); }
  .hist i.bad { background: var(--c5); }
</style>
</head>
<body data-canvas="portrait" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="0.9">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">OPS / LLM GATEWAY / REGION ALL</span><span class="mi-meta">MODULE <span data-counter="main">01</span> / 08 &middot; LIVE <span data-clock></span></span></div>
    <h1 class="mi-title">The gateway, <em>at a glance</em></h1>
    <div class="mi-sub"><span>TRAFFIC</span><span class="sep">&gt;</span><span>LATENCY</span><span class="sep">&gt;</span><span>COST</span><span class="sep">&gt;</span><span>RELIABILITY</span></div>
    <div class="mi-rule" data-progress="main"></div>
  </header>

  <section class="mi-body" data-cycle="main" data-step="1.5" data-sfx="blip" data-accent data-master>
    <div class="mi-card tile a" data-item data-color="var(--c1)" style="--item: var(--c1)">
      <div class="hd"><span class="mi-label">A-01 / REQUESTS TODAY</span><span class="mi-chip">+12.4%</span></div>
      <span class="v" data-ticker="2.41" data-jitter="0.02" data-decimals="2" data-suffix="M">2.41M</span>
      <span class="mi-label">tokens served 9.8B &middot; peak 41K rpm</span>
      <svg viewBox="0 0 400 150" preserveAspectRatio="none" data-sparkline="48" data-waves="2"></svg>
      <div class="kvs"><div>success<b>99.2%</b></div><div>cache hit<b>31%</b></div><div>streams<b>68%</b></div></div>
    </div>
    <div class="mi-card tile b" data-item data-color="var(--c2)" style="--item: var(--c2)">
      <div class="hd"><span class="mi-label">B-02 / LATENCY P95</span><span class="v" data-ticker="182" data-jitter="9" data-suffix=" ms">182 ms</span></div>
      <svg viewBox="0 0 400 90" preserveAspectRatio="none" data-sine data-waves="3"></svg>
    </div>
    <div class="mi-card tile c" data-item data-color="var(--c3)" style="--item: var(--c3)">
      <div class="hd" style="align-self: stretch"><span class="mi-label">C-03 / GPU</span><span class="mi-label">H100</span></div>
      <div class="ringv"><div class="mi-ring" data-bar="0.78" data-jitter="0.06"></div><b data-ticker="78" data-jitter="5" data-suffix="%">78%</b></div>
    </div>
    <div class="mi-card tile d" data-item data-color="var(--c4)" style="--item: var(--c4)">
      <div class="hd"><span class="mi-label">D-04 / COST</span><span class="mi-label">/ 1K TOK</span></div>
      <span class="mi-chip" style="align-self: flex-start">-8% WoW</span>
      <svg class="mini" viewBox="0 0 200 60" preserveAspectRatio="none" data-sparkline="16" data-waves="1" data-seed="cost"></svg>
      <span class="v" data-ticker="0.42" data-jitter="0.01" data-decimals="3" data-prefix="$">$0.42</span>
    </div>
    <div class="mi-card tile e" data-item data-color="var(--c6)" style="--item: var(--c6)">
      <div class="hd"><span class="mi-label">E-05 / TRAFFIC BY REGION</span><span class="mi-label">RPM</span></div>
      <div class="bars">
        <div>us-east<span class="mi-bar" data-bar="0.86" data-jitter="0.05"><i></i></span><b>18.2K</b></div>
        <div>eu-west<span class="mi-bar" data-bar="0.62" data-jitter="0.06"><i></i></span><b>11.9K</b></div>
        <div>ap-south<span class="mi-bar" data-bar="0.41" data-jitter="0.07"><i></i></span><b>7.4K</b></div>
        <div>us-west<span class="mi-bar" data-bar="0.22" data-jitter="0.05"><i></i></span><b>3.1K</b></div>
      </div>
    </div>
    <div class="mi-card tile f" data-item data-color="var(--c2)">
      <div class="hd"><span class="mi-label">F-06 / LOG</span><span class="mi-label">TAIL</span></div>
      <div class="mi-log" data-log="0.5" data-rows="10">
        <div data-line><span class="ok">200</span> chat 812ms eu</div>
        <div data-line><span class="ok">200</span> embed 41ms us</div>
        <div data-line><span class="ok">200</span> chat 1.2s ap</div>
        <div data-line><span class="ok">200</span> tools 640ms us</div>
        <div data-line>429 retry 1/3 eu</div>
        <div data-line><span class="ok">200</span> chat 590ms us</div>
        <div data-line><span class="ok">200</span> rerank 88ms eu</div>
        <div data-line><span class="ok">200</span> vision 2.1s us</div>
        <div data-line><span class="ok">200</span> chat 730ms ap</div>
        <div data-line><span class="ok">200</span> embed 39ms eu</div>
        <div data-line>503 failover ok us</div>
        <div data-line><span class="ok">200</span> chat 910ms us</div>
      </div>
    </div>
    <div class="mi-card tile g" data-item data-color="var(--c5)" style="--item: var(--c5)">
      <div class="hd"><span class="mi-label">G-07 / MODELS</span><span class="mi-label">6 LIVE</span></div>
      <div class="models">
        <div style="--item: var(--c2)" data-pulse="2"><i></i>large-v4<em>52%</em></div>
        <div style="--item: var(--c2)" data-pulse="2" data-phase-offset="0.2"><i></i>small-v4<em>24%</em></div>
        <div style="--item: var(--c2)" data-pulse="2" data-phase-offset="0.4"><i></i>embed-3<em>11%</em></div>
        <div style="--item: var(--c6)" data-pulse="1" data-phase-offset="0.6"><i></i>vision-2<em>6%</em></div>
        <div style="--item: var(--c2)" data-pulse="2" data-phase-offset="0.8"><i></i>rerank-1<em>5%</em></div>
        <div style="--item: var(--c5)" data-pulse="1"><i></i>legacy-v2<em>2%</em></div>
      </div>
      <span class="mi-label" style="margin-top:auto">SUNSET: V2 / OCT 30</span>
    </div>
    <div class="mi-card tile h" data-item data-color="var(--c2)" style="--item: var(--c2)">
      <div class="hd"><span class="mi-label">H-08 / ERROR BUDGET / 30 D</span><span class="mi-label">71% LEFT</span></div>
      <div class="hist">
        <i style="--hh: 30%"></i><i style="--hh: 42%"></i><i style="--hh: 28%"></i><i style="--hh: 35%"></i><i style="--hh: 50%"></i><i style="--hh: 22%"></i><i style="--hh: 31%"></i><i style="--hh: 26%"></i><i class="bad" style="--hh: 92%"></i><i style="--hh: 40%"></i><i style="--hh: 33%"></i><i style="--hh: 29%"></i><i style="--hh: 38%"></i><i style="--hh: 24%"></i><i style="--hh: 30%"></i><i style="--hh: 45%"></i><i style="--hh: 27%"></i><i style="--hh: 36%"></i><i style="--hh: 21%"></i><i class="bad" style="--hh: 78%"></i><i style="--hh: 34%"></i><i style="--hh: 26%"></i><i style="--hh: 30%"></i><i style="--hh: 41%"></i><i style="--hh: 25%"></i><i style="--hh: 32%"></i><i style="--hh: 28%"></i><i style="--hh: 37%"></i><i style="--hh: 23%"></i><i style="--hh: 30%"></i>
      </div>
      <span class="mi-bar" data-bar="0.71"><i></i></span>
    </div>
  </section>

  <section class="mi-band" style="--cols: 4">
    <div class="mi-stat" style="--item: var(--c1)"><span class="mi-stat-v">41K</span><span class="mi-stat-l">Peak rpm</span></div>
    <div class="mi-stat" style="--item: var(--c2)"><span class="mi-stat-v">99.95%</span><span class="mi-stat-l">Uptime, 30 d</span></div>
    <div class="mi-stat" style="--item: var(--c4)"><span class="mi-stat-v">$4.1K</span><span class="mi-stat-l">Spend today</span></div>
    <div class="mi-stat" style="--item: var(--c5)"><span class="mi-stat-v">2</span><span class="mi-stat-l">Incidents, 30 d</span></div>
  </section>

  <footer class="mi-foot"><span>SOURCE / GATEWAY METRICS, LIVE</span><span class="path">A-01 &gt; H-08 / 8 MODULES</span><span class="mark">studio</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Item count**: the tile areas must cover the grid exactly. Change placement with `grid-column` / `grid-row` on each tile class. 6 tiles: drop F and G and make E and H `1 / 5`.
- **Dense-modules**: use a 6 × 6 grid, 7 modules, smaller type (13–14 px body), module headers as coordinate badges (`MOD-1`, `SEC-A`), and fill each module with concrete numbers. Keep the spotlight step at 1.2–1.5 s so each module gets read.
- **Square**: 3 × 3 grid with 5 tiles. **Story**: 4 × 6 grid, tall tiles for logs. **Landscape**: 6 × 3 grid, hero 2 × 3 on the left.
- **Pitfalls**: every tile has `min-height: 0; overflow: hidden` so a long log never pushes the grid; SVG widgets use `flex: 1; min-height: 0`. A tile with its own dark background (the log) must set `color` and the label colour itself, because style tokens assume `--panel`.
