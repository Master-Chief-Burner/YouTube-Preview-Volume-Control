# YouTube Preview Volume Control - Changelog

## v1.5 - Current
- Fixed: No more loud beeps or max volume bursts when previews start
- Intercepts volume property directly for instant control
- Faster scanning (250ms) and mouse hover detection
- Added 'loadstart' event listener for earlier volume control

## v1.4
- Fixed: YouTube Shorts are now excluded from volume control
- Extension now ONLY controls thumbnail preview videos (hover previews)
- Shorts, main player, and all other videos are left at normal volume

## v1.3
- Instant volume updates - no page reload needed
- Real-time slider changes apply immediately to all preview videos
- Added storage listener for dynamic setting updates

## v1.2
- Fixed: Extension now reliably catches all preview videos
- Added aggressive scanning (500ms intervals) for better detection
- Enhanced YouTube-specific event handling (yt-navigate-finish)
- Multiple event listeners (play, playing, loadedmetadata, loadeddata, canplay, volumechange)

## v1.1
- Fixed: Only affects preview videos, not main player
- Improved preview detection algorithm
- Main player (#movie_player) explicitly excluded from volume control

## v1.0 - Initial Release
- Initial release
- Automatic preview volume reduction to 20% (default)
- Adjustable volume slider (0-100%)
- Settings persistence using Chrome storage API
- Clean popup interface