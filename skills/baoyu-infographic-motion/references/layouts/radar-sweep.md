# radar-sweep

A radar (spider) chart that compares 3-5 profiles on the same 5-6 axes: the filled polygon morphs from one profile
to the next each step, a scanner wedge sweeps round and lights the axis it passes, and a value table beside the
chart ticks to the live numbers. A row of small supporting cards (mini line chart, ring, diamond, fork) sits below.

## Use when / Avoid when

- **Use when**: scoring options on the same criteria ("which product shape", "how four models compare"), skill or
  capability profiles, before / after assessments, any "shape tells the story" comparison with 5-6 criteria.
- **Avoid when**: there are fewer than 5 or more than 7 axes (the polygon stops reading as a shape), values are not
  on one common scale (normalise first), or items need long descriptions (use `comparison-matrix`).

## Structure

Canvas `portrait` 1080×1350. Standard header without `.mi-sub`: `.mi-top` (crumb + profile counter), `.mi-title`
with `<em>`, a `.lead` paragraph and a `.chips` row that is the master cycle (one chip per profile).

- **Main card** `.main` (grid `520px 1fr`): heading row, `.radar` (520×520 box with SVG `#rd` built in
  `MotionSetup`: 5 grid rings, axis lines, sweep wedge, profile polygon, vertex dots, axis labels) with a `.pname`
  pill in the centre (`.mi-swap` per profile), and `.tbl` (one `.tr` per axis: name + small hint, `.mi-bar`, value).
- **Cards** `.cards`: 4 small `.mi-card`s that fill the rest of the page: a two-line mini chart with packets, a
  `.mi-ring` gauge with a ticker, a risk diamond, a fork with packets on both branches.
- **Footer**.

## Motion recipe

- **Master cycle** `prof` on `.chips`: 4 profiles × `data-step="3"` = 12 s, `data-cycles="2"` (24 s),
  `data-sfx="blip"`, `data-accent` with `data-color` per chip, so the polygon, sweep, bars and title colour follow
  the active profile. The centre pill swaps with `.mi-swap` (`data-item="prof"`).
- **Morph** (custom JS, clock-driven): during the step the polygon holds profile `i`; in the last `MORPH = 0.9 s`
  it eases to profile `i + 1`. So frame 0 shows profile 1 complete, and the last frame arrives back at profile 1:
  the loop is seamless. Vertex dots and table values/bars use the same interpolated numbers.
- **Sweep**: the wedge turns once every `SPIN = 6 s` (divides the 12 s master period). Each axis gets
  `--lit` = 1 when the wedge's middle passes it, fading over ±40°. `--lit` tints the axis label, the table row and
  grows the vertex dot.
- **Cards**: `data-packets` on the mini-chart and fork paths (period 3 s), `data-bar` + `data-jitter` on the ring,
  `data-ticker` on its %, `data-pulse` on the diamond centre.
- **Sound**: `blip` per profile (8 cues in 24 s).
- **Poster**: `data-poster="2"` (profile 1, sweep between axes).

## Skeleton

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Score An Idea Before You Build It</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-page { gap: 18px; }
  .lead { font-size: 17px; line-height: 1.5; color: var(--muted); max-width: 880px; }
  .chips { display: flex; gap: 10px; flex-wrap: wrap; }
  .chips .mi-chip { background: color-mix(in oklab, var(--item) calc(var(--on, 0) * 16%), transparent); font-weight: 600; }
  .main { display: grid; grid-template-columns: 520px 1fr; gap: 22px; padding: 24px 24px 30px; }
  .main .hd { grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: baseline; }
  .main h3 { font-size: 24px; }
  .radar { position: relative; width: 520px; height: 520px; }
  .radar svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .rg { fill: none; stroke: var(--line); stroke-width: 1; }
  .ax { stroke: var(--line); stroke-width: 1; }
  .al { font-family: var(--font-mono); font-size: 14px; font-weight: 600; fill: color-mix(in oklab, var(--accent) calc(var(--lit, 0) * 100%), var(--muted)); }
  .sweep { fill: url(#sw); }
  .poly { fill: color-mix(in oklab, var(--accent) 16%, transparent); stroke: var(--accent); stroke-width: 2.5; stroke-linejoin: round; }
  .vx { fill: var(--panel); stroke: var(--accent); stroke-width: 2.5; }
  .pname { position: absolute; left: 50%; top: 50%; translate: -50% -50%; width: 150px; height: 44px; }
  .pname .mi-swap { display: grid; place-items: center; font-family: var(--font-mono); font-size: 13px; font-weight: 700; color: var(--item); background: var(--panel); border: 1.5px solid var(--item); border-radius: 999px; }
  .tbl { display: flex; flex-direction: column; gap: 8px; align-self: center; }
  .tr { display: grid; grid-template-columns: 1fr 120px 44px; gap: 12px; align-items: center; height: 52px; padding: 0 14px; border-radius: 10px;
    background: color-mix(in oklab, var(--accent) calc(var(--lit, 0) * 14%), var(--panel2)); }
  .tr b { font-size: 16px; }
  .tr small { display: block; font-size: 12px; color: var(--muted); font-weight: 400; }
  .tr .mi-bar { height: 8px; }
  .tr .mi-bar > i { background: var(--accent); }
  .tr span { font-family: var(--font-mono); font-size: 16px; font-weight: 600; text-align: right; font-variant-numeric: tabular-nums; }
  .cards { flex: 1; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .cards .mi-card { padding: 18px; display: flex; flex-direction: column; gap: 10px; }
  .cards h4 { font-size: 17px; font-weight: 700; }
  .cards svg { width: 100%; flex: 1; overflow: visible; }
  .ln { fill: none; stroke-width: 2.5; stroke-linecap: round; }
  .ring-wrap { flex: 1; display: grid; place-items: center; position: relative; }
  .ring-wrap .mi-ring { --size: 140px; }
  .ring-wrap b { position: absolute; font-family: var(--font-mono); font-size: 22px; }
  .rh { fill: color-mix(in oklab, var(--c3) 18%, transparent); stroke: var(--c3); stroke-width: 2; }
  .note { font-size: 13px; color: var(--muted); }
</style>
<script>
window.MotionSetup = (M) => {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.querySelector("#rd");
  const C = 260, R = 190, N = 6, STEP = 3, SPIN = 6, MORPH = 0.9;
  const axes = ["Demand", "Build cost", "Reach", "Retention", "Margin", "Moat"];
  const prof = [
    [80, 85, 30, 40, 35, 20],
    [60, 55, 70, 65, 80, 45],
    [45, 60, 90, 55, 25, 70],
    [75, 40, 55, 85, 70, 60],
  ];
  const ang = (k) => (-90 + k * 360 / N) * Math.PI / 180;
  const pt = (k, r) => [C + Math.cos(ang(k)) * r, C + Math.sin(ang(k)) * r];
  const el = (n, a) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); svg.appendChild(e); return e; };
  for (let g = 1; g <= 5; g++) el("polygon", { class: "rg", points: axes.map((_, k) => pt(k, R * g / 5).join(",")).join(" ") });
  axes.forEach((_, k) => { const [x, y] = pt(k, R); el("line", { class: "ax", x1: C, y1: C, x2: x, y2: y }); });
  const sweep = el("path", { class: "sweep", d: `M${C},${C} L${C},${C - R} A${R},${R} 0 0,1 ${pt(0.7, R).join(",")} Z` });
  const poly = el("polygon", { class: "poly" });
  const vx = axes.map(() => el("circle", { class: "vx", r: 6 }));
  const lab = axes.map((a, k) => { const [x, y] = pt(k, R + 30); const t = el("text", { class: "al", x, y: y + 5, "text-anchor": Math.abs(x - C) < 5 ? "middle" : x > C ? "start" : "end" }); t.textContent = a; return t; });
  const rows = [...document.querySelectorAll(".tr")];
  const ease = M.ease.inOut;
  M.on((t) => {
    const i = Math.floor(t / STEP) % prof.length;
    const e = ease(Math.max(0, 1 - (STEP - t % STEP) / MORPH));
    const a = prof[i], b = prof[(i + 1) % prof.length];
    const v = a.map((x, k) => x + (b[k] - x) * e);
    const pts = v.map((x, k) => pt(k, R * x / 100));
    poly.setAttribute("points", pts.map((q) => q.join(",")).join(" "));
    pts.forEach((q, k) => { vx[k].setAttribute("cx", q[0]); vx[k].setAttribute("cy", q[1]); });
    const sw = ((t % SPIN) / SPIN) * 360;
    sweep.setAttribute("transform", `rotate(${sw} ${C} ${C})`);
    axes.forEach((_, k) => {
      let d = (sw + 25 - k * 360 / N + 720) % 360;
      if (d > 180) d -= 360;
      const lit = Math.max(0, 1 - Math.abs(d) / 40);
      lab[k].style.setProperty("--lit", lit.toFixed(3));
      vx[k].setAttribute("r", (6 + lit * 4).toFixed(2));
      rows[k].style.setProperty("--lit", lit.toFixed(3));
      rows[k].querySelector("span").textContent = Math.round(v[k]);
      rows[k].querySelector(".mi-bar > i").style.setProperty("--value", (v[k] / 100).toFixed(3));
    });
  });
};
</script>
</head>
<body data-canvas="portrait" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="2">
<main class="mi-page">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">Idea triage / six axes</span><span class="mi-meta">Profile <span data-counter="prof">01</span> / 04</span></div>
    <h1 class="mi-title">Score an idea <em>before you build it</em></h1>
    <p class="lead">The same six questions for every idea. Four shapes of product, one chart: a big shape is not the goal, a shape with no hole is.</p>
    <div class="chips" data-cycle="prof" data-step="3" data-sfx="blip" data-accent data-master>
      <span class="mi-chip" style="--item:var(--c1)" data-item data-color="var(--c1)">01 internal script</span>
      <span class="mi-chip" style="--item:var(--c2)" data-item data-color="var(--c2)">02 paid plugin</span>
      <span class="mi-chip" style="--item:var(--c3)" data-item data-color="var(--c3)">03 open-source lib</span>
      <span class="mi-chip" style="--item:var(--c4)" data-item data-color="var(--c4)">04 hosted API</span>
    </div>
  </header>

  <section class="mi-body" style="display:flex;flex-direction:column;gap:16px">
    <div class="mi-card main">
      <div class="hd"><h3>Six axes, one shape</h3><span class="mi-label">score 0-100 &middot; sweep reads one axis at a time</span></div>
      <div class="radar">
        <svg id="rd" viewBox="0 0 520 520"><defs><radialGradient id="sw" cx="260" cy="260" r="190" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="var(--accent)" stop-opacity="0"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0.28"/></radialGradient></defs></svg>
        <div class="pname mi-swap-host">
          <div class="mi-swap" style="--item:var(--c1)" data-item="prof" data-index="0">internal script</div>
          <div class="mi-swap" style="--item:var(--c2)" data-item="prof" data-index="1">paid plugin</div>
          <div class="mi-swap" style="--item:var(--c3)" data-item="prof" data-index="2">open-source lib</div>
          <div class="mi-swap" style="--item:var(--c4)" data-item="prof" data-index="3">hosted API</div>
        </div>
      </div>
      <div class="tbl">
        <div class="tr"><b>Demand<small>who asks for it</small></b><div class="mi-bar"><i></i></div><span>0</span></div>
        <div class="tr"><b>Build cost<small>weeks to v1</small></b><div class="mi-bar"><i></i></div><span>0</span></div>
        <div class="tr"><b>Reach<small>how it gets found</small></b><div class="mi-bar"><i></i></div><span>0</span></div>
        <div class="tr"><b>Retention<small>used again next week</small></b><div class="mi-bar"><i></i></div><span>0</span></div>
        <div class="tr"><b>Margin<small>left after running it</small></b><div class="mi-bar"><i></i></div><span>0</span></div>
        <div class="tr"><b>Moat<small>hard to copy</small></b><div class="mi-bar"><i></i></div><span>0</span></div>
      </div>
    </div>

    <div class="cards">
      <div class="mi-card"><h4>Build, sell, repeat</h4>
        <svg viewBox="0 0 200 110">
          <path class="ln" style="stroke:var(--c1)" d="M6,90 C50,40 90,30 194,24" data-packets="1" data-period="3" data-r="4"></path>
          <path class="ln" style="stroke:var(--c6)" d="M6,30 C60,40 110,70 194,86" data-packets="1" data-period="3" data-phase-offset="0.5" data-r="4"></path>
        </svg>
        <div class="note">cost to repeat falls, cost to sell rises</div></div>
      <div class="mi-card"><h4>Kept after month 1</h4>
        <div class="ring-wrap"><div class="mi-ring" style="--item:var(--c4)" data-bar="0.8" data-jitter="0.04"></div><b data-ticker="80" data-jitter="3" data-suffix="%">80%</b></div></div>
      <div class="mi-card"><h4>Risk diamond</h4>
        <svg viewBox="0 0 200 110"><polygon class="rh" points="100,8 170,55 100,102 30,55"></polygon><circle cx="100" cy="55" r="5" fill="var(--c3)" data-pulse="1.5"></circle></svg>
        <div class="note">tech &middot; market &middot; legal &middot; time</div></div>
      <div class="mi-card"><h4>Where it forks</h4>
        <svg viewBox="0 0 200 110">
          <path class="ln" style="stroke:var(--line)" d="M6,55 L70,55"></path>
          <path class="ln" style="stroke:var(--c4)" d="M70,55 C110,55 120,20 194,20" data-packets="1" data-period="3" data-r="4"></path>
          <path class="ln" style="stroke:var(--c6)" d="M70,55 C110,55 120,90 194,90" data-packets="1" data-period="3" data-phase-offset="0.5" data-r="4"></path>
          <circle cx="70" cy="55" r="7" fill="var(--panel)" stroke="var(--ink)" stroke-width="2"></circle>
        </svg>
        <div class="note">ship small &middot; or drop it</div></div>
    </div>
  </section>
  <footer class="mi-foot"><span>Illustrative scores</span><span class="path">demand &gt; cost &gt; reach &gt; keep</span><span class="mark">radar-sweep</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Axes**: 5-7. Edit `axes` and the `.tr` rows together (same order); the SVG geometry follows `N = axes.length`
  if you change `N` to match. Axis 0 points up; labels anchor left/right/middle automatically.
- **Profiles**: 3-5. One row in `prof` (values 0-100, same order as `axes`), one chip with `data-color`, one
  `.mi-swap` pill. Keep profiles × step between 12 and 30 s and `SPIN` a divisor of the master period.
- **Single profile, before / after**: use 2 profiles with `data-step="4"` and `MORPH = 1.5` for a slow breathe.
- **Cards**: 2-4. Delete cards freely; the grid is `repeat(4, 1fr)`, so change the count with it.
- **Styles**: tested with `pastel-schematic` (light) and `telemetry-sim` (dark). The polygon uses `--accent`, so any
  style with distinct `--c1`…`--c4` works; for a monochrome style (`white-paper`) drop `data-accent` and tell the
  profiles apart by the pill text.
- **Pitfalls**: do not use `data-spin` on the wedge, because it overwrites `transform` on an SVG element whose
  rotation centre must be the chart centre; rotate it in `M.on` as the skeleton does. Keep the radar box at a fixed
  size, because the SVG is built once in `MotionSetup`.
