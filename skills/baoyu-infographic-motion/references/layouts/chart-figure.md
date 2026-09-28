# chart-figure

An animated multi-panel science figure: a big uppercase headline, a one-line kicker and a caveat, then panel **a**
(a small schematic of the loop being studied, with coloured tag labels) and panels **b** and **c** (two settings of
the same experiment, each a pair of charts). The left chart overlays one distribution per generation; the right
chart draws one line with a confidence band per run. A generation rail steps 1 → 6 and both charts build up to it.

## Use when / Avoid when

- **Use when**: explaining a research result or an experiment (A/B settings, ablations, "with vs without X"),
  anything where the story is "the distribution shifts each round" or "the metric decays over rounds", paper
  explainers, model or system behaviour over iterations.
- **Avoid when**: the numbers are live KPIs (use `live-dashboard`), there is only one chart (use `paper-page`),
  or the data is categorical with no time / round axis (use `comparison-matrix` or `ranked-leaderboard`).

## Structure

Canvas `paper` 1200×1600 (export `--scale 1.5` for 1800×2400). No `.mi-body` flex area: three `.panel` sections;
panels b and c use `.grow` so they share the space below panel a.

- **Header**: `.mi-top` (kicker + `GENERATION n / 6` counter), `.hl` headline with one `<em>` phrase, `.lede`
  (uppercase one-liner), `.cav` (italic caveat: say the data is synthetic or where it comes from), `.mi-rule`.
- **Panel a** `.flow` (grid `1fr 250px`): `.stage` with absolutely placed boxes (`.bx`, dashed ellipse `.bx.d` for
  data, dimmed `.dim` for "…n"), straight `.mi-edge` links with packets, one hand-drawn loop-back arc, small `.lb`
  labels; `.tags` column (4 coloured `<i>` tags + text). Under it the generation `.rail` (the master cycle).
- **Panels b / c** `.pair`: two `<svg viewBox="0 0 480 280">`. `data-hist="drift,narrow"` draws the distribution
  chart, `data-line="drop"` draws the run chart. Axes, ticks, legend and data are all built in `MotionSetup`.
- **Footer**: data note + wordmark.

## Motion recipe

- **Master cycle** `gen` on `.rail`: 6 items × `data-step="2"` = 12 s, `data-cycles="2"` (24 s), `data-sfx="tick"`,
  `data-accent`. `data-offset="-11"` starts the video in the last step, so **frame 0 shows the finished figure**
  (all 6 generations, full lines) and the last frame matches it; the build restarts 1 s in.
- **Distribution chart**: one closed area path per generation (seeded `M.rng`). Generations before the active one
  are full; the active one grows from the baseline (`scale(1, s)` about the axis, ease-out over 60 % of the step)
  and is a little more opaque; later ones are hidden. Legend rows light up to the active generation, the active
  row is bold.
- **Run chart**: bands + lines sit in a `clipPath`; the clip width follows `prog = g - 1 + ease(p)` rounds, so lines
  draw left → right one round per step. Markers pop (radius 0 → 4.5) as the clip passes them.
- **Panel a**: packets on each link (period 2 s, staggered `data-phase-offset`), one slow packet on the loop arc.
- **Custom JS** (`MotionSetup`): builds all charts once, then `M.on(t)` computes the generation and step progress
  from `t` with the same offset and step as the rail (keep `G`, `STEP`, `OFF` equal to the rail attributes).
- **Sound**: `tick` per generation (12 cues in 24 s).
- **Poster**: `data-poster="10.8"` (generation 6, full figure).

## Skeleton

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>The Feedback Loop Trap</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-page { gap: 14px; }
  .kick { font-family: var(--font-mono); font-size: 13px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
  .hl { font-family: var(--font-display); font-weight: 800; font-size: 60px; line-height: 1.02; text-transform: uppercase; letter-spacing: -.01em; }
  .hl em { font-style: normal; color: var(--accent); }
  .lede { font-family: var(--font-display); font-weight: 700; font-size: 21px; text-transform: uppercase; margin-top: 6px; }
  .cav { font-family: var(--font-body); font-size: 14px; color: var(--muted); font-style: italic; }
  .mi-rule { margin-top: 4px; }
  .panel { display: flex; flex-direction: column; gap: 6px; }
  .panel.grow { flex: 1; min-height: 0; justify-content: center; }
  .ph { display: flex; align-items: baseline; gap: 14px; font-family: var(--font-body); font-size: 15px; }
  .ph b { font-family: var(--font-display); font-size: 22px; font-weight: 800; }
  .ph span { color: var(--muted); }
  .flow { display: grid; grid-template-columns: 1fr 250px; gap: 22px; align-items: center; }
  .stage { position: relative; height: 150px; }
  .bx { position: absolute; top: 56px; width: 96px; height: 38px; display: grid; place-items: center; border: 1.5px solid var(--ink); background: var(--panel); font-family: var(--font-mono); font-size: 13px; border-radius: 4px; }
  .bx.d { border-style: dashed; border-radius: 50%; width: 76px; }
  .bx.dim { opacity: .55; }
  .lb { position: absolute; font-family: var(--font-body); font-size: 12px; color: var(--muted); white-space: nowrap; }
  .tags { display: flex; flex-direction: column; gap: 8px; }
  .tag { display: flex; align-items: center; gap: 8px; font-family: var(--font-body); font-size: 13px; }
  .tag i { font-style: normal; font-family: var(--font-mono); font-size: 12px; padding: 2px 8px; color: #fff; background: var(--item); border-radius: 3px; white-space: nowrap; }
  .rail { display: flex; gap: 10px; align-items: center; font-family: var(--font-mono); font-size: 13px; }
  .rail .k { color: var(--muted); margin-right: 4px; }
  .rail div { padding: 4px 12px; border: 1px solid var(--line); border-radius: 999px;
    background: color-mix(in oklab, var(--item) calc(var(--on) * 100%), transparent);
    color: color-mix(in oklab, #fff calc(var(--on) * 100%), var(--ink));
    border-color: color-mix(in oklab, var(--item) calc(max(var(--on), var(--done)) * 100%), var(--line)); }
  .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 26px; }
  .pair svg { width: 100%; height: auto; display: block; overflow: visible; }
  .ax { font-family: var(--font-mono); font-size: 12px; fill: var(--muted); }
  .at { font-family: var(--font-body); font-size: 13px; fill: var(--ink); }
  .axl { stroke: var(--ink); stroke-width: 1; }
  .grd { stroke: var(--line); stroke-width: .75; stroke-dasharray: 2 4; }
  .hist path { stroke-width: 1.2; }
  .lg text { font-family: var(--font-mono); font-size: 12px; fill: var(--ink); }
  .band { stroke: none; }
  .run { fill: none; stroke-width: 2; }
  .mk { stroke: var(--panel); stroke-width: 1.5; }
  .src { font-family: var(--font-body); font-size: 12px; color: var(--muted); }
</style>
<script>
window.MotionSetup = (M) => {
  const NS = "http://www.w3.org/2000/svg";
  const G = 6, STEP = 2, OFF = -11;
  const cols = ["var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)", "var(--c5)", "var(--c6)"];
  const el = (tag, at, p) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (p) p.appendChild(e); return e; };
  const W = 480, H = 280, L = 52, R = 14, T = 26, B = 42, PW = W - L - R, PH = H - T - B;
  const axes = (svg, title, xl, yl, xt, yt, ymin, ymax) => {
    el("text", { x: L + PW / 2, y: 12, "text-anchor": "middle", class: "at" }, svg).textContent = title;
    yt.forEach((v) => {
      const y = T + PH - ((v - ymin) / (ymax - ymin)) * PH;
      el("line", { x1: L, x2: L + PW, y1: y, y2: y, class: "grd" }, svg);
      el("text", { x: L - 8, y: y + 4, "text-anchor": "end", class: "ax" }, svg).textContent = v;
    });
    xt.forEach(([f, s]) => el("text", { x: L + f * PW, y: T + PH + 18, "text-anchor": "middle", class: "ax" }, svg).textContent = s);
    el("line", { x1: L, x2: L, y1: T, y2: T + PH, class: "axl" }, svg);
    el("line", { x1: L, x2: L + PW, y1: T + PH, y2: T + PH, class: "axl" }, svg);
    el("text", { x: L + PW / 2, y: H - 4, "text-anchor": "middle", class: "at" }, svg).textContent = xl;
    const t = el("text", { x: 14, y: T + PH / 2, "text-anchor": "middle", class: "at", transform: `rotate(-90 14 ${T + PH / 2})` }, svg);
    t.textContent = yl;
  };
  const hists = [], lines = [];
  document.querySelectorAll("[data-hist]").forEach((svg, si) => {
    const r = M.rng(31 + si * 7), [drift, narrow] = svg.dataset.hist.split(",").map(Number);
    axes(svg, "Item popularity in the logs, by generation", "Popularity rank (log scale)", "Share of clicks", [[0, "1"], [.5, "10²"], [1, "10⁴"]], [0, .2, .4, .6], 0, .6);
    const g = el("g", { class: "hist" }, svg), base = T + PH, paths = [];
    for (let k = 0; k < G; k++) {
      const mu = .5 - drift * k, sd = .2 - narrow * k, pk = .12 + .075 * k * (narrow / .024);
      let d = `M${L},${base}`;
      for (let i = 0; i <= 60; i++) {
        const x = i / 60, y = pk * Math.exp(-((x - mu) ** 2) / (2 * sd * sd)) * (1 + (r() - .5) * .12);
        d += ` L${(L + x * PW).toFixed(1)},${(base - Math.min(y, .6) / .6 * PH).toFixed(1)}`;
      }
      d += ` L${L + PW},${base} Z`;
      paths.push(el("path", { d, fill: cols[k], "fill-opacity": .28, stroke: cols[k] }, g));
    }
    const lg = el("g", { class: "lg" }, svg), items = [];
    for (let k = 0; k < G; k++) {
      const row = el("g", { transform: `translate(${L + PW - 108},${T + 6 + k * 17})` }, lg);
      el("rect", { width: 18, height: 10, y: -9, fill: cols[k], "fill-opacity": .5, stroke: cols[k] }, row);
      el("text", { x: 26 }, row).textContent = "Generation " + (k + 1);
      items.push(row);
    }
    hists.push({ paths, items, base });
  });
  document.querySelectorAll("[data-line]").forEach((svg, si) => {
    const r = M.rng(71 + si * 13), drop = Number(svg.dataset.line);
    axes(svg, "Catalogue still recommended", "Retrained on logs from generation", "Coverage (%)", [0, 1, 2, 3, 4, 5].map((v) => [v / 5, v === 0 ? "Real" : String(v)]), [40, 60, 80, 100], 30, 100);
    const X = (v) => L + (v / 5) * PW, Y = (v) => T + PH - ((v - 30) / 70) * PH;
    const clipId = "cl" + si, clip = el("clipPath", { id: clipId }, el("defs", {}, svg));
    const cr = el("rect", { x: L - 6, y: 0, width: 0, height: H }, clip);
    const g = el("g", { "clip-path": `url(#${clipId})` }, svg), marks = [];
    for (let j = 0; j < 3; j++) {
      const v = [0, 1, 2, 3, 4, 5].map((x) => 97 - drop * x * (1 - x * .06) - j * 2.2 * x * (drop > 5 ? 1 : .4) + (r() - .5) * 2);
      const w = v.map((_, x) => 1.5 + x * (drop > 5 ? 1.6 : .8));
      const up = v.map((y, x) => `${X(x)},${Y(y + w[x])}`), dn = v.map((y, x) => `${X(x)},${Y(y - w[x])}`).reverse();
      el("polygon", { points: up.concat(dn).join(" "), class: "band", fill: cols[j * 2], "fill-opacity": .18 }, g);
      el("polyline", { points: v.map((y, x) => `${X(x)},${Y(y)}`).join(" "), class: "run", stroke: cols[j * 2], "stroke-dasharray": ["", "6 4", "2 3"][j] }, g);
      v.forEach((y, x) => marks.push({ x, e: el("circle", { cx: X(x), cy: Y(y), r: 4.5, class: "mk", fill: cols[j * 2] }, svg) }));
    }
    const lg = el("g", { class: "lg" }, svg);
    ["Run 1", "Run 2", "Run 3"].forEach((s, j) => {
      const row = el("g", { transform: `translate(${L + PW - 70},${T + 6 + j * 17})` }, lg);
      el("line", { x1: 0, x2: 18, y1: -4, y2: -4, stroke: cols[j * 2], "stroke-width": 2, "stroke-dasharray": ["", "6 4", "2 3"][j] }, row);
      el("text", { x: 26 }, row).textContent = s;
    });
    lines.push({ cr, marks, X });
  });
  const ease = (v) => 1 - (1 - v) ** 3, cl = (v) => Math.max(0, Math.min(1, v));
  M.on((t) => {
    const loc = ((t - OFF) % (G * STEP) + G * STEP) % (G * STEP), g = Math.floor(loc / STEP), p = (loc % STEP) / STEP, e = ease(cl(p / .6));
    hists.forEach((h) => {
      h.paths.forEach((pa, k) => {
        const s = k < g ? 1 : k === g ? e : 0;
        pa.setAttribute("transform", `translate(0 ${h.base * (1 - s)}) scale(1 ${s})`);
        pa.setAttribute("fill-opacity", k === g ? .42 : .22);
      });
      h.items.forEach((it, k) => { it.style.opacity = k <= g ? 1 : .3; it.style.fontWeight = k === g ? 700 : 400; });
    });
    const prog = Math.max(0, Math.min(5, g - 1 + e));
    lines.forEach((l) => {
      l.cr.setAttribute("width", l.X(prog) - l.X(0) + 12);
      l.marks.forEach((m) => {
        const s = cl((prog - m.x) * 4 + 1);
        m.e.setAttribute("r", (4.5 * ease(s)).toFixed(2));
      });
    });
  });
};
</script>
</head>
<body data-canvas="paper" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="10.8">
<main class="mi-page">
  <header class="mi-head">
    <div class="mi-top"><span class="kick">Feedback loops / research explained</span><span class="mi-meta">GENERATION <span data-counter="gen" data-pad="1">1</span> / 6</span></div>
    <h1 class="hl">Recommenders, meet<br>the <em>feedback loop</em> trap</h1>
    <div class="lede">Train on your own clicks. Inherit your own taste.</div>
    <div class="cav">Synthetic simulation for illustration, not a measured result from any product.</div>
    <div class="mi-rule" data-progress="gen"></div>
  </header>

  <section class="panel">
    <div class="ph"><b>a</b><span>The loop: each model is retrained on clicks the previous model caused</span></div>
    <div class="flow">
      <div class="stage">
        <svg class="mi-svg">
          <path class="mi-edge" data-link="#d0@right #m0@left" data-shape="straight" data-packets="1" data-period="2" data-r="3"></path>
          <path class="mi-edge" data-link="#m0@right #d1@left" data-shape="straight" data-packets="1" data-period="2" data-phase-offset="0.25" data-r="3"></path>
          <path class="mi-edge" data-link="#d1@right #m1@left" data-shape="straight" data-packets="1" data-period="2" data-phase-offset="0.5" data-r="3"></path>
          <path class="mi-edge" data-link="#m1@right #dn@left" data-shape="straight" data-packets="1" data-period="2" data-phase-offset="0.75" data-r="3"></path>
          <path class="mi-edge" data-link="#dn@right #mn@left" data-shape="straight" data-packets="1" data-period="2" data-r="3"></path>
          <path class="mi-edge" d="M 688 56 C 688 4, 298 4, 298 56" data-packets="1" data-period="4" data-r="3"></path>
        </svg>
        <div class="bx d" id="d0" style="left:0">Logs⁰</div>
        <div class="bx" id="m0" style="left:120px">Model 0</div>
        <div class="bx d" id="d1" style="left:260px">Logs¹</div>
        <div class="bx" id="m1" style="left:380px">Model 1</div>
        <div class="bx d dim" id="dn" style="left:520px">Logsⁿ</div>
        <div class="bx dim" id="mn" style="left:640px">Model n</div>
        <span class="lb" style="left:0;top:36px">Real clicks</span>
        <span class="lb" style="left:420px;top:2px">Model-shaped clicks</span>
        <span class="lb" style="left:132px;top:104px">fit</span>
        <span class="lb" style="left:224px;top:104px">serve + log</span>
        <span class="lb" style="left:0;top:128px">Logs⁰ &rarr; Logs¹ &rarr; &hellip; &rarr; Logsⁿ drift toward what was shown</span>
      </div>
      <div class="tags">
        <div class="tag" style="--item:var(--c1)"><i>popular</i> items get shown more</div>
        <div class="tag" style="--item:var(--c3)"><i>long tail</i> items get shown less</div>
        <div class="tag" style="--item:var(--c2)"><i>finite logs</i> miss rare tastes</div>
        <div class="tag" style="--item:var(--c4)"><i>ranking bias</i> compounds each round</div>
      </div>
    </div>
    <div class="rail" data-cycle="gen" data-step="2" data-offset="-11" data-sfx="tick" data-accent data-master>
      <span class="k">generation</span>
      <div style="--item:var(--c1)" data-item data-color="var(--c1)">1</div>
      <div style="--item:var(--c2)" data-item data-color="var(--c2)">2</div>
      <div style="--item:var(--c3)" data-item data-color="var(--c3)">3</div>
      <div style="--item:var(--c4)" data-item data-color="var(--c4)">4</div>
      <div style="--item:var(--c5)" data-item data-color="var(--c5)">5</div>
      <div style="--item:var(--c6)" data-item data-color="var(--c6)">6</div>
    </div>
  </section>

  <section class="panel grow">
    <div class="ph"><b>b</b><span>No fresh data: retrain only on model-shaped logs</span></div>
    <div class="pair">
      <svg viewBox="0 0 480 280" data-hist="0.045,0.024"></svg>
      <svg viewBox="0 0 480 280" data-line="11"></svg>
    </div>
  </section>

  <section class="panel grow">
    <div class="ph"><b>c</b><span>20% exploration: one slot in five shows a random item</span></div>
    <div class="pair">
      <svg viewBox="0 0 480 280" data-hist="0.012,0.006"></svg>
      <svg viewBox="0 0 480 280" data-line="3"></svg>
    </div>
  </section>

  <footer class="mi-foot"><span class="src">Simulated catalogue of 10⁴ items, 3 seeds per setting. Illustrative values only.</span><span class="mark">loopnotes</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Data**: replace the formulas in `MotionSetup` with real series. Keep the data in the page (arrays), never fetch.
  `data-hist` takes drift and narrowing per generation for the synthetic curves; for real data pass an index and
  read your own arrays. Keep y ranges fixed so bars and lines do not rescale while they grow.
- **Generations**: 4-8. Change `G`, the rail items, and keep `G × STEP` between 12 and 30 s; set `OFF` to
  `-(G × STEP - 1)` so frame 0 is the full figure.
- **Panels**: one setting only → drop panel c and let panel b `.grow`. Three settings → use canvas `1200x1800`.
- **Colours**: generations use `--c1…--c6` in order, runs use `--c1`, `--c3`, `--c5` plus dash patterns, so the
  figure still reads in the grayscale `white-paper` style. `highlighter-paper` gives a gold / grey figure.
- **Credit**: if the figure retells a published result, redraw it with your own data or cite the source in the
  caveat and footer; do not trace the original figure.
- **Pitfalls**: `.mi-edge` links in panel a are measured after fonts load, so do not animate box positions. The
  hand-drawn loop arc uses stage pixel coordinates: update its `d` when you move the boxes.
