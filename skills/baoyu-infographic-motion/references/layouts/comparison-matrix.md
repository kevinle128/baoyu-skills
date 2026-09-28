# comparison-matrix

A grid of items × criteria with a score in every cell: which option wins on what, and overall.

## Use when / Avoid when

- **Use when**: tool or supplier evaluations, feature matrices, spec sheets, rubric scores, "best for X" decisions.
- **Avoid when**: only two options (use `binary-comparison`), no numeric or check values, or more than 7 rows / 6 criteria (cells get too small; split the table).

## Structure

- **Matrix card**: CSS grid `180px repeat(5, 1fr) 104px`; header row of criteria, a name column, score cells (number + score bar), a total column. 3–7 rows, 3–6 criteria.
- **Spotlights**: one `.colhi` per criterion (`grid-row: 1 / -1`) and one `.rowhi` per row (`grid-column: 1 / -1`) in the same grid, under the cells.
- **BEST badges** on the top cell of each column.
- **Lower row**: verdict swap per criterion (winner, score, sentence, runner-up, weakest) and an overall ranking card.

## Motion recipe

- **Master cycle** `col` on `.mi-body`, `data-step="2.5"`: one criterion at a time. Its `.colhi` fills, its BEST badge turns solid (the winning cell is a member of `col` with the same index), the verdict swaps, and `data-accent` recolours every score bar.
- **Nested cycle** `row` on `.matrix`, `data-step="0.5"` × 5 rows = 2.5 s: the row spotlight hops down the table inside each criterion step, so the intersection cell lights up cell by cell. The nested period equals the master step, so the loop is clean.
- **Counters**: header shows `CRITERION NN` and `ROW NN`; the verdict score uses `data-count`.
- **Sound**: `blip` per criterion, soft `tick` per row hop.
- **Length**: 5 × 2.5 s × 2 = 25 s.

## Skeleton

Portrait 1080×1350. Paste it over the `index.html` that `main.ts init` creates, then replace the content.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Vector Databases Compared</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-body { display: flex; flex-direction: column; gap: 22px; }
  .matrix { position: relative; display: grid; grid-template-columns: 180px repeat(5, 1fr) 104px; grid-template-rows: 76px repeat(5, 100px); background: var(--panel); border: var(--bw) solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; }
  .colhi { grid-row: 1 / -1; z-index: 0; background: color-mix(in oklab, var(--item, var(--accent)) calc(var(--on) * 13%), transparent); border-inline: 2px solid color-mix(in oklab, var(--item, var(--accent)) calc(var(--on) * 70%), transparent); }
  .rowhi { grid-column: 1 / -1; z-index: 0; background: color-mix(in oklab, var(--ink) calc(var(--on) * 6%), transparent); box-shadow: inset 4px 0 0 color-mix(in oklab, var(--accent) calc(var(--on) * 100%), transparent); }
  .matrix > div { position: relative; z-index: 1; grid-row: 1; border-bottom: 1px solid var(--line); }
  .hd { display: flex; flex-direction: column; justify-content: center; gap: 4px; padding: 0 14px; }
  .hd b { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 20px; letter-spacing: 0; color: var(--ink); text-transform: var(--title-case); }
  .corner { grid-column: 1; }
  .name { grid-column: 1; display: flex; flex-direction: column; justify-content: center; gap: 3px; padding: 0 18px; }
  .name b { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 24px; }
  .name small { font-family: var(--font-mono); font-size: 12px; color: var(--muted); text-transform: var(--label-case); letter-spacing: 0.06em; }
  .cell { display: flex; flex-direction: column; justify-content: center; gap: 8px; padding: 0 16px; border-left: 1px dashed var(--line); }
  .cell span { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 34px; line-height: 1; font-variant-numeric: tabular-nums; color: color-mix(in oklab, var(--ink) calc(45% + var(--v) * 55%), transparent); }
  .pip { display: block; height: 5px; border-radius: 3px; background: linear-gradient(90deg, var(--accent) calc(var(--v) * 100%), var(--line) 0); }
  .cell.win span { color: var(--item, var(--accent)); }
  .cell.win::after { content: "BEST"; position: absolute; top: 10px; right: 10px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em; padding: 2px 6px; border-radius: 999px; color: color-mix(in oklab, var(--bg) calc(var(--on) * 100%), var(--muted)); background: color-mix(in oklab, var(--accent) calc(var(--on) * 100%), transparent); border: 1px solid color-mix(in oklab, var(--accent) calc(40% + var(--on) * 60%), var(--line)); }
  .tot { grid-column: 7; display: grid; place-items: center; font-family: var(--font-display); font-weight: var(--title-weight); font-size: 34px; border-left: 1px solid var(--line); background: var(--panel2); }
  .matrix > div:nth-last-child(-n+7) { border-bottom: 0; }
  .lower { flex: 1; display: grid; grid-template-columns: 1.15fr 1fr; gap: 22px; }
  .lower .mi-swap-host { min-height: 250px; }
  .lower .mi-swap { padding: 20px 22px; display: flex; flex-direction: column; gap: 8px; }
  .lower h4 { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 34px; line-height: 1; text-transform: var(--title-case); color: var(--item); }
  .lower p { font-size: 14px; line-height: 1.45; color: var(--muted); }
  .verdict { display: flex; align-items: baseline; gap: 12px; font-family: var(--font-mono); font-size: 15px; }
  .verdict b { font-family: var(--font-display); font-size: 46px; line-height: 1; color: var(--ink); }
  .kv { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 14px; padding: 6px 0; border-top: 1px dashed var(--line); }
  .kv span:last-child { font-weight: 600; color: var(--item); }
  .rank { display: flex; flex-direction: column; gap: 12px; }
  .rank .r { display: grid; grid-template-columns: 96px 1fr 34px; gap: 12px; align-items: center; font-family: var(--font-mono); font-size: 14px; }
  .rank .r b { text-align: right; }
  .rank .mi-bar { height: 8px; }
</style>
</head>
<body data-canvas="portrait" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="0.9">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">INFRA REVIEW / RETRIEVAL STACK / 2026</span><span class="mi-meta">CRITERION <span data-counter="col">01</span> / 05 &middot; ROW <span data-counter="row">01</span></span></div>
    <h1 class="mi-title">Vector databases <em>compared</em></h1>
    <div class="mi-sub"><span>5 ENGINES</span><span class="sep">&gt;</span><span>5 CRITERIA</span><span class="sep">&gt;</span><span>SCORED 0&ndash;10</span></div>
    <div class="mi-rule" data-progress="col"></div>
  </header>

  <section class="mi-body" data-cycle="col" data-step="2.5" data-sfx="blip" data-accent data-master>
    <div class="matrix" data-cycle="row" data-step="0.5" data-sfx="tick">
      <i class="colhi" data-item="col" data-index="0" style="grid-column: 2"></i>
      <i class="colhi" data-item="col" data-index="1" style="grid-column: 3"></i>
      <i class="colhi" data-item="col" data-index="2" style="grid-column: 4"></i>
      <i class="colhi" data-item="col" data-index="3" style="grid-column: 5"></i>
      <i class="colhi" data-item="col" data-index="4" style="grid-column: 6"></i>
      <i class="rowhi" data-item="row" data-index="0" style="grid-row: 2"></i>
      <i class="rowhi" data-item="row" data-index="1" style="grid-row: 3"></i>
      <i class="rowhi" data-item="row" data-index="2" style="grid-row: 4"></i>
      <i class="rowhi" data-item="row" data-index="3" style="grid-row: 5"></i>
      <i class="rowhi" data-item="row" data-index="4" style="grid-row: 6"></i>
      <div class="hd corner mi-label">TOOL / CRITERION</div>
      <div class="hd mi-label" style="grid-column: 2">C1<b>Latency</b></div>
      <div class="hd mi-label" style="grid-column: 3">C2<b>Recall</b></div>
      <div class="hd mi-label" style="grid-column: 4">C3<b>Cost</b></div>
      <div class="hd mi-label" style="grid-column: 5">C4<b>Scale</b></div>
      <div class="hd mi-label" style="grid-column: 6">C5<b>Ops</b></div>
      <div class="hd mi-label" style="grid-column: 7">TOTAL<b>/50</b></div>
      <div class="name" style="grid-row: 2"><b>pgvector</b><small>postgres ext</small></div>
      <div class="cell" style="grid-row: 2; grid-column: 2; --v: 0.6"><span>6</span><i class="pip"></i></div>
      <div class="cell" style="grid-row: 2; grid-column: 3; --v: 0.8"><span>8</span><i class="pip"></i></div>
      <div class="cell win" data-item="col" data-index="2" style="grid-row: 2; grid-column: 4; --v: 0.9"><span>9</span><i class="pip"></i></div>
      <div class="cell" style="grid-row: 2; grid-column: 5; --v: 0.5"><span>5</span><i class="pip"></i></div>
      <div class="cell" style="grid-row: 2; grid-column: 6; --v: 0.9"><span>9</span><i class="pip"></i></div>
      <div class="tot" style="grid-row: 2">37</div>
      <div class="name" style="grid-row: 3"><b>Pinecone</b><small>managed</small></div>
      <div class="cell win" data-item="col" data-index="0" style="grid-row: 3; grid-column: 2; --v: 0.9"><span>9</span><i class="pip"></i></div>
      <div class="cell" style="grid-row: 3; grid-column: 3; --v: 0.8"><span>8</span><i class="pip"></i></div>
      <div class="cell" style="grid-row: 3; grid-column: 4; --v: 0.5"><span>5</span><i class="pip"></i></div>
      <div class="cell" style="grid-row: 3; grid-column: 5; --v: 0.9"><span>9</span><i class="pip"></i></div>
      <div class="cell win" data-item="col" data-index="4" style="grid-row: 3; grid-column: 6; --v: 1.0"><span>10</span><i class="pip"></i></div>
      <div class="tot" style="grid-row: 3">41</div>
      <div class="name" style="grid-row: 4"><b>Weaviate</b><small>hybrid</small></div>
      <div class="cell" style="grid-row: 4; grid-column: 2; --v: 0.7"><span>7</span><i class="pip"></i></div>
      <div class="cell win" data-item="col" data-index="1" style="grid-row: 4; grid-column: 3; --v: 0.9"><span>9</span><i class="pip"></i></div>
      <div class="cell" style="grid-row: 4; grid-column: 4; --v: 0.7"><span>7</span><i class="pip"></i></div>
      <div class="cell" style="grid-row: 4; grid-column: 5; --v: 0.8"><span>8</span><i class="pip"></i></div>
      <div class="cell" style="grid-row: 4; grid-column: 6; --v: 0.7"><span>7</span><i class="pip"></i></div>
      <div class="tot" style="grid-row: 4">38</div>
      <div class="name" style="grid-row: 5"><b>Qdrant</b><small>rust</small></div>
      <div class="cell" style="grid-row: 5; grid-column: 2; --v: 0.9"><span>9</span><i class="pip"></i></div>
      <div class="cell" style="grid-row: 5; grid-column: 3; --v: 0.9"><span>9</span><i class="pip"></i></div>
      <div class="cell" style="grid-row: 5; grid-column: 4; --v: 0.8"><span>8</span><i class="pip"></i></div>
      <div class="cell" style="grid-row: 5; grid-column: 5; --v: 0.8"><span>8</span><i class="pip"></i></div>
      <div class="cell" style="grid-row: 5; grid-column: 6; --v: 0.8"><span>8</span><i class="pip"></i></div>
      <div class="tot" style="grid-row: 5">42</div>
      <div class="name" style="grid-row: 6"><b>Milvus</b><small>distributed</small></div>
      <div class="cell" style="grid-row: 6; grid-column: 2; --v: 0.8"><span>8</span><i class="pip"></i></div>
      <div class="cell" style="grid-row: 6; grid-column: 3; --v: 0.8"><span>8</span><i class="pip"></i></div>
      <div class="cell" style="grid-row: 6; grid-column: 4; --v: 0.7"><span>7</span><i class="pip"></i></div>
      <div class="cell win" data-item="col" data-index="3" style="grid-row: 6; grid-column: 5; --v: 1.0"><span>10</span><i class="pip"></i></div>
      <div class="cell" style="grid-row: 6; grid-column: 6; --v: 0.5"><span>5</span><i class="pip"></i></div>
      <div class="tot" style="grid-row: 6">38</div>
    </div>

    <div class="lower">
      <div class="mi-card mi-swap-host">
        <div class="mi-swap" data-item="col" data-index="0" data-color="var(--c1)" style="--item: var(--c1)"><span class="mi-label acc">C1 / LATENCY / P95 AT 10M VECTORS</span><h4>Pinecone</h4><div class="verdict"><b data-count="9">9</b>/ 10 &middot; 18 ms p95</div><p>Serverless pods keep hot shards in memory. Qdrant ties on self-hosted hardware.</p><div class="kv"><span>runner-up</span><span>Qdrant 9 / 21 ms</span></div><div class="kv"><span>weakest</span><span>pgvector 6</span></div></div>
        <div class="mi-swap" data-item="col" data-index="1" data-color="var(--c2)" style="--item: var(--c2)"><span class="mi-label acc">C2 / RECALL@10 / HNSW DEFAULTS</span><h4>Weaviate</h4><div class="verdict"><b data-count="9">9</b>/ 10 &middot; 0.97 recall</div><p>Hybrid BM25 + vector search lifts recall on keyword-heavy queries.</p><div class="kv"><span>runner-up</span><span>Qdrant 9 / 0.96</span></div><div class="kv"><span>weakest</span><span>pgvector 8</span></div></div>
        <div class="mi-swap" data-item="col" data-index="2" data-color="var(--c3)" style="--item: var(--c3)"><span class="mi-label acc">C3 / COST / MONTHLY AT 10M</span><h4>pgvector</h4><div class="verdict"><b data-count="9">9</b>/ 10 &middot; $120 / mo</div><p>Runs inside the Postgres you already pay for. No new vendor, no new backup.</p><div class="kv"><span>runner-up</span><span>Qdrant 8 / $310</span></div><div class="kv"><span>weakest</span><span>Pinecone 5</span></div></div>
        <div class="mi-swap" data-item="col" data-index="3" data-color="var(--c4)" style="--item: var(--c4)"><span class="mi-label acc">C4 / SCALE / BILLION-VECTOR TIER</span><h4>Milvus</h4><div class="verdict"><b data-count="10">10</b>/ 10 &middot; 1B+ vectors</div><p>Separate query, data and index nodes scale out on their own.</p><div class="kv"><span>runner-up</span><span>Pinecone 9 / 500M</span></div><div class="kv"><span>weakest</span><span>pgvector 5</span></div></div>
        <div class="mi-swap" data-item="col" data-index="4" data-color="var(--c5)" style="--item: var(--c5)"><span class="mi-label acc">C5 / OPS / TIME TO PRODUCTION</span><h4>Pinecone</h4><div class="verdict"><b data-count="10">10</b>/ 10 &middot; zero ops</div><p>Fully managed. No index tuning, no capacity planning, no on-call.</p><div class="kv"><span>runner-up</span><span>Qdrant 8 / helm chart</span></div><div class="kv"><span>weakest</span><span>Milvus 5</span></div></div>
      </div>
      <div class="mi-card rank">
        <span class="mi-label">OVERALL / 50</span>
        <div class="r">Qdrant<span class="mi-bar" data-bar="0.84"><i></i></span><b>42</b></div>
        <div class="r">Pinecone<span class="mi-bar" data-bar="0.82"><i></i></span><b>41</b></div>
        <div class="r">Weaviate<span class="mi-bar" data-bar="0.76"><i></i></span><b>38</b></div>
        <div class="r">Milvus<span class="mi-bar" data-bar="0.76"><i></i></span><b>38</b></div>
        <div class="r">pgvector<span class="mi-bar" data-bar="0.74"><i></i></span><b>37</b></div>
        <span class="mi-label" style="margin-top:auto">WEIGHTS EQUAL / BENCH 2026-08</span>
      </div>
    </div>
  </section>

  <section class="mi-band">
    <div class="mi-stat" style="--item: var(--c2)"><span class="mi-stat-v">Qdrant</span><span class="mi-stat-l">Best all-rounder, 42 / 50</span></div>
    <div class="mi-stat" style="--item: var(--c1)"><span class="mi-stat-v" data-ticker="18" data-jitter="1.2" data-suffix=" ms">18 ms</span><span class="mi-stat-l">Fastest p95 query</span></div>
    <div class="mi-stat" style="--item: var(--c3)"><span class="mi-stat-v">$120</span><span class="mi-stat-l">Cheapest / month at 10M</span></div>
  </section>

  <footer class="mi-foot"><span>SOURCE / TEAM BENCHMARK, 10M x 768D</span><span class="path">LATENCY &gt; RECALL &gt; COST &gt; SCALE &gt; OPS</span><span class="mark">studio</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Item count**: change `grid-template-columns` / `grid-template-rows` and the inline `grid-row` / `grid-column` of each cell. The row cycle step must be master step ÷ rows (4 rows → `0.625`). Move the BEST badge (`class="cell win" data-item="col" data-index="k"`) to each column's winner.
- **Checkmarks instead of scores**: put ✓ / ✕ / – in the `span` and set `--v` to 1 / 0 / 0.5 so the bar and text weight still encode value.
- **Landscape**: up to 8 criteria fit; move the verdict and ranking into a right column.
- **Square**: 4 × 4 matrix, drop the ranking card.
- **Pitfalls**: every overlay and cell must sit in the same grid; the overlays are the first children so cells paint above them. Keep criterion names to one word. The last-row border rule (`nth-last-child(-n+7)`) counts name + criteria + total cells; update 7 when the column count changes.
