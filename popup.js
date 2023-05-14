document.getElementById("apply-button").addEventListener("click", async () => {
  const scssInput = document.getElementById("scss-input").value;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(tab.id, { scss: scssInput });
});

