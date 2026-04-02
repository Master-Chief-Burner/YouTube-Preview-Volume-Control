(function() {
  let TARGET_VOLUME = 0.2; // 20% volume - will be loaded from storage
  
  // Load saved volume preference
  chrome.storage.sync.get(['previewVolume'], function(result) {
    if (result.previewVolume !== undefined) {
      TARGET_VOLUME = result.previewVolume / 100;
    }
  });
  
  // Listen for volume changes from the popup
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.previewVolume) {
      TARGET_VOLUME = changes.previewVolume.newValue / 100;
      // Immediately apply to all current preview videos
      scanForVideos();
    }
  });
  
  function shouldExclude(video) {
    // Exclude main video player
    if (video.closest('#movie_player')) return true;
    
    // Exclude YouTube Shorts
    if (video.closest('#shorts-player')) return true;
    if (video.closest('ytd-reel-video-renderer')) return true;
    if (video.closest('ytd-shorts')) return true;
    
    return false;
  }
  
  function controlVolume(video) {
    // Don't control excluded videos
    if (shouldExclude(video)) {
      return;
    }
    
    // Control all other videos (previews)
    video.volume = TARGET_VOLUME;
  }
  
  // Aggressive monitoring with multiple strategies
  function setupVideoControl(video) {
    // Set volume immediately on discovery
    controlVolume(video);
    
    if (video.dataset.volumeWatcher) {
      return;
    }
    video.dataset.volumeWatcher = 'true';
    
    // Override volume property to intercept any changes
    const originalVolumeDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'volume');
    
    try {
      Object.defineProperty(video, 'volume', {
        get: function() {
          if (shouldExclude(this)) {
            return originalVolumeDescriptor.get.call(this);
          }
          return TARGET_VOLUME;
        },
        set: function(value) {
          if (shouldExclude(this)) {
            originalVolumeDescriptor.set.call(this, value);
          } else {
            originalVolumeDescriptor.set.call(this, TARGET_VOLUME);
          }
        }
      });
    } catch (e) {
      // Fallback if property definition fails
    }
    
    // Monitor all possible events as backup
    ['play', 'playing', 'loadedmetadata', 'loadeddata', 'canplay', 'volumechange', 'loadstart'].forEach(event => {
      video.addEventListener(event, () => controlVolume(video), true);
    });
  }
  
  // Check all videos repeatedly
  function scanForVideos() {
    const videos = document.querySelectorAll('video');
    videos.forEach(setupVideoControl);
  }
  
  // Very aggressive scanning
  setInterval(scanForVideos, 250); // Scan every 250ms (faster)
  
  const observer = new MutationObserver(scanForVideos);
  
  function init() {
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      scanForVideos();
    } else {
      setTimeout(init, 50);
    }
  }
  
  init();
  
  // Also scan on page events
  document.addEventListener('DOMContentLoaded', scanForVideos);
  window.addEventListener('load', scanForVideos);
  document.addEventListener('yt-navigate-finish', scanForVideos); // YouTube-specific
  
  // Extra: Monitor for mouse events that might trigger previews
  document.addEventListener('mouseover', function(e) {
    if (e.target.closest('ytd-thumbnail')) {
      setTimeout(scanForVideos, 50);
    }
  }, true);
})();
