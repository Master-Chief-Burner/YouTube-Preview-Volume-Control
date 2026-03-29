Here's the README edited to be cleaner and more GitHub-standard:

---

# YouTube Preview Volume Control

> A Chrome extension that quietly tames those ear-blasting YouTube hover previews.

---

## Features

- 🔊 **Auto Volume Control** — Reduces preview volume to 20% by default
- 🎚️ **Adjustable** — Set preview volume anywhere from 0–100%
- ⚡ **Instant** — Changes apply immediately, no page reload needed
- 🎯 **Smart Detection** — Only targets hover previews, never the main player or Shorts
- 💾 **Persistent** — Remembers your preference across sessions
- 🪶 **Lightweight** — Minimal performance impact

---

## What It Controls

| Type | Controlled? |
|---|---|
| Thumbnail hover previews | ✅ Yes |
| Auto-playing video content | ✅ Yes |
| Main video player | ❌ No |
| YouTube Shorts | ❌ No |

---

## Installation

1. Clone or download this repository
2. Go to `chrome://extensions/` in Chrome
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the project folder
5. The extension icon will appear in your toolbar

> Compatible with Chrome 88+, Edge 88+, Brave, and other Chromium browsers (Manifest V3).

---

## Usage

1. Click the extension icon in your toolbar
2. Drag the slider to your preferred volume level (default: **20%**)
3. Browse YouTube — preview volumes are handled automatically

---

## File Structure

```
youtube-preview-volume-control/
├── manifest.json       # Extension config (Manifest V3)
├── content.js          # Core volume control logic
├── popup.html          # Toolbar popup UI
├── popup.js            # Popup logic
├── icon16.png
├── icon48.png
├── icon128.png
├── CHANGELOG.md
├── README.md
└── LICENSE
```

---

## How It Works

- Polls the page every 250ms for new video elements
- Detects preview videos using DOM hierarchy (excludes main player and Shorts)
- Overrides the volume property directly on matching elements
- Listens to `play`, `loadedmetadata`, `canplay`, `volumechange`, and related events
- Persists your setting via Chrome sync storage

---

## Known Issues

- Rare loud audio spike on the very first preview load — I honestly don't know how to fix it 

---

## Contributing

PRs are welcome!

```bash
git checkout -b feature/your-feature-name
git commit -m 'Description of change'
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub.

---

## Privacy

Runs only on `youtube.com`. Stores one value (your volume preference) locally. No data collection, no external requests.

---

## License

[MIT](LICENSE) — not affiliated with or endorsed by YouTube or Google.
