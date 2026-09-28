# hub-picker

A round decision hub in the centre with 5 candidate cards around it. Each round, particles run out to every
candidate, then one winner gets an accent border and a beam from the hub, and its score counts up. A context line
above the hub and all candidate labels swap per round. A telemetry card below shows the pass timeline, a confidence
ring and the list of last decisions.

## Use when / Avoid when

- **Use when**: one component chooses one option out of a few ("the router picks the model", "the agent clicks one
  button", "the planner picks a tool"), and you want to show several rounds of that choice with scores.
- **Avoid when**: the options stay the same and only need description (use `orbit-panel`), the choice leads into a
  sequence of steps (use `hub-pipeline` or `loop-track`), or there are more than 6 candidates (use `tile-router`).

## Structure

Canvas `1200x1200` (square; the telemetry card needs the width of 3 columns).

- **Header** `.hd`: `.mi-title` with one `<em>` word, `.mi-sub` one line, KPI tiles `.kpi` (round counter, spend).
- **Stage** `.stage.mi-body` (flex: 1): SVG overlay, `.ctx` swap line at the top, 3 `.ring` circles (the middle
  one dashed and spinning with a pink marker), `#hub.mi-hub`, 5 `.cand` slots `#s0`-`#s4` (top, left, right,
  bottom-left, bottom-right). Each slot has a `.box`, a `.win` overlay (item of the round that it wins) and a
  `.mi-swap-host` with one `.mi-swap` per round (label + score).
- **Telemetry** `.tele.mi-card`: 3 columns — pass timeline (4 phase chips + progress bar + 2 key/values),
  confidence (`.mi-ring` per round in a swap host), last decisions (5 `.mi-row`, one per round). **Footer** mark.

## Motion recipe

- **Master cycle** `round` on `.stage`: 5 rounds × `data-step="2.4"` = 12 s, `data-cycles="2"` (24 s),
  `data-sfx="blip"`. Every per-round element has `data-item="round" data-index="r"`.
- **Winner map**: pick one slot per round (here 0→`#s0`, 1→`#s2`, 2→`#s3`, 3→`#s1`, 4→`#s4`). Put the `.win` overlay
  with index r in that slot, the `class="w"` score in that slot's swap r, and the `mi-beam` `#hub → #sW` with index r
  (`data-draw="0.5"`, `data-sfx-end="packet"`).
- **Particles**: 5 static `mi-edge` paths hub → slot with `data-packets="2" data-period="2.4"` and phase offsets
  0, 0.2 … 0.8, so dots always fly out to every candidate.
- **Scores**: the winner score uses `data-count` with `data-from="0.5"` (not 0, so frame 0 does not look empty);
  loser scores are static text.
- **Nested clock**: phase chips cycle `pass`, 4 × 0.6 s = 2.4 s (one pass per round). The bar under them uses
  `data-progress="round"`.
- **Custom JS**: spend = (round number) × 0.0002, computed from `t` so it resets with the loop.
- **Ambient**: `data-spin="24"` on the dashed ring (rings centre with `translate`, because `data-spin` writes
  `transform`), `data-pulse="2.4"` on the hub, latency `data-ticker`.
- **Sound**: `blip` per round + `packet` when the beam reaches the winner (20 cues in 24 s).
- **Poster**: `data-poster="1.6"` (round 1 winner lit, score counted).

## Skeleton

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>The Router Picks One Of Five</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-page { gap: 14px; padding-bottom: 40px; }
  .hd { display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: end; }
  .hd .mi-title { font-size: 48px; white-space: nowrap; }
  .hd .mi-sub { margin-top: 8px; }
  .kpis { display: flex; }
  .kpi { padding: 0 20px; border-left: 1px solid var(--line); min-width: 120px; }
  .kpi b { display: block; margin-top: 6px; font-family: var(--font-mono); font-size: 26px; font-weight: 700; color: var(--item, var(--ink)); font-variant-numeric: tabular-nums; }
  .stage { position: relative; flex: 1; min-height: 0; }
  .ctx { position: absolute; left: 50%; top: 0; width: 360px; height: 22px; translate: -50% 0; text-align: center; font-family: var(--font-mono); font-size: 15px; color: var(--muted); }
  .ctx .mi-swap { translate: 0 0; }
  .ring { position: absolute; left: 50%; top: 52%; border-radius: 50%; border: 1px solid rgba(255, 45, 111, 0.28); translate: -50% -50%; }
  .ring.r1 { width: 250px; height: 250px; }
  .ring.r2 { width: 330px; height: 330px; border-style: dashed; border-color: rgba(210, 216, 224, 0.16); }
  .ring.r3 { width: 420px; height: 420px; border-color: rgba(255, 45, 111, 0.1); }
  .ring.r2 i { position: absolute; left: 50%; top: -4px; width: 7px; height: 7px; margin-left: -3px; border-radius: 50%; background: var(--c1); box-shadow: 0 0 10px var(--c1); }
  #hub { position: absolute; left: 50%; top: 52%; width: 172px; height: 172px; margin: -86px 0 0 -86px; font-size: 44px; line-height: 1; z-index: 2; }
  #hub small { display: block; margin-top: 6px; font-family: var(--font-mono); font-style: normal; font-weight: 400; font-size: 12px; letter-spacing: .14em; color: var(--muted); }
  .cand { position: absolute; width: 250px; height: 54px; z-index: 2; }
  #s0 { left: 50%; top: 44px; margin-left: -125px; }
  #s1 { left: 20px; top: 38%; }
  #s2 { right: 20px; top: 38%; }
  #s3 { left: 140px; bottom: 10px; }
  #s4 { right: 140px; bottom: 10px; }
  .cand .box { position: absolute; inset: 0; border: 1px solid var(--line); border-radius: var(--radius); background: var(--panel); }
  .cand .win { position: absolute; inset: -1px; border: 1.5px solid var(--c1); border-radius: var(--radius); background: rgba(255, 45, 111, 0.08); box-shadow: 0 0 18px rgba(255, 45, 111, 0.45); opacity: var(--on); }
  .cand .mi-swap-host { position: absolute; inset: 0; }
  .cand .mi-swap { display: flex; align-items: center; justify-content: space-between; padding: 0 16px; font-family: var(--font-mono); font-size: 15px; translate: 0 0; }
  .cand .mi-swap span { color: var(--ink); }
  .cand .mi-swap b { font-weight: 400; color: var(--muted); font-variant-numeric: tabular-nums; }
  .cand .mi-swap b.w { color: var(--c1); font-weight: 700; }
  .stage .mi-edge { stroke-dasharray: 3 5; }
  .stage .mi-packet { fill: #e8ebef; }
  .tele { height: 272px; padding: 16px 20px; display: grid; grid-template-rows: auto 1fr auto; gap: 12px; }
  .th { display: flex; justify-content: space-between; }
  .cols { display: grid; grid-template-columns: 1fr 1fr 1.25fr; gap: 0; min-height: 0; }
  .col { padding: 0 20px; border-left: 1px solid var(--line); display: flex; flex-direction: column; gap: 12px; }
  .col:first-child { padding-left: 0; border-left: 0; }
  .col h4 { font-family: var(--font-mono); font-size: 13px; font-weight: 700; letter-spacing: .1em; color: var(--ink); }
  .phases { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
  .phases div { height: 30px; display: grid; place-items: center; border-radius: 4px; font-family: var(--font-mono); font-size: 12px; letter-spacing: .08em; text-transform: uppercase;
    border: 1px solid color-mix(in oklab, var(--c1) calc(max(var(--on), var(--done)) * 100%), var(--line));
    background: color-mix(in oklab, var(--c1) calc(var(--on) * 60%), transparent);
    color: color-mix(in oklab, var(--ink) calc(40% + max(var(--on), var(--done)) * 60%), var(--muted)); }
  .kv { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 13px; color: var(--muted); }
  .kv b { color: var(--ink); font-weight: 500; font-variant-numeric: tabular-nums; }
  .conf { display: grid; grid-template-columns: 110px 1fr; gap: 16px; align-items: center; }
  .conf .mi-swap-host { width: 110px; height: 110px; }
  .conf .mi-swap { display: grid; place-items: center; translate: 0 0; }
  .conf .mi-ring { --size: 110px; position: absolute; inset: 0; --item: var(--ink); }
  .conf .mi-swap b { font-family: var(--font-mono); font-size: 26px; font-weight: 700; font-variant-numeric: tabular-nums; }
  .dec { display: flex; flex-direction: column; gap: 0; }
  .dec .mi-row { padding: 7px 4px; font-size: 13px; gap: 10px; }
  .dec .mi-row em { font-style: normal; color: var(--c1); width: 40px; }
  .dec .mi-row span { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dec .mi-row b { font-weight: 500; font-variant-numeric: tabular-nums; }
  .tf { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 12px; letter-spacing: .1em; color: #4a515c; text-transform: uppercase; }
  .mi-foot { justify-content: flex-end; }
</style>
<script>
window.MotionSetup = (M) => {
  const cost = document.querySelector("#cost");
  M.on((t) => {
    const n = (Math.floor(t / 2.4) % 5) + 1;
    cost.textContent = "$" + (n * 0.0002).toFixed(4);
  });
};
</script>
</head>
<body data-canvas="1200x1200" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="1.6">
<main class="mi-page">
  <header class="hd">
    <div>
      <h1 class="mi-title"><em>Router</em> picks one of five</h1>
      <div class="mi-sub">every candidate judged in the same call</div>
    </div>
    <div class="kpis">
      <div class="kpi"><div class="mi-label">Round</div><b><span data-counter="round" data-pad="2">01</span>/05</b></div>
      <div class="kpi" style="--item:var(--c1)"><div class="mi-label">Spend</div><b id="cost">$0.0002</b></div>
    </div>
  </header>

  <section class="stage mi-body" data-cycle="round" data-step="2.4" data-sfx="blip" data-master>
    <svg class="mi-svg">
      <path class="mi-edge" data-link="#hub #s0" data-shape="straight" data-gap="4" data-packets="2" data-period="2.4" data-r="2.5"></path>
      <path class="mi-edge" data-link="#hub #s1" data-shape="straight" data-gap="4" data-packets="2" data-period="2.4" data-phase-offset="0.2" data-r="2.5"></path>
      <path class="mi-edge" data-link="#hub #s2" data-shape="straight" data-gap="4" data-packets="2" data-period="2.4" data-phase-offset="0.4" data-r="2.5"></path>
      <path class="mi-edge" data-link="#hub #s3" data-shape="straight" data-gap="4" data-packets="2" data-period="2.4" data-phase-offset="0.6" data-r="2.5"></path>
      <path class="mi-edge" data-link="#hub #s4" data-shape="straight" data-gap="4" data-packets="2" data-period="2.4" data-phase-offset="0.8" data-r="2.5"></path>
      <path class="mi-beam" style="--item:var(--c1)" data-link="#hub #s0" data-shape="straight" data-gap="4" data-beam data-item="round" data-index="0" data-draw="0.5" data-sfx-end="packet" data-dot-r="5"></path>
      <path class="mi-beam" style="--item:var(--c1)" data-link="#hub #s2" data-shape="straight" data-gap="4" data-beam data-item="round" data-index="1" data-draw="0.5" data-sfx-end="packet" data-dot-r="5"></path>
      <path class="mi-beam" style="--item:var(--c1)" data-link="#hub #s3" data-shape="straight" data-gap="4" data-beam data-item="round" data-index="2" data-draw="0.5" data-sfx-end="packet" data-dot-r="5"></path>
      <path class="mi-beam" style="--item:var(--c1)" data-link="#hub #s1" data-shape="straight" data-gap="4" data-beam data-item="round" data-index="3" data-draw="0.5" data-sfx-end="packet" data-dot-r="5"></path>
      <path class="mi-beam" style="--item:var(--c1)" data-link="#hub #s4" data-shape="straight" data-gap="4" data-beam data-item="round" data-index="4" data-draw="0.5" data-sfx-end="packet" data-dot-r="5"></path>
    </svg>
    <div class="ctx mi-swap-host">
      <div class="mi-swap" data-item="round" data-index="0">checkout.example.com</div>
      <div class="mi-swap" data-item="round" data-index="1">mail.example.com</div>
      <div class="mi-swap" data-item="round" data-index="2">settings.example.com</div>
      <div class="mi-swap" data-item="round" data-index="3">search.example.com</div>
      <div class="mi-swap" data-item="round" data-index="4">calendar.example.com</div>
    </div>
    <div class="ring r3"></div>
    <div class="ring r2" data-spin="24"><i></i></div>
    <div class="ring r1"></div>
    <div id="hub" class="mi-hub" data-pulse="2.4"><div>PICK<small>one call</small></div></div>

    <div class="cand" id="s0"><div class="box"></div><div class="win" data-item="round" data-index="0"></div><div class="mi-swap-host">
      <div class="mi-swap" data-item="round" data-index="0"><span>Pay now</span><b class="w" data-count="0.97" data-from="0.5" data-decimals="2" data-item="round" data-index="0" data-dur="0.8">0.97</b></div>
      <div class="mi-swap" data-item="round" data-index="1"><span>Compose</span><b>0.02</b></div>
      <div class="mi-swap" data-item="round" data-index="2"><span>Profile photo</span><b>0.04</b></div>
      <div class="mi-swap" data-item="round" data-index="3"><span>Search field</span><b>0.06</b></div>
      <div class="mi-swap" data-item="round" data-index="4"><span>New event</span><b>0.05</b></div>
    </div></div>
    <div class="cand" id="s1"><div class="box"></div><div class="win" data-item="round" data-index="3"></div><div class="mi-swap-host">
      <div class="mi-swap" data-item="round" data-index="0"><span>Promo code</span><b>0.02</b></div>
      <div class="mi-swap" data-item="round" data-index="1"><span>Select all</span><b>0.01</b></div>
      <div class="mi-swap" data-item="round" data-index="2"><span>Notifications</span><b>0.03</b></div>
      <div class="mi-swap" data-item="round" data-index="3"><span>Sort by date</span><b class="w" data-count="0.88" data-from="0.5" data-decimals="2" data-item="round" data-index="3" data-dur="0.8">0.88</b></div>
      <div class="mi-swap" data-item="round" data-index="4"><span>Week view</span><b>0.02</b></div>
    </div></div>
    <div class="cand" id="s2"><div class="box"></div><div class="win" data-item="round" data-index="1"></div><div class="mi-swap-host">
      <div class="mi-swap" data-item="round" data-index="0"><span>Back to cart</span><b>0.01</b></div>
      <div class="mi-swap" data-item="round" data-index="1"><span>Archive</span><b class="w" data-count="0.93" data-from="0.5" data-decimals="2" data-item="round" data-index="1" data-dur="0.8">0.93</b></div>
      <div class="mi-swap" data-item="round" data-index="2"><span>Display name</span><b>0.02</b></div>
      <div class="mi-swap" data-item="round" data-index="3"><span>Filters</span><b>0.04</b></div>
      <div class="mi-swap" data-item="round" data-index="4"><span>Today</span><b>0.03</b></div>
    </div></div>
    <div class="cand" id="s3"><div class="box"></div><div class="win" data-item="round" data-index="2"></div><div class="mi-swap-host">
      <div class="mi-swap" data-item="round" data-index="0"><span>Card number</span><b>0.03</b></div>
      <div class="mi-swap" data-item="round" data-index="1"><span>Settings</span><b>0.02</b></div>
      <div class="mi-swap" data-item="round" data-index="2"><span>Save changes</span><b class="w" data-count="0.91" data-from="0.5" data-decimals="2" data-item="round" data-index="2" data-dur="0.8">0.91</b></div>
      <div class="mi-swap" data-item="round" data-index="3"><span>Clear</span><b>0.01</b></div>
      <div class="mi-swap" data-item="round" data-index="4"><span>Invite guests</span><b>0.06</b></div>
    </div></div>
    <div class="cand" id="s4"><div class="box"></div><div class="win" data-item="round" data-index="4"></div><div class="mi-swap-host">
      <div class="mi-swap" data-item="round" data-index="0"><span>Terms of use</span><b>0.01</b></div>
      <div class="mi-swap" data-item="round" data-index="1"><span>Search mail</span><b>0.04</b></div>
      <div class="mi-swap" data-item="round" data-index="2"><span>Delete account</span><b>0.00</b></div>
      <div class="mi-swap" data-item="round" data-index="3"><span>Next page</span><b>0.01</b></div>
      <div class="mi-swap" data-item="round" data-index="4"><span>Book slot</span><b class="w" data-count="0.86" data-from="0.5" data-decimals="2" data-item="round" data-index="4" data-dur="0.8">0.86</b></div>
    </div></div>
  </section>

  <section class="mi-card tele">
    <div class="th"><span class="mi-label">Run telemetry</span><span class="mi-label">Round <span data-counter="round" data-pad="2">01</span> / 05</span></div>
    <div class="cols">
      <div class="col">
        <h4>01 PASS TIMELINE</h4>
        <div class="phases" data-cycle="pass" data-step="0.6">
          <div data-item>see</div><div data-item>score</div><div data-item>pick</div><div data-item>act</div>
        </div>
        <div class="mi-bar"><i data-progress="round" style="--item:var(--c1)"></i></div>
        <div class="kv"><span>latency</span><b data-ticker="180" data-jitter="14" data-suffix=" ms">180 ms</b></div>
        <div class="kv"><span>candidates</span><b>5 / call</b></div>
      </div>
      <div class="col">
        <h4>02 CONFIDENCE</h4>
        <div class="conf">
          <div class="mi-swap-host">
            <div class="mi-swap" data-item="round" data-index="0"><i class="mi-ring" data-bar="0.97" data-item="round" data-index="0" data-dur="0.8"></i><b>.97</b></div>
            <div class="mi-swap" data-item="round" data-index="1"><i class="mi-ring" data-bar="0.93" data-item="round" data-index="1" data-dur="0.8"></i><b>.93</b></div>
            <div class="mi-swap" data-item="round" data-index="2"><i class="mi-ring" data-bar="0.91" data-item="round" data-index="2" data-dur="0.8"></i><b>.91</b></div>
            <div class="mi-swap" data-item="round" data-index="3"><i class="mi-ring" data-bar="0.88" data-item="round" data-index="3" data-dur="0.8"></i><b>.88</b></div>
            <div class="mi-swap" data-item="round" data-index="4"><i class="mi-ring" data-bar="0.86" data-item="round" data-index="4" data-dur="0.8"></i><b>.86</b></div>
          </div>
          <div class="kv" style="flex-direction:column;gap:8px"><span>model <b>local</b></span><span>mode <b>greedy</b></span><span>retry <b>0</b></span></div>
        </div>
      </div>
      <div class="col">
        <h4>03 LAST DECISIONS</h4>
        <div class="dec">
          <div class="mi-row" data-item="round" data-index="0"><em>click</em><span>Pay now</span><b>0.97</b></div>
          <div class="mi-row" data-item="round" data-index="1"><em>click</em><span>Archive</span><b>0.93</b></div>
          <div class="mi-row" data-item="round" data-index="2"><em>click</em><span>Save changes</span><b>0.91</b></div>
          <div class="mi-row" data-item="round" data-index="3"><em>sort</em><span>Sort by date</span><b>0.88</b></div>
          <div class="mi-row" data-item="round" data-index="4"><em>click</em><span>Book slot</span><b>0.86</b></div>
        </div>
      </div>
    </div>
    <div class="tf"><span>5 rounds &middot; 1 call each &middot; no retries</span><span>ui-agent / picker</span></div>
  </section>
  <footer class="mi-foot"><span class="mark">pickbench</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Candidates**: 4-6. For 4, drop `#s0` and move `#s1` / `#s2` to `top: 20%`; for 6, add a bottom-centre slot.
  Keep labels ≤ 16 characters at 15 px in a 250 px card.
- **Rounds**: 4-6. Keep rounds × step = 12 s and `pass` period = step (4 phases × step / 4).
- **Content**: rename the hub (`ROUTE`, `PLAN`, `JUDGE`) and the context line (domain, user request, task id).
  Make the last-decisions rows match the winners.
- **Other styles**: works with any dark style; on a light style set `.stage .mi-packet` to `var(--ink)`.
- **Pitfalls**: do not put `data-spin` on an element that is centred with `transform`. Give `.mi-swap` in the slots
  `translate: 0 0`, or the label slides while it fades. `data-count` shows `data-from` while its round is queued,
  so keep it inside the round's `.mi-swap`.
