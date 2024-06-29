chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(["blocked"], (local) => {
        if (!Array.isArray(local.blocked)) {
            chrome.storage.local.set({ blocked: [] });
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const url = changeInfo.url || tab.url;
    if (!url || !url.startsWith("http")) {
        return;
    }

    const hostname = new URL(url).hostname;

    chrome.storage.local.get(["blocked"], (local) => {
        const { blocked } = local as { blocked: string[] };
        if (Array.isArray(blocked) && blocked.some(domain => hostname.includes(domain))) {
            chrome.tabs.remove(tabId, () => {
                if (chrome.runtime.lastError) {
                    console.warn(`Failed to remove tab ${tabId}: ${chrome.runtime.lastError.message}`);
                }
            });
        }
    });
});

// Necessary to make this file a module and avoid isolatedModules error
export { };
