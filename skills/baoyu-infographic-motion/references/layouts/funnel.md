# funnel

Volume that narrows stage by stage: how many enter, how many survive each step, where the biggest leak is.

## Use when / Avoid when

- **Use when**: marketing and sales funnels, hiring pipelines, filtering (candidates → shortlist → hire), data cleaning passes, any conversion story with counts.
- **Avoid when**: stages do not shrink (use `linear-progression`), or you compare parallel groups rather than a sequence (use `comparison-matrix`).

## Structure

- **Funnel column** (600 px): 3–6 trapezoids made with `clip-path` from one `--i` variable, each with stage label and count.
- **Rate cards** (right, one per stage, same row): conversion rate, one-line note, bar of the rate.
- **Packet lanes**: two dashed vertical lines inside the narrowest stage width, each with falling packets.
- **Detail row**: swap panel with the stage count counting up plus a pinned live sparkline, and a ring gauge for end-to-end conversion.

## Motion recipe

- **Master cycle** `main`, `data-step="1.6"`, top → bottom. The stage shape and its rate card share `data-index`; `data-accent` recolours rule, title word and swap text.
- **Stage highlight**: shape tint rises with `--on` and stays stronger with `--done`; the rate card border glows.
- **Count-up**: each swap uses `data-count` with `data-group`, so 120,400 counts up during its own step. The funnel labels stay static, so frame 0 is complete.
- **Packets falling through**: two hand-drawn vertical paths with `data-packets` and different periods (3 s, 2.4 s) so the flow never looks mechanical. They sit above the shapes (`z-index: 1`) and below the text (`z-index: 2`).
- **Ambient**: ring gauge with `data-jitter`, sparkline, `data-ticker` band stats.
- **Sound**: `blip` per stage. Add `data-sfx="error"` on the leakiest stage item to stress it.
- **Length**: 5 × 1.6 s × 3 = 24 s.

## Skeleton

Portrait 1080×1350. Paste it over the `index.html` that `main.ts init` creates, then replace the content.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Where Signups Leak</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-body { display: flex; flex-direction: column; gap: 22px; }
  .funnel { position: relative; display: flex; flex-direction: column; gap: 10px; }
  .funnel .mi-svg { z-index: 1; }
  .level { display: grid; grid-template-columns: 600px 1fr; gap: 22px; height: 112px; }
  .stage { position: relative; display: grid; place-items: center; }
  .shape { position: absolute; inset: 0; z-index: 0; --k: 7%; clip-path: polygon(calc(var(--i) * var(--k)) 0, calc(100% - var(--i) * var(--k)) 0, calc(100% - (var(--i) + 1) * var(--k)) 100%, calc((var(--i) + 1) * var(--k)) 100%); background: color-mix(in oklab, var(--item) calc(16% + var(--on) * 30%), var(--panel)); }
  .txt { position: relative; z-index: 2; text-align: center; display: flex; flex-direction: column; gap: 2px; }
  .txt .mi-label { color: color-mix(in oklab, var(--ink) calc(55% + var(--on) * 45%), transparent); font-size: 12px; }
  .txt b { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 34px; line-height: 1; font-variant-numeric: tabular-nums; }
  .info { padding: 14px 18px; display: grid; grid-template-columns: 1fr auto; grid-template-rows: auto 1fr auto; column-gap: 12px; align-items: center; }
  .info .rate { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 34px; line-height: 1; color: var(--item); grid-row: 1 / 3; grid-column: 2; }
  .info small { font-family: var(--font-mono); font-size: 13px; color: var(--muted); }
  .info .mi-bar { grid-column: 1 / -1; height: 6px; }
  .info .mi-bar > i { width: calc(var(--r) * 100%); }
  .lane { stroke-dasharray: 3 7; opacity: 0.5; }
  .packet-lane .mi-packet { fill: var(--ink); opacity: 0.8; }
  .out { display: grid; grid-template-columns: 1.4fr 1fr; gap: 22px; flex: 1; }
  .out .mi-swap-host { min-height: 250px; }
  .spark { position: absolute; left: 22px; right: 22px; bottom: 18px; display: flex; flex-direction: column; gap: 6px; }
  .spark svg { width: 100%; height: 56px; border-top: 1px dashed var(--line); }
  .out .mi-swap { padding: 22px; display: flex; flex-direction: column; gap: 8px; }
  .big { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 64px; line-height: 0.95; color: var(--item); font-variant-numeric: tabular-nums; }
  .out p { font-size: 14px; line-height: 1.45; color: var(--muted); }
  .gauge { display: flex; align-items: center; gap: 22px; }
  .gauge .mi-ring { --size: 150px; }
  .gauge .v { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 48px; line-height: 1; color: var(--c2); }
</style>
</head>
<body data-canvas="portrait" data-cycles="3" data-sfx="soft" data-fps="30" data-poster="0.9">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">GROWTH / Q3 FUNNEL REVIEW / SELF-SERVE</span><span class="mi-meta">STAGE <span data-counter="main">01</span> / 05 &middot; 90-DAY COHORT</span></div>
    <h1 class="mi-title">Where signups <em>leak</em></h1>
    <div class="mi-sub"><span>VISIT</span><span class="sep">&gt;</span><span>SIGN UP</span><span class="sep">&gt;</span><span>ACTIVATE</span><span class="sep">&gt;</span><span>PAY</span><span class="sep">&gt;</span><span>STAY</span></div>
    <div class="mi-rule" data-progress="main"></div>
  </header>

  <section class="mi-body" data-cycle="main" data-step="1.6" data-sfx="blip" data-accent data-master>
    <div class="funnel">
      <svg class="mi-svg packet-lane">
        <path class="mi-edge lane" d="M215,6 L215,574" data-packets="5" data-period="3" data-r="4"></path>
        <path class="mi-edge lane" d="M385,6 L385,574" data-packets="4" data-period="2.4" data-r="4"></path>
      </svg>
      <div class="level">
        <div id="s1" class="stage" data-item="main" data-index="0" data-color="var(--c1)" style="--item: var(--c1)"><i class="shape" style="--i: 0"></i><div class="txt"><span class="mi-label">01 / VISITORS</span><b>120,400</b></div></div>
        <div class="mi-card info" data-item="main" data-index="0" style="--item: var(--c1); --r: 1"><span class="mi-label">TOP OF FUNNEL</span><span class="rate">100%</span><small>organic 61% / paid 39%</small><span class="mi-bar"><i></i></span></div>
      </div>
      <div class="level">
        <div id="s2" class="stage" data-item="main" data-index="1" data-color="var(--c2)" style="--item: var(--c2)"><i class="shape" style="--i: 1"></i><div class="txt"><span class="mi-label">02 / SIGNUPS</span><b>18,060</b></div></div>
        <div class="mi-card info" data-item="main" data-index="1" style="--item: var(--c2); --r: .15"><span class="mi-label">VISIT &rarr; SIGNUP</span><span class="rate">15.0%</span><small>102,340 bounced</small><span class="mi-bar"><i></i></span></div>
      </div>
      <div class="level">
        <div id="s3" class="stage" data-item="main" data-index="2" data-color="var(--c3)" style="--item: var(--c3)"><i class="shape" style="--i: 2"></i><div class="txt"><span class="mi-label">03 / ACTIVATED</span><b>7,224</b></div></div>
        <div class="mi-card info" data-item="main" data-index="2" style="--item: var(--c3); --r: .40"><span class="mi-label">SIGNUP &rarr; AHA</span><span class="rate">40.0%</span><small>first project in 24 h</small><span class="mi-bar"><i></i></span></div>
      </div>
      <div class="level">
        <div id="s4" class="stage" data-item="main" data-index="3" data-color="var(--c4)" style="--item: var(--c4)"><i class="shape" style="--i: 3"></i><div class="txt"><span class="mi-label">04 / PAID</span><b>1,806</b></div></div>
        <div class="mi-card info" data-item="main" data-index="3" style="--item: var(--c4); --r: .25"><span class="mi-label">TRIAL &rarr; PAID</span><span class="rate">25.0%</span><small>14-day trial, card at end</small><span class="mi-bar"><i></i></span></div>
      </div>
      <div class="level">
        <div id="s5" class="stage" data-item="main" data-index="4" data-color="var(--c5)" style="--item: var(--c5)"><i class="shape" style="--i: 4"></i><div class="txt"><span class="mi-label">05 / RETAINED</span><b>1,445</b></div></div>
        <div class="mi-card info" data-item="main" data-index="4" style="--item: var(--c5); --r: .80"><span class="mi-label">PAID &rarr; DAY 90</span><span class="rate">80.0%</span><small>361 churned</small><span class="mi-bar"><i></i></span></div>
      </div>
    </div>

    <div class="out">
      <div class="mi-card mi-swap-host">
        <div class="spark"><div class="mi-label" style="display:flex;justify-content:space-between"><span>DAILY SIGNUPS / 90 D</span><span class="acc">LIVE</span></div><svg viewBox="0 0 400 56" preserveAspectRatio="none" data-sparkline="40" data-waves="3"></svg></div>
        <div class="mi-swap" data-item="main" data-index="0" style="--item: var(--c1)"><span class="mi-label acc">STAGE 01 / VISITORS</span><span class="big" data-count="120400" data-group>120,400</span><p>Unique visitors in the cohort window. Pricing page is the top entry at 34 percent.</p></div>
        <div class="mi-swap" data-item="main" data-index="1" style="--item: var(--c2)"><span class="mi-label acc">STAGE 02 / SIGNUPS</span><span class="big" data-count="18060" data-group>18,060</span><p>Biggest leak: 85 percent leave before signup. SSO button lifted signups by 2.4 points.</p></div>
        <div class="mi-swap" data-item="main" data-index="2" style="--item: var(--c3)"><span class="mi-label acc">STAGE 03 / ACTIVATED</span><span class="big" data-count="7224" data-group>7,224</span><p>Activation means a first project with one invite. Templates cut time to aha by 40 percent.</p></div>
        <div class="mi-swap" data-item="main" data-index="3" style="--item: var(--c4)"><span class="mi-label acc">STAGE 04 / PAID</span><span class="big" data-count="1806" data-group>1,806</span><p>One in four trials convert. Usage-based nudges on day 10 add 3.1 points.</p></div>
        <div class="mi-swap" data-item="main" data-index="4" style="--item: var(--c5)"><span class="mi-label acc">STAGE 05 / RETAINED</span><span class="big" data-count="1445" data-group>1,445</span><p>Day-90 retention of paid accounts. Annual plans churn at a third of monthly.</p></div>
      </div>
      <div class="mi-card" style="display:flex;flex-direction:column;gap:14px">
        <span class="mi-label">END-TO-END CONVERSION</span>
        <div class="gauge"><div class="mi-ring" data-bar="0.62" data-jitter="0.03" style="--item: var(--c2)"></div><div><div class="v">1.2%</div><small class="mi-label">VISIT &rarr; DAY 90</small></div></div>
        <span class="mi-label" style="margin-top:auto">TARGET 1.5% BY Q4</span>
      </div>
    </div>
  </section>

  <section class="mi-band">
    <div class="mi-stat" style="--item: var(--c1)"><span class="mi-stat-v" data-ticker="120.4" data-jitter="0.6" data-decimals="1" data-suffix="K">120.4K</span><span class="mi-stat-l">Visitors / 90 days</span></div>
    <div class="mi-stat" style="--item: var(--c2)"><span class="mi-stat-v">15.0%</span><span class="mi-stat-l">Biggest leak: signup</span></div>
    <div class="mi-stat" style="--item: var(--c5)"><span class="mi-stat-v" data-ticker="84" data-jitter="1.5" data-prefix="$">$84</span><span class="mi-stat-l">Blended CAC</span></div>
  </section>

  <footer class="mi-foot"><span>SOURCE / PRODUCT ANALYTICS, Q3</span><span class="path">VISIT &gt; SIGNUP &gt; ACTIVATE &gt; PAY &gt; STAY</span><span class="mark">studio</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Item count**: add or remove `.level` rows and set `--i` 0…n−1. Tune `--k` (inset per stage, default 7%) so the last stage is still ≥ 180 px wide: `100% − 2·n·k ≥ 30%`. Shorten the packet paths to the new funnel height (`M215,6 L215,<height − 6>`).
- **Square**: 4 stages, drop the ring card. **Story**: 6 stages at 130 px each and a taller detail panel. **Landscape**: funnel left (800 px), rate cards and detail in a right column.
- **Horizontal funnel**: use a row of stages whose `clip-path` narrows in height, and horizontal packet paths.
- **Pitfalls**: `clip-path` hides borders and shadows, so the highlight must come from fill tint and the rate card. Keep packet lanes inside the narrowest stage; they are hand-drawn in funnel-column pixels. Do not `scale` the top stage: it would cross the page padding.
