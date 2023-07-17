function injectTimeScript(tabId, changeInfo, tab) {
  const urlPattern = /https:\/\/devmonk.com.br\/conteudo\/cla\/([^/]+)\/espiral\/([^/]+)\/lista/;
  const match = tab.url.match(urlPattern);

  if (changeInfo.status === 'complete' && match) {
    const claId = match[1];
    const espiralId = match[2];

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['scripts/timeScript.js', 'scripts/notion.js'],
    });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = chrome.runtime.getURL('/styles/modal.css');
        document.head.appendChild(link);
      }
    });
  }
}

chrome.tabs.onUpdated.addListener(injectTimeScript);
