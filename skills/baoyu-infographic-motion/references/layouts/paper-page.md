# paper-page

One page of a LaTeX / IEEE working paper, alive: a loop figure whose typed decisions light up one by one, and the
matching phrase, code line, table row and section head light up with them.

## Use when / Avoid when

- **Use when**: a research note, technical working paper or RFC explains a process loop with 3-6 decision points,
  and the same decisions appear in prose, in code and in a table. "Animated figure 1 of a paper" posts.
- **Avoid when**: there is no text to read (use `circular-flow`, `hub-pipeline`), the content is a list of 10+
  items (use `doc-terminal`), or the page must look like a dashboard. The page is dense: it needs a real 250-350
  word body.

## Structure

Canvas `paper` (1200×1600, 3:4 page; export with `--scale 1.5` for 1800×2400). No dashboard chrome
(`.mi-top`, `.mi-sub`, `.mi-band` are not used); the page has its own classes.

- **Running header** `.pp-run`: note title left, date right. **Footer** `.pp-foot`: paper title left, page number centre.
- **Title block** `.pp-tb`: 2-line bold serif title, subtitle, italic author line with `&middot;` separators, short
  rule with a centre dot, small-caps figure kicker.
- **Figure** `.fig` (1032×440, absolute positions): a loop of rectangular nodes `.nd` (bold label + italic sub)
  and hatched diamonds `.dia` (boxed `.tag` label, italic question `.qq` above or below) joined by dashed `.lp`
  paths; a centre chip `#chip` with 10 pins `.pins`; solid arrows `.ar` to two exits ("you approve", "halt: ask
  you"); legend `.legend`.
- **Caption** `.cap`: "Fig. 1." bold lead + justified text.
- **Two-column body** `.cols`: Roman-numeral small-caps section heads `.sh`, justified paragraphs with italic lead
  phrases `.ld`; right column: code listing `.lst` of `.ln` lines between rules, "TABLE I" + small-caps caption,
  booktabs table (horizontal rules only).

## Motion recipe

- **Decision cycle** `loop` on `.pp-sheet`: 5 decisions × 2.4 s = 12 s, `data-sfx="blip"`. Every element for
  decision k has `data-item="loop" data-index="k"`: the diamond (hatch → solid ink, white label), its question (bolder,
  full ink), the lead phrase (dark highlight box, white text), the code line (gray band + left bar + block cursor),
  the table row (gray band + left bar) and an underline span `.ul` in its section head. A head that covers two
  decisions holds two `.ul` spans (one per index), so its underline stays on for both.
- **Query line**: one dotted `.qline` per diamond, `data-link="#chip@side #dk@side"` with `data-packets="2"`, wrapped
  in `<g class="qg" data-item="loop" data-index="k">` so the line and its dots show only while k is active. Do not
  use `data-beam` here: it writes `stroke-dasharray` inline and the dots of the line are lost.
- **Chip**: goes solid ink during each step and fades out briefly at each step change (`--hot` from the cycle's
  `--step-p`); a ring breathes with `data-pulse="1.2"`.
- **Master cycle** `pin` on `.pins`: 10 pins × 0.6 s = 6 s, one pin dot fills per beat (100 bpm).
  `data-cycles="4"` = 24 s, two decision loops. The pin cycle is the master so the `music` kick runs at 0.6 s;
  2.4 s decision steps land on every 4th kick. Keep `pin step × 4 = decision step`.
- **Packets**: each loop edge carries 1 dot (2 on the longer bottom edge), `data-period="2.4"`; alternate edges use
  `data-phase-offset="0.5"` so the flow looks continuous.
- **Sound**: `data-sfx="music"`; `blip` per decision is the only extra cue (10 cues in 24 s). No packet sounds.
- **Poster**: `data-poster="3.6"` (the second decision fully lit).

## Skeleton

Paper 1200×1600.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Typed Decisions for Coding Agents</title>
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="style.css">
<style>
  .mi-page.pp { padding: 40px 84px 34px; gap: 0; background: var(--bg); color: var(--ink); font-family: var(--font-body); }
  .pp-run { display: flex; justify-content: space-between; font-size: 14px; }
  .pp-sheet { flex: 1; display: flex; flex-direction: column; min-height: 0; }
  .pp-tb { text-align: center; margin-top: 40px; }
  .pp-title { font-family: var(--font-display); font-weight: var(--title-weight); font-size: 58px; line-height: 1.06; letter-spacing: var(--title-track); }
  .pp-subt { font-size: 22px; margin-top: 12px; }
  .pp-auth { font-style: italic; font-size: 15px; margin-top: 8px; color: var(--ink); }
  .pp-auth b { font-style: normal; font-weight: 400; margin: 0 12px; }
  .pp-orn { position: relative; width: 240px; height: 1px; margin: 14px auto 0; background: var(--ink); }
  .pp-orn::after { content: ""; position: absolute; left: 50%; top: -3.5px; width: 8px; height: 8px; margin-left: -4px; border-radius: 50%; background: var(--ink); }
  .pp-kick { text-align: center; font-size: 13px; font-weight: 600; letter-spacing: 0.16em; margin-top: 26px; }

  .fig { position: relative; height: 440px; margin-top: 16px; font-family: var(--font-body); }
  .fig > * { position: absolute; }
  .nd { border: 1.5px solid var(--ink); background: var(--bg); display: flex; flex-direction: column; justify-content: center; align-items: center; line-height: 1.15; }
  .nd b { font-size: 18px; font-weight: 700; }
  .nd i { font-size: 13px; }
  .nd.w { gap: 6px; }
  .nd.w small { font-size: 12px; letter-spacing: 0.12em; padding: 0 8px 4px; border-bottom: 1px solid var(--ink); }
  .nd.w i { font-size: 19px; }
  .note { font-style: italic; font-size: 13px; transform: translateX(-50%); white-space: nowrap; }
  .qq { font-style: italic; font-size: 14px; white-space: nowrap; transform: translateX(-50%); color: color-mix(in oklab, var(--ink) calc(55% + var(--on, 0) * 45%), var(--bg)); font-weight: calc(400 + var(--on, 0) * 200); }
  .dia { width: 116px; height: 50px; clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); background: var(--ink); display: grid; place-items: center; }
  .dia::before, .dia::after { content: ""; position: absolute; inset: 1.6px 3.7px; clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); }
  .dia::before { background: repeating-linear-gradient(-45deg, var(--ink) 0 1px, var(--bg) 1px 5.5px); }
  .dia::after { background: var(--ink); opacity: var(--on, 0); }
  .tag { position: relative; z-index: 1; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; padding: 1px 5px 0; border: 1px solid color-mix(in oklab, var(--bg) calc(var(--on, 0) * 100%), var(--ink));
    background: color-mix(in oklab, var(--ink) calc(var(--on, 0) * 100%), var(--bg)); color: color-mix(in oklab, var(--bg) calc(var(--on, 0) * 100%), var(--ink)); }
  .chip { width: 84px; height: 84px; border: 2px solid var(--ink); display: grid; place-items: center;
    --hot: clamp(0, min(var(--step-p, 0.5) * 8, (1 - var(--step-p, 0.5)) * 8), 1);
    background: color-mix(in oklab, var(--ink) calc(var(--hot) * 100%), var(--bg));
    box-shadow: 0 0 0 calc(3px + var(--pulse, 0) * 5px) var(--bg), 0 0 0 calc(4px + var(--pulse, 0) * 5px) color-mix(in oklab, var(--ink) calc(var(--hot) * (1 - var(--pulse, 0)) * 60%), var(--bg)); }
  .chip::before { content: ""; position: absolute; inset: 5px; border: 1px solid color-mix(in oklab, var(--bg) calc(var(--hot) * 100%), var(--ink)); }
  .chip span { font-family: var(--font-display); font-weight: 700; font-size: 22px; letter-spacing: 0.12em; color: color-mix(in oklab, var(--bg) calc(var(--hot) * 100%), var(--ink)); }
  .pins { width: 84px; height: 84px; }
  .pin { position: absolute; width: 22px; height: 1.5px; background: var(--ink); }
  .pin::after { content: ""; position: absolute; width: 9px; height: 9px; border-radius: 50%; border: 1.5px solid var(--ink); background: color-mix(in oklab, var(--ink) calc(var(--on, 0) * 100%), var(--bg)); scale: calc(1 + var(--on, 0) * 0.35); }
  .pin.t, .pin.b { width: 1.5px; height: 22px; left: var(--k); }
  .pin.t { bottom: 100%; } .pin.b { top: 100%; }
  .pin.l, .pin.r { top: var(--k); }
  .pin.l { right: 100%; } .pin.r { left: 100%; }
  .pin.t::after { top: -9px; left: -4.5px; } .pin.b::after { bottom: -9px; left: -4.5px; }
  .pin.l::after { left: -9px; top: -4.5px; } .pin.r::after { right: -9px; top: -4.5px; }
  .legend { display: flex; align-items: center; gap: 12px; font-style: italic; font-size: 13px; }
  .legend i { width: 40px; height: 16px; clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); background: var(--ink); position: relative; }
  .legend i::after { content: ""; position: absolute; inset: 1.4px 3.2px; clip-path: inherit; background: var(--bg); }
  .fig svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
  .lp { fill: none; stroke: var(--ink); stroke-width: 1.3; stroke-dasharray: 6 5; }
  .ar { fill: none; stroke: var(--ink); stroke-width: 1.5; }
  .ahp { fill: var(--ink); }
  .qline { fill: none; stroke: var(--ink); stroke-width: 1.8; stroke-dasharray: 0.1 6; stroke-linecap: round; }
  .qg { opacity: var(--on, 0); }
  .fig .mi-packet { fill: var(--ink); }

  .cap { font-size: 14px; line-height: 1.45; text-align: justify; margin-top: 22px; }
  .cap b { font-weight: 700; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 30px; flex: 1; min-height: 0; }
  .col { display: flex; flex-direction: column; }
  .sh { text-align: center; font-weight: 400; font-size: 17px; font-variant: small-caps; letter-spacing: 0.02em; margin: 0 0 6px; }
  .sh .t { position: relative; display: inline-block; }
  .sh .ul { position: absolute; left: -4px; right: -4px; bottom: -2px; height: 1.5px; background: var(--ink); opacity: var(--on, 0); }
  .col p { font-size: 17px; line-height: 1.46; text-align: justify; hyphens: auto; text-indent: 1.1em; }
  .col p.ni { text-indent: 0; }
  .col .sh + p { text-indent: 0; }
  .col .gap { height: 20px; }
  .ld { font-style: italic; padding: 0 3px; margin: 0 -3px; box-decoration-break: clone; -webkit-box-decoration-break: clone;
    background: color-mix(in oklab, var(--ink) calc(var(--on, 0) * 85%), transparent); color: color-mix(in oklab, var(--bg) calc(var(--on, 0) * 100%), var(--ink)); }
  .lst { border-top: 1.2px solid var(--ink); border-bottom: 1.2px solid var(--ink); padding: 9px 0; margin-bottom: 22px; font-family: var(--font-mono); font-size: 14px; line-height: 1.6; }
  .ln { white-space: pre; padding-left: 8px; border-left: 3px solid color-mix(in oklab, var(--ink) calc(var(--on, 0) * 100%), transparent); background: color-mix(in oklab, var(--ink) calc(var(--on, 0) * 11%), transparent); }
  .ln::after { content: ""; display: inline-block; width: 0.55em; height: 1.05em; margin-left: 2px; vertical-align: -0.2em; background: var(--ink); opacity: var(--on, 0); }
  .ln.x { border-left-color: transparent; background: none; }
  .ln.x::after { display: none; }
  .tcap { text-align: center; margin-top: 14px; }
  .tcap b { display: block; font-size: 15px; letter-spacing: 0.06em; }
  .tcap span { display: block; font-size: 16px; font-variant: small-caps; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 14.5px; border-top: 1.5px solid var(--ink); border-bottom: 1.5px solid var(--ink); }
  th { text-align: left; font-weight: 700; padding: 6px 6px 5px; border-bottom: 0.8px solid var(--ink); }
  td { padding: 5px 6px; }
  td.m { font-family: var(--font-mono); font-size: 14px; }
  tbody tr { background: color-mix(in oklab, var(--ink) calc(var(--on, 0) * 9%), transparent); }
  tbody td:first-child { position: relative; }
  tbody td:first-child::before { content: ""; position: absolute; left: -12px; top: 3px; bottom: 3px; width: 3px; background: var(--ink); opacity: var(--on, 0); }
  .pp-foot { display: grid; grid-template-columns: 1fr auto 1fr; font-size: 14px; margin-top: 10px; }
</style>
</head>
<body data-canvas="paper" data-cycles="4" data-sfx="music" data-fps="30" data-poster="3.6">
<main class="mi-page pp">
  <div class="pp-run"><span>2026 Working Note on Agent Tooling</span><span>September 2026</span></div>

  <div class="pp-sheet" data-cycle="loop" data-step="2.4" data-sfx="blip">
    <header class="pp-tb">
      <h1 class="pp-title">Typed Decisions<br>for Coding Agents</h1>
      <div class="pp-subt">Five Small Judgments Around Every Loop, and What They Cost</div>
      <div class="pp-auth">m. tran<b>&middot;</b>platform tooling<b>&middot;</b>rev. 3<b>&middot;</b>internal working note, not a product spec</div>
      <div class="pp-orn"></div>
      <div class="pp-kick">THE CODING LOOP, WITH ITS DECISIONS MARKED</div>
    </header>

    <div class="fig">
      <svg>
        <defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="ahp" d="M0,0 L10,5 L0,10 z"></path></marker></defs>
        <path class="lp" data-link="#task@top #d0@left" data-packets="1" data-period="2.4" data-r="3.5"></path>
        <path class="lp" data-link="#d0 #rd" data-shape="straight" data-packets="1" data-period="2.4" data-r="3.5" data-phase-offset="0.5"></path>
        <path class="lp" data-link="#rd #d1" data-shape="straight" data-packets="1" data-period="2.4" data-r="3.5"></path>
        <path class="lp" data-link="#d1 #wr" data-shape="straight" data-packets="1" data-period="2.4" data-r="3.5" data-phase-offset="0.5"></path>
        <path class="lp" data-link="#wr@right #d2@top" data-packets="1" data-period="2.4" data-r="3.5"></path>
        <path class="lp" data-link="#d2@bottom #run@right" data-packets="1" data-period="2.4" data-r="3.5" data-phase-offset="0.5"></path>
        <path class="lp" data-link="#run #ts" data-shape="straight" data-packets="1" data-period="2.4" data-r="3.5"></path>
        <path class="lp" data-link="#ts #d3" data-shape="straight" data-packets="1" data-period="2.4" data-r="3.5" data-phase-offset="0.5"></path>
        <path class="lp" data-link="#d3 #d4" data-shape="straight" data-packets="2" data-period="2.4" data-r="3.5"></path>
        <path class="lp" data-link="#d4@left #task@bottom" data-packets="1" data-period="2.4" data-r="3.5" data-phase-offset="0.5"></path>
        <path class="ar" data-link="#d2@left #ok@right" data-shape="straight" marker-end="url(#ah)"></path>
        <path class="ar" data-link="#d3@bottom #halt@top" data-shape="straight" marker-end="url(#ah)"></path>
        <g class="qg" data-item="loop" data-index="0"><path class="qline" data-link="#chip@top #d0@bottom" data-shape="straight" data-packets="2" data-period="1.2" data-r="3" data-reverse></path></g>
        <g class="qg" data-item="loop" data-index="1"><path class="qline" data-link="#chip@top #d1@bottom" data-shape="straight" data-packets="2" data-period="1.2" data-r="3" data-reverse></path></g>
        <g class="qg" data-item="loop" data-index="2"><path class="qline" data-link="#chip@right #d2@top" data-bend="0.3" data-packets="2" data-period="1.2" data-r="3" data-reverse></path></g>
        <g class="qg" data-item="loop" data-index="3"><path class="qline" data-link="#chip@bottom #d3@top" data-shape="straight" data-packets="2" data-period="1.2" data-r="3" data-reverse></path></g>
        <g class="qg" data-item="loop" data-index="4"><path class="qline" data-link="#chip@left #d4@top" data-shape="straight" data-packets="2" data-period="1.2" data-r="3" data-reverse></path></g>
      </svg>

      <div class="nd" id="task" style="left:0;top:173px;width:120px;height:64px"><b>task</b><i>brief + repo</i></div>
      <div class="nd" id="rd" style="left:383px;top:51px;width:124px;height:58px"><b>read</b><i>top chunks only</i></div>
      <div class="nd w" id="wr" style="left:680px;top:40px;width:200px;height:84px"><small>WRITE CODE &middot; LLM</small><i>the frontier model</i></div>
      <div class="nd" id="ok" style="left:722px;top:183px;width:136px;height:44px"><b>you approve</b></div>
      <span class="note" style="left:790px;top:233px">if irreversible</span>
      <div class="nd" id="ts" style="left:643px;top:301px;width:124px;height:58px"><b>tests</b><i>fresh evidence</i></div>
      <div class="nd" id="run" style="left:793px;top:301px;width:124px;height:58px"><b>run</b><i>in a worktree</i></div>
      <div class="nd" id="halt" style="left:485px;top:393px;width:140px;height:42px"><b>halt: ask you</b></div>

      <div class="dia" id="d0" data-item="loop" data-index="0" style="left:242px;top:55px"><span class="tag">SCORE</span></div>
      <div class="dia" id="d1" data-item="loop" data-index="1" style="left:532px;top:55px"><span class="tag">CHOICE</span></div>
      <div class="dia" id="d2" data-item="loop" data-index="2" style="left:914px;top:180px"><span class="tag">GATE</span></div>
      <div class="dia" id="d3" data-item="loop" data-index="3" style="left:497px;top:305px"><span class="tag">GATE</span></div>
      <div class="dia" id="d4" data-item="loop" data-index="4" style="left:242px;top:305px"><span class="tag">SCORE</span></div>
      <i class="qq" data-item="loop" data-index="0" style="left:300px;top:26px">which files?</i>
      <i class="qq" data-item="loop" data-index="1" style="left:590px;top:26px">which model?</i>
      <i class="qq" data-item="loop" data-index="2" style="left:912px;top:234px">safe to run?</i>
      <i class="qq" data-item="loop" data-index="3" style="left:600px;top:362px">done?</i>
      <i class="qq" data-item="loop" data-index="4" style="left:300px;top:362px">keep or drop?</i>

      <div class="pins" data-cycle="pin" data-step="0.6" data-master style="left:478px;top:163px">
        <i class="pin t" style="--k:20px" data-item="pin" data-index="0"></i>
        <i class="pin t" style="--k:41px" data-item="pin" data-index="1"></i>
        <i class="pin t" style="--k:62px" data-item="pin" data-index="2"></i>
        <i class="pin r" style="--k:28px" data-item="pin" data-index="3"></i>
        <i class="pin r" style="--k:55px" data-item="pin" data-index="4"></i>
        <i class="pin b" style="--k:62px" data-item="pin" data-index="5"></i>
        <i class="pin b" style="--k:41px" data-item="pin" data-index="6"></i>
        <i class="pin b" style="--k:20px" data-item="pin" data-index="7"></i>
        <i class="pin l" style="--k:55px" data-item="pin" data-index="8"></i>
        <i class="pin l" style="--k:28px" data-item="pin" data-index="9"></i>
      </div>
      <div class="chip" id="chip" data-pulse="1.2" style="left:478px;top:163px"><span>ARB</span></div>
      <div class="legend" style="left:0;top:404px"><i></i>typed decision, no code written</div>
    </div>

    <p class="cap"><b>Fig. 1. The coding loop with its decisions marked.</b> Only one station writes code. The five diamonds are judgments with a small answer space: which files to read, which model gets the step, whether a command may run, whether the task is done, and which tool output is worth keeping. A small classifier (ARB) answers each one; two of them exit to a person instead of looping again.</p>

    <div class="cols">
      <div class="col">
        <h3 class="sh"><span class="t"><span class="ul" data-item="loop" data-index="0"></span><span class="ul" data-item="loop" data-index="1"></span>I. Reading and Routing</span></h3>
        <p>Watch a coding agent for an hour and count what it does. A minority of turns write code. The rest decide something small, and the same frontier model answers each one inside a long context, in prose that the harness parses back into a branch.</p>
        <p>That is the expensive way to make a choice with four possible answers. Each question below has a type, a small answer space and a fixed place on the loop.</p>
        <p><i class="ld" data-item="loop" data-index="0">Which files?</i> A Score over candidate chunks from search, so the model reads the top six instead of all forty grep hits.</p>
        <p><i class="ld" data-item="loop" data-index="1">Which model?</i> A Choice between four tiers, picked by the shape of the step. A rename goes to a cheap model; a design change goes to the frontier.</p>
        <div class="gap"></div>
        <h3 class="sh"><span class="t"><span class="ul" data-item="loop" data-index="2"></span><span class="ul" data-item="loop" data-index="3"></span>II. Gates Around the Run</span></h3>
        <p><i class="ld" data-item="loop" data-index="2">Safe to run?</i> A Gate per risk that the policy names: deletes, network calls, rewritten history. Anything irreversible waits for a person.</p>
        <p><i class="ld" data-item="loop" data-index="3">Done?</i> A Gate read against fresh test output, not the agent's own summary. When the brief is too vague to judge, the loop halts and asks you.</p>
        <p>Both gates can end the loop. Every other diamond only steers it, so a wrong answer there costs one extra turn, not a bad commit.</p>
      </div>
      <div class="col">
        <div class="lst">
          <div class="ln x">q = arb.ask(state=step, questions={</div>
          <div class="ln" data-item="loop" data-index="0">    "files": Score(over=hits, top=6),</div>
          <div class="ln" data-item="loop" data-index="1">    "tier":  Choice(["cheap", "mid", "frontier"]),</div>
          <div class="ln" data-item="loop" data-index="2">    "safe":  Gate(risk=["delete", "network"]),</div>
          <div class="ln" data-item="loop" data-index="3">    "done":  Gate(evidence=tests.latest),</div>
          <div class="ln" data-item="loop" data-index="4">    "keep":  Score(over=tool_outputs, min=0.3),</div>
          <div class="ln x">})</div>
        </div>
        <h3 class="sh"><span class="t"><span class="ul" data-item="loop" data-index="4"></span>III. Keeping the Context</span></h3>
        <p><i class="ld" data-item="loop" data-index="4">Keep or drop?</i> A Score over each tool output in a long run, so compaction keeps the survivors verbatim instead of folding everything into a lossy paragraph.</p>
        <p>Price one decision two ways. The frontier call re-reads a 120,000 token context; ARB sees only the scoped state of the step.</p>
        <div class="tcap"><b>TABLE I</b><span>Five Decisions, Typed and Priced</span></div>
        <table>
          <thead><tr><th>Question</th><th>Type</th><th>Answers</th><th>Frontier</th><th>ARB</th></tr></thead>
          <tbody>
            <tr data-item="loop" data-index="0"><td>which files?</td><td>Score</td><td>top 6</td><td class="m">$0.130</td><td class="m">$0.0001</td></tr>
            <tr data-item="loop" data-index="1"><td>which model?</td><td>Choice</td><td>4 tiers</td><td class="m">$0.130</td><td class="m">$0.0001</td></tr>
            <tr data-item="loop" data-index="2"><td>safe to run?</td><td>Gate</td><td>yes / ask</td><td class="m">$0.130</td><td class="m">$0.0002</td></tr>
            <tr data-item="loop" data-index="3"><td>done?</td><td>Gate</td><td>yes / halt</td><td class="m">$0.130</td><td class="m">$0.0002</td></tr>
            <tr data-item="loop" data-index="4"><td>keep or drop?</td><td>Score</td><td>0&ndash;1 each</td><td class="m">$0.260</td><td class="m">$0.0003</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <footer class="pp-foot"><span>Typed Decisions for Coding Agents</span><span>1</span><span></span></footer>
</main>
<script src="motion.js"></script>
</body>
</html>
```

## Adapting

- **Decision count**: 3-6 diamonds. Use `pins = 2 × decisions` and `pin step × 4 = decision step`, so two pin
  laps equal one decision loop (4 decisions: 8 pins; 6 decisions: 12 pins, 3 per side). Set `data-cycles` to
  2 × the number of decision loops you want.
- **Figure geometry**: the figure is a 1032×440 box with absolute `left/top` per node; connectors are measured by
  `data-link`, so move boxes freely. Keep diamonds 116×50 (the hatch inset `1.6px 3.7px` matches that ratio). Pick
  `@side` anchors so query lines do not cross boxes or labels, and put a question label where no line runs (the
  right diamond has its label below-left because both the loop and the query line arrive at its top).
- **Body**: 2 section heads in the left column and 1 in the right column. Each section head needs one `.ul` span
  per decision it covers. Lead phrases must be short (≤ 3 words) because the highlight box is inline.
- **Code listing**: ≤ 52 characters per line at 14 px mono; the first and last lines use `.ln.x` (no highlight).
- **Table**: ≤ 5 columns, one row per decision; put numbers in `td.m` (mono).
- **Styles**: made for `white-paper` (grayscale). Other styles work because all colours are tokens, but the loop and
  table read best with a light style (`consulting-report`, `paper-doc`, `ui-wireframe`).
- **Pitfalls**: nothing may overflow the page, so check the poster PNG after changing text; keep body text ≥ 15 px
  and labels ≥ 12 px. A `.fig > *` child is absolutely positioned, so give every figure element a `left/top`.
