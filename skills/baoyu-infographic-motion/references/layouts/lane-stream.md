# lane-stream

A router picks one backend at a time: a top flow row (product → endpoint → backend pool) feeds a diamond router hub,
a beam drops from the hub into the chosen lane, and 5-7 horizontal lanes each carry a live stream of dots and dashes
running left to right, a jittering bar meter and a `x/s` rate. A telemetry card below repeats the pick on a route map,
a per-backend rate list and a scrolling event index.

## Use when / Avoid when

- **Use when**: one entry point dispatches work to several parallel backends (model routers, agent harness gateways,
  load balancers, queue workers, API gateways), and the story is "one integration, many runtimes, one pick at a time".
- **Avoid when**: the backends run in sequence (use `hub-pipeline` or `card-pipeline`), all lanes work at once and
  merge back (use `swarm-fanout`), there are more than 7 lanes (the streams get too thin), or the lanes need long
  descriptions (use `orbit-panel`).

## Structure

Canvas `portrait` (1080×1350). No `.mi-head`; the page uses its own header.

- **Header** `.hd`: title (one `<em>` word in accent) + `.mi-sub` line on the left, 4 `.kpi` tiles on the right
  (static values, a `data-ticker`, and one JS-driven session counter `#sess`).
- **Flow row** `.flow` (150 px, absolute boxes): `#prod`, `#api` (accent border), `#pool`, the diamond `#router`
  (rotated `<i>` + unrotated `<em>` label) under `#api`, and a `.pick` label whose `.mi-swap` children show the
  chosen lane and score.
- **Lanes** `.lanes` (flex 1, the master cycle): an overlay `.mi-svg` with one beam per lane, then 6 × `.lane`
  (grid `196px 1fr 132px 56px`): name + two stacked status spans (`.idle` / `.hot`), `.stream` (with an anchor
  `.pip#pK` at its left edge and a `data-period`), `.bars` (10 × `<i data-bar data-jitter>`), `.rate` ticker.
- **Telemetry card** `.tele` (330 px): tab row (own cycle), 3 columns: route map SVG (hand-drawn fan lines keyed to
  the lane cycle), live rate list (4 rows keyed to the lane cycle), event index `.mi-log`.
- **Footer** mark on the right; the style stamps "SIMULATION · ILLUSTRATIVE VALUES" at the bottom left.

## Motion recipe

- **Master cycle** `lane` on `.lanes`: 6 lanes × `data-step="2"` = 12 s, `data-cycles="2"` (24 s), `data-sfx="blip"`.
  The active lane tints (`--on` × 12 % of its colour), its name takes the lane colour and its status swaps
  `streaming → routed · score`.
- **Beam**: `#router@bottom → #pK@top`, `data-draw="0.5"`, `data-sfx-end="packet"`. `.main-svg .mi-beam` uses
  `opacity: var(--on)` so older beams do not leave ghost curves across the lanes.
- **Streams**: generated in `MotionSetup`. Each lane gets clusters of 3-9 marks (dots 3.5 px or dashes 8-26 px) with
  gaps of 40-130 px, placed along `u` in 0-1. Every frame `x = ((u + t / period) mod 1) × (W + 40) − 20`, with
  `period = M.snap(data-period)`; use periods that divide the master period (3, 4, 6 s for 12 s) so the loop is
  seamless. `--vis` fades marks in and out at both ends; idle lanes draw at 45 % opacity.
- **Meters**: `data-bar` + `data-jitter` on the bar sticks and the rate-list bars; `data-ticker` on every rate.
- **Linked pieces**: route-map lines and dots, rate rows and `.pick` swaps use `data-item="lane" data-index="k"`.
- **Nested / ambient**: tab cycle `tab` 5 × 2.4 s = 12 s (silent); `.mi-log` every 1 s (7 rows); router
  `data-pulse="2"`; steady packets on `#prod → #api` (1.5 s) and `#api → #router` (1 s); session counter
  `16 + floor((t mod 12) × 3.2)` so it resets with the loop.
- **Sound**: `blip` per pick + `packet` when the beam lands (24 cues in 24 s).
- **Poster**: `data-poster="4.4"` (third lane picked, beam drawn).

## Skeleton

Lanes, beams and route-map lines are repetitive; generate them with a small loop when you change the lane count.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>One Contract Six Harnesses</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-page { gap: 18px; }
  .hd { display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: start; }
  .hd .mi-title { font-size: 40px; white-space: nowrap; }
  .hd .mi-sub { margin-top: 8px; font-size: 12px; }
  .kpis { display: flex; }
  .kpi { padding: 0 10px; border-left: 1px solid var(--line); min-width: 70px; }
  .kpi .mi-label { font-size: 11px; }
  .kpi .mi-label::before { content: ""; }
  .kpi b { display: block; margin-top: 6px; font-family: var(--font-mono); font-size: 26px; font-weight: 700; color: var(--item, var(--ink)); font-variant-numeric: tabular-nums; }
  .flow { position: relative; height: 150px; }
  .box { position: absolute; top: 0; height: 64px; padding: 10px 16px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--panel); font-family: var(--font-mono); }
  .box b { display: block; font-size: 17px; font-weight: 500; }
  .box span { font-size: 12px; color: var(--muted); }
  #prod { left: 0; width: 210px; }
  #api { left: 270px; width: 420px; border-color: var(--c1); box-shadow: 0 0 18px rgba(255, 45, 111, 0.18); }
  #pool { right: 0; width: 230px; text-align: center; }
  #pool b { font-family: var(--font-display); font-style: italic; font-weight: 900; font-size: 22px; }
  #router { position: absolute; left: 448px; top: 92px; width: 64px; height: 64px; }
  #router i { position: absolute; inset: 10px; rotate: 45deg; border: 1.5px solid var(--c1); background: var(--panel); box-shadow: 0 0 calc(10px + var(--pulse) * 18px) rgba(255, 45, 111, 0.45); }
  #router em { position: absolute; inset: 0; display: grid; place-items: center; font-family: var(--font-display); font-style: italic; font-weight: 900; font-size: 15px; color: var(--c1); }
  .pick { position: absolute; left: 530px; top: 98px; width: 260px; height: 44px; font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
  .pick .mi-swap { top: 18px; color: var(--c1); }
  .lanes { flex: 1; display: flex; flex-direction: column; border-top: 1px solid var(--line); }
  .lane { flex: 1; display: grid; grid-template-columns: 196px 1fr 132px 56px; gap: 16px; align-items: center; padding: 0 10px; border-bottom: 1px solid var(--line);
    background: color-mix(in oklab, var(--item) calc(var(--on) * 12%), transparent); }
  .ln b { display: block; font-family: var(--font-mono); font-size: 17px; font-weight: 500; color: color-mix(in oklab, var(--item) calc(var(--on) * 100%), var(--ink)); }
  .ln .st { position: relative; display: block; height: 16px; font-family: var(--font-mono); font-size: 12px; }
  .ln .st span { position: absolute; left: 0; top: 0; }
  .ln .st .idle { color: var(--muted); opacity: calc(1 - var(--on)); }
  .ln .st .hot { color: var(--c1); opacity: var(--on); }
  .stream { position: relative; height: 34px; }
  .stream svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .stream .base { stroke: var(--line); stroke-width: 1; stroke-dasharray: 2 5; }
  .stream rect { fill: var(--item); opacity: calc(var(--vis) * (0.45 + var(--on) * 0.55)); }
  .pip { position: absolute; left: 0; top: 50%; width: 1px; height: 1px; }
  .bars { display: flex; align-items: flex-end; gap: 3px; height: 30px; }
  .bars i { flex: 1; height: calc(20% + var(--value, 0) * 80%); background: var(--item); opacity: calc(0.55 + var(--on) * 0.45); }
  .rate { font-family: var(--font-mono); font-size: 14px; text-align: right; color: color-mix(in oklab, var(--item) calc(var(--on) * 100%), var(--muted)); font-variant-numeric: tabular-nums; }
  .flow .mi-svg, .main-svg { z-index: 2; }
  .main-svg .mi-beam { opacity: var(--on); }
  .tele { padding: 16px 18px 14px; display: flex; flex-direction: column; gap: 12px; height: 330px; }
  .tabs { display: flex; gap: 22px; align-items: center; font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.14em; color: var(--muted); }
  .tabs .t0 { margin-right: auto; color: var(--ink); }
  .tabs span[data-item] { color: color-mix(in oklab, var(--ink) calc(var(--on) * 100%), var(--muted)); border-bottom: 2px solid color-mix(in oklab, var(--c1) calc(var(--on) * 100%), transparent); padding-bottom: 3px; }
  .cols { flex: 1; display: grid; grid-template-columns: 1fr 1fr 1.25fr; gap: 18px; min-height: 0; }
  .col h4 { font-family: var(--font-mono); font-size: 13px; font-weight: 700; letter-spacing: 0.1em; }
  .col h4 + .mi-label { margin-top: 2px; font-size: 11px; }
  .col h4 + .mi-label::before { content: ""; }
  .map { display: block; width: 100%; height: 170px; margin-top: 10px; }
  .map line { stroke: color-mix(in oklab, var(--c1) calc(var(--on) * 100%), #3a414c); stroke-width: calc(1 + var(--on) * 1.2); }
  .map circle.o { fill: var(--ink); }
  .map circle.e { fill: color-mix(in oklab, var(--c1) calc(var(--on) * 100%), #4a515c); }
  .foot2 { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 11px; color: var(--muted); margin-top: 6px; }
  .foot2 b { color: var(--ink); font-weight: 500; }
  .rates { margin-top: 12px; display: flex; flex-direction: column; gap: 8px; font-family: var(--font-mono); font-size: 13px; }
  .rates div { display: grid; grid-template-columns: 1fr 50px; gap: 8px; align-items: center; color: color-mix(in oklab, var(--ink) calc(var(--on) * 100%), var(--muted)); }
  .rates b { text-align: right; font-weight: 500; font-variant-numeric: tabular-nums; }
  .rates .mi-bar { grid-column: 1 / -1; height: 3px; }
  .col .mi-log { margin-top: 10px; font-size: 13px; --row-h: 25px; }
  .mi-log .id { color: var(--ink); }
  .mi-log .k { color: var(--c1); }
  .mi-log .d { color: var(--muted); }
  .mi-foot { margin-top: -4px; }
</style>
<script>
window.MotionSetup = (M) => {
  const NS = "http://www.w3.org/2000/svg";
  const streams = [];
  document.querySelectorAll(".stream").forEach((el, li) => {
    const r = M.rng(li * 131 + 7);
    const W = el.clientWidth, H = el.clientHeight;
    const svg = document.createElementNS(NS, "svg");
    const base = document.createElementNS(NS, "line");
    base.setAttribute("class", "base");
    base.setAttribute("x1", 0); base.setAttribute("x2", W); base.setAttribute("y1", H / 2); base.setAttribute("y2", H / 2);
    svg.appendChild(base);
    const period = M.snap(+el.dataset.period || 3);
    const dots = [];
    let u = 0;
    while (u < 1) {
      const n = 3 + Math.floor(r() * 7);
      for (let i = 0; i < n && u < 1; i++) {
        const w = r() < 0.3 ? 8 + r() * 18 : 3.5;
        const h = w > 4 ? 3 : 3.5;
        const rc = document.createElementNS(NS, "rect");
        rc.setAttribute("width", w.toFixed(1));
        rc.setAttribute("height", h);
        rc.setAttribute("rx", 1.5);
        rc.setAttribute("y", (H / 2 - h / 2 + (r() - 0.5) * 10).toFixed(1));
        svg.appendChild(rc);
        dots.push({ rc, u, w });
        u += (w + 5) / W;
      }
      u += (40 + r() * 90) / W;
    }
    el.appendChild(svg);
    streams.push({ W, period, dots });
  });
  const sess = document.querySelector("#sess");
  M.on((t) => {
    streams.forEach((s) => {
      const off = t / s.period;
      s.dots.forEach((d) => {
        const p = (d.u + off) % 1;
        const x = p * (s.W + 40) - 20;
        d.rc.setAttribute("x", x.toFixed(1));
        const vis = Math.min(1, p * 8, (1 - p) * 8);
        d.rc.style.setProperty("--vis", vis.toFixed(3));
      });
    });
    sess.textContent = 16 + Math.floor((t % 12) * 3.2);
  });
};
</script>
</head>
<body data-canvas="portrait" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="4.4">
<main class="mi-page">
  <header class="hd">
    <div>
      <h1 class="mi-title"><em>One contract</em> six harnesses</h1>
      <div class="mi-sub">one typed call picks the backend &middot; the product keeps one integration</div>
    </div>
    <div class="kpis">
      <div class="kpi"><div class="mi-label">Harnesses</div><b>6</b></div>
      <div class="kpi"><div class="mi-label">Sessions</div><b id="sess">16</b></div>
      <div class="kpi"><div class="mi-label">Req/s</div><b data-ticker="212" data-jitter="14">212</b></div>
      <div class="kpi" style="--item:var(--c1)"><div class="mi-label">Errors</div><b>1</b></div>
    </div>
  </header>

  <div class="flow">
    <svg class="mi-svg">
      <path class="mi-edge" data-link="#prod@right #api@left" data-shape="straight" data-packets="1" data-period="1.5" data-r="3"></path>
      <path class="mi-edge" data-link="#api@right #pool@left" data-shape="straight"></path>
      <path class="mi-edge" data-link="#api@bottom #router@top" data-shape="straight" data-packets="1" data-period="1" data-r="3"></path>
    </svg>
    <div class="box" id="prod"><b>your product</b><span>one integration</span></div>
    <div class="box" id="api"><b>POST /v1/run</b><span>metadata.harness_id &middot; stream</span></div>
    <div class="box" id="pool"><b>6 HARNESSES</b><span>one contract</span></div>
    <div id="router" data-pulse="2"><i></i><em>R</em></div>
    <div class="pick">choice &middot; which harness
      <div class="mi-swap-host">
        <span class="mi-swap" data-item="lane" data-index="0">&rarr; coder 0.91</span>
        <span class="mi-swap" data-item="lane" data-index="1">&rarr; reviewer 0.87</span>
        <span class="mi-swap" data-item="lane" data-index="2">&rarr; researcher 0.83</span>
        <span class="mi-swap" data-item="lane" data-index="3">&rarr; shell 0.94</span>
        <span class="mi-swap" data-item="lane" data-index="4">&rarr; batch 0.79</span>
        <span class="mi-swap" data-item="lane" data-index="5">&rarr; custom 0.72</span>
      </div>
    </div>
  </div>

  <section class="lanes" data-cycle="lane" data-step="2" data-sfx="blip" data-master>
    <svg class="mi-svg main-svg">
      <path class="mi-beam" style="--item:var(--c1)" data-link="#router@bottom #p0@top" data-beam data-item="lane" data-index="0" data-draw="0.5" data-dot-r="4" data-sfx-end="packet"></path>
      <path class="mi-beam" style="--item:var(--c1)" data-link="#router@bottom #p1@top" data-beam data-item="lane" data-index="1" data-draw="0.5" data-dot-r="4" data-sfx-end="packet"></path>
      <path class="mi-beam" style="--item:var(--c1)" data-link="#router@bottom #p2@top" data-beam data-item="lane" data-index="2" data-draw="0.5" data-dot-r="4" data-sfx-end="packet"></path>
      <path class="mi-beam" style="--item:var(--c1)" data-link="#router@bottom #p3@top" data-beam data-item="lane" data-index="3" data-draw="0.5" data-dot-r="4" data-sfx-end="packet"></path>
      <path class="mi-beam" style="--item:var(--c1)" data-link="#router@bottom #p4@top" data-beam data-item="lane" data-index="4" data-draw="0.5" data-dot-r="4" data-sfx-end="packet"></path>
      <path class="mi-beam" style="--item:var(--c1)" data-link="#router@bottom #p5@top" data-beam data-item="lane" data-index="5" data-draw="0.5" data-dot-r="4" data-sfx-end="packet"></path>
    </svg>
    <div class="lane" style="--item:var(--c1)" data-item data-color="var(--c1)">
      <div class="ln"><b>coder</b><span class="st"><span class="idle">streaming</span><span class="hot">routed &middot; 0.91</span></span></div>
      <div class="stream" data-period="3"><i class="pip" id="p0"></i></div>
      <div class="bars"><i data-bar="0.5" data-jitter="0.4"></i><i data-bar="0.6" data-jitter="0.4"></i><i data-bar="0.4" data-jitter="0.4"></i><i data-bar="0.7" data-jitter="0.3"></i><i data-bar="0.5" data-jitter="0.4"></i><i data-bar="0.6" data-jitter="0.4"></i><i data-bar="0.8" data-jitter="0.2"></i><i data-bar="0.5" data-jitter="0.4"></i><i data-bar="0.7" data-jitter="0.3"></i><i data-bar="0.9" data-jitter="0.1"></i></div>
      <div class="rate"><span data-ticker="64" data-jitter="9">64</span>/s</div>
    </div>
    <div class="lane" style="--item:var(--c2)" data-item data-color="var(--c2)">
      <div class="ln"><b>reviewer</b><span class="st"><span class="idle">files ready</span><span class="hot">routed &middot; 0.87</span></span></div>
      <div class="stream" data-period="4"><i class="pip" id="p1"></i></div>
      <div class="bars"><i data-bar="0.6" data-jitter="0.3"></i><i data-bar="0.5" data-jitter="0.4"></i><i data-bar="0.7" data-jitter="0.3"></i><i data-bar="0.6" data-jitter="0.4"></i><i data-bar="0.8" data-jitter="0.2"></i><i data-bar="0.5" data-jitter="0.4"></i><i data-bar="0.6" data-jitter="0.4"></i><i data-bar="0.7" data-jitter="0.3"></i><i data-bar="0.9" data-jitter="0.1"></i><i data-bar="0.7" data-jitter="0.3"></i></div>
      <div class="rate"><span data-ticker="78" data-jitter="10">78</span>/s</div>
    </div>
    <div class="lane" style="--item:var(--c3)" data-item data-color="var(--c3)">
      <div class="ln"><b>researcher</b><span class="st"><span class="idle">streaming</span><span class="hot">routed &middot; 0.83</span></span></div>
      <div class="stream" data-period="6"><i class="pip" id="p2"></i></div>
      <div class="bars"><i data-bar="0.4" data-jitter="0.3"></i><i data-bar="0.5" data-jitter="0.3"></i><i data-bar="0.6" data-jitter="0.3"></i><i data-bar="0.5" data-jitter="0.3"></i><i data-bar="0.6" data-jitter="0.3"></i><i data-bar="0.7" data-jitter="0.3"></i><i data-bar="0.6" data-jitter="0.3"></i><i data-bar="0.8" data-jitter="0.2"></i><i data-bar="0.7" data-jitter="0.3"></i><i data-bar="0.8" data-jitter="0.2"></i></div>
      <div class="rate"><span data-ticker="36" data-jitter="6">36</span>/s</div>
    </div>
    <div class="lane" style="--item:var(--c5)" data-item data-color="var(--c5)">
      <div class="ln"><b>shell</b><span class="st"><span class="idle">streaming</span><span class="hot">routed &middot; 0.94</span></span></div>
      <div class="stream" data-period="4"><i class="pip" id="p3"></i></div>
      <div class="bars"><i data-bar="0.7" data-jitter="0.2"></i><i data-bar="0.6" data-jitter="0.3"></i><i data-bar="0.7" data-jitter="0.2"></i><i data-bar="0.8" data-jitter="0.2"></i><i data-bar="0.6" data-jitter="0.3"></i><i data-bar="0.7" data-jitter="0.2"></i><i data-bar="0.8" data-jitter="0.2"></i><i data-bar="0.7" data-jitter="0.2"></i><i data-bar="0.8" data-jitter="0.2"></i><i data-bar="0.9" data-jitter="0.1"></i></div>
      <div class="rate"><span data-ticker="31" data-jitter="5">31</span>/s</div>
    </div>
    <div class="lane" style="--item:var(--c4)" data-item data-color="var(--c4)">
      <div class="ln"><b>batch</b><span class="st"><span class="idle">queued</span><span class="hot">routed &middot; 0.79</span></span></div>
      <div class="stream" data-period="6"><i class="pip" id="p4"></i></div>
      <div class="bars"><i data-bar="0.3" data-jitter="0.3"></i><i data-bar="0.5" data-jitter="0.4"></i><i data-bar="0.4" data-jitter="0.4"></i><i data-bar="0.6" data-jitter="0.3"></i><i data-bar="0.5" data-jitter="0.4"></i><i data-bar="0.4" data-jitter="0.4"></i><i data-bar="0.6" data-jitter="0.3"></i><i data-bar="0.5" data-jitter="0.4"></i><i data-bar="0.7" data-jitter="0.3"></i><i data-bar="0.6" data-jitter="0.3"></i></div>
      <div class="rate"><span data-ticker="27" data-jitter="5">27</span>/s</div>
    </div>
    <div class="lane" style="--item:var(--c1)" data-item data-color="var(--c1)">
      <div class="ln"><b>custom &middot; sandbox</b><span class="st"><span class="idle">cancelled</span><span class="hot">routed &middot; 0.72</span></span></div>
      <div class="stream" data-period="3"><i class="pip" id="p5"></i></div>
      <div class="bars"><i data-bar="0.4" data-jitter="0.4"></i><i data-bar="0.6" data-jitter="0.4"></i><i data-bar="0.5" data-jitter="0.4"></i><i data-bar="0.7" data-jitter="0.3"></i><i data-bar="0.5" data-jitter="0.4"></i><i data-bar="0.6" data-jitter="0.4"></i><i data-bar="0.7" data-jitter="0.3"></i><i data-bar="0.8" data-jitter="0.2"></i><i data-bar="0.6" data-jitter="0.4"></i><i data-bar="0.9" data-jitter="0.1"></i></div>
      <div class="rate"><span data-ticker="21" data-jitter="4">21</span>/s</div>
    </div>
  </section>

  <div class="mi-card tele">
    <div class="tabs" data-cycle="tab" data-step="2.4">
      <span class="t0">HARNESS TELEMETRY</span>
      <span data-item>ROUTE</span><span data-item>RUN</span><span data-item>STREAM</span><span data-item>FILES</span><span data-item>SHIP</span>
    </div>
    <div class="cols">
      <div class="col">
        <h4>01 ROUTE MAP</h4><div class="mi-label">one call, six backends</div>
        <svg class="map" viewBox="0 0 280 170">
          <line x1="24" y1="85" x2="240" y2="15" data-item="lane" data-index="0"></line>
          <line x1="24" y1="85" x2="240" y2="43" data-item="lane" data-index="1"></line>
          <line x1="24" y1="85" x2="240" y2="71" data-item="lane" data-index="2"></line>
          <line x1="24" y1="85" x2="240" y2="99" data-item="lane" data-index="3"></line>
          <line x1="24" y1="85" x2="240" y2="127" data-item="lane" data-index="4"></line>
          <line x1="24" y1="85" x2="240" y2="155" data-item="lane" data-index="5"></line>
          <circle class="e" cx="240" cy="15" r="4" data-item="lane" data-index="0"></circle>
          <circle class="e" cx="240" cy="43" r="4" data-item="lane" data-index="1"></circle>
          <circle class="e" cx="240" cy="71" r="4" data-item="lane" data-index="2"></circle>
          <circle class="e" cx="240" cy="99" r="4" data-item="lane" data-index="3"></circle>
          <circle class="e" cx="240" cy="127" r="4" data-item="lane" data-index="4"></circle>
          <circle class="e" cx="240" cy="155" r="4" data-item="lane" data-index="5"></circle>
          <circle class="o" cx="24" cy="85" r="6"></circle>
        </svg>
        <div class="foot2"><span>harnesses <b>6</b></span><span>contract <b>v1</b></span></div>
      </div>
      <div class="col">
        <h4>02 LIVE STREAM</h4><div class="mi-label">events per backend</div>
        <div class="rates">
          <div style="--item:var(--c1)" data-item="lane" data-index="0">coder<b><span data-ticker="64" data-jitter="9">64</span>/s</b><span class="mi-bar"><i data-bar="0.8" data-jitter="0.15"></i></span></div>
          <div style="--item:var(--c2)" data-item="lane" data-index="1">reviewer<b><span data-ticker="78" data-jitter="10">78</span>/s</b><span class="mi-bar"><i data-bar="0.9" data-jitter="0.1"></i></span></div>
          <div style="--item:var(--c3)" data-item="lane" data-index="2">researcher<b><span data-ticker="36" data-jitter="6">36</span>/s</b><span class="mi-bar"><i data-bar="0.5" data-jitter="0.15"></i></span></div>
          <div style="--item:var(--c5)" data-item="lane" data-index="3">shell<b><span data-ticker="31" data-jitter="5">31</span>/s</b><span class="mi-bar"><i data-bar="0.45" data-jitter="0.15"></i></span></div>
        </div>
      </div>
      <div class="col">
        <h4>03 EVENT INDEX</h4><div class="mi-label">last task events</div>
        <div class="mi-log" data-log="1" data-rows="7">
          <div data-line><span class="k">&gt;</span> <span class="id">task_1f9c</span> <span class="d">coder &middot; completed</span></div>
          <div data-line><span class="k">&gt;</span> <span class="id">task_1fa0</span> <span class="d">reviewer &middot; files attached</span></div>
          <div data-line><span class="k">&gt;</span> <span class="id">task_1fa3</span> <span class="d">shell &middot; exit 0</span></div>
          <div data-line><span class="k">&gt;</span> <span class="id">task_1fa7</span> <span class="d">researcher &middot; 12 sources</span></div>
          <div data-line><span class="k">&gt;</span> <span class="id">task_1fab</span> <span class="d">batch &middot; queued</span></div>
          <div data-line><span class="k">&gt;</span> <span class="id">task_1fb0</span> <span class="d">custom &middot; cancelled</span></div>
          <div data-line><span class="k">&gt;</span> <span class="id">task_1fb4</span> <span class="d">coder &middot; artifacts</span></div>
          <div data-line><span class="k">&gt;</span> <span class="id">task_1fb9</span> <span class="d">reviewer &middot; completed</span></div>
          <div data-line><span class="k">&gt;</span> <span class="id">task_1fbd</span> <span class="d">shell &middot; exit 0</span></div>
          <div data-line><span class="k">&gt;</span> <span class="id">task_1fc2</span> <span class="d">researcher &middot; completed</span></div>
          <div data-line><span class="k">&gt;</span> <span class="id">task_1fc6</span> <span class="d">batch &middot; 40 items</span></div>
          <div data-line><span class="k">&gt;</span> <span class="id">task_1fca</span> <span class="d">coder &middot; completed</span></div>
        </div>
      </div>
    </div>
  </div>
  <footer class="mi-foot"><span></span><span class="mark">harness router</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Lane count**: 5-7. Keep lanes × step = 12 s (5 lanes → step 2.4, 7 lanes → give the master `data-count` or
  accept 14 s and set the tab cycle to 7 × 2 s). Space the route-map end points evenly over the SVG height.
- **Colours**: one colour per backend family; reuse `--c1` for the backend you want to stress. The beam stays
  accent pink in `telemetry-sim`; set its `--item` to the lane colour in other styles.
- **Stream density**: raise `n` or shrink the gap range in `MotionSetup` for busier lanes; keep under ~300 marks.
  A shorter `data-period` reads as a faster lane.
- **Landscape**: `data-canvas="landscape"`, put the telemetry card to the right of the lanes (grid `1fr 420px`).
- **Pitfalls**: `.stream` needs a fixed height because marks are generated from its size. Do not put `data-beam`
  and `data-packets` on one path. The `.pip` anchors must stay static (no `data-drift`). If the KPI row grows,
  shrink the title before the KPIs overflow the right gutter.
