# doc-terminal

A dense paper document (table of contents in parts) with a reading cursor and done / reading / queued states, above a
terminal log that streams lines: a long document or checklist being processed.

## Use when / Avoid when

- **Use when**: a book or report table of contents, a course syllabus, "100 production architectures" lists, an audit
  checklist, any 12-24 row list where progress through the list is the story.
- **Avoid when**: items relate to each other or to a centre (use `orbit-panel`, `columns-to-hub`), or rows need more
  than ~30 characters.

## Structure

- **Doc card**: file header (name with blinking caret, meta chips), then 2 columns × 2 parts. Each part: roman
  numeral pill, name, page count, part progress bar, 5 rows (number, title, pages, status).
- **Read bar**: label, progress bar, counter, 3 tag chips.
- **Terminal**: `.mi-code` panel with a header (dots, file name, live clock) and a `.mi-log` of 12 lines, 8 visible.
- **Band**: 3 stats. **Footer**.

## Motion recipe

- **Master cycle** `part`: 4 parts × 3 s = 12 s, `data-cycles="2"` (24 s), `data-accent`: pill fills, part bar
  fills with `--p`, title accent takes the part colour.
- **Row cursor** `row`: 20 rows × 0.6 s = 12 s, `data-sfx="tick"`. The status cell stacks 3 labels and shows one
  from the state variables: `[ok · verified]` = `--done`, `[reading …]` = `--on`, `[queued]` = the rest. Queued rows
  are dimmed.
- **Terminal**: `data-log="0.6"`, 8 rows; the new line takes `--code-accent`. The log step snaps so all lines loop
  cleanly. Lines have no timestamps because the log wraps around.
- **Ambient**: file caret `data-pulse="1"`, clock, tickers.
- **Sound**: `blip` per part, `tick` per row (0.6 s ≈ 100 bpm, like the reference). Do not add `data-sfx` to the log
  as well; two tick streams sound busy.

## Skeleton

Portrait 1080×1350.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Run A Business With No Employees</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-body { display: flex; flex-direction: column; gap: 16px; }
  .doc { padding: 18px 20px 16px; display: flex; flex-direction: column; gap: 12px; }
  .doc-head { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 1px solid var(--line); }
  .doc-head .file { font-family: var(--font-mono); font-size: 15px; font-weight: 600; }
  .doc-head .file i { display: inline-block; width: 8px; height: 16px; margin-left: 4px; vertical-align: -2px; background: var(--accent); opacity: var(--pulse); }
  .chips { display: flex; gap: 14px; font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
  .chips b { color: var(--accent); font-weight: 600; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
  .col { display: flex; flex-direction: column; gap: 18px; }
  .part { display: flex; flex-direction: column; gap: 3px; }
  .ph { display: grid; grid-template-columns: auto 1fr auto 70px; gap: 10px; align-items: center; margin-bottom: 4px; }
  .pill { padding: 2px 9px; border-radius: 999px; font-family: var(--font-mono); font-size: 12px; font-weight: 600; border: 1.5px solid var(--item);
    background: color-mix(in oklab, var(--item) calc(var(--on) * 100%), var(--panel)); color: color-mix(in oklab, var(--bg) calc(var(--on) * 100%), var(--item)); }
  .pn { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 17px; text-transform: var(--title-case); }
  .pp { font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
  .ph .mi-bar { height: 5px; }
  .ph .mi-bar > i { width: calc(max(var(--p), var(--done)) * 100%); }
  .row { position: relative; display: grid; grid-template-columns: 24px 1fr 38px 124px; gap: 8px; align-items: center; height: 34px; padding: 0 8px; border-radius: 5px;
    font-family: var(--font-mono); font-size: 14px; border: 1.5px solid color-mix(in oklab, var(--item) calc(var(--on) * 100%), transparent);
    background: color-mix(in oklab, var(--item) calc(var(--on) * 12%), transparent); opacity: calc(.5 + .5 * max(var(--on), var(--done))); }
  .row b { font-weight: 400; color: var(--muted); font-size: 12px; }
  .row .t { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .row .pg { color: var(--muted); font-size: 12px; text-align: right; }
  .st { position: relative; height: 16px; font-size: 12px; }
  .st i { position: absolute; left: 0; top: 0; font-style: normal; white-space: nowrap; }
  .st .ok { color: var(--c2); opacity: var(--done); }
  .st .rd { color: var(--item); font-weight: 600; opacity: var(--on); }
  .st .qd { color: var(--muted); opacity: calc(1 - max(var(--on), var(--done))); }
  .term { padding: 14px 18px 12px; }
  .term-head { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 12px; letter-spacing: .06em; margin-bottom: 8px; opacity: .8; }
  .term-head > span:first-child::before { content: "\25CF  \25CF  \25CF   "; color: var(--code-accent); letter-spacing: -1px; }
  .term .mi-log { --row-h: 26px; font-size: 14px; }
  .term .mi-log-row.is-new { color: var(--code-accent); }
  .readbar { display: grid; grid-template-columns: auto 1fr auto auto; gap: 14px; align-items: center; font-family: var(--font-mono); font-size: 13px; }
  .readbar .mi-bar { height: 8px; }
  .readbar .tags { display: flex; gap: 8px; }
  .readbar .mi-chip { font-size: 12px; padding: 3px 9px; }
</style>
</head>
<body data-canvas="portrait" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="0.9">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">FIELD GUIDE / TABLE OF CONTENTS / 104 PAGES</span><span class="mi-meta">CHAPTER <span data-counter="row">01</span> / 20 &middot; PART <span data-counter="part" data-pad="1">1</span> / 4</span></div>
    <h1 class="mi-title">A business with <em>no employees</em></h1>
    <div class="mi-sub"><span>ONE ORCHESTRATOR</span><span class="sep">/</span><span>FIVE JOBS</span><span class="sep">/</span><span>ONE STOP BUTTON</span></div>
    <div class="mi-rule" data-progress="part"></div>
  </header>

  <section class="mi-body" data-cycle="part" data-step="3" data-sfx="blip" data-accent data-master>
    <div class="mi-card doc" data-cycle="row" data-step="0.6" data-sfx="tick">
      <div class="doc-head"><span class="file" data-pulse="1">no-employees.md<i></i></span><div class="chips"><span><b>104</b> pp</span><span><b>4</b> parts</span><span><b>20</b> ch</span><span><b>27</b> refs</span></div></div>
      <div class="cols">
        <div class="col">
          <div class="part" data-item="part" data-index="0" data-color="var(--c1)" style="--item:var(--c1)">
            <div class="ph"><span class="pill">I</span><span class="pn">Opening</span><span class="pp">17 pp</span><div class="mi-bar"><i></i></div></div>
            <div class="row" data-item="row" data-index="0"><b>01</b><span class="t">Who this is for</span><span class="pg">3 pp</span><span class="st"><i class="ok">[ok &middot; verified]</i><i class="rd">[reading &hellip;]</i><i class="qd">[queued]</i></span></div>
            <div class="row" data-item="row" data-index="1"><b>02</b><span class="t">Scaling a loop, not a team</span><span class="pg">5 pp</span><span class="st"><i class="ok">[ok &middot; verified]</i><i class="rd">[reading &hellip;]</i><i class="qd">[queued]</i></span></div>
            <div class="row" data-item="row" data-index="2"><b>03</b><span class="t">How to read this book</span><span class="pg">2 pp</span><span class="st"><i class="ok">[ok &middot; verified]</i><i class="rd">[reading &hellip;]</i><i class="qd">[queued]</i></span></div>
            <div class="row" data-item="row" data-index="3"><b>04</b><span class="t">Orchestrator, five jobs</span><span class="pg">4 pp</span><span class="st"><i class="ok">[ok &middot; verified]</i><i class="rd">[reading &hellip;]</i><i class="qd">[queued]</i></span></div>
            <div class="row" data-item="row" data-index="4"><b>05</b><span class="t">The stop button</span><span class="pg">3 pp</span><span class="st"><i class="ok">[ok &middot; verified]</i><i class="rd">[reading &hellip;]</i><i class="qd">[queued]</i></span></div>
          </div>
          <div class="part" data-item="part" data-index="1" data-color="var(--c2)" style="--item:var(--c2)">
            <div class="ph"><span class="pill">II</span><span class="pn">The machine</span><span class="pp">26 pp</span><div class="mi-bar"><i></i></div></div>
            <div class="row" data-item="row" data-index="5"><b>06</b><span class="t">Five repeats: content</span><span class="pg">6 pp</span><span class="st"><i class="ok">[ok &middot; verified]</i><i class="rd">[reading &hellip;]</i><i class="qd">[queued]</i></span></div>
            <div class="row" data-item="row" data-index="6"><b>07</b><span class="t">Offer, price, tax, courts</span><span class="pg">5 pp</span><span class="st"><i class="ok">[ok &middot; verified]</i><i class="rd">[reading &hellip;]</i><i class="qd">[queued]</i></span></div>
            <div class="row" data-item="row" data-index="7"><b>08</b><span class="t">Why the line matters</span><span class="pg">4 pp</span><span class="st"><i class="ok">[ok &middot; verified]</i><i class="rd">[reading &hellip;]</i><i class="qd">[queued]</i></span></div>
            <div class="row" data-item="row" data-index="8"><b>09</b><span class="t">The honest ceiling</span><span class="pg">5 pp</span><span class="st"><i class="ok">[ok &middot; verified]</i><i class="rd">[reading &hellip;]</i><i class="qd">[queued]</i></span></div>
            <div class="row" data-item="row" data-index="9"><b>10</b><span class="t">A 27-agent fleet</span><span class="pg">6 pp</span><span class="st"><i class="ok">[ok &middot; verified]</i><i class="rd">[reading &hellip;]</i><i class="qd">[queued]</i></span></div>
          </div>
        </div>
        <div class="col">
          <div class="part" data-item="part" data-index="2" data-color="var(--c3)" style="--item:var(--c3)">
            <div class="ph"><span class="pill">III</span><span class="pn">Sales front door</span><span class="pp">24 pp</span><div class="mi-bar"><i></i></div></div>
            <div class="row" data-item="row" data-index="10"><b>11</b><span class="t">Inbound in minutes</span><span class="pg">5 pp</span><span class="st"><i class="ok">[ok &middot; verified]</i><i class="rd">[reading &hellip;]</i><i class="qd">[queued]</i></span></div>
            <div class="row" data-item="row" data-index="11"><b>12</b><span class="t">Qualification first</span><span class="pg">4 pp</span><span class="st"><i class="ok">[ok &middot; verified]</i><i class="rd">[reading &hellip;]</i><i class="qd">[queued]</i></span></div>
            <div class="row" data-item="row" data-index="12"><b>13</b><span class="t">The handoff line</span><span class="pg">4 pp</span><span class="st"><i class="ok">[ok &middot; verified]</i><i class="rd">[reading &hellip;]</i><i class="qd">[queued]</i></span></div>
            <div class="row" data-item="row" data-index="13"><b>14</b><span class="t">One pipeline, many shops</span><span class="pg">6 pp</span><span class="st"><i class="ok">[ok &middot; verified]</i><i class="rd">[reading &hellip;]</i><i class="qd">[queued]</i></span></div>
            <div class="row" data-item="row" data-index="14"><b>15</b><span class="t">Refunds and fights</span><span class="pg">5 pp</span><span class="st"><i class="ok">[ok &middot; verified]</i><i class="rd">[reading &hellip;]</i><i class="qd">[queued]</i></span></div>
          </div>
          <div class="part" data-item="part" data-index="3" data-color="var(--c4)" style="--item:var(--c4)">
            <div class="ph"><span class="pill">IV</span><span class="pn">Support inbox</span><span class="pp">26 pp</span><div class="mi-bar"><i></i></div></div>
            <div class="row" data-item="row" data-index="15"><b>16</b><span class="t">The FAQ wall</span><span class="pg">4 pp</span><span class="st"><i class="ok">[ok &middot; verified]</i><i class="rd">[reading &hellip;]</i><i class="qd">[queued]</i></span></div>
            <div class="row" data-item="row" data-index="16"><b>17</b><span class="t">Ticket triage rules</span><span class="pg">5 pp</span><span class="st"><i class="ok">[ok &middot; verified]</i><i class="rd">[reading &hellip;]</i><i class="qd">[queued]</i></span></div>
            <div class="row" data-item="row" data-index="17"><b>18</b><span class="t">Escalation that stays</span><span class="pg">6 pp</span><span class="st"><i class="ok">[ok &middot; verified]</i><i class="rd">[reading &hellip;]</i><i class="qd">[queued]</i></span></div>
            <div class="row" data-item="row" data-index="18"><b>19</b><span class="t">When the week breaks</span><span class="pg">5 pp</span><span class="st"><i class="ok">[ok &middot; verified]</i><i class="rd">[reading &hellip;]</i><i class="qd">[queued]</i></span></div>
            <div class="row" data-item="row" data-index="19"><b>20</b><span class="t">Payroll without people</span><span class="pg">6 pp</span><span class="st"><i class="ok">[ok &middot; verified]</i><i class="rd">[reading &hellip;]</i><i class="qd">[queued]</i></span></div>
          </div>
        </div>
      </div>
    </div>

    <div class="readbar"><span class="mi-label acc">READ</span><div class="mi-bar" data-progress="part"><i></i></div><span><span data-counter="row">01</span>/20</span><div class="tags"><span class="mi-chip" style="--item:var(--c1)">Orchestrate</span><span class="mi-chip" style="--item:var(--c3)">Sell</span><span class="mi-chip" style="--item:var(--c4)">Support</span></div></div>

    <div class="mi-code term">
      <div class="term-head"><span>audit.log</span><span>LIVE &middot; T <span data-clock></span></span></div>
      <div class="mi-log" data-log="0.6" data-rows="8" style="--rows: 8">
          <div data-line><span class="k">&gt;</span> open no-employees.md &middot; 104 pp</div>
          <div data-line><span class="k">&gt;</span> verify ch.07 offer, price, tax &hellip; <span class="k">ok</span></div>
          <div data-line><span class="k">&gt;</span> cross-check 27 sources &hellip; <span class="k">ok</span></div>
          <div data-line><span class="k">&gt;</span> figures as reported &middot; 12 flagged</div>
          <div data-line><span class="k">&gt;</span> extract playbook &rarr; notes/sales.md</div>
          <div data-line><span class="k">&gt;</span> verify ch.14 pipeline &hellip; <span class="k">ok</span></div>
          <div data-line><span class="k">&gt;</span> summary draft &middot; 1,240 words</div>
          <div data-line><span class="k">&gt;</span> audit links &middot; 27 / 27 live</div>
          <div data-line><span class="k">&gt;</span> verify ch.18 escalation &hellip; <span class="k">ok</span></div>
          <div data-line><span class="k">&gt;</span> index rebuilt &middot; ready for review</div>
          <div data-line><span class="k">&gt;</span> verify ch.03 how to read &hellip; <span class="k">ok</span></div>
          <div data-line><span class="k">&gt;</span> diff since last audit &middot; 0 changes</div>
      </div>
    </div>
  </section>

  <section class="mi-band">
    <div class="mi-stat" style="--item: var(--c1)"><span class="mi-stat-v" data-ticker="70" data-jitter="1.5" data-prefix="$" data-suffix="K">$70K</span><span class="mi-stat-l">Revenue per month</span></div>
    <div class="mi-stat" style="--item: var(--c2)"><span class="mi-stat-v">27</span><span class="mi-stat-l">Sources checked</span></div>
    <div class="mi-stat" style="--item: var(--c3)"><span class="mi-stat-v">0</span><span class="mi-stat-l">Employees</span></div>
  </section>

  <footer class="mi-foot"><span>SOURCE / FIELD GUIDE, FIGURES AS REPORTED</span><span class="path">IT ANSWERS &gt; YOU CLOSE &gt; YOU PAY</span><span class="mark">fieldnotes</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Row count**: 3-5 parts × 3-6 rows. Keep `rows × row step` = `parts × part step`; use a row step of 0.5-0.75 s.
- **Single column**: `.cols { grid-template-columns: 1fr }` with 3 parts of 4 rows; widen the title column.
- **Serif paper look** comes from the style (`paper-doc`, `cream-pastel`); the layout needs no change.
- **Square**: 2 parts per column with 4 rows, terminal 5 rows, no band.
- **Pitfalls**: row titles ≤ 26 characters (they ellipsize). `.mi-log` height comes from the CSS variable `--rows`
  (default 6); when you set `data-rows` to another number, also set `style="--rows: N"` on the log, or the newest
  lines are clipped.
