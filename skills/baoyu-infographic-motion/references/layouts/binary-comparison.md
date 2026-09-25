# binary-comparison

Two options side by side, compared on the same 4–6 dimensions, with a winner per row and a running score.

## Use when / Avoid when

- **Use when**: A vs B, before / after, old vs new, pros / cons, build vs buy.
- **Avoid when**: three or more options (use `comparison-matrix`), or the two sides are not compared on the same dimensions.

## Structure

- **Heads**: option A card (left, `--ca`), pulsing VS hub, option B card (right, `--cb`), each with a short claim and two numbers.
- **Rows**: 4–6 rows of `[A cell | dimension pill | B cell]`. The row has class `wa` or `wb` for the winner.
- **Tally**: one segment per row in the winner's colour, with the final score at both ends.
- **Verdict**: swap panel with a flashing "A WINS" / "B WINS" badge, a one-line verdict and the reason.

## Motion recipe

- **Master cycle** `main`, `data-step="1.8"`, one row per step. Rows are items; the winning cell reads the inherited `--on` through `.wa .cell.a` / `.wb .cell.b`, so only the winner glows and an arrow ◀ / ▶ appears on its side of the pill.
- **Alternating highlight**: order rows so winners alternate A, B, A, B … — the glow and the page accent (`data-color` per row) swing left and right.
- **Swapping verdict**: one `.mi-swap` per row plus a `data-flash` badge that blinks on arrival.
- **Running score**: tally segments are items with the row index; `max(--on, --done)` fills them one by one and they reset when the cycle wraps.
- **Ambient**: VS hub `data-pulse`, `data-ticker` band stat.
- **Sound**: `blip` per row. Add `data-sfx="success"` on the badge of the deciding row.
- **Length**: 5 × 1.8 s × 3 = 27 s.

## Skeleton

Portrait 1080×1350. Paste it over the `index.html` that `main.ts init` creates, then replace the content.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>RAG vs Fine-Tuning</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-body { display: flex; flex-direction: column; gap: 18px; --ca: var(--c1); --cb: var(--c3); }
  .heads { display: grid; grid-template-columns: 1fr 96px 1fr; align-items: center; gap: 14px; }
  .side { display: flex; flex-direction: column; gap: 8px; padding: 20px 22px; border-top: 6px solid var(--item); }
  .side.b { text-align: right; }
  .side h3 { color: var(--item); font-size: 40px; }
  .side p { font-size: 14px; color: var(--muted); line-height: 1.4; }
  .side .nums { display: flex; gap: 18px; margin-top: 6px; }
  .side.b .nums { justify-content: flex-end; }
  .side .nums div { display: flex; flex-direction: column; gap: 2px; }
  .side .nums b { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 28px; line-height: 1; color: var(--ink); }
  .vs { width: 96px; height: 96px; font-family: var(--font-display); font-weight: var(--title-weight); font-size: 34px; color: var(--accent); }
  .rows { display: flex; flex-direction: column; gap: 10px; }
  .row { display: grid; grid-template-columns: 1fr 176px 1fr; gap: 14px; height: 88px; opacity: calc(0.62 + 0.38 * max(var(--on), var(--done))); }
  .cell { display: flex; flex-direction: column; justify-content: center; gap: 4px; padding: 0 18px; border-radius: calc(var(--radius) * 0.7); border: var(--bw) solid var(--line); background: var(--panel); font-family: var(--font-mono); font-size: 15px; }
  .cell small { font-size: 12px; color: var(--muted); letter-spacing: 0.06em; text-transform: var(--label-case); }
  .cell.b { text-align: right; }
  .wa .cell.a, .wb .cell.b { --w: var(--on); }
  .wa .cell.a { border-color: color-mix(in oklab, var(--ca) calc(30% + var(--w) * 70%), var(--line)); background: color-mix(in oklab, var(--ca) calc(var(--w) * 16%), var(--panel)); box-shadow: 0 0 calc(var(--w) * 26px * var(--glow)) color-mix(in oklab, var(--ca) 45%, transparent); }
  .wb .cell.b { border-color: color-mix(in oklab, var(--cb) calc(30% + var(--w) * 70%), var(--line)); background: color-mix(in oklab, var(--cb) calc(var(--w) * 16%), var(--panel)); box-shadow: 0 0 calc(var(--w) * 26px * var(--glow)) color-mix(in oklab, var(--cb) 45%, transparent); }
  .dim { display: grid; place-items: center; text-align: center; font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.08em; text-transform: var(--label-case); border-radius: 999px; border: var(--bw) dashed var(--line); color: var(--ink); position: relative; }
  .dim::before, .dim::after { position: absolute; top: 50%; translate: 0 -50%; font-size: 22px; opacity: var(--on); color: var(--accent); }
  .wa .dim::before { content: "\25C0"; left: -9px; }
  .wb .dim::after { content: "\25B6"; right: -9px; }
  .tally { display: grid; grid-template-columns: 120px 1fr 120px; align-items: center; gap: 14px; }
  .tally .n { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 40px; line-height: 1; }
  .segs { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; height: 16px; }
  .segs i { border-radius: 4px; background: color-mix(in oklab, var(--item) calc(25% + max(var(--on), var(--done)) * 75%), var(--line)); }
  .verdict { flex: 1; }
  .verdict .mi-swap { padding: 20px 24px; display: grid; grid-template-columns: auto 1fr; gap: 6px 22px; align-content: center; }
  .verdict .mi-badge { grid-row: 1 / 3; align-self: center; font-size: 16px; padding: 10px 16px; }
  .verdict b { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 28px; text-transform: var(--title-case); color: var(--item); }
  .verdict p { font-size: 14px; color: var(--muted); line-height: 1.45; }
</style>
</head>
<body data-canvas="portrait" data-cycles="3" data-sfx="soft" data-fps="30" data-poster="0.9">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">LLM ENGINEERING / DECISION NOTES / 07</span><span class="mi-meta">ROUND <span data-counter="main">01</span> / 05</span></div>
    <h1 class="mi-title">RAG <em>vs</em> fine-tuning</h1>
    <div class="mi-sub"><span>FRESHNESS</span><span class="sep">&gt;</span><span>STYLE</span><span class="sep">&gt;</span><span>COST</span><span class="sep">&gt;</span><span>LATENCY</span><span class="sep">&gt;</span><span>TRUST</span></div>
    <div class="mi-rule" data-progress="main"></div>
  </header>

  <section class="mi-body" data-cycle="main" data-step="1.8" data-sfx="blip" data-accent data-master>
    <div class="heads">
      <div class="mi-card side a" style="--item: var(--ca)"><span class="mi-label">OPTION A / RETRIEVAL</span><h3>RAG</h3><p>Look facts up at query time from an index you control.</p><div class="nums"><div><b>minutes</b><span class="mi-label">to update</span></div><div><b>$0</b><span class="mi-label">training</span></div></div></div>
      <div class="mi-hub vs" data-pulse="1.8">VS</div>
      <div class="mi-card side b" style="--item: var(--cb)"><span class="mi-label">OPTION B / WEIGHTS</span><h3>Fine-tune</h3><p>Teach behaviour and format into the model itself.</p><div class="nums"><div><b>days</b><span class="mi-label">to update</span></div><div><b>$2.4K</b><span class="mi-label">per run</span></div></div></div>
    </div>

    <div class="rows">
      <div class="row wa" data-item="main" data-index="0" data-color="var(--c1)"><div class="cell a"><small>index refresh</small>New docs live in 5 min</div><div class="dim">Freshness</div><div class="cell b"><small>retrain cycle</small>Stale until next run</div></div>
      <div class="row wb" data-item="main" data-index="1" data-color="var(--c3)"><div class="cell a"><small>prompt only</small>Tone drifts on long answers</div><div class="dim">Style + format</div><div class="cell b"><small>learned</small>House style every time</div></div>
      <div class="row wa" data-item="main" data-index="2" data-color="var(--c1)"><div class="cell a"><small>setup</small>$0 train, $40/mo index</div><div class="dim">Upfront cost</div><div class="cell b"><small>setup</small>$2.4K per training run</div></div>
      <div class="row wb" data-item="main" data-index="3" data-color="var(--c3)"><div class="cell a"><small>p50 latency</small>+180 ms retrieval hop</div><div class="dim">Latency</div><div class="cell b"><small>p50 latency</small>No extra hop, shorter prompt</div></div>
      <div class="row wa" data-item="main" data-index="4" data-color="var(--c1)"><div class="cell a"><small>citations</small>Every claim links a source</div><div class="dim">Trust + audit</div><div class="cell b"><small>citations</small>Answers from memory only</div></div>
    </div>

    <div class="tally">
      <div class="n" style="color: var(--ca)">A &middot; 3</div>
      <div class="segs">
        <i data-item="main" data-index="0" style="--item: var(--ca)"></i><i data-item="main" data-index="1" style="--item: var(--cb)"></i><i data-item="main" data-index="2" style="--item: var(--ca)"></i><i data-item="main" data-index="3" style="--item: var(--cb)"></i><i data-item="main" data-index="4" style="--item: var(--ca)"></i>
      </div>
      <div class="n" style="color: var(--cb); text-align: right">2 &middot; B</div>
    </div>

    <div class="mi-card verdict mi-swap-host">
      <div class="mi-swap" data-item="main" data-index="0" style="--item: var(--ca)"><span class="mi-badge" data-item="main" data-index="0" data-flash="3" style="--item: var(--ca)">A WINS</span><b>Freshness goes to RAG</b><p>Prices, policies and docs change daily. Re-indexing beats retraining.</p></div>
      <div class="mi-swap" data-item="main" data-index="1" style="--item: var(--cb)"><span class="mi-badge" data-item="main" data-index="1" data-flash="3" style="--item: var(--cb)">B WINS</span><b>Style goes to fine-tuning</b><p>500 good examples fix voice and JSON format better than any prompt.</p></div>
      <div class="mi-swap" data-item="main" data-index="2" style="--item: var(--ca)"><span class="mi-badge" data-item="main" data-index="2" data-flash="3" style="--item: var(--ca)">A WINS</span><b>Cost goes to RAG</b><p>Start in a day with an embedding model and a vector store.</p></div>
      <div class="mi-swap" data-item="main" data-index="3" style="--item: var(--cb)"><span class="mi-badge" data-item="main" data-index="3" data-flash="3" style="--item: var(--cb)">B WINS</span><b>Latency goes to fine-tuning</b><p>No retrieval round trip and a 60 percent shorter prompt.</p></div>
      <div class="mi-swap" data-item="main" data-index="4" style="--item: var(--ca)"><span class="mi-badge" data-item="main" data-index="4" data-flash="3" style="--item: var(--ca)">A WINS</span><b>Trust goes to RAG</b><p>Citations let reviewers check every answer. Use both: RAG for facts, tuning for voice.</p></div>
    </div>
  </section>

  <section class="mi-band">
    <div class="mi-stat" style="--item: var(--c1)"><span class="mi-stat-v">3 &ndash; 2</span><span class="mi-stat-l">RAG wins on points</span></div>
    <div class="mi-stat" style="--item: var(--c3)"><span class="mi-stat-v" data-ticker="180" data-jitter="8" data-suffix=" ms">180 ms</span><span class="mi-stat-l">Retrieval hop cost</span></div>
    <div class="mi-stat" style="--item: var(--c2)"><span class="mi-stat-v">Both</span><span class="mi-stat-l">Best production answer</span></div>
  </section>

  <footer class="mi-foot"><span>SOURCE / TEAM EVALS, 3 PRODUCTS</span><span class="path">FACTS &gt; RAG / VOICE &gt; FINE-TUNE</span><span class="mark">studio</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Item count**: add or remove `.row`, tally `<i>` and verdict swaps with matching `data-index`; change `repeat(5, 1fr)` in `.segs` and the tally numbers.
- **Before / after**: rename the heads BEFORE / AFTER, set every row to `wb`, and read the tally as a progress meter.
- **Pro / con**: fill only one cell per row (leave the other empty with a dashed border) and use `--c2` / `--c5` for `--ca` / `--cb`.
- **Landscape**: heads become left and right columns running full height; rows sit between them.
- **Pitfalls**: side colours come from `--ca` / `--cb` on `.mi-body`; change them there, not per element. Keep cell text ≤ 30 characters so both sides stay on one line. Queued rows rest at 62% opacity so frame 0 stays readable; do not go lower.
