const domainList = document.getElementById('domain-list');
const input = document.getElementById('new-domain');

function renderList(blacklist) {
  domainList.innerHTML = '';
  blacklist.forEach((domain, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${domain}</span>
      <button data-index="${index}">X</button>
    `;
    domainList.appendChild(li);
  });
}

async function getBlacklist() {
  return new Promise(resolve => {
    chrome.storage.sync.get("blacklist", ({ blacklist = [] }) => resolve(blacklist));
  });
}

async function updateList() {
  const blacklist = await getBlacklist();
  renderList(blacklist);
}

domainList.addEventListener('click', async e => {
  if (e.target.tagName === 'BUTTON') {
    const index = parseInt(e.target.dataset.index);
    let blacklist = await getBlacklist();
    blacklist.splice(index, 1);
    chrome.storage.sync.set({ blacklist }, updateList);
  }
});

document.getElementById('add-domain').addEventListener('click', async () => {
  const domain = input.value.trim();
  if (domain) {
    let blacklist = await getBlacklist();
    if (!blacklist.includes(domain)) {
      blacklist.push(domain);
      chrome.storage.sync.set({ blacklist }, () => {
        input.value = '';
        updateList();
      });
    }
  }
});

document.getElementById('clear-all').addEventListener('click', () => {
  chrome.storage.sync.set({ blacklist: [] }, updateList);
});

updateList();
