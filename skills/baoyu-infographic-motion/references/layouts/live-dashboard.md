# live-dashboard

A mission-control dashboard: KPI tiles, a live chart with volume bars, ring gauges, a sine trace, an execution stream,
risk meters, a row of agent cards and an active-route bar: a running system with many live numbers.

## Use when / Avoid when

- **Use when**: an agent team at work, a trading or ops terminal, product metrics, a benchmark run, "what the system
  is doing right now" stories with 4 headline numbers and 4-6 actors.
- **Avoid when**: the message is a structure or a list (use a graph layout), or the numbers are static facts from a
  paper (a band on another layout is enough).

## Structure

- **KPI row**: 4 tiles (label, big live value, note).
- **Hero** (flex: 1, min 320 px): chart card (panel header with LIVE pill, big ticker, dashed plot with a sparkline
  and a ghost sine, 30 volume bars) + side column (3 ring gauges with latency line, sine trace card).
- **Middle**: execution stream table (header + 6 rows) + risk budget meters (6 bars).
- **Agents**: section label + 6 agent cards (avatar, name, sparkline, P&L) + active-route pill bar.
- **Footer** (no band; the KPI row carries the headline numbers).

## Motion recipe

- **Master cycle** `route`: 6 agents × 1 s = 6 s, `data-cycles="3"` (18 s, the 6 s master of the N01ennn
  references). Agent card top bar, tint and route pill share the index; `data-accent` recolours the chart line,
  volume bars and title.
- **Independent KPI clock** `kpi`: 4 tiles × 1.5 s = 6 s, `data-sfx="pop"` — highlights run out of step with the
  agents, like a real dashboard.
- **Stream rows** `rows`: 6 × 0.5 s = 3 s; the active row gets an accent wash.
- **Live data**: `data-ticker` with `data-jitter` on every number, `data-sparkline` (chart and agents),
  `data-sine`, `data-bar` + `data-jitter` on volume bars, rings and meters, `data-clock="mm:ss"` in the meta line,
  `data-progress="time"` on the rule.
- **Sound**: `tick` per agent, `pop` per KPI. `music` also fits (1 s beat).

## Skeleton

Portrait 1080×1350. `data-poster="0.5"`.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Six Agents One Shared Ledger</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-body { display: flex; flex-direction: column; gap: 14px; }
  .ph { display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 12px; letter-spacing: .08em; text-transform: var(--label-case); color: var(--muted); }
  .ph b { color: var(--ink); font-weight: 600; }
  .ph .live { display: inline-flex; gap: 6px; align-items: center; padding: 2px 8px; border: 1px solid var(--accent); border-radius: 999px; color: var(--accent); }
  .ph .live::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--accent); opacity: calc(.3 + var(--pulse) * .7); }
  .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .kpi { padding: 14px 16px; background: color-mix(in oklab, var(--item) calc(var(--on) * 12%), var(--panel)); }
  .kpi .v { display: block; font-family: var(--font-mono); font-size: 34px; font-weight: 600; letter-spacing: -.02em; color: var(--item); margin: 6px 0 2px; font-variant-numeric: tabular-nums; }
  .kpi small { font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
  .hero { display: grid; grid-template-columns: 1fr 300px; gap: 12px; flex: 1; min-height: 320px; }
  .chart { padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; }
  .big { display: flex; align-items: baseline; gap: 14px; font-family: var(--font-mono); }
  .big strong { font-size: 44px; font-weight: 600; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
  .big span { font-size: 14px; color: var(--c2); }
  .plot { position: relative; flex: 1; border-top: 1px dashed var(--line); border-bottom: 1px dashed var(--line);
    background-image: linear-gradient(var(--grid) 1px, transparent 1px); background-size: 100% 25%; }
  .plot svg { position: absolute; inset: 6px 0; width: 100%; height: calc(100% - 12px); }
  .plot .mi-line { stroke-width: 2.5; stroke: var(--accent); }
  .plot .ghost .mi-line { stroke: var(--muted); stroke-width: 1.2; stroke-dasharray: 4 4; }
  .vol { display: flex; gap: 3px; align-items: end; height: 46px; }
  .vol i { flex: 1; height: calc(var(--value) * 100%); background: color-mix(in oklab, var(--accent) 55%, var(--line)); }
  .side { display: flex; flex-direction: column; gap: 12px; }
  .gauges { flex: 1; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
  .grow { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; text-align: center; font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
  .grow .mi-ring { --size: 72px; margin: 0 auto 6px; }
  .grow b { display: block; color: var(--ink); font-size: 15px; font-weight: 600; }
  .lat { margin-top: auto; display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid var(--line); font-family: var(--font-mono); font-size: 12px; color: var(--muted); }
  .lat b { color: var(--ink); font-weight: 600; }
  .wave { padding: 12px 16px; }
  .wave svg { width: 100%; height: 56px; display: block; margin-top: 6px; }
  .wave .mi-line { stroke: var(--c3); }
  .mid { display: grid; grid-template-columns: 1fr 300px; gap: 12px; }
  .stream { padding: 12px 14px; }
  .tr { display: grid; grid-template-columns: 78px 70px 1fr 80px; gap: 10px; align-items: center; height: 32px; padding: 0 8px; border-radius: 5px; font-family: var(--font-mono); font-size: 13px;
    background: color-mix(in oklab, var(--accent) calc(var(--on) * 16%), transparent); }
  .tr.hd { color: var(--muted); font-size: 11px; letter-spacing: .08em; height: 22px; background: none; }
  .tr span:first-child { color: var(--muted); }
  .tr b { font-weight: 600; color: var(--item, var(--ink)); }
  .tr em { font-style: normal; text-align: right; color: var(--c2); }
  .tr em.neg { color: var(--c5); }
  .meters { padding: 12px 16px; display: flex; flex-direction: column; gap: 9px; font-family: var(--font-mono); font-size: 12px; }
  .meters div { display: grid; grid-template-columns: 70px 1fr 40px; gap: 8px; align-items: center; color: var(--muted); }
  .meters .mi-bar { height: 7px; }
  .meters b { text-align: right; color: var(--ink); font-weight: 500; }
  .agents { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
  .ag { position: relative; padding: 12px 12px 10px; display: flex; flex-direction: column; gap: 4px; background: color-mix(in oklab, var(--item) calc(var(--on) * 10%), var(--panel)); }
  .ag::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 4px; border-radius: var(--radius) var(--radius) 0 0; background: var(--item); opacity: calc(.15 + var(--on) * .85); }
  .ag .id { display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 11px; color: var(--muted); }
  .ag .av { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; font-family: var(--font-mono); font-size: 12px; font-weight: 700; color: var(--item); border: 1.5px solid var(--item); }
  .ag b { font-family: var(--font-display); font-size: 17px; text-transform: var(--title-case); }
  .ag svg { width: 100%; height: 34px; }
  .ag svg .mi-line { stroke: var(--item); stroke-width: 1.5; }
  .ag .d { font-family: var(--font-mono); font-size: 15px; font-weight: 600; color: var(--c2); }
  .ag .d.neg { color: var(--c5); }
  .route { display: grid; grid-template-columns: auto repeat(6, 1fr) auto; gap: 8px; align-items: center; font-family: var(--font-mono); font-size: 12px; letter-spacing: .08em; }
  .route .r { text-align: center; padding: 6px 0; border-radius: 999px; border: 1px solid color-mix(in oklab, var(--item) calc(30% + var(--on) * 70%), var(--line));
    background: color-mix(in oklab, var(--item) calc(var(--on) * 100%), transparent); color: color-mix(in oklab, var(--bg) calc(var(--on) * 100%), var(--muted)); }
</style>
</head>
<body data-canvas="portrait" data-cycles="3" data-sfx="soft" data-fps="30" data-poster="0.5">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">VORTEX TERMINAL / SIX AGENTS / ONE SHARED SYSTEM</span><span class="mi-meta">UTC 18:<span data-clock="mm:ss"></span> &middot; ROUTE <span data-counter="route">01</span> / 06</span></div>
    <h1 class="mi-title">Six agents, <em>one ledger</em></h1>
    <div class="mi-sub"><span>SCAN</span><span class="sep">&gt;</span><span>PRICE</span><span class="sep">&gt;</span><span>ROUTE</span><span class="sep">&gt;</span><span>SETTLE</span></div>
    <div class="mi-rule" data-progress="time"></div>
  </header>

  <section class="mi-body" data-cycle="route" data-step="1" data-sfx="tick" data-accent data-master>
    <div class="kpis" data-cycle="kpi" data-step="1.5" data-sfx="pop">
      <div class="mi-card kpi" data-item style="--item:var(--c1)"><span class="mi-label">SYSTEM BALANCE</span><span class="v" data-ticker="60047.84" data-jitter="180" data-decimals="2" data-prefix="$" data-group>$60,047.84</span><small>initial $50,000</small></div>
      <div class="mi-card kpi" data-item style="--item:var(--c2)"><span class="mi-label">COMBINED P&amp;L</span><span class="v" data-ticker="10047" data-jitter="160" data-prefix="+$" data-group>+$10,047</span><small>+20.1% this session</small></div>
      <div class="mi-card kpi" data-item style="--item:var(--c3)"><span class="mi-label">WIN RATE</span><span class="v" data-ticker="64.3" data-jitter="0.6" data-decimals="1" data-suffix="%">64.3%</span><small>1,562 closed trades</small></div>
      <div class="mi-card kpi" data-item style="--item:var(--c4)"><span class="mi-label">SIGNALS</span><span class="v" data-ticker="113732" data-jitter="900" data-group>113,732</span><small>1,031 events / sec</small></div>
    </div>

    <div class="hero">
      <div class="mi-card chart">
        <div class="ph"><span><b>01</b> THROUGHPUT / USD</span><span class="live" data-pulse="1">LIVE TAPE</span></div>
        <div class="big"><strong data-ticker="63935.77" data-jitter="140" data-decimals="2" data-group>63,935.77</strong><span>+3.42% &middot; H 63,948 &middot; L 63,899</span></div>
        <div class="plot">
          <svg class="ghost" viewBox="0 0 600 160" preserveAspectRatio="none" data-sine data-waves="3" data-speed="3"></svg>
          <svg viewBox="0 0 600 160" preserveAspectRatio="none" data-sparkline="60" data-waves="2" data-speed="4"></svg>
        </div>
        <div class="vol">
          <i data-bar=".5" data-jitter=".3"></i><i data-bar=".7" data-jitter=".3"></i><i data-bar=".4" data-jitter=".3"></i><i data-bar=".8" data-jitter=".2"></i><i data-bar=".3" data-jitter=".3"></i><i data-bar=".6" data-jitter=".3"></i><i data-bar=".9" data-jitter=".1"></i><i data-bar=".5" data-jitter=".3"></i><i data-bar=".4" data-jitter=".3"></i><i data-bar=".7" data-jitter=".2"></i><i data-bar=".6" data-jitter=".3"></i><i data-bar=".3" data-jitter=".3"></i><i data-bar=".8" data-jitter=".2"></i><i data-bar=".5" data-jitter=".3"></i><i data-bar=".7" data-jitter=".3"></i><i data-bar=".4" data-jitter=".3"></i><i data-bar=".6" data-jitter=".3"></i><i data-bar=".9" data-jitter=".1"></i><i data-bar=".5" data-jitter=".3"></i><i data-bar=".3" data-jitter=".3"></i><i data-bar=".7" data-jitter=".2"></i><i data-bar=".6" data-jitter=".3"></i><i data-bar=".4" data-jitter=".3"></i><i data-bar=".8" data-jitter=".2"></i><i data-bar=".5" data-jitter=".3"></i><i data-bar=".6" data-jitter=".3"></i><i data-bar=".7" data-jitter=".3"></i><i data-bar=".4" data-jitter=".3"></i><i data-bar=".9" data-jitter=".1"></i><i data-bar=".5" data-jitter=".3"></i>
        </div>
      </div>
      <div class="side">
        <div class="mi-card gauges">
          <div class="ph"><span><b>02</b> LOAD</span><span>3 POOLS</span></div>
          <div class="grow">
            <div><div class="mi-ring" data-bar=".72" data-jitter=".1" style="--item:var(--c1)"></div><b data-ticker="72" data-jitter="6" data-suffix="%">72%</b>CPU</div>
            <div><div class="mi-ring" data-bar=".48" data-jitter=".12" style="--item:var(--c2)"></div><b data-ticker="48" data-jitter="7" data-suffix="%">48%</b>QUEUE</div>
            <div><div class="mi-ring" data-bar=".86" data-jitter=".06" style="--item:var(--c3)"></div><b data-ticker="86" data-jitter="4" data-suffix="%">86%</b>CACHE</div>
          </div>
          <div class="lat"><span>P50 <b data-ticker="41" data-jitter="3" data-suffix="ms">41ms</b></span><span>P95 <b data-ticker="118" data-jitter="9" data-suffix="ms">118ms</b></span><span>ERR <b data-ticker="0.2" data-jitter="0.08" data-decimals="1" data-suffix="%">0.2%</b></span></div>
        </div>
        <div class="mi-card wave">
          <div class="ph"><span><b>03</b> HESITATION TRACE</span><span data-ticker="0.82" data-jitter="0.05" data-decimals="2">0.82</span></div>
          <svg viewBox="0 0 260 56" preserveAspectRatio="none" data-sine data-waves="4" data-speed="5"></svg>
        </div>
      </div>
    </div>

    <div class="mid">
      <div class="mi-card stream">
        <div class="ph" style="margin-bottom:6px"><span><b>04</b> EXECUTION STREAM</span><span><span data-ticker="1561" data-jitter="12" data-group>1,561</span> FILLS</span></div>
        <div class="tr hd"><span>TIME</span><span>AGENT</span><span>EVENT</span><span style="text-align:right">P&amp;L</span></div>
        <div data-cycle="rows" data-step="0.5">
          <div class="tr" data-item><span>18:35:31</span><b style="--item:var(--c1)">NOVA</b><span>risk passed</span><em>+$41.26</em></div>
          <div class="tr" data-item><span>18:35:32</span><b style="--item:var(--c2)">ORIN</b><span>signal routed</span><em>+$19.12</em></div>
          <div class="tr" data-item><span>18:35:32</span><b style="--item:var(--c3)">VESK</b><span>take profit</span><em>+$15.21</em></div>
          <div class="tr" data-item><span>18:35:33</span><b style="--item:var(--c4)">LUMA</b><span>spread scan</span><em class="neg">-$6.40</em></div>
          <div class="tr" data-item><span>18:35:34</span><b style="--item:var(--c5)">KIRA</b><span>take profit</span><em>+$15.90</em></div>
          <div class="tr" data-item><span>18:35:35</span><b style="--item:var(--c6)">DASH</b><span>bid absorbed</span><em>+$18.28</em></div>
        </div>
      </div>
      <div class="mi-card meters">
        <div class="ph" style="grid-template-columns:none;display:flex"><span><b>05</b> RISK BUDGET</span><span>LIVE</span></div>
        <div>EXPOSURE<span class="mi-bar" data-bar=".62" data-jitter=".08" style="--item:var(--c1)"><i></i></span><b>62%</b></div>
        <div>DRAWDOWN<span class="mi-bar" data-bar=".18" data-jitter=".05" style="--item:var(--c5)"><i></i></span><b>18%</b></div>
        <div>LEVERAGE<span class="mi-bar" data-bar=".35" data-jitter=".06" style="--item:var(--c3)"><i></i></span><b>3.5x</b></div>
        <div>LATENCY<span class="mi-bar" data-bar=".24" data-jitter=".1" style="--item:var(--c2)"><i></i></span><b>8ms</b></div>
        <div>FILL RATE<span class="mi-bar" data-bar=".91" data-jitter=".04" style="--item:var(--c4)"><i></i></span><b>91%</b></div>
        <div>SLIPPAGE<span class="mi-bar" data-bar=".12" data-jitter=".05" style="--item:var(--c6)"><i></i></span><b>0.1%</b></div>
      </div>
    </div>

    <div class="ph"><span><b>06</b> THE SIX / AGENT LEDGER</span><span>EACH AGENT, ONE ROLE, SHARED P&amp;L</span></div>
    <div class="agents">
      <div class="mi-card ag" data-item="route" data-index="0" data-color="var(--c1)" style="--item:var(--c1)"><div class="id"><span class="av">NO</span>#01</div><b>Nova</b><svg viewBox="0 0 100 24" preserveAspectRatio="none" data-sparkline="16" data-seed="nova"></svg><span class="d">+$2,984</span></div>
      <div class="mi-card ag" data-item="route" data-index="1" data-color="var(--c2)" style="--item:var(--c2)"><div class="id"><span class="av">OR</span>#02</div><b>Orin</b><svg viewBox="0 0 100 24" preserveAspectRatio="none" data-sparkline="16" data-seed="orin"></svg><span class="d">+$3,183</span></div>
      <div class="mi-card ag" data-item="route" data-index="2" data-color="var(--c3)" style="--item:var(--c3)"><div class="id"><span class="av">VE</span>#03</div><b>Vesk</b><svg viewBox="0 0 100 24" preserveAspectRatio="none" data-sparkline="16" data-seed="vesk"></svg><span class="d neg">-$613</span></div>
      <div class="mi-card ag" data-item="route" data-index="3" data-color="var(--c4)" style="--item:var(--c4)"><div class="id"><span class="av">LU</span>#04</div><b>Luma</b><svg viewBox="0 0 100 24" preserveAspectRatio="none" data-sparkline="16" data-seed="luma"></svg><span class="d">+$2,299</span></div>
      <div class="mi-card ag" data-item="route" data-index="4" data-color="var(--c5)" style="--item:var(--c5)"><div class="id"><span class="av">KI</span>#05</div><b>Kira</b><svg viewBox="0 0 100 24" preserveAspectRatio="none" data-sparkline="16" data-seed="kira"></svg><span class="d">+$2,597</span></div>
      <div class="mi-card ag" data-item="route" data-index="5" data-color="var(--c6)" style="--item:var(--c6)"><div class="id"><span class="av">DA</span>#06</div><b>Dash</b><svg viewBox="0 0 100 24" preserveAspectRatio="none" data-sparkline="16" data-seed="dash"></svg><span class="d neg">-$402</span></div>
    </div>
    <div class="route">
      <span class="mi-label acc">ACTIVE ROUTE</span>
      <span class="r" data-item="route" data-index="0" style="--item:var(--c1)">NOVA</span>
      <span class="r" data-item="route" data-index="1" style="--item:var(--c2)">ORIN</span>
      <span class="r" data-item="route" data-index="2" style="--item:var(--c3)">VESK</span>
      <span class="r" data-item="route" data-index="3" style="--item:var(--c4)">LUMA</span>
      <span class="r" data-item="route" data-index="4" style="--item:var(--c5)">KIRA</span>
      <span class="r" data-item="route" data-index="5" style="--item:var(--c6)">DASH</span>
      <span class="mi-label"><span data-counter="route">01</span> / 06</span>
    </div>
  </section>

  <footer class="mi-foot"><span>SIMULATION / NOT FINANCIAL ADVICE</span><span class="path">SCAN &gt; PRICE &gt; ROUTE &gt; SETTLE</span><span class="mark">fieldnotes</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Agents**: 4-6 cards (`repeat(N, 1fr)` on `.agents` and on `.route`). Keep `agents × step` = `kpis × kpi step`.
- **Domain**: rename panels (THROUGHPUT, LOAD, EXECUTION STREAM, RISK BUDGET) to your system; keep numbers short
  (≤ 9 characters at 34 px).
- **Positive / negative colours**: the page uses `--c2` for positive and `--c5` for negative values. In styles where
  those tokens are not green / red, the meaning comes from the sign; add `+` / `-` to every value.
- **Landscape** (1920×1080): KPI row on top, hero and middle side by side, agents at the bottom.
- **Pitfalls**: sparklines and sines are generated from the clock, so they loop cleanly; do not hand-draw static
  charts. Keep the hero `flex: 1` so styles with larger headers can shrink it.
