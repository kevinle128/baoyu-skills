---
name: baoyu-infographic-motion
description: Generates animated infographics as HTML/CSS/JS and exports them to MP4 (with synthesized sound effects), GIF and a PNG poster. Offers 20 motion layouts and 41 visual styles, with a deterministic frame-by-frame renderer so videos loop seamlessly. Use when the user asks for an "animated infographic", "motion infographic", "infographic video", "GIF infographic", "动态信息图", "信息图视频", "infographic động", or wants an existing infographic to move.
version: 1.0.0
metadata:
  openclaw:
    homepage: https://github.com/JimLiu/baoyu-skills#baoyu-infographic-motion
    requires:
      anyBins:
        - bun
        - npx
---

# Motion Infographic Generator

Turns content into a living infographic: the full picture is on screen from the first frame, and motion
keeps it alive — a highlight steps through the items, connectors draw with travelling dots, packets flow,
numbers tick, logs stream, and sound effects land on the exact frame of each step. Three dimensions:
**layout** (information structure + motion recipe) × **style** (CSS tokens + ambient decoration) ×
**sound** (`soft`, `music`, `none`).

## User Input Tools

When this skill prompts the user, follow this tool-selection rule (priority order):

1. **Prefer built-in user-input tools** exposed by the current agent runtime — e.g., `AskUserQuestion`, `request_user_input`, `clarify`, `ask_user`, or any equivalent.
2. **Fallback**: if no such tool exists, emit a numbered plain-text message and ask the user to reply with the chosen number/answer for each question.
3. **Batching**: if the tool supports multiple questions per call, combine all applicable questions into a single call; if only single-question, ask them one at a time in priority order.

Concrete `AskUserQuestion` references below are examples — substitute the local equivalent in other runtimes.

## Script Directory

**Important**: All scripts are located in the `scripts/` subdirectory of this skill.

**Agent Execution Instructions**:
1. Determine this SKILL.md file's directory path as `{baseDir}`
2. Script path = `{baseDir}/scripts/<script-name>.ts`
3. Resolve `${BUN_X}` runtime: if `bun` installed → `bun`; if `npx` available → `npx -y bun`; else suggest installing bun
4. Replace all `{baseDir}` and `${BUN_X}` in this document with actual values

**Script Reference**:
| Script | Purpose |
|--------|---------|
| `scripts/main.ts init <dir> --style <s> --canvas <c>` | Scaffold `index.html`, `motion.js`, `motion.css`, `style.css` |
| `scripts/main.ts export <dir>/index.html [--format mp4,gif,png]` | Render frames in headless Chrome → MP4 + GIF + poster |
| `scripts/main.ts preview <dir>/index.html` | Open the page in the default browser (play / scrub / sound toggle) |
| `scripts/main.ts list styles\|layouts` | List installed styles and layouts |

Export flags: `--out <dir>` `--name infographic` `--fps 30` `--duration <s>` `--cycles <n>` `--bpm <n>`
`--sfx soft|music|none` `--music <file>` `--music-volume 0.35` `--gif-fps 15` `--gif-width 540`
`--gif-colors 256` `--gif-dither bayer|sierra|none` `--scale 1` `--quality 92`. Stdout is one JSON line: `{"status":"ok","files":{…},…}` or
`{"status":"error","error":"…"}`.

**Requirements**: Bun, Google Chrome / Chromium / Edge (override with `BAOYU_CHROME_PATH`), `ffmpeg` on
`PATH` (`brew install ffmpeg`). If ffmpeg is missing, tell the user; PNG export still works without it.

## Confirmation Policy

Default: **confirm before building**. Skill invocation, file paths, EXTEND.md defaults and the default
combination are recommendation inputs only. Do not start Step 5 until the user confirms Step 4, unless the
current request explicitly says to skip confirmation (`--no-confirm`, "直接生成", "không cần hỏi", or
equivalent). If skipped, state the assumed choices before building.

## Options

| Option | Values |
|--------|--------|
| `--layout` | See Layout Gallery. Default: pick from content |
| `--style` | See Style Gallery. Default: `light-dashboard` |
| `--canvas` | `portrait` 1080×1350 (default), `square` 1080×1080, `story` 1080×1920, `landscape` 1920×1080, `WxH` |
| `--sfx` | `soft` (default), `music`, `none` |
| `--format` | Any of `mp4,gif,png` (default all) |
| `--lang` | Language of on-screen text |
| `--no-confirm` | Skip Step 4 |

## Layout Gallery (20)

| Layout | Shows | Motion |
|--------|-------|--------|
| `card-pipeline` | 3–4 stage cards + loop row | Stage highlight, beams between cards, nested row / code hops, validation badge |
| `orbit-panel` | Centre concept + orbiting items | Orbit spin, active node beams to centre, detail panel swap |
| `columns-to-hub` | Two lists feeding one hub | Card spotlight, curved beam into hub, hub recolours |
| `fan-in` | Many sources → one result | Curve bundles with packets converging, source spotlight |
| `cluster-map` | Grouped concepts | Drifting nodes, node-by-node and group-by-group spotlight |
| `tile-router` | Grid of options around a router | Tile highlight, beam to router, counters |
| `hub-pipeline` | Hub + satellites + step row | Satellite spotlight, step bar progress |
| `doc-terminal` | Paper / document list + live log | Row hop (done / reading / queued), streaming terminal |
| `live-dashboard` | KPIs and live data | Tickers, sparklines, gauges, meters, clock |
| `linear-progression` | Timeline, steps | Highlight travels along the line with beam + counter |
| `circular-flow` | Cycle | Active arc draws around the ring |
| `funnel` | Conversion, filtering | Stages light top→bottom, packets fall, numbers count |
| `comparison-matrix` | Multi-factor comparison | Row / column spotlight hop |
| `binary-comparison` | A vs B | Alternating sides, verdict swap |
| `hierarchical-layers` | Pyramid, priorities | Layer-by-layer lift |
| `tree-branching` | Taxonomy | Beams draw root → leaves |
| `bento-grid` | Overview, dense modules | Tile spotlight with live mini widgets |
| `winding-roadmap` | Journey, milestones | Dot travels an S-curve, milestone pops |
| `venn-diagram` | Overlaps | Circles pulse, intersection highlights |
| `periodic-table` | Categorized collection | Cell spotlight + detail panel swap |

Full definition + tested HTML skeleton: `references/layouts/<layout>.md`.

## Style Gallery (41)

| Style | Look |
|-------|------|
| `light-dashboard` | Off-white research dashboard, condensed caps, mono body (default) |
| `clean-light-cards` | Airy white cards, soft shadows |
| `light-terminal` | Light dashboard with LCD digits |
| `paper-doc` | Cream paper, serif titles, academic |
| `white-paper` | Corporate / consulting white paper: white, navy, one accent, serif headline |
| `cream-pastel` | Notebook pastel |
| `amber-fieldnote` | Warm field-notebook amber on dark |
| `terminal-amber` | Amber terminal on black |
| `phosphor-crt` | Green phosphor CRT |
| `neon-constellation` | Dark sky, glowing nodes, starfield |
| `gold-dust` | Black and gold particles |
| `midnight-grid` | Dark grid, 5 category colours |
| `pink-brutalist` | Pink, thick black borders, hard shadows |
| `technical-schematic` | Blueprint engineering |
| `ui-wireframe` | Grayscale interface mockup |
| `subway-map` | Transit-map lines and stations |
| `bold-graphic` | Comic bold, halftone |
| `corporate-memphis` | Flat vector, vibrant shapes |
| `chalkboard` | Chalk on board |
| `pixel-art` | Retro 8-bit |
| `cyberpunk-neon` | Neon glow, futuristic |
| `synthwave-sunset` | Retro sun, neon grid floor |
| `aurora-glass` | Aurora gradients + glass cards |
| `holo-foil` | Iridescent holographic shimmer |
| `acid-lime` | Black + acid lime, high contrast |
| `risograph-pop` | Riso duotone, grain, misregistration |
| `y2k-chrome` | Metallic chrome, glossy Y2K |
| `mesh-gradient` | Animated mesh gradient, SaaS glass |
| `comic-halftone` | Pop-art halftone, thick outlines |
| `swiss-poster` | Swiss grid, red + black type |
| `candy-3d` | Soft 3D clay / candy |
| `motorsport-telemetry` | F1 pit wall, carbon fibre, racing red, speed streaks |
| `tactical-hud` | Military HUD, olive + amber, radar sweep |
| `stealth-carbon` | Matte black + gunmetal, safety-orange accent |
| `industrial-hazard` | Dark steel, rivets, marching hazard chevrons |
| `mission-control` | Space ops telemetry, navy + orange + cyan |
| `blackout-red` | Black + signal red, brutal condensed type, glitch |
| `finance-terminal` | Trading terminal, amber data, ticker tape |
| `topo-expedition` | Expedition charcoal, drifting contour lines, blaze orange |
| `esports-arena` | Esports broadcast, electric blue + volt, angular panels |
| `sports-broadcast` | TV sports graphics, navy + red, slanted lower thirds |

Details (palette, fonts, pairings, sound, GIF notes): `references/styles/<style>.md`. CSS: `assets/styles/<style>.css`.

## Recommended Combinations

| Content | Layout + Style | Sound |
|---------|----------------|-------|
| AI / research paper | `card-pipeline` + `light-dashboard` | soft |
| System architecture | `hub-pipeline` + `technical-schematic` | soft |
| Concept map / ecosystem | `orbit-panel` + `neon-constellation` | soft |
| Many inputs → one outcome | `fan-in` + `gold-dust` | soft |
| Paper reading notes | `doc-terminal` + `paper-doc` | soft |
| Business report / white paper | `funnel` or `comparison-matrix` + `white-paper` | soft |
| Metrics / report | `live-dashboard` + `light-terminal` | soft |
| Process / tutorial | `linear-progression` + `clean-light-cards` | soft |
| Marketing funnel | `funnel` + `mesh-gradient` | music |
| A vs B | `binary-comparison` + `swiss-poster` | music |
| Product launch / trend | `bento-grid` + `aurora-glass` | music |
| Journey / roadmap | `winding-roadmap` + `synthwave-sunset` | music |
| Fun explainer | `periodic-table` + `comic-halftone` | music |
| Performance / benchmarks | `live-dashboard` + `motorsport-telemetry` | music |
| Strategy / security / ops | `orbit-panel` + `tactical-hud` | soft |
| Markets / finance | `comparison-matrix` + `finance-terminal` | soft |
| Head-to-head, bold take | `binary-comparison` + `blackout-red` | music |
| Rankings / leaderboards | `tile-router` + `sports-broadcast` | music |

## Output Structure

```
infographic-motion/{topic-slug}/
├── source-{slug}.{ext}
├── analysis.md
├── structured-content.md
├── index.html  motion.js  motion.css  style.css
├── infographic.png        # poster (frame at data-poster)
├── infographic.mp4        # video with sound
└── infographic.gif
```

Slug: 2–4 words, kebab-case. If the folder exists, append `-YYYYMMDD-HHMMSS`.

## Workflow

### Step 1: Setup & Analyze

**1.1 Load preferences (EXTEND.md)** — first match wins:

| Priority | Path |
|----------|------|
| 1 | `.baoyu-skills/baoyu-infographic-motion/EXTEND.md` |
| 2 | `${XDG_CONFIG_HOME:-$HOME/.config}/baoyu-skills/baoyu-infographic-motion/EXTEND.md` |
| 3 | `$HOME/.baoyu-skills/baoyu-infographic-motion/EXTEND.md` |

Found → read it and show a one-line summary. Not found → run `references/config/first-time-setup.md`.
Schema: `references/config/preferences-schema.md`.

**1.2 Analyze → `analysis.md`**: save the source (`source-{slug}.md`), then analyze topic, data type,
complexity, tone, audience, language and design instructions (`references/analysis-framework.md`).
Back up an existing `analysis.md` as `analysis-backup-YYYYMMDD-HHMMSS.md`.

### Step 2: Structured content → `structured-content.md`

Use `references/structured-content-template.md`. Preserve data exactly; add nothing new; strip secrets.
Then plan the motion: which items form the **master cycle** (3–8 items, one per step), which lists become
nested clocks, which numbers become tickers or count-ups. Short labels only (see `html-contract.md` rule 4).

### Step 3: Recommend

Recommend 3–4 layout × style × sound combinations with one-line reasons, based on information shape
(layout), tone and platform (style: calm research → light/paper styles; social feed → eye-catching
styles), and energy (sound). Put EXTEND.md preferences first.

### Step 4: Confirm

Ask in one call (see User Input Tools):

| Priority | Question | When |
|----------|----------|------|
| 1 | Combination (layout + style + sound) | Always |
| 2 | Canvas | Always |
| 3 | Outputs (MP4 + GIF + PNG / MP4 only / GIF only) and length (cycles) | Always |
| 4 | Language | Only if source language ≠ user language |

### Step 5: Build the page

1. `${BUN_X} {baseDir}/scripts/main.ts init <out-dir> --style <style> --canvas <canvas>`
2. Read `references/html-contract.md`, `references/motion-primitives.md`, `references/sfx.md` and
   `references/layouts/<layout>.md`.
3. Replace the scaffold `index.html` with the layout skeleton, then put in the real content from
   `structured-content.md`. Keep the page chrome (crumb, title with `<em>` accent word, sub path, rule,
   stat band, footer with `wordmark`). Colours only via tokens (`var(--c1)` … ) so the style controls them.
4. Set `<body data-cycles data-sfx data-poster>`: aim for 12–30 s total; poster time ≈ 60 % into the
   first step so the thumbnail shows a highlighted item.

### Step 6: Check the poster (required)

1. `${BUN_X} {baseDir}/scripts/main.ts export <out-dir>/index.html --format png`
2. View `infographic.png`. Check: nothing overflows or overlaps, text readable, every region filled, the
   accent / highlight visible, connectors attach to the right boxes.
3. Fix and repeat. For motion, run a quick check:
   `export … --format mp4 --fps 8 --cycles 1 --sfx none`, then view a contact sheet
   (`ffmpeg -i infographic.mp4 -vf "fps=2,scale=360:-1,tile=4x3" -frames:v 1 sheet.png`).
4. Optionally `main.ts preview` so the user can play it with sound.

### Step 7: Export

`${BUN_X} {baseDir}/scripts/main.ts export <out-dir>/index.html --format <formats> [--sfx <profile>]`

- A 24 s portrait video at 30 fps takes about 40–60 s.
- On failure, read the JSON `error`, fix the page (or install the missing tool) and retry once.
- Back up existing outputs as `infographic-backup-YYYYMMDD-HHMMSS.<ext>` before re-exporting.
- If the user supplies music, pass `--music <file>` and remind them to use only music they have rights to.

### Step 8: Output summary

Report: topic, layout, style, sound profile, canvas, duration / fps, cue count, file paths (MP4, GIF, PNG,
`index.html` for live preview), and the command to re-export.

## Changing Preferences

Edit EXTEND.md directly (schema: `references/config/preferences-schema.md`), delete it to re-run
first-time setup, or ask "reconfigure baoyu-infographic-motion preferences".

## References

- `references/html-contract.md` — page structure, `<body>` settings, rules
- `references/motion-primitives.md` — every `data-*` primitive
- `references/sfx.md` — sound profiles and cues
- `references/layouts/<layout>.md` — 20 layouts with tested skeletons
- `references/styles/<style>.md` — 41 styles
- `references/analysis-framework.md`, `references/structured-content-template.md` — content analysis
