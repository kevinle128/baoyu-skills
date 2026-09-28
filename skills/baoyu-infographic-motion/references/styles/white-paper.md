# white-paper

LaTeX / IEEE research paper in pure grayscale: a white page, near-black ink, a STIX serif close to Computer Modern,
small-caps labels, hairline booktabs rules and a light code listing between top and bottom rules. Every colour token
is black or a gray step, so emphasis comes from ink fills, hatching, weight and italics, not hue.

- **Mood**: academic, sober, "an animated figure from a working paper"
- **Palette**: bg `#ffffff`, ink `#111111`, muted `#555555`, rule `#c9c9c9`, listing `#f4f4f4`; `--c1`…`--c6` = `#111111`, `#333333`, `#4d4d4d`, `#666666`, `#7f7f7f`, `#999999` (accent = `--c1`)
- **Fonts**: STIX Two Text (title and body, the closest Google Font to Computer Modern), Inconsolata (code, numbers in tables). Section heads and labels use small caps; `--title-case` and `--label-case` are `none`
- **Ambient motion**: none in the style. All motion comes from the layout: ink fills, highlight boxes, packets and cursors. Dashed `.mi-edge` connectors, hatched `.mi-bar` fills and a hub ring that breathes with `--pulse`
- **Best for**: research notes, technical working papers, RFC-style explainers, agent / system loops told as a paper figure
- **Pairs with**: `paper-page` (designed for it: canvas `paper`, running header, figure, two-column body, code listing, IEEE table); also works with `doc-terminal`. Layouts that tell items apart only by colour (`venn-diagram`, `cluster-map`, `periodic-table`, colour-coded `bento-grid` or `comparison-matrix` columns) lose meaning in monochrome: use them only when labels, position or hatching carry the difference
- **Sound**: `music` with `paper-page` (kick on the chip-pin beat, `blip` per decision); `soft` for calm list layouts
- **GIF**: almost pure black and white, the smallest GIFs of all styles. Use no dither so hatching and dotted lines stay crisp
