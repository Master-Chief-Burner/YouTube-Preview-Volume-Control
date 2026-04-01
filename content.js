(function () {
  let TARGET_VOLUME = 0.2;

  // ─── 1. PROTOTYPE-LEVEL INTERCEPTION ───────────────────────────────────────
  // Override HTMLMediaElement.prototype.volume IMMEDIATELY, before any video
  // element is created. This means every <video> born on the page is already
  // capped — there is no window where it can play at full volume.
  const originalDescriptor = Object.getOwnPropertyDescriptor(
    HTMLMediaElement.prototype,
    'volume'
  );

  Object.defineProperty(HTMLMediaElement.prototype, 'volume', {
    get() {
      // For excluded videos, return real volume
      if (isExcluded(this)) return originalDescriptor.get.call(this);
      // For preview videos, always report TARGET_VOLUME
      return TARGET_VOLUME;
    },
    set(value) {
      if (isExcluded(this)) {
        originalDescriptor.set.call(this, value);
      } else {
        // Silently clamp to TARGET_VOLUME regardless of what YouTube tries to set
        originalDescriptor.set.call(this, TARGET_VOLUME);
      }
    },
    configurable: true,
  });

  // ─── 2. ALSO INTERCEPT muted ───────────────────────────────────────────────
  // YouTube sometimes unmutes previews after setting volume; intercept that too.
  const originalMutedDescriptor = Object.getOwnPropertyDescriptor(
    HTMLMediaElement.prototype,
    'muted'
  );
  if (originalMutedDescriptor && originalMutedDescriptor.set) {
    Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
      get() {
        return originalMutedDescriptor.get.call(this);
      },
      set(value) {
        // If YouTube tries to unmute a preview, ignore it
        if (!isExcluded(this) && value === false) return;
        originalMutedDescriptor.set.call(this, value);
      },
      configurable: true,
    });
  }

  // ─── 3. EXCLUSION CHECK ────────────────────────────────────────────────────
  function isExcluded(video) {
    try {
      if (video.closest('#movie_player')) return true;       // main player
      if (video.closest('#shorts-player')) return true;      // Shorts player
      if (video.closest('ytd-reel-video-renderer')) return true;
      if (video.closest('ytd-shorts')) return true;
    } catch (_) {}
    return false;
  }

  // ─── 4. BELT-AND-SUSPENDERS: per-element hardening ─────────────────────────
  // Even though prototype interception covers new elements, harden each one
  // individually on discovery so per-instance overrides can't sneak through.
  //
  // KEY EDGE CASE — element reuse:
  // YouTube reuses the same <video> element when you move quickly between
  // thumbnails. It swaps src/srcObject on the existing element, which resets
  // the media pipeline. Because vcHardened is already set, the old code bailed
  // out early and missed the re-clamp entirely. Fix: intercept the src and
  // srcObject setters so a source swap immediately enforces TARGET_VOLUME,
  // and track the last-seen src so we can re-harden on reuse.

  const originalSrcDescriptor = Object.getOwnPropertyDescriptor(
    HTMLMediaElement.prototype, 'src'
  );
  const originalSrcObjectDescriptor = Object.getOwnPropertyDescriptor(
    HTMLMediaElement.prototype, 'srcObject'
  );

  function applyVolumeClamp(video) {
    if (!isExcluded(video)) {
      originalDescriptor.set.call(video, TARGET_VOLUME);
    }
  }

  function hardenVideo(video) {
    if (!isExcluded(video)) {
      // Always force volume on every call — handles reused elements too
      applyVolumeClamp(video);
    }

    // First-time setup only
    if (video.dataset.vcHardened) return;
    video.dataset.vcHardened = 'true';

    // Intercept src setter — fires when YouTube swaps the preview source
    if (originalSrcDescriptor?.set) {
      Object.defineProperty(video, 'src', {
        get() {
          return originalSrcDescriptor.get.call(this);
        },
        set(value) {
          originalSrcDescriptor.set.call(this, value);
          // Source just changed — clamp immediately before any audio loads
          applyVolumeClamp(this);
        },
        configurable: true,
      });
    }

    // Intercept srcObject setter — YouTube sometimes uses blob srcObject
    if (originalSrcObjectDescriptor?.set) {
      Object.defineProperty(video, 'srcObject', {
        get() {
          return originalSrcObjectDescriptor.get.call(this);
        },
        set(value) {
          originalSrcObjectDescriptor.set.call(this, value);
          applyVolumeClamp(this);
        },
        configurable: true,
      });
    }

    if (!isExcluded(video)) {
      // Intercept play() — ensures volume is correct the frame audio starts
      const originalPlay = video.play.bind(video);
      video.play = function () {
        applyVolumeClamp(this);
        return originalPlay();
      };

      // Catch any remaining edge-case moments, including after src swaps
      const events = ['loadstart', 'loadedmetadata', 'canplay', 'play', 'playing', 'emptied'];
      events.forEach(evt => {
        video.addEventListener(evt, () => applyVolumeClamp(video),
          { capture: true, passive: true });
      });
    }
  }

  // ─── 5. SCANNING ───────────────────────────────────────────────────────────
  function scanForVideos() {
    document.querySelectorAll('video').forEach(hardenVideo);
  }

  // ─── 6. MUTATION OBSERVER ──────────────────────────────────────────────────
  // Catch videos the moment they're inserted into the DOM
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.tagName === 'VIDEO') hardenVideo(node);
        // Also check descendants
        node.querySelectorAll?.('video').forEach(hardenVideo);
      }
    }
  });

  function init() {
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
      scanForVideos();
    } else {
      setTimeout(init, 10);
    }
  }

  init();

  // ─── 7. YOUTUBE NAVIGATION & HOVER ─────────────────────────────────────────
  document.addEventListener('yt-navigate-finish', scanForVideos);

  // On thumbnail hover, scan immediately (no delay) and then once more shortly
  // after in case YouTube injects the preview video element asynchronously
  document.addEventListener('mouseover', e => {
    if (e.target.closest('ytd-thumbnail')) {
      scanForVideos();
      // Second pass catches async-injected elements
      requestAnimationFrame(scanForVideos);
    }
  }, { capture: true, passive: true });

  // ─── 8. STORAGE ────────────────────────────────────────────────────────────
  chrome.storage.sync.get(['previewVolume'], result => {
    if (result.previewVolume !== undefined) {
      TARGET_VOLUME = result.previewVolume / 100;
      scanForVideos();
    }
  });

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.previewVolume) {
      TARGET_VOLUME = changes.previewVolume.newValue / 100;
      scanForVideos();
    }
  });
})();
