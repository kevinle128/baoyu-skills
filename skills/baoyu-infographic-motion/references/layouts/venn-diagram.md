# venn-diagram

Two or three overlapping sets: what each set has alone, what pairs share, and what all share.

## Use when / Avoid when

- **Use when**: skill overlaps, market segments, "sweet spot" arguments, concept relationships, positioning.
- **Avoid when**: more than 3 sets (use `comparison-matrix`), or the overlaps have no meaning of their own.

## Structure

- **Venn** (560×560 box): an SVG with three `.set` circles and four `.lens` highlight circles clipped by `clipPath`s (A∩B, B∩C, A∩C, A∩B∩C). HTML `.tag` labels are absolutely placed in the same pixel space; set names sit in three corners.
- **Legend** (right column): one `.mi-row` per region with a swatch and share.
- **Detail**: swap panel per region (big count-up share, name, sentence, chips).
- **Share bar**: stacked segments sized by share (`flex: var(--w)`), one per region.
- 7 regions for 3 sets (3 for 2 sets).

## Motion recipe

- **Master cycle** `main`, `data-step="1.6"`, 7 steps: A only, B only, C only, A∩B, B∩C, A∩C, centre. Circle, tag, legend row, swap and share segment share `data-index`.
- **Circles pulse**: each set has `data-pulse="3.2"` with `data-phase-offset` 0 / 0.33 / 0.66, so the stroke width breathes in a rotating wave. When a set is active its fill and stroke grow.
- **Intersection highlights**: the lens circles are items for steps 3–6. Clipping one circle by another (`<g clip-path="url(#vB)"><circle A>`) paints exactly the lens; nesting two clip groups paints the triple centre. Their fill uses the page accent.
- **Accent**: pair regions use `data-color="color-mix(in oklab, var(--c1), var(--c2))"`, so the accent becomes the blend of the two sets; the centre uses `--c4`.
- **Sound**: `blip` per region.
- **Length**: 7 × 1.6 s × 2 = 22.4 s.

## Skeleton

Portrait 1080×1350. Paste it over the `index.html` that `main.ts init` creates, then replace the content.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>The Data Science Venn</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-body { display: grid; grid-template-columns: 560px 1fr; grid-template-rows: 560px 1fr auto; gap: 22px 26px; }
  .venn { position: relative; width: 560px; height: 540px; }
  .venn svg { position: absolute; inset: 0; width: 560px; height: 540px; overflow: visible; }
  .set { fill: color-mix(in oklab, var(--item) calc(12% + var(--on) * 22%), transparent); stroke: var(--item); stroke-width: calc(2px + var(--pulse) * 2.5px + var(--on) * 2px); }
  .lens { fill: color-mix(in oklab, var(--accent) calc(var(--on) * 60%), transparent); }
  .tag { position: absolute; translate: -50% -50%; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 6px 10px; border-radius: 10px; text-align: center; font-family: var(--font-mono); font-size: 13px; line-height: 1.2; background: color-mix(in oklab, var(--panel) calc(50% + var(--on) * 45%), transparent); border: 1px solid color-mix(in oklab, var(--accent) calc(var(--on) * 100%), transparent); scale: calc(1 + var(--on) * 0.1); }
  .tag b { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 17px; text-transform: var(--title-case); }
  .tag.center b { font-size: 20px; color: var(--accent); }
  .setname { position: absolute; font-family: var(--font-display); font-weight: var(--title-weight); font-size: 24px; text-transform: var(--title-case); color: var(--item); }
  .setname small { display: block; font-family: var(--font-mono); font-weight: 400; font-size: 12px; color: var(--muted); letter-spacing: 0.06em; }
  .legend { display: flex; flex-direction: column; gap: 9px; }
  .legend .mi-row { font-size: 14px; padding: 10px 12px; }
  .legend .mi-row .sw { width: 12px; height: 12px; border-radius: 50%; flex: none; background: var(--item); }
  .legend .mi-row em { margin-left: auto; font-style: normal; font-weight: 600; color: var(--item); }
  .detail { grid-column: 1 / -1; }
  .share { grid-column: 1 / -1; display: flex; flex-direction: column; gap: 8px; }
  .stack { display: flex; gap: 4px; height: 34px; }
  .stack i { flex: var(--w); border-radius: 6px; background: color-mix(in oklab, var(--item) calc(35% + var(--on) * 65%), var(--panel)); display: grid; place-items: center; font-style: normal; font-family: var(--font-mono); font-size: 12px; color: var(--ink); }
  .detail .mi-swap { padding: 22px 26px; display: grid; grid-template-columns: 220px 1fr; gap: 6px 28px; align-content: center; }
  .detail .big { grid-row: 1 / 5; font-family: var(--font-display); font-weight: var(--title-weight); font-size: 88px; line-height: 1; color: var(--item); font-variant-numeric: tabular-nums; align-self: center; }
  .detail h4 { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 32px; text-transform: var(--title-case); color: var(--item); }
  .detail p { font-size: 14px; line-height: 1.45; color: var(--muted); }
  .detail .chips { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
</style>
</head>
<body data-canvas="portrait" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="0.9">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">DATA CAREERS / SKILL MAP / AFTER CONWAY</span><span class="mi-meta">REGION <span data-counter="main">01</span> / 07</span></div>
    <h1 class="mi-title">Where <em>data science</em> lives</h1>
    <div class="mi-sub"><span>HACKING</span><span class="sep">&cap;</span><span>MATH + STATS</span><span class="sep">&cap;</span><span>DOMAIN</span></div>
    <div class="mi-rule" data-progress="main"></div>
  </header>

  <section class="mi-body" data-cycle="main" data-step="1.6" data-sfx="blip" data-accent data-master>
    <div class="venn">
      <svg viewBox="0 0 560 540">
        <defs>
          <clipPath id="vA"><circle cx="190" cy="235" r="158"></circle></clipPath>
          <clipPath id="vB"><circle cx="370" cy="235" r="158"></circle></clipPath>
          <clipPath id="vC"><circle cx="280" cy="380" r="158"></circle></clipPath>
        </defs>
        <circle class="set" cx="190" cy="235" r="158" data-item="main" data-index="0" data-color="var(--c1)" data-pulse="3.2" style="--item: var(--c1)"></circle>
        <circle class="set" cx="370" cy="235" r="158" data-item="main" data-index="1" data-color="var(--c2)" data-pulse="3.2" data-phase-offset="0.33" style="--item: var(--c2)"></circle>
        <circle class="set" cx="280" cy="380" r="158" data-item="main" data-index="2" data-color="var(--c3)" data-pulse="3.2" data-phase-offset="0.66" style="--item: var(--c3)"></circle>
        <g clip-path="url(#vB)"><circle class="lens" cx="190" cy="235" r="158" data-item="main" data-index="3"></circle></g>
        <g clip-path="url(#vC)"><circle class="lens" cx="370" cy="235" r="158" data-item="main" data-index="4"></circle></g>
        <g clip-path="url(#vC)"><circle class="lens" cx="190" cy="235" r="158" data-item="main" data-index="5"></circle></g>
        <g clip-path="url(#vB)"><g clip-path="url(#vC)"><circle class="lens" cx="190" cy="235" r="158" data-item="main" data-index="6"></circle></g></g>
      </svg>
      <div class="setname" style="--item: var(--c1); left: 0; top: 0">Hacking<small>CODE, DATA WRANGLING</small></div>
      <div class="setname" style="--item: var(--c2); right: 0; top: 0; text-align: right">Math + stats<small>MODELS, INFERENCE</small></div>
      <div class="setname" style="--item: var(--c3); left: 0; bottom: 0">Domain<small>SUBSTANTIVE EXPERTISE</small></div>
      <div class="tag" data-item="main" data-index="0" style="left: 112px; top: 200px">only<b>Scripts</b></div>
      <div class="tag" data-item="main" data-index="1" style="left: 448px; top: 200px">only<b>Theory</b></div>
      <div class="tag" data-item="main" data-index="2" style="left: 280px; top: 470px">only<b>Know-how</b></div>
      <div class="tag" data-item="main" data-index="3" style="left: 280px; top: 158px">A &cap; B<b>Machine learning</b></div>
      <div class="tag" data-item="main" data-index="4" style="left: 372px; top: 345px">B &cap; C<b>Research</b></div>
      <div class="tag" data-item="main" data-index="5" style="left: 188px; top: 345px">A &cap; C<b>Danger zone</b></div>
      <div class="tag center" data-item="main" data-index="6" style="left: 280px; top: 280px">A &cap; B &cap; C<b>Data science</b></div>
    </div>

    <div class="legend">
      <span class="mi-label">REGION / SHARE OF JOB POSTS</span>
      <div class="mi-row" data-item="main" data-index="0" data-color="var(--c1)" style="--item: var(--c1)"><i class="sw"></i>Hacking only<em>18%</em></div>
      <div class="mi-row" data-item="main" data-index="1" data-color="var(--c2)" style="--item: var(--c2)"><i class="sw"></i>Math only<em>6%</em></div>
      <div class="mi-row" data-item="main" data-index="2" data-color="var(--c3)" style="--item: var(--c3)"><i class="sw"></i>Domain only<em>21%</em></div>
      <div class="mi-row" data-item="main" data-index="3" data-color="color-mix(in oklab, var(--c1), var(--c2))" style="--item: color-mix(in oklab, var(--c1), var(--c2))"><i class="sw"></i>Machine learning<em>24%</em></div>
      <div class="mi-row" data-item="main" data-index="4" data-color="color-mix(in oklab, var(--c2), var(--c3))" style="--item: color-mix(in oklab, var(--c2), var(--c3))"><i class="sw"></i>Traditional research<em>9%</em></div>
      <div class="mi-row" data-item="main" data-index="5" data-color="color-mix(in oklab, var(--c1), var(--c3))" style="--item: color-mix(in oklab, var(--c1), var(--c3))"><i class="sw"></i>Danger zone<em>7%</em></div>
      <div class="mi-row" data-item="main" data-index="6" data-color="var(--c4)" style="--item: var(--c4)"><i class="sw"></i>Data science<em>15%</em></div>
      <span class="mi-label" style="margin-top: auto">N = 12,400 POSTINGS / 2026</span>
    </div>

    <div class="mi-card detail mi-swap-host">
      <div class="mi-swap" data-item="main" data-index="0" style="--item: var(--c1)"><span class="big" data-count="18" data-suffix="%">18%</span><span class="mi-label acc">SET A / HACKING ONLY</span><h4>Scripts, no model</h4><p>Pipelines and dashboards. Strong tooling, weak on why the numbers move.</p><div class="chips"><span class="mi-chip">python</span><span class="mi-chip">sql</span><span class="mi-chip">airflow</span></div></div>
      <div class="mi-swap" data-item="main" data-index="1" style="--item: var(--c2)"><span class="big" data-count="6" data-suffix="%">6%</span><span class="mi-label acc">SET B / MATH ONLY</span><h4>Theory on paper</h4><p>Proofs and priors. Rarely shipped unless paired with an engineer.</p><div class="chips"><span class="mi-chip">bayes</span><span class="mi-chip">proofs</span><span class="mi-chip">R</span></div></div>
      <div class="mi-swap" data-item="main" data-index="2" style="--item: var(--c3)"><span class="big" data-count="21" data-suffix="%">21%</span><span class="mi-label acc">SET C / DOMAIN ONLY</span><h4>Knows the business</h4><p>Asks the right question, but needs help to answer it with data.</p><div class="chips"><span class="mi-chip">finance</span><span class="mi-chip">health</span><span class="mi-chip">ops</span></div></div>
      <div class="mi-swap" data-item="main" data-index="3" style="--item: color-mix(in oklab, var(--c1), var(--c2))"><span class="big" data-count="24" data-suffix="%">24%</span><span class="mi-label acc">A &cap; B / MACHINE LEARNING</span><h4>Models that run</h4><p>The biggest single region. Great models, sometimes for the wrong problem.</p><div class="chips"><span class="mi-chip">pytorch</span><span class="mi-chip">xgboost</span><span class="mi-chip">mlops</span></div></div>
      <div class="mi-swap" data-item="main" data-index="4" style="--item: color-mix(in oklab, var(--c2), var(--c3))"><span class="big" data-count="9" data-suffix="%">9%</span><span class="mi-label acc">B &cap; C / TRADITIONAL RESEARCH</span><h4>Rigorous and slow</h4><p>Sound studies in the field, limited by manual data work.</p><div class="chips"><span class="mi-chip">trials</span><span class="mi-chip">surveys</span><span class="mi-chip">stata</span></div></div>
      <div class="mi-swap" data-item="main" data-index="5" style="--item: color-mix(in oklab, var(--c1), var(--c3))"><span class="big" data-count="7" data-suffix="%">7%</span><span class="mi-label acc">A &cap; C / DANGER ZONE</span><h4>Confident, not calibrated</h4><p>Can build and knows the field, but misses bias and variance. Handle with care.</p><div class="chips"><span class="mi-chip">p-hacking</span><span class="mi-chip">leakage</span></div></div>
      <div class="mi-swap" data-item="main" data-index="6" style="--item: var(--c4)"><span class="big" data-count="15" data-suffix="%">15%</span><span class="mi-label acc">A &cap; B &cap; C / DATA SCIENCE</span><h4>All three at once</h4><p>Rare in one person. Most teams build this region out of two or three people.</p><div class="chips"><span class="mi-chip">end to end</span><span class="mi-chip">causal</span><span class="mi-chip">shipped</span></div></div>
    </div>
    <div class="share">
      <div class="mi-label" style="display:flex;justify-content:space-between"><span>SHARE OF POSTINGS BY REGION</span><span>100%</span></div>
      <div class="stack"><i data-item="main" data-index="0" style="--w: 18; --item: var(--c1)">18%</i><i data-item="main" data-index="1" style="--w: 6; --item: var(--c2)">6%</i><i data-item="main" data-index="2" style="--w: 21; --item: var(--c3)">21%</i><i data-item="main" data-index="3" style="--w: 24; --item: color-mix(in oklab, var(--c1), var(--c2))">24%</i><i data-item="main" data-index="4" style="--w: 9; --item: color-mix(in oklab, var(--c2), var(--c3))">9%</i><i data-item="main" data-index="5" style="--w: 7; --item: color-mix(in oklab, var(--c1), var(--c3))">7%</i><i data-item="main" data-index="6" style="--w: 15; --item: var(--c4)">15%</i></div>
    </div>
  </section>

  <section class="mi-band">
    <div class="mi-stat" style="--item: var(--c1)"><span class="mi-stat-v">3</span><span class="mi-stat-l">Skill sets</span></div>
    <div class="mi-stat" style="--item: var(--c2)"><span class="mi-stat-v">24%</span><span class="mi-stat-l">Largest region: ML</span></div>
    <div class="mi-stat" style="--item: var(--c4)"><span class="mi-stat-v" data-ticker="15" data-jitter="0.5" data-suffix="%">15%</span><span class="mi-stat-l">Full overlap</span></div>
  </section>

  <footer class="mi-foot"><span>SOURCE / JOB POSTING SAMPLE, 2026</span><span class="path">HACKING &cap; MATH &cap; DOMAIN</span><span class="mark">studio</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Two sets**: two circles at `(190, 270)` and `(370, 270)`, r = 170, one lens (`<g clip-path="url(#vB)"><circle A>`), 3 regions; delete the C clip path, circle, tags and rows.
- **Moving the circles**: circle centres appear three times (clip path, set, lens). Change all copies, then move the `.tag` `left` / `top` values; tags use the same pixel space as the SVG `viewBox`.
- **Square**: drop the share bar and shrink the detail panel. **Landscape**: venn left (700 px box, scale the geometry by 1.25), legend and detail on the right.
- **Pitfalls**: keep tags inside their region; the pair-region tags need ~180 px of lens width, so keep circle overlap near 50% of the radius. Tags keep a 50% panel background at rest so they stay legible over circle strokes.
