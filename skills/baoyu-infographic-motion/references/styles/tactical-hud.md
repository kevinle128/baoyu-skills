# tactical-hud

Military heads-up display on olive-black. Stencil headlines, phosphor amber and green readouts, corner
brackets on every card, segmented bars, dashed connectors, and a radar with range rings, a reticle and a rotating sweep in the top-right corner.

- **Mood**: tactical, mission-critical, "target acquired"
- **Palette**: bg `#0a0d08`, panel `#0f140c`, ink `#e4ecd2`, amber `#ffb000`, phosphor green `#8dff5a`, khaki `#d8c27a`, alert red `#ff4d3a`, cyan `#6fd6ff`, orange `#ff8a2a`
- **Fonts**: Black Ops One (titles, stencil), Chakra Petch (body), Share Tech Mono (labels, data)
- **Ambient motion**: radar sweep on `.mi-page::after` that turns 360° (6 s loop). Range rings, reticle and a left-edge range scale are static on `.mi-page::before`
- **Best for**: security / threat reports, incident timelines, monitoring and alerting, ops playbooks, competitive "battle maps"
- **Pairs with**: `orbit-panel`, `cluster-map`, `live-dashboard`, `hub-pipeline`, `doc-terminal`, `tile-router`
- **Sound**: `soft`
- **GIF**: dark flat panels compress well. The radar wedge is a soft gradient, so use dither to prevent banding
