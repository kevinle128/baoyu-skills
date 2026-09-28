# pastel-schematic

A clean engineering explainer: white page, bold Inter headline, solid colour pills for each concept, pastel tinted
note boxes, flat line icons with a pastel fill and one solid accent part, dashed grey arrows and small numbered step
circles. The active icon grows a little and glows in its column colour.

- **Mood**: friendly system-design explainer, newsletter diagram, "one picture that makes it click"
- **Palette**: bg `#ffffff`, panel 2 `#f7f8fc`, ink `#1b1f2a`, muted `#5d6475`, line `#d5dae6`, blue `#3563e9` (accent), teal `#1b8f9e`, violet `#7b4de0`, green `#2f7d4f`, brown `#9a6420`, orange `#e8643c`
- **Fonts**: Inter (800 headline, 700 pills and titles, body), JetBrains Mono (values, code)
- **Style classes**: `.mi-pill` (solid concept pill, colour from `--item`), `.mi-tint` (pastel note box), `.mi-ico` (icon wrapper: inline SVG with `.f` pastel fill, `.s` ink stroke (combine as `.f.s`), `.a` solid accent fill, `.k` thick accent stroke, `.w` white stroke; scales and glows with `--on`), `.mi-step` (numbered circle). Inline the icon paths (or copy them from a `<symbol>` with a small script); `<use href>` hides the parts from page CSS, so the icon renders solid black
- **Ambient motion**: none in the style. Icons react to `--on`; packets are solid dots with a white ring on dashed edges
- **Best for**: "X vs Y vs Z" comparisons, how-it-works flows, AI / system-design concepts, evolution from simple to complex
- **Pairs with**: `flow-columns`, `evolution-rows`, `sector-fan`, `card-pipeline`, `hub-pipeline`, `linear-progression`, `binary-comparison`
- **Sound**: `soft` (`blip` per step, `tick` on counters)
- **GIF**: flat colours on white, compresses very well; keep the 1.5 px dashed lines at 540 px width or more
