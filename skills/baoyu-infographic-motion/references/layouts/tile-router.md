# tile-router

A 5×5 grid of tool tiles around a central router node; the active tile draws an orthogonal route to the router: a
large catalog behind one small interface.

## Use when / Avoid when

- **Use when**: "1,300 tools, 3 functions", an API or MCP catalog, a service map, integrations behind one gateway,
  any list of 16-24 short peer items with a category tag.
- **Avoid when**: items need descriptions or metrics (use `orbit-panel`), fewer than 12 items (use
  `columns-to-hub`), or there is no single router/centre idea.

## Structure

- **Section label** + **board**: 5-column grid, rows 116 px, 24 tiles + the router in the centre cell. Each tile:
  category label, title, mini equalizer, count. A coloured cap on top.
- **Playbook**: 4 step cards on their own nested cycle, and a row of 3 function chips with live latencies.
- **Band**: 3 stats. **Footer**.

## Motion recipe

- **Master cycle** `main`: 24 tiles × 0.75 s = 18 s, `data-cycles="1"` (18 s), `data-sfx="tick"`, `data-accent`.
  Tiles are coloured by row, so the accent changes every 5 tiles (not every step).
- **Beams**: `data-shape="elbow"` from each tile to `#router`, drawn above the tiles (`.board .mi-svg { z-index: 3 }`).
  Past routes stay as faint trails (12 % opacity) until the cycle restarts, so the grid slowly fills with routes.
- **Router**: `.mi-hub` with `data-pulse="1.5"`, two spinning dashed rings (6 s, -9 s), counter `NN/24`.
- **Nested clock**: playbook `play`, 4 × 1.5 s = 6 s (divides 18 s), `data-sfx="blip"`, bars fill with `--p`.
- **Ambient**: tile meters with `data-jitter`, latency tickers.
- **Sound**: `tick` per route (fast), `blip` per playbook step. The tick density suits `soft`; for `music`, use
  step 1.0 s and 16 tiles.

## Skeleton

Portrait 1080×1350. `data-poster="0.5"` shows the first route mid-draw.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>1300 Tools Three Functions</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-body { display: flex; flex-direction: column; gap: 16px; }
  .board { position: relative; display: grid; grid-template-columns: repeat(5, 1fr); grid-auto-rows: 116px; gap: 12px; }
  .board .mi-svg { z-index: 3; }
  .tile { position: relative; z-index: 2; padding: 14px 14px 12px; display: flex; flex-direction: column; gap: 6px; background: color-mix(in oklab, var(--item) calc(var(--on) * 14%), var(--panel)); }
  .tile::after { content: ""; position: absolute; left: 12px; right: 12px; top: 0; height: 3px; border-radius: 0 0 3px 3px; background: var(--item); opacity: calc(.25 + var(--on) * .75); }
  .tile .mi-label { font-size: 11px; color: color-mix(in oklab, var(--item) 70%, var(--muted)); }
  .tile b { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 19px; line-height: 1.05; text-transform: var(--title-case); }
  .tm { margin-top: auto; display: flex; justify-content: space-between; align-items: end; font-family: var(--font-mono); font-size: 11px; color: var(--muted); }
  .eq { display: flex; gap: 3px; align-items: end; height: 18px; }
  .eq i { width: 5px; height: calc(var(--value) * 100%); background: var(--item); opacity: calc(.35 + var(--on) * .65); }
  #router { position: relative; z-index: 4; width: 112px; height: 112px; justify-self: center; align-self: center; font-family: var(--font-mono); }
  #router b { display: block; font-family: var(--font-display); font-size: 20px; color: var(--accent); text-transform: var(--title-case); line-height: 1; }
  #router small { display: block; font-size: 11px; letter-spacing: .1em; color: var(--muted); }
  #router em { display: block; font-style: normal; font-size: 12px; margin-top: 3px; color: var(--accent); }
  .rings i { position: absolute; inset: -12px; border-radius: 50%; border: 1.5px dashed color-mix(in oklab, var(--accent) 60%, transparent); }
  .rings i + i { inset: -24px; border-style: dotted; border-color: color-mix(in oklab, var(--accent) 35%, transparent); }
  .sec { display: flex; justify-content: space-between; }
  .play { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .play .mi-card { padding: 12px 14px; background: color-mix(in oklab, var(--item) calc(var(--on) * 12%), var(--panel)); }
  .play b { display: flex; gap: 8px; align-items: center; font-family: var(--font-display); font-size: 20px; text-transform: var(--title-case); }
  .play b::before { content: ""; width: 10px; height: 10px; border-radius: 50%; background: var(--item); box-shadow: 0 0 calc(var(--on) * 12px) var(--item); }
  .play p { font-size: 13px; color: var(--muted); margin: 4px 0 8px; }
  .play .mi-bar { height: 4px; }
  .play .mi-bar > i { width: calc(max(var(--p), var(--done)) * 100%); }
  .surface { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-family: var(--font-mono); font-size: 13px; }
  .surface div { display: flex; justify-content: space-between; padding: 9px 12px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel2); }
  .surface b { color: var(--accent); font-weight: 600; }
</style>
</head>
<body data-canvas="portrait" data-cycles="1" data-sfx="soft" data-fps="30" data-poster="0.5">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">AGENT PLAYBOOK / TOOL CATALOG / SYSTEM MAP</span><span class="mi-meta">ROUTE <span data-counter="main">01</span> / 24 &middot; T <span data-clock></span></span></div>
    <h1 class="mi-title">1,300 tools. <em>Three functions.</em></h1>
    <div class="mi-sub"><span>SEARCH</span><span class="sep">&gt;</span><span>GET SCHEMA</span><span class="sep">&gt;</span><span>EXECUTE</span></div>
    <div class="mi-rule" data-progress="main"></div>
  </header>

  <section class="mi-body" data-cycle="main" data-step="0.75" data-sfx="tick" data-accent data-master>
    <div class="sec mi-label"><span class="acc">TOOL GRID</span><span>24 SHOWN OF 1,300 &middot; ONE ROUTE AT A TIME</span></div>
    <div class="board">
      <svg class="mi-svg">
        <path class="mi-beam" data-link="#t0 #router" data-shape="elbow" data-beam data-item="main" data-index="0" style="--item:var(--c1)"></path>
        <path class="mi-beam" data-link="#t1 #router" data-shape="elbow" data-beam data-item="main" data-index="1" style="--item:var(--c1)"></path>
        <path class="mi-beam" data-link="#t2 #router" data-shape="elbow" data-beam data-item="main" data-index="2" style="--item:var(--c1)"></path>
        <path class="mi-beam" data-link="#t3 #router" data-shape="elbow" data-beam data-item="main" data-index="3" style="--item:var(--c1)"></path>
        <path class="mi-beam" data-link="#t4 #router" data-shape="elbow" data-beam data-item="main" data-index="4" style="--item:var(--c1)"></path>
        <path class="mi-beam" data-link="#t5 #router" data-shape="elbow" data-beam data-item="main" data-index="5" style="--item:var(--c2)"></path>
        <path class="mi-beam" data-link="#t6 #router" data-shape="elbow" data-beam data-item="main" data-index="6" style="--item:var(--c2)"></path>
        <path class="mi-beam" data-link="#t7 #router" data-shape="elbow" data-beam data-item="main" data-index="7" style="--item:var(--c2)"></path>
        <path class="mi-beam" data-link="#t8 #router" data-shape="elbow" data-beam data-item="main" data-index="8" style="--item:var(--c2)"></path>
        <path class="mi-beam" data-link="#t9 #router" data-shape="elbow" data-beam data-item="main" data-index="9" style="--item:var(--c2)"></path>
        <path class="mi-beam" data-link="#t10 #router" data-shape="elbow" data-beam data-item="main" data-index="10" style="--item:var(--c3)"></path>
        <path class="mi-beam" data-link="#t11 #router" data-shape="elbow" data-beam data-item="main" data-index="11" style="--item:var(--c3)"></path>
        <path class="mi-beam" data-link="#t12 #router" data-shape="elbow" data-beam data-item="main" data-index="12" style="--item:var(--c3)"></path>
        <path class="mi-beam" data-link="#t13 #router" data-shape="elbow" data-beam data-item="main" data-index="13" style="--item:var(--c3)"></path>
        <path class="mi-beam" data-link="#t14 #router" data-shape="elbow" data-beam data-item="main" data-index="14" style="--item:var(--c4)"></path>
        <path class="mi-beam" data-link="#t15 #router" data-shape="elbow" data-beam data-item="main" data-index="15" style="--item:var(--c4)"></path>
        <path class="mi-beam" data-link="#t16 #router" data-shape="elbow" data-beam data-item="main" data-index="16" style="--item:var(--c4)"></path>
        <path class="mi-beam" data-link="#t17 #router" data-shape="elbow" data-beam data-item="main" data-index="17" style="--item:var(--c4)"></path>
        <path class="mi-beam" data-link="#t18 #router" data-shape="elbow" data-beam data-item="main" data-index="18" style="--item:var(--c4)"></path>
        <path class="mi-beam" data-link="#t19 #router" data-shape="elbow" data-beam data-item="main" data-index="19" style="--item:var(--c5)"></path>
        <path class="mi-beam" data-link="#t20 #router" data-shape="elbow" data-beam data-item="main" data-index="20" style="--item:var(--c5)"></path>
        <path class="mi-beam" data-link="#t21 #router" data-shape="elbow" data-beam data-item="main" data-index="21" style="--item:var(--c5)"></path>
        <path class="mi-beam" data-link="#t22 #router" data-shape="elbow" data-beam data-item="main" data-index="22" style="--item:var(--c5)"></path>
        <path class="mi-beam" data-link="#t23 #router" data-shape="elbow" data-beam data-item="main" data-index="23" style="--item:var(--c5)"></path>
      </svg>
        <div id="t0" class="mi-card tile" data-item="main" data-index="0" data-color="var(--c1)" style="--item:var(--c1)"><span class="mi-label">DEV / TICKET</span><b>GitHub Issue</b><div class="tm"><div class="eq"><i data-bar="0.30" data-jitter=".2"></i><i data-bar="0.59" data-jitter=".2"></i><i data-bar="0.88" data-jitter=".2"></i><i data-bar="0.57" data-jitter=".2"></i><i data-bar="0.86" data-jitter=".2"></i></div><span>6 TOOLS</span></div></div>
        <div id="t1" class="mi-card tile" data-item="main" data-index="1" data-color="var(--c1)" style="--item:var(--c1)"><span class="mi-label">OPS / WORKFLOW</span><b>Airflow DAG</b><div class="tm"><div class="eq"><i data-bar="0.43" data-jitter=".2"></i><i data-bar="0.72" data-jitter=".2"></i><i data-bar="0.41" data-jitter=".2"></i><i data-bar="0.70" data-jitter=".2"></i><i data-bar="0.39" data-jitter=".2"></i></div><span>13 TOOLS</span></div></div>
        <div id="t2" class="mi-card tile" data-item="main" data-index="2" data-color="var(--c1)" style="--item:var(--c1)"><span class="mi-label">OPS / INCIDENT</span><b>On Call</b><div class="tm"><div class="eq"><i data-bar="0.56" data-jitter=".2"></i><i data-bar="0.85" data-jitter=".2"></i><i data-bar="0.54" data-jitter=".2"></i><i data-bar="0.83" data-jitter=".2"></i><i data-bar="0.52" data-jitter=".2"></i></div><span>20 TOOLS</span></div></div>
        <div id="t3" class="mi-card tile" data-item="main" data-index="3" data-color="var(--c1)" style="--item:var(--c1)"><span class="mi-label">DEV / SEARCH</span><b>Code Search</b><div class="tm"><div class="eq"><i data-bar="0.69" data-jitter=".2"></i><i data-bar="0.38" data-jitter=".2"></i><i data-bar="0.67" data-jitter=".2"></i><i data-bar="0.36" data-jitter=".2"></i><i data-bar="0.65" data-jitter=".2"></i></div><span>27 TOOLS</span></div></div>
        <div id="t4" class="mi-card tile" data-item="main" data-index="4" data-color="var(--c1)" style="--item:var(--c1)"><span class="mi-label">OPS / RELEASE</span><b>Deploy</b><div class="tm"><div class="eq"><i data-bar="0.82" data-jitter=".2"></i><i data-bar="0.51" data-jitter=".2"></i><i data-bar="0.80" data-jitter=".2"></i><i data-bar="0.49" data-jitter=".2"></i><i data-bar="0.78" data-jitter=".2"></i></div><span>34 TOOLS</span></div></div>
        <div id="t5" class="mi-card tile" data-item="main" data-index="5" data-color="var(--c2)" style="--item:var(--c2)"><span class="mi-label">DATA / SQL</span><b>DB Query</b><div class="tm"><div class="eq"><i data-bar="0.35" data-jitter=".2"></i><i data-bar="0.64" data-jitter=".2"></i><i data-bar="0.33" data-jitter=".2"></i><i data-bar="0.62" data-jitter=".2"></i><i data-bar="0.31" data-jitter=".2"></i></div><span>10 TOOLS</span></div></div>
        <div id="t6" class="mi-card tile" data-item="main" data-index="6" data-color="var(--c2)" style="--item:var(--c2)"><span class="mi-label">OPS / LOGS</span><b>Log Reader</b><div class="tm"><div class="eq"><i data-bar="0.48" data-jitter=".2"></i><i data-bar="0.77" data-jitter=".2"></i><i data-bar="0.46" data-jitter=".2"></i><i data-bar="0.75" data-jitter=".2"></i><i data-bar="0.44" data-jitter=".2"></i></div><span>17 TOOLS</span></div></div>
        <div id="t7" class="mi-card tile" data-item="main" data-index="7" data-color="var(--c2)" style="--item:var(--c2)"><span class="mi-label">DEV / CONFIG</span><b>Feature Flag</b><div class="tm"><div class="eq"><i data-bar="0.61" data-jitter=".2"></i><i data-bar="0.30" data-jitter=".2"></i><i data-bar="0.59" data-jitter=".2"></i><i data-bar="0.88" data-jitter=".2"></i><i data-bar="0.57" data-jitter=".2"></i></div><span>24 TOOLS</span></div></div>
        <div id="t8" class="mi-card tile" data-item="main" data-index="8" data-color="var(--c2)" style="--item:var(--c2)"><span class="mi-label">DATA / OBSERVE</span><b>Metrics</b><div class="tm"><div class="eq"><i data-bar="0.74" data-jitter=".2"></i><i data-bar="0.43" data-jitter=".2"></i><i data-bar="0.72" data-jitter=".2"></i><i data-bar="0.41" data-jitter=".2"></i><i data-bar="0.70" data-jitter=".2"></i></div><span>31 TOOLS</span></div></div>
        <div id="t9" class="mi-card tile" data-item="main" data-index="9" data-color="var(--c2)" style="--item:var(--c2)"><span class="mi-label">DEV / QA</span><b>Test Runner</b><div class="tm"><div class="eq"><i data-bar="0.87" data-jitter=".2"></i><i data-bar="0.56" data-jitter=".2"></i><i data-bar="0.85" data-jitter=".2"></i><i data-bar="0.54" data-jitter=".2"></i><i data-bar="0.83" data-jitter=".2"></i></div><span>7 TOOLS</span></div></div>
        <div id="t10" class="mi-card tile" data-item="main" data-index="10" data-color="var(--c3)" style="--item:var(--c3)"><span class="mi-label">BIZ / SALES</span><b>CRM Update</b><div class="tm"><div class="eq"><i data-bar="0.40" data-jitter=".2"></i><i data-bar="0.69" data-jitter=".2"></i><i data-bar="0.38" data-jitter=".2"></i><i data-bar="0.67" data-jitter=".2"></i><i data-bar="0.36" data-jitter=".2"></i></div><span>14 TOOLS</span></div></div>
        <div id="t11" class="mi-card tile" data-item="main" data-index="11" data-color="var(--c3)" style="--item:var(--c3)"><span class="mi-label">OPS / ALERT</span><b>Pager Duty</b><div class="tm"><div class="eq"><i data-bar="0.53" data-jitter=".2"></i><i data-bar="0.82" data-jitter=".2"></i><i data-bar="0.51" data-jitter=".2"></i><i data-bar="0.80" data-jitter=".2"></i><i data-bar="0.49" data-jitter=".2"></i></div><span>21 TOOLS</span></div></div>
        <div id="router" class="mi-hub" data-pulse="1.5">
          <div class="rings"><i data-spin="6"></i><i data-spin="-9"></i></div>
          <div><b>Agent</b><small>ROUTER</small><em><span data-counter="main">01</span>/24</em></div>
        </div>
        <div id="t12" class="mi-card tile" data-item="main" data-index="12" data-color="var(--c3)" style="--item:var(--c3)"><span class="mi-label">OPS / TRIAGE</span><b>Incident</b><div class="tm"><div class="eq"><i data-bar="0.79" data-jitter=".2"></i><i data-bar="0.48" data-jitter=".2"></i><i data-bar="0.77" data-jitter=".2"></i><i data-bar="0.46" data-jitter=".2"></i><i data-bar="0.75" data-jitter=".2"></i></div><span>35 TOOLS</span></div></div>
        <div id="t13" class="mi-card tile" data-item="main" data-index="13" data-color="var(--c3)" style="--item:var(--c3)"><span class="mi-label">DEV / CI</span><b>Build Job</b><div class="tm"><div class="eq"><i data-bar="0.32" data-jitter=".2"></i><i data-bar="0.61" data-jitter=".2"></i><i data-bar="0.30" data-jitter=".2"></i><i data-bar="0.59" data-jitter=".2"></i><i data-bar="0.88" data-jitter=".2"></i></div><span>11 TOOLS</span></div></div>
        <div id="t14" class="mi-card tile" data-item="main" data-index="14" data-color="var(--c4)" style="--item:var(--c4)"><span class="mi-label">DEV / HTTP</span><b>API Client</b><div class="tm"><div class="eq"><i data-bar="0.45" data-jitter=".2"></i><i data-bar="0.74" data-jitter=".2"></i><i data-bar="0.43" data-jitter=".2"></i><i data-bar="0.72" data-jitter=".2"></i><i data-bar="0.41" data-jitter=".2"></i></div><span>18 TOOLS</span></div></div>
        <div id="t15" class="mi-card tile" data-item="main" data-index="15" data-color="var(--c4)" style="--item:var(--c4)"><span class="mi-label">DATA / ETL</span><b>Data Pipe</b><div class="tm"><div class="eq"><i data-bar="0.58" data-jitter=".2"></i><i data-bar="0.87" data-jitter=".2"></i><i data-bar="0.56" data-jitter=".2"></i><i data-bar="0.85" data-jitter=".2"></i><i data-bar="0.54" data-jitter=".2"></i></div><span>25 TOOLS</span></div></div>
        <div id="t16" class="mi-card tile" data-item="main" data-index="16" data-color="var(--c4)" style="--item:var(--c4)"><span class="mi-label">OPS / GUIDE</span><b>Runbook</b><div class="tm"><div class="eq"><i data-bar="0.71" data-jitter=".2"></i><i data-bar="0.40" data-jitter=".2"></i><i data-bar="0.69" data-jitter=".2"></i><i data-bar="0.38" data-jitter=".2"></i><i data-bar="0.67" data-jitter=".2"></i></div><span>32 TOOLS</span></div></div>
        <div id="t17" class="mi-card tile" data-item="main" data-index="17" data-color="var(--c4)" style="--item:var(--c4)"><span class="mi-label">OPS / QUEUE</span><b>Retry Queue</b><div class="tm"><div class="eq"><i data-bar="0.84" data-jitter=".2"></i><i data-bar="0.53" data-jitter=".2"></i><i data-bar="0.82" data-jitter=".2"></i><i data-bar="0.51" data-jitter=".2"></i><i data-bar="0.80" data-jitter=".2"></i></div><span>8 TOOLS</span></div></div>
        <div id="t18" class="mi-card tile" data-item="main" data-index="18" data-color="var(--c4)" style="--item:var(--c4)"><span class="mi-label">OPS / MONITOR</span><b>Alert Rule</b><div class="tm"><div class="eq"><i data-bar="0.37" data-jitter=".2"></i><i data-bar="0.66" data-jitter=".2"></i><i data-bar="0.35" data-jitter=".2"></i><i data-bar="0.64" data-jitter=".2"></i><i data-bar="0.33" data-jitter=".2"></i></div><span>15 TOOLS</span></div></div>
        <div id="t19" class="mi-card tile" data-item="main" data-index="19" data-color="var(--c5)" style="--item:var(--c5)"><span class="mi-label">DEV / POLICY</span><b>Release Gate</b><div class="tm"><div class="eq"><i data-bar="0.50" data-jitter=".2"></i><i data-bar="0.79" data-jitter=".2"></i><i data-bar="0.48" data-jitter=".2"></i><i data-bar="0.77" data-jitter=".2"></i><i data-bar="0.46" data-jitter=".2"></i></div><span>22 TOOLS</span></div></div>
        <div id="t20" class="mi-card tile" data-item="main" data-index="20" data-color="var(--c5)" style="--item:var(--c5)"><span class="mi-label">BIZ / KNOWLEDGE</span><b>Doc Search</b><div class="tm"><div class="eq"><i data-bar="0.63" data-jitter=".2"></i><i data-bar="0.32" data-jitter=".2"></i><i data-bar="0.61" data-jitter=".2"></i><i data-bar="0.30" data-jitter=".2"></i><i data-bar="0.59" data-jitter=".2"></i></div><span>29 TOOLS</span></div></div>
        <div id="t21" class="mi-card tile" data-item="main" data-index="21" data-color="var(--c5)" style="--item:var(--c5)"><span class="mi-label">SEC / AUDIT</span><b>Security Scan</b><div class="tm"><div class="eq"><i data-bar="0.76" data-jitter=".2"></i><i data-bar="0.45" data-jitter=".2"></i><i data-bar="0.74" data-jitter=".2"></i><i data-bar="0.43" data-jitter=".2"></i><i data-bar="0.72" data-jitter=".2"></i></div><span>36 TOOLS</span></div></div>
        <div id="t22" class="mi-card tile" data-item="main" data-index="22" data-color="var(--c5)" style="--item:var(--c5)"><span class="mi-label">OPS / EDGE</span><b>Cache Purge</b><div class="tm"><div class="eq"><i data-bar="0.89" data-jitter=".2"></i><i data-bar="0.58" data-jitter=".2"></i><i data-bar="0.87" data-jitter=".2"></i><i data-bar="0.56" data-jitter=".2"></i><i data-bar="0.85" data-jitter=".2"></i></div><span>12 TOOLS</span></div></div>
        <div id="t23" class="mi-card tile" data-item="main" data-index="23" data-color="var(--c5)" style="--item:var(--c5)"><span class="mi-label">DATA / STREAM</span><b>Kafka Topic</b><div class="tm"><div class="eq"><i data-bar="0.42" data-jitter=".2"></i><i data-bar="0.71" data-jitter=".2"></i><i data-bar="0.40" data-jitter=".2"></i><i data-bar="0.69" data-jitter=".2"></i><i data-bar="0.38" data-jitter=".2"></i></div><span>19 TOOLS</span></div></div>
    </div>

    <div class="sec mi-label"><span class="acc">THE PLAYBOOK</span><span>SEARCH &middot; SCHEMA &middot; EXECUTE</span></div>
    <div class="play" data-cycle="play" data-step="1.5" data-sfx="blip">
      <div class="mi-card" data-item style="--item:var(--c1)"><b>Intent</b><p>set up the task</p><div class="mi-bar"><i></i></div></div>
      <div class="mi-card" data-item style="--item:var(--c2)"><b>Discover</b><p>search the catalog</p><div class="mi-bar"><i></i></div></div>
      <div class="mi-card" data-item style="--item:var(--c3)"><b>Load</b><p>get the exact schema</p><div class="mi-bar"><i></i></div></div>
      <div class="mi-card" data-item style="--item:var(--c4)"><b>Act</b><p>execute one call</p><div class="mi-bar"><i></i></div></div>
    </div>
    <div class="surface">
      <div><span>search_catalog()</span><b><span data-ticker="38" data-jitter="4">38</span>ms</b></div>
      <div><span>get_schema()</span><b><span data-ticker="12" data-jitter="2">12</span>ms</b></div>
      <div><span>execute()</span><b><span data-ticker="210" data-jitter="18">210</span>ms</b></div>
    </div>
  </section>

  <section class="mi-band">
    <div class="mi-stat" style="--item: var(--c1)"><span class="mi-stat-v" data-ticker="1300" data-jitter="0" data-group>1,300</span><span class="mi-stat-l">Tools in the catalog</span></div>
    <div class="mi-stat" style="--item: var(--c2)"><span class="mi-stat-v">3</span><span class="mi-stat-l">Functions the agent sees</span></div>
    <div class="mi-stat" style="--item: var(--c3)"><span class="mi-stat-v" data-ticker="-94" data-jitter="1.5" data-suffix="%">-94%</span><span class="mi-stat-l">Context tokens</span></div>
  </section>

  <footer class="mi-foot"><span>SOURCE / ENGINEERING BLOG, SEP 2026</span><span class="path">SEARCH &gt; SCHEMA &gt; EXECUTE</span><span class="mark">fieldnotes</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Grid size**: 4×4 (15 tiles + router, step 1.0-1.2 s) or 5×6 (29 tiles, landscape). The router must sit in a real
  grid cell; with an even column count, let it span 2 columns (`grid-column: span 2`).
- **Colour by row or by category**, never by column (the accent would flicker every step).
- **Square**: 4×4 grid, remove the band.
- **Landscape**: 7 columns × 4 rows, playbook on the right.
- **Pitfalls**: tile titles ≤ 13 characters (wide display fonts wrap to 2 lines). Elbow routes cross other tiles by
  design; keep `stroke-width` at 3 so they read as routes, not borders.
