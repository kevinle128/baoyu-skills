# ranked-leaderboard

A ranked list of 12-20 items (repos, tools, papers) with a category filter: every row shows rank, name, category
chip and a value with a thin bar proportional to it, and a typed grep query filters the list by category while a
scattered spotlight jumps across rows and a terminal line types the command for the active row.

## Use when / Avoid when

- **Use when**: "top 20 GitHub repos for X", a ranked tool or paper list sorted by one number (stars, downloads,
  citations), where each item belongs to one of 4-8 tracks and the reader should pick one to start with.
- **Avoid when**: items need descriptions or two lines each (use `periodic-table` or `bento-grid`), items are scored
  on several criteria (use `comparison-matrix`), or there are fewer than 8 items (use `columns-to-hub`).

## Structure

Canvas `paper` (1200×1600, 3:4, matches the 1800×2400 reference; export with `--scale 1.5`). Standard chrome
(`.mi-top` with a rank counter, `.mi-title`, `.mi-sub`, `.mi-rule`, `.mi-foot`), no `.mi-band`.

- **Chip row** `.chips`: one `.mi-chip` per track with its row count. It sits outside the grep container so the
  match counter counts rows only.
- **Leaderboard** `.lb` (flex: 1, holds `data-grep`): search line `.grep` (`$ rg -i` + typed query + `N hits / 20
  repos`), table head `.thead`, then `.table` with 20 rows `.rw` (grid `46px 1fr 118px 138px`): rank, `owner/`
  + bold repo with an under-bar `.bar` (`--v` = value / max), track pill `.tk`, `★ count`. Rows use `flex: 1` with
  `min-height: 34px; max-height: 48px`, so a style with a taller title shrinks the rows instead of overflowing.
- **Winner**: row 1 holds an overlay `<span class="win mi-ants" style="--on:1">` (marching-ants frame).
- **Done line** `.done`: "✦ Search completed! Found 20 repositories."
- **Pick card** `.pick`: "# pick based on where you are", a 2-column legend `track -> repo` (8 lines) and a dark
  terminal line `.term[data-follow]`.

## Motion recipe

- **Master cycle** `spot` on `.mi-body`: `data-order="7,13,4,11,18,1"` (scattered spotlight, 1-based rank numbers)
  × `data-step="2"` = 12 s, `data-cycles="2"` (24 s), `data-sfx="blip"`, `data-accent` (title word, rule and query
  take the active row's track colour). Rows in the order carry `data-item data-index="rank-1"`, `data-color` and
  `data-cmd`; other rows are plain (no `data-item`), so they never dim from the cycle.
- **Linked items** (same `data-index` as the spotlighted row): the track chip (fills), the legend line (tints,
  bolds) and the star count `<b data-scramble="0.6">` (digits flicker for 0.6 s when the row activates).
- **Grep filter** on `.lb`: `data-grep="track:agents|track:llms|…"` with one query per spotlight step in the same
  order and `data-step="2"`. The runtime snaps the grep step to `duration / (queries × k)`, so query k lands exactly
  on spotlight step k: the filter lights the rows of the track, dims the rest, and the spotlight picks one of them.
  Each row has `data-grep-row="track:<t> owner/repo"` so a query never hits star digits or repo names by accident.
- **Row look**: own `.rw` class (not `.mi-row`, which dims every non-item row). Background =
  `--on × 14% + --match × 7%` of the track colour; opacity `1 - 0.5 × --miss` (the active row never dims). A ▶
  marker and a left bar fade in with `--on`; a glowing dot rides the under-bar with `--p`.
- **Follow terminal**: `.term[data-follow="spot"][data-prefix="$ "]` retypes `git clone https://github.com/<repo>.git`
  on each step.
- **Ambient**: `.mi-ants` on the winner overlay; `.mi-rule[data-progress="spot"]`.
- **Sound**: `blip` per spotlight step only (12 cues in 24 s). Grep and follow stay silent.
- **Poster**: `data-poster="1.4"` (query typed, scramble settled, command typed).

## Skeleton

The 20 rows are repetitive; generate them with a small loop when you change the list.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Top Jupyter Notebook Repositories</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-page { gap: 18px; }
  .mi-body { display: flex; flex-direction: column; gap: 14px; }
  .chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .chips .mi-chip { font-size: 13px; padding: 4px 11px; border-color: color-mix(in oklab, var(--item) 70%, transparent);
    background: color-mix(in oklab, var(--item) calc(8% + var(--on, 0) * 92%), var(--panel)); color: color-mix(in oklab, var(--bg) calc(var(--on, 0) * 100%), var(--item)); }
  .chips .mi-chip b { font-weight: 500; opacity: .75; }
  .grep { display: flex; align-items: center; gap: 10px; height: 40px; padding: 0 14px; font-family: var(--font-mono); font-size: 16px; border: 1px solid var(--line); border-radius: calc(var(--radius) * .5); background: var(--panel); }
  .grep .k { color: var(--muted); }
  .grep [data-grep-query] { color: var(--accent); font-weight: 600; }
  .grep .cnt { margin-left: auto; font-size: 13px; letter-spacing: .06em; color: var(--muted); text-transform: var(--label-case); }
  .grep .cnt b { color: var(--accent); font-size: 16px; }
  .thead, .rw { display: grid; grid-template-columns: 46px 1fr 118px 138px; align-items: center; padding: 0 12px; }
  .thead { height: 26px; font-family: var(--font-mono); font-size: 12px; letter-spacing: .12em; color: var(--muted); text-transform: var(--label-case); border-bottom: 1px dashed var(--line); }
  .thead span:first-child, .thead span:last-child { text-align: right; }
  .thead span:first-child { text-align: left; }
  .lb { flex: 1; min-height: 0; display: flex; flex-direction: column; }
  .table { flex: 1; min-height: 0; display: flex; flex-direction: column; }
  .lb .rw { position: relative; flex: 1; min-height: 34px; max-height: 48px; border-radius: 6px; font-family: var(--font-mono); font-size: 19px;
    background-color: color-mix(in oklab, var(--item) calc(var(--on, 0) * 14% + var(--match, 0) * 7%), transparent);
    opacity: calc(1 - .5 * var(--miss, 0) * (1 - var(--on, 0))); }
  .rw::before { content: "\25B6"; position: absolute; left: -2px; top: 50%; translate: 0 -50%; font-size: 11px; color: var(--item); opacity: var(--on, 0); }
  .rw::after { content: ""; position: absolute; left: -8px; top: 4px; bottom: 4px; width: 3px; border-radius: 2px; background: var(--item); opacity: var(--on, 0); }
  .rw .n { color: color-mix(in oklab, var(--item) calc(var(--on, 0) * 100%), var(--muted)); font-weight: calc(400 + var(--on, 0) * 300); padding-left: 10px; }
  .rw .nm { position: relative; white-space: nowrap; font-weight: 700; color: var(--ink); padding-bottom: 5px; }
  .rw .o { font-weight: 400; color: var(--muted); }
  .bar { position: absolute; left: 0; right: 24px; bottom: 0; height: 3px; border-radius: 2px; background: color-mix(in oklab, var(--item) 12%, transparent); }
  .bar i { position: absolute; left: 0; top: 0; bottom: 0; width: calc(var(--v) * 100%); border-radius: 2px; background: color-mix(in oklab, var(--item) 75%, transparent); }
  .bar b { position: absolute; top: -2px; width: 7px; height: 7px; border-radius: 50%; background: var(--item); left: calc(var(--p, 0) * var(--v) * 100% - 3px); opacity: var(--on, 0); box-shadow: 0 0 calc(10px * var(--glow)) var(--item); }
  .rw .tk { justify-self: start; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; padding: 2px 8px; border-radius: 999px; color: color-mix(in oklab, var(--bg) calc(var(--on, 0) * 100%), var(--item));
    border: 1px solid color-mix(in oklab, var(--item) 70%, transparent); background: color-mix(in oklab, var(--item) calc(var(--on, 0) * 100%), transparent); }
  .rw .sc { text-align: right; color: var(--muted); font-variant-numeric: tabular-nums; }
  .rw .sc::first-letter { color: var(--c3); }
  .rw .st { font-weight: calc(400 + var(--on, 0) * 300); color: color-mix(in oklab, var(--ink) calc(55% + var(--on, 0) * 45%), var(--muted)); }
  .win { position: absolute; inset: -1px -4px; border-radius: 6px; pointer-events: none; }
  .done { font-family: var(--font-mono); font-size: 15px; color: var(--c2); padding: 2px 4px; }
  .pick { padding: 16px 22px 14px; border-top: 3px solid var(--accent); display: flex; flex-direction: column; gap: 8px; }
  .pick .cols { display: grid; grid-template-columns: 1fr 1fr; column-gap: 26px; row-gap: 4px; font-family: var(--font-mono); font-size: 16px; }
  .pick .ln { display: grid; grid-template-columns: 138px 26px 1fr; padding: 2px 6px; border-radius: 4px; white-space: nowrap;
    background: color-mix(in oklab, var(--item) calc(var(--on, 0) * 16%), transparent); }
  .pick .ln span:first-child { color: var(--item); }
  .pick .ln span:nth-child(2) { color: var(--muted); }
  .pick .ln span:last-child { color: color-mix(in oklab, var(--ink) calc(70% + var(--on, 0) * 30%), var(--muted)); font-weight: calc(400 + var(--on, 0) * 300); }
  .term { font-family: var(--font-mono); font-size: 16px; font-weight: 600; padding: 10px 14px; border-radius: calc(var(--radius) * .5); background: var(--code-bg); color: var(--code-ink); height: 42px; white-space: nowrap; overflow: hidden; }
  .term::first-letter { color: var(--code-accent); }
</style>
</head>
<body data-canvas="paper" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="1.4">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">GOLDMINE FOR AI ENGINEERS</span><span class="mi-meta">20 repos &middot; 1,343,670 stars &middot; rank #<span data-counter="spot">01</span></span></div>
    <h1 class="mi-title">Top Jupyter notebook <em>repositories</em></h1>
    <div class="mi-sub"><span>PYTHON</span><span class="sep">&gt;</span><span>ML</span><span class="sep">&gt;</span><span>LLMS</span><span class="sep">&gt;</span><span>AGENTS</span><span class="sep">&gt;</span><span>PRODUCTION AI</span></div>
    <div class="mi-rule" data-progress="spot"></div>
  </header>

  <section class="mi-body" data-cycle="spot" data-step="2" data-order="7,13,4,11,18,1" data-sfx="blip" data-accent data-master>
    <div class="chips">
      <span class="mi-chip" style="--item:var(--c3)" data-item data-index="0">PYTHON <b>2</b></span>
      <span class="mi-chip" style="--item:var(--c6)" data-item data-index="3">ML <b>5</b></span>
      <span class="mi-chip" style="--item:var(--c4)" data-item data-index="12">LLMS <b>3</b></span>
      <span class="mi-chip" style="--item:var(--c5)" data-item data-index="17">GENAI <b>3</b></span>
      <span class="mi-chip" style="--item:var(--c2)" data-item data-index="6">AGENTS <b>1</b></span>
      <span class="mi-chip" style="--item:var(--c1)" data-item data-index="10">BUILD <b>3</b></span>
      <span class="mi-chip" style="--item:color-mix(in oklab, var(--c1) 50%, var(--c2))">DATA <b>2</b></span>
      <span class="mi-chip" style="--item:color-mix(in oklab, var(--c5) 50%, var(--c3))">VISION <b>1</b></span>
    </div>
    <div class="lb" data-grep="track:agents|track:llms|track:ml|track:build|track:genai|track:python" data-step="2" data-dur="0.6">
      <div class="grep"><span class="k">$ rg -i</span><span data-grep-query>track:python</span><span class="k">--sort stars</span><span class="cnt"><b data-grep-count>2</b> hits / 20 repos</span></div>
      <div class="thead"><span>#</span><span>REPOSITORY</span><span>TRACK</span><span>&#8595; STARS</span></div>
      <div class="table">
        <div class="rw" style="--item:var(--c3); --v:1.00" data-grep-row="track:python jackfrued/Python-100-Days" data-item data-index="0" data-color="var(--c3)" data-cmd="git clone https://github.com/jackfrued/Python-100-Days.git"><span class="win mi-ants" style="--on:1"></span><span class="n">1</span><span class="nm"><span class="o">jackfrued/</span>Python-100-Days<span class="bar"><i></i><b></b></span></span><span class="tk">python</span><span class="sc">&#9733; <b class="st" data-item="spot" data-index="0" data-scramble="0.6">185,317</b></span></div>
        <div class="rw" style="--item:var(--c5); --v:0.64" data-grep-row="track:genai microsoft/generative-ai-for-beginners"><span class="n">2</span><span class="nm"><span class="o">microsoft/</span>generative-ai-for-beginners<span class="bar"><i></i><b></b></span></span><span class="tk">genai</span><span class="sc">&#9733; <b class="st">117,985</b></span></div>
        <div class="rw" style="--item:var(--c4); --v:0.56" data-grep-row="track:llms rasbt/LLMs-from-scratch"><span class="n">3</span><span class="nm"><span class="o">rasbt/</span>LLMs-from-scratch<span class="bar"><i></i><b></b></span></span><span class="tk">llms</span><span class="sc">&#9733; <b class="st">102,889</b></span></div>
        <div class="rw" style="--item:var(--c6); --v:0.48" data-grep-row="track:ml microsoft/ML-For-Beginners" data-item data-index="3" data-color="var(--c6)" data-cmd="git clone https://github.com/microsoft/ML-For-Beginners.git"><span class="n">4</span><span class="nm"><span class="o">microsoft/</span>ML-For-Beginners<span class="bar"><i></i><b></b></span></span><span class="tk">ml</span><span class="sc">&#9733; <b class="st" data-item="spot" data-index="3" data-scramble="0.6">89,474</b></span></div>
        <div class="rw" style="--item:var(--c1); --v:0.41" data-grep-row="track:build openai/openai-cookbook"><span class="n">5</span><span class="nm"><span class="o">openai/</span>openai-cookbook<span class="bar"><i></i><b></b></span></span><span class="tk">build</span><span class="sc">&#9733; <b class="st">75,313</b></span></div>
        <div class="rw" style="--item:var(--c5); --v:0.40" data-grep-row="track:genai CompVis/stable-diffusion"><span class="n">6</span><span class="nm"><span class="o">CompVis/</span>stable-diffusion<span class="bar"><i></i><b></b></span></span><span class="tk">genai</span><span class="sc">&#9733; <b class="st">73,301</b></span></div>
        <div class="rw" style="--item:var(--c2); --v:0.39" data-grep-row="track:agents microsoft/ai-agents-for-beginners" data-item data-index="6" data-color="var(--c2)" data-cmd="git clone https://github.com/microsoft/ai-agents-for-beginners.git"><span class="n">7</span><span class="nm"><span class="o">microsoft/</span>ai-agents-for-beginners<span class="bar"><i></i><b></b></span></span><span class="tk">agents</span><span class="sc">&#9733; <b class="st" data-item="spot" data-index="6" data-scramble="0.6">72,516</b></span></div>
        <div class="rw" style="--item:var(--c6); --v:0.35" data-grep-row="track:ml microsoft/AI-For-Beginners"><span class="n">8</span><span class="nm"><span class="o">microsoft/</span>AI-For-Beginners<span class="bar"><i></i><b></b></span></span><span class="tk">ml</span><span class="sc">&#9733; <b class="st">65,314</b></span></div>
        <div class="rw" style="--item:var(--c1); --v:0.32" data-grep-row="track:build pathwaycom/llm-app"><span class="n">9</span><span class="nm"><span class="o">pathwaycom/</span>llm-app<span class="bar"><i></i><b></b></span></span><span class="tk">build</span><span class="sc">&#9733; <b class="st">59,011</b></span></div>
        <div class="rw" style="--item:color-mix(in oklab, var(--c5) 50%, var(--c3)); --v:0.30" data-grep-row="track:vision facebookresearch/segment-anything"><span class="n">10</span><span class="nm"><span class="o">facebookresearch/</span>segment-anything<span class="bar"><i></i><b></b></span></span><span class="tk">vision</span><span class="sc">&#9733; <b class="st">54,695</b></span></div>
        <div class="rw" style="--item:var(--c1); --v:0.28" data-grep-row="track:build anthropics/claude-cookbooks" data-item data-index="10" data-color="var(--c1)" data-cmd="git clone https://github.com/anthropics/claude-cookbooks.git"><span class="n">11</span><span class="nm"><span class="o">anthropics/</span>claude-cookbooks<span class="bar"><i></i><b></b></span></span><span class="tk">build</span><span class="sc">&#9733; <b class="st" data-item="spot" data-index="10" data-scramble="0.6">51,779</b></span></div>
        <div class="rw" style="--item:var(--c3); --v:0.27" data-grep-row="track:python jakevdp/PythonDataScienceHandbook"><span class="n">12</span><span class="nm"><span class="o">jakevdp/</span>PythonDataScienceHandbook<span class="bar"><i></i><b></b></span></span><span class="tk">python</span><span class="sc">&#9733; <b class="st">49,630</b></span></div>
        <div class="rw" style="--item:var(--c4); --v:0.27" data-grep-row="track:llms Lordog/dive-into-llms" data-item data-index="12" data-color="var(--c4)" data-cmd="git clone https://github.com/Lordog/dive-into-llms.git"><span class="n">13</span><span class="nm"><span class="o">Lordog/</span>dive-into-llms<span class="bar"><i></i><b></b></span></span><span class="tk">llms</span><span class="sc">&#9733; <b class="st" data-item="spot" data-index="12" data-scramble="0.6">49,628</b></span></div>
        <div class="rw" style="--item:var(--c6); --v:0.27" data-grep-row="track:ml GokuMohandas/Made-With-ML"><span class="n">14</span><span class="nm"><span class="o">GokuMohandas/</span>Made-With-ML<span class="bar"><i></i><b></b></span></span><span class="tk">ml</span><span class="sc">&#9733; <b class="st">49,121</b></span></div>
        <div class="rw" style="--item:color-mix(in oklab, var(--c1) 50%, var(--c2)); --v:0.24" data-grep-row="track:data DataTalksClub/data-engineering-zoomcamp"><span class="n">15</span><span class="nm"><span class="o">DataTalksClub/</span>data-engineering-zoomcamp<span class="bar"><i></i><b></b></span></span><span class="tk">data</span><span class="sc">&#9733; <b class="st">44,694</b></span></div>
        <div class="rw" style="--item:color-mix(in oklab, var(--c1) 50%, var(--c2)); --v:0.24" data-grep-row="track:data DataExpert-io/data-engineer-handbook"><span class="n">16</span><span class="nm"><span class="o">DataExpert-io/</span>data-engineer-handbook<span class="bar"><i></i><b></b></span></span><span class="tk">data</span><span class="sc">&#9733; <b class="st">43,760</b></span></div>
        <div class="rw" style="--item:var(--c6); --v:0.24" data-grep-row="track:ml aymericdamien/TensorFlow-Examples"><span class="n">17</span><span class="nm"><span class="o">aymericdamien/</span>TensorFlow-Examples<span class="bar"><i></i><b></b></span></span><span class="tk">ml</span><span class="sc">&#9733; <b class="st">43,732</b></span></div>
        <div class="rw" style="--item:var(--c5); --v:0.21" data-grep-row="track:genai suno-ai/bark" data-item data-index="17" data-color="var(--c5)" data-cmd="git clone https://github.com/suno-ai/bark.git"><span class="n">18</span><span class="nm"><span class="o">suno-ai/</span>bark<span class="bar"><i></i><b></b></span></span><span class="tk">genai</span><span class="sc">&#9733; <b class="st" data-item="spot" data-index="17" data-scramble="0.6">39,238</b></span></div>
        <div class="rw" style="--item:var(--c6); --v:0.21" data-grep-row="track:ml google-research/google-research"><span class="n">19</span><span class="nm"><span class="o">google-research/</span>google-research<span class="bar"><i></i><b></b></span></span><span class="tk">ml</span><span class="sc">&#9733; <b class="st">38,573</b></span></div>
        <div class="rw" style="--item:var(--c4); --v:0.20" data-grep-row="track:llms anthropics/prompt-eng-interactive-tutorial"><span class="n">20</span><span class="nm"><span class="o">anthropics/</span>prompt-eng-interactive-tutorial<span class="bar"><i></i><b></b></span></span><span class="tk">llms</span><span class="sc">&#9733; <b class="st">37,700</b></span></div>
      </div>
    </div>
    <div class="done">&#10022; Search completed! Found 20 repositories.</div>
    <div class="mi-card pick">
      <div class="mi-label"># pick based on where you are</div>
      <div class="cols">
        <div class="ln" style="--item:var(--c3)" data-item data-index="0"><span>Python</span><span>-&gt;</span><span>Python-100-Days</span></div>
        <div class="ln" style="--item:var(--c5)" data-item data-index="17"><span>Generative AI</span><span>-&gt;</span><span>suno-ai/bark</span></div>
        <div class="ln" style="--item:var(--c6)" data-item data-index="3"><span>ML</span><span>-&gt;</span><span>ML-For-Beginners</span></div>
        <div class="ln" style="--item:var(--c2)" data-item data-index="6"><span>Agents</span><span>-&gt;</span><span>AI-Agents-for-Beginners</span></div>
        <div class="ln" style="--item:var(--c4)" data-item data-index="12"><span>LLMs</span><span>-&gt;</span><span>dive-into-llms</span></div>
        <div class="ln" style="--item:var(--c1)" data-item data-index="10"><span>Building</span><span>-&gt;</span><span>claude-cookbooks</span></div>
        <div class="ln" style="--item:color-mix(in oklab, var(--c1) 50%, var(--c2))"><span>Data</span><span>-&gt;</span><span>data-engineering-zoomcamp</span></div>
        <div class="ln" style="--item:color-mix(in oklab, var(--c5) 50%, var(--c3))"><span>Vision</span><span>-&gt;</span><span>segment-anything</span></div>
      </div>
      <div class="term" data-follow="spot" data-prefix="$ "></div>
    </div>
  </section>

  <footer class="mi-foot"><span>SOURCE / GITHUB STARS, SEP 2026</span><span class="path">FILTER &gt; PICK &gt; CLONE</span><span class="mark">goldmine</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Item count**: 12-20 rows. Rows flex between 34 and 48 px, so fewer rows grow up to 48 px; below 12 rows add a
  `.mi-band` of 3 stats.
- **Spotlight and queries**: keep one query per `data-order` entry, in the same order, and the same `data-step` on
  the cycle and on `data-grep`; otherwise the filter and the spotlight drift apart. Pick scattered ranks (not
  1, 2, 3) and end on rank 1 so the loop closes on the winner.
- **Tracks**: 6-8. Map each to `--c1`…`--c6`; for tracks 7-8 use a `color-mix()` of two tokens. Put the colour on
  the row, chip and legend line as `--item`.
- **Value**: `--v` = value / top value (2 decimals). For downloads or citations, change the `★` glyph and the
  column head.
- **Command**: `data-cmd` can be any per-row command (`pip install …`, `npx …`, `open https://…`). Keep it ≤ 70
  characters at 16 px.
- **Pitfalls**: `data-order` numbers are 1-based ranks; `data-index` is rank − 1. Do not add `.mi-row` to rows. Keep
  the chip row outside `.lb`, or the hit counter includes chips.
