# linear-progression

Ordered steps or dated events on one rail: a process, a timeline, a release pipeline.

## Use when / Avoid when

- **Use when**: how-to steps, release or training pipelines, historical timelines, onboarding flows, "stage N of M" stories.
- **Avoid when**: the process loops back (use `circular-flow`), steps branch (use `tree-branching`), or there are more than 7 steps (split into two rails or use `winding-roadmap`).

## Structure

- **Rail** (top): numbered nodes on a track with a progress fill. 3–7 stops (5 is ideal on portrait).
- **Stop cards** under each node: date / week, 2–3 word title, one line, one key-value, owner chip, step bar.
- **Detail panel** (bottom left): a `.mi-swap-host` with one swap per step (big count-up number, headline, sentence) and a pinned live sparkline.
- **Side column** (bottom right): checklist rows (one per step), a terminal log, and three live meters.
- Band with 3 stats, footer.

## Motion recipe

- **Master cycle** `main`, `data-step="1.6"`, one item per step. Node, stop card, detail swap and checklist row share `data-index`, so they light up together. `data-accent` blends the page accent to each step's `data-color`.
- **Beams**: one straight `.mi-beam` per gap (`#n1 #n2`, …). The beam into stop *k* has `data-index="k"`, so a dot travels from the previous node exactly when the step changes; `data-sfx-end="packet"` clicks on arrival.
- **Progress**: `.rail-track[data-progress="main"]` fills in the accent colour; the step bar in each card fills with `--p` and stays full with `--done`.
- **Counters**: `data-count` in each swap counts up during its step; header shows `data-counter="main"` and a `data-clock`.
- **Ambient loops**: `.mi-log` (new line every 0.8 s), `data-sparkline`, jittering `data-bar` meters and `data-ticker` stats keep the picture alive between steps.
- **Sound**: `data-sfx="blip"` on each step, `packet` on beam arrival, `soft` bed.
- **Length**: 5 steps × 1.6 s × `data-cycles="3"` = 24 s.

## Skeleton

Portrait 1080×1350. Paste it over the `index.html` that `main.ts init` creates, then replace the content.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>How a Model Ships</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-body { display: flex; flex-direction: column; }
  .rail { position: relative; display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
  .rail-track { position: absolute; left: 10%; right: 10%; top: 35px; height: 4px; background: var(--line); border-radius: 2px; }
  .rail-track i { position: absolute; inset: 0 auto 0 0; width: calc(var(--value, 0) * 100%); background: var(--accent); border-radius: inherit; }
  .stop { display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .node { position: relative; z-index: 2; width: 74px; height: 74px; border-radius: 50%; display: grid; place-items: center; font-family: var(--font-display); font-weight: var(--title-weight); font-size: 28px; color: color-mix(in oklab, var(--item) calc(40% + var(--on) * 60%), var(--muted)); background: color-mix(in oklab, var(--item) calc(max(var(--on), var(--done)) * 16%), var(--panel)); border: 3px solid color-mix(in oklab, var(--item) calc(35% + var(--on) * 65%), var(--line)); scale: calc(1 + var(--on) * 0.12); box-shadow: 0 0 calc(var(--on) * 34px * var(--glow)) color-mix(in oklab, var(--item) 60%, transparent); }
  .stop .mi-card { width: 100%; padding: 16px 14px; display: flex; flex-direction: column; gap: 8px; min-height: 236px; translate: 0 calc(var(--on) * -8px); }
  .stop .mi-card b { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 23px; line-height: 1.05; text-transform: var(--title-case); }
  .stop .mi-card p { font-size: 13px; line-height: 1.4; color: var(--muted); }
  .stop .mi-card .mi-bar { height: 5px; margin-top: auto; }
  .stop .mi-card .mi-bar > i { width: calc(max(var(--p), var(--done)) * 100%); }
  .stop .mi-chip { align-self: flex-start; font-size: 12px; padding: 3px 8px; }
  .when { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.08em; color: var(--muted); }
  .kv { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 13px; }
  .kv span:last-child { color: var(--item); font-weight: 600; }
  .detail { flex: 1; display: grid; grid-template-columns: 1.1fr 1fr; gap: 22px; margin-top: 26px; }
  .detail .mi-swap-host { min-height: 380px; }
  .spark { position: absolute; left: 22px; right: 22px; bottom: 20px; display: flex; flex-direction: column; gap: 6px; }
  .spark svg { width: 100%; height: 170px; border-top: 1px dashed var(--line); }
  .detail .mi-swap { display: flex; flex-direction: column; gap: 12px; }
  .big { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 84px; line-height: 0.9; color: var(--item); font-variant-numeric: tabular-nums; }
  .detail h4 { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 30px; text-transform: var(--title-case); line-height: 1.05; }
  .detail p { font-size: 15px; line-height: 1.45; color: var(--muted); }
  .checks { display: flex; flex-direction: column; gap: 9px; }
  .checks .mi-row { font-size: 14px; padding: 9px 12px; }
  .checks .mi-row em { font-style: normal; margin-left: auto; color: var(--muted); font-size: 12px; }
  .meters { display: grid; gap: 10px; margin-top: auto; }
  .meters div { display: grid; grid-template-columns: 110px 1fr 52px; align-items: center; gap: 12px; font-family: var(--font-mono); font-size: 13px; color: var(--muted); }
  .meters b { font-weight: 600; color: var(--ink); text-align: right; }
  .log { background: var(--code-bg); color: var(--code-ink); border-radius: calc(var(--radius) * 0.7); padding: 14px 16px; }
  .log .mi-log { --row-h: 26px; --rows: 4; font-size: 13px; }
  .log .k { color: var(--code-accent); }
</style>
</head>
<body data-canvas="portrait" data-cycles="3" data-sfx="soft" data-fps="30" data-poster="0.9">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">ML PLATFORM / RELEASE PLAYBOOK / V4.2</span><span class="mi-meta">STAGE <span data-counter="main">01</span> / 05 &middot; T <span data-clock></span></span></div>
    <h1 class="mi-title">How a model <em>ships</em></h1>
    <div class="mi-sub"><span>DATA</span><span class="sep">&gt;</span><span>TRAIN</span><span class="sep">&gt;</span><span>ALIGN</span><span class="sep">&gt;</span><span>EVAL</span><span class="sep">&gt;</span><span>DEPLOY</span></div>
    <div class="mi-rule" data-progress="main"></div>
  </header>

  <section class="mi-body" data-cycle="main" data-step="1.6" data-sfx="blip" data-accent data-master>
    <svg class="mi-svg">
      <path class="mi-beam" data-link="#n1 #n2" data-shape="straight" data-gap="4" data-beam data-item="main" data-index="1" style="--item: var(--c2)" data-sfx-end="packet"></path>
      <path class="mi-beam" data-link="#n2 #n3" data-shape="straight" data-gap="4" data-beam data-item="main" data-index="2" style="--item: var(--c3)" data-sfx-end="packet"></path>
      <path class="mi-beam" data-link="#n3 #n4" data-shape="straight" data-gap="4" data-beam data-item="main" data-index="3" style="--item: var(--c4)" data-sfx-end="packet"></path>
      <path class="mi-beam" data-link="#n4 #n5" data-shape="straight" data-gap="4" data-beam data-item="main" data-index="4" style="--item: var(--c5)" data-sfx-end="packet"></path>
    </svg>

    <div class="rail">
      <div class="rail-track" data-progress="main"><i></i></div>
      <div class="stop" style="--item: var(--c1)">
        <div id="n1" class="node" data-item="main" data-index="0" data-color="var(--c1)">01</div>
        <div class="mi-card" data-item="main" data-index="0"><span class="when">WK 01&ndash;03</span><b>Curate data</b><p>Dedupe, filter, tag 14 sources</p><div class="kv"><span>tokens</span><span>2.1T</span></div><span class="mi-chip">data-eng</span><div class="mi-bar"><i></i></div></div>
      </div>
      <div class="stop" style="--item: var(--c2)">
        <div id="n2" class="node" data-item="main" data-index="1" data-color="var(--c2)">02</div>
        <div class="mi-card" data-item="main" data-index="1"><span class="when">WK 04&ndash;09</span><b>Pretrain</b><p>Next-token loss on 512 GPUs</p><div class="kv"><span>loss</span><span>1.84</span></div><span class="mi-chip">infra</span><div class="mi-bar"><i></i></div></div>
      </div>
      <div class="stop" style="--item: var(--c3)">
        <div id="n3" class="node" data-item="main" data-index="2" data-color="var(--c3)">03</div>
        <div class="mi-card" data-item="main" data-index="2"><span class="when">WK 10&ndash;11</span><b>Align</b><p>SFT then preference tuning</p><div class="kv"><span>pairs</span><span>380K</span></div><span class="mi-chip">research</span><div class="mi-bar"><i></i></div></div>
      </div>
      <div class="stop" style="--item: var(--c4)">
        <div id="n4" class="node" data-item="main" data-index="3" data-color="var(--c4)">04</div>
        <div class="mi-card" data-item="main" data-index="3"><span class="when">WK 12</span><b>Evaluate</b><p>Evals, red team, regressions</p><div class="kv"><span>suites</span><span>62</span></div><span class="mi-chip">evals</span><div class="mi-bar"><i></i></div></div>
      </div>
      <div class="stop" style="--item: var(--c5)">
        <div id="n5" class="node" data-item="main" data-index="4" data-color="var(--c5)">05</div>
        <div class="mi-card" data-item="main" data-index="4"><span class="when">WK 13</span><b>Deploy</b><p>Canary 5% then full rollout</p><div class="kv"><span>p50</span><span>210ms</span></div><span class="mi-chip">sre</span><div class="mi-bar"><i></i></div></div>
      </div>
    </div>

    <div class="detail">
      <div class="mi-card mi-swap-host">
        <div class="mi-swap" data-item="main" data-index="0" style="--item: var(--c1); padding: 22px"><span class="mi-label acc">STAGE 01 / DATA</span><span class="big" data-count="2.1" data-suffix="T">2.1T</span><h4>Clean tokens in</h4><p>Near-duplicate removal cuts the raw crawl by 38 percent before any GPU time is spent.</p></div>
        <div class="mi-swap" data-item="main" data-index="1" style="--item: var(--c2); padding: 22px"><span class="mi-label acc">STAGE 02 / PRETRAIN</span><span class="big" data-count="41" data-suffix="d">41d</span><h4>Wall-clock run</h4><p>Checkpoints every 2K steps. Two loss spikes rolled back automatically.</p></div>
        <div class="mi-swap" data-item="main" data-index="2" style="--item: var(--c3); padding: 22px"><span class="mi-label acc">STAGE 03 / ALIGN</span><span class="big" data-count="380" data-suffix="K">380K</span><h4>Preference pairs</h4><p>Human and model-judged pairs. Refusal rate held under 2 percent.</p></div>
        <div class="mi-swap" data-item="main" data-index="3" style="--item: var(--c4); padding: 22px"><span class="mi-label acc">STAGE 04 / EVAL</span><span class="big" data-count="97.8" data-suffix="%">97.8%</span><h4>Gate pass rate</h4><p>62 suites. Any regression over 1 point blocks the release.</p></div>
        <div class="spark"><div class="mi-label" style="display:flex;justify-content:space-between"><span>PIPELINE THROUGHPUT</span><span class="acc">LIVE</span></div><svg viewBox="0 0 400 170" preserveAspectRatio="none" data-sparkline="32" data-waves="2"></svg></div>
        <div class="mi-swap" data-item="main" data-index="4" style="--item: var(--c5); padding: 22px"><span class="mi-label acc">STAGE 05 / DEPLOY</span><span class="big" data-count="210" data-suffix="ms">210ms</span><h4>Median latency</h4><p>Canary at 5 percent for 48 h, then full traffic in three waves.</p></div>
      </div>
      <div style="display:flex; flex-direction:column; gap:14px; min-height:0">
        <div class="mi-label">RELEASE CHECKLIST</div>
        <div class="checks">
          <div class="mi-row" data-item="main" data-index="0" style="--item: var(--c1)">license audit<em>DATA</em></div>
          <div class="mi-row" data-item="main" data-index="1" style="--item: var(--c2)">loss curve stable<em>TRAIN</em></div>
          <div class="mi-row" data-item="main" data-index="2" style="--item: var(--c3)">safety tuning<em>ALIGN</em></div>
          <div class="mi-row" data-item="main" data-index="3" style="--item: var(--c4)">no regressions<em>EVAL</em></div>
          <div class="mi-row" data-item="main" data-index="4" style="--item: var(--c5)">canary healthy<em>SHIP</em></div>
        </div>
        <div class="log">
          <div class="mi-log" data-log="0.8" data-rows="4">
            <div data-line><span class="k">[ok]</span> shard 118/512 written</div>
            <div data-line><span class="k">[ok]</span> step 84000 loss 1.84</div>
            <div data-line><span class="k">[ok]</span> dpo epoch 2 reward +0.31</div>
            <div data-line><span class="k">[ok]</span> eval mmlu 78.4</div>
            <div data-line><span class="k">[ok]</span> canary error 0.02%</div>
            <div data-line><span class="k">[ok]</span> rollout wave 3/3</div>
          </div>
        </div>
        <div class="meters">
          <div>GPU UTIL<span class="mi-bar" data-bar="0.86" data-jitter="0.06" style="--item: var(--c2)"><i></i></span><b data-ticker="86" data-jitter="3" data-suffix="%">86%</b></div>
          <div>QUEUE<span class="mi-bar" data-bar="0.42" data-jitter="0.12" style="--item: var(--c3)"><i></i></span><b data-ticker="42" data-jitter="6">42</b></div>
          <div>ERRORS<span class="mi-bar" data-bar="0.08" data-jitter="0.04" style="--item: var(--c5)"><i></i></span><b data-ticker="0.02" data-jitter="0.01" data-decimals="2" data-suffix="%">0.02%</b></div>
        </div>
      </div>
    </div>
  </section>

  <section class="mi-band">
    <div class="mi-stat" style="--item: var(--c1)"><span class="mi-stat-v">13 wk</span><span class="mi-stat-l">Data to production</span></div>
    <div class="mi-stat" style="--item: var(--c2)"><span class="mi-stat-v" data-ticker="512" data-jitter="3">512</span><span class="mi-stat-l">GPUs at peak</span></div>
    <div class="mi-stat" style="--item: var(--c4)"><span class="mi-stat-v" data-ticker="97.8" data-jitter="0.2" data-decimals="1" data-suffix="%">97.8%</span><span class="mi-stat-l">Eval gate pass rate</span></div>
  </section>

  <footer class="mi-foot"><span>SOURCE / INTERNAL RELEASE LOG</span><span class="path">DATA &gt; TRAIN &gt; ALIGN &gt; EVAL &gt; DEPLOY</span><span class="mark">studio</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Item count**: change `repeat(5, 1fr)` in `.rail`, add or remove a `.stop`, a beam, a swap and a checklist row, and keep `data-index` values continuous from 0. Keep `data-step` × items × `data-cycles` in 12–30 s.
- **Vertical timeline** (story 1080×1920, or more than 6 steps): make `.rail` a column (`grid-template-columns: 90px 1fr`, one row per step, node left, card right), move `.rail-track` to a vertical bar (`left: 44px; width: 4px; top/bottom`), and use `height: calc(var(--value) * 100%)` for its fill. Beams stay straight between nodes.
- **Landscape 1920×1080**: put the rail across the top at full width and place the detail panel and side column in a 2:1 row below; cards can drop the `p` line.
- **Square**: 4 steps; remove the meters block.
- **Pitfalls**: connector paths are measured once at load and do not follow moving elements. Animate nodes with `scale` (the centre stays put) and lift the cards, not the nodes. Keep card titles to 2 words; each column is only ~180 px wide.
