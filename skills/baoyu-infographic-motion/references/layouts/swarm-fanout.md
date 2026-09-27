# swarm-fanout

A coordinator fans one goal out to 8 labelled lanes of agents; each lane's cloud of dots fills in its colour while
the lane works, the lanes report back to a LEAD node and a report card climbs to 100 %, with a live terminal, an
agent-tree progress list, KPI tickers and a stage rail around it.

## Use when / Avoid when

- **Use when**: multi-agent or swarm systems ("300 agents, one operator"), map-reduce style work, a team that splits
  one job into 5-8 parallel tracks and merges the result, any "fan-out / fan-in" story with a sense of scale.
- **Avoid when**: the inputs are independent sources with no coordinator (use `fan-in`), the flow is sequential
  (use `card-pipeline` or `hub-pipeline`), or there are more than 8 lanes (the lanes get too thin to read).

## Structure

Canvas `1600x1200` (4:3 landscape, matches the 2878×2160 reference; the 3:4 `paper` canvas is too narrow for the
lane row plus the side column). A dashboard-like page with its own header; no `.mi-sub` (some styles skin it as a
full-bleed band).

- **Header** `.hd`: logo box, title + `.tagline`, KPI tiles `.kpi` (4 tickers) and a `LIVE tick` pill.
- **Marquee** `.band`: full-bleed ink strip with a sentence list that scrolls with `data-phase` (content doubled).
- **Main** `.main.mi-body` (grid `1fr 450px`):
  - **Fan card** `.fan`: heading + italic line, then `.stage` (relative) with an SVG overlay, `#goal` box,
    `#coord` hub, `.stats` (lanes, subagents, sources checked), `.lanes` (8 × `.lane`: dot `#dK`, name + optional
    red note, count, `.cloud#cK` 300×64), `#lead` hub, "N/8 lanes back" and `#report` card with a %.
  - **Side column** `.side`: `.wire` dark terminal card (`.mi-log`) and `.tree` card (Coordinator + 8 rows: branch,
    dot, agent name, `.mi-bar`, status `queued / working / back`).
- **Stage rail** `.rail`: 4 pill steps, own cycle. **Footer**.

## Motion recipe

- **Master cycle** `lane` on `.main`: 8 lanes × `data-step="1.5"` = 12 s, `data-cycles="2"` (24 s),
  `data-sfx="thump"`, `data-accent`. Each lane row is the item (`data-index` 0-7, `data-color`); its dot, name,
  cloud and note read `--on` / `--p` / `--done` by inheritance.
- **Accumulate**: the dots are generated in `MotionSetup` (34 per lane on a jittered 12×3 grid, SVG circles +
  short links). Each dot has `--k` (0-0.7, left to right); CSS lights it with
  `--lit: clamp(0, (var(--p) - var(--k)) * 7, 1)`. `--p` grows during the lane's step and stays 1 while the lane is
  done, so the swarm fills lane by lane and resets when the cycle wraps. Unlit dots are hollow `--line` rings, so
  frame 0 still shows the full structure.
- **Counts**: lane count `data-count="34"` with the lane item (0 → 34 in its step); tree bars `data-bar="1"`; tree
  status spans fade `queued → working (--on) → back (--done)`.
- **Beams and packets**: `coord → lane dot` = `mi-beam` per lane (`data-draw="0.6"`, `data-sfx-end="packet"`);
  `cloud → lead` = dashed edge with 1 packet inside `<g class="back" data-item="lane">`, visible from the lane's
  step on (`max(--on, --done)`); goal → coord and lead → report carry steady packets.
- **Custom JS** (`MotionSetup`, after the runtime): report % = `--cycle-p` of the lane cycle × 100, "lanes back"
  = × 8, sources checked = × 184, `LIVE tick` = `floor(t × 10)`.
- **Nested / ambient**: stage rail cycle `stage` 4 × 3 s = 12 s (silent); `.mi-log` terminal every 1.5 s (7 rows,
  silent); KPI `data-ticker` wobble; `data-pulse` on the hubs and the LIVE dot; marquee `data-phase="12"`.
- **Sound**: `thump` per lane + `packet` when each beam lands (32 cues in 24 s).
- **Poster**: `data-poster="11.7"` (all 8 lanes filled, report 97 %).

## Skeleton

Lanes, links and tree rows are repetitive; generate them with a small loop when you change the lane count.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>300 Agents One Operator</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-page { gap: 16px; }
  .hd { display: grid; grid-template-columns: 64px 1fr auto; gap: 18px; align-items: center; }
  .logo { width: 64px; height: 64px; display: grid; place-items: center; border-radius: calc(var(--radius) * .6); background: var(--ink); color: var(--bg); font-family: var(--font-display); font-weight: 800; font-size: 38px; }
  .hd .mi-title { font-size: calc(var(--title-size) * .62); white-space: nowrap; }
  .tagline { font-family: var(--font-mono); font-size: 14px; letter-spacing: .08em; text-transform: var(--label-case); color: var(--accent); margin-top: 6px; }
  .tagline span { color: var(--muted); padding: 0 6px; }
  .kpis { display: flex; align-items: stretch; gap: 0; }
  .kpi { padding: 4px 18px; border-left: 1px solid var(--line); min-width: 128px; }
  .kpi .mi-label { font-size: 12px; }
  .kpi b { display: block; font-family: var(--font-mono); font-size: 28px; font-weight: 600; color: var(--item); margin-top: 6px; font-variant-numeric: tabular-nums; }
  .live { align-self: start; margin-left: 12px; font-family: var(--font-mono); font-size: 14px; font-weight: 600; padding: 6px 14px; border-radius: 999px; border: 2px solid var(--c2); color: var(--ink); white-space: nowrap; }
  .live i { display: inline-block; width: 9px; height: 9px; border-radius: 50%; margin-right: 6px; background: var(--c2); opacity: calc(.35 + var(--pulse) * .65); }
  .band { height: 36px; overflow: hidden; background: var(--ink); color: var(--bg); font-family: var(--font-mono); font-size: 14px; letter-spacing: .06em; text-transform: uppercase; margin: 0 calc(var(--pad) * -1); }
  .band div { display: flex; width: max-content; line-height: 36px; white-space: nowrap; translate: calc(var(--phase) * -50%) 0; }
  .band span { padding: 0 26px; }
  .band span::after { content: "\00B7"; margin-left: 52px; opacity: .6; }
  .main { flex: 1; min-height: 0; display: grid; grid-template-columns: 1fr 450px; gap: 18px; }
  .fan { display: flex; flex-direction: column; gap: 4px; padding: 20px 22px 16px; }
  .ph { display: flex; align-items: baseline; gap: 14px; }
  .ph h3 { font-size: 28px; }
  .ph .mi-label { font-size: 12px; }
  .it { font-family: var(--font-mono); font-size: 13px; color: var(--muted); font-style: italic; }
  .stage { position: relative; flex: 1; }
  #goal { position: absolute; left: 0; top: 8px; width: 170px; padding: 10px 14px; border-radius: 8px; background: var(--code-bg); color: var(--code-ink); font-family: var(--font-mono); font-size: 13px; font-weight: 600; letter-spacing: .06em; }
  #goal span { display: block; font-weight: 400; color: var(--code-accent); margin-top: 4px; letter-spacing: 0; }
  #coord { position: absolute; left: 26px; top: 50%; width: 118px; height: 118px; translate: 0 -50%; background: var(--ink); color: var(--bg); border: 0; font-family: var(--font-mono); font-size: 20px; font-weight: 700; line-height: 1.1; }
  #coord small { display: block; font-size: 12px; font-weight: 400; opacity: .7; }
  .stats { position: absolute; left: 0; bottom: 0; display: flex; flex-direction: column; gap: 12px; }
  .stats div { border-left: 3px solid var(--item); padding-left: 12px; }
  .stats b { display: block; font-family: var(--font-mono); font-size: 24px; color: var(--item); font-variant-numeric: tabular-nums; }
  .lanes { position: absolute; left: 196px; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: space-around; }
  .lane { display: grid; grid-template-columns: 22px 196px 34px 300px; gap: 10px; align-items: center; height: 70px; }
  .ld { width: 22px; height: 22px; border-radius: 50%; border: 2px solid color-mix(in oklab, var(--item) calc(40% + max(var(--on), var(--done)) * 60%), var(--line));
    background: color-mix(in oklab, var(--item) calc(max(var(--on), var(--done)) * 100%), var(--panel)); box-shadow: 0 0 calc(var(--on) * 16px * var(--glow)) var(--item); }
  .ln { font-family: var(--font-mono); font-size: 15px; font-weight: 600; letter-spacing: .05em; color: color-mix(in oklab, var(--ink) calc(45% + max(var(--on), var(--done)) * 55%), var(--muted)); }
  .ln em { display: block; font-style: normal; font-weight: 400; font-size: 12px; letter-spacing: 0; color: var(--c5); opacity: var(--done); }
  .lane > b { font-family: var(--font-mono); font-size: 14px; color: var(--item); font-variant-numeric: tabular-nums; }
  .cloud { position: relative; width: 300px; height: 64px; }
  .cloud svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .cloud circle { --lit: clamp(0, (var(--p, 0) - var(--k)) * 7, 1); fill: color-mix(in oklab, var(--item) calc(var(--lit) * 100%), var(--panel)); stroke: color-mix(in oklab, var(--item) calc(var(--lit) * 100%), var(--line)); stroke-width: 1.6; }
  .cloud line { --lit: clamp(0, (var(--p, 0) - var(--k)) * 7, 1); stroke: var(--item); stroke-width: 1; opacity: calc(var(--lit) * .45); }
  .stage .mi-edge { stroke-dasharray: 4 5; stroke-width: 1.4; }
  .stage .mi-beam { stroke-width: 2; }
  .back { opacity: calc(.25 + max(var(--on), var(--done)) * .75); }
  .back .mi-edge { stroke: color-mix(in oklab, var(--item) calc(max(var(--on), var(--done)) * 70%), var(--line)); }
  .back .mi-packet { fill: var(--item); }
  #lead { position: absolute; right: 70px; top: 50%; width: 84px; height: 84px; translate: 0 -50%; background: var(--ink); color: var(--bg); border: 0; font-family: var(--font-mono); font-size: 15px; font-weight: 700; }
  #lead small { display: block; font-size: 12px; font-weight: 400; opacity: .7; }
  .lback { position: absolute; right: 38px; top: calc(50% + 50px); width: 150px; text-align: center; font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
  #report { position: absolute; right: 0; top: calc(50% + 82px); width: 190px; padding: 12px 14px; text-align: center; border: 2px solid var(--accent); border-radius: calc(var(--radius) * .6); background: color-mix(in oklab, var(--accent) 8%, var(--panel)); }
  #report h4 { font-family: var(--font-display); font-weight: var(--title-weight); text-transform: var(--title-case); font-size: 20px; }
  #report p { font-family: var(--font-mono); font-size: 12px; color: var(--muted); line-height: 1.5; margin-top: 4px; }
  #report b { display: block; font-family: var(--font-mono); font-size: 30px; color: var(--accent); margin-top: 4px; font-variant-numeric: tabular-nums; }
  .side { display: flex; flex-direction: column; gap: 18px; min-height: 0; }
  .wire { background: var(--code-bg); color: var(--code-ink); border-color: var(--code-bg); padding: 18px 20px; }
  .wire h3 { font-size: 24px; color: var(--code-ink); }
  .wire h3 span, .tree h3 span { font-family: var(--font-mono); font-size: 12px; font-weight: 400; letter-spacing: .08em; opacity: .7; margin-left: 8px; }
  .wire .mi-log { font-size: 14px; --row-h: 27px; margin-top: 10px; }
  .wire .mi-log .k { color: var(--code-accent); }
  .wire .mi-log .d { opacity: .6; }
  .wire .foot { font-family: var(--font-mono); font-size: 12px; opacity: .6; margin-top: 8px; }
  .tree { flex: 1; padding: 18px 20px; display: flex; flex-direction: column; gap: 6px; }
  .tree h3 { font-size: 24px; }
  .tree .co { font-family: var(--font-mono); font-size: 15px; font-weight: 700; margin-top: 6px; }
  .tr { display: grid; grid-template-columns: 26px 14px 1fr 96px 62px; gap: 6px; align-items: center; height: 38px; font-family: var(--font-mono); font-size: 14px; }
  .tr .br { color: var(--muted); }
  .tr .dt { width: 11px; height: 11px; border-radius: 50%; border: 2px solid var(--item); background: color-mix(in oklab, var(--item) calc(max(var(--on), var(--done)) * 100%), transparent); }
  .tr .an { color: color-mix(in oklab, var(--ink) calc(50% + max(var(--on), var(--done)) * 50%), var(--muted)); white-space: nowrap; }
  .tr .mi-bar { height: 7px; }
  .stt { position: relative; height: 18px; font-size: 12px; text-align: right; }
  .stt span { position: absolute; right: 0; top: 0; }
  .stt .q { color: var(--muted); opacity: calc(1 - max(var(--on), var(--done))); }
  .stt .w { color: var(--c3); opacity: var(--on); }
  .stt .b { color: var(--c2); opacity: calc(var(--done) * (1 - var(--on))); }
  .tree .note { margin-top: auto; }
  .rail { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .rail div { display: flex; align-items: center; gap: 12px; height: 46px; padding: 0 20px; border-radius: 999px; font-family: var(--font-mono); font-size: 15px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase;
    border: 2px solid color-mix(in oklab, var(--item) calc(max(var(--on), var(--done)) * 100%), var(--line)); background: color-mix(in oklab, var(--item) calc(var(--on) * 100%), var(--panel)); color: color-mix(in oklab, var(--bg) calc(var(--on) * 100%), var(--ink)); }
  .rail div span { font-weight: 400; opacity: .7; }
</style>
<script>
window.MotionSetup = (M) => {
  const NS = "http://www.w3.org/2000/svg";
  document.querySelectorAll(".cloud").forEach((cloud, ci) => {
    const r = M.rng(ci * 97 + 13);
    const W = cloud.clientWidth, H = cloud.clientHeight, cols = 12, rows = 3, pts = [];
    for (let i = 0; i < cols * rows - 2; i++) {
      const x = ((i % cols) + 0.5 + (r() - 0.5) * 0.7) * (W / cols);
      const y = (Math.floor(i / cols) + 0.5 + (r() - 0.5) * 0.6) * (H / rows);
      pts.push({ x, y, k: (x / W) * 0.6 + r() * 0.1 });
    }
    const svg = document.createElementNS(NS, "svg");
    pts.forEach((a, i) => {
      const b = pts[i + 1];
      if (!b || (i + 1) % cols === 0 || r() < 0.45) return;
      const l = document.createElementNS(NS, "line");
      l.setAttribute("x1", a.x); l.setAttribute("y1", a.y); l.setAttribute("x2", b.x); l.setAttribute("y2", b.y);
      l.style.setProperty("--k", Math.max(a.k, b.k).toFixed(3));
      svg.appendChild(l);
    });
    pts.forEach((a) => {
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", a.x); c.setAttribute("cy", a.y); c.setAttribute("r", 3.6);
      c.style.setProperty("--k", a.k.toFixed(3));
      svg.appendChild(c);
    });
    cloud.appendChild(svg);
  });
  const cyc = document.querySelector('[data-cycle="lane"]');
  const pct = document.querySelector("#pct"), back = document.querySelector("#backn"), src = document.querySelector("#src"), tick = document.querySelector("#tick");
  M.on((t) => {
    const p = parseFloat(cyc.style.getPropertyValue("--cycle-p")) || 0;
    pct.textContent = Math.floor(p * 100) + "%";
    back.textContent = Math.floor(p * 8);
    src.textContent = Math.round(p * 184);
    tick.textContent = String(Math.floor(t * 10) % 1000).padStart(3, "0");
  });
};
</script>
</head>
<body data-canvas="1600x1200" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="11.7">
<main class="mi-page">
  <header class="hd">
    <div class="logo">K</div>
    <div>
      <h1 class="mi-title">300 agents. <em>One operator.</em></h1>
      <div class="tagline">one goal <span>&gt;</span> 8 lanes <span>&gt;</span> 272 subagents <span>&gt;</span> 1 report</div>
    </div>
    <div class="kpis">
      <div class="kpi" style="--item:var(--c1)"><div class="mi-label">Subagents</div><b data-ticker="272" data-jitter="3">272</b></div>
      <div class="kpi" style="--item:var(--c2)"><div class="mi-label">Claims verified</div><b data-ticker="27" data-jitter="2">27</b></div>
      <div class="kpi" style="--item:var(--c5)"><div class="mi-label">Claims rejected</div><b data-ticker="3" data-jitter="0.6">3</b></div>
      <div class="kpi" style="--item:var(--c2)"><div class="mi-label">Target</div><b data-ticker="6000" data-jitter="40" data-group data-prefix="$" data-suffix="/mo">$6,000/mo</b></div>
      <div class="live" data-pulse="1.5"><i></i>LIVE tick <span id="tick">000</span></div>
    </div>
  </header>
  <div class="band"><div data-phase="12"><span>Give it one goal and it builds the team around it</span><span>Fan out to specialists, fan in to one lead agent</span><span>The client pays for faster decisions, not for agents</span><span>300 is the ceiling, not the target</span><span>Give it one goal and it builds the team around it</span><span>Fan out to specialists, fan in to one lead agent</span><span>The client pays for faster decisions, not for agents</span><span>300 is the ceiling, not the target</span></div></div>

  <section class="main mi-body" data-cycle="lane" data-step="1.5" data-sfx="thump" data-accent data-master>
    <div class="mi-card fan">
      <div class="ph"><h3>Fan-out / fan-in</h3><span class="mi-label">one goal in &middot; 272 subagents &middot; one verified report out</span></div>
      <div class="it">specialists take separate parts of the job in parallel. one lead agent verifies and combines what comes back.</div>
      <div class="stage">
        <svg class="mi-svg">
        <path class="mi-edge" data-link="#goal@bottom #coord@top" data-shape="straight" data-packets="1" data-period="3" data-r="3"></path>
        <path class="mi-edge" data-link="#coord@right #d0@left" data-bend="0.25"></path>
        <path class="mi-beam" style="--item:var(--c1)" data-link="#coord@right #d0@left" data-bend="0.25" data-beam data-item="lane" data-index="0" data-draw="0.6" data-sfx-end="packet" data-dot-r="4"></path>
        <g class="back" style="--item:var(--c1)" data-item="lane" data-index="0"><path class="mi-edge" data-link="#c0@right #lead@left" data-bend="0.5" data-packets="1" data-period="1.5" data-r="3"></path></g>
        <path class="mi-edge" data-link="#coord@right #d1@left" data-bend="0.25"></path>
        <path class="mi-beam" style="--item:var(--c1)" data-link="#coord@right #d1@left" data-bend="0.25" data-beam data-item="lane" data-index="1" data-draw="0.6" data-sfx-end="packet" data-dot-r="4"></path>
        <g class="back" style="--item:var(--c1)" data-item="lane" data-index="1"><path class="mi-edge" data-link="#c1@right #lead@left" data-bend="0.5" data-packets="1" data-period="1.5" data-r="3"></path></g>
        <path class="mi-edge" data-link="#coord@right #d2@left" data-bend="0.25"></path>
        <path class="mi-beam" style="--item:var(--c1)" data-link="#coord@right #d2@left" data-bend="0.25" data-beam data-item="lane" data-index="2" data-draw="0.6" data-sfx-end="packet" data-dot-r="4"></path>
        <g class="back" style="--item:var(--c1)" data-item="lane" data-index="2"><path class="mi-edge" data-link="#c2@right #lead@left" data-bend="0.5" data-packets="1" data-period="1.5" data-r="3"></path></g>
        <path class="mi-edge" data-link="#coord@right #d3@left" data-bend="0.25"></path>
        <path class="mi-beam" style="--item:var(--c6)" data-link="#coord@right #d3@left" data-bend="0.25" data-beam data-item="lane" data-index="3" data-draw="0.6" data-sfx-end="packet" data-dot-r="4"></path>
        <g class="back" style="--item:var(--c6)" data-item="lane" data-index="3"><path class="mi-edge" data-link="#c3@right #lead@left" data-bend="0.5" data-packets="1" data-period="1.5" data-r="3"></path></g>
        <path class="mi-edge" data-link="#coord@right #d4@left" data-bend="0.25"></path>
        <path class="mi-beam" style="--item:var(--c6)" data-link="#coord@right #d4@left" data-bend="0.25" data-beam data-item="lane" data-index="4" data-draw="0.6" data-sfx-end="packet" data-dot-r="4"></path>
        <g class="back" style="--item:var(--c6)" data-item="lane" data-index="4"><path class="mi-edge" data-link="#c4@right #lead@left" data-bend="0.5" data-packets="1" data-period="1.5" data-r="3"></path></g>
        <path class="mi-edge" data-link="#coord@right #d5@left" data-bend="0.25"></path>
        <path class="mi-beam" style="--item:var(--c2)" data-link="#coord@right #d5@left" data-bend="0.25" data-beam data-item="lane" data-index="5" data-draw="0.6" data-sfx-end="packet" data-dot-r="4"></path>
        <g class="back" style="--item:var(--c2)" data-item="lane" data-index="5"><path class="mi-edge" data-link="#c5@right #lead@left" data-bend="0.5" data-packets="1" data-period="1.5" data-r="3"></path></g>
        <path class="mi-edge" data-link="#coord@right #d6@left" data-bend="0.25"></path>
        <path class="mi-beam" style="--item:var(--c4)" data-link="#coord@right #d6@left" data-bend="0.25" data-beam data-item="lane" data-index="6" data-draw="0.6" data-sfx-end="packet" data-dot-r="4"></path>
        <g class="back" style="--item:var(--c4)" data-item="lane" data-index="6"><path class="mi-edge" data-link="#c6@right #lead@left" data-bend="0.5" data-packets="1" data-period="1.5" data-r="3"></path></g>
        <path class="mi-edge" data-link="#coord@right #d7@left" data-bend="0.25"></path>
        <path class="mi-beam" style="--item:var(--c2)" data-link="#coord@right #d7@left" data-bend="0.25" data-beam data-item="lane" data-index="7" data-draw="0.6" data-sfx-end="packet" data-dot-r="4"></path>
        <g class="back" style="--item:var(--c2)" data-item="lane" data-index="7"><path class="mi-edge" data-link="#c7@right #lead@left" data-bend="0.5" data-packets="1" data-period="1.5" data-r="3"></path></g>
        <path class="mi-edge" data-link="#lead@bottom #report@top" data-shape="straight" data-packets="1" data-period="1.5" data-r="3"></path>
        </svg>
        <div id="goal">HUMAN GOAL<span>track 10 rivals weekly</span></div>
        <div id="coord" class="mi-hub" data-pulse="3"><div>K3<small>coordinator</small></div></div>
        <div class="stats">
          <div style="--item:var(--c1)"><span class="mi-label">Lanes</span><b>8</b></div>
          <div style="--item:var(--c6)"><span class="mi-label">Subagents</span><b>272</b></div>
          <div style="--item:var(--c4)"><span class="mi-label">Sources checked</span><b id="src">0</b></div>
        </div>
        <div class="lanes">
        <div class="lane" style="--item:var(--c1)" data-item="lane" data-index="0" data-color="var(--c1)"><span class="ld" id="d0"></span><span class="ln">COMPETITOR A</span><b data-count="34" data-item="lane" data-index="0" data-dur="1.3">34</b><div class="cloud" id="c0"></div></div>
        <div class="lane" style="--item:var(--c1)" data-item="lane" data-index="1" data-color="var(--c1)"><span class="ld" id="d1"></span><span class="ln">COMPETITOR B</span><b data-count="34" data-item="lane" data-index="1" data-dur="1.3">34</b><div class="cloud" id="c1"></div></div>
        <div class="lane" style="--item:var(--c1)" data-item="lane" data-index="2" data-color="var(--c1)"><span class="ld" id="d2"></span><span class="ln">COMPETITOR C<em>1 claim rejected, no source</em></span><b data-count="34" data-item="lane" data-index="2" data-dur="1.3">34</b><div class="cloud" id="c2"></div></div>
        <div class="lane" style="--item:var(--c6)" data-item="lane" data-index="3" data-color="var(--c6)"><span class="ld" id="d3"></span><span class="ln">PRICING</span><b data-count="34" data-item="lane" data-index="3" data-dur="1.3">34</b><div class="cloud" id="c3"></div></div>
        <div class="lane" style="--item:var(--c6)" data-item="lane" data-index="4" data-color="var(--c6)"><span class="ld" id="d4"></span><span class="ln">REVIEW ANALYSIS<em>2 claims rejected, no source</em></span><b data-count="34" data-item="lane" data-index="4" data-dur="1.3">34</b><div class="cloud" id="c4"></div></div>
        <div class="lane" style="--item:var(--c2)" data-item="lane" data-index="5" data-color="var(--c2)"><span class="ld" id="d5"></span><span class="ln">CHANGE DETECTION</span><b data-count="34" data-item="lane" data-index="5" data-dur="1.3">34</b><div class="cloud" id="c5"></div></div>
        <div class="lane" style="--item:var(--c4)" data-item="lane" data-index="6" data-color="var(--c4)"><span class="ld" id="d6"></span><span class="ln">VERIFICATION</span><b data-count="34" data-item="lane" data-index="6" data-dur="1.3">34</b><div class="cloud" id="c6"></div></div>
        <div class="lane" style="--item:var(--c2)" data-item="lane" data-index="7" data-color="var(--c2)"><span class="ld" id="d7"></span><span class="ln">REPORT EDITOR</span><b data-count="34" data-item="lane" data-index="7" data-dur="1.3">34</b><div class="cloud" id="c7"></div></div>
        </div>
        <div id="lead" class="mi-hub" data-pulse="1.5"><div>LEAD<small>verify</small></div></div>
        <div class="lback"><span id="backn">0</span>/8 lanes back</div>
        <div id="report"><h4>The report</h4><p>what changed<br>why it matters<br>what to do next</p><b id="pct">0%</b></div>
      </div>
    </div>
    <div class="side">
      <div class="mi-card wire">
        <h3>The wiring<span>K3 CODE &gt; MCP</span></h3>
        <div class="mi-log" data-log="1.5" data-rows="7">
          <div data-line><span class="k">$</span> k3 mcp add --transport http firecrawl</div>
          <div data-line><span class="d">  --auth oauth &middot; scope web.read</span></div>
          <div data-line><span class="k">$</span> k3 mcp test firecrawl <span class="d">[ok]</span></div>
          <div data-line><span class="k">k3&gt;</span> spawn one agent per competitor</div>
          <div data-line><span class="k">k3&gt;</span> fan out 8 lanes, 34 each</div>
          <div data-line><span class="k">k3&gt;</span> reject any claim without a source</div>
          <div data-line><span class="k">lead&gt;</span> merge lanes into one brief</div>
          <div data-line><span class="k">lead&gt;</span> 3 claims rejected, 27 verified</div>
        </div>
        <div class="foot">built-in web, file, shell and subagent tools</div>
      </div>
      <div class="mi-card tree">
        <h3>The agent tree<span>8 LANES</span></h3>
        <div class="co">Coordinator</div>
          <div class="tr" style="--item:var(--c1)" data-item="lane" data-index="0"><span class="br">&#9500;&#9472;</span><i class="dt"></i><span class="an">Competitor A Agent</span><span class="mi-bar"><i data-bar="1" data-item="lane" data-index="0" data-dur="1.3"></i></span><span class="stt"><span class="q">queued</span><span class="w">working</span><span class="b">back</span></span></div>
          <div class="tr" style="--item:var(--c1)" data-item="lane" data-index="1"><span class="br">&#9500;&#9472;</span><i class="dt"></i><span class="an">Competitor B Agent</span><span class="mi-bar"><i data-bar="1" data-item="lane" data-index="1" data-dur="1.3"></i></span><span class="stt"><span class="q">queued</span><span class="w">working</span><span class="b">back</span></span></div>
          <div class="tr" style="--item:var(--c1)" data-item="lane" data-index="2"><span class="br">&#9500;&#9472;</span><i class="dt"></i><span class="an">Competitor C Agent</span><span class="mi-bar"><i data-bar="1" data-item="lane" data-index="2" data-dur="1.3"></i></span><span class="stt"><span class="q">queued</span><span class="w">working</span><span class="b">back</span></span></div>
          <div class="tr" style="--item:var(--c6)" data-item="lane" data-index="3"><span class="br">&#9500;&#9472;</span><i class="dt"></i><span class="an">Pricing Agent</span><span class="mi-bar"><i data-bar="1" data-item="lane" data-index="3" data-dur="1.3"></i></span><span class="stt"><span class="q">queued</span><span class="w">working</span><span class="b">back</span></span></div>
          <div class="tr" style="--item:var(--c6)" data-item="lane" data-index="4"><span class="br">&#9500;&#9472;</span><i class="dt"></i><span class="an">Review Analysis Agent</span><span class="mi-bar"><i data-bar="1" data-item="lane" data-index="4" data-dur="1.3"></i></span><span class="stt"><span class="q">queued</span><span class="w">working</span><span class="b">back</span></span></div>
          <div class="tr" style="--item:var(--c2)" data-item="lane" data-index="5"><span class="br">&#9500;&#9472;</span><i class="dt"></i><span class="an">Change Detection Agent</span><span class="mi-bar"><i data-bar="1" data-item="lane" data-index="5" data-dur="1.3"></i></span><span class="stt"><span class="q">queued</span><span class="w">working</span><span class="b">back</span></span></div>
          <div class="tr" style="--item:var(--c4)" data-item="lane" data-index="6"><span class="br">&#9500;&#9472;</span><i class="dt"></i><span class="an">Verification Agent</span><span class="mi-bar"><i data-bar="1" data-item="lane" data-index="6" data-dur="1.3"></i></span><span class="stt"><span class="q">queued</span><span class="w">working</span><span class="b">back</span></span></div>
          <div class="tr" style="--item:var(--c2)" data-item="lane" data-index="7"><span class="br">&#9492;&#9472;</span><i class="dt"></i><span class="an">Report Editor</span><span class="mi-bar"><i data-bar="1" data-item="lane" data-index="7" data-dur="1.3"></i></span><span class="stt"><span class="q">queued</span><span class="w">working</span><span class="b">back</span></span></div>
        <div class="mi-label note">no reason to launch 300 agents for 10 competitors</div>
      </div>
    </div>
  </section>

  <div class="rail" data-cycle="stage" data-step="3">
    <div style="--item:var(--c1)" data-item data-color="var(--c1)">1 <span>an</span> expensive problem</div>
    <div style="--item:var(--c6)" data-item data-color="var(--c6)">2 <span>a</span> specific customer</div>
    <div style="--item:var(--c4)" data-item data-color="var(--c4)">3 <span>a</span> verifiable deliverable</div>
    <div style="--item:var(--c2)" data-item data-color="var(--c2)">4 <span>a</span> repeatable process</div>
  </div>
  <footer class="mi-foot"><span>SOURCE / OPERATOR NOTES, SEP 2026</span><span class="path">GOAL &gt; FAN OUT &gt; VERIFY &gt; REPORT</span><span class="mark">swarmops</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Lane count**: 5-8. Lane rows use `justify-content: space-around`, so fewer lanes spread out. Keep
  lanes × step = 12 s and the stage rail period equal (4 × 3 s); for 6 lanes use step 2 s.
- **Colours**: group lanes by role (3 competitors = `--c1`, analysis = `--c6`, …). Put the colour as `--item` on
  the lane, its beam, its `g.back` and its tree row.
- **Dots**: 34 per lane = 12 × 3 − 2. Change `cols` / `rows` in `MotionSetup` for denser clouds (≤ 60 per lane; SVG
  circles are cheap, but keep the whole page under ~600 dots).
- **Radial form** (the second reference): put `#coord` in the centre and 6 `.cloud` boxes around it; the same
  `--p`/`--k` fill works, and beams go centre → cloud.
- **Portrait**: stack the side column under the fan card and shrink clouds to 240 px; use `data-canvas="portrait"`.
- **Pitfalls**: dots are generated after connectors are measured, so give `.cloud` a fixed size. Do not put
  `data-beam` and `data-packets` on the same path. `data-count` shows 0 while a lane is queued, so do not use it for
  header KPIs (use `data-ticker`).
