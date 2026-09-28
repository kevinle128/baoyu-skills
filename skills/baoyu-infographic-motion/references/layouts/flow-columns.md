# flow-columns

Three concepts side by side as "A vs B vs C": a row of solid colour pills, then three tall columns. Each column has a
tinted one-line definition, its own vertical flow of 5 icon nodes joined by dashed arrows with numbered step circles
and short edge labels, and a dashed box at the bottom (inputs, needs or tools). All three flows run at the same time;
a slower master cycle puts one column in focus.

## Use when / Avoid when

- **Use when**: comparing 3 approaches that each have their own process ("prompting vs fine-tuning vs tool use",
  "REST vs GraphQL vs gRPC", "SQL vs NoSQL vs vector DB"), explainers where the reader should see *how each one works*,
  not only a feature table.
- **Avoid when**: the options differ only by attributes (use `comparison-matrix`), there are only 2 options (use
  `binary-comparison`), or one flow has more than 6 steps (the column gets too tall; use `card-pipeline` per option).

## Structure

Canvas `portrait` 1080×1350. No title text: the pills are the headline.

- **Header**: `.mi-top` (crumb + "Lever NN / 03" counter), `.pills` (3 × `.mi-pill` with `vs` between, each pill is an
  item of the master cycle), `.mi-sub` one-liner, `.mi-rule` progress.
- **Body** `.cols` (grid, 3 × 1fr). Each `.col.mi-card` sets `--item` to its colour and holds:
  - `.mi-tint` definition (one short sentence).
  - `.flow` (flex column, `space-between`) with an SVG overlay, 5 × `.node` (id `a0`…`a4`, `b0`…, `c0`…) and 4 × `.gap`
    rows between them (`.mi-step` number + edge label, placed right of the centre line).
  - Optional `.loop` label and a curved back-edge (column C: Result → Plan, "repeat").
  - `.base` dashed box with a label and 3 small icons.
- **Icons**: `<i class="mi-ico" data-ico="name">`. `MotionSetup` fills them from a small dictionary of original
  48×48 line icons (`user doc chip chat check db gear search rocket target list wrench plug folder chart`) that use the
  `pastel-schematic` parts `.f` (pastel fill), `.s` (ink stroke), `.a` (solid accent), plus page classes `.f.s`
  (fill + stroke), `.k` (thick accent stroke) and `.w` (white stroke).

## Motion recipe

- **Master cycle** `col` on `.mi-body`: 3 columns × `data-step="4"` = 12 s, `data-cycles="2"` (24 s), `data-sfx="blip"`,
  `data-accent`. The active column is at full opacity with a coloured border; the others sit at 60 %. The matching
  header pill scales 6 % and gets a soft ring.
- **Nested flow cycles** `fa`, `fb`, `fc` on each `.flow`: 5 nodes × `data-step="0.8"` = 4 s (divides 12 s), silent.
  All three run in parallel, like the reference GIFs. The active node's icon grows 14 % and glows (`.mi-ico` reads
  `--on`) and its name turns the column colour.
- **Beams**: one `mi-beam` per arrow, `data-item="fX" data-index="k"` (the step of the node *above* the arrow),
  `data-draw="0.5"`, so a dot runs down the arrow while that node is lit. A dashed `mi-edge` with an arrowhead
  (`marker-end="url(#ah)"`, defined once in the first SVG) stays under every beam.
- **Loop**: column C has a curved back-edge `#c3@right → #c1@right` (`data-bend="0.2"`, keep it small or the curve
  leaves the column) with 1 packet every 4 s.
- **Poster**: `data-poster="2.9"` (column A in focus, its flow mid-way).

## Skeleton

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Prompting vs Fine-tuning vs Tool use</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-head { gap: 14px; }
  .pills { display: flex; align-items: center; justify-content: center; gap: 14px; }
  .pills .mi-pill { font-size: 30px; padding: 10px 26px; scale: calc(1 + var(--on, 0) * 0.06); box-shadow: 0 0 0 calc(var(--on, 0) * 5px) color-mix(in oklab, var(--item) 22%, transparent); }
  .vs { font-size: 24px; font-weight: 800; color: var(--muted); }
  .mi-sub { justify-content: center; font-size: 17px; }
  .cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; height: 100%; }
  .col { display: flex; flex-direction: column; gap: 14px; padding: 16px 14px; opacity: calc(0.6 + 0.4 * var(--on, 0)); }
  .col .mi-tint { font-size: 14px; font-weight: 600; line-height: 1.35; min-height: 58px; display: grid; place-items: center; }
  .flow { position: relative; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: space-between; }
  .node { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; width: 150px; padding: 6px 0; background: var(--panel); }
  .node .mi-ico { width: 60px; height: 60px; margin-bottom: 4px; }
  .node b { font-size: 16px; font-weight: 700; }
  .node span { font-size: 12px; color: var(--muted); }
  .node b { color: color-mix(in oklab, var(--item) calc(var(--on, 0) * 100%), var(--ink)); }
  .gap { position: relative; z-index: 1; align-self: stretch; display: flex; align-items: center; gap: 6px; padding-left: calc(50% + 12px); height: 30px; font-size: 12px; color: var(--muted); }
  .gap .mi-step { width: 20px; height: 20px; font-size: 11px; flex: none; }
  .loop { position: absolute; right: 2px; top: 47%; z-index: 1; font-size: 12px; font-weight: 600; color: var(--item); background: var(--panel); padding: 2px 4px; }
  .mi-ico .f.s { fill: color-mix(in oklab, var(--item, var(--accent)) 22%, #fff); stroke: var(--ink); stroke-width: 1.8; stroke-linejoin: round; }
  .mi-ico .k { fill: none; stroke: var(--item, var(--accent)); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
  .mi-ico .w { fill: none; stroke: #fff; stroke-width: 2.2; stroke-linecap: round; }
  .base { border: 1.5px dashed color-mix(in oklab, var(--item) 55%, var(--line)); border-radius: 10px; padding: 10px 10px 12px; }
  .base .mi-label { text-align: center; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
  .bi { display: flex; justify-content: space-around; }
  .bi span { display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 12px; color: var(--muted); }
  .bi .mi-ico { width: 32px; height: 32px; }
</style>
<script>
window.MotionSetup = () => {
  const I = {
    user: '<circle class="f s" cx="22" cy="16" r="8"/><path class="f s" d="M7 40c1-9 7-13 15-13s14 4 15 13z"/><circle class="a" cx="37" cy="33" r="7"/><path class="w" d="M37 29.5v7M33.5 33h7"/>',
    doc: '<path class="f s" d="M12 6h17l8 8v28H12z"/><path class="s" d="M29 6v8h8M17 22h14M17 28h14M17 34h8"/><rect class="a" x="29" y="31" width="10" height="10" rx="2"/>',
    chip: '<path class="s" d="M18 6v6M24 6v6M30 6v6M18 36v6M24 36v6M30 36v6M6 18h6M6 24h6M6 30h6M36 18h6M36 24h6M36 30h6"/><rect class="f s" x="12" y="12" width="24" height="24" rx="4"/><rect class="a" x="19" y="19" width="10" height="10" rx="2"/>',
    chat: '<path class="f s" d="M6 8h28v20H18l-8 7v-7H6z"/><path class="f s" d="M20 22h22v14h-4v6l-6-6H20z"/><circle class="a" cx="26" cy="29" r="2"/><circle class="a" cx="31" cy="29" r="2"/><circle class="a" cx="36" cy="29" r="2"/>',
    check: '<circle class="f s" cx="24" cy="24" r="17"/><path class="k" d="M16 24l6 6 11-12"/>',
    db: '<path class="f s" d="M10 11v26c0 3 6 5 14 5s14-2 14-5V11"/><path class="s" d="M10 20c0 3 6 5 14 5s14-2 14-5M10 29c0 3 6 5 14 5s14-2 14-5"/><ellipse class="f s" cx="24" cy="11" rx="14" ry="5"/><circle class="a" cx="32" cy="36" r="2.5"/>',
    gear: '<path class="f s" d="M24 6l3 5 6-1 1 6 5 3-3 5 3 5-5 3-1 6-6-1-3 5-3-5-6 1-1-6-5-3 3-5-3-5 5-3 1-6 6 1z"/><circle class="a" cx="24" cy="24" r="6"/>',
    search: '<circle class="f s" cx="21" cy="21" r="12"/><path class="k" d="M30 30l10 10"/><path class="s" d="M15 21a6 6 0 0 1 6-6"/>',
    rocket: '<path class="f s" d="M24 5c8 5 11 14 9 25H15C13 19 16 10 24 5z"/><path class="s" d="M15 26l-6 8h7M33 26l6 8h-7"/><circle class="a" cx="24" cy="17" r="4"/><path class="k" d="M20 35v6M28 35v6"/>',
    target: '<circle class="f s" cx="22" cy="26" r="16"/><circle class="s" cx="22" cy="26" r="9"/><circle class="a" cx="22" cy="26" r="4"/><path class="k" d="M22 26L39 9M33 8h7v7"/>',
    list: '<rect class="f s" x="9" y="7" width="30" height="36" rx="3"/><path class="k" d="M14 18l2.5 2.5 4-4.5M14 29l2.5 2.5 4-4.5"/><path class="s" d="M25 18h9M25 29h9M15 38h19"/>',
    wrench: '<path class="f s" d="M31 6a10 10 0 0 0-9 13L7 34a4 4 0 0 0 6 6l15-15a10 10 0 0 0 13-9l-6 3-5-3-1-6z"/><circle class="a" cx="10" cy="37" r="2.5"/>',
    plug: '<path class="k" d="M19 16V7M29 16V7"/><path class="f s" d="M13 16h22v9a11 11 0 0 1-22 0z"/><path class="s" d="M24 36v7"/><circle class="a" cx="24" cy="25" r="3"/>',
    folder: '<path class="f s" d="M6 11h13l4 4h19v25H6z"/><rect class="a" x="6" y="19" width="36" height="4"/>',
    chart: '<rect class="f s" x="7" y="7" width="34" height="34" rx="4"/><path class="k" d="M13 33l8-9 6 5 9-12"/>',
  };
  document.querySelectorAll("[data-ico]").forEach((el) => {
    el.innerHTML = '<svg viewBox="0 0 48 48">' + I[el.dataset.ico] + "</svg>";
  });
};
</script>
</head>
<body data-canvas="portrait" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="2.9">
<main class="mi-page">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">AI basics / three levers</span><span class="mi-meta">Lever <span data-counter="col">01</span> / 03</span></div>
    <div class="pills"><span class="mi-pill" style="--item:var(--c1)" data-item="col" data-index="0">Prompting</span> <span class="vs">vs</span> <span class="mi-pill" style="--item:var(--c2)" data-item="col" data-index="1">Fine-tuning</span> <span class="vs">vs</span> <span class="mi-pill" style="--item:var(--c3)" data-item="col" data-index="2">Tool use</span></div>
    <div class="mi-sub"><span>Same base model, three different ways to change what it does</span></div>
    <div class="mi-rule" data-progress="col"></div>
  </header>

  <section class="mi-body" data-cycle="col" data-step="4" data-sfx="blip" data-accent data-master>
    <div class="cols">
    <div class="col mi-card" style="--item:var(--c1)" data-item data-color="var(--c1)">
      <div class="mi-tint">Steer a general model with instructions</div>
      <div class="flow" data-cycle="fa" data-step="0.8">
        <svg class="mi-svg"><defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#6b7385"></path></marker></defs>
        <path class="mi-edge" data-link="#a0@bottom #a1@top" data-shape="straight" data-gap="4" marker-end="url(#ah)"></path>
        <path class="mi-beam" data-link="#a0@bottom #a1@top" data-shape="straight" data-gap="4" data-beam data-item="fa" data-index="0" data-draw="0.5" data-dot-r="4"></path>
        <path class="mi-edge" data-link="#a1@bottom #a2@top" data-shape="straight" data-gap="4" marker-end="url(#ah)"></path>
        <path class="mi-beam" data-link="#a1@bottom #a2@top" data-shape="straight" data-gap="4" data-beam data-item="fa" data-index="1" data-draw="0.5" data-dot-r="4"></path>
        <path class="mi-edge" data-link="#a2@bottom #a3@top" data-shape="straight" data-gap="4" marker-end="url(#ah)"></path>
        <path class="mi-beam" data-link="#a2@bottom #a3@top" data-shape="straight" data-gap="4" data-beam data-item="fa" data-index="2" data-draw="0.5" data-dot-r="4"></path>
        <path class="mi-edge" data-link="#a3@bottom #a4@top" data-shape="straight" data-gap="4" marker-end="url(#ah)"></path>
        <path class="mi-beam" data-link="#a3@bottom #a4@top" data-shape="straight" data-gap="4" data-beam data-item="fa" data-index="3" data-draw="0.5" data-dot-r="4"></path>
        </svg>
        <div class="node" id="a0" data-item><i class="mi-ico" data-ico="user"></i><b>User</b><span>states the need</span></div>
        <div class="gap"><i class="mi-step">1</i>writes</div>
        <div class="node" id="a1" data-item><i class="mi-ico" data-ico="doc"></i><b>Prompt</b><span>rules + examples</span></div>
        <div class="gap"><i class="mi-step">2</i>sends</div>
        <div class="node" id="a2" data-item><i class="mi-ico" data-ico="chip"></i><b>Base model</b><span>weights unchanged</span></div>
        <div class="gap"><i class="mi-step">3</i>generates</div>
        <div class="node" id="a3" data-item><i class="mi-ico" data-ico="chat"></i><b>Answer</b><span>one pass</span></div>
        <div class="gap"><i class="mi-step">4</i>reads</div>
        <div class="node" id="a4" data-item><i class="mi-ico" data-ico="check"></i><b>Review</b><span>you judge it</span></div>
        
      </div>
      <div class="base"><div class="mi-label">Inputs</div><div class="bi"><span><i class="mi-ico" data-ico="doc"></i>Rules</span><span><i class="mi-ico" data-ico="list"></i>Examples</span><span><i class="mi-ico" data-ico="folder"></i>Context</span></div></div>
    </div>
    <div class="col mi-card" style="--item:var(--c2)" data-item data-color="var(--c2)">
      <div class="mi-tint">Teach the model new habits with data</div>
      <div class="flow" data-cycle="fb" data-step="0.8">
        <svg class="mi-svg">
        <path class="mi-edge" data-link="#b0@bottom #b1@top" data-shape="straight" data-gap="4" marker-end="url(#ah)"></path>
        <path class="mi-beam" data-link="#b0@bottom #b1@top" data-shape="straight" data-gap="4" data-beam data-item="fb" data-index="0" data-draw="0.5" data-dot-r="4"></path>
        <path class="mi-edge" data-link="#b1@bottom #b2@top" data-shape="straight" data-gap="4" marker-end="url(#ah)"></path>
        <path class="mi-beam" data-link="#b1@bottom #b2@top" data-shape="straight" data-gap="4" data-beam data-item="fb" data-index="1" data-draw="0.5" data-dot-r="4"></path>
        <path class="mi-edge" data-link="#b2@bottom #b3@top" data-shape="straight" data-gap="4" marker-end="url(#ah)"></path>
        <path class="mi-beam" data-link="#b2@bottom #b3@top" data-shape="straight" data-gap="4" data-beam data-item="fb" data-index="2" data-draw="0.5" data-dot-r="4"></path>
        <path class="mi-edge" data-link="#b3@bottom #b4@top" data-shape="straight" data-gap="4" marker-end="url(#ah)"></path>
        <path class="mi-beam" data-link="#b3@bottom #b4@top" data-shape="straight" data-gap="4" data-beam data-item="fb" data-index="3" data-draw="0.5" data-dot-r="4"></path>
        </svg>
        <div class="node" id="b0" data-item><i class="mi-ico" data-ico="db"></i><b>Dataset</b><span>labelled pairs</span></div>
        <div class="gap"><i class="mi-step">1</i>feeds</div>
        <div class="node" id="b1" data-item><i class="mi-ico" data-ico="gear"></i><b>Training</b><span>gradient steps</span></div>
        <div class="gap"><i class="mi-step">2</i>updates</div>
        <div class="node" id="b2" data-item><i class="mi-ico" data-ico="chip"></i><b>New weights</b><span>a tuned copy</span></div>
        <div class="gap"><i class="mi-step">3</i>scored</div>
        <div class="node" id="b3" data-item><i class="mi-ico" data-ico="search"></i><b>Evaluation</b><span>held-out set</span></div>
        <div class="gap"><i class="mi-step">4</i>passes</div>
        <div class="node" id="b4" data-item><i class="mi-ico" data-ico="rocket"></i><b>Deploy</b><span>ship if better</span></div>
        
      </div>
      <div class="base"><div class="mi-label">Needs</div><div class="bi"><span><i class="mi-ico" data-ico="db"></i>Data</span><span><i class="mi-ico" data-ico="chip"></i>GPUs</span><span><i class="mi-ico" data-ico="chart"></i>Evals</span></div></div>
    </div>
    <div class="col mi-card" style="--item:var(--c3)" data-item data-color="var(--c3)">
      <div class="mi-tint">Let the model call code to act</div>
      <div class="flow" data-cycle="fc" data-step="0.8">
        <svg class="mi-svg">
        <path class="mi-edge" data-link="#c0@bottom #c1@top" data-shape="straight" data-gap="4" marker-end="url(#ah)"></path>
        <path class="mi-beam" data-link="#c0@bottom #c1@top" data-shape="straight" data-gap="4" data-beam data-item="fc" data-index="0" data-draw="0.5" data-dot-r="4"></path>
        <path class="mi-edge" data-link="#c1@bottom #c2@top" data-shape="straight" data-gap="4" marker-end="url(#ah)"></path>
        <path class="mi-beam" data-link="#c1@bottom #c2@top" data-shape="straight" data-gap="4" data-beam data-item="fc" data-index="1" data-draw="0.5" data-dot-r="4"></path>
        <path class="mi-edge" data-link="#c2@bottom #c3@top" data-shape="straight" data-gap="4" marker-end="url(#ah)"></path>
        <path class="mi-beam" data-link="#c2@bottom #c3@top" data-shape="straight" data-gap="4" data-beam data-item="fc" data-index="2" data-draw="0.5" data-dot-r="4"></path>
        <path class="mi-edge" data-link="#c3@bottom #c4@top" data-shape="straight" data-gap="4" marker-end="url(#ah)"></path>
        <path class="mi-beam" data-link="#c3@bottom #c4@top" data-shape="straight" data-gap="4" data-beam data-item="fc" data-index="3" data-draw="0.5" data-dot-r="4"></path>
        <path class="mi-edge" data-link="#c3@right #c1@right" data-bend="0.2" data-gap="6" marker-end="url(#ah)" data-packets="1" data-period="4"></path>
        </svg>
        <div class="node" id="c0" data-item><i class="mi-ico" data-ico="target"></i><b>Goal</b><span>task from user</span></div>
        <div class="gap"><i class="mi-step">1</i>breaks down</div>
        <div class="node" id="c1" data-item><i class="mi-ico" data-ico="list"></i><b>Plan</b><span>next step</span></div>
        <div class="gap"><i class="mi-step">2</i>picks tool</div>
        <div class="node" id="c2" data-item><i class="mi-ico" data-ico="wrench"></i><b>Call tool</b><span>run real code</span></div>
        <div class="gap"><i class="mi-step">3</i>returns</div>
        <div class="node" id="c3" data-item><i class="mi-ico" data-ico="doc"></i><b>Result</b><span>tool output</span></div>
        <div class="gap"><i class="mi-step">4</i>checks</div>
        <div class="node" id="c4" data-item><i class="mi-ico" data-ico="check"></i><b>Done</b><span>goal met</span></div>
        <span class="loop">repeat</span>
      </div>
      <div class="base"><div class="mi-label">Tools</div><div class="bi"><span><i class="mi-ico" data-ico="plug"></i>APIs</span><span><i class="mi-ico" data-ico="folder"></i>Files</span><span><i class="mi-ico" data-ico="db"></i>Database</span></div></div>
    </div>
    </div>
  </section>

  <footer class="mi-foot"><span>Illustrative flows, simplified</span><span class="path">ask &gt; adapt &gt; act</span><span class="mark">three levers</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Content**: change pill text, the definition, the 5 nodes (`data-ico`, name, one short sub-line), the 4 edge
  labels and the base box. Keep names to 1-2 words and sub-lines under ~20 characters; columns are ~316 px wide.
- **Colours**: one `--c*` per column, set as `--item` on the `.col`, the matching pill and `data-color`.
- **Steps per flow**: 4-6 nodes. Keep nodes × flow step a divisor of the column step (5 × 0.8 = 4; for 4 nodes use
  1.0; for 6 nodes use 0.8 with a column step of 4.8).
- **Two or four columns**: change `repeat(3, 1fr)` and the master count; at 4 columns shrink `.node` to 120 px and icons
  to 48 px, and drop the sub-lines.
- **New icons**: add an entry to the `I` dictionary in `MotionSetup` (48×48 viewBox, parts `.f.s`, `.s`, `.a`, `.k`).
  Icons are injected after connectors are measured, so `.mi-ico` must keep a fixed size.
- **Pitfalls**: link beams to `.node`, never to `.mi-ico` (the icon scales with `--on`). Keep `.node` and `.gap`
  above the SVG (`z-index: 1`) with a panel background so arrows pass behind labels. A large `data-bend` on the loop
  edge pushes the curve outside the column.
