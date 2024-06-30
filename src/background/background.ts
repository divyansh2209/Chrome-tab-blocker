chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['blocked', 'enabled'], (local) => {
        if (!Array.isArray(local.blocked)) {
            chrome.storage.local.set({ blocked: [] });
        }
        if (typeof local.enabled !== 'boolean') {
            chrome.storage.local.set({ enabled: false });
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const url = changeInfo.url || tab.url;
    if (!url || !url.startsWith('http')) {
        return;
    }

    const hostname = new URL(url).hostname;

    chrome.storage.local.get(['blocked', 'enabled'], (local) => {
        const { blocked, enabled } = local as { blocked: string[], enabled: boolean };
        if (enabled && Array.isArray(blocked) && blocked.some((domain) => hostname.includes(domain))) {
            chrome.tabs.get(tabId, (tab) => {
                if (chrome.runtime.lastError) {
                    console.log(`Failed to get tab ${tabId}: ${chrome.runtime.lastError.message}`);
                    return;
                }

                if (tab) {
                    chrome.tabs.remove(tabId, () => {
                        if (chrome.runtime.lastError) {
                            console.log(`Failed to remove tab ${tabId}: ${chrome.runtime.lastError.message}`);
                        }
                    });
                }
            });
        }
    });
});

// Necessary to make this file a module and avoid isolatedModules error
export {};
