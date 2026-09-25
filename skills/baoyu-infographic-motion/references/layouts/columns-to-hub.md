# columns-to-hub

Two columns of item cards feed a centre hub through curved beams; the hub label and colour follow the active card:
a set of peer items that all serve one shared goal.

## Use when / Avoid when

- **Use when**: "10 tools that replace X", "20 hooks for Y", a stack or subscription list, integrations that plug
  into one product, pros on the left / cons on the right feeding one decision.
- **Avoid when**: fewer than 6 items (use `hub-pipeline`), items need long descriptions (use `orbit-panel`), or the
  items feed through a sequence (use `card-pipeline`).

## Structure

- **Deck** (flex: 1): left column, centre core, right column (330 px | 1fr | 330 px). Columns spread cards with
  `justify-content: space-between`, 4-6 cards per side (8-12 total). Each card: number tile, title, subtitle, meta
  line (stars · licence), 4-bar live meter, LIVE tag.
- **Core**: 3 tilted ellipses, 2 orbiting dots, `#hub` card with a label, title and a `.mi-swap-host` that names the
  active card with an arrow showing its side.
- **Category index**: 2×2 cards that list every item by category; the entry of the active item lights up.
- **Band**: 3 stats. **Footer**.

## Motion recipe

- **Master cycle** `main`: 10 cards × 1.2 s = 12 s, `data-cycles="2"` (24 s). Order: left top to bottom, then
  right top to bottom.
- **Beams**: `#tX@right #hub@left` (left side) and `#tX@left #hub@right` (right side), curve shape. Faint `mi-edge`
  copies carry 1 packet each (`data-period="2.4"`, divides 12 s).
- **Card focus**: coloured top border, tint, number tile fills, card slides 8 px toward the hub, LIVE tag fades in.
- **Hub**: border and glow use `--accent`; `data-pulse="2.4"`; swap line shows the active item.
- **Ambient**: `data-spin` orbit dots (10 s, -15 s), bar meters with `data-jitter`, tickers.
- **Sound**: `blip` per step, `packet` on beam arrival.

## Skeleton

Portrait 1080×1350.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Ten Tools That Cut Costs</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-body { display: flex; flex-direction: column; gap: 16px; }
  .deck { position: relative; flex: 1; display: grid; grid-template-columns: 330px 1fr 330px; align-items: stretch; }
  .col { display: flex; flex-direction: column; justify-content: space-between; gap: 14px; position: relative; z-index: 2; }
  .mi-card.tool[data-item] { border-top-color: var(--item); }
  .tool { padding: 16px 14px 14px 16px; display: grid; grid-template-columns: 38px 1fr auto; gap: 12px; align-items: center; border-top: 4px solid var(--item);
    background: color-mix(in oklab, var(--item) calc(var(--on) * 10%), var(--panel)); }
  .col.right .tool { translate: calc(var(--on) * -8px) 0; }
  .col.left .tool { translate: calc(var(--on) * 8px) 0; }
  .tool .no { width: 38px; height: 38px; border-radius: 8px; display: grid; place-items: center; font-family: var(--font-mono); font-size: 13px; font-weight: 600;
    background: color-mix(in oklab, var(--item) calc(18% + var(--on) * 82%), var(--panel)); color: color-mix(in oklab, var(--bg) calc(var(--on) * 100%), var(--item)); }
  .tool b { display: block; font-family: var(--font-display); font-weight: var(--title-weight); font-size: 19px; text-transform: var(--title-case); line-height: 1.1; }
  .tool small { display: block; font-family: var(--font-mono); font-size: 12px; color: var(--muted); letter-spacing: .04em; margin-top: 3px; }
  .tool em { display: block; font-style: normal; font-family: var(--font-mono); font-size: 12px; color: var(--item); letter-spacing: .04em; margin-top: 6px; }
  .eq { display: flex; gap: 3px; align-items: end; height: 22px; }
  .eq i { width: 5px; background: var(--item); opacity: calc(.35 + var(--on) * .65); height: calc(var(--value) * 100%); }
  .live { position: absolute; right: 10px; top: 6px; font-family: var(--font-mono); font-size: 11px; letter-spacing: .08em; color: var(--item); opacity: var(--on); }
  .core { position: relative; height: 100%; display: grid; place-items: center; }
  .ellipse { position: absolute; left: 50%; top: 50%; border-radius: 50%; translate: -50% -50%; border: 1.5px solid color-mix(in oklab, var(--accent) 45%, transparent); }
  .ellipse.e2 { rotate: 12deg; border-style: dashed; border-color: color-mix(in oklab, var(--accent) 30%, transparent); }
  .ellipse.e3 { rotate: -10deg; border-color: color-mix(in oklab, var(--accent) 22%, transparent); }
  .orb { position: absolute; left: 50%; top: 50%; width: 0; height: 0; }
  .orb > div { position: absolute; left: -125px; top: -125px; width: 250px; height: 250px; }
  .orb i { position: absolute; left: 121px; top: -4px; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 10px var(--accent); }
  #hub { position: relative; z-index: 2; width: 240px; padding: 22px 16px; text-align: center; border: 2px solid var(--accent); border-radius: var(--radius); background: color-mix(in oklab, var(--accent) 7%, var(--panel));
    box-shadow: 0 0 calc((14px + var(--pulse) * 36px) * var(--glow)) color-mix(in oklab, var(--accent) 45%, transparent); }
  #hub h2 { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 34px; line-height: 1; text-transform: var(--title-case); margin: 8px 0 10px; }
  #hub .mi-swap-host { height: 40px; border-top: 1px solid var(--line); }
  #hub .mi-swap { display: grid; place-items: center; font-family: var(--font-mono); font-size: 13px; letter-spacing: .06em; color: var(--item); }
  .idx-head { display: flex; justify-content: space-between; }
  .cats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .cat { padding: 12px 16px; border-top: 3px solid var(--item); }
  .cat .mi-label { color: var(--item); margin-bottom: 8px; display: flex; justify-content: space-between; }
  .cat .mi-label span { color: var(--muted); }
  .cat ul { list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 12px; font-family: var(--font-mono); font-size: 13px; }
  .cat li { display: flex; gap: 8px; align-items: center; padding: 3px 6px; border-radius: 5px; background: color-mix(in oklab, var(--item) calc(var(--on) * 16%), transparent); }
  .cat li::before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--item); scale: calc(1 + var(--on) * .5); }
</style>
</head>
<body data-canvas="portrait" data-cycles="2" data-sfx="soft" data-fps="30" data-poster="0.9">
<main class="mi-page mi-grid-bg">
  <header class="mi-head">
    <div class="mi-top"><span class="mi-crumb">OPEN SOURCE / SUBSCRIPTION STACK / 10 PROJECTS</span><span class="mi-meta">ACTIVE <span data-counter="main">01</span> / 10 &middot; T <span data-clock></span></span></div>
    <h1 class="mi-title">Ten tools that <em>cut costs</em></h1>
    <div class="mi-sub"><span>RESEARCH</span><span class="sep">/</span><span>CHAT</span><span class="sep">/</span><span>CREATE</span><span class="sep">/</span><span>AUTOMATE</span><span class="sep">/</span><span>INTEGRATE</span></div>
    <div class="mi-rule" data-progress="main"></div>
  </header>

  <section class="mi-body" data-cycle="main" data-step="1.2" data-sfx="blip" data-accent data-master>
    <div class="deck">
      <svg class="mi-svg">
        <path class="mi-edge" data-link="#t1@right #hub@left" data-packets="1" data-period="2.4" data-r="2.5"></path>
        <path class="mi-edge" data-link="#t2@right #hub@left" data-packets="1" data-period="2.4" data-r="2.5"></path>
        <path class="mi-edge" data-link="#t3@right #hub@left" data-packets="1" data-period="2.4" data-r="2.5"></path>
        <path class="mi-edge" data-link="#t4@right #hub@left" data-packets="1" data-period="2.4" data-r="2.5"></path>
        <path class="mi-edge" data-link="#t5@right #hub@left" data-packets="1" data-period="2.4" data-r="2.5"></path>
        <path class="mi-edge" data-link="#t6@left #hub@right" data-packets="1" data-period="2.4" data-r="2.5"></path>
        <path class="mi-edge" data-link="#t7@left #hub@right" data-packets="1" data-period="2.4" data-r="2.5"></path>
        <path class="mi-edge" data-link="#t8@left #hub@right" data-packets="1" data-period="2.4" data-r="2.5"></path>
        <path class="mi-edge" data-link="#t9@left #hub@right" data-packets="1" data-period="2.4" data-r="2.5"></path>
        <path class="mi-edge" data-link="#t10@left #hub@right" data-packets="1" data-period="2.4" data-r="2.5"></path>
        <path class="mi-beam" data-link="#t1@right #hub@left" data-beam data-item="main" data-index="0" data-sfx-end="packet" style="--item: var(--c1)"></path>
        <path class="mi-beam" data-link="#t2@right #hub@left" data-beam data-item="main" data-index="1" data-sfx-end="packet" style="--item: var(--c2)"></path>
        <path class="mi-beam" data-link="#t3@right #hub@left" data-beam data-item="main" data-index="2" data-sfx-end="packet" style="--item: var(--c3)"></path>
        <path class="mi-beam" data-link="#t4@right #hub@left" data-beam data-item="main" data-index="3" data-sfx-end="packet" style="--item: var(--c4)"></path>
        <path class="mi-beam" data-link="#t5@right #hub@left" data-beam data-item="main" data-index="4" data-sfx-end="packet" style="--item: var(--c5)"></path>
        <path class="mi-beam" data-link="#t6@left #hub@right" data-beam data-item="main" data-index="5" data-sfx-end="packet" style="--item: var(--c6)"></path>
        <path class="mi-beam" data-link="#t7@left #hub@right" data-beam data-item="main" data-index="6" data-sfx-end="packet" style="--item: var(--c1)"></path>
        <path class="mi-beam" data-link="#t8@left #hub@right" data-beam data-item="main" data-index="7" data-sfx-end="packet" style="--item: var(--c2)"></path>
        <path class="mi-beam" data-link="#t9@left #hub@right" data-beam data-item="main" data-index="8" data-sfx-end="packet" style="--item: var(--c3)"></path>
        <path class="mi-beam" data-link="#t10@left #hub@right" data-beam data-item="main" data-index="9" data-sfx-end="packet" style="--item: var(--c4)"></path>
      </svg>

      <div class="col left">
        <div id="t1" class="mi-card tool" data-item="main" data-index="0" data-color="var(--c1)" style="--item:var(--c1)"><span class="no">01</span><div><b>Trade Agents</b><small>market research crew</small><em>&#9733; 18.2K &middot; MIT</em></div><div class="eq"><i data-bar=".5" data-jitter=".3"></i><i data-bar=".8" data-jitter=".2"></i><i data-bar=".4" data-jitter=".3"></i><i data-bar=".7" data-jitter=".2"></i></div><span class="live">LIVE</span></div>
        <div id="t2" class="mi-card tool" data-item="main" data-index="1" data-color="var(--c2)" style="--item:var(--c2)"><span class="no">02</span><div><b>Open Chat</b><small>self-hosted workspace</small><em>&#9733; 41.0K &middot; AGPL</em></div><div class="eq"><i data-bar=".6" data-jitter=".3"></i><i data-bar=".3" data-jitter=".2"></i><i data-bar=".8" data-jitter=".2"></i><i data-bar=".5" data-jitter=".3"></i></div><span class="live">LIVE</span></div>
        <div id="t3" class="mi-card tool" data-item="main" data-index="2" data-color="var(--c3)" style="--item:var(--c3)"><span class="no">03</span><div><b>Frame Kit</b><small>html to video pipeline</small><em>&#9733; 9.6K &middot; APACHE</em></div><div class="eq"><i data-bar=".7" data-jitter=".2"></i><i data-bar=".5" data-jitter=".3"></i><i data-bar=".9" data-jitter=".1"></i><i data-bar=".4" data-jitter=".3"></i></div><span class="live">LIVE</span></div>
        <div id="t4" class="mi-card tool" data-item="main" data-index="3" data-color="var(--c4)" style="--item:var(--c4)"><span class="no">04</span><div><b>Fin Terminal</b><small>markets data surface</small><em>&#9733; 12.3K &middot; MIT</em></div><div class="eq"><i data-bar=".4" data-jitter=".3"></i><i data-bar=".6" data-jitter=".2"></i><i data-bar=".5" data-jitter=".3"></i><i data-bar=".8" data-jitter=".2"></i></div><span class="live">LIVE</span></div>
        <div id="t5" class="mi-card tool" data-item="main" data-index="4" data-color="var(--c5)" style="--item:var(--c5)"><span class="no">05</span><div><b>Clip Studio</b><small>script to short video</small><em>&#9733; 22.8K &middot; MIT</em></div><div class="eq"><i data-bar=".8" data-jitter=".2"></i><i data-bar=".4" data-jitter=".3"></i><i data-bar=".6" data-jitter=".2"></i><i data-bar=".5" data-jitter=".3"></i></div><span class="live">LIVE</span></div>
      </div>

      <div class="core">
        <div class="ellipse" style="width:310px;height:200px"></div>
        <div class="ellipse e2" style="width:330px;height:250px"></div>
        <div class="ellipse e3" style="width:290px;height:320px"></div>
        <div class="orb" style="scale:1 .55"><div data-spin="10"><i></i></div></div>
        <div class="orb" style="scale:.9 .7;rotate:25deg"><div data-spin="-15"><i style="width:6px;height:6px"></i></div></div>
        <div id="hub" data-pulse="2.4">
          <div class="mi-label acc">OPEN SOURCE</div>
          <h2>Your stack</h2>
          <div class="mi-swap-host">
            <div class="mi-swap" data-item="main" data-index="0" style="--item:var(--c1)">&rarr; TRADE AGENTS</div>
            <div class="mi-swap" data-item="main" data-index="1" style="--item:var(--c2)">&rarr; OPEN CHAT</div>
            <div class="mi-swap" data-item="main" data-index="2" style="--item:var(--c3)">&rarr; FRAME KIT</div>
            <div class="mi-swap" data-item="main" data-index="3" style="--item:var(--c4)">&rarr; FIN TERMINAL</div>
            <div class="mi-swap" data-item="main" data-index="4" style="--item:var(--c5)">&rarr; CLIP STUDIO</div>
            <div class="mi-swap" data-item="main" data-index="5" style="--item:var(--c6)">&larr; MAIL AGENT</div>
            <div class="mi-swap" data-item="main" data-index="6" style="--item:var(--c1)">&larr; VOICE LAB</div>
            <div class="mi-swap" data-item="main" data-index="7" style="--item:var(--c2)">&larr; FLOW BOARD</div>
            <div class="mi-swap" data-item="main" data-index="8" style="--item:var(--c3)">&larr; SKILL PACK</div>
            <div class="mi-swap" data-item="main" data-index="9" style="--item:var(--c4)">&larr; API BRIDGE</div>
          </div>
          <div class="mi-label">SAVES $<span data-ticker="412" data-jitter="6">412</span> / MONTH</div>
        </div>
      </div>

      <div class="col right">
        <div id="t6" class="mi-card tool" data-item="main" data-index="5" data-color="var(--c6)" style="--item:var(--c6)"><span class="no">06</span><div><b>Mail Agent</b><small>triage, drafts, replies</small><em>&#9733; 7.4K &middot; MIT</em></div><div class="eq"><i data-bar=".5" data-jitter=".3"></i><i data-bar=".7" data-jitter=".2"></i><i data-bar=".3" data-jitter=".3"></i><i data-bar=".9" data-jitter=".1"></i></div><span class="live">LIVE</span></div>
        <div id="t7" class="mi-card tool" data-item="main" data-index="6" data-color="var(--c1)" style="--item:var(--c1)"><span class="no">07</span><div><b>Voice Lab</b><small>local speech model</small><em>&#9733; 30.1K &middot; MIT</em></div><div class="eq"><i data-bar=".6" data-jitter=".2"></i><i data-bar=".4" data-jitter=".3"></i><i data-bar=".8" data-jitter=".2"></i><i data-bar=".6" data-jitter=".3"></i></div><span class="live">LIVE</span></div>
        <div id="t8" class="mi-card tool" data-item="main" data-index="7" data-color="var(--c2)" style="--item:var(--c2)"><span class="no">08</span><div><b>Flow Board</b><small>entities and evidence</small><em>&#9733; 5.2K &middot; BSD</em></div><div class="eq"><i data-bar=".3" data-jitter=".3"></i><i data-bar=".7" data-jitter=".2"></i><i data-bar=".5" data-jitter=".3"></i><i data-bar=".7" data-jitter=".2"></i></div><span class="live">LIVE</span></div>
        <div id="t9" class="mi-card tool" data-item="main" data-index="8" data-color="var(--c3)" style="--item:var(--c3)"><span class="no">09</span><div><b>Skill Pack</b><small>reusable agent skills</small><em>&#9733; 14.9K &middot; MIT</em></div><div class="eq"><i data-bar=".8" data-jitter=".2"></i><i data-bar=".6" data-jitter=".3"></i><i data-bar=".4" data-jitter=".3"></i><i data-bar=".6" data-jitter=".2"></i></div><span class="live">LIVE</span></div>
        <div id="t10" class="mi-card tool" data-item="main" data-index="9" data-color="var(--c4)" style="--item:var(--c4)"><span class="no">10</span><div><b>API Bridge</b><small>oauth and sync layer</small><em>&#9733; 24.9K &middot; ELV2</em></div><div class="eq"><i data-bar=".5" data-jitter=".3"></i><i data-bar=".9" data-jitter=".1"></i><i data-bar=".6" data-jitter=".2"></i><i data-bar=".4" data-jitter=".3"></i></div><span class="live">LIVE</span></div>
      </div>
    </div>

    <div class="idx-head mi-label"><span class="acc">STACK ROUTING / LIVE CAPABILITY INDEX</span><span>ALL 10 ARE OPEN SOURCE</span></div>
    <div class="cats">
      <div class="mi-card cat" style="--item:var(--c1)"><div class="mi-label">RESEARCH<span>03</span></div><ul><li data-item="main" data-index="0">trade-agents</li><li data-item="main" data-index="3">fin-terminal</li><li data-item="main" data-index="7">flow-board</li></ul></div>
      <div class="mi-card cat" style="--item:var(--c3)"><div class="mi-label">CREATE<span>03</span></div><ul><li data-item="main" data-index="2">frame-kit</li><li data-item="main" data-index="4">clip-studio</li><li data-item="main" data-index="6">voice-lab</li></ul></div>
      <div class="mi-card cat" style="--item:var(--c2)"><div class="mi-label">OPERATE<span>02</span></div><ul><li data-item="main" data-index="1">open-chat</li><li data-item="main" data-index="5">mail-agent</li></ul></div>
      <div class="mi-card cat" style="--item:var(--c4)"><div class="mi-label">CONNECT<span>02</span></div><ul><li data-item="main" data-index="8">skill-pack</li><li data-item="main" data-index="9">api-bridge</li></ul></div>
    </div>
  </section>

  <section class="mi-band">
    <div class="mi-stat" style="--item: var(--c1)"><span class="mi-stat-v" data-ticker="412" data-jitter="6" data-prefix="$">$412</span><span class="mi-stat-l">Saved per month</span></div>
    <div class="mi-stat" style="--item: var(--c2)"><span class="mi-stat-v" data-ticker="186.4" data-jitter="0.6" data-decimals="1" data-suffix="K">186.4K</span><span class="mi-stat-l">Combined stars</span></div>
    <div class="mi-stat" style="--item: var(--c3)"><span class="mi-stat-v">10/10</span><span class="mi-stat-l">Self-hostable</span></div>
  </section>

  <footer class="mi-foot"><span>SOURCE / GITHUB, SEP 2026</span><span class="path">RESEARCH &gt; CHAT &gt; CREATE &gt; AUTOMATE</span><span class="mark">fieldnotes</span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Item count**: keep both columns equal (4+4 to 6+6). With 6 per side, drop the meta line (`em`) so cards stay
  short. Step 1.0 s for 12 items, 1.5 s for 8.
- **Categories**: the 2×2 index can become 3 or 4 columns (`.cats { grid-template-columns: repeat(4, 1fr) }`) or be
  removed on a square canvas.
- **Landscape**: 3 columns of 330 px work as is; move the index to a row under the deck and drop the band.
- **Story**: add 2 cards per side and set `.deck { min-height: 1100px }`.
- **Pitfalls**: card titles ≤ 14 characters, subtitles ≤ 24. Beams are measured at load, so the 8 px focus slide
  leaves a tiny gap at the card edge; keep the slide small. Do not use more than 6 colours; repeat `--c1…--c6`.
