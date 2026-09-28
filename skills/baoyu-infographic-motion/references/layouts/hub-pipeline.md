# hub-pipeline

A glowing centre node with 3-4 satellite cards, a numbered step row underneath, and per-satellite progress cards: a
few big tracks around one core, plus the process that runs inside it.

## Use when / Avoid when

- **Use when**: "how she prepared for 57 interviews", a model and its 4 inputs, a study plan, a team of 3-4 agents
  around one orchestrator, a concept with a forward-pass-style sequence (tokens > embed > attention > MLP > logits).
- **Avoid when**: more than 5 satellites (use `orbit-panel` or `columns-to-hub`), or no sequence to show (drop the
  step row and use `columns-to-hub`).

## Structure

- **Stage** (flex: 1, min 440 px) with a centred 972×480 canvas: radial glow, 3 orbit layers, `#hub` (170 px
  circle), 4 satellite cards (`#s1` top-left, `#s2` top-right, `#s3` lower-left, `#s4` lower-right).
- **Step row**: 5 steps linked by straight edges with packets; own nested cycle.
- **Loop bar**: whole-video progress bar with a colour gradient and a short path.
- **Quad**: 2×2 progress cards, one per satellite (label, bar, live percentage).
- **Band**: 4 stats. **Footer**.

## Motion recipe

- **Master cycle** `sat`: 4 satellites × 3 s = 12 s, `data-cycles="2"` (24 s). Satellite, beam and quad card share
  `data-index`; the ACTIVE tag fades in on the satellite.
- **Beams**: top satellites link to `#hub@top`, lower ones to the hub side. Faint edges carry 2 packets each
  (`data-period="3"`).
- **Nested clock** `pipe`: 5 steps × 0.6 s = 3 s (4 passes per satellite), `data-sfx="tick"`; bars fill with
  `max(--p, --done)`.
- **Hub**: `data-pulse="1.5"`, glow `data-pulse="3"`, colours follow `--accent`.
- **Ambient**: orbit layers with `data-spin` (18 s, -12 s squashed, 24 s tilted), tickers, `data-progress="time"`.
- **Sound**: `blip` per satellite, `tick` per step, `packet` on beam arrival.

## Skeleton

Portrait 1080×1350.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Fifty Seven Interviews One Stack</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-body { display: flex; flex-direction: column; gap: 16px; }
  .stage { position: relative; flex: 1; min-height: 440px; }
  .canvas { position: absolute; left: 0; right: 0; top: 50%; height: 480px; margin-top: -240px; }
  .glow { position: absolute; left: 50%; top: 250px; width: 520px; height: 520px; translate: -50% -50%; border-radius: 50%;
    background: radial-gradient(closest-side, color-mix(in oklab, var(--accent) calc(18% + var(--pulse) * 14%), transparent), transparent); }
  .orbit { position: absolute; left: 50%; top: 250px; width: 0; height: 0; }
  .orbit > div { position: absolute; border-radius: 50%; border: 1px solid color-mix(in oklab, var(--accent) 35%, transparent); }
  .orbit i { position: absolute; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px var(--accent); }
  #hub { position: absolute; left: 50%; top: 250px; width: 170px; height: 170px; translate: -50% -50%; z-index: 3; font-family: var(--font-mono); }
  #hub b { display: block; font-family: var(--font-display); font-weight: var(--title-weight); font-size: 40px; line-height: 1; color: var(--accent); text-transform: var(--title-case); }
  #hub small { display: block; font-size: 12px; letter-spacing: .1em; color: var(--muted); margin-top: 6px; }
  .sat { position: absolute; z-index: 3; width: 270px; padding: 14px 16px; display: grid; grid-template-columns: 44px 1fr; gap: 12px; align-items: center;
    background: color-mix(in oklab, var(--item) calc(var(--on) * 12%), var(--panel)); scale: calc(1 + var(--on) * .04); }
  .sat .no { position: relative; width: 44px; height: 44px; border-radius: 10px; display: grid; place-items: center; font-family: var(--font-mono); font-size: 14px; font-weight: 600;
    color: var(--item); border: 1.5px solid var(--item); background: color-mix(in oklab, var(--item) calc(10% + var(--on) * 20%), var(--panel)); }
  .sat .no::after { content: ""; position: absolute; inset: -7px; border-radius: 50%; border: 1px dashed var(--item); opacity: calc(.2 + var(--on) * .8); }
  .sat b { display: block; font-family: var(--font-display); font-weight: var(--title-weight); font-size: 21px; text-transform: var(--title-case); line-height: 1.1; }
  .sat small { display: block; font-family: var(--font-mono); font-size: 12px; letter-spacing: .05em; color: var(--muted); margin-top: 3px; }
  .sat .tag { position: absolute; right: 12px; top: -10px; padding: 2px 8px; border-radius: 999px; font-family: var(--font-mono); font-size: 11px; letter-spacing: .08em;
    background: var(--item); color: var(--bg); opacity: var(--on); }
  .pipe { position: relative; display: grid; grid-template-columns: repeat(5, 1fr); gap: 34px; }
  .pipe .mi-svg { z-index: 0; }
  .st { position: relative; z-index: 1; padding: 12px 14px; border-radius: 10px; border: 1.5px solid color-mix(in oklab, var(--item) calc(35% + var(--on) * 65%), var(--line));
    background: color-mix(in oklab, var(--item) calc(var(--on) * 16%), var(--panel)); font-family: var(--font-mono); }
  .st span { font-size: 11px; color: var(--muted); letter-spacing: .08em; }
  .st b { display: block; font-family: var(--font-display); font-size: 19px; font-weight: var(--title-weight); text-transform: var(--title-case); margin-top: 2px; }
  .st .mi-bar { height: 3px; margin-top: 8px; }
  .st .mi-bar > i { width: calc(max(var(--p), var(--done)) * 100%); }
  .loop { display: grid; grid-template-columns: auto 1fr auto; gap: 16px; align-items: center; padding: 12px 16px; font-family: var(--font-mono); font-size: 13px; letter-spacing: .05em; }
  .loop .mi-bar { height: 8px; }
  .loop .mi-bar > i { background: linear-gradient(90deg, var(--c1), var(--c2), var(--c3), var(--c4)); }
  .quad { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .q { padding: 14px 16px; display: grid; grid-template-columns: 1fr auto; gap: 6px 16px; align-items: end; border-top: 3px solid var(--item); }
  .mi-card.q[data-item] { border-top-color: var(--item); }
  .q .mi-label { grid-column: 1 / -1; display: flex; justify-content: space-between; }
  .q .mi-label b { color: var(--item); font-weight: 600; }
  .q strong { font-family: var(--font-display); font-size: 34px; line-height: 1; color: var(--item); font-variant-numeric: tabular-nums; }
  .q .mi-bar { height: 6px; align-self: center; }
</style>
</head>
<body data-canvas="portrait" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="0.9">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">RESEARCH PREP / STUDY STACK / 57 INTERVIEWS</span><span class="mi-meta">TRACK <span data-counter="sat">01</span> / 04 &middot; T <span data-clock></span></span></div>
    <h1 class="mi-title">57 interviews, <em>one stack</em></h1>
    <div class="mi-sub"><span>LLMS</span><span class="sep">/</span><span>MATH</span><span class="sep">/</span><span>FROM SCRATCH</span><span class="sep">/</span><span>JOB SEARCH</span></div>
    <div class="mi-rule" data-progress="sat"></div>
  </header>

  <section class="mi-body" data-cycle="sat" data-step="3" data-sfx="blip" data-accent data-master>
    <div class="stage"><div class="canvas">
      <div class="glow" data-pulse="3"></div>
      <div class="orbit"><div data-spin="18" style="left:-150px;top:-150px;width:300px;height:300px"><i style="left:147px;top:-3px"></i><i style="left:40px;top:40px;opacity:.5"></i></div></div>
      <div class="orbit" style="scale:1 .42"><div data-spin="-12" style="left:-230px;top:-230px;width:460px;height:460px;border-style:dashed"><i style="left:227px;top:-3px;scale:1.4"></i><i style="left:-3px;top:227px"></i><i style="left:390px;top:370px;opacity:.6"></i></div></div>
      <div class="orbit" style="scale:1 .6;rotate:-18deg"><div data-spin="24" style="left:-200px;top:-200px;width:400px;height:400px;opacity:.6"><i style="left:197px;bottom:-3px"></i></div></div>
      <svg class="mi-svg">
        <path class="mi-edge" data-link="#s1 #hub@top" data-packets="2" data-period="3" data-r="2.5"></path>
        <path class="mi-edge" data-link="#s2 #hub@top" data-packets="2" data-period="3" data-r="2.5"></path>
        <path class="mi-edge" data-link="#s3@right #hub@left" data-packets="2" data-period="3" data-r="2.5"></path>
        <path class="mi-edge" data-link="#s4@left #hub@right" data-packets="2" data-period="3" data-r="2.5"></path>
        <path class="mi-beam" data-link="#s1 #hub@top" data-beam data-item="sat" data-index="0" data-sfx-end="packet" style="--item: var(--c1)"></path>
        <path class="mi-beam" data-link="#s2 #hub@top" data-beam data-item="sat" data-index="1" data-sfx-end="packet" style="--item: var(--c2)"></path>
        <path class="mi-beam" data-link="#s3@right #hub@left" data-beam data-item="sat" data-index="2" data-sfx-end="packet" style="--item: var(--c3)"></path>
        <path class="mi-beam" data-link="#s4@left #hub@right" data-beam data-item="sat" data-index="3" data-sfx-end="packet" style="--item: var(--c4)"></path>
      </svg>
      <div id="hub" class="mi-hub" data-pulse="1.5"><div><b>LLM</b><small>STUDY CORE</small><small><span data-counter="sat">01</span> / 04 TRACKS</small></div></div>
      <div id="s1" class="mi-card sat" data-item="sat" data-index="0" data-color="var(--c1)" style="--item:var(--c1);left:40px;top:10px"><span class="no">01</span><div><b>LLM notes</b><small>attention / mlp / rnn</small></div><span class="tag">ACTIVE</span></div>
      <div id="s2" class="mi-card sat" data-item="sat" data-index="1" data-color="var(--c2)" style="--item:var(--c2);right:40px;top:10px"><span class="no">02</span><div><b>Math notes</b><small>gradients / probability</small></div><span class="tag">ACTIVE</span></div>
      <div id="s3" class="mi-card sat" data-item="sat" data-index="2" data-color="var(--c3)" style="--item:var(--c3);left:0;top:330px"><span class="no">03</span><div><b>From scratch</b><small>400-line transformer</small></div><span class="tag">ACTIVE</span></div>
      <div id="s4" class="mi-card sat" data-item="sat" data-index="3" data-color="var(--c4)" style="--item:var(--c4);right:0;top:330px"><span class="no">04</span><div><b>Job search</b><small>57 calls / 11 offers</small></div><span class="tag">ACTIVE</span></div>
    </div></div>

    <div class="mi-top mi-label"><span class="acc">FORWARD PASS</span><span>ONE TOKEN, FIVE STAGES</span></div>
    <div class="pipe" data-cycle="pipe" data-step="0.6" data-sfx="tick">
      <svg class="mi-svg">
        <path class="mi-edge" data-link="#p1 #p2" data-shape="straight" data-packets="1" data-period="1.5" data-r="3"></path>
        <path class="mi-edge" data-link="#p2 #p3" data-shape="straight" data-packets="1" data-period="1.5" data-r="3"></path>
        <path class="mi-edge" data-link="#p3 #p4" data-shape="straight" data-packets="1" data-period="1.5" data-r="3"></path>
        <path class="mi-edge" data-link="#p4 #p5" data-shape="straight" data-packets="1" data-period="1.5" data-r="3"></path>
      </svg>
      <div id="p1" class="st" data-item style="--item:var(--c1)"><span>01</span><b>Tokens</b><div class="mi-bar"><i></i></div></div>
      <div id="p2" class="st" data-item style="--item:var(--c2)"><span>02</span><b>Embed</b><div class="mi-bar"><i></i></div></div>
      <div id="p3" class="st" data-item style="--item:var(--c3)"><span>03</span><b>Attention</b><div class="mi-bar"><i></i></div></div>
      <div id="p4" class="st" data-item style="--item:var(--c4)"><span>04</span><b>MLP</b><div class="mi-bar"><i></i></div></div>
      <div id="p5" class="st" data-item style="--item:var(--c5)"><span>05</span><b>Logits</b><div class="mi-bar"><i></i></div></div>
    </div>

    <div class="mi-card loop"><span class="mi-label acc">STUDY LOOP</span><div class="mi-bar" data-progress="time"><i></i></div><span>FOUNDATIONS &gt; BUILD &gt; EXPLAIN &gt; ITERATE</span></div>

    <div class="quad">
      <div class="mi-card q" data-item="sat" data-index="0" style="--item:var(--c1)"><div class="mi-label"><b>LLM NOTES</b><span>ATTENTION / MLP</span></div><div class="mi-bar" data-bar=".72" data-jitter=".04"><i></i></div><strong data-ticker="72" data-jitter="1.5" data-suffix="%">72%</strong></div>
      <div class="mi-card q" data-item="sat" data-index="1" style="--item:var(--c2)"><div class="mi-label"><b>MATH NOTES</b><span>GRADIENTS</span></div><div class="mi-bar" data-bar=".58" data-jitter=".04"><i></i></div><strong data-ticker="58" data-jitter="1.5" data-suffix="%">58%</strong></div>
      <div class="mi-card q" data-item="sat" data-index="2" style="--item:var(--c3)"><div class="mi-label"><b>FROM SCRATCH</b><span>400 LINES</span></div><div class="mi-bar" data-bar=".86" data-jitter=".04"><i></i></div><strong data-ticker="86" data-jitter="1.5" data-suffix="%">86%</strong></div>
      <div class="mi-card q" data-item="sat" data-index="3" style="--item:var(--c4)"><div class="mi-label"><b>JOB SEARCH</b><span>11 COMPANIES</span></div><div class="mi-bar" data-bar=".64" data-jitter=".04"><i></i></div><strong data-ticker="64" data-jitter="1.5" data-suffix="%">64%</strong></div>
    </div>
  </section>

  <section class="mi-band" style="--cols: 4">
    <div class="mi-stat" style="--item: var(--c1)"><span class="mi-stat-v">57</span><span class="mi-stat-l">Interviews</span></div>
    <div class="mi-stat" style="--item: var(--c2)"><span class="mi-stat-v">11</span><span class="mi-stat-l">Companies</span></div>
    <div class="mi-stat" style="--item: var(--c3)"><span class="mi-stat-v" data-ticker="312" data-jitter="4" data-suffix="h">312h</span><span class="mi-stat-l">Study hours</span></div>
    <div class="mi-stat"><span class="mi-stat-v"><span data-counter="sat">01</span>/04</span><span class="mi-stat-l">Active track</span></div>
  </section>

  <footer class="mi-foot"><span>SOURCE / INTERVIEW NOTES, SEP 2026</span><span class="path">LEARN &gt; BUILD &gt; EXPLAIN &gt; ITERATE</span><span class="mark">fieldnotes</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **3 satellites**: remove `#s4`, move `#s3` to the bottom centre of the canvas and link it to
  `#hub@bottom`; step 4 s.
- **Step row**: 3-6 steps. Keep `steps × step` a divisor of the master period.
- **Square**: remove the quad (the band already carries the numbers).
- **Story**: stack stage, step row (as a column, links `@bottom → @top`), quad.
- **Pitfalls**: satellite subtitles ≤ 24 characters. Numbers in the quad use `data-ticker` (not `data-count` with
  `data-item`), so frame 0 shows every value, not zeros.
