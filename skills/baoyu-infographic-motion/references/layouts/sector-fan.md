# sector-fan

An ecosystem map: a dark hub on the left edge, a half-circle fan of 6 labelled wedge sectors opening to the right,
and from each wedge a right-angle trunk that runs into its own band of 3-4 items (icon + name + one-line note). Each
band carries a small junction label on its bus line. The master cycle walks the sectors: the wedge fills with its
colour, a beam runs the trunk and the bus, and that band's items lift and tint.

## Use when / Avoid when

- **Use when**: an ecosystem or stack overview ("the open-source AI stack", "a cloud platform's services", "the
  data tooling landscape"), 5-6 categories with 3-4 named members each, a "map of everything" poster.
- **Avoid when**: the categories are sequential (use `card-pipeline` or `linear-progression`), items need metrics or
  long text (use `bento-grid` or `orbit-panel`), there are more than 6 sectors or more than 4 items per sector (bands
  get too thin), or there is a single parent → children tree with depth (use `tree-branching`).

## Structure

Canvas `landscape` 1920×1080. A normal header (`.mi-top`, `.mi-title`, `.mi-sub`), no stat band, footer.

- **Stage** `.mi-body` (the master cycle) holds three layers:
  - `.mi-svg` overlay with, per sector, a trunk edge (elbow, ambient packet), a trunk beam, a dotted bus edge and a
    bus beam.
  - `.fan` box (350×700, vertically centred at the left edge): an SVG with a dashed ring, 6 `g.wedge` groups (annular
    wedge `path` + rotated `text`, one per 30°), the hub circle half cut off by the page edge, and hub text. 6 invisible
    `.anc#wK` anchors sit on the outer arc at each wedge's middle angle so connectors can find them.
  - `.bands` column (left 440 px to the right edge, `space-around`): 6 `.band` rows, each with a left anchor `#rK`, a
    right anchor `#eK`, a junction label `.jl` and a 4-column `.its` grid of `.it` entries.
- **Icons** are tiny inline SVGs injected by `MotionSetup` from `data-ico` names (24×24, classes `.f` pastel fill,
  `.s` ink stroke, `.a` solid accent). They work in any style: the page gives low-specificity `:where(.mi-ico)`
  fallbacks and `pastel-schematic` adds its own glow and scale.

Wedge geometry (hub at `0,350` in the fan SVG, inner radius 130, outer 340, sector K spans −90+30K° to −60+30K°):

| K | wedge `d` | anchor `left, top` | label `translate` / `rotate` |
|---|-----------|--------------------|------------------------------|
| 0 | `M0.0,10.0 A340,340 0 0 1 170.0,55.6 L65.0,237.4 A130,130 0 0 0 0.0,220.0 Z` | 88.0, 21.6 | 60.8 123.0 / −75 |
| 1 | `M170.0,55.6 A340,340 0 0 1 294.4,180.0 L112.6,285.0 A130,130 0 0 0 65.0,237.4 Z` | 240.4, 109.6 | 166.2 183.8 / −45 |
| 2 | `M294.4,180.0 A340,340 0 0 1 340.0,350.0 L130.0,350.0 A130,130 0 0 0 112.6,285.0 Z` | 328.4, 262.0 | 227.0 289.2 / −15 |
| 3 | `M340.0,350.0 A340,340 0 0 1 294.4,520.0 L112.6,415.0 A130,130 0 0 0 130.0,350.0 Z` | 328.4, 438.0 | 227.0 410.8 / 15 |
| 4 | `M294.4,520.0 A340,340 0 0 1 170.0,644.4 L65.0,462.6 A130,130 0 0 0 112.6,415.0 Z` | 240.4, 590.4 | 166.2 516.2 / 45 |
| 5 | `M170.0,644.4 A340,340 0 0 1 0.0,690.0 L0.0,480.0 A130,130 0 0 0 65.0,462.6 Z` | 88.0, 678.4 | 60.8 577.0 / 75 |

## Motion recipe

- **Master cycle** `main` on `.mi-body`: 6 sectors × `data-step="2"` = 12 s, `data-cycles="2"` (24 s),
  `data-sfx="blip"`, `data-accent` (the title accent and crumb follow the active wedge colour).
- **Items**: each `g.wedge` (with `data-color`) and each `.band` is an item with the same `data-index`. The wedge
  fill mixes 14 % → 100 % of `--item` with `--on`, its label turns white. Band entries tint, lift 4 px and go from
  72 % to full opacity with `max(--on, --done)`, so every band stays readable.
- **Beams**: trunk beam `#wK@right → #rK@left` (`data-shape="elbow"`, `data-draw="0.6"`, `data-sfx-end="packet"`),
  then the bus beam `#rK@right → #eK@left` (straight, `data-draw="1.2"`, no dot) draws across the band.
- **Ambient**: every trunk edge carries 1 packet (`data-period="3"`, `data-phase-offset` K/6 so they do not move in
  step); the hub breathes with `data-pulse="2"`.
- **Sound**: `blip` per sector + `packet` when the trunk beam lands (24 cues in 24 s).
- **Poster**: `data-poster="4.9"` (sector 3 lit with both beams fully drawn).

## Skeleton

The wedges, anchors, connectors and bands repeat per sector; generate them with a small loop when you change the
content (the geometry table above gives every number).

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>The Open-Source AI Stack</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-page { gap: 14px; }
  .mi-head { gap: 6px; }
  .mi-title { font-size: calc(var(--title-size) * .95); }
  .fan { position: absolute; left: 0; top: calc(50% - 350px); width: 350px; height: 700px; }
  .fan svg { position: absolute; inset: 0; width: 350px; height: 700px; overflow: visible; }
  .wedge path { fill: color-mix(in oklab, var(--item) calc(14% + var(--on) * 86%), var(--panel)); stroke: var(--bg); stroke-width: 5; }
  .wedge text { font-family: var(--font-display); font-weight: 700; font-size: 19px; text-anchor: middle; dominant-baseline: middle;
    fill: color-mix(in oklab, #fff calc(var(--on) * 100%), color-mix(in oklab, var(--item) 75%, var(--ink))); }
  .hub { fill: var(--ink); }
  .hub-t { font-family: var(--font-display); font-weight: 800; font-size: 26px; fill: var(--bg); text-anchor: middle; }
  .hub-s { font-family: var(--font-mono); font-size: 13px; fill: var(--bg); opacity: .7; text-anchor: middle; }
  .ring { fill: none; stroke: var(--line); stroke-width: 1.5; stroke-dasharray: 3 6; }
  .anc { position: absolute; width: 2px; height: 2px; translate: -1px -1px; }
  .bands { position: absolute; left: 440px; right: 0; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: space-around; }
  .band { position: relative; height: 104px; padding-left: 22px; display: flex; flex-direction: column; justify-content: flex-end; }
  .band .r { left: 0; top: 30px; }
  .band .e { right: 0; top: 30px; }
  .jl { position: absolute; left: 30px; top: 6px; font-family: var(--font-mono); font-size: 13px; letter-spacing: .04em; text-transform: var(--label-case);
    padding: 0 8px; background: var(--bg); color: color-mix(in oklab, var(--item) 80%, var(--ink)); }
  .its { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .it { display: flex; gap: 10px; align-items: flex-start; padding: 8px 10px; border-radius: calc(var(--radius) * .6);
    background: color-mix(in oklab, var(--item) calc(var(--on) * 10%), transparent);
    translate: 0 calc(var(--on) * -4px); opacity: calc(.72 + max(var(--on), var(--done)) * .28); }
  .it .mi-ico { flex: none; width: 34px; height: 34px; }
  .it b { display: block; font-family: var(--font-display); font-weight: 700; font-size: 17px; line-height: 1.2; color: var(--ink); }
  .it small { display: block; font-family: var(--font-body); font-size: 13px; line-height: 1.35; color: var(--muted); margin-top: 2px; }
  :where(.mi-ico) .f { fill: color-mix(in oklab, var(--item) 20%, var(--panel)); }
  :where(.mi-ico) .s { fill: none; stroke: var(--ink); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  :where(.mi-ico) .a { fill: var(--item); }
  .bus { stroke-dasharray: 2 5; opacity: .7; }
  .mi-body .mi-beam { stroke: var(--item); }
</style>
<script>
window.MotionSetup = (M) => {
  const I = {
    chip: '<rect class="f" x="5" y="5" width="14" height="14" rx="2"/><rect class="s" x="5" y="5" width="14" height="14" rx="2"/><rect class="a" x="9" y="9" width="6" height="6"/><path class="s" d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
    eye: '<path class="f" d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><path class="s" d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle class="a" cx="12" cy="12" r="3"/>',
    wave: '<rect class="f" x="3" y="4" width="18" height="16" rx="3"/><path class="s" d="M6 12h1M9 8v8M12 5v14M15 9v6M18 11v2"/><circle class="a" cx="12" cy="12" r="1.6"/>',
    vec: '<rect class="f" x="3" y="3" width="18" height="18" rx="3"/><path class="s" d="M5 19L19 5M19 5h-6M19 5v6"/><circle class="a" cx="5" cy="19" r="2"/>',
    flow: '<rect class="f" x="3" y="3" width="7" height="7" rx="2"/><rect class="s" x="3" y="3" width="7" height="7" rx="2"/><rect class="s" x="14" y="14" width="7" height="7" rx="2"/><rect class="a" x="14" y="3" width="7" height="7" rx="2"/><path class="s" d="M10 6.5h4M17.5 10v4M6.5 10v7.5H14"/>',
    doc: '<path class="f" d="M6 2h9l4 4v16H6z"/><path class="s" d="M6 2h9l4 4v16H6zM15 2v4h4M9 11h7M9 15h7"/><rect class="a" x="9" y="18" width="4" height="2"/>',
    plug: '<path class="f" d="M7 8h10v5a5 5 0 0 1-10 0z"/><path class="s" d="M7 8h10v5a5 5 0 0 1-10 0zM9 8V3M15 8V3M12 18v4"/><circle class="a" cx="12" cy="12" r="1.8"/>',
    bolt: '<circle class="f" cx="12" cy="12" r="10"/><circle class="s" cx="12" cy="12" r="10"/><path class="a" d="M13 4l-6 9h5l-1 7 6-9h-5z"/>',
    cpu: '<rect class="f" x="3" y="5" width="18" height="12" rx="2"/><path class="s" d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10H3zM1 20h22"/><rect class="a" x="10" y="9" width="4" height="4"/>',
    gate: '<rect class="f" x="3" y="3" width="18" height="18" rx="4"/><path class="s" d="M3 12h6M15 7h6M15 17h6M9 12l6-5M9 12l6 5"/><circle class="a" cx="9" cy="12" r="2.2"/>',
    zip: '<rect class="f" x="4" y="2" width="16" height="20" rx="2"/><rect class="s" x="4" y="2" width="16" height="20" rx="2"/><path class="s" d="M12 2v4M12 8v2M12 12v2"/><rect class="a" x="10" y="15" width="4" height="4" rx="1"/>',
    db: '<ellipse class="f" cx="12" cy="6" rx="8" ry="3"/><path class="f" d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path class="s" d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><ellipse class="s" cx="12" cy="6" rx="8" ry="3"/><path class="a" d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3v2c0 1.7-3.6 3-8 3s-8-1.3-8-3z"/>',
    stack: '<path class="f" d="M12 3l9 5-9 5-9-5z"/><path class="s" d="M12 3l9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5"/><path class="a" d="M12 6l4 2-4 2-4-2z"/>',
    clock: '<circle class="f" cx="12" cy="12" r="10"/><circle class="s" cx="12" cy="12" r="10"/><path class="s" d="M12 6v6l4 2"/><circle class="a" cx="12" cy="12" r="1.8"/>',
    check: '<rect class="f" x="3" y="3" width="18" height="18" rx="4"/><rect class="s" x="3" y="3" width="18" height="18" rx="4"/><path class="s" d="M7 12l3.5 3.5L17 9"/><circle class="a" cx="18" cy="6" r="2.5"/>',
    shield: '<path class="f" d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"/><path class="s" d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"/><path class="a" d="M12 7l4 1.5v3c0 2.5-1.7 4.5-4 5.5z"/>',
    flag: '<path class="f" d="M5 3h12l-3 5 3 5H5z"/><path class="s" d="M5 22V3h12l-3 5 3 5H5"/><circle class="a" cx="10" cy="8" r="2"/>',
    box: '<path class="f" d="M12 2l9 5v10l-9 5-9-5V7z"/><path class="s" d="M12 2l9 5v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10"/><path class="a" d="M12 2l9 5-9 5-9-5z" opacity=".55"/>',
    chart: '<rect class="f" x="3" y="3" width="18" height="18" rx="3"/><path class="s" d="M3 21h18M6 17l4-5 3 3 5-7"/><circle class="a" cx="18" cy="8" r="2"/>',
    loop: '<circle class="f" cx="12" cy="12" r="9"/><path class="s" d="M20 12a8 8 0 1 1-2.3-5.7M20 4v4h-4"/><circle class="a" cx="12" cy="12" r="3"/>',
  };
  document.querySelectorAll("[data-ico]").forEach((el) => {
    el.innerHTML = '<svg viewBox="0 0 24 24">' + (I[el.dataset.ico] || I.box) + "</svg>";
  });
};
</script>
</head>
<body data-canvas="landscape" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="4.9">
<main class="mi-page">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">Ecosystem map · 2026</span><span class="mi-meta">Layer <span data-counter="main">01</span> / 06</span></div>
    <h1 class="mi-title">The open-source <em>AI stack</em></h1>
    <div class="mi-sub"><span>6 layers</span><span class="sep">·</span><span>21 building blocks</span><span class="sep">·</span><span>from weights to production</span></div>
  </header>

  <section class="mi-body" data-cycle="main" data-step="2" data-sfx="blip" data-accent data-master>
    <svg class="mi-svg">
      <g style="--item:var(--c1)"><path class="mi-edge" data-link="#w0@right #r0@left" data-shape="elbow" data-packets="1" data-period="3" data-phase-offset="0.00"></path><path class="mi-beam" data-link="#w0@right #r0@left" data-shape="elbow" data-beam data-item="main" data-index="0" data-draw="0.6" data-sfx-end="packet"></path><path class="mi-edge bus" data-link="#r0@right #e0@left" data-shape="straight"></path><path class="mi-beam" data-link="#r0@right #e0@left" data-shape="straight" data-beam data-item="main" data-index="0" data-draw="1.2" data-dot="0"></path></g>
      <g style="--item:var(--c2)"><path class="mi-edge" data-link="#w1@right #r1@left" data-shape="elbow" data-packets="1" data-period="3" data-phase-offset="0.17"></path><path class="mi-beam" data-link="#w1@right #r1@left" data-shape="elbow" data-beam data-item="main" data-index="1" data-draw="0.6" data-sfx-end="packet"></path><path class="mi-edge bus" data-link="#r1@right #e1@left" data-shape="straight"></path><path class="mi-beam" data-link="#r1@right #e1@left" data-shape="straight" data-beam data-item="main" data-index="1" data-draw="1.2" data-dot="0"></path></g>
      <g style="--item:var(--c3)"><path class="mi-edge" data-link="#w2@right #r2@left" data-shape="elbow" data-packets="1" data-period="3" data-phase-offset="0.33"></path><path class="mi-beam" data-link="#w2@right #r2@left" data-shape="elbow" data-beam data-item="main" data-index="2" data-draw="0.6" data-sfx-end="packet"></path><path class="mi-edge bus" data-link="#r2@right #e2@left" data-shape="straight"></path><path class="mi-beam" data-link="#r2@right #e2@left" data-shape="straight" data-beam data-item="main" data-index="2" data-draw="1.2" data-dot="0"></path></g>
      <g style="--item:var(--c4)"><path class="mi-edge" data-link="#w3@right #r3@left" data-shape="elbow" data-packets="1" data-period="3" data-phase-offset="0.50"></path><path class="mi-beam" data-link="#w3@right #r3@left" data-shape="elbow" data-beam data-item="main" data-index="3" data-draw="0.6" data-sfx-end="packet"></path><path class="mi-edge bus" data-link="#r3@right #e3@left" data-shape="straight"></path><path class="mi-beam" data-link="#r3@right #e3@left" data-shape="straight" data-beam data-item="main" data-index="3" data-draw="1.2" data-dot="0"></path></g>
      <g style="--item:var(--c5)"><path class="mi-edge" data-link="#w4@right #r4@left" data-shape="elbow" data-packets="1" data-period="3" data-phase-offset="0.67"></path><path class="mi-beam" data-link="#w4@right #r4@left" data-shape="elbow" data-beam data-item="main" data-index="4" data-draw="0.6" data-sfx-end="packet"></path><path class="mi-edge bus" data-link="#r4@right #e4@left" data-shape="straight"></path><path class="mi-beam" data-link="#r4@right #e4@left" data-shape="straight" data-beam data-item="main" data-index="4" data-draw="1.2" data-dot="0"></path></g>
      <g style="--item:var(--c6)"><path class="mi-edge" data-link="#w5@right #r5@left" data-shape="elbow" data-packets="1" data-period="3" data-phase-offset="0.83"></path><path class="mi-beam" data-link="#w5@right #r5@left" data-shape="elbow" data-beam data-item="main" data-index="5" data-draw="0.6" data-sfx-end="packet"></path><path class="mi-edge bus" data-link="#r5@right #e5@left" data-shape="straight"></path><path class="mi-beam" data-link="#r5@right #e5@left" data-shape="straight" data-beam data-item="main" data-index="5" data-draw="1.2" data-dot="0"></path></g>
    </svg>
    <div class="fan">
      <svg viewBox="0 0 350 700">
        <circle class="ring" cx="0" cy="350" r="118"></circle>
        <g class="wedge" style="--item:var(--c1)" data-item data-index="0" data-color="var(--c1)"><path d="M0.0,10.0 A340,340 0 0 1 170.0,55.6 L65.0,237.4 A130,130 0 0 0 0.0,220.0 Z"></path><text transform="translate(60.8 123.0) rotate(-75)">Models</text></g>
        <g class="wedge" style="--item:var(--c2)" data-item data-index="1" data-color="var(--c2)"><path d="M170.0,55.6 A340,340 0 0 1 294.4,180.0 L112.6,285.0 A130,130 0 0 0 65.0,237.4 Z"></path><text transform="translate(166.2 183.8) rotate(-45)">Frameworks</text></g>
        <g class="wedge" style="--item:var(--c3)" data-item data-index="2" data-color="var(--c3)"><path d="M294.4,180.0 A340,340 0 0 1 340.0,350.0 L130.0,350.0 A130,130 0 0 0 112.6,285.0 Z"></path><text transform="translate(227.0 289.2) rotate(-15)">Serving</text></g>
        <g class="wedge" style="--item:var(--c4)" data-item data-index="3" data-color="var(--c4)"><path d="M340.0,350.0 A340,340 0 0 1 294.4,520.0 L112.6,415.0 A130,130 0 0 0 130.0,350.0 Z"></path><text transform="translate(227.0 410.8) rotate(15)"><tspan x="0" dy="-0.2em">Data &amp;</tspan><tspan x="0" dy="1.1em">Memory</tspan></text></g>
        <g class="wedge" style="--item:var(--c5)" data-item data-index="4" data-color="var(--c5)"><path d="M294.4,520.0 A340,340 0 0 1 170.0,644.4 L65.0,462.6 A130,130 0 0 0 112.6,415.0 Z"></path><text transform="translate(166.2 516.2) rotate(45)"><tspan x="0" dy="-0.2em">Evals &amp;</tspan><tspan x="0" dy="1.1em">Safety</tspan></text></g>
        <g class="wedge" style="--item:var(--c6)" data-item data-index="5" data-color="var(--c6)"><path d="M170.0,644.4 A340,340 0 0 1 0.0,690.0 L0.0,480.0 A130,130 0 0 0 65.0,462.6 Z"></path><text transform="translate(60.8 577.0) rotate(75)"><tspan x="0" dy="-0.2em">Deploy &amp;</tspan><tspan x="0" dy="1.1em">Ops</tspan></text></g>
        <circle class="hub" cx="0" cy="350" r="104" data-pulse="2"></circle>
        <text class="hub-t" x="52" y="346">OSS</text>
        <text class="hub-s" x="52" y="368">AI stack</text>
      </svg>
      <i class="anc" id="w0" style="left:88.0px;top:21.6px"></i>
      <i class="anc" id="w1" style="left:240.4px;top:109.6px"></i>
      <i class="anc" id="w2" style="left:328.4px;top:262.0px"></i>
      <i class="anc" id="w3" style="left:328.4px;top:438.0px"></i>
      <i class="anc" id="w4" style="left:240.4px;top:590.4px"></i>
      <i class="anc" id="w5" style="left:88.0px;top:678.4px"></i>
    </div>
    <div class="bands">
      <div class="band" style="--item:var(--c1)" data-item data-index="0"><i class="anc r" id="r0"></i><span class="jl">weights · 4 families</span><div class="its"><div class="it"><span class="mi-ico" data-ico="chip"></span><div><b>Open-weight LLMs</b><small>chat and code, 1B to 400B</small></div></div><div class="it"><span class="mi-ico" data-ico="eye"></span><div><b>Vision models</b><small>OCR, detection, captions</small></div></div><div class="it"><span class="mi-ico" data-ico="wave"></span><div><b>Speech models</b><small>transcribe and speak</small></div></div><div class="it"><span class="mi-ico" data-ico="vec"></span><div><b>Embedders</b><small>text to vectors</small></div></div></div><i class="anc e" id="e0"></i></div>
      <div class="band" style="--item:var(--c2)" data-item data-index="1"><i class="anc r" id="r1"></i><span class="jl">build · orchestrate</span><div class="its"><div class="it"><span class="mi-ico" data-ico="flow"></span><div><b>Agent frameworks</b><small>tools, plans, memory</small></div></div><div class="it"><span class="mi-ico" data-ico="doc"></span><div><b>Prompt libraries</b><small>templates and parsers</small></div></div><div class="it"><span class="mi-ico" data-ico="plug"></span><div><b>Tool protocols</b><small>one schema for every tool</small></div></div></div><i class="anc e" id="e1"></i></div>
      <div class="band" style="--item:var(--c3)" data-item data-index="2"><i class="anc r" id="r2"></i><span class="jl">run · scale</span><div class="its"><div class="it"><span class="mi-ico" data-ico="bolt"></span><div><b>Inference servers</b><small>batching, paged cache</small></div></div><div class="it"><span class="mi-ico" data-ico="cpu"></span><div><b>Local runtimes</b><small>laptop and edge</small></div></div><div class="it"><span class="mi-ico" data-ico="gate"></span><div><b>Model gateways</b><small>route, retry, meter</small></div></div><div class="it"><span class="mi-ico" data-ico="zip"></span><div><b>Quantizers</b><small>4-bit with little loss</small></div></div></div><i class="anc e" id="e2"></i></div>
      <div class="band" style="--item:var(--c4)" data-item data-index="3"><i class="anc r" id="r3"></i><span class="jl">store · retrieve</span><div class="its"><div class="it"><span class="mi-ico" data-ico="db"></span><div><b>Vector stores</b><small>ANN search at scale</small></div></div><div class="it"><span class="mi-ico" data-ico="stack"></span><div><b>Doc loaders</b><small>PDF, HTML, code</small></div></div><div class="it"><span class="mi-ico" data-ico="clock"></span><div><b>Session memory</b><small>short and long term</small></div></div></div><i class="anc e" id="e3"></i></div>
      <div class="band" style="--item:var(--c5)" data-item data-index="4"><i class="anc r" id="r4"></i><span class="jl">test · guard</span><div class="its"><div class="it"><span class="mi-ico" data-ico="check"></span><div><b>Eval harnesses</b><small>benchmarks per task</small></div></div><div class="it"><span class="mi-ico" data-ico="shield"></span><div><b>Guardrails</b><small>filter input and output</small></div></div><div class="it"><span class="mi-ico" data-ico="eye"></span><div><b>Tracing</b><small>every call, every token</small></div></div><div class="it"><span class="mi-ico" data-ico="flag"></span><div><b>Red-team kits</b><small>attack before users do</small></div></div></div><i class="anc e" id="e4"></i></div>
      <div class="band" style="--item:var(--c6)" data-item data-index="5"><i class="anc r" id="r5"></i><span class="jl">ship · watch</span><div class="its"><div class="it"><span class="mi-ico" data-ico="box"></span><div><b>Containers</b><small>one image per model</small></div></div><div class="it"><span class="mi-ico" data-ico="chart"></span><div><b>Monitoring</b><small>latency, cost, drift</small></div></div><div class="it"><span class="mi-ico" data-ico="loop"></span><div><b>Fine-tune loops</b><small>data in, adapter out</small></div></div></div><i class="anc e" id="e5"></i></div>
    </div>
  </section>

  <footer class="mi-foot"><span>Categories are illustrative</span><span class="path">models › frameworks › serving › data › evals › ops</span><span class="mark">stackmap</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Sector count**: 5 or 6. For 5, use 36° per wedge (−90+36K° to −54+36K°), recompute paths, anchors and labels with
  the same radii, and use `data-step="2.4"` to keep a 12 s cycle.
- **Items per band**: 3-4. The `.its` grid keeps 4 columns, so a 3-item band leaves the right quarter empty (this
  reads as a stepped edge, like a real map). For 5 short items set `repeat(5, 1fr)` and drop the descriptions.
- **Labels**: keep wedge names to one or two short words; two-word names split onto two `tspan` lines. Bottom wedges
  read downward: that is how radial labels work, do not flip them.
- **Colours**: one `--cK` per sector on the wedge, its connector group and its band. In a warm single-accent style
  (`paper-doc`, `amber-fieldnote`) the layout still works because each wedge is light until it is active.
- **Portrait**: put the fan at the top edge (hub centre at `x=50%`, wedges from 0° to 180°) and stack the bands
  below; connectors become vertical elbows (`@bottom` → `@top`).
- **Pitfalls**: anchors must be real elements (the 2 px `.anc` dots); SVG `<text>` cannot be a `data-link` target.
  Do not put `data-beam` and `data-packets` on the same path. The hub is half off the page on purpose; keep its
  text at `x=52` so it stays in the visible half.
