<div align="center">

# ✨ NexusX Vids

**Premium Showcase Catalog — Furniture · Products · Rooms · Long Poses**

A sleek, animated, video-first web showcase with instant playback, favorites, themes, and a full-screen cinema player. 100% static — no backend, no build step, deployable to any CDN or GitHub Pages.

![Static](https://img.shields.io/badge/static-100%25-8b5cf6)
![Dependencies](https://img.shields.io/badge/dependencies-0-22c55e)
![Language](https://img.shields.io/badge/vanilla-ES5%2B-06b6d4)

**Live:** [https://anyavibez.github.io/nexusxvids](https://anyavibez.github.io/nexusxvids)

</div>

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Content Management](#-content-management)
  - [videos.json schema](#videosjson-schema)
  - [Adding a new reel](#adding-a-new-reel)
  - [Categories](#categories)
  - [Thumbnails](#thumbnails)
- [Personalization & Settings](#-personalization--settings)
- [The Player](#-the-player)
- [Deployment](#-deployment)
  - [GitHub Pages](#github-pages)
- [Troubleshooting](#-troubleshooting)
- [Roadmap / Ideas](#-roadmap--ideas)
- [License](#-license)

---

## ✨ Features

| Area | Details |
|---|---|
| **4 collections** | Furniture, Male & Female Products, Rooms, Long Poses — each on its own page |
| **Instant playback** | Inline video cards with hover-preview (toggleable) |
| **Cinema player** | Full-screen modal with prev/next navigation, arrow keys & on-screen controls |
| **Multi-source playback** | Native `<video>`, plus automatic `<iframe>` fallback for ScreenPal / YouTube / Vimeo / Archive.org |
| **Favorites** | One-tap ♡ saved to `localStorage`, with a "Favorites only" filter |
| **Search** | Live global search across all reels |
| **Sorting** | Ascending · Descending · A–Z · Z–A · Random |
| **Themes** | 3+ theme presets persisted to `localStorage` (`nexus-theme`) |
| **Accent colors** | 6 accent dots + a custom color picker (`nexus-accent`) |
| **FX toggles** | Hover-play, cursor glow, bento grid — all persisted |
| **Homepage darling** | Auto-rotating "Featured Spotlight" with shuffle, thumbs & heart |
| **Responsive** | Mobile-first layout with animated orbs, reveal-on-scroll & 3D card tilt |
| **Zero dependencies** | No frameworks, no libraries, no build pipeline |

---

## 🧱 Tech Stack

- **HTML5 + CSS3** — custom design system, CSS variables theming
- **Vanilla JavaScript (ES5-compatible)** — single `main.js`, no modules, works anywhere
- **JSON** — content is fully data-driven via `videos.json`
- **GitHub Pages / static hosting** — no server-side code

---

## 🗂 Project Structure

```
nexusxvids/
├── index.html              # Homepage (hero, stats, categories, featured spotlight)
├── furniture.html          # Category page — Furniture
├── products.html           # Category page — Male & Female Product
├── rooms.html              # Category page — Rooms
├── poses.html              # Category page — Long Poses
├── videos.json             # Content database (all reels)
├── assets/
│   ├── favicon.svg
│   ├── css/
│   │   └── style.css       # Full design system & theme variables
│   ├── js/
│   │   └── main.js         # Settings, nav, player, sort, pager, favorites, search
│   └── media/
│       ├── hero.mp4                        # Homepage background video
│       ├── collections/                    # Category cover images (.webp)
│       ├── reels/                          # Video files (.mp4) by category folder
│       │   ├── furniture/
│       │   ├── products/
│       │   ├── rooms/
│       │   └── long-poses/
│       └── thumbs/                         # Poster/thumbnail images (.webp), mirrored folders
```

---

## 🚀 Quick Start

No build step. Run it locally in seconds:

```bash
# Option A — open directly
start index.html

# Option B — serve with a tiny static server
python -m http.server 8080
# then visit http://localhost:8080
```

> **Note:** `videos.json` and `fetch()` require serving over HTTP(S). Double-clicking
> `index.html` via `file://` will work partially but some fetches may be blocked.

---

## 📦 Content Management

All content lives in **`videos.json`** — edit it, and the whole site (home stats, category
counts, featured spotlight, search, sorting) updates automatically.

### `videos.json` schema

```jsonc
{
  "name": "Room 5",               // Display name (used for A–Z sort too)
  "category": "Rooms",            // Must match a category key/name (case-insensitive)
  "url": "https://go.screenpal.com/...",  // External player URL (iframe fallback), or ""
  "file": "assets/media/reels/rooms/room-5-v2.mp4", // Local MP4 path, or ""
  "thumb": "assets/media/thumbs/rooms/05)Room5.webp", // Poster / card thumbnail
  "type": "video",                // "video" (MP4) or "image"
  "n": 13                         // Numeric order weight ("north" for ascending sort)
}
```

| Field | Required | Purpose |
|---|---|---|
| `name` | ✅ | Card title & A–Z sorting |
| `category` | ✅ | Assigns the reel to a collection |
| `url` | ⚠️ | Embedded external player (ScreenPal/YouTube/Vimeo). Leave `""` for local-only |
| `file` | ⚠️ | Local MP4 stored in `assets/media/reels/…`. Leave `""` to use `url` only |
| `thumb` | ✅ | Thumbnail shown on cards & spotlight |
| `type` | ⚠️ | `"video"` or `"image"` |
| `n` | ⚠️ | Ordering weight for Ascending/Descending sorts |

### Adding a new reel

1. Drop the MP4 into the right folder:  
   `assets/media/reels/<category>/my-reel.mp4`
2. Add a poster:  
   `assets/media/thumbs/<category>/my-reel.webp`
3. Append an entry to `videos.json` (mirror an existing one, keep `n` unique).
4. Commit & push — the site updates itself. No other file changes needed.

### Categories

Categories are defined once in `assets/js/main.js` (`window.NEXUS_CATS`):

```js
{ key:'Furniture', url:'furniture.html', label:'Furniture',
  desc:'Stylish seating, tables & statement pieces', cover:'assets/media/collections/furniture.webp' }
```

To add a **new category**:
1. Add a `NEXUS_CATS` entry and a matching HTML page (copy an existing category page).
2. Add a cover image + folder(s) under `assets/media/reels/` and `assets/media/thumbs/`.
3. Tag reels in `videos.json` with the new category name.

### Thumbnails

Thumbnails are WebP for small footprints. Keep filenames URL-safe (no spaces —
the existing files use names like `05)Room5.webp`). If a thumbnail is missing, the card
falls back gracefully and you'll see the empty state / broken image hint.

---

## 🎨 Personalization & Settings

The sidebar/cog exposes a settings panel with:

- **Theme presets** — applied via `data-theme` on `<body>`, keyed in `nexus-theme`
- **Accent color** — presets + custom picker, injected as `--primary`, keyed in `nexus-accent`
- **Hover play** — pause/play video on card hover (`nexus-hoverPlay`)
- **Cursor glow** — ambient light that follows the mouse (`nexus-cursorGlow`)
- **Bento grid** — modern bento-style card layout (`nexus-bento`)

All preferences persist in the browser's `localStorage`. Storage keys:

| Key | Purpose |
|---|---|
| `nexus-theme` | Current theme preset |
| `nexus-accent` | Override accent color (`--primary`) |
| `nexus-favs` | Array of favorite reel ids |
| `nexus-hoverPlay` | `"1"` / `"0"` hover autoplay |
| `nexus-cursorGlow` | `"1"` / `"0"` cursor glow effect |
| `nexus-bento` | `"1"` / `"0"` bento layout |

---

## 🎬 The Player

Clicking any reel opens the full-screen player modal:

- **Native video** when a local `file` (MP4) is present
- **Embedded iframe** fallback for ScreenPal, YouTube, Vimeo, Archive.org
- **Prev / Next** arrows, left/right key navigation
- **Copy link** button with clipboard + toast feedback
- **Heart** to favorite straight from the player
- Player fills the modal, fullscreen-capable, `preload="metadata"` for fast start

Keyboard: `←` / `→` to browse reels.

---

## 🚀 Deployment

### GitHub Pages

This repo is already paired with GitHub Pages on `main`.

```bash
# Make sure git identity is set once
git config --global user.name "yourname"
git config --global user.email "you@example.com"

# Commit & push — Pages auto-deploys the static site within ~1–2 minutes
git add -A
git commit -m "update content"
git push
```

Push flow recap:

| Step | Command | Why |
|---|---|---|
| 1 | `git add -A` | Stage all changed files |
| 2 | `git commit -m "message"` | Snapshot a version |
| 3 | `git push` | Trigger GitHub Pages rebuild |

> Settings → Pages → **Source: Deploy from branch → `main` / root** must be enabled.

---

## 🔧 Troubleshooting

### ❓ Discord shows an old video preview (embed cache)

⚠️ **This is the most common issue.** Discord caches link previews **server-side** and offers
**no public purge**. If you replace a video but keep the *same filename*, Discord keeps showing
the old thumbnail/preview until its cache expires. The direct link (browser) may show new content
while Discord still shows old.

**Fix — bust the cache by changing the URL:**

1. **Rename the file** to a brand-new filename, e.g. `room-5.mp4` → `room-5-v2.mp4`.
2. Update the path in `videos.json`.
3. Commit & push.
4. Share the **new** URL in Discord.

```text
✅ New URL  → https://anyavibez.github.io/nexusxvids/assets/media/reels/rooms/room-5-v2.mp4
❌ Old URL  → https://anyavibez.github.io/nexusxvids/assets/media/reels/rooms/room-5.mp4
```

Notes:
- The *old* URL keeps showing the old preview — that's expected and unavoidable.
- A `?v=2` query string *sometimes* forces Discord to re-fetch, but renaming is the guaranteed fix.
- Adding a new file (fresh URL) also works; only *overwriting in place* is the problem.

### 🌐 Site still shows old content after push

GitHub Pages / its CDN can cache for a minute or two after deploy.

- Hard-refresh: `Ctrl+Shift+R`.
- Wait ~2 minutes and retry (first load after deploy is often slow).
- Verify the raw file is updated: open the direct MP4/JSON URL and compare size/date.

### ▶️ Video won't autoplay

Autoplay with sound is blocked by browsers. The spotlight + hover-play use
`muted` + `playsinline` to stay allowed. Anything with sound starts on click.

### 🖼 Thumbnail updates don't appear

Same rule as Discord: if the thumbnail file *name* stays the same, browsers/CDNs may cache it.
Either rename it or append a version to the URL (`thumb.webp?v=3`).

---

## 🧭 Roadmap / Ideas

- Pagination ("load more") on category pages
- Per-reel tags & multi-category assignment
- Shareable direct-deep-link to open the player for one reel
- PWA manifest + offline caching
- YouTube/Vimeo lightbox thumbnails (reduce main page weight)
- Auto thumbnail extractor (first-frame WebP)

---

## 📄 License

© 2026 NexusX. All rights reserved. Content, media and assets are proprietary.
Reuse of media files or the showcase for redistribution is not permitted.