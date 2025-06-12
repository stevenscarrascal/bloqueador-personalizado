chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "blockSite",
      title: "Añadir sitio a la lista negra",
      contexts: ["page"]
    });
  });
  
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "blockSite" && tab?.url) {
      const url = new URL(tab.url);
      const domain = url.hostname;
  
      chrome.storage.sync.get("blacklist", ({ blacklist = [] }) => {
        if (!blacklist.includes(domain)) {
          blacklist.push(domain);
          chrome.storage.sync.set({ blacklist });
  
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              window.location.href = `chrome-extension://${chrome.runtime.id}/bloqueado.html`;
            }
          });
        }
      });
    }
  });
  