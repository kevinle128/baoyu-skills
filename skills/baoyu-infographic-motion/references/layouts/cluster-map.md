# cluster-map

Four clusters of drifting labelled nodes over node-link "hairballs", each tied to a centre core: a catalog where the
groups matter as much as the items.

## Use when / Avoid when

- **Use when**: a plugin or skill catalog in 3-4 families, a market map, "AI engineer = foundations + context + agents
  + ship", topic clusters in a knowledge base.
- **Avoid when**: the groups are a sequence (use `fan-in` or `hub-pipeline`), items need descriptions (use
  `orbit-panel`), or there is only one group.

## Structure

- **Field card** (flex: 1, min 600 px): starfield, scan sweep, head/foot labels, and a centred 972×640 canvas with:
  - 4 `.cluster` boxes (360×250) at the four quadrants: a radial glow, a `.ctag` label (name + meta) and 5 `.nd`
    node pills on an ellipse around the label.
  - An SVG with one `<g class="hair">` per cluster (18 dots + nearest-neighbour lines) and one edge + beam from each
    cluster label to `#core`.
  - `#core` hub in the centre with 2 dashed rings.
- **Lists**: 4 cards, one per cluster, with the 5 item names; the active cluster card and the active item light up.
- **Band**: 4 stats. **Footer**.

## Motion recipe

- **Master cycle** `grp`: 4 clusters × 1.5 s = 6 s, `data-cycles="3"` (18 s), `data-sfx="whoosh"`,
  `data-accent`. Cluster glow, label, hairball, beam to core and list card share the index.
- **Fast spotlight** `node`: 20 nodes × 0.3 s = 6 s, `data-sfx="tick"`: one pill at a time fills with its cluster
  colour and scales up, in step with its cluster.
- **Drift**: every pill has `data-drift="5" data-period="6"` and a unique `data-seed`; every hairball `g` has
  `data-drift="4"`. Pills use `transform: translate(-50%,-50%)` for centring because `data-drift` writes the
  `translate` property.
- **Ambient**: `.mi-scan` with `data-phase="3"`, `data-starfield`, core `data-pulse="1.5"`, 2 packets on each
  cluster edge, tickers.
- **Sound**: `whoosh` per cluster, `tick` per node, `packet` when the beam reaches the core.

## Skeleton

Portrait 1080×1350. The hairball coordinates are static; generate new ones with a seeded random loop if you move a
cluster.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Twenty Plugins Four Clusters</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-body { display: flex; flex-direction: column; gap: 16px; }
  .field { position: relative; flex: 1; min-height: 600px; padding: 0; overflow: hidden; }
  .canvas { position: absolute; left: 0; right: 0; top: 50%; height: 640px; margin-top: -320px; }
  .field .mi-scan { z-index: 1; }
  .hair line { stroke: var(--item); stroke-width: 1; stroke-opacity: calc(.18 + var(--on) * .5); }
  .hair circle { fill: var(--item); fill-opacity: calc(.35 + var(--on) * .65); }
  .cluster { position: absolute; width: 360px; height: 250px; }
  .blob { position: absolute; inset: -30px; border-radius: 50%; background: radial-gradient(closest-side, color-mix(in oklab, var(--item) calc(8% + var(--on) * 22%), transparent), transparent); }
  .ctag { position: absolute; left: 50%; top: 50%; translate: -50% -50%; z-index: 3; padding: 8px 14px; text-align: center; white-space: nowrap; border-radius: 8px;
    border: 1.5px solid color-mix(in oklab, var(--item) calc(40% + var(--on) * 60%), var(--line)); background: color-mix(in oklab, var(--item) calc(6% + var(--on) * 14%), var(--panel));
    box-shadow: 0 0 calc(var(--on) * 26px * var(--glow)) color-mix(in oklab, var(--item) 55%, transparent); }
  .ctag b { display: block; font-family: var(--font-display); font-weight: var(--title-weight); font-size: 22px; text-transform: var(--title-case); color: var(--item); line-height: 1.1; }
  .ctag span { font-family: var(--font-mono); font-size: 11px; letter-spacing: .08em; color: var(--muted); }
  .nd { position: absolute; transform: translate(-50%, -50%); z-index: 2; padding: 4px 9px; border-radius: 5px; font-family: var(--font-mono); font-size: 12px; white-space: nowrap;
    border: 1px solid color-mix(in oklab, var(--item) calc(35% + var(--on) * 65%), var(--line)); background: color-mix(in oklab, var(--item) calc(var(--on) * 85%), var(--panel));
    color: color-mix(in oklab, var(--bg) calc(var(--on) * 100%), var(--ink)); scale: calc(1 + var(--on) * .12); }
  .nd::before { content: ""; position: absolute; left: -5px; top: 50%; width: 6px; height: 6px; margin-top: -3px; border-radius: 50%; background: var(--item); }
  #core { position: absolute; left: 426px; top: 258px; width: 120px; height: 120px; z-index: 3; font-family: var(--font-mono); }
  #core b { display: block; font-family: var(--font-display); font-size: 20px; color: var(--accent); text-transform: var(--title-case); }
  #core small { font-size: 11px; color: var(--muted); letter-spacing: .08em; }
  .ring { position: absolute; left: 486px; top: 318px; border-radius: 50%; translate: -50% -50%; border: 1px dashed color-mix(in oklab, var(--accent) 50%, transparent); }
  .f-head { position: absolute; left: 18px; right: 18px; top: 14px; display: flex; justify-content: space-between; z-index: 4; }
  .f-foot { position: absolute; left: 18px; right: 18px; bottom: 12px; display: flex; justify-content: space-between; z-index: 4; }
  .lists { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .lst { padding: 14px 14px 12px; border-top: 3px solid color-mix(in oklab, var(--item) calc(40% + var(--on) * 60%), var(--line)); background: color-mix(in oklab, var(--item) calc(var(--on) * 8%), var(--panel)); }
  .mi-card.lst[data-item] { border-top-color: color-mix(in oklab, var(--item) calc(40% + var(--on) * 60%), var(--line)); }
  .lst .mi-label { display: flex; justify-content: space-between; margin-bottom: 8px; }
  .lst .mi-label b { color: var(--item); font-weight: 600; }
  .lst ul { list-style: none; display: flex; flex-direction: column; gap: 4px; font-family: var(--font-mono); font-size: 13px; }
  .lst li { display: flex; align-items: center; gap: 8px; padding: 2px 6px; border-radius: 4px; background: color-mix(in oklab, var(--item) calc(var(--on) * 22%), transparent); }
  .lst li::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--item); }
</style>
</head>
<body data-canvas="portrait" data-cycles="3" data-sfx="soft" data-fps="30" data-poster="0.9">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">PLUGIN CATALOG / LIVE CONSTELLATION / 20 NODES</span><span class="mi-meta">CLUSTER <span data-counter="grp">01</span> / 04 &middot; NODE <span data-counter="node">01</span></span></div>
    <h1 class="mi-title">Twenty plugins, <em>four clusters</em></h1>
    <div class="mi-sub"><span>BUILD</span><span class="sep">&gt;</span><span>MEMORY</span><span class="sep">&gt;</span><span>ORCHESTRATE</span><span class="sep">&gt;</span><span>CONTROL</span></div>
    <div class="mi-rule" data-progress="grp"></div>
  </header>

  <section class="mi-body" data-cycle="grp" data-step="1.5" data-sfx="whoosh" data-accent data-master>
    <div class="mi-card field" data-cycle="node" data-step="0.3" data-sfx="tick">
      <div class="mi-starfield" data-starfield="50" data-size="2"></div>
      <div class="mi-scan" data-phase="3"></div>
      <div class="f-head mi-label"><span class="acc">ACTIVE CLUSTER / <span data-counter="grp">01</span></span><span>SPOTLIGHT 0.3 S / NODE</span></div>
      <div class="canvas">
      <div class="ring" style="width:190px;height:190px"></div>
      <div class="ring" style="width:260px;height:150px"></div>
      <svg class="mi-svg">
        <g class="hair" data-item="grp" data-index="0" data-drift="4" data-period="6" data-seed="build" style="--item:var(--c1)"><line x1="200" y1="188" x2="188" y2="148"></line><line x1="200" y1="188" x2="203" y2="134"></line><line x1="203" y1="134" x2="188" y2="148"></line><line x1="203" y1="134" x2="161" y2="111"></line><line x1="127" y1="142" x2="132" y2="127"></line><line x1="127" y1="142" x2="161" y2="111"></line><line x1="346" y1="179" x2="342" y2="170"></line><line x1="346" y1="179" x2="304" y2="171"></line><line x1="342" y1="170" x2="346" y2="179"></line><line x1="342" y1="170" x2="304" y2="171"></line><line x1="278" y1="167" x2="267" y2="181"></line><line x1="278" y1="167" x2="267" y2="152"></line><line x1="88" y1="194" x2="127" y2="142"></line><line x1="88" y1="194" x2="132" y2="127"></line><line x1="289" y1="186" x2="304" y2="171"></line><line x1="289" y1="186" x2="278" y2="167"></line><line x1="111" y1="89" x2="132" y2="127"></line><line x1="111" y1="89" x2="161" y2="111"></line><line x1="132" y1="127" x2="127" y2="142"></line><line x1="132" y1="127" x2="161" y2="111"></line><line x1="267" y1="152" x2="278" y2="167"></line><line x1="267" y1="152" x2="267" y2="181"></line><line x1="289" y1="115" x2="267" y2="152"></line><line x1="289" y1="115" x2="278" y2="167"></line><line x1="267" y1="181" x2="278" y2="167"></line><line x1="267" y1="181" x2="289" y2="186"></line><line x1="173" y1="235" x2="200" y2="188"></line><line x1="173" y1="235" x2="188" y2="148"></line><line x1="286" y1="221" x2="289" y2="186"></line><line x1="286" y1="221" x2="267" y2="181"></line><line x1="161" y1="111" x2="132" y2="127"></line><line x1="161" y1="111" x2="188" y2="148"></line><line x1="188" y1="148" x2="203" y2="134"></line><line x1="188" y1="148" x2="200" y2="188"></line><line x1="304" y1="171" x2="289" y2="186"></line><line x1="304" y1="171" x2="278" y2="167"></line><circle cx="200" cy="188" r="2.8"></circle><circle cx="203" cy="134" r="2.4"></circle><circle cx="127" cy="142" r="2.2"></circle><circle cx="346" cy="179" r="2.7"></circle><circle cx="342" cy="170" r="2.4"></circle><circle cx="278" cy="167" r="2.1"></circle><circle cx="88" cy="194" r="3.0"></circle><circle cx="289" cy="186" r="2.9"></circle><circle cx="111" cy="89" r="2.0"></circle><circle cx="132" cy="127" r="2.6"></circle><circle cx="267" cy="152" r="2.5"></circle><circle cx="289" cy="115" r="3.2"></circle><circle cx="267" cy="181" r="2.9"></circle><circle cx="173" cy="235" r="2.1"></circle><circle cx="286" cy="221" r="3.4"></circle><circle cx="161" cy="111" r="1.8"></circle><circle cx="188" cy="148" r="2.4"></circle><circle cx="304" cy="171" r="3.0"></circle></g>
        <g class="hair" data-item="grp" data-index="1" data-drift="4" data-period="6" data-seed="memory" style="--item:var(--c2)"><line x1="813" y1="209" x2="802" y2="189"></line><line x1="813" y1="209" x2="845" y2="186"></line><line x1="881" y1="174" x2="878" y2="185"></line><line x1="881" y1="174" x2="885" y2="185"></line><line x1="754" y1="83" x2="783" y2="109"></line><line x1="754" y1="83" x2="697" y2="86"></line><line x1="812" y1="117" x2="783" y2="109"></line><line x1="812" y1="117" x2="833" y2="77"></line><line x1="697" y1="86" x2="754" y2="83"></line><line x1="697" y1="86" x2="637" y2="79"></line><line x1="638" y1="124" x2="637" y2="79"></line><line x1="638" y1="124" x2="601" y2="168"></line><line x1="833" y1="77" x2="812" y2="117"></line><line x1="833" y1="77" x2="783" y2="109"></line><line x1="601" y1="168" x2="616" y2="211"></line><line x1="601" y1="168" x2="634" y2="206"></line><line x1="878" y1="185" x2="885" y2="185"></line><line x1="878" y1="185" x2="881" y2="174"></line><line x1="637" y1="79" x2="638" y2="124"></line><line x1="637" y1="79" x2="697" y2="86"></line><line x1="783" y1="109" x2="812" y2="117"></line><line x1="783" y1="109" x2="754" y2="83"></line><line x1="634" y1="206" x2="616" y2="211"></line><line x1="634" y1="206" x2="601" y2="168"></line><line x1="860" y1="164" x2="881" y2="174"></line><line x1="860" y1="164" x2="845" y2="186"></line><line x1="771" y1="183" x2="802" y2="189"></line><line x1="771" y1="183" x2="813" y2="209"></line><line x1="885" y1="185" x2="878" y2="185"></line><line x1="885" y1="185" x2="881" y2="174"></line><line x1="802" y1="189" x2="813" y2="209"></line><line x1="802" y1="189" x2="771" y2="183"></line><line x1="616" y1="211" x2="634" y2="206"></line><line x1="616" y1="211" x2="601" y2="168"></line><line x1="845" y1="186" x2="860" y2="164"></line><line x1="845" y1="186" x2="878" y2="185"></line><circle cx="813" cy="209" r="2.6"></circle><circle cx="881" cy="174" r="3.2"></circle><circle cx="754" cy="83" r="3.1"></circle><circle cx="812" cy="117" r="3.2"></circle><circle cx="697" cy="86" r="2.1"></circle><circle cx="638" cy="124" r="2.3"></circle><circle cx="833" cy="77" r="2.2"></circle><circle cx="601" cy="168" r="3.2"></circle><circle cx="878" cy="185" r="3.3"></circle><circle cx="637" cy="79" r="1.9"></circle><circle cx="783" cy="109" r="1.9"></circle><circle cx="634" cy="206" r="2.0"></circle><circle cx="860" cy="164" r="2.0"></circle><circle cx="771" cy="183" r="2.5"></circle><circle cx="885" cy="185" r="2.7"></circle><circle cx="802" cy="189" r="2.1"></circle><circle cx="616" cy="211" r="1.6"></circle><circle cx="845" cy="186" r="2.4"></circle></g>
        <g class="hair" data-item="grp" data-index="2" data-drift="4" data-period="6" data-seed="orchestrate" style="--item:var(--c3)"><line x1="140" y1="532" x2="144" y2="518"></line><line x1="140" y1="532" x2="190" y2="505"></line><line x1="369" y1="457" x2="355" y2="430"></line><line x1="369" y1="457" x2="392" y2="494"></line><line x1="93" y1="473" x2="144" y2="518"></line><line x1="93" y1="473" x2="140" y2="532"></line><line x1="212" y1="460" x2="179" y2="456"></line><line x1="212" y1="460" x2="208" y2="498"></line><line x1="355" y1="430" x2="340" y2="420"></line><line x1="355" y1="430" x2="369" y2="457"></line><line x1="340" y1="420" x2="355" y2="430"></line><line x1="340" y1="420" x2="332" y2="403"></line><line x1="144" y1="518" x2="140" y2="532"></line><line x1="144" y1="518" x2="190" y2="505"></line><line x1="341" y1="526" x2="315" y2="514"></line><line x1="341" y1="526" x2="392" y2="494"></line><line x1="272" y1="489" x2="298" y2="480"></line><line x1="272" y1="489" x2="248" y2="517"></line><line x1="248" y1="517" x2="229" y2="536"></line><line x1="248" y1="517" x2="272" y2="489"></line><line x1="208" y1="498" x2="190" y2="505"></line><line x1="208" y1="498" x2="212" y2="460"></line><line x1="298" y1="480" x2="272" y2="489"></line><line x1="298" y1="480" x2="315" y2="514"></line><line x1="315" y1="514" x2="341" y2="526"></line><line x1="315" y1="514" x2="298" y2="480"></line><line x1="392" y1="494" x2="369" y2="457"></line><line x1="392" y1="494" x2="341" y2="526"></line><line x1="179" y1="456" x2="212" y2="460"></line><line x1="179" y1="456" x2="190" y2="505"></line><line x1="229" y1="536" x2="248" y2="517"></line><line x1="229" y1="536" x2="208" y2="498"></line><line x1="190" y1="505" x2="208" y2="498"></line><line x1="190" y1="505" x2="144" y2="518"></line><line x1="332" y1="403" x2="340" y2="420"></line><line x1="332" y1="403" x2="355" y2="430"></line><circle cx="140" cy="532" r="2.4"></circle><circle cx="369" cy="457" r="2.5"></circle><circle cx="93" cy="473" r="1.8"></circle><circle cx="212" cy="460" r="1.8"></circle><circle cx="355" cy="430" r="2.2"></circle><circle cx="340" cy="420" r="2.1"></circle><circle cx="144" cy="518" r="3.1"></circle><circle cx="341" cy="526" r="1.9"></circle><circle cx="272" cy="489" r="1.6"></circle><circle cx="248" cy="517" r="3.3"></circle><circle cx="208" cy="498" r="2.6"></circle><circle cx="298" cy="480" r="1.9"></circle><circle cx="315" cy="514" r="2.6"></circle><circle cx="392" cy="494" r="1.6"></circle><circle cx="179" cy="456" r="2.6"></circle><circle cx="229" cy="536" r="3.4"></circle><circle cx="190" cy="505" r="3.2"></circle><circle cx="332" cy="403" r="2.9"></circle></g>
        <g class="hair" data-item="grp" data-index="3" data-drift="4" data-period="6" data-seed="control" style="--item:var(--c4)"><line x1="735" y1="537" x2="734" y2="559"></line><line x1="735" y1="537" x2="757" y2="524"></line><line x1="819" y1="552" x2="760" y2="548"></line><line x1="819" y1="552" x2="768" y2="521"></line><line x1="591" y1="463" x2="624" y2="417"></line><line x1="591" y1="463" x2="702" y2="519"></line><line x1="702" y1="519" x2="724" y2="493"></line><line x1="702" y1="519" x2="735" y2="537"></line><line x1="807" y1="393" x2="805" y2="406"></line><line x1="807" y1="393" x2="807" y2="425"></line><line x1="836" y1="412" x2="807" y2="425"></line><line x1="836" y1="412" x2="805" y2="406"></line><line x1="805" y1="406" x2="807" y2="393"></line><line x1="805" y1="406" x2="807" y2="425"></line><line x1="760" y1="548" x2="757" y2="524"></line><line x1="760" y1="548" x2="735" y2="537"></line><line x1="724" y1="493" x2="702" y2="519"></line><line x1="724" y1="493" x2="735" y2="537"></line><line x1="833" y1="489" x2="843" y2="464"></line><line x1="833" y1="489" x2="855" y2="463"></line><line x1="734" y1="559" x2="735" y2="537"></line><line x1="734" y1="559" x2="760" y2="548"></line><line x1="855" y1="463" x2="843" y2="464"></line><line x1="855" y1="463" x2="833" y2="489"></line><line x1="903" y1="444" x2="855" y2="463"></line><line x1="903" y1="444" x2="843" y2="464"></line><line x1="843" y1="464" x2="855" y2="463"></line><line x1="843" y1="464" x2="833" y2="489"></line><line x1="757" y1="524" x2="768" y2="521"></line><line x1="757" y1="524" x2="760" y2="548"></line><line x1="768" y1="521" x2="757" y2="524"></line><line x1="768" y1="521" x2="760" y2="548"></line><line x1="624" y1="417" x2="591" y2="463"></line><line x1="624" y1="417" x2="724" y2="493"></line><line x1="807" y1="425" x2="805" y2="406"></line><line x1="807" y1="425" x2="836" y2="412"></line><circle cx="735" cy="537" r="2.8"></circle><circle cx="819" cy="552" r="3.0"></circle><circle cx="591" cy="463" r="1.8"></circle><circle cx="702" cy="519" r="2.8"></circle><circle cx="807" cy="393" r="3.2"></circle><circle cx="836" cy="412" r="3.0"></circle><circle cx="805" cy="406" r="3.0"></circle><circle cx="760" cy="548" r="2.5"></circle><circle cx="724" cy="493" r="1.9"></circle><circle cx="833" cy="489" r="3.0"></circle><circle cx="734" cy="559" r="2.2"></circle><circle cx="855" cy="463" r="3.0"></circle><circle cx="903" cy="444" r="3.3"></circle><circle cx="843" cy="464" r="2.3"></circle><circle cx="757" cy="524" r="2.3"></circle><circle cx="768" cy="521" r="3.3"></circle><circle cx="624" cy="417" r="2.9"></circle><circle cx="807" cy="425" r="1.9"></circle></g>
        <path class="mi-edge" data-link="#k-build #core" data-packets="2" data-period="3" data-r="2.5" style="--item:var(--c1)"></path>
        <path class="mi-beam" data-link="#k-build #core" data-beam data-item="grp" data-index="0" data-sfx-end="packet" style="--item:var(--c1)"></path>
        <path class="mi-edge" data-link="#k-memory #core" data-packets="2" data-period="3" data-r="2.5" style="--item:var(--c2)"></path>
        <path class="mi-beam" data-link="#k-memory #core" data-beam data-item="grp" data-index="1" data-sfx-end="packet" style="--item:var(--c2)"></path>
        <path class="mi-edge" data-link="#k-orchestrate #core" data-packets="2" data-period="3" data-r="2.5" style="--item:var(--c3)"></path>
        <path class="mi-beam" data-link="#k-orchestrate #core" data-beam data-item="grp" data-index="2" data-sfx-end="packet" style="--item:var(--c3)"></path>
        <path class="mi-edge" data-link="#k-control #core" data-packets="2" data-period="3" data-r="2.5" style="--item:var(--c4)"></path>
        <path class="mi-beam" data-link="#k-control #core" data-beam data-item="grp" data-index="3" data-sfx-end="packet" style="--item:var(--c4)"></path>
      </svg>
      <div class="cluster" style="--item:var(--c1);left:50px;top:30px" data-item="grp" data-index="0" data-color="var(--c1)">
          <div class="blob"></div>
          <div id="k-build" class="ctag"><b>BUILD</b><span>05 PLUGINS / SCAFFOLD</span></div>
          <div class="nd" data-item="node" data-index="0" data-drift="5" data-period="6" data-seed="design-pro" style="left:150px;top:39px">design-pro</div><div class="nd" data-item="node" data-index="1" data-drift="5" data-period="6" data-seed="sketch-kit" style="left:311px;top:82px">sketch-kit</div><div class="nd" data-item="node" data-index="2" data-drift="5" data-period="6" data-seed="shotgun" style="left:291px;top:184px">shotgun</div><div class="nd" data-item="node" data-index="3" data-drift="5" data-period="6" data-seed="archon" style="left:118px;top:205px">archon</div><div class="nd" data-item="node" data-index="4" data-drift="5" data-period="6" data-seed="fix-loop" style="left:31px;top:115px">fix-loop</div>
        </div><div class="cluster" style="--item:var(--c2);left:562px;top:30px" data-item="grp" data-index="1" data-color="var(--c2)">
          <div class="blob"></div>
          <div id="k-memory" class="ctag"><b>MEMORY</b><span>05 PLUGINS / RECALL</span></div>
          <div class="nd" data-item="node" data-index="5" data-drift="5" data-period="6" data-seed="deep-recall" style="left:231px;top:42px">deep-recall</div><div class="nd" data-item="node" data-index="6" data-drift="5" data-period="6" data-seed="note-sync" style="left:330px;top:128px">note-sync</div><div class="nd" data-item="node" data-index="7" data-drift="5" data-period="6" data-seed="md-kit" style="left:221px;top:210px">md-kit</div><div class="nd" data-item="node" data-index="8" data-drift="5" data-period="6" data-seed="origin" style="left:56px;top:174px">origin</div><div class="nd" data-item="node" data-index="9" data-drift="5" data-period="6" data-seed="wiki-ops" style="left:62px;top:71px">wiki-ops</div>
        </div><div class="cluster" style="--item:var(--c3);left:50px;top:355px" data-item="grp" data-index="2" data-color="var(--c3)">
          <div class="blob"></div>
          <div id="k-orchestrate" class="ctag"><b>ORCHESTRATE</b><span>05 PLUGINS / FLOW</span></div>
          <div class="nd" data-item="node" data-index="10" data-drift="5" data-period="6" data-seed="crew-talk" style="left:150px;top:39px">crew-talk</div><div class="nd" data-item="node" data-index="11" data-drift="5" data-period="6" data-seed="backlog" style="left:311px;top:82px">backlog</div><div class="nd" data-item="node" data-index="12" data-drift="5" data-period="6" data-seed="layer-map" style="left:291px;top:184px">layer-map</div><div class="nd" data-item="node" data-index="13" data-drift="5" data-period="6" data-seed="task-hub" style="left:118px;top:205px">task-hub</div><div class="nd" data-item="node" data-index="14" data-drift="5" data-period="6" data-seed="magic-cli" style="left:31px;top:115px">magic-cli</div>
        </div><div class="cluster" style="--item:var(--c4);left:562px;top:355px" data-item="grp" data-index="3" data-color="var(--c4)">
          <div class="blob"></div>
          <div id="k-control" class="ctag"><b>CONTROL</b><span>05 PLUGINS / GUARD</span></div>
          <div class="nd" data-item="node" data-index="15" data-drift="5" data-period="6" data-seed="boundary" style="left:231px;top:42px">boundary</div><div class="nd" data-item="node" data-index="16" data-drift="5" data-period="6" data-seed="hud" style="left:330px;top:128px">hud</div><div class="nd" data-item="node" data-index="17" data-drift="5" data-period="6" data-seed="pager" style="left:221px;top:210px">pager</div><div class="nd" data-item="node" data-index="18" data-drift="5" data-period="6" data-seed="tundra" style="left:56px;top:174px">tundra</div><div class="nd" data-item="node" data-index="19" data-drift="5" data-period="6" data-seed="prospector" style="left:62px;top:71px">prospector</div>
        </div>
      <div id="core" class="mi-hub" data-pulse="1.5"><div><b>Core</b><small>20 LINKED</small></div></div>
      </div>
      <div class="f-foot mi-label"><span>EACH CLUSTER = ONE JOB TO BE DONE</span><span><span data-ticker="1284" data-jitter="40" data-group>1,284</span> CALLS / MIN</span></div>
    </div>

    <div class="mi-top mi-label"><span class="acc">PLUGIN STACK / LIVE SYSTEM MAP</span><span>4 CLUSTERS &middot; 20 PLUGINS</span></div>
    <div class="lists">
      <div class="mi-card lst" data-item="grp" data-index="0" style="--item:var(--c1)"><div class="mi-label"><b>BUILD</b><span>05</span></div><ul><li data-item="node" data-index="0">design-pro</li><li data-item="node" data-index="1">sketch-kit</li><li data-item="node" data-index="2">shotgun</li><li data-item="node" data-index="3">archon</li><li data-item="node" data-index="4">fix-loop</li></ul></div>
      <div class="mi-card lst" data-item="grp" data-index="1" style="--item:var(--c2)"><div class="mi-label"><b>MEMORY</b><span>05</span></div><ul><li data-item="node" data-index="5">deep-recall</li><li data-item="node" data-index="6">note-sync</li><li data-item="node" data-index="7">md-kit</li><li data-item="node" data-index="8">origin</li><li data-item="node" data-index="9">wiki-ops</li></ul></div>
      <div class="mi-card lst" data-item="grp" data-index="2" style="--item:var(--c3)"><div class="mi-label"><b>ORCHESTRATE</b><span>05</span></div><ul><li data-item="node" data-index="10">crew-talk</li><li data-item="node" data-index="11">backlog</li><li data-item="node" data-index="12">layer-map</li><li data-item="node" data-index="13">task-hub</li><li data-item="node" data-index="14">magic-cli</li></ul></div>
      <div class="mi-card lst" data-item="grp" data-index="3" style="--item:var(--c4)"><div class="mi-label"><b>CONTROL</b><span>05</span></div><ul><li data-item="node" data-index="15">boundary</li><li data-item="node" data-index="16">hud</li><li data-item="node" data-index="17">pager</li><li data-item="node" data-index="18">tundra</li><li data-item="node" data-index="19">prospector</li></ul></div>
    </div>
  </section>

  <section class="mi-band" style="--cols: 4">
    <div class="mi-stat" style="--item: var(--c1)"><span class="mi-stat-v">20</span><span class="mi-stat-l">Plugins mapped</span></div>
    <div class="mi-stat" style="--item: var(--c2)"><span class="mi-stat-v" data-ticker="1284" data-jitter="40" data-group>1,284</span><span class="mi-stat-l">Calls per minute</span></div>
    <div class="mi-stat" style="--item: var(--c3)"><span class="mi-stat-v" data-ticker="96.2" data-jitter="0.5" data-decimals="1" data-suffix="%">96.2%</span><span class="mi-stat-l">Install success</span></div>
    <div class="mi-stat"><span class="mi-stat-v"><span data-counter="grp">01</span>/04</span><span class="mi-stat-l">Active cluster</span></div>
  </section>

  <footer class="mi-foot"><span>SOURCE / PLUGIN MARKETPLACE, SEP 2026</span><span class="path">BUILD &gt; MEMORY &gt; ORCHESTRATE &gt; CONTROL</span><span class="mark">fieldnotes</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Cluster count**: 3 clusters → put them at top-left, top-right, bottom-centre; 5-6 → shrink `.cluster` to
  300×200 and use a 3×2 grid. Keep the node period equal to the cluster period (nodes × node step = clusters ×
  cluster step).
- **Slower pace**: node step 0.6 s + cluster step 3 s (12 s master, `data-cycles="2"`).
- **Square**: remove the band; `.field { min-height: 560px }`.
- **Pitfalls**: `data-drift` moves nodes after connectors are measured, so do not link beams to drifting pills —
  link to the static `.ctag`. Keep pill names ≤ 12 characters so pills do not collide with the label.
