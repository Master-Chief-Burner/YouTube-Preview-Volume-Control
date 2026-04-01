# YouTube Preview Volume Control - Changelog

[1.6] - Current
Fixed
Loud audio pop on first preview load — volume interception now happens at the HTMLMediaElement prototype level before any video element is created, eliminating the window where audio could play at full volume
Loud audio when quickly hovering between thumbnails — YouTube reuses the same <video> element across previews by swapping its src/srcObject; the element was considered already-hardened and skipped, briefly restoring default volume (1.0). The src and srcObject setters are now intercepted per-element so a source swap immediately re-enforces the volume clamp
Volume not re-applied on media pipeline reset — added listener for the emptied event, which fires when a source is cleared or replaced, ensuring the clamp is re-applied before new audio data loads
YouTube unmute bypass — intercepted the muted setter to block YouTube from setting muted = false on preview elements after volume is applied
Hover scan delay — removed the 50ms setTimeout on thumbnail mouseover, replacing it with an immediate scan plus a requestAnimationFrame pass for async-injected elements

Changed
hardenVideo now always calls applyVolumeClamp on every invocation regardless of prior hardening state, so reused elements are re-clamped on every scan
play() is intercepted per-element to enforce volume synchronously at the exact frame playback begins, rather than relying on the play event firing after the fact
Consolidated volume-setting logic into a single applyVolumeClamp helper used consistently across all interception points


[1.5]
Fixed
No more loud beeps or max volume bursts when previews start (edge cases may still rarely occur)
Intercepts volume property directly for instant control

Changed
Faster scanning rate (250ms) with mouse hover detection
Added loadstart event listener for earlier volume control


[1.4]
Fixed
YouTube Shorts are now excluded from volume control

Changed
Extension now only controls thumbnail hover previews
Shorts, main player, and all other videos are left at their normal volume


[1.3]
Changed
Instant volume updates — no page reload needed
Real-time slider changes apply immediately to all preview videos
Added storage listener for dynamic setting updates


[1.2]
Fixed
Extension now reliably catches all preview videos

Changed
Added aggressive scanning (500ms intervals) for better detection
Enhanced YouTube SPA navigation support via yt-navigate-finish event
Multiple event listeners: play, playing, loadedmetadata, loadeddata, canplay, volumechange


[1.1]
Fixed
Extension no longer affects the main video player

Changed
Improved preview detection algorithm
Main player (#movie_player) explicitly excluded from volume control


[1.0] - Initial Release

Automatic preview volume reduction to 20% by default
Adjustable volume slider (0–100%)
Settings persistence via Chrome storage API
Clean popup interface
