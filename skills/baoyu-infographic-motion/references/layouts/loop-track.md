# loop-track

A stadium-shaped track of bundled wires carries a work loop: plain step nodes and diamond decision gates sit on the
track, a chip hub in the centre fires a beam at each station in turn, white particles run around the loop without
stopping, a side branch leaves the loop for a "halt: ask you" exit, and a 2×3 telemetry grid (decision log, tiers,
latency, cost, gate outcomes, throughput) keeps ticking underneath.

## Use when / Avoid when

- **Use when**: an agent or system runs the same loop again and again (read, write, run, check) and a controller makes
  small decisions around each step: coding agents, routers, retry loops, review gates, CI pipelines with guards.
- **Avoid when**: the process is a one-way pipeline (use `card-pipeline` or `hub-pipeline`), a plain cycle without
  decisions (use `circular-flow`), or there are more than 8 stations (the top and bottom straights get crowded).

## Structure

Canvas `portrait` (1080×1350). Own header; no `.mi-sub`.

- **Header** `.hd`: title with one `<em>` word + `.mi-label` tagline, then 4 `.kpi` counters (shipped, steps,
  decisions, sent to you).
- **Stage** `.stage` (690 px, master cycle) > `.ring` (992×620 coordinate box, 36 px from the top):
  - SVG: 4 `.strand` copies of the stadium path (offset by a few px for the bundled-wire look), one `.track` path
    that carries the packets, a dashed `.halt-edge` from the "safe to run?" gate to `#halt`, and 8 `.mi-beam` paths
    `#hub → #sK`.
  - 8 stations `.st` placed with `--x` / `--y` on the track: `.node` (step: name + small line) or `.dia` (decision
    diamond). Clockwise: task (left point), gate, read, gate (top straight), write (right point), gate, run, gate
    (bottom straight).
  - For each gate: a `.q` question label and a `.res` result chip that lights with the gate's step.
  - `#hub` chip (`.mi-hub`, pin rows via `::before` / `::after`), a shipped `.box` and a risk `.box` inside the
    track, `#halt` exit box outside the bottom-right curve.
- **Telemetry** `.tele`: 3 × 2 cards of 218 px.
- **Footer**: path + wordmark (the style stamps "SIMULATION · ILLUSTRATIVE VALUES" bottom-left).

Stadium geometry in the `.ring` box: `M 290 80 H 702 A 220 220 0 0 1 702 520 H 290 A 220 220 0 0 1 290 80 Z`
(left point x 70, right point x 922, top y 80, bottom y 520). Stations sit on these lines.

## Motion recipe

- **Master cycle** `loop` on `.stage`: 8 stations × `data-step="1.5"` = 12 s, `data-cycles="2"` (24 s),
  `data-sfx="blip"`, `data-accent`. Stations are the items in clockwise order; nodes light their border with the
  station colour, diamonds fill pink and glow.
- **Beams**: one `mi-beam` per station from the hub side that faces it (`data-shape="straight"`, `data-draw="0.5"`),
  same `data-index` as the station. The `.res` chip (`data-item="loop" data-index="k"`) brightens with its gate.
- **Particles**: `data-packets="8" data-period="6"` on the `.track` path (hand-drawn paths work), white via the
  style. The halt branch carries 1 slow packet.
- **Counters**: header and cost figures climb over the whole video with `data-count` + `data-from` +
  `data-at="0" data-dur="24"` (frame 0 shows the start values). Shipped is written in `MotionSetup`: +4 per master
  period, stepping up with `--cycle-p`.
- **Ambient**: `data-ticker` on risk and latency values, `data-bar` + `data-jitter` on tiers, gates and the
  throughput columns, `data-sine` on the latency card, `.mi-log` decision log every 1.5 s (divides 12 s),
  `data-pulse="3"` on the hub.
- **Sound**: `blip` per station (16 cues in 24 s).
- **Poster**: `data-poster="4.8"` (the "which model?" gate is lit, its beam drawn).

## Skeleton

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Router Around The Coding Loop</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-page { gap: 14px; }
  .hd { display: grid; grid-template-columns: 1fr auto; gap: 18px; align-items: end; }
  .hd .mi-title { font-size: 46px; white-space: nowrap; }
  .hd .mi-label { margin-top: 8px; display: block; }
  .kpis { display: flex; }
  .kpi { padding: 0 16px; border-left: 1px solid var(--line); min-width: 96px; }
  .kpi small { display: block; white-space: nowrap; font-family: var(--font-mono); font-size: 11px; letter-spacing: .12em; color: var(--muted); text-transform: uppercase; }
  .kpi b { display: block; font-family: var(--font-mono); font-size: 30px; font-weight: 700; margin-top: 4px; color: var(--item, var(--ink)); font-variant-numeric: tabular-nums; }
  .stage { position: relative; height: 690px; flex: none; }
  .ring { position: absolute; left: 0; right: 0; top: 36px; height: 620px; }
  .strand { fill: none; stroke: rgba(210, 216, 224, .13); stroke-width: 1; }
  .track { fill: none; stroke: rgba(210, 216, 224, .3); stroke-width: 1.4; }
  .stage .mi-packet { fill: #f4f6f8; }
  .stage .mi-beam { stroke-dasharray: 3 5; }
  .halt-edge { stroke: rgba(255, 45, 111, .45); stroke-dasharray: 4 5; }
  .st { position: absolute; left: var(--x); top: var(--y); transform: translate(-50%, -50%); }
  .node { min-width: 112px; padding: 7px 12px; text-align: center; border-radius: 5px; background: var(--panel);
    border: 1px solid color-mix(in oklab, var(--item) calc(max(var(--on), var(--done) * .5) * 100%), var(--line));
    box-shadow: 0 0 calc(var(--on) * 22px) color-mix(in oklab, var(--item) 55%, transparent); }
  .node b { display: block; font-family: var(--font-display); font-weight: 800; font-size: 17px; color: var(--ink); }
  .node small { display: block; white-space: nowrap; font-family: var(--font-mono); font-size: 11px; color: var(--muted); margin-top: 2px; }
  .dia { width: 40px; height: 40px; rotate: 45deg; background: var(--panel);
    border: 1.5px solid color-mix(in oklab, var(--c1) calc(55% + var(--on) * 45%), var(--line));
    background: color-mix(in oklab, var(--c1) calc(var(--on) * 55%), var(--panel));
    box-shadow: 0 0 calc(var(--on) * 26px) rgba(255, 45, 111, .6); }
  .dia::after { content: ""; position: absolute; inset: 13px; border-radius: 50%; border: 1.5px solid #f4f6f8; opacity: calc(.35 + var(--on) * .65); }
  .q { position: absolute; left: var(--x); top: var(--y); transform: translate(-50%, -50%); font-family: var(--font-display); font-weight: 600; font-size: 14px; color: var(--ink); white-space: nowrap; }
  .res { position: absolute; left: var(--x); top: var(--y); transform: translate(-50%, -50%); font-family: var(--font-mono); font-size: 12px; padding: 3px 9px; border-radius: 4px; white-space: nowrap;
    border: 1px solid color-mix(in oklab, #f4f6f8 calc(35% + var(--on) * 65%), transparent); color: #f4f6f8;
    background: color-mix(in oklab, var(--c1) calc(var(--on) * 35%), var(--bg)); opacity: calc(.4 + var(--on) * .6); }
  #hub { position: absolute; left: 496px; top: 300px; width: 104px; height: 104px; transform: translate(-50%, -50%); border-radius: 8px;
    display: grid; place-items: center; font-size: 30px; }
  #hub::before, #hub::after { content: ""; position: absolute; left: 14px; right: 14px; height: 8px;
    background: repeating-linear-gradient(90deg, rgba(255, 45, 111, .8) 0 2px, transparent 2px 12px); }
  #hub::before { top: -10px; }
  #hub::after { bottom: -10px; }
  .box { position: absolute; left: var(--x); top: var(--y); transform: translate(-50%, -50%); width: 118px; padding: 8px 10px; text-align: center; border: 1px solid var(--line); border-radius: 5px; background: var(--panel); }
  .box b { display: block; font-family: var(--font-mono); font-size: 26px; font-weight: 700; font-variant-numeric: tabular-nums; }
  .box small { display: block; font-family: var(--font-mono); font-size: 11px; color: var(--muted); letter-spacing: .1em; text-transform: uppercase; }
  #halt { border-color: rgba(255, 45, 111, .6); }
  #halt b { font-family: var(--font-display); font-size: 15px; font-weight: 800; }
  .tele { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 218px; gap: 12px; }
  .tele .mi-card { padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; overflow: hidden; }
  .tele .mi-log { font-size: 12px; --row-h: 25px; }
  .tele .mi-log .k { color: var(--c1); }
  .tele .mi-log .d { color: var(--muted); }
  .tier { display: grid; grid-template-columns: 70px 1fr 40px; gap: 10px; align-items: center; font-family: var(--font-mono); font-size: 12px; color: var(--muted); height: 26px; }
  .tier b { font-weight: 500; text-align: right; color: var(--ink); }
  .cap { font-family: var(--font-mono); font-size: 11px; color: var(--muted); margin-top: auto; }
  .wave { width: 100%; height: 84px; }
  .wave polyline { fill: none; stroke: var(--c1); stroke-width: 2; }
  .kv { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
  .kv b { font-weight: 500; }
  .cost { font-family: var(--font-mono); font-size: 40px; font-weight: 700; color: var(--c1); font-variant-numeric: tabular-nums; margin-top: auto; }
  .gate i.dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--item); margin-right: 8px; }
  .thr { flex: 1; display: flex; align-items: flex-end; gap: 4px; }
  .thr i { flex: 1; height: calc(18% + var(--value, 0) * 82%); background: #3a4350; border-radius: 1px; }
  .thr i:nth-child(n + 13) { background: var(--c1); }
</style>
<script>
window.MotionSetup = (M) => {
  const cyc = document.querySelector('[data-cycle="loop"]');
  const shipped = document.querySelector("#shipped"), inner = document.querySelector("#inner");
  M.on((t) => {
    const n = 3 + Math.floor(t / 12) * 4 + Math.floor((parseFloat(cyc.style.getPropertyValue("--cycle-p")) || 0) * 4);
    shipped.textContent = n;
    inner.textContent = n;
  });
};
</script>
</head>
<body data-canvas="portrait" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="4.8">
<main class="mi-page">
  <header class="hd">
    <div>
      <h1 class="mi-title"><em>Router</em> + coding agent</h1>
      <span class="mi-label">five decisions around every step &middot; one agent writes the code</span>
    </div>
    <div class="kpis">
      <div class="kpi"><small>Shipped</small><b id="shipped">3</b></div>
      <div class="kpi"><small>Steps</small><b data-count="58" data-from="10" data-at="0" data-dur="24">10</b></div>
      <div class="kpi"><small>Decisions</small><b data-count="226" data-from="49" data-at="0" data-dur="24">49</b></div>
      <div class="kpi" style="--item:var(--c1)"><small>Sent to you</small><b data-count="2" data-from="0" data-at="0" data-dur="24">0</b></div>
    </div>
  </header>

  <section class="stage" data-cycle="loop" data-step="1.5" data-sfx="blip" data-accent data-master>
    <div class="ring">
    <svg class="mi-svg">
      <path class="strand" transform="translate(0 -9)" d="M 290 80 H 702 A 220 220 0 0 1 702 520 H 290 A 220 220 0 0 1 290 80 Z"></path>
      <path class="strand" transform="translate(0 7)" d="M 290 80 H 702 A 220 220 0 0 1 702 520 H 290 A 220 220 0 0 1 290 80 Z"></path>
      <path class="strand" transform="translate(-6 3)" d="M 296 86 H 696 A 214 214 0 0 1 696 514 H 296 A 214 214 0 0 1 296 86 Z"></path>
      <path class="strand" transform="translate(6 -3)" d="M 284 74 H 708 A 226 226 0 0 1 708 526 H 284 A 226 226 0 0 1 284 74 Z"></path>
      <path class="track" d="M 290 80 H 702 A 220 220 0 0 1 702 520 H 290 A 220 220 0 0 1 290 80 Z" data-packets="8" data-period="6" data-r="3"></path>
      <path class="mi-edge halt-edge" data-link="#s5@right #halt@top" data-shape="elbow" data-packets="1" data-period="3" data-r="2.5"></path>
      <path class="mi-beam" data-link="#hub@left #s0@right" data-shape="straight" data-beam data-item="loop" data-index="0" data-draw="0.5" data-dot-r="3"></path>
      <path class="mi-beam" data-link="#hub@top #s1@bottom" data-shape="straight" data-beam data-item="loop" data-index="1" data-draw="0.5" data-dot-r="3"></path>
      <path class="mi-beam" data-link="#hub@top #s2@bottom" data-shape="straight" data-beam data-item="loop" data-index="2" data-draw="0.5" data-dot-r="3"></path>
      <path class="mi-beam" data-link="#hub@top #s3@bottom" data-shape="straight" data-beam data-item="loop" data-index="3" data-draw="0.5" data-dot-r="3"></path>
      <path class="mi-beam" data-link="#hub@right #s4@left" data-shape="straight" data-beam data-item="loop" data-index="4" data-draw="0.5" data-dot-r="3"></path>
      <path class="mi-beam" data-link="#hub@bottom #s5@top" data-shape="straight" data-beam data-item="loop" data-index="5" data-draw="0.5" data-dot-r="3"></path>
      <path class="mi-beam" data-link="#hub@bottom #s6@top" data-shape="straight" data-beam data-item="loop" data-index="6" data-draw="0.5" data-dot-r="3"></path>
      <path class="mi-beam" data-link="#hub@bottom #s7@top" data-shape="straight" data-beam data-item="loop" data-index="7" data-draw="0.5" data-dot-r="3"></path>
    </svg>

    <div class="st node" id="s0" style="--x:70px;--y:300px;--item:var(--c2)" data-item data-color="var(--c2)"><b>task</b><small>brief + repo</small></div>
    <div class="st dia" id="s1" style="--x:360px;--y:80px" data-item data-color="var(--c1)"></div>
    <div class="st node" id="s2" style="--x:496px;--y:80px;--item:var(--c2)" data-item data-color="var(--c2)"><b>read</b><small>top chunks</small></div>
    <div class="st dia" id="s3" style="--x:632px;--y:80px" data-item data-color="var(--c1)"></div>
    <div class="st node" id="s4" style="--x:922px;--y:300px;--item:var(--c5)" data-item data-color="var(--c5)"><b>write</b><small>cheap &middot; mid &middot; frontier</small></div>
    <div class="st dia" id="s5" style="--x:632px;--y:520px" data-item data-color="var(--c1)"></div>
    <div class="st node" id="s6" style="--x:496px;--y:520px;--item:var(--c3)" data-item data-color="var(--c3)"><b>run + tests</b><small>fresh output</small></div>
    <div class="st dia" id="s7" style="--x:360px;--y:520px" data-item data-color="var(--c1)"></div>

    <span class="q" style="--x:360px;--y:40px">which files?</span>
    <span class="q" style="--x:632px;--y:40px">which model?</span>
    <span class="q" style="--x:632px;--y:562px">safe to run?</span>
    <span class="q" style="--x:360px;--y:562px">done?</span>
    <span class="res" style="--x:360px;--y:12px" data-item="loop" data-index="1">top 3 of 17</span>
    <span class="res" style="--x:632px;--y:12px" data-item="loop" data-index="3">mid 0.82</span>
    <span class="res" style="--x:632px;--y:596px" data-item="loop" data-index="5">p 0.97 ok</span>
    <span class="res" style="--x:360px;--y:596px" data-item="loop" data-index="7">done 0.91 &gt; ship</span>

    <div id="hub" class="mi-hub" data-pulse="3">R</div>
    <div class="box" style="--x:290px;--y:222px"><b id="inner">3</b><small>shipped</small></div>
    <div class="box" style="--x:702px;--y:378px"><b data-ticker="0.44" data-jitter="0.05" data-decimals="2">0.44</b><small>p(risk)</small></div>
    <div class="box" id="halt" style="--x:842px;--y:584px"><b>halt: ask you</b><small>irreversible</small></div>
    </div>
  </section>

  <section class="tele">
    <div class="mi-card">
      <span class="mi-label">Decision log</span>
      <div class="mi-log" data-log="1.5" data-rows="5">
        <div data-line><span class="k">score</span> files kept 3/17</div>
        <div data-line><span class="k">choice</span> model mid 0.82</div>
        <div data-line><span class="k">gate</span> p 0.97 ok, run</div>
        <div data-line><span class="k">done</span> 0.91 tests pass</div>
        <div data-line><span class="k">score</span> files kept 2/9</div>
        <div data-line><span class="k">choice</span> model cheap 0.77</div>
        <div data-line><span class="k">gate</span> <span class="d">destructive, ask</span></div>
        <div data-line><span class="k">done</span> 0.42 loop again</div>
      </div>
    </div>
    <div class="mi-card">
      <span class="mi-label">Model tiers</span>
      <div class="tier" style="--item:var(--c3)">cheap<span class="mi-bar"><i data-bar="0.44" data-jitter="0.06"></i></span><b data-ticker="44" data-jitter="4" data-suffix="%">44%</b></div>
      <div class="tier" style="--item:var(--c2)">mid<span class="mi-bar"><i data-bar="0.36" data-jitter="0.05"></i></span><b data-ticker="36" data-jitter="3" data-suffix="%">36%</b></div>
      <div class="tier" style="--item:var(--c5)">frontier<span class="mi-bar"><i data-bar="0.2" data-jitter="0.04"></i></span><b data-ticker="20" data-jitter="2" data-suffix="%">20%</b></div>
      <span class="cap">the cheap lane takes most steps</span>
    </div>
    <div class="mi-card">
      <span class="mi-label">Latency</span>
      <svg class="wave" viewBox="0 0 200 60" preserveAspectRatio="none" data-sine data-waves="3"></svg>
      <div class="kv"><span>p50</span><b data-ticker="44" data-jitter="3" data-suffix=" ms">44 ms</b></div>
      <div class="kv"><span>p95</span><b data-ticker="61" data-jitter="4" data-suffix=" ms">61 ms</b></div>
    </div>
    <div class="mi-card">
      <span class="mi-label">Cost of asking</span>
      <div class="kv"><span>frontier every step</span><b data-count="20.78" data-from="6.37" data-at="0" data-dur="24" data-prefix="$" data-decimals="2">$6.37</b></div>
      <div class="kv"><span>router</span><b data-count="0.0160" data-from="0.0049" data-at="0" data-dur="24" data-prefix="$" data-decimals="4">$0.0049</b></div>
      <div class="cost" data-count="20.77" data-from="6.37" data-at="0" data-dur="24" data-prefix="$" data-decimals="2">$6.37</div>
    </div>
    <div class="mi-card gate">
      <span class="mi-label">Gate outcomes</span>
      <div class="tier" style="--item:var(--c3)"><span><i class="dot"></i>allowed</span><span class="mi-bar"><i data-bar="0.9" data-jitter="0.03"></i></span><b data-count="158" data-from="48" data-at="0" data-dur="24">48</b></div>
      <div class="tier" style="--item:var(--c1)"><span><i class="dot"></i>to you</span><span class="mi-bar"><i data-bar="0.04"></i></span><b data-count="2" data-from="0" data-at="0" data-dur="24">0</b></div>
      <div class="tier" style="--item:var(--c4)"><span><i class="dot"></i>halted</span><span class="mi-bar"><i data-bar="0.03"></i></span><b>1</b></div>
      <div class="tier" style="--item:var(--c6)"><span><i class="dot"></i>shipped</span><span class="mi-bar"><i data-bar="0.08" data-jitter="0.02"></i></span><b id="gship" data-count="11" data-from="3" data-at="0" data-dur="24">3</b></div>
    </div>
    <div class="mi-card">
      <span class="mi-label">Throughput</span>
      <div class="thr">
        <i data-bar="0.5" data-jitter="0.25"></i><i data-bar="0.6" data-jitter="0.25"></i><i data-bar="0.4" data-jitter="0.25"></i><i data-bar="0.7" data-jitter="0.25"></i>
        <i data-bar="0.5" data-jitter="0.25"></i><i data-bar="0.8" data-jitter="0.2"></i><i data-bar="0.6" data-jitter="0.25"></i><i data-bar="0.5" data-jitter="0.25"></i>
        <i data-bar="0.7" data-jitter="0.25"></i><i data-bar="0.4" data-jitter="0.25"></i><i data-bar="0.6" data-jitter="0.25"></i><i data-bar="0.5" data-jitter="0.25"></i>
        <i data-bar="0.7" data-jitter="0.25"></i><i data-bar="0.8" data-jitter="0.2"></i><i data-bar="0.6" data-jitter="0.25"></i><i data-bar="0.9" data-jitter="0.1"></i>
        <i data-bar="0.7" data-jitter="0.25"></i><i data-bar="0.8" data-jitter="0.2"></i>
      </div>
      <div class="kv"><span>steps per minute</span><b data-ticker="16" data-jitter="3">16</b></div>
    </div>
  </section>
  <footer class="mi-foot"><span>&nbsp;</span><span class="path">task &gt; decide &gt; act &gt; check &gt; loop</span><span class="mark">looptrack</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Stations**: 6-8. Keep the four corner-free spots (left point, right point, two or three on each straight). For 6
  stations drop one gate per straight and use `data-step="2"` (still 12 s).
- **Gates vs steps**: gates are the decisions a controller makes; write each `.q` as a short question and each
  `.res` as a terse answer with a number (`top 3 of 17`, `mid 0.82`).
- **Colours**: steps take their own colour (`--item`), gates stay pink; keep at most 3 step colours.
- **Telemetry**: any 6 small cards; keep one `.mi-log`, one bar card, one wave or sparkline and one big number.
- **Landscape**: put `.tele` in a 360 px right column (2 × 3 → 1 × 6) and keep the ring box 992×620.
- **Pitfalls**: position stations with `left` / `top` + `transform: translate(-50%, -50%)`, not `translate`
  (runtime reserves it for drift). Keep the `.ring` size fixed, because the track path is in pixels. Counters that
  climb over the video jump back at the loop point; that is expected for a simulation look.
