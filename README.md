# Nova Domus

A Home Assistant dashboard that actually feels like home.

Built on the solid foundation of [ha-fusion](https://github.com/matt8707/ha-fusion) by [matt8707](https://github.com/matt8707), Nova Domus is what happens when you use a dashboard every single day and keep wanting it to do just one more thing. Three years of personal use, wall-mounted tablets, late-night tweaks, and the slow realization that the fork had become its own project.

[![preview](/static/preview.png)](https://youtu.be/2jNCyvkyLD8)

---

## What's different

### AI Assistant

Ask your dashboard something. Nova Domus includes a built-in chat panel connected to whichever AI agent you've configured in Home Assistant — Anthropic, Google, OpenAI, a local Ollama model, whatever. The assistant knows the entities on your dashboard and nothing else, which keeps it focused and stops it from inventing devices you don't have.

Voice input and text-to-speech work wherever the browser supports it. Everything routes through Home Assistant's `conversation/process` API — no extra cloud accounts, no API keys in the dashboard config.

### Custom Panel

Sometimes a single entity isn't enough for a tile. The Custom Panel lets you build a small panel inside one tile: a camera feed, a row of buttons, sensor readings, a brightness slider — mixed and stacked however makes sense for the room. A primary entity can be pinned to the tile face so the most important value is always visible without tapping to open anything.

### Default view with auto-return

On a wall panel you want the main floor plan visible most of the time. Mark a view as the default and set a timeout — after that many seconds without interaction the dashboard quietly returns to it. Open a camera feed, walk away, come back to the floor plan. Modals hold the timer while they're open.

### Polish and documentation

Along the way we fixed the small rough edges that had accumulated in the original fork — entity formatting, edge cases in modals, auth robustness, a handful of upstream bugs. And because a powerful dashboard is useless if you can't figure out how to use it, there's a full bilingual (EN/IT) manual bundled with the app and accessible with one tap from the toolbar.

---

## Installation

### Home Assistant Add-on

The easiest way in if you're on HA OS or Supervised. Add the repository and install directly from the add-on store:

[![Add add-on repository](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Famedello%2Faddon-ha-fusion)

Or add manually: `https://github.com/amedello/addon-ha-fusion`

### Docker

```bash
docker compose up -d nova-domus
```

**Update:**

```bash
docker compose pull nova-domus && docker compose up -d nova-domus
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

> Already running `ghcr.io/amedello/ha-fusion`? That tag still receives updates — no changes needed.

</details>

---

## Query strings

| Parameter | Effect |
|-----------|--------|
| `?view=Name` | Load a specific view on startup |
| `?menu=false` | Hide the menu button (useful on kiosk displays) |

---

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `f` | Filter |
| `Esc` | Exit / close |
| `Cmd/Ctrl + S` | Save |
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |

---

## Development

```bash
git clone https://github.com/amedello/ha-fusion.git
cd ha-fusion
pnpm install

cp .env.example .env   # set HASS_URL

pnpm dev       # dev server with HA proxy
pnpm check     # type check
pnpm lint      # eslint + prettier
pnpm format    # auto-fix formatting
```

Dashboard config: `data/dashboard.yaml` — App config: `data/configuration.yaml`

---

## Debug

```bash
docker logs nova-domus   # backend errors
# browser console for frontend
```

---

## Credits

Nova Domus stands on the work of [matt8707](https://github.com/matt8707/ha-fusion). The original dashboard design, architecture, and entity integrations are his — this project would not exist without that foundation.

---

## Support

If Nova Domus saves you time, or just a few steps to the light switch:

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/amedello)
