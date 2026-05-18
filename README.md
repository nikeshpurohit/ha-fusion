# Nova Domus

A smart home dashboard built on [Home Assistant](https://www.home-assistant.io/). Designed to be fast, configurable, and opinionated about UX in a way that suits daily use on wall-mounted panels and tablets.

This project grew out of [ha-fusion](https://github.com/matt8707/ha-fusion) by [matt8707](https://github.com/matt8707). What started as a personal fork has evolved into something different enough to deserve its own name. Full credit for the original dashboard design and architecture goes to him — Nova Domus builds on top of that foundation.

[![preview](/static/preview.png)](https://youtu.be/2jNCyvkyLD8)

---

## Features

### AI Assistant

A conversational assistant panel, powered by whatever AI agent you've configured in Home Assistant (Google, OpenAI, Anthropic — your choice). It knows about the entities on your dashboard and nothing else. Ask it what's on, tell it to turn things off, or just check the temperature in a room.

Voice input and text-to-speech are supported where the browser allows it. No cloud dependency beyond what HA already manages — the dashboard just calls `conversation/process` over WebSocket.

### Custom Panel item

A flexible tile that packs multiple widgets into a single dashboard slot. Rows can be mixed and reordered freely:

| Row type | What it does |
|----------|--------------|
| **Camera** | Embeds a camera stream |
| **Buttons** | Up to 4 action buttons per row |
| **Sensor** | Shows a sensor value with optional prefix / suffix |
| **Slider** | Controls a `light` or `number` entity |

A "primary entity" can be pinned to the tile so its state is visible without opening the panel.

### Default view with auto-return

Mark any view as the default. After a configurable period of inactivity (no taps, no clicks), the dashboard silently returns to it. Useful on wall panels where you want the main floor plan visible most of the time, but still want to navigate away when needed. Modals pause the timer automatically.

### Bundled documentation

A **Docs** button in the toolbar opens a full bilingual (EN/IT) manual bundled with the app — no external link, no separate website. Covers installation, all item types, sidebar widgets, visibility conditions, Jinja2 templates, themes, custom CSS/JS, and more.

### Other things worth knowing

- **Lock with keypad** — numeric or text keypad based on `code_format`, same UX as the alarm panel
- **`input_datetime` formatting** — displays a proper locale date/time instead of the raw HA state string
- **Display-only buttons** — tiles that show state but don't respond to interaction (good for sensors styled as buttons)
- **Light brightness drag** — horizontal swipe on an active light button adjusts brightness
- **Custom CSS** — inject your own stylesheet via `data/custom_style.css`, editable from the Settings panel
- **Template sidebar item with icon** — templates can now show an icon alongside their value
- **Binary sensor sidebar item** — standalone binary sensor tile for the sidebar
- **5 new built-in themes** — slate, ember, nord, sage, rose (all gradient-based)
- **Vertical stacks** — complement the existing horizontal stacks for more flexible layouts
- **Visibility conditions** — show or hide items based on entity state, time, or user

---

## Installation

### Home Assistant Add-on

For OS or Supervised installations, Nova Domus is available as an add-on:

1. Add the repository to your HA instance:

   [![Add add-on repository](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Famedello%2Faddon-ha-fusion)

   Or add manually: `https://github.com/amedello/addon-ha-fusion`

2. Refresh the add-on store and install **Nova Domus**.

### Docker

```bash
docker compose up -d nova-domus
```

**Update:**

```bash
docker compose pull nova-domus
docker compose up -d nova-domus
```

<details>
<summary>Without Compose</summary>

```bash
docker run -d \
  --name nova-domus \
  --network bridge \
  -p 5050:5050 \
  -v /path/to/data:/app/data \
  -e TZ=Europe/Rome \
  -e HASS_URL=http://your-ha-instance:8123 \
  --restart always \
  ghcr.io/amedello/nova-domus
```

> The `ghcr.io/amedello/ha-fusion` image tag still receives updates for backward compatibility.

</details>

---

## Query strings

| Parameter | Example | Effect |
|-----------|---------|--------|
| `view` | `?view=Living Room` | Load a specific view on startup |
| `menu` | `?menu=false` | Hide the menu button (useful on kiosks) |

---

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `f` | Filter entities |
| `Esc` | Exit / close |
| `Cmd/Ctrl + S` | Save |
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |

---

## Development

```bash
# Prerequisites
node + pnpm

# Clone and install
git clone https://github.com/amedello/ha-fusion.git
cd ha-fusion
pnpm install

# Configure
cp .env.example .env
# Set HASS_URL to your HA instance

# Start dev server
pnpm dev

# Type check + lint
pnpm check
pnpm lint
pnpm format
```

The dev server proxies `/api/` and `/local/` to `HASS_URL`. Dashboard config lives in `data/dashboard.yaml`, app config in `data/configuration.yaml`.

---

## Debug

```bash
docker logs nova-domus   # backend
# browser console for frontend
```

---

## Credits

Nova Domus is built on [ha-fusion](https://github.com/matt8707/ha-fusion) by [matt8707](https://github.com/matt8707). The original dashboard design, architecture, and most entity integrations are his work. If you want a stable, upstream-maintained version, use his.

---

## Support the project

If Nova Domus saves you time or a trip to the light switch:

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/amedello)
