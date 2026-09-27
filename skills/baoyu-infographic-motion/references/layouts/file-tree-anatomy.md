# file-tree-anatomy

An annotated folder tree: every file is a coloured pill with a one-line "what it does" and a role badge, grouped
under numbered section rules. A highlight band jumps from file to file while dots run down the tree lines. It is
the "anatomy of a repo / agent / service" post.

## Use when / Avoid when

- **Use when**: explaining how a project, agent, plugin, monorepo or config folder is organised; "what each file
  does"; 12-20 files in 4-6 groups where the role of each file (llm / code / config / receipt) is the story.
- **Avoid when**: the items are not files or have no hierarchy (use `doc-terminal`, `periodic-table`), files need
  more than one line of text, or the tree is deeper than 3 levels.

## Structure

- **Head**: big centred `.mi-title` between two chevrons, a script-font subtitle (system cursive stack, no web
  font), a heavy ink rule.
- **Tree** (the master cycle): root folder, then 6 `.sec` groups. Each group has a section rule
  (`01 · THE TRIGGER`, number in the left gutter) and rows. A row is a 3-column grid: tree cell (icon + name) /
  annotation / role badge. Folder rows carry a `→ annotation` in ink; file rows carry a muted annotation that
  starts with a bold verb (`Parse -`, `Ask -`, `Score -`). A file is a coloured `.pill` (colour = its role) or a
  `.plain` name for data files.
- **Tree lines**: one `data-link="#parent@bottom #child@left" data-shape="elbow"` path per child. Paths from one
  parent overlap on the vertical trunk, so the trunk looks like one line. Anchor to the icons (`#i0`…), not to the
  pills, so the pills can lift.
- **Bar 1**: summary line + second muted line, and a 3-option mode toggle on the right. **Bar 2**: the big number
  line with scrambling digits and a 30-dot strip. **Tagline** in the script font, then a small `.mi-foot`.

## Motion recipe

- **Master cycle** `f`: 18 files × 0.667 s = 12 s, `data-cycles="2"` (24 s), `data-fade="0.12"` (snappy jumps),
  `data-accent`, `data-sfx="blip"`. `data-order` makes the band jump around the tree (3 → 9 → 14 → 6 …) like the
  reference instead of scanning top to bottom. Every file must be in `data-order`.
- **Active file**: band (`.r.f::before`, item colour 20 % + outline), `▶` marker in the gutter, pill lifts
  (`translate` by `--on`; legal because links anchor to the icons), red cursor block after the name, badge fills
  with its colour, the annotation gets a `.mi-select` sweep (`data-select="0.4"`, same `data-item`/`data-index`).
  `--sel-color` is multiplied by `--on` so only the current sweep shows (finished selections would otherwise stay
  lit until the cycle wraps).
- **Section rule**: `.sec:has(.is-active)` turns its rule to `--accent` and bolds the label (instant switch).
- **Packets**: 3 dots on the longest root trunk (`data-period="6"`), 1 dot on the last-child path of each folder
  (period 2 or 3 s, alternating `data-phase-offset`), coloured with `data-packet-class`.
- **Nested clocks**: mode toggle `mode` 3 × 4 s = 12 s (radio fills, bar fills with `--p`); dot strip `dots`
  30 × 0.4 s = 12 s. Both silent.
- **Scramble**: `data-scramble` on the cost and count numbers flickers at the end of each master period (frame 0
  stays clean).
- **Sound**: `data-sfx="music"` with a 0.667 s step (90 bpm) is close to the reference lo-fi bed. For a calmer
  post use `soft`.
- **Canvas**: `paper` 1200×1600 (3:4, the reference is 1800×2400: export with `--scale 1.5`).
  `data-poster="4.45"` is a moment with the band fully on and its sweep finished.

## Skeleton

Paper 1200×1600.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Anatomy of a Review Bot</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-page.fta { padding: 40px 60px 26px; gap: 14px; }
  .fta-head { text-align: center; }
  .fta-head .mi-title { display: flex; justify-content: center; align-items: center; gap: 34px; font-size: 60px; }
  .chev { width: 20px; height: 20px; border-right: 5px solid var(--ink); border-bottom: 5px solid var(--ink); rotate: 45deg; translate: 0 -8px; flex: none; }
  .script { font-family: "Bradley Hand", "Segoe Script", "Snell Roundhand", "Comic Sans MS", cursive; font-size: 28px; color: var(--ink); margin-top: 6px; }
  .script em { font-style: normal; color: var(--accent); }
  .fta-rule { height: 3px; background: var(--ink); margin-top: 16px; }

  .tree { position: relative; padding-left: 44px; font-family: var(--font-mono); }
  .tree > .mi-svg { z-index: 0; }
  .tree .mi-edge { stroke: var(--muted); stroke-width: 1.6; }
  .tree .mi-packet { fill: var(--accent); }
  .tree .pk2 { fill: var(--c2); } .tree .pk3 { fill: var(--c3); } .tree .pk5 { fill: var(--c5); }
  .r { position: relative; z-index: 1; display: grid; grid-template-columns: 436px 1fr 112px; align-items: center; height: 37px; }
  .t { display: flex; align-items: center; gap: 10px; padding-left: calc(var(--d, 0) * 34px); font-size: 17px; white-space: nowrap; }
  .ic { flex: none; position: relative; }
  .ic.fo { width: 23px; height: 17px; border: 2px solid var(--ink); border-radius: 2px 3px 3px 3px; background: color-mix(in oklab, var(--c1) 45%, var(--panel)); }
  .ic.fo::before { content: ""; position: absolute; left: -2px; top: -6px; width: 10px; height: 4px; border: 2px solid var(--ink); border-bottom: 0; border-radius: 2px 2px 0 0; background: inherit; }
  .ic.fi { width: 16px; height: 20px; margin-left: 3px; border: 1.6px solid var(--ink); border-radius: 1px 5px 1px 1px; background: var(--panel); }
  .ic.fi::after { content: ""; position: absolute; left: 3px; right: 3px; top: 6px; height: 7px; border-top: 1.4px solid var(--muted); border-bottom: 1.4px solid var(--muted); }
  .fold { font-weight: 700; }
  .root .t { font-size: 22px; }
  .pill { padding: 1px 9px; border: var(--bw) solid var(--ink); border-radius: 5px; font-weight: 700; color: var(--ink);
    background: color-mix(in oklab, var(--item) 55%, var(--panel)); box-shadow: var(--shadow);
    translate: calc(var(--on, 0) * -2px) calc(var(--on, 0) * -3px); }
  .plain { color: var(--ink); }
  .nm::after { content: ""; display: inline-block; width: 7px; height: 17px; margin-left: 9px; vertical-align: -3px; background: var(--c3); opacity: var(--on, 0); }
  .an { font-size: 16px; color: var(--muted); white-space: nowrap; }
  .an b { color: var(--ink); font-weight: 700; }
  .an.dir { color: var(--ink); }
  .an .mi-select { --sel-color: color-mix(in oklab, var(--item) calc(var(--on, 0) * 30%), transparent); padding: 2px 0; }
  .bd { justify-self: end; display: inline-flex; align-items: center; gap: 7px; font-size: 13px; padding: 3px 12px 3px 10px; border: var(--bw) solid var(--ink); border-radius: 999px;
    background: color-mix(in oklab, var(--item) calc(var(--on, 0) * 45%), var(--panel)); color: var(--ink); box-shadow: var(--shadow); }
  .bd::before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--item); }
  .r.f::before { content: ""; position: absolute; left: -26px; right: -10px; top: 1px; bottom: 1px; border-radius: 7px; z-index: -1;
    background: color-mix(in oklab, var(--item) calc(var(--on, 0) * 20%), transparent); border: 1.5px solid color-mix(in oklab, var(--item) calc(var(--on, 0) * 100%), transparent); }
  .r.f::after { content: ""; position: absolute; left: -38px; top: 11px; border: 7px solid transparent; border-left: 10px solid var(--item); border-right: 0; opacity: var(--on, 0); }
  .sh { position: relative; z-index: 1; display: flex; align-items: center; gap: 12px; height: 32px; font-size: 13px; letter-spacing: 0.12em; color: var(--muted); padding-left: 24px; }
  .sh b { position: absolute; left: -44px; font-weight: 400; }
  .sh i { flex: 1; height: 1.5px; background: var(--line); }
  .sec:has(.is-active) .sh { color: var(--ink); font-weight: 700; }
  .sec:has(.is-active) .sh i { height: 2px; background: var(--accent); }

  .bar { border: 2px solid var(--ink); border-radius: 14px; background: var(--panel); box-shadow: var(--shadow); padding: 12px 22px; font-family: var(--font-mono); }
  .b1 { display: grid; grid-template-columns: 1fr auto; gap: 4px 20px; align-items: center; }
  .b1 .l1 { font-size: 17px; }
  .b1 .l2 { font-size: 13px; color: var(--muted); }
  .b1 .l1 .n { color: var(--c3); font-weight: 700; } .b1 .l1 .g { color: var(--c2); font-weight: 700; }
  .led { display: inline-block; width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--c2); margin-right: 10px; vertical-align: -1px; }
  .modes { display: flex; gap: 16px; grid-row: span 2; }
  .opt { display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: color-mix(in oklab, var(--ink) calc(40% + var(--on, 0) * 60%), var(--panel)); font-weight: calc(400 + var(--on, 0) * 300); }
  .opt .o { display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 6px; vertical-align: -1px; border: 1.5px solid currentColor; background: color-mix(in oklab, var(--item) calc(var(--on, 0) * 100%), transparent); }
  .opt s { display: block; height: 7px; border-radius: 4px; background: color-mix(in oklab, var(--muted) 25%, transparent); overflow: hidden; }
  .opt s i { display: block; height: 100%; width: calc(var(--p, 0) * 100%); background: var(--item); }
  .b2 { display: flex; align-items: center; gap: 18px; font-size: 21px; }
  .b2 .n { color: var(--c3); font-weight: 700; }
  .b2 .med { padding: 2px 12px; border-radius: 6px; background: color-mix(in oklab, var(--c2) 22%, var(--panel)); }
  .dots { margin-left: auto; display: flex; gap: 5px; padding: 4px 6px; border: 1.5px solid var(--ink); border-radius: 8px; }
  .dots i { width: 12px; height: 12px; border-radius: 3px; border: 1.5px solid var(--ink); background: var(--c1); scale: calc(1 + var(--on, 0) * 0.35); }
  .dots i:nth-child(5n+2) { background: var(--c2); } .dots i:nth-child(5n+3) { background: var(--c3); }
  .dots i:nth-child(5n+4) { background: var(--c4); } .dots i:nth-child(5n) { background: var(--c5); }
  .dots i { opacity: calc(0.55 + var(--on, 0) * 0.45); }
  .tag { text-align: center; border-top: 2px dotted var(--muted); padding-top: 12px; }
  .tag .script { font-size: 34px; margin: 0; }
  .fta .mi-foot { justify-content: center; gap: 24px; font-size: 12px; }
</style>
</head>
<body data-canvas="paper" data-cycles="2" data-sfx="music" data-fps="30" data-poster="4.45">
<main class="mi-page fta">
  <header class="fta-head">
    <h1 class="mi-title"><i class="chev"></i><span>Anatomy of a <em>Review Bot</em></span><i class="chev"></i></h1>
    <div class="script">code reads, an LLM judges, <em>code guards</em></div>
    <div class="fta-rule"></div>
  </header>

  <section class="tree" data-cycle="f" data-step="0.667" data-fade="0.12" data-sfx="blip" data-accent data-master data-order="3,9,14,6,17,1,11,4,16,8,13,2,18,7,10,5,15,12">
    <svg class="mi-svg">
      <path class="mi-edge" data-link="#i0@bottom #i1@left" data-shape="elbow"></path>
      <path class="mi-edge" data-link="#i0@bottom #i2@left" data-shape="elbow"></path>
      <path class="mi-edge" data-link="#i0@bottom #i5@left" data-shape="elbow"></path>
      <path class="mi-edge" data-link="#i0@bottom #i10@left" data-shape="elbow"></path>
      <path class="mi-edge" data-link="#i0@bottom #i15@left" data-shape="elbow"></path>
      <path class="mi-edge" data-link="#i0@bottom #i18@left" data-shape="elbow"></path>
      <path class="mi-edge" data-link="#i0@bottom #i20@left" data-shape="elbow"></path>
      <path class="mi-edge" data-link="#i0@bottom #i23@left" data-shape="elbow" data-packets="3" data-period="6" data-r="4.5"></path>
      <path class="mi-edge" data-link="#i2@bottom #i3@left" data-shape="elbow"></path>
      <path class="mi-edge" data-link="#i2@bottom #i4@left" data-shape="elbow" data-packets="1" data-period="2" data-r="3.5" data-packet-class="pk2"></path>
      <path class="mi-edge" data-link="#i5@bottom #i6@left" data-shape="elbow"></path>
      <path class="mi-edge" data-link="#i5@bottom #i7@left" data-shape="elbow"></path>
      <path class="mi-edge" data-link="#i5@bottom #i8@left" data-shape="elbow"></path>
      <path class="mi-edge" data-link="#i5@bottom #i9@left" data-shape="elbow" data-packets="1" data-period="3" data-r="3.5" data-packet-class="pk3"></path>
      <path class="mi-edge" data-link="#i10@bottom #i11@left" data-shape="elbow"></path>
      <path class="mi-edge" data-link="#i10@bottom #i12@left" data-shape="elbow"></path>
      <path class="mi-edge" data-link="#i10@bottom #i13@left" data-shape="elbow"></path>
      <path class="mi-edge" data-link="#i10@bottom #i14@left" data-shape="elbow" data-packets="1" data-period="3" data-r="3.5" data-phase-offset="0.5" data-packet-class="pk5"></path>
      <path class="mi-edge" data-link="#i15@bottom #i16@left" data-shape="elbow"></path>
      <path class="mi-edge" data-link="#i15@bottom #i17@left" data-shape="elbow" data-packets="1" data-period="2" data-r="3.5" data-packet-class="pk5"></path>
      <path class="mi-edge" data-link="#i18@bottom #i19@left" data-shape="elbow" data-packets="1" data-period="2" data-r="3.5" data-phase-offset="0.5" data-packet-class="pk2"></path>
      <path class="mi-edge" data-link="#i20@bottom #i21@left" data-shape="elbow"></path>
      <path class="mi-edge" data-link="#i20@bottom #i22@left" data-shape="elbow" data-packets="1" data-period="2" data-r="3.5" data-packet-class="pk3"></path>
      <path class="mi-edge" data-link="#i23@bottom #i24@left" data-shape="elbow"></path>
      <path class="mi-edge" data-link="#i23@bottom #i25@left" data-shape="elbow" data-packets="1" data-period="3" data-r="3.5" data-packet-class="pk2"></path>
    </svg>

    <div class="r root"><div class="t"><i class="ic fo" id="i0"></i><span class="fold">review-bot/</span></div><span class="an dir">&rarr; one bot, three jobs, no merge rights</span></div>

    <div class="sec">
      <div class="sh"><b>01</b>&middot; THE TRIGGER<i></i></div>
      <div class="r f" data-item="f" data-index="0" data-color="var(--c1)" style="--d:1; --item: var(--c1)"><div class="t"><i class="ic fi" id="i1"></i><span class="pill nm">webhook.ts</span></div><span class="an"><span class="mi-select" data-select="0.4" data-item="f" data-index="0">&rarr; wakes on every pull request</span></span><b class="bd">event</b></div>
      <div class="r" style="--d:1"><div class="t"><i class="ic fo" id="i2"></i><span class="fold">config/</span></div><span class="an dir">&rarr; what the team switched on</span></div>
      <div class="r f" data-item="f" data-index="1" data-color="var(--c4)" style="--d:2; --item: var(--c4)"><div class="t"><i class="ic fi" id="i3"></i><span class="plain nm">rules.yaml</span></div><span class="an"><span class="mi-select" data-select="0.4" data-item="f" data-index="1">severity, paths, ignore list</span></span><b class="bd">config</b></div>
      <div class="r f" data-item="f" data-index="2" data-color="var(--c5)" style="--d:2; --item: var(--c5)"><div class="t"><i class="ic fi" id="i4"></i><span class="pill nm">voice.md</span></div><span class="an"><span class="mi-select" data-select="0.4" data-item="f" data-index="2">tone of every comment, in plain words</span></span><b class="bd">llm</b></div>
    </div>

    <div class="sec">
      <div class="sh"><b>02</b>&middot; THE READ<i></i></div>
      <div class="r" style="--d:1"><div class="t"><i class="ic fo" id="i5"></i><span class="fold">context/</span></div><span class="an dir">&rarr; what the bot sees before it speaks</span></div>
      <div class="r f" data-item="f" data-index="3" data-color="var(--c2)" style="--d:2; --item: var(--c2)"><div class="t"><i class="ic fi" id="i6"></i><span class="pill nm">diff.ts</span></div><span class="an"><span class="mi-select" data-select="0.4" data-item="f" data-index="3"><b>Parse</b> - hunks, renames, moved code</span></span><b class="bd">parse</b></div>
      <div class="r f" data-item="f" data-index="4" data-color="var(--c2)" style="--d:2; --item: var(--c2)"><div class="t"><i class="ic fi" id="i7"></i><span class="pill nm">blame.ts</span></div><span class="an"><span class="mi-select" data-select="0.4" data-item="f" data-index="4"><b>Parse</b> - who last touched each line</span></span><b class="bd">parse</b></div>
      <div class="r f" data-item="f" data-index="5" data-color="var(--c3)" style="--d:2; --item: var(--c3)"><div class="t"><i class="ic fi" id="i8"></i><span class="pill nm">symbols.ts</span></div><span class="an"><span class="mi-select" data-select="0.4" data-item="f" data-index="5"><b>Index</b> - callers of each changed function</span></span><b class="bd">index</b></div>
      <div class="r f" data-item="f" data-index="6" data-color="var(--c2)" style="--d:2; --item: var(--c2)"><div class="t"><i class="ic fi" id="i9"></i><span class="pill nm">coverage.ts</span></div><span class="an"><span class="mi-select" data-select="0.4" data-item="f" data-index="6"><b>Map</b> - which tests touch the diff</span></span><b class="bd">parse</b></div>
    </div>

    <div class="sec">
      <div class="sh"><b>03</b>&middot; THE JUDGE<i></i></div>
      <div class="r" style="--d:1"><div class="t"><i class="ic fo" id="i10"></i><span class="fold">checks/</span></div><span class="an dir">&rarr; one question per file, asked in full</span></div>
      <div class="r f" data-item="f" data-index="7" data-color="var(--c5)" style="--d:2; --item: var(--c5)"><div class="t"><i class="ic fi" id="i11"></i><span class="pill nm">security.ts</span></div><span class="an"><span class="mi-select" data-select="0.4" data-item="f" data-index="7"><b>Ask</b> - secret, injection, auth bypass?</span></span><b class="bd">llm</b></div>
      <div class="r f" data-item="f" data-index="8" data-color="var(--c5)" style="--d:2; --item: var(--c5)"><div class="t"><i class="ic fi" id="i12"></i><span class="pill nm">logic.ts</span></div><span class="an"><span class="mi-select" data-select="0.4" data-item="f" data-index="8"><b>Ask</b> - off-by-one, null, race?</span></span><b class="bd">llm</b></div>
      <div class="r f" data-item="f" data-index="9" data-color="var(--c4)" style="--d:2; --item: var(--c4)"><div class="t"><i class="ic fi" id="i13"></i><span class="pill nm">style.ts</span></div><span class="an"><span class="mi-select" data-select="0.4" data-item="f" data-index="9"><b>Lint</b> - the formatter already knows</span></span><b class="bd">code</b></div>
      <div class="r f" data-item="f" data-index="10" data-color="var(--c6)" style="--d:2; --item: var(--c6)"><div class="t"><i class="ic fi" id="i14"></i><span class="pill nm">score.ts</span></div><span class="an"><span class="mi-select" data-select="0.4" data-item="f" data-index="10"><b>Score</b> - keep comments above 0.80</span></span><b class="bd">score</b></div>
    </div>

    <div class="sec">
      <div class="sh"><b>04</b>&middot; THE VOICE<i></i></div>
      <div class="r" style="--d:1"><div class="t"><i class="ic fo" id="i15"></i><span class="fold">comments/</span></div><span class="an dir">&rarr; the only place text is written</span></div>
      <div class="r f" data-item="f" data-index="11" data-color="var(--c5)" style="--d:2; --item: var(--c5)"><div class="t"><i class="ic fi" id="i16"></i><span class="pill nm">draft.ts</span></div><span class="an"><span class="mi-select" data-select="0.4" data-item="f" data-index="11">line comment plus a suggested patch</span></span><b class="bd">llm</b></div>
      <div class="r f" data-item="f" data-index="12" data-color="var(--c4)" style="--d:2; --item: var(--c4)"><div class="t"><i class="ic fi" id="i17"></i><span class="pill nm">dedupe.ts</span></div><span class="an"><span class="mi-select" data-select="0.4" data-item="f" data-index="12">drop repeats of open threads</span></span><b class="bd">code</b></div>
    </div>

    <div class="sec">
      <div class="sh"><b>05</b>&middot; THE PROOF<i></i></div>
      <div class="r" style="--d:1"><div class="t"><i class="ic fo" id="i18"></i><span class="fold">logs/</span></div><span class="an dir">&rarr; every verdict leaves a receipt</span></div>
      <div class="r f" data-item="f" data-index="13" data-color="var(--c1)" style="--d:2; --item: var(--c1)"><div class="t"><i class="ic fi" id="i19"></i><span class="plain nm">verdicts.jsonl</span></div><span class="an"><span class="mi-select" data-select="0.4" data-item="f" data-index="13">sha, check, score, kept or dropped</span></span><b class="bd">receipt</b></div>
      <div class="r" style="--d:1"><div class="t"><i class="ic fo" id="i20"></i><span class="fold">evals/</span></div><span class="an dir">&rarr; tune on your own past reviews</span></div>
      <div class="r f" data-item="f" data-index="14" data-color="var(--c1)" style="--d:2; --item: var(--c1)"><div class="t"><i class="ic fi" id="i21"></i><span class="plain nm">labels.csv</span></div><span class="an"><span class="mi-select" data-select="0.4" data-item="f" data-index="14">600 comments graded by humans</span></span><b class="bd">data</b></div>
      <div class="r f" data-item="f" data-index="15" data-color="var(--c3)" style="--d:2; --item: var(--c3)"><div class="t"><i class="ic fi" id="i22"></i><span class="pill nm">replay.ts</span></div><span class="an"><span class="mi-select" data-select="0.4" data-item="f" data-index="15">re-run last month of PRs, diff it</span></span><b class="bd">eval</b></div>
    </div>

    <div class="sec">
      <div class="sh"><b>06</b>&middot; THE GUARDS<i></i></div>
      <div class="r" style="--d:1"><div class="t"><i class="ic fo" id="i23"></i><span class="fold">hooks/</span></div><span class="an dir">&rarr; reviewing is not permission</span></div>
      <div class="r f" data-item="f" data-index="16" data-color="var(--c4)" style="--d:2; --item: var(--c4)"><div class="t"><i class="ic fi" id="i24"></i><span class="pill nm">pre_post.ts</span></div><span class="an"><span class="mi-select" data-select="0.4" data-item="f" data-index="16">skip vendored and generated code</span></span><b class="bd">code</b></div>
      <div class="r f" data-item="f" data-index="17" data-color="var(--c4)" style="--d:2; --item: var(--c4)"><div class="t"><i class="ic fi" id="i25"></i><span class="pill nm">rate.ts</span></div><span class="an"><span class="mi-select" data-select="0.4" data-item="f" data-index="17">at most 12 comments per PR</span></span><b class="bd">code</b></div>
    </div>
  </section>

  <div class="bar b1">
    <div class="l1"><i class="led"></i><span class="n">4</span> questions &middot; <b>1</b> pass per PR &middot; <span class="g" data-scramble="0.5">$0.031</span> / PR &middot; merges <span class="n">never</span></div>
    <div class="modes" data-cycle="mode" data-step="4">
      <div class="opt" data-item style="--item: var(--c2)"><span><i class="o"></i>code reads</span><s><i></i></s></div>
      <div class="opt" data-item style="--item: var(--c5)"><span><i class="o"></i>llm judges</span><s><i></i></s></div>
      <div class="opt" data-item style="--item: var(--c4)"><span><i class="o"></i>code guards</span><s><i></i></s></div>
    </div>
    <div class="l2">2 Ask &middot; 1 Score &middot; 1 Lint, same diff, one context load</div>
  </div>

  <div class="bar b2">
    <span><i class="led"></i><b data-scramble="0.6">2,400</b> PRs = <span class="n" data-scramble="0.6">$74</span></span>
    <span class="med">median <b data-scramble="0.6">48</b> s</span>
    <div class="dots" data-cycle="dots" data-step="0.4">
      <i data-item></i><i data-item></i><i data-item></i><i data-item></i><i data-item></i><i data-item></i><i data-item></i><i data-item></i><i data-item></i><i data-item></i>
      <i data-item></i><i data-item></i><i data-item></i><i data-item></i><i data-item></i><i data-item></i><i data-item></i><i data-item></i><i data-item></i><i data-item></i>
      <i data-item></i><i data-item></i><i data-item></i><i data-item></i><i data-item></i><i data-item></i><i data-item></i><i data-item></i><i data-item></i><i data-item></i>
    </div>
  </div>

  <div class="tag"><p class="script">the bot never merges - <em>it explains.</em></p></div>
  <footer class="mi-foot"><span>review-bot v2.3</span><span class="path">src &gt; context &gt; checks &gt; comments</span><span>18 files &middot; 6 parts</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Row budget**: 25 rows at 37 px + 6 section rules fill the paper canvas. Fewer rows: raise `.r` height to
  40-44 px instead of leaving a gap. More than 28 rows: drop to 33 px and 16 px text, or use the dense variant.
- **New rows**: every file row needs a unique icon `id`, a `data-link` path from its parent icon, and the same
  `data-index` on the row and on its `.mi-select` span. Add the new number to `data-order`, and keep
  `files × step` at 10-14 s.
- **Roles**: pick one colour per role and keep it on the pill, the badge dot and `data-color` (`--c5` llm,
  `--c4` code, `--c2` parse, `--c3` index / eval, `--c1` data / receipt, `--c6` score).
- **Dense variant** (reference v08): `data-canvas="portrait"` or `paper`, two tree columns side by side (two
  `.tree` columns inside one cycle element, rows use `data-item="f"`), no pills, `# comment` annotations in `--muted`, and a
  grep box in the head: wrap both columns in one element with `data-grep="agents|skills|hooks"`, put
  `data-grep-query` / `data-grep-count` in the box and `data-grep-row` on every row. Drop the band to `--on * 12%` so
  grep tint and band do not fight.
- **Styles**: brutal styles (`cream-brutal`, `pink-brutalist`) give the pills and badges a hard offset shadow
  through `--shadow`; `ide-slate` and `terminal-amber` work as the dark form. Tree lines follow `.mi-edge` styling
  (some styles dash them).
- **Pitfalls**: `data-link` throws if an `id` is missing, and the export fails. Do not put `data-drift` or a
  `translate` on the icons. Folder rows are not items: an extra `data-item` without `data-index` takes an auto index and shifts every number in `data-order`.
  Annotations are `white-space: nowrap`: keep them ≤ 46 characters.
