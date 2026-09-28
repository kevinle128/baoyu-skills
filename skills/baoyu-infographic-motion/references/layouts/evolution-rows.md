# evolution-rows

Four stacked row cards show one idea growing up level by level. Each row has a solid colour band on the left and a
left-to-right flow of icon nodes with dashed arrows and small edge labels. Later rows add structure: a grouped core
box, a tool tray, a loop-back "repeat" arrow over the top and a dashed system boundary with a title tag. Every row runs
its own small cycle at the same time, and a master cycle puts one row in focus.

## Use when / Avoid when

- **Use when**: a concept has 3-5 levels of maturity or complexity that share one vocabulary (script → workflow →
  agent → agent system, LLM → RAG → agent, manual → automated → autonomous), and each level fits one short flow.
- **Avoid when**: the levels are unrelated options that compete (use `flow-columns` or `comparison-matrix`), one level
  needs more than 6 nodes (the row gets too dense), or there is only one flow (use `card-pipeline`).

## Structure

Canvas `portrait` (1080×1350). No custom header beyond the standard `.mi-head`.

- **Icon sprite**: one hidden `<svg>` with `<symbol>`s at the top of `<body>`. Each symbol uses the `pastel-schematic`
  icon parts (`.f` pastel fill, `.s` ink stroke, `.a` solid accent). Nodes reference them with `<use href="#i-…">`, and
  a small inline script copies the symbol children into each icon before `motion.js` runs, because document CSS does
  not reach inside a `<use>` shadow tree (the icons would render solid black).
- **Rows** `.rows` (flex column, 4 × `.mi-card.row`, each the master item with its `--item` colour):
  - `.band`: level name + one-line note on the solid colour.
  - `.stage` (own nested cycle): an `.mi-svg` for edges, then `.nd` nodes (icon `.mi-ico` + name + `small` note)
    separated by `.gp` gaps (flexible, with an `em` edge label).
  - Row 2 adds a small `state` store under the flow, linked with elbow edges.
  - Row 3 adds a `.core` group (tag + two icons) as one node, a `.tools` tray under `Act`, and a loop-back arrow.
  - Row 4 adds a dashed `.sys` boundary with a tag, a `.team` group of three agents and a `replan` loop inside it.
- **Loop-back arrows**: three straight segments through two zero-size anchors `.lp` (placed 30 px above the icons,
  20 px inside `.sys`), so the loop is a clean bracket instead of a large curve.
- **Footer**: standard `.mi-foot`.

## Motion recipe

- **Master cycle** `row` on `.mi-body`: 4 rows × `data-step="3"` = 12 s, `data-cycles="2"` (24 s), `data-sfx="blip"`,
  `data-accent`. The active row lifts 3 px, its band goes fully saturated and its border takes the row colour
  (`[data-item].mi-card` in the style). The header counter and rule follow the master.
- **Nested row cycles** (silent, all running in parallel): row 1 = 3 nodes × 1 s, row 2 = 4 × 0.75 s, rows 3 and 4 =
  5 × 0.6 s, so every row loops in 3 s and divides the 12 s master period. Each `.nd` / `.core` / `.team` is an item;
  the style's `.mi-ico` grows 14 % and glows in the row colour with `--on`.
- **Packets**: every flow edge carries 1 packet (`data-period="1.5"`, phase-shifted along the row). The loop-back top
  segment carries its own packet; the vertical legs stay plain dashes.
- **Poster**: `data-poster="7.4"` (row 3 in focus, all icons visible).
- **Sound**: `blip` per level, 8 cues in 24 s.

## Skeleton

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>From Script to Agent System</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-page { gap: 16px; }
  .rows { display: flex; flex-direction: column; gap: 14px; height: 100%; }
  .row { flex: 1; display: grid; grid-template-columns: 148px 1fr; overflow: visible; padding: 0; translate: 0 calc(var(--on) * -3px); }
  .band { display: grid; place-content: center; gap: 6px; text-align: center; border-radius: calc(var(--radius) - 2px) 0 0 calc(var(--radius) - 2px); background: color-mix(in oklab, var(--item) calc(72% + var(--on) * 28%), #fff); color: #fff; }
  .band b { font-size: 22px; font-weight: 800; line-height: 1.1; }
  .band small { font-size: 12px; font-weight: 500; opacity: .85; }
  .stage { position: relative; display: flex; align-items: center; padding: 0 22px; gap: 0; }
  .nd { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 78px; font-size: 14px; font-weight: 600; text-align: center; }
  .nd small { display: block; font-size: 11px; font-weight: 500; color: var(--muted); }
  .nd .mi-ico { width: 46px; height: 46px; }
  .gp { flex: 1; position: relative; align-self: stretch; display: grid; place-items: center; min-width: 40px; }
  .gp em { position: absolute; top: calc(50% - 38px); font-style: normal; font-size: 11px; color: var(--muted); white-space: nowrap; }
  .core { display: flex; gap: 14px; padding: 10px 14px 8px; border: 1.5px solid color-mix(in oklab, var(--item) 45%, var(--line)); border-radius: 10px; background: color-mix(in oklab, var(--item) 7%, #fff); }
  .core .nd { min-width: 58px; }
  .core .nd .mi-ico { width: 36px; height: 36px; }
  .core .tag, .sys .tag { position: absolute; left: 50%; top: -11px; translate: -50% 0; padding: 1px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; white-space: nowrap; background: var(--item); color: #fff; }
  .tools { position: absolute; top: calc(100% + 6px); left: 50%; translate: -50% 0; display: flex; gap: 8px; margin-top: 4px; padding: 4px 8px; border-radius: 8px; background: color-mix(in oklab, var(--item) 12%, #fff); }
  .tools .mi-ico { width: 20px; height: 20px; }
  .sys { position: relative; flex: 3; display: flex; align-items: center; align-self: center; height: 176px; padding: 44px 14px 0; border: 1.5px dashed color-mix(in oklab, var(--item) 70%, var(--line)); border-radius: 12px; background: color-mix(in oklab, var(--item) 5%, #fff); }
  .team { display: flex; gap: 8px; padding: 8px 10px 6px; border: 1.5px solid color-mix(in oklab, var(--item) 45%, var(--line)); border-radius: 10px; background: #fff; }
  .team .nd { min-width: 46px; font-size: 12px; }
  .team .nd .mi-ico { width: 30px; height: 30px; }
  .stage .mi-edge { stroke-dasharray: 5 5; }
  .stage .mi-packet { fill: var(--item); }
  .loop { stroke: color-mix(in oklab, var(--item) 70%, #6b7385) !important; }
  .loopl { position: absolute; font-size: 11px; color: var(--muted); white-space: nowrap; }
  .stage > .mi-svg { z-index: 1; }
  .lp { position: absolute; left: 50%; top: -30px; width: 0; height: 0; }
  .sys .lp { top: -20px; }
</style>
</head>
<body data-canvas="portrait" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="7.4">
<svg width="0" height="0" style="position:absolute">
  <symbol id="i-doc" viewBox="0 0 48 48"><path class="f" d="M12 6h17l9 9v27H12z"/><path class="s" d="M12 6h17l9 9v27H12zM29 6v9h9"/><path class="s" d="M18 24h14M18 30h14M18 36h9"/></symbol>
  <symbol id="i-gear" viewBox="0 0 48 48"><circle class="f" cx="24" cy="24" r="15"/><path class="s" d="M24 7v6M24 35v6M7 24h6M35 24h6M12 12l4 4M32 32l4 4M12 36l4-4M32 16l4-4"/><circle class="s" cx="24" cy="24" r="10"/><circle class="a" cx="24" cy="24" r="4"/></symbol>
  <symbol id="i-out" viewBox="0 0 48 48"><rect class="f" x="7" y="10" width="34" height="26" rx="4"/><path class="s" d="M11 10h26a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H22l-8 6v-6h-3a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z"/><path class="s" d="M15 20h18M15 26h12"/></symbol>
  <symbol id="i-bolt" viewBox="0 0 48 48"><circle class="f" cx="24" cy="24" r="17"/><circle class="s" cx="24" cy="24" r="17"/><path class="a" d="M26 10 15 27h8l-2 11 11-17h-8z"/></symbol>
  <symbol id="i-step" viewBox="0 0 48 48"><rect class="f" x="8" y="8" width="32" height="32" rx="7"/><rect class="s" x="8" y="8" width="32" height="32" rx="7"/><path class="s" d="M17 24h14M26 18l6 6-6 6"/></symbol>
  <symbol id="i-db" viewBox="0 0 48 48"><path class="f" d="M10 12v24c0 3 6 6 14 6s14-3 14-6V12"/><ellipse class="a" cx="24" cy="12" rx="14" ry="5"/><path class="s" d="M10 12v24c0 3 6 6 14 6s14-3 14-6V12M10 24c0 3 6 6 14 6s14-3 14-6"/></symbol>
  <symbol id="i-check" viewBox="0 0 48 48"><circle class="f" cx="24" cy="24" r="17"/><circle class="s" cx="24" cy="24" r="17"/><path class="s" d="M16 24l6 6 11-12" style="stroke-width:3"/></symbol>
  <symbol id="i-goal" viewBox="0 0 48 48"><circle class="f" cx="24" cy="24" r="17"/><circle class="s" cx="24" cy="24" r="17"/><circle class="s" cx="24" cy="24" r="10"/><circle class="a" cx="24" cy="24" r="4"/><path class="s" d="M24 24 38 10M33 10h5v5"/></symbol>
  <symbol id="i-chip" viewBox="0 0 48 48"><rect class="f" x="12" y="12" width="24" height="24" rx="4"/><rect class="s" x="12" y="12" width="24" height="24" rx="4"/><rect class="a" x="19" y="19" width="10" height="10" rx="2"/><path class="s" d="M18 6v6M24 6v6M30 6v6M18 36v6M24 36v6M30 36v6M6 18h6M6 24h6M6 30h6M36 18h6M36 24h6M36 30h6"/></symbol>
  <symbol id="i-note" viewBox="0 0 48 48"><rect class="f" x="10" y="8" width="28" height="34" rx="3"/><rect class="s" x="10" y="8" width="28" height="34" rx="3"/><path class="s" d="M16 17h16M16 24h16M16 31h10"/><rect class="a" x="18" y="4" width="12" height="7" rx="2"/></symbol>
  <symbol id="i-split" viewBox="0 0 48 48"><path class="f" d="M24 6 42 24 24 42 6 24z"/><path class="s" d="M24 6 42 24 24 42 6 24z"/><path class="s" d="M18 24h12M26 20l4 4-4 4"/></symbol>
  <symbol id="i-tool" viewBox="0 0 48 48"><circle class="f" cx="30" cy="16" r="10"/><path class="s" d="M8 40 26 22M30 6a10 10 0 1 0 12 12l-7 1-6-6z"/><circle class="a" cx="10" cy="38" r="3"/></symbol>
  <symbol id="i-eye" viewBox="0 0 48 48"><path class="f" d="M4 24s8-13 20-13 20 13 20 13-8 13-20 13S4 24 4 24z"/><path class="s" d="M4 24s8-13 20-13 20 13 20 13-8 13-20 13S4 24 4 24z"/><circle class="a" cx="24" cy="24" r="6"/></symbol>
  <symbol id="i-flag" viewBox="0 0 48 48"><path class="f" d="M12 8h24l-5 8 5 8H12z"/><path class="s" d="M12 42V8h24l-5 8 5 8H12"/></symbol>
  <symbol id="i-map" viewBox="0 0 48 48"><circle class="f" cx="24" cy="24" r="17"/><circle class="a" cx="24" cy="14" r="4"/><circle class="s" cx="13" cy="32" r="4"/><circle class="s" cx="35" cy="32" r="4"/><path class="s" d="M22 17l-7 12M26 17l7 12M17 32h14"/></symbol>
  <symbol id="i-bot" viewBox="0 0 48 48"><rect class="f" x="9" y="14" width="30" height="24" rx="7"/><rect class="s" x="9" y="14" width="30" height="24" rx="7"/><circle class="a" cx="18" cy="26" r="3"/><circle class="a" cx="30" cy="26" r="3"/><path class="s" d="M24 14V8M20 33h8"/></symbol>
  <symbol id="i-review" viewBox="0 0 48 48"><rect class="f" x="8" y="8" width="26" height="32" rx="3"/><rect class="s" x="8" y="8" width="26" height="32" rx="3"/><path class="s" d="M14 17h14M14 24h10"/><circle class="s" cx="32" cy="32" r="7"/><path class="s" d="M37 37l5 5"/></symbol>
</svg>
<main class="mi-page">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">How automation grows up</span><span class="mi-meta">Level <span data-counter="row">01</span> / 04</span></div>
    <h1 class="mi-title">From a script to an <em>agent system</em></h1>
    <div class="mi-sub"><span>Each level keeps the one before it and adds one idea</span></div>
    <div class="mi-rule" data-progress="row"></div>
  </header>

  <section class="mi-body" data-cycle="row" data-step="3" data-sfx="blip" data-accent data-master>
    <div class="rows">

      <div class="mi-card row" style="--item:var(--c1)" data-item data-color="var(--c1)">
        <div class="band"><b>Script</b><small>fixed steps</small></div>
        <div class="stage" data-cycle="r1" data-step="1">
          <svg class="mi-svg">
            <path class="mi-edge" data-link="#a1@right #a2@left" data-shape="straight" data-gap="6" data-packets="1" data-period="1.5" data-r="4"></path>
            <path class="mi-edge" data-link="#a2@right #a3@left" data-shape="straight" data-gap="6" data-packets="1" data-period="1.5" data-phase-offset="0.5" data-r="4"></path>
          </svg>
          <div class="nd" data-item><span class="mi-ico" id="a1"><svg><use href="#i-doc"/></svg></span>Input<small>a file or a form</small></div>
          <i class="gp"><em>read</em></i>
          <div class="nd" data-item><span class="mi-ico" id="a2"><svg><use href="#i-gear"/></svg></span>Script<small>same path every run</small></div>
          <i class="gp"><em>write</em></i>
          <div class="nd" data-item><span class="mi-ico" id="a3"><svg><use href="#i-out"/></svg></span>Output<small>breaks on surprises</small></div>
        </div>
      </div>

      <div class="mi-card row" style="--item:var(--c2)" data-item data-color="var(--c2)">
        <div class="band"><b>Workflow</b><small>branches + state</small></div>
        <div class="stage" data-cycle="r2" data-step="0.75">
          <svg class="mi-svg">
            <path class="mi-edge" data-link="#b1@right #b2@left" data-shape="straight" data-gap="6" data-packets="1" data-period="1.5" data-r="4"></path>
            <path class="mi-edge" data-link="#b2@right #b3@left" data-shape="straight" data-gap="6" data-packets="1" data-period="1.5" data-phase-offset="0.33" data-r="4"></path>
            <path class="mi-edge" data-link="#b3@right #b4@left" data-shape="straight" data-gap="6" data-packets="1" data-period="1.5" data-phase-offset="0.66" data-r="4"></path>
            <path class="mi-edge" data-link="#b2@bottom #b5@left" data-shape="elbow" data-gap="4"></path>
            <path class="mi-edge" data-link="#b5@right #b3@bottom" data-shape="elbow" data-gap="4"></path>
          </svg>
          <div class="nd" data-item><span class="mi-ico" id="b1"><svg><use href="#i-bolt"/></svg></span>Trigger<small>new ticket</small></div>
          <i class="gp"><em>event</em></i>
          <div class="nd" data-item><span class="mi-ico" id="b2"><svg><use href="#i-step"/></svg></span>Classify<small>rule table</small></div>
          <i class="gp"><em>route</em></i>
          <div class="nd" data-item><span class="mi-ico" id="b3"><svg><use href="#i-split"/></svg></span>Branch<small>if / else</small></div>
          <i class="gp"><em>update</em></i>
          <div class="nd" data-item><span class="mi-ico" id="b4"><svg><use href="#i-check"/></svg></span>Done<small>status saved</small></div>
          <div class="nd" style="position:absolute;left:43%;bottom:6px;flex-direction:row;gap:6px;font-size:12px"><span class="mi-ico" id="b5" style="width:24px;height:24px"><svg><use href="#i-db"/></svg></span>state</div>
        </div>
      </div>

      <div class="mi-card row" style="--item:var(--c3)" data-item data-color="var(--c3)">
        <div class="band"><b>Agent</b><small>decides the next step</small></div>
        <div class="stage" data-cycle="r3" data-step="0.6">
          <svg class="mi-svg">
            <path class="mi-edge" data-link="#c1@right #c2@left" data-shape="straight" data-gap="6" data-packets="1" data-period="1.5" data-r="4"></path>
            <path class="mi-edge" data-link="#c2@right #c3@left" data-shape="straight" data-gap="6" data-packets="1" data-period="1.5" data-phase-offset="0.25" data-r="4"></path>
            <path class="mi-edge" data-link="#c3@right #c4@left" data-shape="straight" data-gap="6" data-packets="1" data-period="1.5" data-phase-offset="0.5" data-r="4"></path>
            <path class="mi-edge" data-link="#c4@right #c5@left" data-shape="straight" data-gap="6" data-packets="1" data-period="1.5" data-phase-offset="0.75" data-r="4"></path>
            <path class="mi-edge loop" data-link="#c5@top #k1@center" data-shape="straight" data-gap="4"></path>
            <path class="mi-edge loop" data-link="#k1@center #k2@center" data-shape="straight" data-packets="1" data-period="1.5" data-r="4"></path>
            <path class="mi-edge loop" data-link="#k2@center #c3@top" data-shape="straight" data-gap="4"></path>
          </svg>
          <span class="loopl" style="left:66%;top:calc(50% - 90px)">repeat until the goal is met</span>
          <div class="nd" data-item><span class="mi-ico" id="c1"><svg><use href="#i-goal"/></svg></span>Goal</div>
          <i class="gp"><em>task</em></i>
          <div class="core" id="c2" data-item style="position:relative"><span class="tag">agent core</span>
            <div class="nd"><span class="mi-ico"><svg><use href="#i-chip"/></svg></span>Model</div>
            <div class="nd"><span class="mi-ico"><svg><use href="#i-note"/></svg></span>Memory</div>
          </div>
          <i class="gp"><em>state</em></i>
          <div class="nd" data-item><i class="lp" id="k2"></i><span class="mi-ico" id="c3"><svg><use href="#i-split"/></svg></span>Decide</div>
          <i class="gp"><em>tool call</em></i>
          <div class="nd" data-item><span class="mi-ico" id="c4"><svg><use href="#i-tool"/></svg></span>Act
            <span class="tools"><span class="mi-ico"><svg><use href="#i-doc"/></svg></span><span class="mi-ico"><svg><use href="#i-db"/></svg></span><span class="mi-ico"><svg><use href="#i-gear"/></svg></span></span></div>
          <i class="gp"><em>result</em></i>
          <div class="nd" data-item><i class="lp" id="k1"></i><span class="mi-ico" id="c5"><svg><use href="#i-eye"/></svg></span>Observe</div>
        </div>
      </div>

      <div class="mi-card row" style="--item:var(--c6)" data-item data-color="var(--c6)">
        <div class="band"><b>Agent<br>system</b><small>many agents, one goal</small></div>
        <div class="stage" data-cycle="r4" data-step="0.6">
          <svg class="mi-svg">
            <path class="mi-edge" data-link="#d1@right #d2@left" data-shape="straight" data-gap="6" data-packets="1" data-period="1.5" data-r="4"></path>
            <path class="mi-edge" data-link="#d2@right #d3@left" data-shape="straight" data-gap="6" data-packets="1" data-period="1.5" data-phase-offset="0.25" data-r="4"></path>
            <path class="mi-edge" data-link="#d3@right #d4@left" data-shape="straight" data-gap="6" data-packets="1" data-period="1.5" data-phase-offset="0.5" data-r="4"></path>
            <path class="mi-edge" data-link="#d4@right #d5@left" data-shape="straight" data-gap="6" data-packets="1" data-period="1.5" data-phase-offset="0.75" data-r="4"></path>
            <path class="mi-edge loop" data-link="#d4@top #m1@center" data-shape="straight" data-gap="4"></path>
            <path class="mi-edge loop" data-link="#m1@center #m2@center" data-shape="straight" data-packets="1" data-period="1.5" data-r="4"></path>
            <path class="mi-edge loop" data-link="#m2@center #d2@top" data-shape="straight" data-gap="4"></path>
          </svg>
          <div class="nd" data-item><span class="mi-ico" id="d1"><svg><use href="#i-flag"/></svg></span>Objective</div>
          <i class="gp"></i>
          <div class="sys"><span class="tag">agent system</span>
            <span class="loopl" style="left:44%;top:28px">replan</span>
            <div class="nd" data-item><i class="lp" id="m2"></i><span class="mi-ico" id="d2"><svg><use href="#i-map"/></svg></span>Planner<small>splits work</small></div>
            <i class="gp"><em>assign</em></i>
            <div class="team" id="d3" data-item>
              <div class="nd"><span class="mi-ico"><svg><use href="#i-bot"/></svg></span>research</div>
              <div class="nd"><span class="mi-ico"><svg><use href="#i-bot"/></svg></span>build</div>
              <div class="nd"><span class="mi-ico"><svg><use href="#i-bot"/></svg></span>test</div>
            </div>
            <i class="gp"><em>results</em></i>
            <div class="nd" data-item><i class="lp" id="m1"></i><span class="mi-ico" id="d4"><svg><use href="#i-review"/></svg></span>Review<small>checks progress</small></div>
          </div>
          <i class="gp"></i>
          <div class="nd" data-item><span class="mi-ico" id="d5"><svg><use href="#i-check"/></svg></span>Outcome</div>
        </div>
      </div>

    </div>
  </section>

  <footer class="mi-foot"><span>Levels of automation</span><span class="path">Script &gt; Workflow &gt; Agent &gt; Agent system</span><span class="mark">evolution-rows</span></footer>
</main>
<script>
document.querySelectorAll(".mi-ico use").forEach((u) => {
  const sym = document.querySelector(u.getAttribute("href")), svg = u.parentNode;
  svg.setAttribute("viewBox", sym.getAttribute("viewBox"));
  svg.replaceChildren(...[...sym.children].map((n) => n.cloneNode(true)));
});
</script>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Row count**: 3-5 rows. Keep master step × rows between 12 and 16 s; nested row periods must divide the master
  period (3 s rows under a 3 s step).
- **Nodes per row**: 3-6. For 6 nodes drop the `small` notes and reduce `.nd` `min-width` to 64 px.
- **Icons**: add a `<symbol>` per icon with the `.f` / `.s` / `.a` parts on a 48×48 viewBox. Keep the copy script: it
  must run before `motion.js` so connectors are measured on the final icons.
- **Loop-back**: place two `.lp` anchors (one inside the source node, one inside the target node) and link three
  straight segments. Move `.lp` further up if the loop label collides with an edge label.
- **Edges inside boxes**: `.stage > .mi-svg` has `z-index: 1`, so edges draw over `.sys` / `.team` backgrounds. Keep
  `data-gap` on edges so lines stop short of icons.
- **Other styles**: the layout relies on `.mi-ico` parts from `pastel-schematic`. With another style add
  `.mi-ico .f/.s/.a` rules to the page `<style>`, or icons fall back to black fills.
- **Pitfalls**: do not put `data-beam` and `data-packets` on the same path. Do not link to `.core` or `.team` from
  the loop anchors; link to icon ids so the arrows land on a visible shape.
