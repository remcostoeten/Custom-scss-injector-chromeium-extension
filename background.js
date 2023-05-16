chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'savePreset') {
      chrome.storage.sync.get('presets', ({ presets }) => {
        const newPresets = presets ? [...presets, request.css] : [request.css];
        chrome.storage.sync.set({ presets: newPresets });
      });
    }
  });
  
  function injectCSS(css) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      chrome.tabs.executeScript(tab.id, { code: `document.head.appendChild(document.createElement('style')).textContent = \`${css}\`` });
    });
  }
  