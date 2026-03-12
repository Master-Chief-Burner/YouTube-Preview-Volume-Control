# YouTube Preview Volume Control

A Chrome extension that automatically reduces YouTube video preview volume to a comfortable level, preventing those ear-blasting auto-play previews when you hover over thumbnails.

## Features

- **Automatic Volume Control** - Reduces preview video volume to 20% by default
- **Customizable** - Adjust preview volume from 0-100% with a simple slider
- **Instant Updates** - Volume changes apply immediately without page reload
- **Smart Detection** - Only affects preview videos, not main player or Shorts
- **Persistent Settings** - Remembers your volume preference
- **Lightweight** - Minimal performance impact

## What Gets Controlled

**Controlled:**
- Thumbnail hover previews  
- Auto-playing video content on YouTube pages  

**Not Controlled:**
- Main video player (videos you click to watch)  
- YouTube Shorts  
- Your normal volume controls  

## Installation

### Install from Source

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the folder containing the extension files
6. Create placeholder icons:
   - Create three PNG files: `icon16.png`, `icon48.png`, `icon128.png`
   - Or download icons from the `icons/` folder (if provided)

## Usage

1. Click the extension icon in your Chrome toolbar
2. Adjust the volume slider to your preferred level (default: 20%)
3. Browse YouTube normally - preview videos will automatically use your set volume
4. Changes apply instantly to all preview videos

## File Structure

```
youtube-preview-volume-control/
├── manifest.json       # Extension configuration
├── content.js          # Main volume control logic
├── popup.html          # Extension popup interface
├── popup.js            # Popup functionality
├── icon16.png          # Extension icon (16x16)
├── icon48.png          # Extension icon (48x48)
├── icon128.png         # Extension icon (128x128)
├── CHANGELOG.md        # Version history
├── README.md           # This file
└── LICENSE             # MIT License
```

## How It Works

The extension:
1. Monitors the YouTube page for video elements every 250ms
2. Identifies preview videos (excluding main player and Shorts)
3. Intercepts the volume property and forces it to your chosen level
4. Listens for DOM changes and video events to catch new previews
5. Applies settings instantly when you adjust the slider

## Technical Details

- **Scanning Rate**: 250ms intervals for optimal performance
- **Volume Interception**: Overrides volume property directly
- **Event Listeners**: Monitors play, loadedmetadata, loadeddata, canplay, volumechange, loadstart
- **Smart Detection**: Uses DOM hierarchy to identify video types
- **Storage**: Chrome sync storage for persistent settings

## Privacy

This extension:
- Only runs on YouTube.com
- Stores only your volume preference (locally)
- Does not collect any personal data
- Does not track your browsing
- Does not send data to external servers

## Compatibility

- **Chrome**: Version 88+ (Manifest V3)
- **Edge**: Version 88+
- **Brave**: Latest version
- **Other Chromium browsers**: Should work on any browser supporting Manifest V3

## Known Issues

- Occasional loud beep on first preview load (rare, working on fix)
- May need page refresh after installation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have suggestions:
- Open an issue on GitHub
- Provide details about your Chrome version and the problem

## Acknowledgments

- Built for people tired of ear-blasting YouTube previews
- Inspired by the need for a better browsing experience

---

**Note**: This extension is not affiliated with or endorsed by YouTube or Google.