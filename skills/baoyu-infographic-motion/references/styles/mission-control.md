# mission-control

NASA / SpaceX flight-operations console on deep navy-black. Squared technical headlines, white, orange and
cyan telemetry, a dot grid, orbit arcs and a tick scale at the bottom, and two comets that travel slowly along the main orbit.

- **Mood**: launch day, calm precision, "all stations go"
- **Palette**: bg `#04070d`, panel `#0a1222`, ink `#eef3fa`, launch orange `#ff7a1a`, telemetry cyan `#3cd6ff`, white `#f4f7fb`, amber `#ffcc33`, abort red `#ff5468`, nominal green `#5be38b`
- **Fonts**: Rajdhani (titles), Space Grotesk (body), Space Mono (labels, data)
- **Ambient motion**: an orange comet and a cyan comet on the main orbit ring (`.mi-page::after` turns 360°, 16 s loop). Orbit arcs, dot grid and tick scale are static on `.mi-page::before`
- **Best for**: launches and roadmaps, system status, multi-stage processes, space / science topics, countdowns and milestones
- **Pairs with**: `orbit-panel`, `circular-flow`, `winding-roadmap`, `live-dashboard`, `hub-pipeline`, `columns-to-hub`
- **Sound**: `soft`
- **GIF**: dark navy with thin lines compresses well. The orbit comets are small, so they survive colour reduction
