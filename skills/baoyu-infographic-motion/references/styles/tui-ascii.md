# tui-ascii

A terminal UI drawn with characters: a slate window with a macOS-style title bar, monospace everywhere, dashed
box borders with box-drawing corner glyphs, bracketed values like `[47.3%]` and `[ok 0.90]`, and a shell prompt
footer `~/app $ …` with a blinking block caret. The active card's dashed border turns into a solid accent line and
its text brightens.

- **Mood**: hacker notebook, CLI tool demo, "this is what the agent sees in the terminal"
- **Palette**: bg `#1b1f27`, title bar `#151920`, panel `#1f2430`, line `#4a5366`, ink `#e4e8ef`, muted `#7a8394`, orange `#f0a24a` (accent), cyan `#6fd3e0`, violet `#b48cf2`, pink `#f06a8a`, green `#8fd46a`, yellow `#e8d36a`
- **Fonts**: JetBrains Mono only (800 uppercase headline, 700 card titles, 400 body)
- **Chrome added by the style**: window bar with three dots on `.mi-page::before` (the page gets 30 px extra top padding), `# ` before `.mi-crumb`, brackets around `.mi-meta`, `.mi-stat-v`, `.mi-chip`, `.mi-badge`, `│ ` before `.mi-label`, `~/app $ ` before `.mi-foot .path` and a blinking caret after it
- **Ambient motion**: footer caret blinks (1 s); everything else comes from the layout
- **Best for**: CLI and dev-tool explainers, agent loops shown as a terminal session, logs and pipelines, config or prompt walkthroughs
- **Pairs with**: `card-pipeline`, `live-dashboard`, `doc-terminal`, `source-listing`, `hierarchical-layers`, `decision-feed`, `lane-stream`
- **Sound**: `soft` (`type` on log lines, `blip` on steps)
- **GIF**: flat dark colours compress well; dashed 1.5 px borders need 540 px width or more
