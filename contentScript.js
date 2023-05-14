(async () => {
  const sass = await import("https://cdn.jsdelivr.net/npm/sass@1.45.0/dist/sass.browser.js");
  const styleElement = document.createElement("style");
  document.head.appendChild(styleElement);

  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    const { scss } = message;
    const result = await sass.compile(scss);
    styleElement.textContent = result.css.toString();
  });
})();

