const volumeSlider = document.getElementById('volume');
const volumeValue = document.getElementById('volumeValue');

// Load saved volume
chrome.storage.sync.get(['previewVolume'], function(result) {
  if (result.previewVolume !== undefined) {
    volumeSlider.value = result.previewVolume;
    volumeValue.textContent = result.previewVolume;
  }
});

volumeSlider.addEventListener('input', function() {
  volumeValue.textContent = this.value;
});

volumeSlider.addEventListener('change', function() {
  chrome.storage.sync.set({ previewVolume: parseInt(this.value) }, function() {
    console.log('Volume saved:', volumeSlider.value);
  });
});