# rail-split

A poster-style rail yard: a huge headline on a full-bleed colour band, then one track that leaves the "agent loop"
station, hits a switch and splits into an expensive upper branch and a cheap lower branch before it rejoins at the
"next step" station. Each step one labelled train runs the route the switch sends it down, the chosen branch lights
up and shows its cost tag, a departures board marks the job "on track" then "arrived", and three stat cards total
the time spent on each track.

## Use when / Avoid when

- **Use when**: one decision sends each job down one of two paths with very different cost or speed (router vs
  generator, cache hit vs miss, human review vs auto-approve, fast lane vs slow lane), and you want the viewer to
  feel that most traffic takes the cheap path.
- **Avoid when**: there are more than two branches (use `lane-stream` or `tile-router`), the choice is a score among
  several candidates (use `hub-picker`), or the flow is a long sequence of stages (use `card-pipeline` or
  `linear-progression`).

## Structure

Canvas `1600x1200` (4:3). No `.mi-sub`; the headline lives in the colour band.

- **Band** `.band`: full-bleed `--c1` strip with `.mi-title` (white, one `em` phrase in ink), a mono kicker line and
  a right-hand `.tag` with a big number.
- **Main** `.main` (grid `1fr 470px`), the master cycle element:
  - **Yard** `.mi-card.yard#yard`: heading row, then one SVG (`viewBox 0 0 1000 520`) with two `.sleepers` paths
    (thick dashed stroke = ties), two `.rail` routes `#routeU` / `#routeL` (each a full route: trunk, switch curve,
    branch, merge, trunk), branch labels `.brl`, price tags `#tagU` / `#tagL`, the switch `#lever` + `.pivot`, two
    black station pills `.stn`, and the train `#train` (rounded pill + label).
  - **Departures** `.mi-card.board`: dark card, header row and one `.brow` per job (`data-item`, `data-index`
    0-5): id, task, track chip `.br`, time, status `queued / on track / arrived`.
- **Stats** `.stats`: three cards: time on each track (two bars filled by JS), counters (jobs arrived, jobs on the
  big model), and a dark `.big` card with the headline multiplier. **Footer**.

## Motion recipe

- **Master cycle** `job` on `.main`: 6 jobs × `data-step="2"` = 12 s, `data-cycles="2"` (24 s), `data-sfx="blip"`.
  `data-offset="-1.1"` starts the video halfway through the first job, so frame 0 already shows a train on a lit
  branch with its cost tag.
- **Train** (custom JS, `MotionSetup`): reads `--index` and `--step-p` from the cycle element. For the step's job it
  eases the lever from the previous job's branch to this one (first 15 % of the step), then moves the train along
  `#routeU` or `#routeL` with `getPointAtLength` (12 %-92 % of the step, `M.ease.inOut`). Routes start and end
  one train-width outside the station pills, so the train never covers a station label.
- **Branch light**: once the train passes 45 % of its route, JS writes `--up` or `--dn` on `#yard`; the chosen rail
  turns `--c3` (upper) or `--c5` (lower) and thickens, and its price tag fades from 0.18 to 1 with the job's cost.
- **Board**: `.brow` rows are cycle items, so the active row fills with `--c1` (`--on`) and the status spans cross-fade
  `queued → on track (--on) → arrived (--done)`.
- **Stats**: JS sums seconds per branch for finished jobs plus the running job (× its progress) and writes bar widths
  (`--w`) and totals; counters count arrived jobs. Everything is derived from the cycle position, so each 12 s loop
  resets cleanly and the last frame matches frame 0.
- **Sound**: `blip` per job (12 cues in 24 s). Poster: `data-poster="3.2"` (second job on the upper branch).

## Skeleton

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Two Tracks One Loop</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-page { gap: 20px; }
  .band { margin: calc(var(--pad) * -1) calc(var(--pad) * -1) 0; padding: 34px var(--pad) 26px; background: var(--c1); color: #fff; display: grid; grid-template-columns: 1fr auto; align-items: end; gap: 24px; }
  .band .mi-title { font-size: 112px; line-height: .9; color: #fff; mix-blend-mode: normal; animation: none; letter-spacing: -.03em; }
  .band .mi-title em { color: var(--ink); }
  .band .kick { font-family: var(--font-mono); font-size: 18px; letter-spacing: .08em; text-transform: uppercase; margin-top: 14px; }
  .band .tag { font-family: var(--font-mono); font-size: 15px; text-align: right; line-height: 1.6; text-transform: uppercase; }
  .band .tag b { display: block; font-family: var(--font-display); font-size: 44px; line-height: 1; }
  .main { display: grid; grid-template-columns: 1fr 470px; gap: 20px; flex: 1; min-height: 0; }
  .yard { position: relative; padding: 18px 22px; display: flex; flex-direction: column; }
  .yard .hd, .board .hd { display: flex; justify-content: space-between; align-items: baseline; }
  .yard h3, .board h3 { font-size: 24px; }
  .yard svg { flex: 1; width: 100%; min-height: 0; overflow: visible; }
  .sleepers { fill: none; stroke: var(--ink); stroke-width: 18; stroke-dasharray: 3 10; opacity: .55; }
  .rail { fill: none; stroke: var(--ink); stroke-width: 4; stroke-linecap: round; }
  .rail.u { stroke: color-mix(in oklab, var(--c3) calc(var(--up, 0) * 100%), var(--ink)); stroke-width: calc(4px + var(--up, 0) * 3px); }
  .rail.l { stroke: color-mix(in oklab, var(--c5) calc(var(--dn, 0) * 100%), var(--ink)); stroke-width: calc(4px + var(--dn, 0) * 3px); }
  .stn rect { fill: var(--ink); }
  .stn text { fill: #fff; font-family: var(--font-mono); font-size: 17px; font-weight: 500; text-anchor: middle; dominant-baseline: central; letter-spacing: .06em; }
  .brl rect { fill: var(--panel); stroke: var(--ink); stroke-width: 2; }
  .brl text { font-family: var(--font-mono); font-size: 16px; text-anchor: middle; dominant-baseline: central; fill: var(--ink); }
  .brl text b, .brl .h { font-weight: 700; }
  .lever { stroke: var(--c1); stroke-width: 6; stroke-linecap: round; }
  .pivot { fill: var(--c1); stroke: var(--ink); stroke-width: 2; }
  .price rect { stroke: var(--ink); stroke-width: 2; }
  .price text { font-family: var(--font-mono); font-size: 16px; font-weight: 500; text-anchor: middle; dominant-baseline: central; fill: #fff; }
  .train rect { fill: var(--c1); stroke: var(--ink); stroke-width: 2.5; }
  .train text { fill: #fff; font-family: var(--font-mono); font-size: 16px; font-weight: 500; text-anchor: middle; dominant-baseline: central; }
  .board { padding: 18px 20px; background: var(--code-bg); color: var(--code-ink); border-color: var(--code-bg); display: flex; flex-direction: column; gap: 8px; }
  .board h3 { color: var(--code-ink); }
  .board .hd span { font-family: var(--font-mono); font-size: 13px; opacity: .7; letter-spacing: .08em; }
  .brow, .bhead { display: grid; grid-template-columns: 58px 1fr 86px 70px 84px; gap: 8px; align-items: center; font-family: var(--font-mono); font-size: 15px; }
  .bhead { font-size: 12px; opacity: .6; letter-spacing: .1em; text-transform: uppercase; padding: 4px 10px; }
  .brow { height: 64px; padding: 0 10px; border-radius: 4px; background: color-mix(in oklab, var(--c1) calc(var(--on) * 85%), transparent); color: color-mix(in oklab, #fff calc(var(--on) * 100%), var(--code-ink)); }
  .brow .t { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .br { font-size: 12px; padding: 3px 6px; border-radius: 3px; text-align: center; letter-spacing: .06em; color: #fff; background: var(--item); }
  .st { position: relative; height: 18px; font-size: 13px; }
  .st span { position: absolute; left: 0; top: 0; }
  .st .q { opacity: calc(1 - max(var(--on), var(--done))); }
  .st .w { opacity: var(--on); color: #fff; font-weight: 500; }
  .st .a { opacity: calc(var(--done) * (1 - var(--on))); color: var(--code-accent); }
  .board .foot { margin-top: auto; font-family: var(--font-mono); font-size: 13px; opacity: .7; }
  .stats { display: grid; grid-template-columns: 1.25fr 1fr 1fr; gap: 20px; height: 196px; }
  .stat { padding: 16px 20px; display: flex; flex-direction: column; gap: 10px; }
  .stat h4 { font-family: var(--font-mono); font-weight: 500; font-size: 14px; letter-spacing: .1em; text-transform: uppercase; }
  .tb { display: grid; grid-template-columns: 110px 1fr 70px; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 15px; }
  .tb .mi-bar { height: 14px; }
  .tb .mi-bar i { display: block; height: 100%; width: calc(var(--w, 0) * 100%); background: var(--item); }
  .tb b { text-align: right; font-weight: 500; }
  .cnt { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .cnt b { display: block; font-family: var(--font-display); font-size: 54px; line-height: 1; color: var(--item); font-variant-numeric: tabular-nums; }
  .cnt span { font-family: var(--font-mono); font-size: 13px; text-transform: uppercase; letter-spacing: .06em; }
  .big { background: var(--ink); color: var(--bg); border-color: var(--ink); }
  .big b { font-family: var(--font-display); font-size: 88px; line-height: .9; color: var(--c1); font-variant-numeric: tabular-nums; }
  .big p { font-family: var(--font-mono); font-size: 14px; line-height: 1.5; }
</style>
<script>
window.MotionSetup = (M) => {
  const jobs = [
    { up: 0, u: "+14 tok", l: "90 ms" },
    { up: 1, u: "+880 tok", l: "2.9 s" },
    { up: 0, u: "+11 tok", l: "80 ms" },
    { up: 0, u: "+16 tok", l: "110 ms" },
    { up: 1, u: "+1.2k tok", l: "3.4 s" },
    { up: 0, u: "+12 tok", l: "95 ms" }
  ];
  const ids = ["#482", "#483", "#484", "#485", "#486", "#487"];
  const acts = ["fix", "write", "retry?", "tests?", "docs", "ship?"];
  const cyc = document.querySelector('[data-cycle="job"]');
  const yard = document.querySelector("#yard");
  const pu = document.querySelector("#routeU"), pl = document.querySelector("#routeL");
  const LU = pu.getTotalLength(), LL = pl.getTotalLength();
  const train = document.querySelector("#train"), tt = document.querySelector("#train text");
  const lever = document.querySelector("#lever");
  const tagU = document.querySelector("#tagU"), tagL = document.querySelector("#tagL");
  const tuT = document.querySelector("#tagU text"), tlT = document.querySelector("#tagL text");
  const genB = document.querySelector("#genB"), decB = document.querySelector("#decB");
  const genT = document.querySelector("#genT"), decT = document.querySelector("#decT");
  const nJobs = document.querySelector("#nJobs"), nGen = document.querySelector("#nGen");
  const secs = (j) => j.up ? parseFloat(j.l) : parseFloat(j.l) / 1000;
  M.on(() => {
    const i = Math.round(parseFloat(cyc.style.getPropertyValue("--index")) || 0);
    const p = parseFloat(cyc.style.getPropertyValue("--step-p")) || 0;
    const j = jobs[i % jobs.length];
    const sw = M.ease.inOut(Math.min(1, p / 0.15));
    const prev = jobs[(i + jobs.length - 1) % jobs.length].up;
    const pos = prev + (j.up - prev) * sw;
    lever.setAttribute("transform", `rotate(${-32 + 64 * (1 - pos)} 310 220)`);
    const k = M.ease.inOut(Math.min(1, Math.max(0, (p - 0.12) / 0.8)));
    const path = j.up ? pu : pl, L = j.up ? LU : LL;
    const pt = path.getPointAtLength(k * L);
    train.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
    tt.textContent = `job ${ids[i % 6]} · ${acts[i % 6]}`;
    const mid = Math.min(1, Math.max(0, (k - 0.45) * 6));
    yard.style.setProperty("--up", j.up ? mid : 0);
    yard.style.setProperty("--dn", j.up ? 0 : mid);
    tagU.setAttribute("opacity", j.up ? mid : 0.18);
    tagL.setAttribute("opacity", j.up ? 0.18 : mid);
    tuT.textContent = j.up ? `${j.u} · ${j.l}` : "large model";
    tlT.textContent = j.up ? "small model" : `${j.u} · ${j.l}`;
    let g = 0, d = 0, n = 0, ng = 0;
    for (let q = 0; q <= i; q++) {
      const f = q < i ? 1 : k;
      const s = secs(jobs[q]) * f;
      if (jobs[q].up) { g += s; ng += f >= 1 ? 1 : 0; } else d += s;
      n += f >= 1 ? 1 : 0;
    }
    genB.style.setProperty("--w", Math.min(1, g / 7).toFixed(3));
    decB.style.setProperty("--w", Math.min(1, d / 7).toFixed(3));
    genT.textContent = g.toFixed(1) + " s";
    decT.textContent = d.toFixed(2) + " s";
    nJobs.textContent = n;
    nGen.textContent = ng;
  });
};
</script>
</head>
<body data-canvas="1600x1200" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="3.2">
<main class="mi-page">
  <header class="band">
    <div>
      <h1 class="mi-title">Two tracks, <em>one loop</em></h1>
      <div class="kick">the big model writes &middot; a small model picks the track</div>
    </div>
    <div class="tag"><b>6 jobs</b>one switch &middot; two prices</div>
  </header>

  <section class="main" data-cycle="job" data-step="2" data-offset="-1.1" data-sfx="blip" data-master>
    <div class="mi-card yard" id="yard">
      <div class="hd"><h3>The yard</h3><span class="mi-label">every job passes one switch</span></div>
      <svg viewBox="0 0 1000 520">
        <path class="sleepers" d="M60 220 L310 220 C370 220 380 70 450 70 L560 70 C630 70 640 220 700 220 L940 220"></path>
        <path class="sleepers" d="M310 220 C370 220 380 450 450 450 L560 450 C630 450 640 220 700 220"></path>
        <path class="rail u" id="routeU" d="M272 220 L310 220 C370 220 380 70 450 70 L560 70 C630 70 640 220 700 220 L728 220"></path>
        <path class="rail l" id="routeL" d="M272 220 L310 220 C370 220 380 450 450 450 L560 450 C630 450 640 220 700 220 L728 220"></path>
        <g class="brl" transform="translate(505 22)"><rect x="-150" y="-20" width="300" height="40" rx="4"></rect><text><tspan class="h">GENERATE</tspan> &#183; slow, costly</text></g>
        <g class="brl" transform="translate(505 498)"><rect x="-150" y="-20" width="300" height="40" rx="4"></rect><text><tspan class="h">DECIDE</tspan> &#183; fast, cheap</text></g>
        <g class="price" id="tagU" transform="translate(505 158)"><rect x="-110" y="-18" width="220" height="36" rx="18" style="fill: var(--c3)"></rect><text>large model</text></g>
        <g class="price" id="tagL" transform="translate(505 282)"><rect x="-110" y="-18" width="220" height="36" rx="18" style="fill: var(--c5)"></rect><text>small model</text></g>
        <line class="lever" id="lever" x1="310" y1="220" x2="370" y2="220"></line>
        <circle class="pivot" cx="310" cy="220" r="10"></circle>
        <g class="stn" transform="translate(96 220)"><rect x="-86" y="-24" width="172" height="48" rx="24"></rect><text>AGENT LOOP</text></g>
        <g class="stn" transform="translate(904 220)"><rect x="-86" y="-24" width="172" height="48" rx="24"></rect><text>NEXT STEP</text></g>
        <text x="310" y="262" text-anchor="middle" style="font-family: var(--font-mono); font-size: 14px; fill: var(--muted); letter-spacing: .1em">SWITCH</text>
        <g class="train" id="train"><rect x="-88" y="-17" width="176" height="34" rx="17"></rect><text>job #482 &#183; fix</text></g>
      </svg>
    </div>

    <div class="mi-card board">
      <div class="hd"><h3>Departures</h3><span>TRACK &middot; TIME &middot; COST</span></div>
      <div class="bhead"><span>job</span><span>task</span><span>track</span><span>time</span><span>status</span></div>
      <div class="brow" data-item data-index="0" style="--item: var(--c5)"><span>#482</span><span class="t">fix failing test</span><span class="br">DECIDE</span><span>90 ms</span><span class="st"><span class="q">queued</span><span class="w">on track</span><span class="a">arrived</span></span></div>
      <div class="brow" data-item data-index="1" style="--item: var(--c3)"><span>#483</span><span class="t">write migration</span><span class="br">GENERATE</span><span>2.9 s</span><span class="st"><span class="q">queued</span><span class="w">on track</span><span class="a">arrived</span></span></div>
      <div class="brow" data-item data-index="2" style="--item: var(--c5)"><span>#484</span><span class="t">retry or stop?</span><span class="br">DECIDE</span><span>80 ms</span><span class="st"><span class="q">queued</span><span class="w">on track</span><span class="a">arrived</span></span></div>
      <div class="brow" data-item data-index="3" style="--item: var(--c5)"><span>#485</span><span class="t">which tests?</span><span class="br">DECIDE</span><span>110 ms</span><span class="st"><span class="q">queued</span><span class="w">on track</span><span class="a">arrived</span></span></div>
      <div class="brow" data-item data-index="4" style="--item: var(--c3)"><span>#486</span><span class="t">draft the docs</span><span class="br">GENERATE</span><span>3.4 s</span><span class="st"><span class="q">queued</span><span class="w">on track</span><span class="a">arrived</span></span></div>
      <div class="brow" data-item data-index="5" style="--item: var(--c5)"><span>#487</span><span class="t">safe to ship?</span><span class="br">DECIDE</span><span>95 ms</span><span class="st"><span class="q">queued</span><span class="w">on track</span><span class="a">arrived</span></span></div>
      <div class="foot">4 of 6 jobs never touch the large model</div>
    </div>
  </section>

  <section class="stats">
    <div class="mi-card stat">
      <h4>Time on each track</h4>
      <div class="tb" style="--item: var(--c3)"><span>generate</span><span class="mi-bar"><i id="genB"></i></span><b id="genT">0.0 s</b></div>
      <div class="tb" style="--item: var(--c5)"><span>decide</span><span class="mi-bar"><i id="decB"></i></span><b id="decT">0.00 s</b></div>
      <span class="mi-label">this loop, running total</span>
    </div>
    <div class="mi-card stat">
      <h4>Counters</h4>
      <div class="cnt">
        <div style="--item: var(--c2)"><b id="nJobs">0</b><span>jobs arrived</span></div>
        <div style="--item: var(--c3)"><b id="nGen">0</b><span>on the big model</span></div>
      </div>
    </div>
    <div class="mi-card stat big">
      <h4>At 50 jobs a day</h4>
      <b>&times;18</b>
      <p>cheaper than sending every step down the generate track</p>
    </div>
  </section>

  <footer class="mi-foot"><span>ILLUSTRATIVE NUMBERS</span><span class="path">LOOP &gt; SWITCH &gt; TRACK &gt; NEXT STEP</span><span class="mark">railyard</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Jobs**: edit the `jobs` array (`up: 1` = upper branch; `u` = cost tag text, `l` = time text, used for the time
  bars), `ids` and `acts` (train label), and keep one `.brow` per job in the same order. 4-8 jobs; keep
  jobs × step between 12 and 16 s and `data-cycles="2"`.
- **Branch meaning**: rename the `.brl` labels and the `.br` chips; the colours come from `--c3` (upper) and `--c5`
  (lower), so pick a style whose `--c3` reads as "expensive" and `--c5` as "cheap", or swap them in the CSS.
- **Track shape**: both routes share the trunk `M272 220 L310 220` and the merge `700 220 L728 220`; change only the
  control points between them. Move the price tags if a branch gets closer to the trunk, so the train does not cross
  its own tag.
- **Styles**: `risograph-pop` gives the pink band and navy board; `subway-map` works as well (red band, dark board,
  route lines around the page). Light styles need a dark `--code-bg` for the board.
- **Pitfalls**: the lever and train are positioned in SVG user units, so keep the SVG `viewBox` fixed and let the card
  size change. Do not add `data-packets` to the rails; the train is the only moving object on the track.
