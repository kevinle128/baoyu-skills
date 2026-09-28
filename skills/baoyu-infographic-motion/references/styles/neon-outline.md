# neon-outline

A black control-room board where every card wears its own neon outline: a pure black page, a bold Space Grotesk
headline with one glowing phrase, thin card borders in the card's own colour with a soft outer glow that swells when
the card is active, near-black interiors tinted a touch by that colour, outlined pill badges, and bars and rings that
glow in the card colour.

- **Mood**: after-hours ops board, "many agents, one wall of screens", launch-night dashboard
- **Palette**: bg `#050506`, panel `#0c0c0f`, panel 2 `#121216`, line `#24262c`, ink `#f2f3f5`, muted `#8a8f98`, green `#3ee07a` (accent), blue `#3aa0ff`, orange `#ff8a2a`, violet `#8f6bff`, red `#ff4d5e`, amber `#ffc233`
- **Fonts**: Space Grotesk (700 headline, stat values, card titles), JetBrains Mono (labels, data, body)
- **Colour per card**: set `style="--item: var(--cN)"` on every `.mi-card` and `.mi-stat`; the border, glow, tint, badges, bars and rings all follow it. A card without `--item` uses the green accent
- **Ambient motion**: none in the style. Active cards (`--on`) brighten their border and grow the outer and inner glow; beams and packets glow in their `--item` colour
- **Best for**: agent teams and multi-service dashboards, "N agents / N seats" stories, launch metrics, any page where each block has its own identity
- **Pairs with**: `bento-grid`, `live-dashboard`, `comparison-matrix`, `decision-feed`, `lane-stream`, `swarm-fanout`, `card-pipeline`. Give each card a different colour; use at most 6 colours per page
- **Sound**: `soft` (`blip` on card focus, `tick` on counters)
- **GIF**: glows band on pure black at 256 colours; prefer mp4, or keep the GIF short and at 540 px or wider
