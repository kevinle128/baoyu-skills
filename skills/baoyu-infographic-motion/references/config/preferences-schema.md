---
name: preferences-schema
description: EXTEND.md YAML schema for baoyu-infographic-motion user preferences
---

# Preferences Schema

```yaml
---
version: 1

preferred_layout: null     # any layout in references/layouts/ or null
preferred_style: null      # any style in assets/styles/ or null
preferred_canvas: null     # portrait|square|story|landscape|paper|WxH|null
language: null             # zh|en|ja|vi|...|null (null = detect from source)

sfx: soft                  # soft|music|none
formats: [mp4, gif, png]   # any of mp4, gif, png
fps: 30                    # export frame rate (24, 30 or 60)
cycles: null               # master cycles per video (null = let Step 3 pick)
gif_fps: 15
gif_width: 540

wordmark: null             # text for the footer mark (brand, handle), null = omit
custom_styles:             # extra CSS style files, used like built-in styles
  - name: my-brand
    file: ~/brand/motion-style.css
    description: "Brand navy + coral, rounded cards"
---
```

| Field | Default | Description |
|-------|---------|-------------|
| `preferred_layout` | null | Top recommendation in Step 3 |
| `preferred_style` | null | Top recommendation in Step 3 |
| `preferred_canvas` | null | Default canvas in Step 4 |
| `language` | null | Language of on-screen text |
| `sfx` | `soft` | Default sound profile (`references/sfx.md`) |
| `formats` | all three | Files that Step 7 exports |
| `fps` | 30 | Export frame rate |
| `cycles` | null | Default `data-cycles` |
| `gif_fps`, `gif_width` | 15, 540 | GIF size controls |
| `wordmark` | null | Footer `.mark` text |
| `custom_styles` | [] | Each `file` is a CSS file in the style format (tokens in `:root`); `init --style` cannot see it, so copy it over `style.css` after `init` |

All fields are defaults only. They never skip the Step 4 confirmation.
