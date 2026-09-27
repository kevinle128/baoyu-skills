# source-listing

The whole infographic is one source file in an editor: a prompt, config or YAML with line numbers, XML-ish section
tags and comments. The active block gets an accent bar, a selection sweeps across its key phrase, the minimap and
outline follow, and a grep box filters lines.

## Use when / Avoid when

- **Use when**: sharing a prompt, a system instruction, a config file, a YAML workflow, a Dockerfile or a short
  script where the text itself is the content; 30-55 lines in 4-8 named blocks.
- **Avoid when**: the text is longer than ~55 lines (split it or use `doc-terminal`), lines are longer than ~80
  characters, or the content is a diagram, not text.

## Structure

- **Head**: `.mi-top` (path + version / lines / tokens), `.mi-title`, `.mi-sub` with the block names.
- **Editor** `.ed` (the `data-grep` container):
  - Title bar: traffic-light dots, active tab with the file name and a modified dot, a second tab, encoding at right.
  - Find bar: grep box (`data-grep-query` with a block caret), `N matching lines` (`data-grep-count`), option chips.
  - Main: code column + side column. Each line is `.ln` = gutter number `<b>` + `<code>`. Lines of one block sit
    in a `.blk` wrapper (the cycle item). Non-empty lines carry `data-grep-row`. Syntax spans: `.tg` tag name, `.at`
    attribute, `.st` string, `.vr` template variable, `.cm` comment.
  - Side: minimap (one `<i>` bar per line, `--ind` indent and `--len` length in characters) with one thumb `<u>` per
    block (`--a` first line index, `--n` line count), then an outline list of the blocks with their line numbers.
  - Status bar: branch, `Ln` (a `.mi-swap-host` with the key line of each block), `block NN / 07`
    (`data-counter`), right-side meta.

## Motion recipe

- **Master cycle** `blk`: 7 blocks × 2 s = 14 s, `data-cycles="2"` (28 s), `data-fade="0.2"`, `data-sfx="blip"`.
  One accent colour for the whole editor (no `data-accent`): the block's left accent bar, gutter numbers of the
  block turn from `--muted` to `--ink`, the minimap thumb and outline row light with `--on`.
- **Selection sweep**: one key phrase per block is a `.mi-select` span with `data-select="0.9"` and the block's
  `data-item`/`data-index`; its line (`.ln.key`) gets a current-line band on `::before` and an I-beam caret rides
  the end of the sweep (`::after` at `left: calc(var(--sel) * 100%)`). `--sel-color` is multiplied by `--on` so
  old selections fade.
- **Grep**: `data-grep="diff|test|never|must"`, `data-step="7"` → 4 queries × 7 s = 28 s, one full grep loop per
  video. Matching lines get an `--c3` tint (set `--item` on the rows), others dim to 50 % (page override of
  the default 35 %). Frame 0 has an empty query. `data-sfx="tick"` at `data-gain="0.5"` marks each result.
- **Sound**: `soft`. The reference (v12) was silent; `data-sfx="none"` is fine for a pure reading post.
- **Canvas**: custom `1200x1800` (2:3). The reference is ~0.65 wide/tall and `portrait` (0.8) cannot hold 50+
  lines at 16 px. `data-poster="0.95"`: first block selected, grep still typing, no filter yet.

## Skeleton

Custom canvas 1200×1800.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>The Review Comment Prompt</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-page.sl { padding: 44px 52px 40px; gap: 16px; }
  .sl .mi-title { font-size: 54px; }

  .ed { flex: 1; min-height: 0; display: flex; flex-direction: column; background: var(--panel); border: var(--bw) solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; font-family: var(--font-mono); }
  .ed-bar { display: flex; align-items: center; gap: 14px; height: 46px; padding: 0 18px; background: var(--panel2); border-bottom: 1px solid var(--line); font-size: 14px; color: var(--muted); }
  .ed-bar .dots { display: flex; gap: 7px; margin-right: 6px; }
  .ed-bar .dots i { width: 12px; height: 12px; border-radius: 50%; background: var(--c5); }
  .ed-bar .dots i + i { background: var(--c6); } .ed-bar .dots i + i + i { background: var(--c2); }
  .ed-bar .tab { display: flex; align-items: center; gap: 10px; height: 100%; padding: 0 16px; color: var(--ink); background: var(--panel); border-top: 2px solid var(--accent); }
  .ed-bar .tab::after { content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--ink); }
  .ed-bar .r { margin-left: auto; }
  .ed-find { display: flex; align-items: center; gap: 14px; height: 54px; padding: 0 18px; border-bottom: 1px solid var(--line); font-size: 15px; color: var(--muted); }
  .ed-find .box { width: 420px; display: flex; align-items: center; gap: 10px; padding: 7px 12px; border: 1.5px solid var(--accent); border-radius: 6px; background: var(--bg); color: var(--ink); }
  .ed-find .box em { font-style: normal; color: var(--muted); }
  .ed-find .box .q { color: var(--accent); font-weight: 700; }
  .ed-find .box .q::after { content: ""; display: inline-block; width: 8px; height: 17px; margin-left: 2px; vertical-align: -3px; background: var(--accent); }
  .ed-find .cnt b { color: var(--ink); }
  .ed-find .opt { padding: 3px 8px; border: 1px solid var(--line); border-radius: 4px; font-size: 13px; }
  .ed-find .opt.on { color: var(--ink); border-color: var(--ink); }
  .ed-find .r { margin-left: auto; }

  .ed-main { flex: 1; min-height: 0; display: grid; grid-template-columns: 1fr 170px; }
  .code { padding: 12px 0; min-width: 0; }
  .ln { position: relative; display: grid; grid-template-columns: 58px 1fr; height: 27px; align-items: center; font-size: 16px; line-height: 27px; white-space: pre; font-variant-ligatures: none; }
  .ln b { position: relative; z-index: 1; text-align: right; padding-right: 16px; font-weight: 400; color: color-mix(in oklab, var(--ink) calc(var(--on, 0) * 100%), var(--muted)); }
  .ln code { position: relative; z-index: 1; font: inherit; padding-left: 16px; color: var(--ink); }
  .ln.cmt code, .cm { color: var(--muted); }
  .tg { color: var(--c2); } .at { color: var(--c4); } .st { color: var(--c3); } .vr { color: var(--c1); }
  .ed [data-grep-row] { --item: var(--c3); opacity: calc(1 - 0.5 * var(--miss, 0)); }
  .blk { position: relative; }
  .blk::before { content: ""; position: absolute; left: 60px; top: 0; bottom: 0; width: 3px; border-radius: 2px; background: color-mix(in oklab, var(--accent) calc(var(--on, 0) * 100%), transparent); }
  .ln.key::before { content: ""; position: absolute; left: 63px; right: 0; top: 0; bottom: 0; background: color-mix(in oklab, var(--accent) calc(var(--on, 0) * 10%), transparent); }
  .ln .mi-select { position: relative; --sel-color: color-mix(in oklab, var(--accent) calc(var(--on, 0) * 34%), transparent); }
  .ln .mi-select::after { content: ""; position: absolute; left: calc(var(--sel, 0) * 100%); top: 2px; bottom: 2px; width: 2px; background: var(--ink); opacity: var(--on, 0); }

  .side { position: relative; border-left: 1px solid var(--line); padding: 14px 12px; display: flex; flex-direction: column; gap: 22px; }
  .mm { position: relative; }
  .mm i { display: block; height: 3px; margin-bottom: 3px; margin-left: calc(var(--ind, 0) * 1.3px); width: calc(var(--len, 0) * 1.3px); border-radius: 1px; background: color-mix(in oklab, var(--muted) 50%, transparent); }
  .mm u { position: absolute; left: -6px; right: -6px; top: calc(var(--a) * 6px - 3px); height: calc(var(--n) * 6px + 3px); border-radius: 3px;
    background: color-mix(in oklab, var(--accent) calc(var(--on, 0) * 22%), transparent); border: 1.5px solid color-mix(in oklab, var(--accent) calc(var(--on, 0) * 100%), transparent); }
  .outline { display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
  .outline .h { color: var(--muted); letter-spacing: 0.1em; text-transform: var(--label-case); margin-bottom: 4px; }
  .outline .o { display: flex; justify-content: space-between; padding: 4px 8px; border-radius: 4px; color: color-mix(in oklab, var(--ink) calc(55% + var(--on, 0) * 45%), var(--panel));
    background: color-mix(in oklab, var(--accent) calc(var(--on, 0) * 18%), transparent); font-weight: calc(400 + var(--on, 0) * 300); }
  .outline .o span { color: var(--muted); font-weight: 400; }

  .ed-status { display: flex; align-items: center; gap: 22px; height: 34px; padding: 0 18px; border-top: 1px solid var(--line); background: var(--panel2); font-size: 13px; color: var(--muted); }
  .ed-status .br { color: var(--ink); }
  .ed-status .br::before { content: ""; display: inline-block; width: 8px; height: 8px; margin-right: 8px; border-radius: 50%; background: var(--c2); }
  .ed-status .mi-swap-host { display: inline-block; width: 2.2em; height: 1.2em; vertical-align: bottom; }
  .ed-status b { color: var(--ink); font-weight: 700; }
  .ed-status .r { margin-left: auto; }
</style>
</head>
<body data-canvas="1200x1800" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="0.95">
<main class="mi-page sl">
  <div class="mi-top"><span class="mi-crumb">prompts / review / logic</span><span class="mi-meta">v4 &middot; 52 lines &middot; 1,184 tokens</span></div>
  <header class="mi-head">
    <h1 class="mi-title">The <em>review comment</em> prompt</h1>
    <div class="mi-sub"><span>role</span><span class="sep">&gt;</span><span>inputs</span><span class="sep">&gt;</span><span>process</span><span class="sep">&gt;</span><span>output</span><span class="sep">&gt;</span><span>rules</span></div>
  </header>

  <section class="ed" data-grep="diff|test|never|must" data-step="7" data-sfx="tick" data-gain="0.5">
    <div class="ed-bar"><span class="dots"><i></i><i></i><i></i></span><span class="tab">review-comment.prompt.xml</span><span>checks/logic.ts</span><span class="r">XML &middot; UTF-8 &middot; LF</span></div>
    <div class="ed-find">
      <span class="box"><em>grep</em><span class="q" data-grep-query></span></span>
      <span class="cnt"><b data-grep-count>0</b> matching lines</span>
      <span class="opt">Aa</span><span class="opt">.*</span><span class="opt on">in file</span>
      <span class="r">&uarr; &darr;</span>
    </div>
    <div class="ed-main">
      <div class="code" data-cycle="blk" data-step="2" data-fade="0.2" data-sfx="blip" data-master>
      <div class="ln cmt" data-grep-row><b>1</b><code><i class="cm">&lt;!-- review-comment.prompt.xml · loaded by checks/logic.ts --&gt;</i></code></div>
      <div class="ln"><b>2</b><code></code></div>
      <div class="blk" data-item="blk" data-index="0">
        <div class="ln" data-grep-row><b>3</b><code>&lt;<span class="tg">role</span>&gt;</code></div>
        <div class="ln" data-grep-row><b>4</b><code>You are a senior reviewer on a team that ships every day.</code></div>
        <div class="ln key" data-grep-row><b>5</b><code>You read one diff at a time and <span class="mi-select" data-select="0.9" data-item="blk" data-index="0">you comment only when it matters.</span></code></div>
        <div class="ln" data-grep-row><b>6</b><code>&lt;/<span class="tg">role</span>&gt;</code></div>
      </div>
      <div class="ln"><b>7</b><code></code></div>
      <div class="blk" data-item="blk" data-index="1">
        <div class="ln" data-grep-row><b>8</b><code>&lt;<span class="tg">inputs</span>&gt;</code></div>
        <div class="ln" data-grep-row><b>9</b><code>&lt;<span class="tg">diff</span>&gt;<span class="vr">{{hunks}}</span>&lt;/<span class="tg">diff</span>&gt;             <i class="cm">&lt;!-- parsed, renames folded --&gt;</i></code></div>
        <div class="ln" data-grep-row><b>10</b><code>&lt;<span class="tg">callers</span>&gt;<span class="vr">{{symbols}}</span>&lt;/<span class="tg">callers</span>&gt;     <i class="cm">&lt;!-- max 20 call sites --&gt;</i></code></div>
        <div class="ln key" data-grep-row><b>11</b><code>&lt;<span class="tg">tests</span>&gt;<span class="vr">{{coverage}}</span>&lt;/<span class="tg">tests</span>&gt;        <i class="cm">&lt;!-- <span class="mi-select" data-select="0.9" data-item="blk" data-index="1">tests that touch the diff</span> --&gt;</i></code></div>
        <div class="ln" data-grep-row><b>12</b><code>&lt;/<span class="tg">inputs</span>&gt;</code></div>
      </div>
      <div class="ln"><b>13</b><code></code></div>
      <div class="blk" data-item="blk" data-index="2">
        <div class="ln" data-grep-row><b>14</b><code>&lt;<span class="tg">process</span>&gt;</code></div>
        <div class="ln" data-grep-row><b>15</b><code>Read the diff once, top to bottom, before you judge anything.</code></div>
        <div class="ln" data-grep-row><b>16</b><code>For each changed function, list what its callers now receive.</code></div>
        <div class="ln" data-grep-row><b>17</b><code>Check null, empty and boundary values first; most bugs live there.</code></div>
        <div class="ln"><b>18</b><code></code></div>
        <div class="ln" data-grep-row><b>19</b><code>If a test covers the change, say which one and whether it still</code></div>
        <div class="ln key" data-grep-row><b>20</b><code>passes in your head. <span class="mi-select" data-select="0.9" data-item="blk" data-index="2">If no test covers it, that is the finding.</span></code></div>
        <div class="ln"><b>21</b><code></code></div>
        <div class="ln" data-grep-row><b>22</b><code>Look for the change the author did not make: a caller that was</code></div>
        <div class="ln" data-grep-row><b>23</b><code>not updated, a config key that was not renamed, a stale doc.</code></div>
        <div class="ln" data-grep-row><b>24</b><code>&lt;/<span class="tg">process</span>&gt;</code></div>
      </div>
      <div class="ln"><b>25</b><code></code></div>
      <div class="blk" data-item="blk" data-index="3">
        <div class="ln" data-grep-row><b>26</b><code>&lt;<span class="tg">output</span> <span class="at">format</span>=<span class="st">"json"</span>&gt;</code></div>
        <div class="ln" data-grep-row><b>27</b><code>{</code></div>
        <div class="ln" data-grep-row><b>28</b><code>  "line": 42,                          <i class="cm">// line in the new file</i></code></div>
        <div class="ln" data-grep-row><b>29</b><code>  "severity": "must" | "should" | "nit",</code></div>
        <div class="ln" data-grep-row><b>30</b><code>  "why": "one sentence a junior can act on",</code></div>
        <div class="ln" data-grep-row><b>31</b><code>  "patch": "the smallest diff that fixes it"</code></div>
        <div class="ln" data-grep-row><b>32</b><code>}</code></div>
        <div class="ln key" data-grep-row><b>33</b><code>Return an empty list when nothing matters. <span class="mi-select" data-select="0.9" data-item="blk" data-index="3">Silence is allowed.</span></code></div>
        <div class="ln" data-grep-row><b>34</b><code>&lt;/<span class="tg">output</span>&gt;</code></div>
      </div>
      <div class="ln"><b>35</b><code></code></div>
      <div class="blk" data-item="blk" data-index="4">
        <div class="ln" data-grep-row><b>36</b><code>&lt;<span class="tg">rules</span>&gt;</code></div>
        <div class="ln" data-grep-row><b>37</b><code>Never comment on style; the formatter already runs.</code></div>
        <div class="ln" data-grep-row><b>38</b><code>Never repeat a thread that is still open on this pull request.</code></div>
        <div class="ln" data-grep-row><b>39</b><code>At most 12 comments. Keep the ones you would defend in person.</code></div>
        <div class="ln key" data-grep-row><b>40</b><code><span class="mi-select" data-select="0.9" data-item="blk" data-index="4">A "must" needs a failing input you can name.</span></code></div>
        <div class="ln" data-grep-row><b>41</b><code>&lt;/<span class="tg">rules</span>&gt;</code></div>
      </div>
      <div class="ln"><b>42</b><code></code></div>
      <div class="blk" data-item="blk" data-index="5">
        <div class="ln" data-grep-row><b>43</b><code>&lt;<span class="tg">voice</span>&gt;</code></div>
        <div class="ln key" data-grep-row><b>44</b><code>Plain and direct. <span class="mi-select" data-select="0.9" data-item="blk" data-index="5">Name the risk, then the fix.</span> No praise, no</code></div>
        <div class="ln" data-grep-row><b>45</b><code>hedging, no "consider maybe". One idea per comment.</code></div>
        <div class="ln" data-grep-row><b>46</b><code>&lt;/<span class="tg">voice</span>&gt;</code></div>
      </div>
      <div class="ln"><b>47</b><code></code></div>
      <div class="blk" data-item="blk" data-index="6">
        <div class="ln" data-grep-row><b>48</b><code>&lt;<span class="tg">limits</span>&gt;</code></div>
        <div class="ln" data-grep-row><b>49</b><code>Do not approve or merge. Do not run code. Do not guess at</code></div>
        <div class="ln key" data-grep-row><b>50</b><code>intent; <span class="mi-select" data-select="0.9" data-item="blk" data-index="6">ask one question instead</span> when the diff is ambiguous.</code></div>
        <div class="ln" data-grep-row><b>51</b><code>&lt;/<span class="tg">limits</span>&gt;</code></div>
      </div>
      <div class="ln"><b>52</b><code></code></div>
      </div>
      <div class="side">
        <div class="mm"><i style="--ind:0;--len:62"></i><i></i><i style="--ind:0;--len:6"></i><i style="--ind:0;--len:57"></i><i style="--ind:0;--len:65"></i><i style="--ind:0;--len:7"></i><i></i><i style="--ind:0;--len:8"></i><i style="--ind:0;--len:66"></i><i style="--ind:0;--len:61"></i><i style="--ind:0;--len:69"></i><i style="--ind:0;--len:9"></i><i></i><i style="--ind:0;--len:9"></i><i style="--ind:0;--len:61"></i><i style="--ind:0;--len:61"></i><i style="--ind:0;--len:66"></i><i></i><i style="--ind:0;--len:63"></i><i style="--ind:0;--len:63"></i><i></i><i style="--ind:0;--len:62"></i><i style="--ind:0;--len:60"></i><i style="--ind:0;--len:10"></i><i></i><i style="--ind:0;--len:22"></i><i style="--ind:0;--len:1"></i><i style="--ind:2;--len:60"></i><i style="--ind:2;--len:38"></i><i style="--ind:2;--len:42"></i><i style="--ind:2;--len:42"></i><i style="--ind:0;--len:1"></i><i style="--ind:0;--len:62"></i><i style="--ind:0;--len:9"></i><i></i><i style="--ind:0;--len:7"></i><i style="--ind:0;--len:51"></i><i style="--ind:0;--len:62"></i><i style="--ind:0;--len:62"></i><i style="--ind:0;--len:44"></i><i style="--ind:0;--len:8"></i><i></i><i style="--ind:0;--len:7"></i><i style="--ind:0;--len:60"></i><i style="--ind:0;--len:51"></i><i style="--ind:0;--len:8"></i><i></i><i style="--ind:0;--len:8"></i><i style="--ind:0;--len:57"></i><i style="--ind:0;--len:60"></i><i style="--ind:0;--len:9"></i><i></i>
        <u data-item="blk" data-index="0" style="--a:2;--n:4"></u>
        <u data-item="blk" data-index="1" style="--a:7;--n:5"></u>
        <u data-item="blk" data-index="2" style="--a:13;--n:11"></u>
        <u data-item="blk" data-index="3" style="--a:25;--n:9"></u>
        <u data-item="blk" data-index="4" style="--a:35;--n:6"></u>
        <u data-item="blk" data-index="5" style="--a:42;--n:4"></u>
        <u data-item="blk" data-index="6" style="--a:47;--n:4"></u>
        </div>
        <div class="outline">
          <div class="h">Outline</div>
          <div class="o" data-item="blk" data-index="0">&lt;role&gt;<span>3</span></div>
          <div class="o" data-item="blk" data-index="1">&lt;inputs&gt;<span>8</span></div>
          <div class="o" data-item="blk" data-index="2">&lt;process&gt;<span>14</span></div>
          <div class="o" data-item="blk" data-index="3">&lt;output&gt;<span>26</span></div>
          <div class="o" data-item="blk" data-index="4">&lt;rules&gt;<span>36</span></div>
          <div class="o" data-item="blk" data-index="5">&lt;voice&gt;<span>43</span></div>
          <div class="o" data-item="blk" data-index="6">&lt;limits&gt;<span>48</span></div>
        </div>
      </div>
    </div>
    <div class="ed-status"><span class="br">main</span><span>Ln <span class="mi-swap-host"><span class="mi-swap" data-item="blk" data-index="0">5</span><span class="mi-swap" data-item="blk" data-index="1">11</span><span class="mi-swap" data-item="blk" data-index="2">20</span><span class="mi-swap" data-item="blk" data-index="3">33</span><span class="mi-swap" data-item="blk" data-index="4">40</span><span class="mi-swap" data-item="blk" data-index="5">44</span><span class="mi-swap" data-item="blk" data-index="6">50</span></span></span><span>block <b data-counter="blk">01</b> / 07</span><span>0 problems</span><span class="r">prompt &middot; claude &middot; temperature 0.2</span></div>
  </section>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Line budget**: 52 lines at 27 px fill the 1800 px canvas. For fewer lines raise `.ln` height and
  `line-height` together (28-30 px); for more, drop to 25 px / 15 px text (≥ 13 px). Keep lines ≤ 80 characters
  at 16 px (the code column is ~870 px).
- **Blocks**: 5-8 blocks. Keep `blocks × step` at 12-16 s. Every block needs matching `data-index` on the `.blk`
  wrapper, the `.mi-select` span, the minimap `<u>`, the outline row and the `Ln` swap span.
- **Minimap**: one `<i>` per line in the same order as the code; `--len` = trimmed length, `--ind` = leading
  spaces, empty lines are a bare `<i></i>`. Do not name these variables `--w`/`--h`: the runtime uses them for
  the canvas size and they inherit into every element.
- **Grep words**: pick 3-5 words that hit 2-6 lines each; a word that matches nothing just dims the whole file.
  Match text is case-insensitive and includes the line number, so avoid pure digits.
- **YAML / config**: rename the tag spans to keys (`.tg` for keys, `.st` for values), use `#` comments with `.cm`,
  and use top-level keys as blocks. For a script, the blocks are functions.
- **Styles**: dark editors come from the style (`ide-slate`, `terminal-amber`, `phosphor-crt`); light ones from
  `light-dashboard`, `cream-pastel`, `cream-brutal`. `font-variant-ligatures: none` on `.ln` keeps `<!--` and `-->`
  literal in fonts with ligatures.
- **Pitfalls**: put `data-grep` on the element that contains the query box, the counter and all rows. The current
  line band must stay on `::before`: `motion.css` sets `background-color` on `[data-grep-row]` for match tint.
