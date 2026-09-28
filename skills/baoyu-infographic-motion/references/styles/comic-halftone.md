# comic-halftone

Pop-art comic page: rotating yellow sunburst, red halftone dots in the corners, white cards with 4 px black
outlines and hard black drop shadows, and a Bangers headline with thick stroke and offset shadow.

- **Mood**: loud, fun, "BAM! POW!"
- **Palette**: bg `#ffdf3d`, panel `#ffffff`, ink `#111111`, red `#e3000f`, cyan-blue `#0077c8`, magenta `#d4006f`, orange `#c45200`
- **Fonts**: Bangers (titles, card titles, stats), Space Grotesk (body), Space Mono (labels, code)
- **Ambient motion**: sunburst rotates one ray per loop (24 s); halftone dots drift (2 s); active card shadow takes the item colour
- **Best for**: myth vs fact, "did you know", step-by-step how-tos, kids / education, viral stats
- **Pairs with**: `binary-comparison`, `linear-progression`, `funnel`, `comparison-matrix`, `winding-roadmap`, `tree-branching`
- **Sound**: `music`
- **GIF**: flat inks compress well; `--gif-colors 64` is enough. The rotating sunburst touches many pixels per frame, so use `--gif-fps 12`.
