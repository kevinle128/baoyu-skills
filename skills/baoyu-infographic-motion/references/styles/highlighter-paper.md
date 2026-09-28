# highlighter-paper

A printed handbook page marked up with a yellow highlighter: warm white paper, a centred uppercase Baskerville
headline, black-and-white diagram boxes (dark boxes for the decision layer), bold Inter labels, and yellow marker
sweeps over key phrases. Active cards lift off the page with a soft drop shadow.

- **Mood**: working notes, field manual, "the one page you print and pin up"
- **Palette**: paper `#fbfaf7`, panel `#ffffff`, ink `#141414`, muted `#62605b`, rule `#d8d5cc`, highlighter `#f7e13a` (`--hl`, also `--sel-color`), `--c1` ink, `--c2` dark gold `#8a7000` (readable as text on white; the yellow itself is `--hl`), `--c5` gold `#b39200` for beams, `--c3`/`--c4`/`--c6` grey steps
- **Fonts**: Libre Baskerville (headline, body, card titles), Inter 700 (labels, stage numbers), JetBrains Mono (values, code, chips)
- **Ambient motion**: none in the style. Motion comes from the layout: `data-select` highlighter sweeps (`.mi-select` uses the yellow), card lift on `--on`, yellow packets with an ink ring
- **Best for**: handbooks and how-to notes, agent / system loops told as a printed figure, rules lists, "three numbers to track" checklists
- **Pairs with**: `paper-page`, `card-pipeline`, `hierarchical-layers`, `linear-progression`, `comparison-matrix`, `doc-terminal`. Put `<mark>` or `.mi-select` on 1-3 phrases per block; more than that loses the effect. `paper-page` draws its own ink-filled selections, so there the yellow shows on `<mark>`, the title `em` and chips only
- **Sound**: `soft` (`blip` on each highlight, `tick` on counters)
- **GIF**: flat colours, compresses well; the drop shadows band slightly at 256 colours
