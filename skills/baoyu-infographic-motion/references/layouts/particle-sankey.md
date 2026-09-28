# particle-sankey

A cloud of incoming requests drifts down and funnels into one glowing gate; below it the flow splits into 6
vertical lanes where particles fall like a waterfall into bins, each lane as dense as its share. One lane at a time
brightens, pops a label chip and glows its bin, while a row of 6 telemetry panels keeps ticking underneath.

## Use when / Avoid when

- **Use when**: one decision point splits a stream into 4-6 outcomes (router, classifier, triage gate, moderation,
  lead scoring), and the share of each outcome matters; "everything goes through one gate" stories.
- **Avoid when**: the outcomes are sequential steps (use `card-pipeline` or `hub-pipeline`), there are more than 6
  outcomes (columns get too thin), or the flow has several gates in a row (use `hierarchical-layers`).

## Structure

Canvas `portrait` 1080×1350. Dark dashboard page with its own header (no `.mi-sub`).

- **Header** `.hd`: title with one `em` word + `.kick` line, 5 KPI tiles `.kpi` (`data-ticker`).
- **Stage** `.stage.mi-body` (780 px tall, the master cycle): one `svg.flow` overlay that `MotionSetup` fills with
  guide curves and ~560 particles; `.intake` note top-left; `#gate` (`.mi-hub`, 64 px) at the funnel point with a
  `.gl-list` of what the gate asks; 6 `.col` lanes (absolute, `left` = lane centre x) each with a name + share `.nm`,
  a glow beam (`::before`), a cyan `.chip` (height via `--cy`) and a `.bin` with a count.
- **Panels** `.panels`: 3 × 2 `.mi-card.pn`: stream `.mi-log`, mode bars, big receipts counter `#rcpt`, outcomes
  rows, gate-time histogram (`data-bar` + jitter), split bars (shares).
- **Footer**.

## Motion recipe

- **Master cycle** `lane` on `.stage`: 6 lanes × `data-step="2"` = 12 s, `data-cycles="2"` (24 s),
  `data-sfx="blip"`, `data-accent`. Each `.col` is the item; its beam, name, chip and bin read `--on`.
- **Particles** (custom JS, fully from `t`): each particle has a phase `ph`, a start point in the cloud and a lane
  `k` picked by the share weights. With `u = (t / P + ph) mod 1` and `P = 6` s (divides 12 and 24):
  `u < 0.40` cloud → gate (quadratic curve, eased), `0.40-0.55` gate → lane top along the guide curve,
  `0.55-1` falls down the lane with a small sideways jitter. Opacity fades in/out at the ends of `u`, so the loop
  has no pop. Cloud particles are white; they switch to the lane colour (`.c0`-`.c5`) after the gate.
- **Active lane**: particles of lane `k` get `0.45 + on × 0.55` opacity. The runtime collects items before
  `MotionSetup` runs, so the script reads each `.col`'s inline `--on` every frame instead of relying on CSS
  inheritance.
- **Counters**: KPIs and bins use `data-ticker` (wobble, loop-safe). Receipts `#rcpt` = base + `--cycle-p` × 1180,
  so it climbs through each 12 s cycle and steps back at the cycle start (like `loop-track`).
- **Ambient**: gate `data-pulse="2"`, stream log every 1 s (4 rows), mode and histogram bars jitter.
- **Sound**: `blip` per lane (12 cues in 24 s).
- **Poster**: `data-poster="2.6"` (second lane lit, chip shown).

## Skeleton

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Every Request Picks a Lane</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-page { gap: 14px; }
  .hd { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
  .hd .mi-title { font-size: calc(var(--title-size) * .66); white-space: nowrap; }
  .hd .kick { font-family: var(--font-mono); font-size: 13px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-top: 8px; }
  .kpis { display: flex; }
  .kpi { padding: 2px 10px; border-left: 1px solid var(--line); min-width: 0; }
  .kpi .mi-label { font-size: 11px; }
  .kpi b { display: block; font-family: var(--font-mono); font-size: 20px; font-weight: 700; margin-top: 6px; white-space: nowrap; color: var(--item, var(--ink)); font-variant-numeric: tabular-nums; }
  .stage { position: relative; height: 780px; }
  .stage svg.flow { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .flow circle { fill: #e9edf2; }
  .flow .c0 { fill: var(--c2); } .flow .c1 { fill: var(--c3); } .flow .c2 { fill: var(--c5); }
  .flow .c3 { fill: #7fd1e6; } .flow .c4 { fill: var(--c6); } .flow .c5 { fill: var(--c4); }
  .flow .gl { stroke: rgba(210, 216, 224, .1); stroke-width: 1; fill: none; }
  #gate { position: absolute; left: 464px; top: 188px; width: 64px; height: 64px; font-size: 13px; line-height: 1.1; }
  #gate small { display: block; font-family: var(--font-mono); font-style: normal; font-weight: 400; font-size: 10px; color: var(--muted); }
  .gl-list { position: absolute; left: 552px; top: 170px; font-family: var(--font-mono); font-size: 12px; line-height: 1.7; color: var(--muted); }
  .gl-list b { color: var(--ink); font-weight: 500; }
  .gl-list i { font-style: normal; color: var(--accent); }
  .intake { position: absolute; left: 0; top: 0; font-family: var(--font-mono); font-size: 12px; color: var(--muted); line-height: 1.6; }
  .intake b { color: var(--ink); font-weight: 500; }
  .col { position: absolute; top: 262px; width: 132px; height: 500px; translate: -50% 0; }
  .col::before { content: ""; position: absolute; left: 50%; top: 40px; bottom: 58px; width: 34px; translate: -50% 0; border-radius: 17px;
    background: linear-gradient(180deg, transparent, color-mix(in oklab, var(--item) 40%, transparent) 30%, color-mix(in oklab, var(--item) 22%, transparent));
    opacity: calc(.12 + var(--on) * .7); }
  .col .nm { position: absolute; left: 0; right: 0; top: 0; text-align: center; font-family: var(--font-mono); font-size: 13px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
    color: color-mix(in oklab, var(--item) calc(55% + var(--on) * 45%), var(--muted)); }
  .col .sh { display: block; font-size: 11px; font-weight: 400; color: var(--muted); letter-spacing: 0; margin-top: 3px; }
  .col .chip { position: absolute; left: 50%; top: var(--cy, 160px); translate: -50% 0; white-space: nowrap; padding: 3px 9px; border-radius: 3px; font-family: var(--font-mono); font-size: 11px;
    color: #071218; background: #7fe3f2; box-shadow: 0 0 14px rgba(127, 227, 242, .55); opacity: var(--on); scale: calc(.85 + var(--on) * .15); }
  .col .bin { position: absolute; left: 6px; right: 6px; bottom: 0; height: 50px; border: 1px solid color-mix(in oklab, var(--item) calc(35% + var(--on) * 65%), var(--line)); border-radius: 4px;
    background: color-mix(in oklab, var(--item) calc(6% + var(--on) * 14%), var(--panel)); text-align: center; font-family: var(--font-mono); padding-top: 6px;
    box-shadow: 0 0 calc(var(--on) * 18px) color-mix(in oklab, var(--item) 50%, transparent); }
  .col .bin b { display: block; font-size: 17px; color: var(--ink); font-variant-numeric: tabular-nums; }
  .col .bin span { font-size: 10px; color: var(--muted); letter-spacing: .1em; text-transform: uppercase; }
  .panels { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .pn { padding: 12px 14px; height: 172px; overflow: hidden; }
  .pn .mi-label { display: flex; justify-content: space-between; margin-bottom: 8px; }
  .pn .mi-log { font-size: 12px; --row-h: 22px; }
  .pn .mi-log .k { color: var(--accent); }
  .pn .mi-log .d { color: var(--muted); }
  .rw { display: grid; grid-template-columns: 74px 1fr 46px; gap: 8px; align-items: center; height: 24px; font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
  .rw b { color: var(--ink); font-weight: 500; text-align: right; font-variant-numeric: tabular-nums; }
  .big { font-family: var(--font-mono); font-size: 44px; font-weight: 700; color: var(--accent); font-variant-numeric: tabular-nums; line-height: 1.1; }
  .sub { font-family: var(--font-mono); font-size: 11px; color: var(--muted); margin-top: 6px; line-height: 1.6; }
  .hist { display: flex; align-items: flex-end; gap: 3px; height: 110px; }
  .hist i { flex: 1; height: calc(8% + var(--value, .5) * 92%); background: color-mix(in oklab, var(--ink) 55%, transparent); border-radius: 1px; }
  .hist i.hot { background: var(--accent); }
  .ot { display: flex; justify-content: space-between; height: 24px; align-items: center; font-family: var(--font-mono); font-size: 12px; color: var(--muted); border-bottom: 1px solid var(--line); }
  .ot b { color: var(--item, var(--ink)); font-weight: 600; font-variant-numeric: tabular-nums; }
  .sp .rw { grid-template-columns: 70px 1fr 36px; height: 18px; font-size: 11px; }
  .sp .mi-bar { height: 5px; }
</style>
<script>
window.MotionSetup = (M) => {
  const NS = "http://www.w3.org/2000/svg";
  const stage = document.querySelector(".stage");
  const svg = document.querySelector(".flow");
  const W = stage.clientWidth;
  const cols = [...document.querySelectorAll(".col")];
  const cx = cols.map((c) => parseFloat(c.style.left));
  const share = [0.30, 0.22, 0.16, 0.14, 0.10, 0.08];
  const G = { x: 496, y: 220 }, TOP = 312, BOT = 696, P = 6, N = 560;
  const r = M.rng(71);
  cx.forEach((x) => {
    const p = document.createElementNS(NS, "path");
    p.setAttribute("class", "gl");
    p.setAttribute("d", `M${G.x} ${G.y + 30} Q ${x} ${G.y + 30} ${x} ${TOP}`);
    svg.appendChild(p);
  });
  const parts = [];
  for (let i = 0; i < N; i++) {
    let u = r(), k = 0, acc = share[0];
    while (u > acc && k < 5) acc += share[++k];
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("r", (1.3 + r() * 1.3).toFixed(2));
    svg.appendChild(c);
    parts.push({ c, k, ph: r(), sx: 20 + r() * (W - 40), sy: 30 + r() * 110, jx: (r() - .5) * 22, w: r() * 6.28, lit: -1 });
  }
  const bez = (a, b, q, s) => (1 - s) * (1 - s) * a + 2 * (1 - s) * s * q + s * s * b;
  const rc = document.querySelector("#rcpt"), cyc = document.querySelector('[data-cycle="lane"]');
  M.on((t) => {
    const on = cols.map((c) => parseFloat(c.style.getPropertyValue("--on")) || 0);
    for (const p of parts) {
      const u = (t / P + p.ph) % 1;
      let x, y, stage2 = u >= 0.4;
      if (u < 0.4) {
        const s = u / 0.4, e = s * s * (3 - 2 * s);
        x = bez(p.sx, G.x, (p.sx + G.x) / 2, e);
        y = bez(p.sy, G.y, p.sy + 90, e);
      } else if (u < 0.55) {
        const s = (u - 0.4) / 0.15;
        x = bez(G.x, cx[p.k], cx[p.k], s);
        y = bez(G.y + 30, TOP, G.y + 30, s);
      } else {
        const s = (u - 0.55) / 0.45;
        x = cx[p.k] + p.jx * Math.min(1, s * 4) + Math.sin(p.w + s * 9) * 2;
        y = TOP + (BOT - TOP) * Math.pow(s, 1.25);
      }
      const fade = Math.min(1, u / 0.05, (1 - u) / 0.05);
      const lit = stage2 ? 0.45 + on[p.k] * 0.55 : 0.7;
      p.c.setAttribute("cx", x.toFixed(1));
      p.c.setAttribute("cy", y.toFixed(1));
      p.c.setAttribute("opacity", (fade * lit).toFixed(2));
      const want = stage2 ? p.k : -1;
      if (want !== p.lit) { p.lit = want; p.c.setAttribute("class", want < 0 ? "" : "c" + want); }
    }
    const cp = parseFloat(cyc.style.getPropertyValue("--cycle-p")) || 0;
    rc.textContent = (12400 + Math.floor(cp * 1180)).toLocaleString("en-US");
  });
};
</script>
</head>
<body data-canvas="portrait" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="2.6">
<main class="mi-page">
  <header class="hd">
    <div>
      <h1 class="mi-title"><em>Every request</em> picks a lane</h1>
      <div class="kick">one gate &middot; six routes &middot; nothing unrouted</div>
    </div>
    <div class="kpis">
      <div class="kpi"><div class="mi-label">In / min</div><b data-ticker="1840" data-jitter="40" data-group>1,840</b></div>
      <div class="kpi"><div class="mi-label">Routed</div><b data-ticker="99.2" data-jitter=".2" data-decimals="1" data-suffix="%">99.2%</b></div>
      <div class="kpi" style="--item:var(--c4)"><div class="mi-label">Fallback</div><b data-ticker="8" data-jitter="1" data-suffix="%">8%</b></div>
      <div class="kpi"><div class="mi-label">p50 gate</div><b data-ticker="4" data-jitter=".6" data-suffix=" ms">4 ms</b></div>
      <div class="kpi" style="--item:var(--c1)"><div class="mi-label">Cost / 1k</div><b data-ticker="0.21" data-jitter=".01" data-decimals="2" data-prefix="$">$0.21</b></div>
    </div>
  </header>

  <section class="stage mi-body" data-cycle="lane" data-step="2" data-sfx="blip" data-accent data-master>
    <svg class="flow"></svg>
    <div class="intake"><b>INTAKE</b> &middot; tickets, emails, api calls<br>typed state only &middot; no prose in</div>
    <div id="gate" class="mi-hub" data-pulse="2"><div>GATE<small>1 call</small></div></div>
    <div class="gl-list"><b>asks</b> &middot; which lane?<br><b>asks</b> &middot; how sure?<br><b>floor</b> &middot; <i>0.85</i> else fallback</div>
    <div class="col" style="left:96px;--item:var(--c2)" data-item data-color="var(--c2)"><div class="nm">Billing<span class="sh">30%</span></div><span class="chip" style="--cy:150px">refund rule hit</span><div class="bin"><b data-ticker="3720" data-jitter="14" data-group>3,720</b><span>handled</span></div></div>
    <div class="col" style="left:256px;--item:var(--c3)" data-item data-color="var(--c3)"><div class="nm">Support<span class="sh">22%</span></div><span class="chip" style="--cy:210px">known answer</span><div class="bin"><b data-ticker="2730" data-jitter="12" data-group>2,730</b><span>handled</span></div></div>
    <div class="col" style="left:416px;--item:var(--c5)" data-item data-color="var(--c5)"><div class="nm">Sales<span class="sh">16%</span></div><span class="chip" style="--cy:130px">lead scored 0.91</span><div class="bin"><b data-ticker="1980" data-jitter="10" data-group>1,980</b><span>handled</span></div></div>
    <div class="col" style="left:576px;--item:#7fd1e6" data-item data-color="#7fd1e6"><div class="nm">Security<span class="sh">14%</span></div><span class="chip" style="--cy:190px">sent to on-call</span><div class="bin"><b data-ticker="1740" data-jitter="9" data-group>1,740</b><span>handled</span></div></div>
    <div class="col" style="left:736px;--item:var(--c6)" data-item data-color="var(--c6)"><div class="nm">Archive<span class="sh">10%</span></div><span class="chip" style="--cy:150px">no action needed</span><div class="bin"><b data-ticker="1240" data-jitter="7" data-group>1,240</b><span>logged</span></div></div>
    <div class="col" style="left:896px;--item:var(--c4)" data-item data-color="var(--c4)"><div class="nm">Fallback<span class="sh">8%</span></div><span class="chip" style="--cy:210px">below floor &rarr; human</span><div class="bin"><b data-ticker="990" data-jitter="6" data-group>990</b><span>to human</span></div></div>
  </section>

  <section class="panels">
    <div class="mi-card pn">
      <div class="mi-label"><span>Stream</span><span>live</span></div>
      <div class="mi-log" data-log="1" data-rows="4">
        <div data-line><span class="k">gate</span> #2291 &rarr; billing <span class="d">0.94</span></div>
        <div data-line><span class="k">gate</span> #2292 &rarr; support <span class="d">0.90</span></div>
        <div data-line><span class="k">gate</span> #2293 &rarr; fallback <span class="d">0.71</span></div>
        <div data-line><span class="k">gate</span> #2294 &rarr; sales <span class="d">0.92</span></div>
        <div data-line><span class="k">gate</span> #2295 &rarr; archive <span class="d">0.97</span></div>
        <div data-line><span class="k">gate</span> #2296 &rarr; security <span class="d">0.88</span></div>
      </div>
    </div>
    <div class="mi-card pn">
      <div class="mi-label"><span>Mode</span><span>share</span></div>
      <div class="rw"><span>rule</span><span class="mi-bar" style="--item:var(--c3)"><i data-bar="0.46" data-jitter="0.04"></i></span><b>46%</b></div>
      <div class="rw"><span>typed ask</span><span class="mi-bar" style="--item:var(--c2)"><i data-bar="0.46" data-jitter="0.04"></i></span><b>46%</b></div>
      <div class="rw"><span>fallback</span><span class="mi-bar" style="--item:var(--c4)"><i data-bar="0.08" data-jitter="0.02"></i></span><b>8%</b></div>
      <div class="rw"><span>errors</span><span class="mi-bar" style="--item:var(--c1)"><i data-bar="0.01"></i></span><b>0.1%</b></div>
    </div>
    <div class="mi-card pn">
      <div class="mi-label"><span>Receipts written</span><span>this hour</span></div>
      <div class="big" id="rcpt">12,400</div>
      <div class="sub">one line per decision &middot; lane, score, floor<br>replayable &middot; 0 missing</div>
    </div>
    <div class="mi-card pn">
      <div class="mi-label"><span>Outcomes</span><span>24 h</span></div>
      <div class="ot" style="--item:var(--c3)"><span>resolved</span><b data-ticker="91.4" data-jitter=".3" data-decimals="1" data-suffix="%">91.4%</b></div>
      <div class="ot" style="--item:var(--c4)"><span>escalated</span><b data-ticker="6.9" data-jitter=".2" data-decimals="1" data-suffix="%">6.9%</b></div>
      <div class="ot" style="--item:var(--c1)"><span>reopened</span><b data-ticker="1.7" data-jitter=".1" data-decimals="1" data-suffix="%">1.7%</b></div>
      <div class="ot"><span>wrong lane</span><b data-ticker="0.4" data-jitter=".05" data-decimals="1" data-suffix="%">0.4%</b></div>
    </div>
    <div class="mi-card pn">
      <div class="mi-label"><span>Gate time</span><span>ms</span></div>
      <div class="hist">
        <i data-bar=".2" data-jitter=".05"></i><i data-bar=".45" data-jitter=".06"></i><i data-bar=".8" data-jitter=".06"></i><i class="hot" data-bar="1" data-jitter=".04"></i><i data-bar=".85" data-jitter=".06"></i><i data-bar=".62" data-jitter=".06"></i><i data-bar=".44" data-jitter=".05"></i><i data-bar=".3" data-jitter=".05"></i><i data-bar=".22" data-jitter=".04"></i><i data-bar=".15" data-jitter=".04"></i><i data-bar=".1" data-jitter=".03"></i><i data-bar=".07" data-jitter=".03"></i><i data-bar=".05" data-jitter=".02"></i><i data-bar=".04" data-jitter=".02"></i><i data-bar=".03" data-jitter=".02"></i><i data-bar=".02" data-jitter=".01"></i>
      </div>
    </div>
    <div class="mi-card pn sp">
      <div class="mi-label"><span>Split</span><span>by lane</span></div>
      <div class="rw"><span>billing</span><span class="mi-bar" style="--item:var(--c2)"><i data-bar="0.30"></i></span><b>30</b></div>
      <div class="rw"><span>support</span><span class="mi-bar" style="--item:var(--c3)"><i data-bar="0.22"></i></span><b>22</b></div>
      <div class="rw"><span>sales</span><span class="mi-bar" style="--item:var(--c5)"><i data-bar="0.16"></i></span><b>16</b></div>
      <div class="rw"><span>security</span><span class="mi-bar" style="--item:#7fd1e6"><i data-bar="0.14"></i></span><b>14</b></div>
      <div class="rw"><span>archive</span><span class="mi-bar" style="--item:var(--c6)"><i data-bar="0.10"></i></span><b>10</b></div>
      <div class="rw"><span>fallback</span><span class="mi-bar" style="--item:var(--c4)"><i data-bar="0.08"></i></span><b>8</b></div>
    </div>
  </section>
  <footer class="mi-foot"><span>ROUTING / DECISION GATE</span><span class="path">INTAKE &gt; GATE &gt; LANE &gt; RECEIPT</span><span class="mark">sankeyops</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Lane count**: 4-6. Put lane centres evenly across the stage width (`left:96px` … `left:896px` step 160 for 6);
  keep `share` in `MotionSetup` in the same order as the `.col` elements and summing to 1. Keep lanes × step = 12 s.
- **Colours**: particles use `.c0`-`.c5` in lane order; keep the fallback / human lane last and amber.
- **Density**: `N = 560` particles; stay under ~700. Raise `P` (must divide the video length) to slow the flow.
- **Chips**: 2-4 words; stagger `--cy` (130-210 px) so neighbouring chips do not line up.
- **Styles**: made for `telemetry-sim`; `midnight-grid` and `neon-constellation` work. Light styles need darker
  particle colours (`.flow circle` fill) for contrast.
- **Pitfalls**: give `.stage` a fixed height, because particle coordinates (`G`, `TOP`, `BOT`) are in stage pixels;
  when you change the stage height, move `BOT` to about 12 px above the bin tops. Do not use `data-count` for bins
  (it shows 0 while a lane is queued).
