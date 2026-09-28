# card-pipeline

Three content cards connected left to right, a validation gate, and a numbered loop row: a process where each stage
turns the output of the previous stage into something new.

## Use when / Avoid when

- **Use when**: a paper or system has 3 stages (raw > processed > product), an agent loop (run > compile > propose >
  validate), a data pipeline, a "how it works" explainer with one gate or check at the end.
- **Avoid when**: more than 4 stages (use `hub-pipeline` or `fan-in`), a catalog of many peer items (use
  `columns-to-hub` or `tile-router`), or when the stages have no rich inner content to show.

## Structure

- Header chrome (crumb, title, sub-path, progress rule).
- **Cards row**: exactly 3 cards (`#raw`, `#wiki`, `#skill`). The middle card sits 26 px higher. Each card has a
  label line, an `h3`, and one inner widget: a row list (4-5 rows), an orbit badge + catalog (3-4 lines), a code block
  (4-6 short lines, 18 characters max so they do not wrap).
- **Gate row**: one small card under the third card with a flashing badge and a fill bar.
- **Loop row**: 4 numbered step cards with a progress bar each.
- **Band**: 3 stats. **Footer**.

## Motion recipe

- **Master cycle** `loop`: 4 steps × 1.5 s = 6 s, `data-cycles="4"` (24 s). Step 0 = raw card + RUN, 1 = wiki +
  COMPILE, 2 = skill + PROPOSE, 3 = gate + VALIDATE. `data-accent` makes the title word, crumb and rule follow the
  active card colour.
- **Beams**: one `mi-beam` per connector with the same `data-index` as its target card, so the line draws and a dot
  travels into the card that just lit up. The gate beam (`elbow`) closes the loop back to the raw card.
- **Nested clocks** (divide 6 s): raw rows every 0.6 s (`rows`, 3 s), pattern catalog every 1.5 s (`pat`, 6 s), code
  lines every 0.5 s (`code`, 3 s).
- **Ambient**: `data-spin="12"` chips around the wiki badge, `data-pulse="2"` badge glow, bar meters with
  `data-jitter`, `data-ticker` stats, `data-clock` in the meta line.
- **Accent**: gate badge `data-flash="3"` blinks ACCEPT on step 3.
- **Sound**: `blip` per step, `packet` when beams arrive, `success` on the gate step (item-level `data-sfx`).

## Skeleton

Portrait 1080×1350.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Agents Can Compile Experience</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-body { display: flex; flex-direction: column; gap: 18px; }
  .cards { flex: 1; display: grid; grid-template-columns: 1fr 1.08fr 1fr; gap: 44px; align-items: stretch; }
  .cards .mi-card { min-height: 0; display: flex; flex-direction: column; gap: 16px; }
  .cards .mid { margin-top: -26px; }
  .card-top { display: flex; justify-content: space-between; }
  .rows { display: flex; flex-direction: column; gap: 8px; }
  .rows .mi-row { padding: 8px 12px; }
  .mi-row small { display: block; font-size: 11px; color: var(--muted); letter-spacing: .08em; }
  .orbit { position: relative; height: 160px; display: grid; place-items: center; }
  .orbit .ring { position: absolute; border: 1.5px solid color-mix(in oklab, var(--c2) 45%, transparent); border-radius: 50%; }
  .orbit .chip { position: absolute; width: 24px; height: 14px; border: 1.5px solid var(--c2); border-radius: 3px; background: var(--panel); }
  .wiki { width: 150px; height: 70px; border-radius: 10px; border: 2px solid var(--c2); display: grid; place-items: center; font-family: var(--font-mono); color: var(--c2); font-weight: 600; font-size: 22px; background: color-mix(in oklab, var(--c2) calc(8% + var(--pulse) * 10%), var(--panel)); box-shadow: 0 0 calc(var(--pulse) * 24px) color-mix(in oklab, var(--c2) 40%, transparent); }
  .wiki small { display: block; font-size: 11px; color: var(--muted); font-weight: 500; }
  .cat { display: flex; flex-direction: column; gap: 12px; font-size: 14px; }
  .cat div { display: flex; gap: 10px; align-items: center; }
  .cat div::before { content: ""; width: 7px; height: 16px; background: var(--ink); opacity: calc(.15 + .85 * var(--on)); }
  .cat div { opacity: calc(.3 + .7 * max(var(--on), var(--done))); }
  .patch { display: flex; flex-direction: column; gap: 7px; }
  .patch i { display: block; height: 6px; width: 64px; background: var(--line); }
  .gate-row { display: grid; grid-template-columns: 1fr 1.08fr 1fr; gap: 44px; }
  .gate { grid-column: 3; padding: 14px 18px; --item: var(--c2); }
  .gate .mi-badge { float: right; }
  .loop { margin-top: auto; }
  .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 14px; }
  .steps .mi-card { padding: 16px 18px; background: color-mix(in oklab, var(--item, var(--accent)) calc(var(--on) * 10%), var(--panel)); }
  .steps .mi-card b { font-family: var(--font-display); font-size: 22px; }
  .steps .mi-card p { font-size: 13px; color: var(--muted); margin-top: 8px; }
  .steps .mi-bar { margin-top: 10px; height: 4px; }
  .steps .mi-bar > i { width: calc(var(--p) * 100%); }
  .meter { display: flex; gap: 5px; align-items: end; height: 34px; }
  .meter span { width: 7px; background: color-mix(in oklab, var(--c6) 70%, var(--panel)); height: calc(var(--value) * 100%); }
</style>
</head>
<body data-canvas="portrait" data-cycles="4" data-sfx="soft" data-fps="30" data-poster="0.9">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">LAB NOTES / AGENT RESEARCH / PAPER 006</span><span class="mi-meta">ITERATION <span data-counter="loop">01</span> / T <span data-clock></span></span></div>
    <h1 class="mi-title">Agents can compile <em>experience</em></h1>
    <div class="mi-sub"><span>RAW TRACES</span><span class="sep">&gt;</span><span>PERSISTENT WIKI</span><span class="sep">&gt;</span><span>EVOLVED SKILLS</span></div>
    <div class="mi-rule" data-progress="loop"></div>
  </header>

  <section class="mi-body" data-cycle="loop" data-step="1.5" data-sfx="blip" data-accent data-master>
    <svg class="mi-svg">
      <path class="mi-edge" data-link="#raw #wiki"></path>
      <path class="mi-edge" data-link="#wiki #skill"></path>
      <path class="mi-edge" data-link="#skill@bottom #gate@top" data-shape="straight"></path>
      <path class="mi-edge" data-link="#gate@left #raw@bottom" data-shape="elbow"></path>
      <path class="mi-beam" data-link="#raw #wiki" data-beam data-item="loop" data-index="1" style="--item: var(--c2)" data-sfx-end="packet"></path>
      <path class="mi-beam" data-link="#wiki #skill" data-beam data-item="loop" data-index="2" style="--item: var(--c1)" data-sfx-end="packet"></path>
      <path class="mi-beam" data-link="#skill@bottom #gate@top" data-shape="straight" data-beam data-item="loop" data-index="3" style="--item: var(--c2)"></path>
      <path class="mi-beam" data-link="#gate@left #raw@bottom" data-shape="elbow" data-beam data-item="loop" data-index="0" style="--item: var(--c1)"></path>
    </svg>

    <div class="cards">
      <article id="raw" class="mi-card" data-item="loop" data-index="0" data-color="var(--c1)">
        <div class="card-top mi-label"><span>RAW LAYER</span><span>raw/</span></div>
        <h3>Immutable execution traces</h3>
        <div class="rows" data-cycle="rows" data-step="0.6">
          <div class="mi-row" data-item style="--item: var(--c6)"><div><small>01 OBS</small>room / desk / clock</div></div>
          <div class="mi-row" data-item style="--item: var(--c6)"><div><small>02 ACT</small>take(clock)</div></div>
          <div class="mi-row" data-item style="--item: var(--c6)"><div><small>03 TOOL</small>examine(clock)</div></div>
          <div class="mi-row" data-item style="--item: var(--c6)"><div><small>04 ACT</small>move(clock, desk)</div></div>
          <div class="mi-row" data-item style="--item: var(--c3)"><div><small>05 EVAL</small>repeat loop detected</div></div>
        </div>
        <div class="card-top mi-label" style="margin-top:auto"><span>ITERATION <span data-counter="loop">01</span></span><span class="acc">WRITE ONCE</span></div>
        <div class="meter">
          <span data-bar="0.8" data-jitter="0.2"></span><span data-bar="0.5" data-jitter="0.3"></span><span data-bar="0.7" data-jitter="0.2"></span><span data-bar="0.4" data-jitter="0.3"></span><span data-bar="0.9" data-jitter="0.1"></span><span data-bar="0.3" data-jitter="0.2"></span><span data-bar="0.6" data-jitter="0.3"></span><span data-bar="0.8" data-jitter="0.2"></span><span data-bar="0.5" data-jitter="0.3"></span><span data-bar="0.7" data-jitter="0.2"></span><span data-bar="0.9" data-jitter="0.1"></span><span data-bar="0.4" data-jitter="0.3"></span>
        </div>
      </article>

      <article id="wiki" class="mi-card mid" data-item="loop" data-index="1" data-color="var(--c2)" style="--item: var(--c2)">
        <div class="card-top mi-label"><span>PERSISTENT WIKI</span><span>wiki/</span></div>
        <h3>Compounding knowledge</h3>
        <div class="orbit">
          <div class="ring" style="width:300px;height:150px"></div>
          <div class="ring" style="width:230px;height:112px"></div>
          <div style="position:absolute;width:270px;height:270px;transform:scaleY(.5)">
            <div data-spin="12" style="position:absolute;inset:0">
              <i class="chip" style="left:-12px;top:128px"></i><i class="chip" style="right:-12px;top:128px"></i><i class="chip" style="left:123px;top:-7px"></i><i class="chip" style="left:123px;bottom:-7px"></i>
            </div>
          </div>
          <div class="wiki" data-pulse="2">WIKI<small><span data-counter="pat">01</span> PATTERNS</small></div>
        </div>
        <div class="mi-label">PATTERN CATALOG</div>
        <div class="cat" data-cycle="pat" data-step="1.5">
          <div data-item>never return item to origin</div>
          <div data-item>one operation per object</div>
          <div data-item>verify completion before repeat</div>
          <div data-item>record rejected interventions</div>
        </div>
        <div class="card-top mi-label" style="margin-top:auto"><span class="acc" style="color:var(--c2)">NEVER RESET</span><span>ITER 00 -&gt; <span data-counter="loop">01</span></span></div>
      </article>

      <article id="skill" class="mi-card" data-item="loop" data-index="2" data-color="var(--c1)">
        <div class="card-top mi-label"><span class="acc">SKILL LAYER</span><span>skills/</span></div>
        <h3>Executable procedure</h3>
        <div class="mi-code" data-cycle="code" data-step="0.5">
          <div class="card-top" style="margin-bottom:10px"><span class="k">SKILL.md</span><span>v01</span></div>
          <div class="mi-code-line" data-item><b>01</b># break-loop</div>
          <div class="mi-code-line" data-item><b>02</b>on: repeat seen</div>
          <div class="mi-code-line" data-item><b>03</b>check done state</div>
          <div class="mi-code-line" data-item><b>04</b>pick new target</div>
          <div class="mi-code-line" data-item><b>05</b>act once</div>
          <div class="mi-code-line" data-item><b>06</b>verify, then stop</div>
        </div>
        <div class="mi-label">ATOMIC PATCH</div>
        <div class="patch"><i></i><i style="background:var(--c2)"></i><i></i><i style="background:var(--c3)"></i><i style="background:var(--c2)"></i><i></i></div>
        <div class="mi-label acc" style="margin-top:auto;text-align:right">REVERSIBLE</div>
      </article>
    </div>

    <div class="gate-row"><div id="gate" class="mi-card gate" data-item="loop" data-index="3" data-color="var(--c2)">
      <span class="mi-badge" data-item="loop" data-index="3" data-flash="3" data-sfx="success" style="--item: var(--c2)">ACCEPT</span>
      <div class="mi-label">VALIDATION GATE</div>
      <div class="mi-bar" style="margin-top:12px" data-bar="1" data-item="loop" data-index="3" data-dur="1.1"><i style="background:var(--c2)"></i></div>
    </div></div>

    <div class="loop">
      <div class="card-top mi-label"><span class="acc">THE EVOLUTION LOOP</span><span>4 ITERATIONS / LIVE</span></div>
      <div class="steps">
        <div class="mi-card" data-item="loop" data-index="0"><span class="mi-label">01</span> <b>RUN</b><p>write raw traces</p><div class="mi-bar"><i></i></div></div>
        <div class="mi-card" data-item="loop" data-index="1"><span class="mi-label">02</span> <b>COMPILE</b><p>consolidate patterns</p><div class="mi-bar"><i></i></div></div>
        <div class="mi-card" data-item="loop" data-index="2"><span class="mi-label">03</span> <b>PROPOSE</b><p>edit one skill</p><div class="mi-bar"><i></i></div></div>
        <div class="mi-card" data-item="loop" data-index="3"><span class="mi-label">04</span> <b>VALIDATE</b><p>accept or rollback</p><div class="mi-bar"><i></i></div></div>
      </div>
    </div>
  </section>

  <section class="mi-band">
    <div class="mi-stat" style="--item: var(--c1)"><span class="mi-stat-v" data-ticker="47.4" data-jitter="0.3" data-decimals="1" data-suffix="%">47.4%</span><span class="mi-stat-l">Qwen 9B + WikiSkill</span></div>
    <div class="mi-stat" style="--item: var(--c2)"><span class="mi-stat-v" data-ticker="15.0" data-jitter="0.2" data-decimals="1" data-prefix="+">+15.0</span><span class="mi-stat-l">Persistent wiki ablation</span></div>
    <div class="mi-stat" style="--item: var(--c3)"><span class="mi-stat-v" data-ticker="70.2" data-jitter="0.3" data-decimals="1" data-suffix="%">70.2%</span><span class="mi-stat-l">Transferred skill / ALFWorld</span></div>
  </section>

  <footer class="mi-foot"><span>SOURCE / ARXIV:2608.27454</span><span class="path">EXPERIENCE &gt; KNOWLEDGE &gt; SKILLS</span><span class="mark">fieldnotes</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Rename stages**: keep 3 cards; change label, `h3` and the inner widget. Keep card titles to 2-3 short words.
- **Other inner widgets**: any card can hold `.mi-code`, `.mi-row` lists, a `.mi-ring`, or a sparkline. Keep the
  widget height near the others so the row stays balanced.
- **4 loop steps are fixed to 4 master steps.** For 3 steps, remove one loop card and the gate, and set the elbow
  beam to `data-index="2"`.
- **Square canvas**: remove the band, drop the raw list to 3 rows and the code to 4 lines.
- **Story canvas**: stack the 3 cards vertically (`grid-template-columns: 1fr`), change links to `@bottom`/`@top`.
- **Pitfalls**: code lines that wrap make the third card taller than the others and push the loop row into the band.
  Keep row text short. The page uses `.cards { flex: 1 }`, so cards grow to fill free space; do not put a fixed
  `min-height` back on them.
