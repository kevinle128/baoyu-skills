# decision-feed

An agent run shown as a feed of typed decisions: each card asks one question, scores 3-4 options with probability
bars, names the pick and ends in a green check row. The feed scrolls up one card per step while a decision-layer
panel types the JSON result and ticks off host checks, and a spend chart plus a big multiplier show what the
router saved.

## Use when / Avoid when

- **Use when**: a router or decision layer sits inside an agent loop ("which file, which model, which tests, safe
  to run?"), model-routing or cost-saving stories, any run log where every step is a scored choice with a result.
- **Avoid when**: the choices are not scored (use `card-pipeline`), there is one pick among fixed candidates repeated
  over rounds (use `hub-picker`), or the backends run in parallel (use `lane-stream`).

## Structure

Canvas `landscape` 1920×1080. Own header (title + sub on the left, 4 KPI tiles on the right), no `.mi-top`.

- **Main** `.main.mi-body` (grid `900px 1fr`):
  - **Agent run** card `.run`: heading row, then `.view` (overflow hidden, fades out at the bottom) holding `.feed`,
    a column of 6 decision cards `.dc` (fixed 200 px, gap 14 px = 214 px pitch) plus clones of the first 3 cards.
    Each card: `.dq` (tag, question, `→ pick`, latency), `.ops` (3 `.op` rows: rank, option, static `.mi-bar`,
    value; the first row is `.win`), `.ck` check row (tag, action, ✓, result).
  - **Side** `.side` (rows `430px 1fr`): `.dl` decision-layer card with a `.mi-swap-host` of 6 `.mi-swap` panels
    (title `Decision #n` + tag + question, option bars, `typed result` JSON `<pre>`, 3 host-check rows), and `.low`
    with a `.spend` chart card (two hand-drawn polylines, dashed baseline vs accent line with an area fill) and a
    `.mult` card (big `×N.N`, caption, 4 metric rows).
- **Ticker** `.band`: full-bleed strip with the decision list doubled, scrolled with `data-phase`. **Footer**.

## Motion recipe

- **Master cycle** `dec` on `.main`: 6 decisions × `data-step="2"` = 12 s, `data-cycles="2"` (24 s),
  `data-sfx="blip"`, `data-accent`. Every `.dc` is an item (`data-index` 0-5); the 3 clones reuse indexes 0-2, so they
  light up together with the originals and the wrap is seamless.
- **Feed scroll** (`MotionSetup`): from the cycle's `--cycle-p`, `x = p × 6`, `i = floor(x)`, `f = x − i`; in the last
  18 % of each step ease `e` 0→1 and set `--scroll = −(i + e) × 214px` on `.feed`. The active card sits in the top
  slot; at the end of step 5 the clones of cards 0-2 are in place, which equals `--scroll: 0`.
- **Active card**: border, tint and glow follow `--on`; inactive cards stay at 50 % opacity. Feed bars are static
  (`data-bar` without `data-item`) so frame 0 is complete.
- **Decision panel**: `.mi-swap` per index; its bars use `data-bar` + `data-item` (fill in 0.8 s), the JSON uses
  `data-type` + `data-item` (types in 0.9 s), host checks fade in by `--p` with staggered `--k` (0.45 / 0.6 / 0.75).
- **Spend and multiplier** (`MotionSetup`): multiplier `×(6.1 + 2.3 p)`, decisions `97 + 18 p`, steps `12 + 6 p`,
  spend `$0.98 + 0.06 p`; mirrored in the header KPIs. These climb over the cycle and jump back when it wraps
  (simulation look, like `loop-track`). A single packet rides the router line once per cycle
  (`data-packets="1" data-period="12"`).
- **Ambient**: ticker `data-phase="24"`; `telemetry-sim` blinks its live dot.
- **Sound**: `blip` per decision (12 cues in 24 s).
- **Frame 0**: `data-offset="-1.6"` on the master cycle starts the video late in the first step, so the JSON is typed and the checks are shown at t = 0.
- **Poster**: `data-poster="5"` (third decision, JSON typed, all checks shown).

## Skeleton

Cards, clones and panels are repetitive; generate them with a small loop when you change the decisions.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Decision Layer Agent Run</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-page { gap: 14px; }
  .hd { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; }
  .hd .mi-title { font-size: 46px; white-space: nowrap; }
  .hd .mi-sub { margin-top: 8px; }
  .kpis { display: flex; }
  .kpi { padding: 2px 22px; border-left: 1px solid var(--line); min-width: 150px; }
  .kpi b { display: block; font-family: var(--font-mono); font-size: 30px; font-weight: 700; color: var(--item, var(--ink)); margin-top: 4px; font-variant-numeric: tabular-nums; }
  .main { display: grid; grid-template-columns: 900px 1fr; gap: 18px; }
  .run { display: flex; flex-direction: column; padding: 16px 18px 0; }
  .ph { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }
  .ph h3 { font-size: 18px; }
  .view { position: relative; flex: 1; overflow: hidden; -webkit-mask-image: linear-gradient(#000 78%, transparent); mask-image: linear-gradient(#000 78%, transparent); }
  .feed { position: absolute; left: 0; right: 0; top: 0; display: flex; flex-direction: column; gap: 14px; translate: 0 var(--scroll, 0px); }
  .dc { height: 200px; box-sizing: border-box; padding: 14px 16px; border-radius: var(--radius); border: 1px solid color-mix(in oklab, var(--c1) calc(var(--on) * 100%), var(--line));
    background: color-mix(in oklab, var(--c1) calc(var(--on) * 7%), var(--panel2)); opacity: calc(.5 + var(--on) * .5);
    box-shadow: 0 0 calc(var(--on) * 22px) rgba(255, 45, 111, .28); display: flex; flex-direction: column; gap: 10px; }
  .dq { display: grid; grid-template-columns: auto 1fr auto auto; gap: 12px; align-items: center; font-family: var(--font-mono); font-size: 16px; }
  .qq { color: var(--ink); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tag { font-family: var(--font-mono); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; padding: 2px 8px; border-radius: 3px; color: var(--item, var(--c1)); border: 1px solid color-mix(in oklab, var(--item, var(--c1)) 60%, transparent); background: color-mix(in oklab, var(--item, var(--c1)) 12%, transparent); }
  .pick { color: var(--c1); font-size: 15px; }
  .ms { color: var(--muted); font-size: 13px; }
  .ops { display: flex; flex-direction: column; gap: 6px; }
  .op { display: grid; grid-template-columns: 26px 220px 1fr 52px; gap: 10px; align-items: center; font-family: var(--font-mono); font-size: 15px; color: var(--muted); }
  .op .n { width: 20px; height: 20px; display: grid; place-items: center; border-radius: 3px; font-size: 12px; background: #262c35; color: var(--muted); }
  .op.win { color: var(--ink); }
  .op.win .n { background: var(--c1); color: #fff; }
  .op .mi-bar > i { background: #525a66; }
  .op.win .mi-bar > i { background: var(--c3); }
  .op b { text-align: right; font-weight: 500; font-variant-numeric: tabular-nums; }
  .ck { margin-top: auto; display: flex; align-items: center; gap: 12px; padding: 7px 10px; border-left: 2px solid var(--item); background: color-mix(in oklab, var(--item) 10%, transparent); font-family: var(--font-mono); font-size: 14px; color: var(--ink); }
  .ck em { font-style: normal; color: var(--item); font-weight: 700; }
  .side { display: grid; grid-template-rows: 430px 1fr; gap: 18px; min-height: 0; }
  .dl { padding: 16px 20px; display: flex; flex-direction: column; }
  .chips { display: flex; gap: 8px; }
  .chips span { font-family: var(--font-mono); font-size: 12px; padding: 2px 10px; border-radius: 999px; border: 1px solid #2f4c7a; color: var(--c2); }
  .dl .mi-swap-host { flex: 1; }
  .sw { display: flex; flex-direction: column; gap: 14px; }
  .sq { display: flex; align-items: center; gap: 12px; font-family: var(--font-mono); }
  .sq b { font-family: var(--font-display); font-style: italic; font-weight: 900; font-size: 30px; }
  .sq .qq { color: var(--muted); font-size: 15px; }
  .sg { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
  .sg .op { grid-template-columns: 24px 130px 1fr 44px; font-size: 14px; }
  .res { display: flex; flex-direction: column; gap: 8px; }
  .res pre { margin: 0 0 6px; padding: 12px 14px; min-height: 84px; white-space: pre-wrap; background: var(--code-bg); border: 1px solid var(--line); border-radius: 4px; font-family: var(--font-mono); font-size: 14px; line-height: 1.5; color: var(--code-ink); }
  .hc { font-family: var(--font-mono); font-size: 14px; color: var(--ink); opacity: clamp(.15, (var(--p, 0) - var(--k)) * 8, 1); }
  .hc em { font-style: normal; display: inline-grid; place-items: center; width: 18px; height: 18px; margin-right: 8px; border-radius: 50%; background: var(--c3); color: #0c0e11; font-size: 12px; font-weight: 700; }
  .low { display: grid; grid-template-columns: 1fr 340px; gap: 18px; min-height: 0; }
  .spend { padding: 16px 20px; display: flex; flex-direction: column; }
  .spend svg { flex: 1; width: 100%; overflow: visible; }
  .spend .base { fill: none; stroke: #6b737e; stroke-width: 2; stroke-dasharray: 5 6; }
  .spend .rt { fill: none; stroke: var(--c1); stroke-width: 3; }
  .spend .rt-a { fill: url(#rtg); stroke: none; }
  .spend text { font-family: var(--font-mono); font-size: 14px; fill: var(--muted); }
  .spend text.v { fill: var(--ink); font-weight: 700; }
  .spend text.p { fill: var(--c1); font-weight: 700; }
  .lg { display: flex; gap: 22px; font-family: var(--font-mono); font-size: 13px; color: var(--muted); }
  .lg i { display: inline-block; width: 18px; height: 3px; margin-right: 8px; vertical-align: middle; background: var(--c1); }
  .lg i.d { background: repeating-linear-gradient(90deg, #6b737e 0 5px, transparent 5px 9px); }
  .mult { padding: 16px 20px; display: flex; flex-direction: column; }
  .mult .big { font-family: var(--font-display); font-weight: 900; font-size: 78px; line-height: 1; color: var(--c3); margin: 8px 0 2px; font-variant-numeric: tabular-nums; }
  .mult .cap { font-family: var(--font-mono); font-size: 13px; color: var(--muted); margin-bottom: 10px; }
  .mr { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid var(--line); font-family: var(--font-mono); font-size: 14px; color: var(--muted); }
  .mr b { color: var(--item, var(--ink)); font-variant-numeric: tabular-nums; }
  .band { height: 34px; overflow: hidden; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); font-family: var(--font-mono); font-size: 14px; color: var(--muted); margin: 0 calc(var(--pad) * -1); }
  .band div { display: flex; width: max-content; line-height: 34px; white-space: nowrap; translate: calc(var(--phase) * -50%) 0; }
  .band span { padding: 0 22px; }
  .band span b { color: var(--c1); font-weight: 500; margin-right: 8px; }
  .band span i { font-style: normal; color: var(--c3); margin-left: 8px; }
</style>
<script>
window.MotionSetup = (M) => {
  const cyc = document.querySelector('[data-cycle="dec"]');
  const feed = document.querySelector(".feed");
  const N = 6, pitch = 214;
  const q = (s) => document.querySelector(s);
  const mult = q("#mult"), dn = q("#dn"), sp = q("#sp"), st = q("#st"), dk = q("#dk"), spk = q("#spk");
  M.on(() => {
    const p = parseFloat(cyc.style.getPropertyValue("--cycle-p")) || 0;
    const x = p * N, i = Math.floor(x), f = x - i;
    const e = M.ease.inOut(Math.min(1, Math.max(0, (f - 0.82) / 0.18)));
    feed.style.setProperty("--scroll", -(i + e) * pitch + "px");
    mult.textContent = "×" + (6.1 + p * 2.3).toFixed(1);
    const d = 97 + Math.floor(p * 18);
    dn.textContent = d; dk.textContent = d;
    st.textContent = 12 + Math.floor(p * 6);
    const s = "$" + (0.98 + p * 0.06).toFixed(2);
    sp.textContent = s; spk.textContent = s;
  });
};
</script>
</head>
<body data-canvas="landscape" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="5">
<main class="mi-page">
  <header class="hd">
    <div>
      <h1 class="mi-title"><em>Router</em> + agent run</h1>
      <div class="mi-sub">every fork becomes a typed decision <span class="sep">&gt;</span> the large model only writes</div>
    </div>
    <div class="kpis">
      <div class="kpi"><div class="mi-label">Steps</div><b id="st">12</b></div>
      <div class="kpi" style="--item:var(--c4)"><div class="mi-label">Large calls</div><b>5</b></div>
      <div class="kpi" style="--item:var(--c1)"><div class="mi-label">Decisions</div><b id="dk">97</b></div>
      <div class="kpi" style="--item:var(--c3)"><div class="mi-label">Spend</div><b id="spk">$0.98</b></div>
    </div>
  </header>

  <section class="main mi-body" data-cycle="dec" data-step="2" data-offset="-1.6" data-sfx="blip" data-accent data-master>
    <div class="mi-card run">
      <div class="ph"><h3>Agent run</h3><span class="mi-label">6 forks &middot; 1 large call per write</span></div>
      <div class="view"><div class="feed">
      <div class="dc" data-item="dec" data-index="0" data-color="var(--c1)">
        <div class="dq"><span class="tag">router</span><span class="qq">which file owns the refund bug?</span><span class="pick">&rarr; billing/refund.ts</span><span class="ms">3 ms</span></div>
        <div class="ops"><div class="op win"><span class="n">1</span><span class="on">billing/refund.ts</span><span class="mi-bar"><i data-bar="0.91"></i></span><b>0.91</b></div><div class="op"><span class="n">2</span><span class="on">api/orders.ts</span><span class="mi-bar"><i data-bar="0.06"></i></span><b>0.06</b></div><div class="op"><span class="n">3</span><span class="on">abstain</span><span class="mi-bar"><i data-bar="0.03"></i></span><b>0.03</b></div></div>
        <div class="ck" style="--item:var(--c3)"><span class="tag">check</span>grep refund handler <em>&#10003;</em> 3 hits &middot; 0.4 s</div>
      </div>
      <div class="dc" data-item="dec" data-index="1" data-color="var(--c1)">
        <div class="dq"><span class="tag">router</span><span class="qq">which model writes the patch?</span><span class="pick">&rarr; small</span><span class="ms">4 ms</span></div>
        <div class="ops"><div class="op win"><span class="n">1</span><span class="on">small</span><span class="mi-bar"><i data-bar="0.88"></i></span><b>0.88</b></div><div class="op"><span class="n">2</span><span class="on">medium</span><span class="mi-bar"><i data-bar="0.09"></i></span><b>0.09</b></div><div class="op"><span class="n">3</span><span class="on">large</span><span class="mi-bar"><i data-bar="0.03"></i></span><b>0.03</b></div></div>
        <div class="ck" style="--item:var(--c3)"><span class="tag">check</span>type_check <em>&#10003;</em> 0 errors &middot; 0.8 s</div>
      </div>
      <div class="dc" data-item="dec" data-index="2" data-color="var(--c1)">
        <div class="dq"><span class="tag">router</span><span class="qq">which tests to run?</span><span class="pick">&rarr; tests/billing/*</span><span class="ms">5 ms</span></div>
        <div class="ops"><div class="op win"><span class="n">1</span><span class="on">tests/billing/*</span><span class="mi-bar"><i data-bar="0.93"></i></span><b>0.93</b></div><div class="op"><span class="n">2</span><span class="on">full suite</span><span class="mi-bar"><i data-bar="0.05"></i></span><b>0.05</b></div><div class="op"><span class="n">3</span><span class="on">none</span><span class="mi-bar"><i data-bar="0.02"></i></span><b>0.02</b></div></div>
        <div class="ck" style="--item:var(--c3)"><span class="tag">check</span>run tests/billing <em>&#10003;</em> 18 passed &middot; 1.9 s</div>
      </div>
      <div class="dc" data-item="dec" data-index="3" data-color="var(--c1)">
        <div class="dq"><span class="tag">router</span><span class="qq">safe to run the migration?</span><span class="pick">&rarr; ask human</span><span class="ms">3 ms</span></div>
        <div class="ops"><div class="op win"><span class="n">1</span><span class="on">ask human</span><span class="mi-bar"><i data-bar="0.84"></i></span><b>0.84</b></div><div class="op"><span class="n">2</span><span class="on">allow</span><span class="mi-bar"><i data-bar="0.12"></i></span><b>0.12</b></div><div class="op"><span class="n">3</span><span class="on">block</span><span class="mi-bar"><i data-bar="0.04"></i></span><b>0.04</b></div></div>
        <div class="ck" style="--item:var(--c4)"><span class="tag">check</span>sent to you <em>&#10003;</em> approved &middot; 41 s</div>
      </div>
      <div class="dc" data-item="dec" data-index="4" data-color="var(--c1)">
        <div class="dq"><span class="tag">router</span><span class="qq">who reviews edge cases?</span><span class="pick">&rarr; medium</span><span class="ms">4 ms</span></div>
        <div class="ops"><div class="op win"><span class="n">1</span><span class="on">medium</span><span class="mi-bar"><i data-bar="0.81"></i></span><b>0.81</b></div><div class="op"><span class="n">2</span><span class="on">small</span><span class="mi-bar"><i data-bar="0.14"></i></span><b>0.14</b></div><div class="op"><span class="n">3</span><span class="on">abstain</span><span class="mi-bar"><i data-bar="0.05"></i></span><b>0.05</b></div></div>
        <div class="ck" style="--item:var(--c3)"><span class="tag">check</span>review <em>&#10003;</em> 2 notes applied &middot; 3.1 s</div>
      </div>
      <div class="dc" data-item="dec" data-index="5" data-color="var(--c1)">
        <div class="dq"><span class="tag">router</span><span class="qq">continue or stop?</span><span class="pick">&rarr; stop</span><span class="ms">5 ms</span></div>
        <div class="ops"><div class="op win"><span class="n">1</span><span class="on">stop</span><span class="mi-bar"><i data-bar="0.95"></i></span><b>0.95</b></div><div class="op"><span class="n">2</span><span class="on">continue</span><span class="mi-bar"><i data-bar="0.04"></i></span><b>0.04</b></div><div class="op"><span class="n">3</span><span class="on">abstain</span><span class="mi-bar"><i data-bar="0.01"></i></span><b>0.01</b></div></div>
        <div class="ck" style="--item:var(--c3)"><span class="tag">check</span>done <em>&#10003;</em> PR opened &middot; 1.2 s</div>
      </div>
      <div class="dc" data-item="dec" data-index="0" data-color="var(--c1)" aria-hidden="true">
        <div class="dq"><span class="tag">router</span><span class="qq">which file owns the refund bug?</span><span class="pick">&rarr; billing/refund.ts</span><span class="ms">3 ms</span></div>
        <div class="ops"><div class="op win"><span class="n">1</span><span class="on">billing/refund.ts</span><span class="mi-bar"><i data-bar="0.91"></i></span><b>0.91</b></div><div class="op"><span class="n">2</span><span class="on">api/orders.ts</span><span class="mi-bar"><i data-bar="0.06"></i></span><b>0.06</b></div><div class="op"><span class="n">3</span><span class="on">abstain</span><span class="mi-bar"><i data-bar="0.03"></i></span><b>0.03</b></div></div>
        <div class="ck" style="--item:var(--c3)"><span class="tag">check</span>grep refund handler <em>&#10003;</em> 3 hits &middot; 0.4 s</div>
      </div>
      <div class="dc" data-item="dec" data-index="1" data-color="var(--c1)" aria-hidden="true">
        <div class="dq"><span class="tag">router</span><span class="qq">which model writes the patch?</span><span class="pick">&rarr; small</span><span class="ms">4 ms</span></div>
        <div class="ops"><div class="op win"><span class="n">1</span><span class="on">small</span><span class="mi-bar"><i data-bar="0.88"></i></span><b>0.88</b></div><div class="op"><span class="n">2</span><span class="on">medium</span><span class="mi-bar"><i data-bar="0.09"></i></span><b>0.09</b></div><div class="op"><span class="n">3</span><span class="on">large</span><span class="mi-bar"><i data-bar="0.03"></i></span><b>0.03</b></div></div>
        <div class="ck" style="--item:var(--c3)"><span class="tag">check</span>type_check <em>&#10003;</em> 0 errors &middot; 0.8 s</div>
      </div>
      <div class="dc" data-item="dec" data-index="2" data-color="var(--c1)" aria-hidden="true">
        <div class="dq"><span class="tag">router</span><span class="qq">which tests to run?</span><span class="pick">&rarr; tests/billing/*</span><span class="ms">5 ms</span></div>
        <div class="ops"><div class="op win"><span class="n">1</span><span class="on">tests/billing/*</span><span class="mi-bar"><i data-bar="0.93"></i></span><b>0.93</b></div><div class="op"><span class="n">2</span><span class="on">full suite</span><span class="mi-bar"><i data-bar="0.05"></i></span><b>0.05</b></div><div class="op"><span class="n">3</span><span class="on">none</span><span class="mi-bar"><i data-bar="0.02"></i></span><b>0.02</b></div></div>
        <div class="ck" style="--item:var(--c3)"><span class="tag">check</span>run tests/billing <em>&#10003;</em> 18 passed &middot; 1.9 s</div>
      </div>
      </div></div>
    </div>
    <div class="side">
      <div class="mi-card dl">
        <div class="ph"><h3>Decision layer</h3><div class="chips"><span>options</span><span>score</span><span>typed</span><span>checked</span></div></div>
        <div class="mi-swap-host">
          <div class="mi-swap sw" data-item="dec" data-index="0">
            <div class="sq"><b>Decision #41</b><span class="tag">route</span><span class="qq">which file owns the refund bug?</span></div>
            <div class="sg"><div class="ops"><div class="op win"><span class="n">1</span><span class="on">billing/refund.ts</span><span class="mi-bar"><i data-bar="0.91" data-item="dec" data-index="0" data-dur="0.8"></i></span><b>0.91</b></div><div class="op"><span class="n">2</span><span class="on">api/orders.ts</span><span class="mi-bar"><i data-bar="0.06" data-item="dec" data-index="0" data-dur="0.8"></i></span><b>0.06</b></div><div class="op"><span class="n">3</span><span class="on">abstain</span><span class="mi-bar"><i data-bar="0.03" data-item="dec" data-index="0" data-dur="0.8"></i></span><b>0.03</b></div></div>
              <div class="res"><div class="mi-label">typed result</div><pre data-type data-item="dec" data-index="0" data-dur="0.9">{ "kind": "route", "choice": "billing/refund.ts", "p": 0.91, "latency_ms": 3 }</pre>
                <div class="mi-label">host checks</div>
                <div class="hc" style="--k:.45"><em>&#10003;</em> choice in allowed set</div>
                <div class="hc" style="--k:.6"><em>&#10003;</em> schema valid</div>
                <div class="hc" style="--k:.75"><em>&#10003;</em> no large-model call needed</div></div></div>
          </div>
          <div class="mi-swap sw" data-item="dec" data-index="1">
            <div class="sq"><b>Decision #42</b><span class="tag">model</span><span class="qq">which model writes the patch?</span></div>
            <div class="sg"><div class="ops"><div class="op win"><span class="n">1</span><span class="on">small</span><span class="mi-bar"><i data-bar="0.88" data-item="dec" data-index="1" data-dur="0.8"></i></span><b>0.88</b></div><div class="op"><span class="n">2</span><span class="on">medium</span><span class="mi-bar"><i data-bar="0.09" data-item="dec" data-index="1" data-dur="0.8"></i></span><b>0.09</b></div><div class="op"><span class="n">3</span><span class="on">large</span><span class="mi-bar"><i data-bar="0.03" data-item="dec" data-index="1" data-dur="0.8"></i></span><b>0.03</b></div></div>
              <div class="res"><div class="mi-label">typed result</div><pre data-type data-item="dec" data-index="1" data-dur="0.9">{ "kind": "model", "choice": "small", "p": 0.88, "latency_ms": 4 }</pre>
                <div class="mi-label">host checks</div>
                <div class="hc" style="--k:.45"><em>&#10003;</em> choice in allowed set</div>
                <div class="hc" style="--k:.6"><em>&#10003;</em> schema valid</div>
                <div class="hc" style="--k:.75"><em>&#10003;</em> no large-model call needed</div></div></div>
          </div>
          <div class="mi-swap sw" data-item="dec" data-index="2">
            <div class="sq"><b>Decision #43</b><span class="tag">tests</span><span class="qq">which tests to run?</span></div>
            <div class="sg"><div class="ops"><div class="op win"><span class="n">1</span><span class="on">tests/billing/*</span><span class="mi-bar"><i data-bar="0.93" data-item="dec" data-index="2" data-dur="0.8"></i></span><b>0.93</b></div><div class="op"><span class="n">2</span><span class="on">full suite</span><span class="mi-bar"><i data-bar="0.05" data-item="dec" data-index="2" data-dur="0.8"></i></span><b>0.05</b></div><div class="op"><span class="n">3</span><span class="on">none</span><span class="mi-bar"><i data-bar="0.02" data-item="dec" data-index="2" data-dur="0.8"></i></span><b>0.02</b></div></div>
              <div class="res"><div class="mi-label">typed result</div><pre data-type data-item="dec" data-index="2" data-dur="0.9">{ "kind": "tests", "choice": "tests/billing/*", "p": 0.93, "latency_ms": 5 }</pre>
                <div class="mi-label">host checks</div>
                <div class="hc" style="--k:.45"><em>&#10003;</em> choice in allowed set</div>
                <div class="hc" style="--k:.6"><em>&#10003;</em> schema valid</div>
                <div class="hc" style="--k:.75"><em>&#10003;</em> no large-model call needed</div></div></div>
          </div>
          <div class="mi-swap sw" data-item="dec" data-index="3">
            <div class="sq"><b>Decision #44</b><span class="tag">gate</span><span class="qq">safe to run the migration?</span></div>
            <div class="sg"><div class="ops"><div class="op win"><span class="n">1</span><span class="on">ask human</span><span class="mi-bar"><i data-bar="0.84" data-item="dec" data-index="3" data-dur="0.8"></i></span><b>0.84</b></div><div class="op"><span class="n">2</span><span class="on">allow</span><span class="mi-bar"><i data-bar="0.12" data-item="dec" data-index="3" data-dur="0.8"></i></span><b>0.12</b></div><div class="op"><span class="n">3</span><span class="on">block</span><span class="mi-bar"><i data-bar="0.04" data-item="dec" data-index="3" data-dur="0.8"></i></span><b>0.04</b></div></div>
              <div class="res"><div class="mi-label">typed result</div><pre data-type data-item="dec" data-index="3" data-dur="0.9">{ "kind": "gate", "choice": "ask human", "p": 0.84, "latency_ms": 3 }</pre>
                <div class="mi-label">host checks</div>
                <div class="hc" style="--k:.45"><em>&#10003;</em> choice in allowed set</div>
                <div class="hc" style="--k:.6"><em>&#10003;</em> schema valid</div>
                <div class="hc" style="--k:.75"><em>&#10003;</em> escalated to a human</div></div></div>
          </div>
          <div class="mi-swap sw" data-item="dec" data-index="4">
            <div class="sq"><b>Decision #45</b><span class="tag">model</span><span class="qq">who reviews edge cases?</span></div>
            <div class="sg"><div class="ops"><div class="op win"><span class="n">1</span><span class="on">medium</span><span class="mi-bar"><i data-bar="0.81" data-item="dec" data-index="4" data-dur="0.8"></i></span><b>0.81</b></div><div class="op"><span class="n">2</span><span class="on">small</span><span class="mi-bar"><i data-bar="0.14" data-item="dec" data-index="4" data-dur="0.8"></i></span><b>0.14</b></div><div class="op"><span class="n">3</span><span class="on">abstain</span><span class="mi-bar"><i data-bar="0.05" data-item="dec" data-index="4" data-dur="0.8"></i></span><b>0.05</b></div></div>
              <div class="res"><div class="mi-label">typed result</div><pre data-type data-item="dec" data-index="4" data-dur="0.9">{ "kind": "model", "choice": "medium", "p": 0.81, "latency_ms": 4 }</pre>
                <div class="mi-label">host checks</div>
                <div class="hc" style="--k:.45"><em>&#10003;</em> choice in allowed set</div>
                <div class="hc" style="--k:.6"><em>&#10003;</em> schema valid</div>
                <div class="hc" style="--k:.75"><em>&#10003;</em> no large-model call needed</div></div></div>
          </div>
          <div class="mi-swap sw" data-item="dec" data-index="5">
            <div class="sq"><b>Decision #46</b><span class="tag">stop</span><span class="qq">continue or stop?</span></div>
            <div class="sg"><div class="ops"><div class="op win"><span class="n">1</span><span class="on">stop</span><span class="mi-bar"><i data-bar="0.95" data-item="dec" data-index="5" data-dur="0.8"></i></span><b>0.95</b></div><div class="op"><span class="n">2</span><span class="on">continue</span><span class="mi-bar"><i data-bar="0.04" data-item="dec" data-index="5" data-dur="0.8"></i></span><b>0.04</b></div><div class="op"><span class="n">3</span><span class="on">abstain</span><span class="mi-bar"><i data-bar="0.01" data-item="dec" data-index="5" data-dur="0.8"></i></span><b>0.01</b></div></div>
              <div class="res"><div class="mi-label">typed result</div><pre data-type data-item="dec" data-index="5" data-dur="0.9">{ "kind": "stop", "choice": "stop", "p": 0.95, "latency_ms": 5 }</pre>
                <div class="mi-label">host checks</div>
                <div class="hc" style="--k:.45"><em>&#10003;</em> choice in allowed set</div>
                <div class="hc" style="--k:.6"><em>&#10003;</em> schema valid</div>
                <div class="hc" style="--k:.75"><em>&#10003;</em> no large-model call needed</div></div></div>
          </div>
        </div>
      </div>
      <div class="low">
        <div class="mi-card spend">
          <div class="ph"><h3>Spend</h3><div class="lg"><span><i class="d"></i>large model only</span><span><i></i>large model + router</span></div></div>
          <svg viewBox="0 0 560 230" preserveAspectRatio="none">
            <defs><linearGradient id="rtg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff2d6f" stop-opacity=".28"/><stop offset="1" stop-color="#ff2d6f" stop-opacity="0"/></linearGradient></defs>
            <path class="base" d="M0 220 L60 200 L120 178 L180 150 L240 128 L300 104 L360 80 L420 62 L480 40 L540 22"></path>
            <path class="rt-a" d="M0 220 L60 216 L120 213 L180 208 L240 205 L300 201 L360 198 L420 194 L480 192 L540 188 L540 230 L0 230 Z"></path>
            <path class="rt mi-edge" d="M0 220 L60 216 L120 213 L180 208 L240 205 L300 201 L360 198 L420 194 L480 192 L540 188" data-packets="1" data-period="12" data-r="6"></path>
            <text class="v" x="470" y="16">$7.48</text>
            <text class="p" x="478" y="176">$1.03</text>
            <text x="0" y="16">vs large-model only (est.)</text>
          </svg>
        </div>
        <div class="mi-card mult">
          <div class="mi-label">Cheaper than large-only</div>
          <div class="big" id="mult">&times;6.1</div>
          <div class="cap">same task, same result</div>
          <div class="mr" style="--item:var(--c4)"><span>large-model calls</span><b>5</b></div>
          <div class="mr" style="--item:var(--c1)"><span>router decisions</span><b id="dn">97</b></div>
          <div class="mr"><span>tokens</span><b>24.6k</b></div>
          <div class="mr" style="--item:var(--c3)"><span>spend</span><b id="sp">$0.98</b></div>
        </div>
      </div>
    </div>
  </section>

  <div class="band"><div data-phase="24"><span><b>router</b> which file owns the refund bug? &rarr; billing/refund.ts <i>p=0.91</i></span> <span><b>router</b> which model writes the patch? &rarr; small <i>p=0.88</i></span> <span><b>router</b> which tests to run? &rarr; tests/billing/* <i>p=0.93</i></span> <span><b>router</b> safe to run the migration? &rarr; ask human <i>p=0.84</i></span> <span><b>router</b> who reviews edge cases? &rarr; medium <i>p=0.81</i></span> <span><b>router</b> continue or stop? &rarr; stop <i>p=0.95</i></span> <span><b>router</b> which file owns the refund bug? &rarr; billing/refund.ts <i>p=0.91</i></span> <span><b>router</b> which model writes the patch? &rarr; small <i>p=0.88</i></span> <span><b>router</b> which tests to run? &rarr; tests/billing/* <i>p=0.93</i></span> <span><b>router</b> safe to run the migration? &rarr; ask human <i>p=0.84</i></span> <span><b>router</b> who reviews edge cases? &rarr; medium <i>p=0.81</i></span> <span><b>router</b> continue or stop? &rarr; stop <i>p=0.95</i></span></div></div>
  <footer class="mi-foot"><span>AGENT RUN &middot; 6 FORKS</span><span class="path">ASK &gt; SCORE &gt; CHECK &gt; ACT</span><span class="mark">decision feed</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Decision count**: 4-8. Keep count × step between 12 and 16 s per cycle; set `N` in `MotionSetup` to the count and
  clone the first 3 cards (with their `data-index`) at the end of the feed.
- **Card height**: if you add a fourth option row, raise `.dc` height and `pitch` together (pitch = height + gap).
- **Check colours**: `--item` on `.ck` = `--c3` for pass, `--c4` for "sent to a human", `--c1` for a failed check.
- **Numbers**: the multiplier, decision count and spend come from `MotionSetup`; change the start value and range
  there. The static chart labels (`$7.48`, `$1.03`) should match the end of those ranges.
- **Portrait**: stack `.side` under `.run`, show 2 cards in `.view`, and drop the spend chart (keep `.mult`).
- **Pitfalls**: the swap panels cross-fade for 0.25 s at each step, so keep panel text short. Do not put `data-item`
  on the feed bars; queued cards would show empty bars and break the complete first frame.
