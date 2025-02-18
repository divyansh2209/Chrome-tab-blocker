/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
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
        const { blocked, enabled } = local;
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


/******/ })()
;
//# sourceMappingURL=background.js.map