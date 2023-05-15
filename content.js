function loadSassJs() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/sass.js@0.11.1/dist/sass.sync.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  async function compileScss(scssCode) {
    await loadSassJs();
  
    return new Promise((resolve, reject) => {
      Sass.compile(scssCode, (result) => {
        if (result.status === 0) {
          resolve(result.text);
        } else {
          reject(new Error(result.formatted));
        }
      });
    });
  }
  
  function applyCss(cssCode, id) {
    let styleElement = document.createElement('style');
    styleElement.id = id;
    styleElement.innerHTML = cssCode;
    document.head.appendChild(styleElement);
  }
  
  chrome.storage.local.get(['scssCode', 'targetUrl', 'styleId'], function(data) {
    if (data.scssCode && data.targetUrl && new URL(data.targetUrl).origin === window.location.origin) {
      compileScss(data.scssCode).then(cssCode => {
        let styleId = data.styleId || 'custom-scss-compiler-style';
  
        let oldStyleElement = document.getElementById(styleId);
        if (oldStyleElement) {
          oldStyleElement.remove();
        }
  
        applyCss(cssCode, styleId);
        chrome.storage.local.set({ styleId: styleId });
      }).catch(error => {
        console.error('Fout bij het compileren van SCSS:', error.message);
      });
    }
  });
  