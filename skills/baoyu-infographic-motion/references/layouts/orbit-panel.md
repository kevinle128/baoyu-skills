# orbit-panel

A core node with orbit rings and 6-10 item nodes around it, plus a detail panel that swaps to the item in focus: a
catalog of peers that all plug into one centre, where each item needs 2-3 lines of detail.

## Use when / Avoid when

- **Use when**: "N projects / tools / skills for X", an ecosystem map, a starter stack, a curated list where each item
  has a one-line description and 2-3 metrics.
- **Avoid when**: items belong to clear groups (use `cluster-map`), there is a real sequence (use `card-pipeline` or
  `hub-pipeline`), or there are more than 10 items (use `tile-router`).

## Structure

- **Stage** (flex: 1, min 560 px): left graph card 600 px wide, right detail panel.
  - Graph: starfield, 3 static rings, 2 spinning orbit layers, `#hub` centre, 6-10 `.node` items placed with
    `--x` / `--y` (px inside a 600×560 box, centre 300,290), label under each node.
  - Panel: counter, `.mi-swap-host` with one `.mi-swap` per item (category, name, description, 3 metric bars),
    sine widget, ring gauge, status pill.
- **Workflow row**: 4-6 chips on their own nested cycle.
- **Index**: all items in a 4-column grid, lit with the item.
- **Band**: 4 stats. **Footer**.

## Motion recipe

- **Master cycle** `main`: 8 items × 1.5 s = 12 s, `data-cycles="2"` (24 s). Node, beam, swap panel, index entry and
  metric bars share `data-index`.
- **Beams**: straight `#nX@center #hub@center` beam per item. A dot runs from the node into the core. Under the beams,
  every node has a faint `mi-edge` with 1 packet (`data-period="3"`) so the whole graph keeps moving.
- **Hub**: `.mi-hub` with `data-pulse="2"`, colour follows `--accent` (`data-accent`), counter inside.
- **Nested clock**: workflow chips `flow`, 6 × 1 s = 6 s (divides 12 s).
- **Ambient**: `data-spin` on the orbit layers (12 s, -18 s) and on each node halo (8 s), `data-starfield="45"`,
  `data-sine` wave, ring gauge with `data-jitter`, tickers in the graph footer and band, pulsing status dot.
- **Sound**: `blip` per step, `packet` when a beam reaches the core. Works with `data-sfx="music"` too.

## Skeleton

Portrait 1080×1350.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Eight Projects For An Agent Stack</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-body { display: flex; flex-direction: column; gap: 18px; }
  .stage { flex: 1; min-height: 560px; display: grid; grid-template-columns: 600px 1fr; gap: 20px; }
  .graph { padding: 0; overflow: hidden; }
  .g-head { position: absolute; left: 20px; right: 20px; top: 16px; display: flex; justify-content: space-between; z-index: 2; }
  .g-foot { position: absolute; left: 20px; right: 20px; bottom: 14px; display: flex; justify-content: space-between; z-index: 2; }
  .orbit { position: absolute; left: 0; top: 50%; margin-top: -280px; width: 600px; height: 580px; }
  .ring { position: absolute; left: 300px; top: 290px; border-radius: 50%; translate: -50% -50%; border: 1px solid color-mix(in oklab, var(--accent) 30%, transparent); }
  .ring.dash { border-style: dashed; border-color: color-mix(in oklab, var(--muted) 45%, transparent); }
  .spin { position: absolute; left: 300px; top: 290px; width: 0; height: 0; }
  .spin > div { position: absolute; left: -130px; top: -130px; width: 260px; height: 260px; }
  .spin i { position: absolute; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 10px var(--accent); }
  #hub { position: absolute; left: 245px; top: 235px; width: 110px; height: 110px; font-family: var(--font-mono); z-index: 2; }
  #hub b { display: block; font-family: var(--font-display); font-size: 22px; color: var(--accent); letter-spacing: .04em; }
  #hub small { font-size: 12px; color: var(--muted); letter-spacing: .08em; }
  .node { position: absolute; left: calc(var(--x) * 1px - 23px); top: calc(var(--y) * 1px - 23px); width: 46px; height: 46px; z-index: 2; }
  .node .dot { position: absolute; inset: 0; border-radius: 50%; display: grid; place-items: center; font-family: var(--font-mono); font-size: 13px; font-weight: 600;
    background: color-mix(in oklab, var(--item) calc(8% + var(--on) * 30%), var(--panel)); border: 1.5px solid color-mix(in oklab, var(--item) calc(55% + var(--on) * 45%), transparent);
    color: color-mix(in oklab, var(--item) calc(60% + var(--on) * 40%), var(--ink)); scale: calc(1 + var(--on) * 0.22);
    box-shadow: 0 0 calc(var(--on) * 34px * var(--glow)) color-mix(in oklab, var(--item) 70%, transparent); }
  .node .halo { position: absolute; inset: -14px; border-radius: 50%; border: 1px dashed var(--item); opacity: calc(0.2 + var(--on) * 0.8); }
  .node span { position: absolute; top: 56px; left: 50%; translate: -50% 0; white-space: nowrap; font-family: var(--font-mono); font-size: 12px; letter-spacing: .06em; text-transform: var(--label-case); color: color-mix(in oklab, var(--ink) calc(45% + var(--on) * 55%), var(--muted)); }
  .panel { display: flex; flex-direction: column; gap: 12px; }
  .p-head { display: flex; justify-content: space-between; }
  .mi-swap-host { height: 236px; }
  .mi-swap h2 { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 44px; line-height: 1; text-transform: var(--title-case); color: var(--item); margin: 6px 0 4px; }
  .mi-swap p { font-size: 15px; line-height: 1.4; margin: 10px 0 14px; }
  .metric { display: grid; grid-template-columns: 70px 1fr 52px; gap: 10px; align-items: center; font-family: var(--font-mono); font-size: 12px; color: var(--muted); margin-top: 8px; }
  .metric .mi-bar { height: 6px; }
  .metric b { color: var(--ink); font-weight: 500; text-align: right; }
  .wave { border: 1px solid var(--line); border-radius: calc(var(--radius) * .6); padding: 8px 10px 4px; background: var(--panel2); }
  .wave svg { width: 100%; height: 64px; display: block; }
  .gauge { display: flex; align-items: center; gap: 14px; }
  .gauge .mi-ring { --size: 64px; }
  .status { display: flex; gap: 10px; align-items: center; margin-top: auto; padding: 10px 12px; border: 1px solid var(--line); border-radius: calc(var(--radius) * .6); font-family: var(--font-mono); font-size: 13px; letter-spacing: .06em; }
  .status i { width: 10px; height: 10px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 calc(4px + var(--pulse) * 12px) var(--accent); }
  .flow { display: flex; align-items: center; gap: 8px; }
  .flow .step { flex: 1; display: flex; gap: 8px; align-items: center; padding: 10px 12px; border-radius: 999px; border: 1px solid color-mix(in oklab, var(--item) calc(30% + var(--on) * 70%), var(--line));
    background: color-mix(in oklab, var(--item) calc(var(--on) * 16%), var(--panel)); font-family: var(--font-mono); font-size: 13px; letter-spacing: .05em; }
  .flow .step i { width: 10px; height: 10px; border-radius: 50%; background: var(--item); }
  .flow .arr { color: var(--muted); font-family: var(--font-mono); }
  .index { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px 18px; }
  .index div { display: flex; gap: 10px; align-items: center; font-family: var(--font-mono); font-size: 13px; padding: 6px 8px; border-radius: 6px; background: color-mix(in oklab, var(--item) calc(var(--on) * 14%), transparent); }
  .index div::before { content: ""; width: 10px; height: 10px; border-radius: 2px; background: var(--item); }
  .index em { font-style: normal; color: var(--muted); }
</style>
</head>
<body data-canvas="portrait" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="0.9">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">FIELD MAP / AGENT STACK / 08 OPEN REPOSITORIES</span><span class="mi-meta">FOCUS <span data-counter="main">01</span> / 08 &middot; T <span data-clock></span></span></div>
    <h1 class="mi-title">Eight projects for a <em>real agent</em></h1>
    <div class="mi-sub"><span>CRAWL</span><span class="sep">&gt;</span><span>REMEMBER</span><span class="sep">&gt;</span><span>ROUTE</span><span class="sep">&gt;</span><span>EVALUATE</span><span class="sep">&gt;</span><span>SHIP</span></div>
    <div class="mi-rule" data-progress="main"></div>
  </header>

  <section class="mi-body" data-cycle="main" data-step="1.5" data-sfx="blip" data-accent data-master>
    <div class="stage">
      <div class="mi-card graph">
        <div class="mi-starfield" data-starfield="45" data-size="2"></div>
        <div class="g-head mi-label"><span class="acc">LIVE PROJECT GRAPH</span><span>08 NODES / 1 CORE</span></div>
        <div class="orbit">
          <svg class="mi-svg">
            <path class="mi-edge" data-link="#n1@center #hub@center" data-shape="straight" data-packets="1" data-period="3" data-r="2.5"></path>
            <path class="mi-edge" data-link="#n2@center #hub@center" data-shape="straight" data-packets="1" data-period="3" data-r="2.5"></path>
            <path class="mi-edge" data-link="#n3@center #hub@center" data-shape="straight" data-packets="1" data-period="3" data-r="2.5"></path>
            <path class="mi-edge" data-link="#n4@center #hub@center" data-shape="straight" data-packets="1" data-period="3" data-r="2.5"></path>
            <path class="mi-edge" data-link="#n5@center #hub@center" data-shape="straight" data-packets="1" data-period="3" data-r="2.5"></path>
            <path class="mi-edge" data-link="#n6@center #hub@center" data-shape="straight" data-packets="1" data-period="3" data-r="2.5"></path>
            <path class="mi-edge" data-link="#n7@center #hub@center" data-shape="straight" data-packets="1" data-period="3" data-r="2.5"></path>
            <path class="mi-edge" data-link="#n8@center #hub@center" data-shape="straight" data-packets="1" data-period="3" data-r="2.5"></path>
            <path class="mi-beam" data-link="#n1@center #hub@center" data-shape="straight" data-beam data-item="main" data-index="0" data-sfx-end="packet" style="--item: var(--c1)"></path>
            <path class="mi-beam" data-link="#n2@center #hub@center" data-shape="straight" data-beam data-item="main" data-index="1" data-sfx-end="packet" style="--item: var(--c2)"></path>
            <path class="mi-beam" data-link="#n3@center #hub@center" data-shape="straight" data-beam data-item="main" data-index="2" data-sfx-end="packet" style="--item: var(--c3)"></path>
            <path class="mi-beam" data-link="#n4@center #hub@center" data-shape="straight" data-beam data-item="main" data-index="3" data-sfx-end="packet" style="--item: var(--c4)"></path>
            <path class="mi-beam" data-link="#n5@center #hub@center" data-shape="straight" data-beam data-item="main" data-index="4" data-sfx-end="packet" style="--item: var(--c5)"></path>
            <path class="mi-beam" data-link="#n6@center #hub@center" data-shape="straight" data-beam data-item="main" data-index="5" data-sfx-end="packet" style="--item: var(--c6)"></path>
            <path class="mi-beam" data-link="#n7@center #hub@center" data-shape="straight" data-beam data-item="main" data-index="6" data-sfx-end="packet" style="--item: var(--c1)"></path>
            <path class="mi-beam" data-link="#n8@center #hub@center" data-shape="straight" data-beam data-item="main" data-index="7" data-sfx-end="packet" style="--item: var(--c2)"></path>
          </svg>
          <div class="ring" style="width:190px;height:190px"></div>
          <div class="ring dash" style="width:300px;height:300px"></div>
          <div class="ring" style="width:470px;height:420px;opacity:.6"></div>
          <div class="spin"><div data-spin="12"><i style="left:126px;top:-4px"></i><i style="left:-4px;top:126px"></i><i style="right:-4px;top:126px;opacity:.5"></i></div></div>
          <div class="spin"><div data-spin="-18" style="left:-95px;top:-95px;width:190px;height:190px"><i style="left:91px;bottom:-4px;width:6px;height:6px"></i><i style="left:10px;top:30px;width:5px;height:5px;opacity:.6"></i></div></div>
          <div id="hub" class="mi-hub" data-pulse="2"><div><b>STACK</b><small>CORE / <span data-counter="main">01</span></small></div></div>

          <div id="n1" class="node" data-item="main" data-index="0" data-color="var(--c1)" style="--x:292;--y:78;--item:var(--c1)"><div class="halo" data-spin="8"></div><div class="dot">01</div><span>crawl-kit</span></div>
          <div id="n2" class="node" data-item="main" data-index="1" data-color="var(--c2)" style="--x:468;--y:132;--item:var(--c2)"><div class="halo" data-spin="8"></div><div class="dot">02</div><span>vector-db</span></div>
          <div id="n3" class="node" data-item="main" data-index="2" data-color="var(--c3)" style="--x:530;--y:290;--item:var(--c3)"><div class="halo" data-spin="8"></div><div class="dot">03</div><span>memory-bank</span></div>
          <div id="n4" class="node" data-item="main" data-index="3" data-color="var(--c4)" style="--x:454;--y:440;--item:var(--c4)"><div class="halo" data-spin="8"></div><div class="dot">04</div><span>tool-router</span></div>
          <div id="n5" class="node" data-item="main" data-index="4" data-color="var(--c5)" style="--x:296;--y:486;--item:var(--c5)"><div class="halo" data-spin="8"></div><div class="dot">05</div><span>eval-harness</span></div>
          <div id="n6" class="node" data-item="main" data-index="5" data-color="var(--c6)" style="--x:130;--y:428;--item:var(--c6)"><div class="halo" data-spin="8"></div><div class="dot">06</div><span>trace-view</span></div>
          <div id="n7" class="node" data-item="main" data-index="6" data-color="var(--c1)" style="--x:72;--y:272;--item:var(--c1)"><div class="halo" data-spin="8"></div><div class="dot">07</div><span>sandbox-run</span></div>
          <div id="n8" class="node" data-item="main" data-index="7" data-color="var(--c2)" style="--x:136;--y:124;--item:var(--c2)"><div class="halo" data-spin="8"></div><div class="dot">08</div><span>prompt-cache</span></div>
        </div>
        <div class="g-foot mi-label"><span>EACH PULSE = 1 REUSABLE CAPABILITY</span><span><span data-ticker="94.1" data-jitter="0.4" data-decimals="1">94.1</span>K STARS</span></div>
      </div>

      <div class="mi-card panel">
        <div class="p-head mi-label"><span class="acc">ACTIVE PROJECT</span><span><span data-counter="main">01</span> / 08</span></div>
        <div class="mi-swap-host">
          <div class="mi-swap" data-item="main" data-index="0" style="--item:var(--c1)"><span class="mi-label">WEB DATA</span><h2>crawl-kit</h2><p>Turns messy pages into clean markdown for models.</p><div class="metric">RECALL<div class="mi-bar" data-bar=".82" data-item="main" data-index="0"><i></i></div><b>82%</b></div><div class="metric">SPEED<div class="mi-bar" data-bar=".64" data-item="main" data-index="0"><i></i></div><b>64%</b></div><div class="metric">ADOPTION<div class="mi-bar" data-bar=".91" data-item="main" data-index="0"><i></i></div><b>91%</b></div></div>
          <div class="mi-swap" data-item="main" data-index="1" style="--item:var(--c2)"><span class="mi-label">STORAGE</span><h2>vector-db</h2><p>Stores embeddings and returns the nearest facts.</p><div class="metric">RECALL<div class="mi-bar" data-bar=".88" data-item="main" data-index="1"><i></i></div><b>88%</b></div><div class="metric">SPEED<div class="mi-bar" data-bar=".93" data-item="main" data-index="1"><i></i></div><b>93%</b></div><div class="metric">ADOPTION<div class="mi-bar" data-bar=".70" data-item="main" data-index="1"><i></i></div><b>70%</b></div></div>
          <div class="mi-swap" data-item="main" data-index="2" style="--item:var(--c3)"><span class="mi-label">MEMORY</span><h2>memory-bank</h2><p>Keeps long-term user facts across sessions.</p><div class="metric">RECALL<div class="mi-bar" data-bar=".76" data-item="main" data-index="2"><i></i></div><b>76%</b></div><div class="metric">SPEED<div class="mi-bar" data-bar=".58" data-item="main" data-index="2"><i></i></div><b>58%</b></div><div class="metric">ADOPTION<div class="mi-bar" data-bar=".66" data-item="main" data-index="2"><i></i></div><b>66%</b></div></div>
          <div class="mi-swap" data-item="main" data-index="3" style="--item:var(--c4)"><span class="mi-label">ROUTING</span><h2>tool-router</h2><p>Picks the right tool for each step of a plan.</p><div class="metric">RECALL<div class="mi-bar" data-bar=".69" data-item="main" data-index="3"><i></i></div><b>69%</b></div><div class="metric">SPEED<div class="mi-bar" data-bar=".86" data-item="main" data-index="3"><i></i></div><b>86%</b></div><div class="metric">ADOPTION<div class="mi-bar" data-bar=".54" data-item="main" data-index="3"><i></i></div><b>54%</b></div></div>
          <div class="mi-swap" data-item="main" data-index="4" style="--item:var(--c5)"><span class="mi-label">QUALITY</span><h2>eval-harness</h2><p>Scores every run against a fixed test set.</p><div class="metric">RECALL<div class="mi-bar" data-bar=".94" data-item="main" data-index="4"><i></i></div><b>94%</b></div><div class="metric">SPEED<div class="mi-bar" data-bar=".47" data-item="main" data-index="4"><i></i></div><b>47%</b></div><div class="metric">ADOPTION<div class="mi-bar" data-bar=".73" data-item="main" data-index="4"><i></i></div><b>73%</b></div></div>
          <div class="mi-swap" data-item="main" data-index="5" style="--item:var(--c6)"><span class="mi-label">OBSERVE</span><h2>trace-view</h2><p>Shows each tool call on one shared timeline.</p><div class="metric">RECALL<div class="mi-bar" data-bar=".61" data-item="main" data-index="5"><i></i></div><b>61%</b></div><div class="metric">SPEED<div class="mi-bar" data-bar=".79" data-item="main" data-index="5"><i></i></div><b>79%</b></div><div class="metric">ADOPTION<div class="mi-bar" data-bar=".83" data-item="main" data-index="5"><i></i></div><b>83%</b></div></div>
          <div class="mi-swap" data-item="main" data-index="6" style="--item:var(--c1)"><span class="mi-label">RUNTIME</span><h2>sandbox-run</h2><p>Runs untrusted code in a disposable container.</p><div class="metric">RECALL<div class="mi-bar" data-bar=".72" data-item="main" data-index="6"><i></i></div><b>72%</b></div><div class="metric">SPEED<div class="mi-bar" data-bar=".68" data-item="main" data-index="6"><i></i></div><b>68%</b></div><div class="metric">ADOPTION<div class="mi-bar" data-bar=".59" data-item="main" data-index="6"><i></i></div><b>59%</b></div></div>
          <div class="mi-swap" data-item="main" data-index="7" style="--item:var(--c2)"><span class="mi-label">COST</span><h2>prompt-cache</h2><p>Reuses long prompts so repeat calls cost less.</p><div class="metric">RECALL<div class="mi-bar" data-bar=".90" data-item="main" data-index="7"><i></i></div><b>90%</b></div><div class="metric">SPEED<div class="mi-bar" data-bar=".97" data-item="main" data-index="7"><i></i></div><b>97%</b></div><div class="metric">ADOPTION<div class="mi-bar" data-bar=".62" data-item="main" data-index="7"><i></i></div><b>62%</b></div></div>
        </div>
        <div class="mi-label">SIGNAL ACTIVITY</div>
        <div class="wave"><svg viewBox="0 0 300 64" preserveAspectRatio="none" data-sine data-waves="3" data-speed="4"></svg></div>
        <div class="gauge"><div class="mi-ring" data-bar=".72" data-jitter=".12"></div><div class="mi-label">CAPABILITY<br>LOAD <span data-ticker="72" data-jitter="6">72</span>%</div></div>
        <div class="status" data-pulse="1.5"><i></i>READY TO CONNECT</div>
      </div>
    </div>

    <div class="mi-top mi-label"><span class="acc">THE AGENT WORKFLOW</span><span>SELECT / CONNECT / REPEAT</span></div>
    <div class="flow" data-cycle="flow" data-step="1">
      <div class="step" data-item style="--item:var(--c1)"><i></i>DESIGN</div><span class="arr">&rarr;</span>
      <div class="step" data-item style="--item:var(--c2)"><i></i>CRAWL</div><span class="arr">&rarr;</span>
      <div class="step" data-item style="--item:var(--c3)"><i></i>REMEMBER</div><span class="arr">&rarr;</span>
      <div class="step" data-item style="--item:var(--c4)"><i></i>ROUTE</div><span class="arr">&rarr;</span>
      <div class="step" data-item style="--item:var(--c5)"><i></i>TEST</div><span class="arr">&rarr;</span>
      <div class="step" data-item style="--item:var(--c6)"><i></i>SHIP</div>
    </div>

    <div class="mi-top mi-label"><span class="acc">PROJECT INDEX</span><span>ALL 08 LINKED IN THE THREAD</span></div>
    <div class="index">
      <div data-item="main" data-index="0" style="--item:var(--c1)">01 crawl-kit <em>web</em></div>
      <div data-item="main" data-index="1" style="--item:var(--c2)">02 vector-db <em>store</em></div>
      <div data-item="main" data-index="2" style="--item:var(--c3)">03 memory-bank <em>mem</em></div>
      <div data-item="main" data-index="3" style="--item:var(--c4)">04 tool-router <em>route</em></div>
      <div data-item="main" data-index="4" style="--item:var(--c5)">05 eval-harness <em>eval</em></div>
      <div data-item="main" data-index="5" style="--item:var(--c6)">06 trace-view <em>obs</em></div>
      <div data-item="main" data-index="6" style="--item:var(--c1)">07 sandbox-run <em>exec</em></div>
      <div data-item="main" data-index="7" style="--item:var(--c2)">08 prompt-cache <em>cost</em></div>
    </div>
  </section>

  <section class="mi-band" style="--cols: 4">
    <div class="mi-stat" style="--item: var(--c1)"><span class="mi-stat-v" data-ticker="94.1" data-jitter="0.4" data-decimals="1" data-suffix="K">94.1K</span><span class="mi-stat-l">Combined stars</span></div>
    <div class="mi-stat" style="--item: var(--c2)"><span class="mi-stat-v" data-ticker="41" data-jitter="3" data-suffix="ms">41ms</span><span class="mi-stat-l">Median tool call</span></div>
    <div class="mi-stat" style="--item: var(--c3)"><span class="mi-stat-v" data-ticker="312" data-jitter="9" data-suffix="/d">312/d</span><span class="mi-stat-l">Commits per day</span></div>
    <div class="mi-stat"><span class="mi-stat-v"><span data-counter="main">01</span>/08</span><span class="mi-stat-l">Active focus</span></div>
  </section>

  <footer class="mi-foot"><span>SOURCE / GITHUB, STARS READ SEP 2026</span><span class="path">CRAWL &gt; REMEMBER &gt; ROUTE &gt; SHIP</span><span class="mark">fieldnotes</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Item count 6-10**: place nodes on an ellipse around (300, 290) with rx ≈ 230, ry ≈ 205 and some jitter. Add or
  remove a node, its edge + beam pair, its `.mi-swap` and its index entry. Step 1.2-1.6 s; keep 12-26 s total.
- **Colours**: cycle `--c1…--c6`; `data-color` on the node drives the accent.
- **Square canvas**: remove the band and the workflow row; set the stage `min-height: 520px`.
- **Landscape**: put the index as a third column right of the panel; the graph box stays 600×560.
- **Story**: stack graph above panel (`grid-template-columns: 1fr`), centre the 600 px orbit with `margin: auto`.
- **Pitfalls**: node labels are `nowrap`; keep them ≤ 14 characters or they touch neighbours. The orbit box is
  centred with `top: 50%` so the stage can shrink in styles with big headers; do not give `.stage` a fixed height.
  Swap text must fit 236 px of height: description ≤ 50 characters.
