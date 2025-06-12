chrome.storage.sync.get("blacklist", ({ blacklist = [] }) => {
    const domain = location.hostname;
    if (blacklist.includes(domain)) {
      const extensionId = chrome.runtime.id;
      const redirectUrl = `chrome-extension://${extensionId}/bloqueado.html`;
      window.location.replace(redirectUrl);
    }
  });