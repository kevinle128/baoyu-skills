# cluster-radial

A radial field map: one hub with thin concentric rings, 8-10 target-like satellite nodes in 4 colour groups (one per
quadrant, each with a corner chip), and a cloud of dots between the hub and every node. One node at a time is
active: its dot swarm brightens and a wave runs from the hub out to the node, a beam draws, and below the map an
active card names it, the 4-step loop row tints its group and a two-column list tints its row.

## Use when / Avoid when

- **Use when**: a catalogue of 8-10 tools, projects or services that fall into 4 roles or stages ("10 open tools that
  keep an agent honest", "the 9 services behind one request"), where each item needs a name and one line.
- **Avoid when**: items have no natural 4-way grouping (use `orbit-panel`), more than 10 items (the ellipse gets
  crowded; use `tile-router` or `periodic-table`), items need metrics or long text (use `bento-grid`), or the story
  is a flow between items (use `hub-pipeline`).

## Structure

Canvas `portrait` 1080×1350.

- **Header**: crumb + `NODE NN / 10` counter, a 2-line uppercase title with one `em` word, an italic step line
  (`route / guard / score / ship`), progress rule.
- **Map** `.map` (976×640, relative): `.mi-svg` overlay with 3 concentric `.rings` circles and one `.mi-beam` per
  node (`#hub` → `#nK`); 4 group chips `.gc` pinned to the corners (title + one muted line); `#hub` (`.mi-hub`,
  round) in the centre; 10 nodes `.nd#nK` absolutely placed on an ellipse (`left` / `top` in px, centred with
  `transform`), each a double ring with its number underneath. Group K sits in one quadrant.
- **Swarms**: generated in `MotionSetup` — for every node, 30 seeded dots scattered along the hub → node line in a
  lens shape (`--k` = position 0-1 along the line).
- **Active card** `.mi-swap-host.act-host`: 10 `.mi-swap.act` panels (label, name, one line), border in group colour.
- **Loop row** `.loop`: 4 group chips `.st` joined by arrows.
- **List** `.list`: 2 columns × 5 rows, one `.row` per node (dot, number, name). **Footer**.

## Motion recipe

- **Master cycle** `n` on `.mi-body`: 10 nodes × `data-step="2"` = 20 s, `data-cycles="1"`, `data-sfx="blip"`,
  `data-accent` (title word, hub ring and step line follow the group colour). `data-order="7,9,1,4,10,2,6,8,3,5"`
  hops across quadrants instead of walking round the ring. Every item (node, beam, swap, row) shares `data-index`.
- **Group tint without a group cycle**: a chip cannot be one item for 2-3 nodes, so each `.gc` / `.st` holds one
  empty `<u data-item="n" data-index="K">` layer per node of its group; each layer shows a tint at `opacity: --on`.
  Only one node is active at a time, so at most one layer is visible.
- **Swarm**: generated SVG is created after the runtime collects items, so the swarm `<g>` is not an item. Instead,
  `M.on` copies the node's `--on` and `--p` onto its swarm every frame. Each dot uses
  `--w = clamp(0, 1 - |p·1.25 - k|·4.5, 1)` (written with `max(a, -a)`) as a wave that runs from hub to node during
  the step, and `opacity: .3 + on·(.25 + w·.45)`. Idle swarms stay at 30 %, so frame 0 shows the full map.
- **Beam**: `data-beam` with `data-draw="0.7"`, `data-sfx-end="packet"`, `opacity: var(--on)` so old beams fade out.
- **Ambient**: `data-pulse="4"` on the hub.
- **Sound**: `blip` per node + `packet` when each beam lands (20 cues).
- **Poster**: `data-poster="9"` (node 10 active, beam drawn).
- **Loop**: the last step fades into the first (`data-order` wraps), so frame 0 and the last frame match.

## Skeleton

The markup is repetitive (10 nodes, 10 beams, 10 panels, 10 rows, group layers); generate it with a short script
when you change the items.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Ten Tools That Keep An Agent Honest</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-page { gap: 14px; }
  .mi-title { text-transform: uppercase; line-height: 1.02; font-size: 52px; }
  .steps-line { font-family: var(--font-display); font-style: italic; font-size: 18px; color: var(--muted); }
  .steps-line b { font-style: normal; color: var(--accent); font-weight: 600; }
  .map { position: relative; width: 976px; height: 640px; align-self: center; }
  .map .mi-svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .rings circle { fill: none; stroke: var(--line); stroke-width: 1; }
  .rings circle:nth-child(2) { stroke-dasharray: 3 5; }
  .sw circle { --w: clamp(0, 1 - max(var(--p, 0) * 1.25 - var(--k), var(--k) - var(--p, 0) * 1.25) * 4.5, 1); fill: var(--item); opacity: calc(.3 + var(--on, 0) * (.25 + var(--w) * .45)); }
  .map .mi-beam { stroke-width: 1.8; opacity: var(--on, 0); }
  #hub { position: absolute; left: 488px; top: 320px; width: 140px; height: 140px; transform: translate(-50%, -50%); border-radius: 50%; flex-direction: column; font-family: var(--font-display); font-weight: 700; font-size: 26px; line-height: 1; }
  #hub small { display: block; font-family: var(--font-mono); font-weight: 400; font-size: 12px; letter-spacing: .08em; color: var(--muted); margin-top: 6px; }
  .nd { position: absolute; width: 46px; height: 46px; transform: translate(-50%, -50%); border-radius: 50%; border: 2px solid var(--item); background: color-mix(in oklab, var(--item) calc(12% + var(--on, 0) * 20%), var(--panel)); box-shadow: 0 0 0 calc(4px + var(--on, 0) * 8px) color-mix(in oklab, var(--item) 16%, transparent); }
  .nd i { position: absolute; inset: 11px; border-radius: 50%; border: 2px solid var(--item); background: color-mix(in oklab, var(--item) calc(var(--on, 0) * 100%), transparent); }
  .nd b { position: absolute; left: 50%; top: 54px; transform: translateX(-50%); font-family: var(--font-mono); font-size: 13px; color: var(--item); }
  .gc { position: absolute; width: 236px; padding: 6px 12px; border: 1.5px solid var(--item); border-left-width: 5px; background: var(--panel); overflow: hidden; }
  .gc u, .st u { position: absolute; inset: 0; background: color-mix(in oklab, var(--item) 14%, transparent); opacity: var(--on, 0); text-decoration: none; }
  .gc span { position: relative; display: block; font-family: var(--font-mono); font-size: 13px; font-weight: 600; letter-spacing: .08em; color: var(--item); }
  .gc em { position: relative; display: block; font-family: var(--font-mono); font-style: normal; font-size: 12px; color: var(--muted); }
  .act-host { height: 112px; }
  .act { padding: 14px 20px; border: 2px solid var(--item); border-left-width: 8px; background: var(--panel); }
  .act .mi-label { font-size: 12px; color: var(--item); }
  .act h3 { font-family: var(--font-mono); font-size: 30px; font-weight: 600; text-transform: uppercase; margin-top: 4px; }
  .act p { font-family: var(--font-mono); font-size: 14px; color: var(--muted); margin-top: 2px; }
  .loop { display: flex; align-items: center; gap: 10px; }
  .loop .arr { color: var(--muted); }
  .st { position: relative; flex: 1; padding: 9px 12px; border: 1.5px solid var(--item); overflow: hidden; }
  .st span { position: relative; font-family: var(--font-mono); font-size: 13px; font-weight: 600; letter-spacing: .08em; color: var(--item); }
  .list { display: grid; grid-template-columns: 1fr 1fr; grid-auto-flow: column; grid-template-rows: repeat(5, 38px); column-gap: 24px; row-gap: 4px; }
  .row { display: flex; align-items: center; gap: 12px; padding: 0 12px; font-family: var(--font-mono); font-size: 16px; background: color-mix(in oklab, var(--item) calc(var(--on, 0) * 16%), transparent); border: 1px solid color-mix(in oklab, var(--item) calc(var(--on, 0) * 80%), transparent); }
  .row i { width: 9px; height: 9px; border-radius: 50%; background: var(--item); }
  .row span { color: var(--muted); }
</style>
<script>
window.MotionSetup = (M) => {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.querySelector(".map .mi-svg");
  const hub = { x: 488, y: 320 };
  document.querySelectorAll(".nd").forEach((nd, i) => {
    const r = M.rng(i * 53 + 7);
    const x = parseFloat(nd.style.left), y = parseFloat(nd.style.top);
    const dx = x - hub.x, dy = y - hub.y, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "sw");
    g.style.setProperty("--item", nd.style.getPropertyValue("--item"));
    for (let k = 0; k < 30; k++) {
      const t = 0.24 + r() * 0.62;
      const spread = Math.sin(t * Math.PI) * 30;
      const off = (r() - 0.5) * 2 * spread;
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", (hub.x + dx * t + nx * off).toFixed(1));
      c.setAttribute("cy", (hub.y + dy * t + ny * off).toFixed(1));
      c.setAttribute("r", (2 + r() * 2.6).toFixed(1));
      c.style.setProperty("--k", t.toFixed(3));
      g.appendChild(c);
    }
    svg.insertBefore(g, svg.querySelector(".mi-beam"));
    M.on(() => {
      g.style.setProperty("--on", nd.style.getPropertyValue("--on") || 0);
      g.style.setProperty("--p", nd.style.getPropertyValue("--p") || 0);
    });
  });
};
</script>
</head>
<body data-canvas="portrait" data-cycles="1" data-sfx="soft" data-fps="30" data-poster="9">
<main class="mi-page">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">FIELD MAP / AGENT GUARDRAILS</span><span class="mi-meta">NODE <span data-counter="n">01</span> / 10</span></div>
    <h1 class="mi-title">Ten open tools that keep<br>an agent <em>honest</em></h1>
    <div class="steps-line"><b>route</b> / guard / score / ship &mdash; one small check per step</div>
    <div class="mi-rule" data-progress="n"></div>
  </header>

  <section class="mi-body" data-cycle="n" data-step="2" data-order="7,9,1,4,10,2,6,8,3,5" data-sfx="blip" data-accent data-master>
    <div class="map">
      <svg class="mi-svg">
        <g class="rings"><circle cx="488" cy="320" r="100"></circle><circle cx="488" cy="320" r="170"></circle><circle cx="488" cy="320" r="250"></circle></g>
        <path class="mi-beam" style="--item:var(--c1)" data-link="#hub #n0" data-shape="straight" data-gap="6" data-beam data-item="n" data-index="0" data-draw="0.7" data-sfx-end="packet" data-dot-r="5"></path><path class="mi-beam" style="--item:var(--c1)" data-link="#hub #n1" data-shape="straight" data-gap="6" data-beam data-item="n" data-index="1" data-draw="0.7" data-sfx-end="packet" data-dot-r="5"></path><path class="mi-beam" style="--item:var(--c1)" data-link="#hub #n2" data-shape="straight" data-gap="6" data-beam data-item="n" data-index="2" data-draw="0.7" data-sfx-end="packet" data-dot-r="5"></path><path class="mi-beam" style="--item:var(--c2)" data-link="#hub #n3" data-shape="straight" data-gap="6" data-beam data-item="n" data-index="3" data-draw="0.7" data-sfx-end="packet" data-dot-r="5"></path><path class="mi-beam" style="--item:var(--c2)" data-link="#hub #n4" data-shape="straight" data-gap="6" data-beam data-item="n" data-index="4" data-draw="0.7" data-sfx-end="packet" data-dot-r="5"></path><path class="mi-beam" style="--item:var(--c2)" data-link="#hub #n5" data-shape="straight" data-gap="6" data-beam data-item="n" data-index="5" data-draw="0.7" data-sfx-end="packet" data-dot-r="5"></path><path class="mi-beam" style="--item:var(--c3)" data-link="#hub #n6" data-shape="straight" data-gap="6" data-beam data-item="n" data-index="6" data-draw="0.7" data-sfx-end="packet" data-dot-r="5"></path><path class="mi-beam" style="--item:var(--c3)" data-link="#hub #n7" data-shape="straight" data-gap="6" data-beam data-item="n" data-index="7" data-draw="0.7" data-sfx-end="packet" data-dot-r="5"></path><path class="mi-beam" style="--item:var(--c4)" data-link="#hub #n8" data-shape="straight" data-gap="6" data-beam data-item="n" data-index="8" data-draw="0.7" data-sfx-end="packet" data-dot-r="5"></path><path class="mi-beam" style="--item:var(--c4)" data-link="#hub #n9" data-shape="straight" data-gap="6" data-beam data-item="n" data-index="9" data-draw="0.7" data-sfx-end="packet" data-dot-r="5"></path>
      </svg>
        <div class="gc" style="left:0;top:0;--item:var(--c1)"><u data-item="n" data-index="0"></u><u data-item="n" data-index="1"></u><u data-item="n" data-index="2"></u><span>01 / ROUTE</span><em>which model, which skill, how much context</em></div>
        <div class="gc" style="right:0;top:0;--item:var(--c2)"><u data-item="n" data-index="3"></u><u data-item="n" data-index="4"></u><u data-item="n" data-index="5"></u><span>02 / GUARD</span><em>what may run, what may leave</em></div>
        <div class="gc" style="right:0;bottom:0;--item:var(--c3)"><u data-item="n" data-index="6"></u><u data-item="n" data-index="7"></u><span>03 / SCORE</span><em>did it work, is it true</em></div>
        <div class="gc" style="left:0;bottom:0;--item:var(--c4)"><u data-item="n" data-index="8"></u><u data-item="n" data-index="9"></u><span>04 / SHIP</span><em>hand it over, write it down</em></div>
      <div id="hub" class="mi-hub" data-pulse="4">AGENT<small>ONE LOOP</small></div>
      <div class="nd" id="n0" style="left:313px;top:99px;--item:var(--c1)" data-item="n" data-index="0" data-color="var(--c1)"><i></i><b>01</b></div><div class="nd" id="n1" style="left:195px;top:166px;--item:var(--c1)" data-item="n" data-index="1" data-color="var(--c1)"><i></i><b>02</b></div><div class="nd" id="n2" style="left:127px;top:260px;--item:var(--c1)" data-item="n" data-index="2" data-color="var(--c1)"><i></i><b>03</b></div><div class="nd" id="n3" style="left:663px;top:99px;--item:var(--c2)" data-item="n" data-index="3" data-color="var(--c2)"><i></i><b>04</b></div><div class="nd" id="n4" style="left:781px;top:166px;--item:var(--c2)" data-item="n" data-index="4" data-color="var(--c2)"><i></i><b>05</b></div><div class="nd" id="n5" style="left:849px;top:260px;--item:var(--c2)" data-item="n" data-index="5" data-color="var(--c2)"><i></i><b>06</b></div><div class="nd" id="n6" style="left:816px;top:437px;--item:var(--c3)" data-item="n" data-index="6" data-color="var(--c3)"><i></i><b>07</b></div><div class="nd" id="n7" style="left:685px;top:532px;--item:var(--c3)" data-item="n" data-index="7" data-color="var(--c3)"><i></i><b>08</b></div><div class="nd" id="n8" style="left:291px;top:532px;--item:var(--c4)" data-item="n" data-index="8" data-color="var(--c4)"><i></i><b>09</b></div><div class="nd" id="n9" style="left:160px;top:437px;--item:var(--c4)" data-item="n" data-index="9" data-color="var(--c4)"><i></i><b>10</b></div>
    </div>
    <div class="mi-swap-host act-host">
      <div class="mi-swap act" style="--item:var(--c1)" data-item="n" data-index="0"><div class="mi-label">ACTIVE NODE &middot; 01 OF 10 &middot; ROUTE</div><h3>model-router</h3><p>sends each task to the cheapest model that can do it</p></div><div class="mi-swap act" style="--item:var(--c1)" data-item="n" data-index="1"><div class="mi-label">ACTIVE NODE &middot; 02 OF 10 &middot; ROUTE</div><h3>skill-picker</h3><p>loads only the skill the task asks for</p></div><div class="mi-swap act" style="--item:var(--c1)" data-item="n" data-index="2"><div class="mi-label">ACTIVE NODE &middot; 03 OF 10 &middot; ROUTE</div><h3>context-trim</h3><p>keeps the prompt under its token budget</p></div><div class="mi-swap act" style="--item:var(--c2)" data-item="n" data-index="3"><div class="mi-label">ACTIVE NODE &middot; 04 OF 10 &middot; GUARD</div><h3>cmd-guard</h3><p>blocks shell commands outside the allow list</p></div><div class="mi-swap act" style="--item:var(--c2)" data-item="n" data-index="4"><div class="mi-label">ACTIVE NODE &middot; 05 OF 10 &middot; GUARD</div><h3>secret-scan</h3><p>stops keys before they leave the repo</p></div><div class="mi-swap act" style="--item:var(--c2)" data-item="n" data-index="5"><div class="mi-label">ACTIVE NODE &middot; 06 OF 10 &middot; GUARD</div><h3>diff-limit</h3><p>caps how much one step may change</p></div><div class="mi-swap act" style="--item:var(--c3)" data-item="n" data-index="6"><div class="mi-label">ACTIVE NODE &middot; 07 OF 10 &middot; SCORE</div><h3>test-judge</h3><p>reads test output and says pass or fail</p></div><div class="mi-swap act" style="--item:var(--c3)" data-item="n" data-index="7"><div class="mi-label">ACTIVE NODE &middot; 08 OF 10 &middot; SCORE</div><h3>cite-check</h3><p>confirms every quote exists in its source</p></div><div class="mi-swap act" style="--item:var(--c4)" data-item="n" data-index="8"><div class="mi-label">ACTIVE NODE &middot; 09 OF 10 &middot; SHIP</div><h3>pr-writer</h3><p>opens a pull request with a checked summary</p></div><div class="mi-swap act" style="--item:var(--c4)" data-item="n" data-index="9"><div class="mi-label">ACTIVE NODE &middot; 10 OF 10 &middot; SHIP</div><h3>run-log</h3><p>writes every decision to one timeline</p></div>
    </div>
    <div class="loop"><div class="st" style="--item:var(--c1)"><u data-item="n" data-index="0"></u><u data-item="n" data-index="1"></u><u data-item="n" data-index="2"></u><span>01 / ROUTE</span></div><span class="arr">&rarr;</span><div class="st" style="--item:var(--c2)"><u data-item="n" data-index="3"></u><u data-item="n" data-index="4"></u><u data-item="n" data-index="5"></u><span>02 / GUARD</span></div><span class="arr">&rarr;</span><div class="st" style="--item:var(--c3)"><u data-item="n" data-index="6"></u><u data-item="n" data-index="7"></u><span>03 / SCORE</span></div><span class="arr">&rarr;</span><div class="st" style="--item:var(--c4)"><u data-item="n" data-index="8"></u><u data-item="n" data-index="9"></u><span>04 / SHIP</span></div></div>
    <div class="list">
      <div class="row" style="--item:var(--c1)" data-item="n" data-index="0"><i></i><span>01</span>model-router</div><div class="row" style="--item:var(--c1)" data-item="n" data-index="1"><i></i><span>02</span>skill-picker</div><div class="row" style="--item:var(--c1)" data-item="n" data-index="2"><i></i><span>03</span>context-trim</div><div class="row" style="--item:var(--c2)" data-item="n" data-index="3"><i></i><span>04</span>cmd-guard</div><div class="row" style="--item:var(--c2)" data-item="n" data-index="4"><i></i><span>05</span>secret-scan</div><div class="row" style="--item:var(--c2)" data-item="n" data-index="5"><i></i><span>06</span>diff-limit</div><div class="row" style="--item:var(--c3)" data-item="n" data-index="6"><i></i><span>07</span>test-judge</div><div class="row" style="--item:var(--c3)" data-item="n" data-index="7"><i></i><span>08</span>cite-check</div><div class="row" style="--item:var(--c4)" data-item="n" data-index="8"><i></i><span>09</span>pr-writer</div><div class="row" style="--item:var(--c4)" data-item="n" data-index="9"><i></i><span>10</span>run-log</div>
    </div>
  </section>

  <footer class="mi-foot"><span>ILLUSTRATIVE TOOL NAMES</span><span class="path">ROUTE &gt; GUARD &gt; SCORE &gt; SHIP</span><span class="mark">cluster-radial</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Items**: 8-10. Place nodes by angle on the ellipse `x = 488 + 372·cos a`, `y = 320 - 250·sin a` (degrees, y up):
  group 1 at 118-166°, group 2 at 14-62°, group 3 at -28 to -58°, group 4 at -122 to -152°. Keep 24° between nodes of
  a group and at least 50° between groups. Update `hub` in `MotionSetup` if you move `#hub`.
- **Groups**: exactly 4 (one per corner chip). For 3 groups drop a chip and spread the nodes over 3 sectors.
- **Timing**: items × step between 16 and 24 s; with 8 items use `data-step="2.5"`. Any order works in `data-order`
  as long as every item is listed once.
- **Swarm density**: 30 dots per node (300 in total). Keep under ~500. Raise `spread` (30) for fuller lenses.
- **Styles**: tested with `paper-doc` (cream, serif) and `pastel-schematic` (white, Inter). Light styles with 4
  distinct `--c1`…`--c4` work best; dark styles work but raise the idle dot opacity (`.3`) only if the page looks
  empty.
- **Pitfalls**: do not add `data-item` to generated SVG (it is created after the runtime scans items; copy `--on` /
  `--p` in `M.on` instead). Style `.mi-hub` may be square in some styles; `#hub` sets `border-radius: 50%`. Do not
  give nodes `data-drift`: beams are measured once.
