// Luister naar het bericht vanuit de popup en sla de CSS op in de opslag
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveCSS") {
      const css = request.css;
      chrome.storage.sync.set({ savedCSS: css });
    }
  });
  
  // Haal opgeslagen CSS op en voeg het toe aan de pagina
  chrome.storage.sync.get("savedCSS", ({ savedCSS }) => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = savedCSS;
    document.head.appendChild(styleElement);
  });
  