# periodic-table

A uniform grid of categorised "elements" (symbol, name, one stat), with a few featured elements explained in turn.

## Use when / Avoid when

- **Use when**: tool and resource catalogues, skill matrices, "building blocks of X", reference cards with 16–40 entries in 3–8 groups.
- **Avoid when**: fewer than 12 entries (use `bento-grid`), or entries need more than one line of text each.

## Structure

- **Table**: CSS grid, 4 rows × 8 columns with `grid-auto-flow: column`, so each group fills columns top to bottom. 32 cells; each cell has number, 2-letter symbol, name and a meta value. Cell colour comes from its group (`--item: var(--cN)`).
- **Legend** row: one swatch per group (up to 6, one per `--c1`…`--c6`).
- **Detail panel**: a swap per featured element with a large tile copy (number, symbol, name), description, three key-values, "pairs with" chips and an adoption count-up with bar.
- 6–10 featured elements (8 in the skeleton); the other cells are static.

## Motion recipe

- **Master cycle** `main`, `data-step="1.5"`, over the featured cells only (`class="cell feat" data-item="main" data-index="k"`). The spotlighted cell scales 8%, lifts above its neighbours (`z-index` from `--on`), thickens its border and casts a coloured shadow.
- **Detail swap**: the panel changes to the same element with a cross-fade; the adoption number counts up (`data-count`) and the accent turns to the element's group colour.
- **Counter**: ELEMENT NN / 08 FEATURED in the header.
- **Sound**: `pop` per element.
- **Length**: 8 × 1.5 s × 2 = 24 s.

## Skeleton

Portrait 1080×1350. Paste it over the `index.html` that `main.ts init` creates, then replace the content.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Periodic Table of the LLM Stack</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-body { display: flex; flex-direction: column; gap: 16px; }
  .table { display: grid; grid-template-rows: repeat(4, 116px); grid-auto-flow: column; grid-auto-columns: 1fr; gap: 8px; }
  .cell { position: relative; padding: 8px 10px; display: flex; flex-direction: column; border-radius: calc(var(--radius) * 0.6); border: var(--bw) solid color-mix(in oklab, var(--item) 45%, var(--line)); background: color-mix(in oklab, var(--item) 10%, var(--panel)); }
  .cell .no { font-family: var(--font-mono); font-size: 11px; color: var(--muted); }
  .cell b { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 38px; line-height: 1; margin-top: 4px; color: color-mix(in oklab, var(--item) 70%, var(--ink)); }
  .cell .nm { font-family: var(--font-mono); font-size: 12px; margin-top: auto; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cell .mt { position: absolute; top: 8px; right: 9px; font-family: var(--font-mono); font-size: 11px; color: var(--muted); }
  .cell.feat { z-index: calc(1 + var(--on) * 2); scale: calc(1 + var(--on) * 0.08); border-width: calc(var(--bw) + var(--on) * 1.5px); border-color: color-mix(in oklab, var(--item) calc(45% + var(--on) * 55%), var(--line)); background: color-mix(in oklab, var(--item) calc(10% + var(--on) * 22%), var(--panel)); box-shadow: 0 calc(var(--on) * 14px) calc(var(--on) * 30px) color-mix(in oklab, var(--item) calc(var(--on) * 45%), transparent); }
  .cell.feat::after { content: ""; position: absolute; top: 9px; right: 9px; width: 6px; height: 6px; border-radius: 50%; background: var(--item); opacity: 0; }
  .legend { display: flex; gap: 22px; flex-wrap: wrap; font-family: var(--font-mono); font-size: 13px; text-transform: var(--label-case); letter-spacing: 0.06em; }
  .legend span { display: flex; align-items: center; gap: 8px; }
  .legend i { width: 14px; height: 14px; border-radius: 4px; background: color-mix(in oklab, var(--item) 70%, var(--panel)); }
  .detail { flex: 1; }
  .detail .mi-swap { padding: 22px; display: grid; grid-template-columns: 250px 1fr; gap: 26px; }
  .detail .tile { border-radius: var(--radius); border: 3px solid var(--item); background: color-mix(in oklab, var(--item) 14%, var(--panel)); padding: 18px; display: flex; flex-direction: column; }
  .detail .tile .no { font-family: var(--font-mono); font-size: 16px; color: var(--muted); }
  .detail .tile b { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 120px; line-height: 1; color: var(--item); margin: auto 0; }
  .detail .tile .nm { font-family: var(--font-mono); font-size: 15px; text-transform: var(--label-case); letter-spacing: 0.06em; }
  .info { display: flex; flex-direction: column; gap: 8px; }
  .info p { font-size: 15px; line-height: 1.45; color: var(--muted); margin-bottom: 4px; }
  .kv { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 14px; padding: 7px 0; border-top: 1px dashed var(--line); }
  .kv span:last-child { font-weight: 600; color: var(--item); }
  .pairs { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
  .pairs .mi-label { margin-right: 6px; }
  .adopt { display: flex; justify-content: space-between; align-items: baseline; margin-top: auto; }
  .pct { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 40px; line-height: 1; color: var(--item); }
  .info .mi-bar > i { width: calc(var(--a) * 100%); }
</style>
</head>
<body data-canvas="portrait" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="0.9">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">AI ENGINEERING / REFERENCE CARD / 2026</span><span class="mi-meta">ELEMENT <span data-counter="main">01</span> / 08 FEATURED &middot; 32 TOTAL</span></div>
    <h1 class="mi-title">Periodic table of <em>the LLM stack</em></h1>
    <div class="mi-sub"><span>6 GROUPS</span><span class="sep">&gt;</span><span>32 ELEMENTS</span><span class="sep">&gt;</span><span>8 ESSENTIALS</span></div>
    <div class="mi-rule" data-progress="main"></div>
  </header>

  <section class="mi-body" data-cycle="main" data-step="1.5" data-sfx="pop" data-accent data-master>
    <div class="table">
        <div class="cell feat" data-item="main" data-index="0" data-color="var(--c1)" style="--item: var(--c1)"><span class="no">01</span><b>Fm</b><span class="nm">Foundation</span><span class="mt">70B</span></div>
        <div class="cell" style="--item: var(--c1)"><span class="no">02</span><b>Sm</b><span class="nm">Small model</span><span class="mt">3B</span></div>
        <div class="cell feat" data-item="main" data-index="1" data-color="var(--c1)" style="--item: var(--c1)"><span class="no">03</span><b>Em</b><span class="nm">Embedding</span><span class="mt">768d</span></div>
        <div class="cell" style="--item: var(--c1)"><span class="no">04</span><b>Rr</b><span class="nm">Reranker</span><span class="mt">+9 nDCG</span></div>
        <div class="cell" style="--item: var(--c1)"><span class="no">05</span><b>Vl</b><span class="nm">Vision-lang</span><span class="mt">img+txt</span></div>
        <div class="cell" style="--item: var(--c1)"><span class="no">06</span><b>Cd</b><span class="nm">Code model</span><span class="mt">HumanEval</span></div>
        <div class="cell" style="--item: var(--c2)"><span class="no">07</span><b>Ch</b><span class="nm">Chunking</span><span class="mt">512 tok</span></div>
        <div class="cell feat" data-item="main" data-index="2" data-color="var(--c2)" style="--item: var(--c2)"><span class="no">08</span><b>Vx</b><span class="nm">Vector index</span><span class="mt">HNSW</span></div>
        <div class="cell" style="--item: var(--c2)"><span class="no">09</span><b>Kg</b><span class="nm">Knowledge graph</span><span class="mt">410K</span></div>
        <div class="cell" style="--item: var(--c2)"><span class="no">10</span><b>Sy</b><span class="nm">Synthetic</span><span class="mt">2M rows</span></div>
        <div class="cell" style="--item: var(--c2)"><span class="no">11</span><b>Lb</b><span class="nm">Labels</span><span class="mt">38K</span></div>
        <div class="cell" style="--item: var(--c2)"><span class="no">12</span><b>Dd</b><span class="nm">Dedup</span><span class="mt">-38%</span></div>
        <div class="cell" style="--item: var(--c3)"><span class="no">13</span><b>Pt</b><span class="nm">Prompt</span><span class="mt">v14</span></div>
        <div class="cell feat" data-item="main" data-index="3" data-color="var(--c3)" style="--item: var(--c3)"><span class="no">14</span><b>Ag</b><span class="nm">Agent loop</span><span class="mt">ReAct</span></div>
        <div class="cell feat" data-item="main" data-index="4" data-color="var(--c3)" style="--item: var(--c3)"><span class="no">15</span><b>Tc</b><span class="nm">Tool call</span><span class="mt">JSON</span></div>
        <div class="cell" style="--item: var(--c3)"><span class="no">16</span><b>Mm</b><span class="nm">Memory</span><span class="mt">3 tiers</span></div>
        <div class="cell" style="--item: var(--c3)"><span class="no">17</span><b>Rt</b><span class="nm">Router</span><span class="mt">2 tiers</span></div>
        <div class="cell" style="--item: var(--c3)"><span class="no">18</span><b>Wf</b><span class="nm">Workflow</span><span class="mt">DAG</span></div>
        <div class="cell" style="--item: var(--c4)"><span class="no">19</span><b>Ev</b><span class="nm">Eval set</span><span class="mt">1.2K</span></div>
        <div class="cell feat" data-item="main" data-index="5" data-color="var(--c4)" style="--item: var(--c4)"><span class="no">20</span><b>Lj</b><span class="nm">LLM judge</span><span class="mt">0.81 k</span></div>
        <div class="cell" style="--item: var(--c4)"><span class="no">21</span><b>Rb</b><span class="nm">Red team</span><span class="mt">400</span></div>
        <div class="cell" style="--item: var(--c4)"><span class="no">22</span><b>Ab</b><span class="nm">A/B test</span><span class="mt">2 wk</span></div>
        <div class="cell" style="--item: var(--c4)"><span class="no">23</span><b>Tr</b><span class="nm">Tracing</span><span class="mt">OTel</span></div>
        <div class="cell" style="--item: var(--c5)"><span class="no">24</span><b>Qz</b><span class="nm">Quantize</span><span class="mt">int4</span></div>
        <div class="cell feat" data-item="main" data-index="6" data-color="var(--c5)" style="--item: var(--c5)"><span class="no">25</span><b>Kv</b><span class="nm">KV cache</span><span class="mt">-40% ms</span></div>
        <div class="cell" style="--item: var(--c5)"><span class="no">26</span><b>Bt</b><span class="nm">Batching</span><span class="mt">x6</span></div>
        <div class="cell" style="--item: var(--c5)"><span class="no">27</span><b>Sd</b><span class="nm">Speculative</span><span class="mt">x2.1</span></div>
        <div class="cell" style="--item: var(--c5)"><span class="no">28</span><b>Gw</b><span class="nm">Gateway</span><span class="mt">41K rpm</span></div>
        <div class="cell feat" data-item="main" data-index="7" data-color="var(--c6)" style="--item: var(--c6)"><span class="no">29</span><b>Gr</b><span class="nm">Guardrails</span><span class="mt">12 rules</span></div>
        <div class="cell" style="--item: var(--c6)"><span class="no">30</span><b>Pi</b><span class="nm">PII filter</span><span class="mt">99.7%</span></div>
        <div class="cell" style="--item: var(--c6)"><span class="no">31</span><b>Jb</b><span class="nm">Jailbreak</span><span class="mt">0.3%</span></div>
        <div class="cell" style="--item: var(--c6)"><span class="no">32</span><b>Au</b><span class="nm">Audit log</span><span class="mt">1 yr</span></div>
    </div>
    <div class="legend"><span style="--item: var(--c1)"><i></i>Models</span><span style="--item: var(--c2)"><i></i>Data</span><span style="--item: var(--c3)"><i></i>Orchestration</span><span style="--item: var(--c4)"><i></i>Evaluation</span><span style="--item: var(--c5)"><i></i>Serving</span><span style="--item: var(--c6)"><i></i>Safety</span></div>
    <div class="mi-card detail mi-swap-host">
        <div class="mi-swap" data-item="main" data-index="0" style="--item: var(--c1)">
          <div class="tile"><span class="no">01</span><b>Fm</b><span class="nm">Foundation model</span></div>
          <div class="info"><span class="mi-label acc">ELEMENT 01 / FOUNDATION MODEL</span><p>The general model at the core. Everything else tunes, routes or guards it.</p><div class="kv"><span>params</span><span>70B</span></div><div class="kv"><span>context</span><span>128K</span></div><div class="kv"><span>cost / 1M tok</span><span>$3.00</span></div><div class="pairs"><span class="mi-label">PAIRS WITH</span><span class="mi-chip">Em</span><span class="mi-chip">Rt</span><span class="mi-chip">Gr</span></div><div class="adopt"><span class="mi-label">TEAM ADOPTION</span><span class="pct" data-count="92" data-suffix="%">92%</span></div><span class="mi-bar" style="--a: 0.92"><i></i></span></div>
        </div>
        <div class="mi-swap" data-item="main" data-index="1" style="--item: var(--c1)">
          <div class="tile"><span class="no">03</span><b>Em</b><span class="nm">Embedding</span></div>
          <div class="info"><span class="mi-label acc">ELEMENT 03 / EMBEDDING</span><p>Turns text into vectors so search can match meaning, not words.</p><div class="kv"><span>dims</span><span>768</span></div><div class="kv"><span>latency</span><span>41 ms</span></div><div class="kv"><span>recall@10</span><span>0.94</span></div><div class="pairs"><span class="mi-label">PAIRS WITH</span><span class="mi-chip">Vx</span><span class="mi-chip">Ch</span><span class="mi-chip">Rr</span></div><div class="adopt"><span class="mi-label">TEAM ADOPTION</span><span class="pct" data-count="81" data-suffix="%">81%</span></div><span class="mi-bar" style="--a: 0.81"><i></i></span></div>
        </div>
        <div class="mi-swap" data-item="main" data-index="2" style="--item: var(--c2)">
          <div class="tile"><span class="no">08</span><b>Vx</b><span class="nm">Vector index</span></div>
          <div class="info"><span class="mi-label acc">ELEMENT 08 / VECTOR INDEX</span><p>Approximate nearest-neighbour search over millions of chunks.</p><div class="kv"><span>vectors</span><span>10M</span></div><div class="kv"><span>p95</span><span>18 ms</span></div><div class="kv"><span>index</span><span>HNSW</span></div><div class="pairs"><span class="mi-label">PAIRS WITH</span><span class="mi-chip">Em</span><span class="mi-chip">Ch</span><span class="mi-chip">Kg</span></div><div class="adopt"><span class="mi-label">TEAM ADOPTION</span><span class="pct" data-count="74" data-suffix="%">74%</span></div><span class="mi-bar" style="--a: 0.74"><i></i></span></div>
        </div>
        <div class="mi-swap" data-item="main" data-index="3" style="--item: var(--c3)">
          <div class="tile"><span class="no">14</span><b>Ag</b><span class="nm">Agent loop</span></div>
          <div class="info"><span class="mi-label acc">ELEMENT 14 / AGENT LOOP</span><p>Plan, act, observe, repeat until the goal is met or budget ends.</p><div class="kv"><span>steps / task</span><span>7.4</span></div><div class="kv"><span>success</span><span>68%</span></div><div class="kv"><span>budget</span><span>40 calls</span></div><div class="pairs"><span class="mi-label">PAIRS WITH</span><span class="mi-chip">Tc</span><span class="mi-chip">Mm</span><span class="mi-chip">Tr</span></div><div class="adopt"><span class="mi-label">TEAM ADOPTION</span><span class="pct" data-count="46" data-suffix="%">46%</span></div><span class="mi-bar" style="--a: 0.46"><i></i></span></div>
        </div>
        <div class="mi-swap" data-item="main" data-index="4" style="--item: var(--c3)">
          <div class="tile"><span class="no">15</span><b>Tc</b><span class="nm">Tool call</span></div>
          <div class="info"><span class="mi-label acc">ELEMENT 15 / TOOL CALL</span><p>Structured calls to APIs, code and search, validated by schema.</p><div class="kv"><span>tools</span><span>23</span></div><div class="kv"><span>valid JSON</span><span>99.1%</span></div><div class="kv"><span>retries</span><span>2.3%</span></div><div class="pairs"><span class="mi-label">PAIRS WITH</span><span class="mi-chip">Ag</span><span class="mi-chip">Gw</span><span class="mi-chip">Pi</span></div><div class="adopt"><span class="mi-label">TEAM ADOPTION</span><span class="pct" data-count="63" data-suffix="%">63%</span></div><span class="mi-bar" style="--a: 0.63"><i></i></span></div>
        </div>
        <div class="mi-swap" data-item="main" data-index="5" style="--item: var(--c4)">
          <div class="tile"><span class="no">20</span><b>Lj</b><span class="nm">LLM judge</span></div>
          <div class="info"><span class="mi-label acc">ELEMENT 20 / LLM JUDGE</span><p>A model grades answers against a rubric. Checked against humans.</p><div class="kv"><span>agreement</span><span>0.81</span></div><div class="kv"><span>cost / eval</span><span>$0.004</span></div><div class="kv"><span>rubrics</span><span>9</span></div><div class="pairs"><span class="mi-label">PAIRS WITH</span><span class="mi-chip">Ev</span><span class="mi-chip">Tr</span><span class="mi-chip">Rb</span></div><div class="adopt"><span class="mi-label">TEAM ADOPTION</span><span class="pct" data-count="52" data-suffix="%">52%</span></div><span class="mi-bar" style="--a: 0.52"><i></i></span></div>
        </div>
        <div class="mi-swap" data-item="main" data-index="6" style="--item: var(--c5)">
          <div class="tile"><span class="no">25</span><b>Kv</b><span class="nm">KV cache</span></div>
          <div class="info"><span class="mi-label acc">ELEMENT 25 / KV CACHE</span><p>Reuse attention keys across turns. Cuts time to first token.</p><div class="kv"><span>TTFT</span><span>-40%</span></div><div class="kv"><span>hit rate</span><span>62%</span></div><div class="kv"><span>memory</span><span>24 GB</span></div><div class="pairs"><span class="mi-label">PAIRS WITH</span><span class="mi-chip">Bt</span><span class="mi-chip">Sd</span><span class="mi-chip">Qz</span></div><div class="adopt"><span class="mi-label">TEAM ADOPTION</span><span class="pct" data-count="58" data-suffix="%">58%</span></div><span class="mi-bar" style="--a: 0.58"><i></i></span></div>
        </div>
        <div class="mi-swap" data-item="main" data-index="7" style="--item: var(--c6)">
          <div class="tile"><span class="no">29</span><b>Gr</b><span class="nm">Guardrails</span></div>
          <div class="info"><span class="mi-label acc">ELEMENT 29 / GUARDRAILS</span><p>Input and output checks that block unsafe or off-policy content.</p><div class="kv"><span>rules</span><span>12</span></div><div class="kv"><span>block rate</span><span>0.8%</span></div><div class="kv"><span>added p50</span><span>9 ms</span></div><div class="pairs"><span class="mi-label">PAIRS WITH</span><span class="mi-chip">Pi</span><span class="mi-chip">Jb</span><span class="mi-chip">Au</span></div><div class="adopt"><span class="mi-label">TEAM ADOPTION</span><span class="pct" data-count="71" data-suffix="%">71%</span></div><span class="mi-bar" style="--a: 0.71"><i></i></span></div>
        </div>
    </div>
  </section>

  <section class="mi-band">
    <div class="mi-stat" style="--item: var(--c1)"><span class="mi-stat-v">32</span><span class="mi-stat-l">Building blocks</span></div>
    <div class="mi-stat" style="--item: var(--c3)"><span class="mi-stat-v">8</span><span class="mi-stat-l">Needed for v1</span></div>
    <div class="mi-stat" style="--item: var(--c5)"><span class="mi-stat-v" data-ticker="64" data-jitter="1.5" data-suffix="%">64%</span><span class="mi-stat-l">Avg team adoption</span></div>
  </section>

  <footer class="mi-foot"><span>SOURCE / PRACTITIONER SURVEY, N=640</span><span class="path">MODELS &gt; DATA &gt; ORCHESTRATION &gt; EVAL &gt; SERVING &gt; SAFETY</span><span class="mark">studio</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Item count**: rows × columns must hold every cell; change `repeat(4, 116px)` and let `grid-auto-flow: column` add columns. 24 cells → 4 × 6; 40 cells → 5 × 8 at 96 px rows (drop the meta value). Cell numbers follow DOM order.
- **Real periodic layout with gaps**: switch to `grid-auto-flow: row` and place each cell with `grid-column` / `grid-row`; empty grid areas become the gaps between groups.
- **Featured set**: add `feat` + `data-item="main" data-index="k"` + `data-color` to a cell and add a matching swap. Keep indices continuous from 0.
- **Landscape**: 4 × 10 table across the top, detail panel below at full width. **Square**: 4 × 6 table, compact detail.
- **Pitfalls**: the spotlight `scale` of an edge cell reaches into the page padding; keep it ≤ 8%. Symbols must be 1–2 letters to fit at 38 px in a 114 px cell.
