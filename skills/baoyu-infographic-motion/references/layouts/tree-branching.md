# tree-branching

One root that splits into branches and then leaves: a taxonomy, classification or org structure.

## Use when / Avoid when

- **Use when**: taxonomies, "types of X", decision or category trees, folder or org structures, feature breakdowns.
- **Avoid when**: nodes connect across branches (use a hub or network layout), or depth is more than 3 levels (split into several pages).

## Structure

- **Root card** (top centre).
- **Branch columns**: 2–4 columns, each with a branch card and 2–4 leaf cards stacked under it. A small `.spine` dot at the bottom-left of each branch card is the anchor for its leaves.
- **Connectors**: org-chart elbows root → branch (`#root@bottom #bK@top`, `data-shape="elbow"`), and elbows spine → leaf (`#sK@bottom #lKJ@left`).
- **Lower row**: swap panel per branch and a small legend card.

## Motion recipe

- **Two aligned clocks.** Master cycle `br` on `.mi-body`, `data-step="3"` (3 branches → 9 s). Nested cycle `lf` on `.tree`, `data-step="1"` over all 9 leaves (9 s). Leaves 0–2 fall inside branch 0's step, 3–5 inside branch 1, and so on.
- **Beams root → leaves**: branch beams are items of `br` (`data-draw="0.8"`), leaf beams are items of `lf` (`data-draw="0.5"`). Each step draws the branch elbow first, then the three leaf elbows one per second, so a signal visibly travels from root to every leaf.
- **Highlights**: branch card tint and title colour follow `--on`; leaves glow while active and stay bright with `--done` until the leaf cycle wraps.
- **Counters**: BRANCH NN / 03 and LEAF NN / 09 in the header.
- **Sound**: `thump` per branch, `blip` per leaf, `packet` when the branch beam lands.
- **Length**: 9 s × `data-cycles="3"` = 27 s. Poster at 0.5 s (branch beam half drawn).

## Skeleton

Portrait 1080×1350. Paste it over the `index.html` that `main.ts init` creates, then replace the content.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Agent Memory Taxonomy</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-body { display: flex; flex-direction: column; gap: 22px; }
  .tree { position: relative; display: flex; flex-direction: column; align-items: center; gap: 58px; }
  .root { width: 380px; padding: 16px 22px; text-align: center; display: flex; flex-direction: column; gap: 4px; background: color-mix(in oklab, var(--accent) 8%, var(--panel)); border-color: var(--accent); }
  .root b { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 32px; line-height: 1; text-transform: var(--title-case); }
  .cols { align-self: stretch; display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
  .col { display: flex; flex-direction: column; gap: 14px; }
  .branch { padding: 14px 18px 16px; display: flex; flex-direction: column; gap: 4px; margin-bottom: 14px; background: color-mix(in oklab, var(--item) calc(var(--on) * 12%), var(--panel)); }
  .branch .mi-label { display: flex; justify-content: space-between; }
  .branch b { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 28px; line-height: 1.05; text-transform: var(--title-case); color: color-mix(in oklab, var(--item) calc(35% + var(--on) * 65%), var(--ink)); }
  .branch small { font-family: var(--font-mono); font-size: 13px; color: var(--muted); }
  .spine { position: absolute; left: 20px; bottom: -7px; width: 14px; height: 14px; border-radius: 50%; background: var(--panel); border: 3px solid var(--item); }
  .leaf { margin-left: 56px; height: 96px; padding: 0 16px; display: flex; align-items: center; justify-content: space-between; gap: 10px; border-radius: calc(var(--radius) * 0.7); border: var(--bw) solid color-mix(in oklab, var(--item) calc(var(--on) * 100%), var(--line)); background: color-mix(in oklab, var(--item) calc(var(--on) * 14%), var(--panel2)); opacity: calc(0.55 + 0.45 * max(var(--on), var(--done))); }
  .leaf span { display: flex; flex-direction: column; gap: 3px; }
  .leaf b { font-family: var(--font-mono); font-weight: 600; font-size: 15px; }
  .leaf small { font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
  .leaf em { font-style: normal; font-family: var(--font-display); font-weight: var(--title-weight); font-size: 20px; color: var(--item); white-space: nowrap; }
  .lower { flex: 1; display: grid; grid-template-columns: 1.6fr 1fr; gap: 22px; }
  .lower .mi-swap { padding: 20px 22px; display: flex; flex-direction: column; gap: 8px; }
  .lower h4 { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 30px; text-transform: var(--title-case); color: var(--item); }
  .lower p { font-size: 14px; color: var(--muted); line-height: 1.45; }
  .lower .kv { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 14px; padding-top: 8px; border-top: 1px dashed var(--line); margin-top: auto; }
  .lower .kv b { color: var(--item); }
  .legend { padding: 20px 22px; display: flex; flex-direction: column; gap: 10px; }
  .legend div { display: flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 14px; }
  .legend i { width: 14px; height: 14px; border-radius: 4px; background: var(--item); }
  .legend div span { margin-left: auto; color: var(--muted); }
</style>
</head>
<body data-canvas="portrait" data-cycles="3" data-sfx="soft" data-fps="30" data-poster="0.5">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">AGENT SYSTEMS / MEMORY / FIELD GUIDE</span><span class="mi-meta">BRANCH <span data-counter="br">01</span> / 03 &middot; LEAF <span data-counter="lf">01</span> / 09</span></div>
    <h1 class="mi-title">Three kinds of <em>agent memory</em></h1>
    <div class="mi-sub"><span>WORKING</span><span class="sep">&gt;</span><span>EPISODIC</span><span class="sep">&gt;</span><span>SEMANTIC</span></div>
    <div class="mi-rule" data-progress="br"></div>
  </header>

  <section class="mi-body" data-cycle="br" data-step="3" data-sfx="thump" data-accent data-master>
    <div class="tree" data-cycle="lf" data-step="1" data-sfx="blip">
      <svg class="mi-svg">
        <path class="mi-edge" data-link="#root@bottom #b0@top" data-shape="elbow"></path>
        <path class="mi-edge" data-link="#root@bottom #b1@top" data-shape="elbow"></path>
        <path class="mi-edge" data-link="#root@bottom #b2@top" data-shape="elbow"></path>
        <path class="mi-edge" data-link="#s0@bottom #l00@left" data-shape="elbow"></path>
        <path class="mi-edge" data-link="#s0@bottom #l01@left" data-shape="elbow"></path>
        <path class="mi-edge" data-link="#s0@bottom #l02@left" data-shape="elbow"></path>
        <path class="mi-edge" data-link="#s1@bottom #l10@left" data-shape="elbow"></path>
        <path class="mi-edge" data-link="#s1@bottom #l11@left" data-shape="elbow"></path>
        <path class="mi-edge" data-link="#s1@bottom #l12@left" data-shape="elbow"></path>
        <path class="mi-edge" data-link="#s2@bottom #l20@left" data-shape="elbow"></path>
        <path class="mi-edge" data-link="#s2@bottom #l21@left" data-shape="elbow"></path>
        <path class="mi-edge" data-link="#s2@bottom #l22@left" data-shape="elbow"></path>
        <path class="mi-beam" data-link="#root@bottom #b0@top" data-shape="elbow" data-beam data-item="br" data-index="0" data-draw="0.8" style="--item: var(--c1)" data-sfx-end="packet"></path>
        <path class="mi-beam" data-link="#root@bottom #b1@top" data-shape="elbow" data-beam data-item="br" data-index="1" data-draw="0.8" style="--item: var(--c2)" data-sfx-end="packet"></path>
        <path class="mi-beam" data-link="#root@bottom #b2@top" data-shape="elbow" data-beam data-item="br" data-index="2" data-draw="0.8" style="--item: var(--c3)" data-sfx-end="packet"></path>
        <path class="mi-beam" data-link="#s0@bottom #l00@left" data-shape="elbow" data-beam data-item="lf" data-index="0" data-draw="0.5" style="--item: var(--c1)"></path>
        <path class="mi-beam" data-link="#s0@bottom #l01@left" data-shape="elbow" data-beam data-item="lf" data-index="1" data-draw="0.5" style="--item: var(--c1)"></path>
        <path class="mi-beam" data-link="#s0@bottom #l02@left" data-shape="elbow" data-beam data-item="lf" data-index="2" data-draw="0.5" style="--item: var(--c1)"></path>
        <path class="mi-beam" data-link="#s1@bottom #l10@left" data-shape="elbow" data-beam data-item="lf" data-index="3" data-draw="0.5" style="--item: var(--c2)"></path>
        <path class="mi-beam" data-link="#s1@bottom #l11@left" data-shape="elbow" data-beam data-item="lf" data-index="4" data-draw="0.5" style="--item: var(--c2)"></path>
        <path class="mi-beam" data-link="#s1@bottom #l12@left" data-shape="elbow" data-beam data-item="lf" data-index="5" data-draw="0.5" style="--item: var(--c2)"></path>
        <path class="mi-beam" data-link="#s2@bottom #l20@left" data-shape="elbow" data-beam data-item="lf" data-index="6" data-draw="0.5" style="--item: var(--c3)"></path>
        <path class="mi-beam" data-link="#s2@bottom #l21@left" data-shape="elbow" data-beam data-item="lf" data-index="7" data-draw="0.5" style="--item: var(--c3)"></path>
        <path class="mi-beam" data-link="#s2@bottom #l22@left" data-shape="elbow" data-beam data-item="lf" data-index="8" data-draw="0.5" style="--item: var(--c3)"></path>
      </svg>
      <div id="root" class="mi-card root"><span class="mi-label acc">ROOT / AGENT MEMORY</span><b>What the agent keeps</b><span class="mi-label">3 BRANCHES / 9 STORES</span></div>
      <div class="cols">
      <div class="col" style="--item: var(--c1)">
        <div id="b0" class="mi-card branch" data-item="br" data-index="0" data-color="var(--c1)"><span class="mi-label"><span>B1</span><span>32K avg tokens</span></span><b>Working</b><small>in-context, per step</small><i id="s0" class="spine"></i></div>
        <div id="l00" class="leaf" data-item="lf" data-index="0"><span><b>Context window</b><small>128K token budget</small></span><em>64%</em></div>
        <div id="l01" class="leaf" data-item="lf" data-index="1"><span><b>Scratchpad</b><small>plans and notes</small></span><em>2.1K tok</em></div>
        <div id="l02" class="leaf" data-item="lf" data-index="2"><span><b>Tool results</b><small>last 20 calls</small></span><em>18 KB</em></div>
      </div>
      <div class="col" style="--item: var(--c2)">
        <div id="b1" class="mi-card branch" data-item="br" data-index="1" data-color="var(--c2)"><span class="mi-label"><span>B2</span><span>14K runs logged</span></span><b>Episodic</b><small>what happened</small><i id="s1" class="spine"></i></div>
        <div id="l10" class="leaf" data-item="lf" data-index="3"><span><b>Trace log</b><small>raw, append-only</small></span><em>14K runs</em></div>
        <div id="l11" class="leaf" data-item="lf" data-index="4"><span><b>Reflections</b><small>lessons after failure</small></span><em>312</em></div>
        <div id="l12" class="leaf" data-item="lf" data-index="5"><span><b>Summaries</b><small>compressed sessions</small></span><em>9:1</em></div>
      </div>
      <div class="col" style="--item: var(--c3)">
        <div id="b2" class="mi-card branch" data-item="br" data-index="2" data-color="var(--c3)"><span class="mi-label"><span>B3</span><span>2.3M facts</span></span><b>Semantic</b><small>what is true</small><i id="s2" class="spine"></i></div>
        <div id="l20" class="leaf" data-item="lf" data-index="6"><span><b>Vector store</b><small>doc embeddings</small></span><em>2.3M</em></div>
        <div id="l21" class="leaf" data-item="lf" data-index="7"><span><b>Knowledge graph</b><small>entities + relations</small></span><em>410K</em></div>
        <div id="l22" class="leaf" data-item="lf" data-index="8"><span><b>Wiki pages</b><small>curated, versioned</small></span><em>1,240</em></div>
      </div>
      </div>
    </div>

    <div class="lower">
      <div class="mi-card mi-swap-host">
        <div class="mi-swap" data-item="br" data-index="0" style="--item: var(--c1)"><span class="mi-label acc">B1 / WORKING MEMORY</span><h4>Lives for one task</h4><p>Everything in the prompt right now. Fast and exact, but it is gone when the run ends.</p><div class="kv"><span>lifetime</span><b>one run</b></div></div>
        <div class="mi-swap" data-item="br" data-index="1" style="--item: var(--c2)"><span class="mi-label acc">B2 / EPISODIC MEMORY</span><h4>Remembers what happened</h4><p>Raw traces and short reflections. The agent reads them to avoid the same mistake twice.</p><div class="kv"><span>lifetime</span><b>weeks</b></div></div>
        <div class="mi-swap" data-item="br" data-index="2" style="--item: var(--c3)"><span class="mi-label acc">B3 / SEMANTIC MEMORY</span><h4>Knows what is true</h4><p>Facts pulled out of episodes and documents, stored for search and kept up to date.</p><div class="kv"><span>lifetime</span><b>permanent</b></div></div>
      </div>
      <div class="mi-card legend">
        <span class="mi-label">READ LATENCY</span>
        <div style="--item: var(--c1)"><i></i>working<span>0 ms</span></div>
        <div style="--item: var(--c2)"><i></i>episodic<span>40 ms</span></div>
        <div style="--item: var(--c3)"><i></i>semantic<span>120 ms</span></div>
        <span class="mi-label" style="margin-top:8px">WRITE PATH</span>
        <div style="--item: var(--c1)"><i></i>overwrite<span>every step</span></div>
        <div style="--item: var(--c2)"><i></i>append<span>every run</span></div>
        <div style="--item: var(--c3)"><i></i>extract<span>nightly</span></div>
      </div>
    </div>
  </section>

  <section class="mi-band">
    <div class="mi-stat" style="--item: var(--c1)"><span class="mi-stat-v">128K</span><span class="mi-stat-l">Working budget, tokens</span></div>
    <div class="mi-stat" style="--item: var(--c2)"><span class="mi-stat-v" data-ticker="14.2" data-jitter="0.2" data-decimals="1" data-suffix="K">14.2K</span><span class="mi-stat-l">Episodes logged</span></div>
    <div class="mi-stat" style="--item: var(--c3)"><span class="mi-stat-v">2.3M</span><span class="mi-stat-l">Semantic facts</span></div>
  </section>

  <footer class="mi-foot"><span>SOURCE / AGENT MEMORY SURVEY 2026</span><span class="path">WORKING &gt; EPISODIC &gt; SEMANTIC</span><span class="mark">studio</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Item count**: keep leaves per branch equal so the clocks stay aligned: `lf` step × leaves per branch = `br` step. For 4 branches × 2 leaves use `br` 2 s and `lf` 1 s. Unequal leaf counts: set `lf` step to `br step / max leaves` and add `data-count` on `.tree` equal to branches × max leaves, and number leaves `k × max + j`; short branches simply rest.
- **Left-to-right tree** (landscape): root on the left, branches in a column, leaves to the right; use `#root@right #bK@left` and `#bK@right #lKJ@left` elbows.
- **Story**: stack the three branch columns as rows (branch left, leaves right).
- **Pitfalls**: the leaf indent (`margin-left: 56px`) must be larger than the spine position (`left: 20px`), or the elbow turns backwards. Leaf indices are global across branches (`k × leaves per branch + j`).
