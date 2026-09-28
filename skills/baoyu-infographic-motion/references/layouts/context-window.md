# context-window

A bento dashboard that explains how one model call's context window is assembled: six moves step across the top
while the budget bar re-splits, a recall curve shows where attention lands, a compaction list and a prefix-cache
grid tick, and a slowly turning particle sphere shows every token that made the cut.

## Use when / Avoid when

- **Use when**: context engineering, prompt / memory budgets, RAG packing, caching and compaction stories, any
  "what goes into one call" explainer with 5-6 steps and a handful of live metrics.
- **Avoid when**: the story is a flow between systems (use `hub-pipeline` or `lane-stream`), there is only one
  metric (use `live-dashboard`), or the panels would need long prose (use `paper-page`).

## Structure

Canvas `1200x1500` (4:5 portrait, tall enough for six panels plus header and marquee). Own header, no `.mi-sub`.

- **Header** `.hd`: `.mi-top` crumb + move counter, `.mi-title` with one `<em>` word, italic tagline, KPI strip
  `.kpis` (4 × `.kpi`: window, used `#used`, cache hit `#kpihit`, turns ticker).
- **Grid** `.grid.mi-body` (2 columns, 6 `.mi-card.p` panels, numbered `h3 > i`):
  1. `.wide` moves: `.moves` 6 × `.mv` chips (the master items), token `.strip` of 72 generated ticks with a
     yellow marker `.mk`.
  2. Budget: `.bud` stacked bar (5 `i` segments, `--k` colour) + `.leg` legend with live values.
  3. Attention: inline SVG U-shaped area `.area`, dashed middle band `.mid`, sweeping `.dot`.
  4. Compaction: `.rows` of 6 `.rw` (name, size, `.mi-badge` kept / summarised / dropped) + `.mi-ring#ring`.
  5. Prefix cache: `.cells` grid of 96 generated cells (16 × 6) + hit % `#hit` and legend.
  6. `.wide` window: legend, `.sph > svg` particle sphere (400 generated circles), token count `#cnt`.
- **Marquee** `.band` of rules (content doubled, `data-phase="12"`), then `.mi-foot`.

## Motion recipe

- **Master cycle** `move` on `.grid`: 6 chips × `data-step="2"` = 12 s, `data-cycles="2"` (24 s), `data-sfx="blip"`.
  The active chip fills with its `--item`, lifts and gets a hard shadow; done chips keep an 18 % tint.
- **Budget**: `MotionSetup` keeps a table `BUD` (one row of 5 percentages per move). Each step eases from the
  previous row to its own in 0.6 s; segment widths, legend values, `#used` and `#cnt` all come from the same sum.
  Row 6 flows back into row 1, so the loop is seamless.
- **Compaction ring**: `KEEP` table per move, same easing, written as `--value` on `#ring`.
- **Nested cycle** `row` on `.rows`: 6 rows × 1 s = 6 s (divides 12), the active row gets a yellow fill and ink border.
- **Prefix cache**: a seeded noise table (`M.rng(99)`, 96 cells × 24 ticks) picks hit / miss / stale every 0.5 s; the
  first 10 columns are the stable prefix (almost always hit), the tail misses often. `#hit` and `#kpihit` count hits.
  24 ticks × 0.5 s = the 12 s cycle, so the flicker loops.
- **Attention dot** and token-strip marker sweep once per 12 s (`data-phase="12"` on `.mk`; the dot is placed on
  the curve in `M.on`).
- **Sphere**: 400 points on a Fibonacci sphere, category per point from `M.rng(42)`; rotation angle =
  `t / duration × 2π` (one full turn per video, so the last frame meets frame 0). Depth sets radius and opacity.
- **Ambient**: turns KPI `data-ticker`, marquee `data-phase="12"`, footer dots and caret from the style.
- **Sound**: `blip` per move (12 cues in 24 s).
- **Poster**: `data-poster="2.8"` (ORDER active, budget mid-resize). Frame 0 is already complete.

## Skeleton

The strip ticks, cache cells and sphere dots are generated in `MotionSetup`; edit the tables at the top of it.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Context Window Assembly</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-page { gap: 16px; padding-bottom: 36px; }
  .hd { display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: end; }
  .hd .mi-title { font-size: calc(var(--title-size) * .9); }
  .tag { font-family: var(--font-mono); font-size: 14px; color: var(--muted); margin-top: 8px; font-style: italic; }
  .kpis { display: grid; grid-template-columns: repeat(4, auto); border: var(--bw) solid var(--ink); border-radius: var(--radius); background: var(--panel); box-shadow: 5px 5px 0 var(--ink); }
  .kpi { padding: 10px 16px; border-left: 2px solid var(--ink); min-width: 104px; }
  .kpi:first-child { border-left: 0; }
  .kpi .mi-label { font-size: 12px; letter-spacing: .08em; }
  .kpi b { display: block; font-family: var(--font-mono); font-size: 26px; font-weight: 800; color: var(--item, var(--ink)); font-variant-numeric: tabular-nums; margin-top: 4px; }
  .grid { flex: 1; min-height: 0; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: auto auto auto 1fr; gap: 16px; }
  .p { padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; min-height: 0; }
  .p.wide { grid-column: 1 / -1; }
  .ph { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
  .ph h3 { font-size: 18px; }
  .ph h3 i { font-style: normal; display: inline-grid; place-items: center; width: 24px; height: 24px; margin-right: 8px; border: 2px solid var(--ink); border-radius: 5px; background: var(--hl); font-family: var(--font-mono); font-size: 13px; font-weight: 800; vertical-align: 2px; }
  .ph .mi-label { font-size: 12px; }
  .moves { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
  .mv { border: 2px solid var(--ink); border-radius: 7px; padding: 8px 10px; background: color-mix(in oklab, var(--item) calc(var(--on) * 85% + var(--done) * 18%), var(--panel)); box-shadow: calc(var(--on) * 4px) calc(var(--on) * 4px) 0 var(--ink); translate: calc(var(--on) * -2px) calc(var(--on) * -2px); }
  .mv b { display: block; font-family: var(--font-mono); font-size: 14px; font-weight: 800; letter-spacing: .06em; }
  .mv span { display: block; font-family: var(--font-mono); font-size: 12px; color: var(--muted); margin-top: 3px; }
  .strip { position: relative; display: flex; gap: 2px; height: 16px; }
  .strip i { flex: 1; border-radius: 2px; background: var(--k); opacity: .75; }
  .strip .mk { position: absolute; top: -7px; left: calc(var(--phase) * 100%); width: 14px; height: 30px; translate: -7px 0; border: 2.5px solid var(--ink); border-radius: 4px; background: var(--hl); opacity: 1; flex: none; }
  .ends { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
  .bud { display: flex; height: 34px; border: 2.5px solid var(--ink); border-radius: 7px; overflow: hidden; background: var(--panel2); }
  .bud i { display: block; height: 100%; background: var(--k); border-right: 2px solid var(--ink); }
  .bud i:last-child { border-right: 0; }
  .leg { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px 12px; font-family: var(--font-mono); font-size: 12px; }
  .leg span { display: flex; align-items: center; gap: 6px; }
  .leg span::before { content: ""; width: 11px; height: 11px; border: 1.5px solid var(--ink); border-radius: 3px; background: var(--k); }
  .leg b { margin-left: auto; font-variant-numeric: tabular-nums; }
  .big { font-family: var(--font-mono); font-size: 30px; font-weight: 800; font-variant-numeric: tabular-nums; }
  .big small { font-size: 13px; font-weight: 500; color: var(--muted); margin-left: 6px; }
  .att { position: relative; height: 110px; }
  .att svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .att .area { fill: color-mix(in oklab, var(--c5) 30%, var(--panel)); stroke: var(--ink); stroke-width: 2.5; }
  .att .mid { fill: var(--panel); stroke: var(--ink); stroke-width: 1.5; stroke-dasharray: 4 4; }
  .att .dot { fill: var(--hl); stroke: var(--ink); stroke-width: 2.5; }
  .att text { font-family: var(--font-mono); font-size: 12px; fill: var(--muted); }
  .rows { display: flex; flex-direction: column; gap: 5px; }
  .rw { display: grid; grid-template-columns: 1fr 52px 104px; gap: 8px; align-items: center; font-family: var(--font-mono); font-size: 13px; padding: 4px 8px; border: 2px solid color-mix(in oklab, var(--ink) calc(var(--on) * 100%), transparent); border-radius: 6px; background: color-mix(in oklab, var(--hl) calc(var(--on) * 70%), transparent); }
  .rw em { font-style: normal; color: var(--muted); text-align: right; font-variant-numeric: tabular-nums; }
  .rw .mi-badge { justify-self: end; font-size: 11px; padding: 2px 8px; box-shadow: 2px 2px 0 var(--ink); }
  .cmp { display: grid; grid-template-columns: 1fr 104px; gap: 14px; align-items: center; }
  .rg { display: grid; place-items: center; gap: 6px; }
  .rg .mi-ring { --size: 92px; --item: var(--c2); }
  .rg b { position: absolute; font-family: var(--font-mono); font-size: 20px; font-weight: 800; }
  .rg > div { position: relative; display: grid; place-items: center; }
  .cache { display: grid; grid-template-columns: 1fr 104px; gap: 14px; align-items: center; }
  .cells { display: grid; grid-template-columns: repeat(16, 1fr); gap: 3px; }
  .cells i { aspect-ratio: 1; border: 1.5px solid var(--ink); border-radius: 3px; background: var(--k, var(--c2)); }
  .cstat { display: flex; flex-direction: column; gap: 8px; font-family: var(--font-mono); font-size: 12px; }
  .cstat span { display: flex; align-items: center; gap: 6px; }
  .cstat span:not(.big)::before { content: ""; width: 11px; height: 11px; border: 1.5px solid var(--ink); border-radius: 3px; background: var(--k); }
  .win { display: grid; grid-template-columns: 210px 1fr 170px; gap: 14px; align-items: center; min-height: 0; flex: 1; }
  .sph { position: relative; height: 100%; min-height: 200px; }
  .sph svg { position: absolute; inset: 0; width: 100%; height: 100%; }
  .sph circle { stroke: var(--ink); stroke-width: .8; }
  .cnt { text-align: right; }
  .cnt .big { font-size: 40px; }
  .band { height: 34px; overflow: hidden; border: 2.5px solid var(--ink); border-radius: 8px; background: var(--hl); font-family: var(--font-mono); font-size: 13px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
  .band div { display: flex; width: max-content; line-height: 30px; white-space: nowrap; translate: calc(var(--phase) * -50%) 0; }
  .band span { padding: 0 22px; }
  .band span::after { content: "\25C6"; margin-left: 44px; }
</style>
<script>
window.MotionSetup = (M) => {
  const NS = "http://www.w3.org/2000/svg";
  const CAT = ["var(--c3)", "var(--c1)", "var(--c4)", "var(--c2)", "var(--c6)"];
  const BUD = [
    [8, 14, 12, 30, 9],
    [8, 14, 12, 30, 9],
    [8, 14, 8, 22, 6],
    [9, 14, 10, 22, 6],
    [9, 13, 10, 22, 6],
    [9, 13, 10, 23, 7],
  ];
  const KEEP = [0.62, 0.62, 0.48, 0.52, 0.55, 0.58];
  const strip = document.querySelector(".strip");
  const r0 = M.rng(7);
  for (let i = 0; i < 72; i++) {
    const s = document.createElement("i");
    s.style.setProperty("--k", CAT[Math.floor(r0() * 5)]);
    strip.insertBefore(s, strip.firstChild);
  }
  const cells = document.querySelector(".cells");
  const cellEls = [];
  for (let i = 0; i < 96; i++) { const c = document.createElement("i"); cells.appendChild(c); cellEls.push(c); }
  const svg = document.querySelector(".sph svg");
  const r1 = M.rng(42);
  const pts = [];
  const N = 400;
  for (let i = 0; i < N; i++) {
    const y = 1 - (2 * (i + 0.5)) / N;
    const rad = Math.sqrt(1 - y * y);
    const th = i * 2.399963 + r1() * 0.3;
    const cat = Math.min(4, Math.floor(Math.pow(r1(), 0.8) * 5));
    const c = document.createElementNS(NS, "circle");
    c.style.fill = CAT[cat];
    svg.appendChild(c);
    pts.push({ y, rad, th, c });
  }
  const segs = [...document.querySelectorAll(".bud i")];
  const legs = [...document.querySelectorAll(".leg b")];
  const used = document.querySelector("#used"), ring = document.querySelector("#ring"), keep = document.querySelector("#keep");
  const hit = document.querySelector("#hit"), kpiHit = document.querySelector("#kpihit"), cnt = document.querySelector("#cnt");
  const dot = document.querySelector(".att .dot");
  const span = M.snap(12);
  const TICKS = Math.round(span / 0.5), r2 = M.rng(99);
  const noise = Array.from({ length: 96 * TICKS }, () => r2());
  M.on((t) => {
    const u = ((t % span) + span) % span / 2;
    const s = Math.floor(u) % 6, f = M.ease.inOut(Math.min(1, (u - Math.floor(u)) / 0.6));
    const a = BUD[(s + 5) % 6], b = BUD[s];
    let tot = 0;
    segs.forEach((el, i) => { const v = a[i] + (b[i] - a[i]) * f; tot += v; el.style.width = v + "%"; legs[i].textContent = (v * 1.28).toFixed(1) + "K"; });
    used.textContent = (tot * 1.28).toFixed(1) + "K";
    const k = KEEP[(s + 5) % 6] + (KEEP[s] - KEEP[(s + 5) % 6]) * f;
    ring.style.setProperty("--value", k.toFixed(3));
    keep.textContent = Math.round(k * 100) + "%";
    const tick = Math.floor(t / 0.5) % Math.round(span / 0.5);
    let h = 0;
    cellEls.forEach((c, i) => {
      const r = noise[tick * 96 + i], col = i % 16;
      const st = col < 10 ? (r < 0.03 ? 2 : 0) : r < 0.3 ? 1 : r < 0.4 ? 2 : 0;
      if (!st) h++;
      c.style.setProperty("--k", st === 0 ? "var(--c2)" : st === 1 ? "var(--c5)" : "var(--hl)");
    });
    hit.textContent = kpiHit.textContent = Math.round((h / 96) * 100) + "%";
    const ph = (t % span) / span;
    const x = 20 + ph * 360;
    const n = (x - 200) / 180;
    dot.setAttribute("cx", x.toFixed(1));
    dot.setAttribute("cy", (92 - (0.25 + 0.75 * n * n) * 72).toFixed(1));
    const W = svg.clientWidth, H = svg.clientHeight, R = Math.min(W, H) * 0.46, cx = W / 2, cy = H / 2;
    const rot = (t / M.duration) * Math.PI * 2;
    pts.forEach((p) => {
      const ang = p.th + rot;
      const z = Math.sin(ang) * p.rad;
      p.c.setAttribute("cx", (cx + Math.cos(ang) * p.rad * R).toFixed(1));
      p.c.setAttribute("cy", (cy - p.y * R * 0.96 + z * R * 0.12).toFixed(1));
      p.c.setAttribute("r", (2.2 + (z + 1) * 1.6).toFixed(2));
      p.c.style.opacity = (0.35 + (z + 1) * 0.325).toFixed(2);
    });
    cnt.textContent = Math.round(tot * 1280).toLocaleString("en-US");
  });
};
</script>
</head>
<body data-canvas="1200x1500" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="2.8">
<main class="mi-page">
  <div class="mi-top"><span class="mi-crumb">Context engineering / field guide</span><span class="mi-meta">move <span data-counter="move">01</span> / 06</span></div>
  <header class="hd">
    <div>
      <h1 class="mi-title">Context <em>assembly</em></h1>
      <div class="tag">every token in the window is there on purpose, or it takes a seat something better needed</div>
    </div>
    <div class="kpis">
      <div class="kpi"><div class="mi-label">Window</div><b>128K</b></div>
      <div class="kpi" style="--item:var(--c3)"><div class="mi-label">Used</div><b id="used">78.1K</b></div>
      <div class="kpi" style="--item:var(--c2)"><div class="mi-label">Cache hit</div><b id="kpihit">80%</b></div>
      <div class="kpi"><div class="mi-label">Turns</div><b data-ticker="1352" data-jitter="6">1352</b></div>
    </div>
  </header>

  <section class="grid mi-body" data-cycle="move" data-step="2" data-sfx="blip" data-master>
    <div class="mi-card p wide">
      <div class="ph"><h3><i>1</i>Six moves that build one context</h3><span class="mi-label">same order on every call</span></div>
      <div class="moves">
        <div class="mv" style="--item:var(--hl)" data-item><b>SELECT</b><span>pick what is relevant</span></div>
        <div class="mv" style="--item:var(--c5)" data-item><b>ORDER</b><span>key facts at the edges</span></div>
        <div class="mv" style="--item:var(--c2)" data-item><b>COMPRESS</b><span>summarise old turns</span></div>
        <div class="mv" style="--item:var(--c1)" data-item><b>PIN</b><span>rules never move</span></div>
        <div class="mv" style="--item:var(--c6)" data-item><b>CACHE</b><span>stable prefix first</span></div>
        <div class="mv" style="--item:var(--c3)" data-item><b>SEND</b><span>one call, one window</span></div>
      </div>
      <div class="strip"><i class="mk" data-phase="12"></i></div>
      <div class="ends"><span>raw candidates · 212K tok</span><span>sent · 78K tok</span></div>
    </div>

    <div class="mi-card p">
      <div class="ph"><h3><i>2</i>The window budget</h3><span class="mi-label">tokens by source</span></div>
      <div class="bud"><i style="--k:var(--c3)"></i><i style="--k:var(--c1)"></i><i style="--k:var(--c4)"></i><i style="--k:var(--c2)"></i><i style="--k:var(--c6)"></i></div>
      <div class="leg">
        <span style="--k:var(--c3)">system<b>10.2K</b></span>
        <span style="--k:var(--c1)">tools<b>17.9K</b></span>
        <span style="--k:var(--c4)">memory<b>15.4K</b></span>
        <span style="--k:var(--c2)">retrieved<b>38.4K</b></span>
        <span style="--k:var(--c6)">scratch<b>11.5K</b></span>
      </div>
    </div>

    <div class="mi-card p">
      <div class="ph"><h3><i>3</i>Where attention lands</h3><span class="mi-label">recall by position</span></div>
      <div class="att">
        <svg viewBox="0 0 400 110" preserveAspectRatio="none">
          <path class="mid" d="M140 104 V10 M260 104 V10"></path>
          <path class="area" d="M20 104 L20 20 C80 60 130 86 200 86 C270 86 320 60 380 20 L380 104 Z"></path>
          <circle class="dot" r="7" cx="20" cy="20"></circle>
          <text x="152" y="24">lost in the middle</text>
        </svg>
      </div>
      <div class="ends"><span>start of window</span><span>end of window</span></div>
    </div>

    <div class="mi-card p">
      <div class="ph"><h3><i>4</i>What survives compaction</h3><span class="mi-label">6 blocks in</span></div>
      <div class="cmp">
        <div class="rows" data-cycle="row" data-step="1">
          <div class="rw" data-item><span>task brief</span><em>1.2K</em><span class="mi-badge" style="--item:var(--c2)">kept</span></div>
          <div class="rw" data-item><span>open file slices</span><em>9.4K</em><span class="mi-badge" style="--item:var(--c2)">kept</span></div>
          <div class="rw" data-item><span>old tool output</span><em>14.0K</em><span class="mi-badge" style="--item:var(--hl)">summarised</span></div>
          <div class="rw" data-item><span>error trace</span><em>2.1K</em><span class="mi-badge" style="--item:var(--c2)">kept</span></div>
          <div class="rw" data-item><span>chit-chat turns</span><em>3.3K</em><span class="mi-badge" style="--item:var(--c5)">dropped</span></div>
          <div class="rw" data-item><span>stale plan v1</span><em>1.8K</em><span class="mi-badge" style="--item:var(--c5)">dropped</span></div>
        </div>
        <div class="rg"><div><div class="mi-ring" id="ring"></div><b id="keep">62%</b></div><span class="mi-label">kept</span></div>
      </div>
    </div>

    <div class="mi-card p">
      <div class="ph"><h3><i>5</i>The prefix cache</h3><span class="mi-label">96 blocks</span></div>
      <div class="cache">
        <div class="cells"></div>
        <div class="cstat">
          <span class="big" id="hit" style="font-size:30px">80%</span>
          <span style="--k:var(--c2)">hit</span>
          <span style="--k:var(--c5)">miss</span>
          <span style="--k:var(--hl)">stale</span>
        </div>
      </div>
    </div>

    <div class="mi-card p wide">
      <div class="ph"><h3><i>6</i>The window itself: every token that made the cut</h3><span class="mi-label">one dot ≈ 200 tokens</span></div>
      <div class="win">
        <div class="leg" style="grid-template-columns:1fr;gap:8px;font-size:13px">
          <span style="--k:var(--c3)">system</span><span style="--k:var(--c1)">tools</span><span style="--k:var(--c4)">memory</span><span style="--k:var(--c2)">retrieved</span><span style="--k:var(--c6)">scratch</span>
        </div>
        <div class="sph"><svg></svg></div>
        <div class="cnt"><div class="mi-label">tokens in window</div><div class="big" id="cnt">78,080</div><div class="mi-label" style="margin-top:8px">of 128,000</div></div>
      </div>
    </div>
  </section>

  <div class="band"><div data-phase="12"><span>if you cannot say why a token is there, it should not be there</span><span>stable prefix first, volatile tail last</span><span>summaries keep a pointer to what they replaced</span><span>the middle of the window is for bulk, not for rules</span><span>if you cannot say why a token is there, it should not be there</span><span>stable prefix first, volatile tail last</span><span>summaries keep a pointer to what they replaced</span><span>the middle of the window is for bulk, not for rules</span></div></div>
  <footer class="mi-foot"><span>Four rules of the window</span><span class="path">select &gt; order &gt; compress &gt; send</span><span class="mark">context notes</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Moves**: 4-6 chips. Keep moves × step = 12 s (4 moves → step 3) and give `BUD` / `KEEP` one row per move.
  The nested `row` cycle must divide 12 s (6 rows × 1 s, 4 rows × 1.5 s, 3 rows × 2 s).
- **Categories**: 5 budget colours are shared by the bar, legend, strip and sphere through `CAT`; change all three
  places together. Keep each `BUD` row under 100 % (the empty tail is free window).
- **Cache**: change the column split (`col < 10`) and the miss / stale thresholds to tell a better or worse cache
  story; keep 0.5 s ticks and `TICKS = 12 s / 0.5 s` so it loops.
- **Sphere density**: 300-500 dots; above that, rendering 30 fps gets slow. Fewer, larger dots read better in GIFs.
- **Other styles**: works with any style that defines `--hl` or accepts the fallback yellow; dark styles need
  `.sph circle` stroke set to the panel colour. Tested with `cream-brutal`.
- **Pitfalls**: do not use `data-count` for the KPIs (it resets per step); a hash function with poor mixing makes the
  cache grid look striped, so keep the seeded noise table.
