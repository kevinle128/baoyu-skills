# fan-in

Many labelled sources in four groups converge through bundles of bezier strands into one root: a big set of inputs
that all serve one result, where the grouping matters.

## Use when / Avoid when

- **Use when**: "20 skills behind one agent", a capability tree, 15-24 inputs grouped into 3-4 families (research /
  build / ship), a funnel of sources into one product.
- **Avoid when**: fewer than 10 items (use `columns-to-hub`), the result is a process rather than one node (use
  `card-pipeline`), or items need descriptions (use `orbit-panel`).

## Structure

- **Fan** (flex: 1): left side, centre caption, right side (300 px | 1fr | 300 px). Each side holds 2 groups
  (`justify-content: space-between`, `padding-bottom: 150px` so the lower groups end above the root). Each group:
  heading (number, name, tagline) + 5 leaf rows (number, name, live mini bar).
- **Root**: `#root` box at the bottom centre with 5 invisible anchors on its top edge, and a pulsing seed dot below.
- **Caption**: active group name (swap) and group / node counters, on a `--bg` panel so strands pass behind it.
- **Meters**: 4 cards (one per group) with 8-bar equalizers, lit with their group. A sine squiggle line. **Footer**.

## Motion recipe

- **Master cycle** `grp`: 4 groups × 3 s = 12 s, `data-cycles="2"` (24 s), `data-sfx="thump"`, `data-accent`.
  Each group wraps its strands in `<g data-item="grp" data-index="n">`, so the whole bundle brightens and thickens
  (`.strand` reads `--on` from the `g`).
- **Nested spotlight** `node`: 20 leaves × 0.6 s = 12 s, `data-sfx="tick"`. It runs inside the active group
  (leaf 0-4 during group 0, and so on).
- **Strands**: every leaf has 3 strands: two to root anchors (`#a1…#a5`, `data-bend="0.6"`) and one to `#root@top`
  with 1 packet (`data-period` 3 or 4 s). The active leaf also has a `mi-beam` that draws with a dot.
- **Ambient**: root and seed `data-pulse="1.5"`, leaf mini bars and meter bars `data-jitter`, sine squiggle.
- **Outro option**: add `data-outro="3"` on `<body>` and a banner with `data-enter="up" data-at="…"` +
  `data-sfx="chime"` for a "SEE > MAP > MAKE > SHIP" summary (the reference video did this; it breaks the seamless loop).

## Skeleton

Portrait 1080×1350. The strands are repetitive; generate them with a small loop when you change item count.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Twenty Skills One Agent</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-body { display: flex; flex-direction: column; gap: 18px; }
  .fan { position: relative; flex: 1; display: grid; grid-template-columns: 300px 1fr 300px; }
  .side { display: flex; flex-direction: column; justify-content: space-between; gap: 34px; padding-bottom: 150px; position: relative; z-index: 2; }
  .side.r { grid-column: 3; }
  .group { display: flex; flex-direction: column; gap: 6px; }
  .ghead { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 12px; letter-spacing: .08em; text-transform: var(--label-case); padding: 0 2px 6px; border-bottom: 1px solid color-mix(in oklab, var(--item) calc(30% + var(--on) * 70%), var(--line)); }
  .ghead span { color: var(--item); font-weight: 600; }
  .ghead em { font-style: normal; color: var(--muted); }
  .leaf { display: grid; grid-template-columns: 30px 1fr 44px; align-items: center; gap: 8px; height: 34px; padding: 0 10px; border: 1px solid color-mix(in oklab, var(--item) calc(25% + var(--on) * 75%), var(--line));
    border-left: 4px solid color-mix(in oklab, var(--item) calc(35% + max(var(--on), var(--done)) * 65%), var(--line)); border-radius: 6px; font-family: var(--font-mono); font-size: 14px;
    background: color-mix(in oklab, var(--item) calc(var(--on) * 22%), var(--panel)); box-shadow: 0 0 calc(var(--on) * 18px * var(--glow)) color-mix(in oklab, var(--item) 50%, transparent); }
  .leaf b { font-weight: 500; font-size: 12px; color: var(--muted); }
  .leaf i { justify-self: end; height: 4px; width: calc(var(--value) * 44px); background: var(--item); border-radius: 2px; }
  .strand { fill: none; stroke: var(--item); stroke-opacity: calc(.14 + var(--on, 0) * .3); stroke-width: calc(1px + var(--on, 0) * .5px); }
  .fan .mi-packet { fill: var(--item); }
  .fan .mi-beam { stroke-width: 2.5; }
  #root { position: absolute; left: 50%; bottom: 36px; translate: -50% 0; width: 270px; padding: 16px 12px 14px; text-align: center; z-index: 2;
    border: 2px solid var(--accent); border-radius: var(--radius); background: color-mix(in oklab, var(--accent) 8%, var(--panel));
    box-shadow: 0 0 calc((12px + var(--pulse) * 40px) * var(--glow)) color-mix(in oklab, var(--accent) 50%, transparent); }
  #root h2 { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 40px; line-height: 1; text-transform: var(--title-case); color: var(--accent); }
  .anchors { position: absolute; left: 20px; right: 20px; top: 0; display: flex; justify-content: space-between; }
  .anchors span { width: 2px; height: 2px; }
  .seed { position: absolute; left: 50%; bottom: 6px; width: 18px; height: 18px; translate: -50% 0; border-radius: 50%; background: var(--accent); box-shadow: 0 0 calc(6px + var(--pulse) * 22px) var(--accent); scale: calc(.8 + var(--pulse) * .4); }
  .caption { position: absolute; left: 50%; top: 0; translate: -50% 0; text-align: center; width: 280px; padding: 10px 0; z-index: 2; border-radius: var(--radius); background: color-mix(in oklab, var(--bg) 88%, transparent); }
  .caption b { display: block; font-family: var(--font-display); font-size: 26px; font-weight: var(--title-weight); text-transform: var(--title-case); color: var(--accent); margin-top: 6px; }
  .caption .mi-swap-host { height: 60px; }
  .meters { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .meter { padding: 14px 16px; border-top: 2px solid color-mix(in oklab, var(--item) calc(30% + var(--on) * 70%), var(--line)); background: color-mix(in oklab, var(--item) calc(var(--on) * 8%), transparent); }
  .meter .mi-label b { display: block; color: var(--ink); font-size: 16px; margin-top: 6px; font-weight: 500; }
  .eq { display: flex; gap: 4px; align-items: end; height: 42px; margin-top: 10px; }
  .eq i { flex: 1; background: var(--item); opacity: calc(.3 + var(--on) * .7); height: calc(var(--value) * 100%); }
  .squiggle { display: flex; justify-content: space-between; align-items: center; }
  .squiggle svg { width: 260px; height: 28px; }
</style>
</head>
<body data-canvas="portrait" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="0.9">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">SKILL FOREST / 20 NODES / 4 BRANCHES</span><span class="mi-meta">NODE <span data-counter="node">01</span> / 20 &middot; T <span data-clock></span></span></div>
    <h1 class="mi-title">Twenty skills, <em>one agent</em></h1>
    <div class="mi-sub"><span>SEE</span><span class="sep">&gt;</span><span>MAP</span><span class="sep">&gt;</span><span>MAKE</span><span class="sep">&gt;</span><span>SHIP</span></div>
    <div class="mi-rule" data-progress="grp"></div>
  </header>

  <section class="mi-body" data-cycle="grp" data-step="3" data-sfx="thump" data-accent data-master>
    <div class="fan" data-cycle="node" data-step="0.6" data-sfx="tick">
      <svg class="mi-svg">
        <g data-item="grp" data-index="0" style="--item:var(--c1)">
          <path class="strand" data-link="#l1@right #a3@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l1@right #a1@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l1@right #root@top" data-bend="0.55" data-packets="1" data-period="3" data-r="2"></path>
          <path class="strand" data-link="#l2@right #a5@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l2@right #a4@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l2@right #root@top" data-bend="0.55" data-packets="1" data-period="4" data-r="2"></path>
          <path class="strand" data-link="#l3@right #a2@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l3@right #a2@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l3@right #root@top" data-bend="0.55" data-packets="1" data-period="3" data-r="2"></path>
          <path class="strand" data-link="#l4@right #a4@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l4@right #a5@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l4@right #root@top" data-bend="0.55" data-packets="1" data-period="4" data-r="2"></path>
          <path class="strand" data-link="#l5@right #a1@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l5@right #a3@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l5@right #root@top" data-bend="0.55" data-packets="1" data-period="3" data-r="2"></path>
          <path class="mi-beam" data-link="#l1@right #root@top" data-bend="0.55" data-beam data-item="node" data-index="0" data-dot-r="4"></path>
          <path class="mi-beam" data-link="#l2@right #root@top" data-bend="0.55" data-beam data-item="node" data-index="1" data-dot-r="4"></path>
          <path class="mi-beam" data-link="#l3@right #root@top" data-bend="0.55" data-beam data-item="node" data-index="2" data-dot-r="4"></path>
          <path class="mi-beam" data-link="#l4@right #root@top" data-bend="0.55" data-beam data-item="node" data-index="3" data-dot-r="4"></path>
          <path class="mi-beam" data-link="#l5@right #root@top" data-bend="0.55" data-beam data-item="node" data-index="4" data-dot-r="4"></path>
        </g>
        <g data-item="grp" data-index="1" style="--item:var(--c2)">
          <path class="strand" data-link="#l6@left #a3@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l6@left #a1@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l6@left #root@top" data-bend="0.55" data-packets="1" data-period="4" data-r="2"></path>
          <path class="strand" data-link="#l7@left #a5@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l7@left #a4@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l7@left #root@top" data-bend="0.55" data-packets="1" data-period="3" data-r="2"></path>
          <path class="strand" data-link="#l8@left #a2@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l8@left #a2@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l8@left #root@top" data-bend="0.55" data-packets="1" data-period="4" data-r="2"></path>
          <path class="strand" data-link="#l9@left #a4@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l9@left #a5@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l9@left #root@top" data-bend="0.55" data-packets="1" data-period="3" data-r="2"></path>
          <path class="strand" data-link="#l10@left #a1@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l10@left #a3@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l10@left #root@top" data-bend="0.55" data-packets="1" data-period="4" data-r="2"></path>
          <path class="mi-beam" data-link="#l6@left #root@top" data-bend="0.55" data-beam data-item="node" data-index="5" data-dot-r="4"></path>
          <path class="mi-beam" data-link="#l7@left #root@top" data-bend="0.55" data-beam data-item="node" data-index="6" data-dot-r="4"></path>
          <path class="mi-beam" data-link="#l8@left #root@top" data-bend="0.55" data-beam data-item="node" data-index="7" data-dot-r="4"></path>
          <path class="mi-beam" data-link="#l9@left #root@top" data-bend="0.55" data-beam data-item="node" data-index="8" data-dot-r="4"></path>
          <path class="mi-beam" data-link="#l10@left #root@top" data-bend="0.55" data-beam data-item="node" data-index="9" data-dot-r="4"></path>
        </g>
        <g data-item="grp" data-index="2" style="--item:var(--c3)">
          <path class="strand" data-link="#l11@right #a3@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l11@right #a1@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l11@right #root@top" data-bend="0.55" data-packets="1" data-period="3" data-r="2"></path>
          <path class="strand" data-link="#l12@right #a5@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l12@right #a4@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l12@right #root@top" data-bend="0.55" data-packets="1" data-period="4" data-r="2"></path>
          <path class="strand" data-link="#l13@right #a2@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l13@right #a2@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l13@right #root@top" data-bend="0.55" data-packets="1" data-period="3" data-r="2"></path>
          <path class="strand" data-link="#l14@right #a4@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l14@right #a5@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l14@right #root@top" data-bend="0.55" data-packets="1" data-period="4" data-r="2"></path>
          <path class="strand" data-link="#l15@right #a1@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l15@right #a3@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l15@right #root@top" data-bend="0.55" data-packets="1" data-period="3" data-r="2"></path>
          <path class="mi-beam" data-link="#l11@right #root@top" data-bend="0.55" data-beam data-item="node" data-index="10" data-dot-r="4"></path>
          <path class="mi-beam" data-link="#l12@right #root@top" data-bend="0.55" data-beam data-item="node" data-index="11" data-dot-r="4"></path>
          <path class="mi-beam" data-link="#l13@right #root@top" data-bend="0.55" data-beam data-item="node" data-index="12" data-dot-r="4"></path>
          <path class="mi-beam" data-link="#l14@right #root@top" data-bend="0.55" data-beam data-item="node" data-index="13" data-dot-r="4"></path>
          <path class="mi-beam" data-link="#l15@right #root@top" data-bend="0.55" data-beam data-item="node" data-index="14" data-dot-r="4"></path>
        </g>
        <g data-item="grp" data-index="3" style="--item:var(--c4)">
          <path class="strand" data-link="#l16@left #a3@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l16@left #a1@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l16@left #root@top" data-bend="0.55" data-packets="1" data-period="4" data-r="2"></path>
          <path class="strand" data-link="#l17@left #a5@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l17@left #a4@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l17@left #root@top" data-bend="0.55" data-packets="1" data-period="3" data-r="2"></path>
          <path class="strand" data-link="#l18@left #a2@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l18@left #a2@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l18@left #root@top" data-bend="0.55" data-packets="1" data-period="4" data-r="2"></path>
          <path class="strand" data-link="#l19@left #a4@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l19@left #a5@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l19@left #root@top" data-bend="0.55" data-packets="1" data-period="3" data-r="2"></path>
          <path class="strand" data-link="#l20@left #a1@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l20@left #a3@top" data-bend="0.6"></path>
          <path class="strand" data-link="#l20@left #root@top" data-bend="0.55" data-packets="1" data-period="4" data-r="2"></path>
          <path class="mi-beam" data-link="#l16@left #root@top" data-bend="0.55" data-beam data-item="node" data-index="15" data-dot-r="4"></path>
          <path class="mi-beam" data-link="#l17@left #root@top" data-bend="0.55" data-beam data-item="node" data-index="16" data-dot-r="4"></path>
          <path class="mi-beam" data-link="#l18@left #root@top" data-bend="0.55" data-beam data-item="node" data-index="17" data-dot-r="4"></path>
          <path class="mi-beam" data-link="#l19@left #root@top" data-bend="0.55" data-beam data-item="node" data-index="18" data-dot-r="4"></path>
          <path class="mi-beam" data-link="#l20@left #root@top" data-bend="0.55" data-beam data-item="node" data-index="19" data-dot-r="4"></path>
        </g>
      </svg>
      <div class="side">
        <div class="group" style="--item:var(--c1)"><div class="ghead" data-item="grp" data-index="0" data-color="var(--c1)"><span>01 RESEARCH</span><em>SEE THE WORLD</em></div>
          <div id="l1" class="leaf" data-item="node" data-index="0"><b>01</b>agent-reach<i data-bar="0.72" data-jitter=".25"></i></div>
          <div id="l2" class="leaf" data-item="node" data-index="1"><b>02</b>last-30-days<i data-bar="0.49" data-jitter=".25"></i></div>
          <div id="l3" class="leaf" data-item="node" data-index="2"><b>03</b>deep-research<i data-bar="0.86" data-jitter=".25"></i></div>
          <div id="l4" class="leaf" data-item="node" data-index="3"><b>04</b>user-research<i data-bar="0.63" data-jitter=".25"></i></div>
          <div id="l5" class="leaf" data-item="node" data-index="4"><b>05</b>doc-search<i data-bar="0.40" data-jitter=".25"></i></div>
        </div>
        <div class="group" style="--item:var(--c3)"><div class="ghead" data-item="grp" data-index="2" data-color="var(--c3)"><span>03 CREATE</span><em>MAKE THE THING</em></div>
          <div id="l11" class="leaf" data-item="node" data-index="10"><b>11</b>ui-ux-max<i data-bar="0.82" data-jitter=".25"></i></div>
          <div id="l12" class="leaf" data-item="node" data-index="11"><b>12</b>slide-forge<i data-bar="0.59" data-jitter=".25"></i></div>
          <div id="l13" class="leaf" data-item="node" data-index="12"><b>13</b>scroll-world<i data-bar="0.36" data-jitter=".25"></i></div>
          <div id="l14" class="leaf" data-item="node" data-index="13"><b>14</b>visual-explain<i data-bar="0.73" data-jitter=".25"></i></div>
          <div id="l15" class="leaf" data-item="node" data-index="14"><b>15</b>tech-graph<i data-bar="0.50" data-jitter=".25"></i></div>
        </div>
      </div>
      <div class="caption">
        <div class="mi-label">ACTIVE BRANCH</div>
        <div class="mi-swap-host">
          <div class="mi-swap" data-item="grp" data-index="0"><b>Research</b></div>
          <div class="mi-swap" data-item="grp" data-index="1"><b>Engineer</b></div>
          <div class="mi-swap" data-item="grp" data-index="2"><b>Create</b></div>
          <div class="mi-swap" data-item="grp" data-index="3"><b>Ship</b></div>
        </div>
        <div class="mi-label"><span data-counter="grp" data-pad="2">01</span> / 04 &middot; <span data-counter="node">01</span> / 20</div>
      </div>
      <div class="side r">
        <div class="group" style="--item:var(--c2)"><div class="ghead" data-item="grp" data-index="1" data-color="var(--c2)"><span>02 ENGINEER</span><em>MAP THE SYSTEM</em></div>
          <div id="l6" class="leaf" data-item="node" data-index="5"><b>06</b>graph-map<i data-bar="0.77" data-jitter=".25"></i></div>
          <div id="l7" class="leaf" data-item="node" data-index="6"><b>07</b>pony-trail<i data-bar="0.54" data-jitter=".25"></i></div>
          <div id="l8" class="leaf" data-item="node" data-index="7"><b>08</b>napkin<i data-bar="0.91" data-jitter=".25"></i></div>
          <div id="l9" class="leaf" data-item="node" data-index="8"><b>09</b>debt-audit<i data-bar="0.68" data-jitter=".25"></i></div>
          <div id="l10" class="leaf" data-item="node" data-index="9"><b>10</b>explain-any<i data-bar="0.45" data-jitter=".25"></i></div>
        </div>
        <div class="group" style="--item:var(--c4)"><div class="ghead" data-item="grp" data-index="3" data-color="var(--c4)"><span>04 SHIP</span><em>DELIVER IT</em></div>
          <div id="l16" class="leaf" data-item="node" data-index="15"><b>16</b>seo-audit<i data-bar="0.87" data-jitter=".25"></i></div>
          <div id="l17" class="leaf" data-item="node" data-index="16"><b>17</b>humanizer<i data-bar="0.64" data-jitter=".25"></i></div>
          <div id="l18" class="leaf" data-item="node" data-index="17"><b>18</b>auto-research<i data-bar="0.41" data-jitter=".25"></i></div>
          <div id="l19" class="leaf" data-item="node" data-index="18"><b>19</b>video-shot<i data-bar="0.78" data-jitter=".25"></i></div>
          <div id="l20" class="leaf" data-item="node" data-index="19"><b>20</b>ffmpeg-kit<i data-bar="0.55" data-jitter=".25"></i></div>
        </div>
      </div>
      <div id="root" data-pulse="1.5">
        <div class="anchors"><span id="a1"></span><span id="a2"></span><span id="a3"></span><span id="a4"></span><span id="a5"></span></div>
        <h2>Agent</h2>
        <div class="mi-label">ROOT &middot; 20 LIVE</div>
      </div>
      <div class="seed" data-pulse="1.5"></div>
    </div>

    <div class="meters">
      <div class="mi-card meter" data-item="grp" data-index="0" style="--item:var(--c1)"><div class="mi-label">LIVE NODES<b>05 / 05</b></div><div class="eq"><i data-bar=".5" data-jitter=".3"></i><i data-bar=".8" data-jitter=".2"></i><i data-bar=".4" data-jitter=".3"></i><i data-bar=".7" data-jitter=".2"></i><i data-bar=".9" data-jitter=".1"></i><i data-bar=".3" data-jitter=".3"></i><i data-bar=".6" data-jitter=".2"></i><i data-bar=".8" data-jitter=".2"></i></div></div>
      <div class="mi-card meter" data-item="grp" data-index="1" style="--item:var(--c2)"><div class="mi-label">MAPPED<b>ROOT &gt; BRANCH</b></div><div class="eq"><i data-bar=".6" data-jitter=".2"></i><i data-bar=".4" data-jitter=".3"></i><i data-bar=".7" data-jitter=".2"></i><i data-bar=".5" data-jitter=".3"></i><i data-bar=".8" data-jitter=".2"></i><i data-bar=".6" data-jitter=".3"></i><i data-bar=".3" data-jitter=".2"></i><i data-bar=".7" data-jitter=".2"></i></div></div>
      <div class="mi-card meter" data-item="grp" data-index="2" style="--item:var(--c3)"><div class="mi-label">BUILT<b>12 ARTIFACTS</b></div><div class="eq"><i data-bar=".4" data-jitter=".3"></i><i data-bar=".7" data-jitter=".2"></i><i data-bar=".5" data-jitter=".3"></i><i data-bar=".9" data-jitter=".1"></i><i data-bar=".6" data-jitter=".2"></i><i data-bar=".4" data-jitter=".3"></i><i data-bar=".8" data-jitter=".2"></i><i data-bar=".5" data-jitter=".3"></i></div></div>
      <div class="mi-card meter" data-item="grp" data-index="3" style="--item:var(--c4)"><div class="mi-label">SHIPPED<b>WORKING SYSTEM</b></div><div class="eq"><i data-bar=".7" data-jitter=".2"></i><i data-bar=".5" data-jitter=".3"></i><i data-bar=".8" data-jitter=".2"></i><i data-bar=".4" data-jitter=".3"></i><i data-bar=".6" data-jitter=".2"></i><i data-bar=".9" data-jitter=".1"></i><i data-bar=".5" data-jitter=".3"></i><i data-bar=".7" data-jitter=".2"></i></div></div>
    </div>
    <div class="squiggle mi-label"><span>20 NODES FEED ONE ROOT &middot; EVERY STRAND IS A CALL PATH</span><svg viewBox="0 0 260 28" preserveAspectRatio="none" data-sine data-waves="5" data-speed="6"></svg></div>
  </section>

  <footer class="mi-foot"><span>SOURCE / SKILL REGISTRY, SEP 2026</span><span class="path">SEE &gt; MAP &gt; MAKE &gt; SHIP</span><span class="mark">fieldnotes</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Item count**: 4 groups × 4-6 leaves. The node cycle period (leaves × step) must equal the group period
  (group step × 4): 20 × 0.6 = 12 = 4 × 3. For 16 leaves use node 0.75 s and group 3 s.
- **3 groups**: put 2 left and 1 right (or a single column at the top), step 4 s.
- **Square**: 4 leaves per group, remove the meters row.
- **Landscape**: put the root on the right and the groups in two columns on the left; links become `@right` →
  `#root@left`.
- **Pitfalls**: 60 strands + 20 beams is fine; more than ~120 paths slows export. Keep leaf names ≤ 16 characters.
  Strand colour is `var(--item)` of the group `g` — set `style="--item: var(--cN)"` on each `g`.
