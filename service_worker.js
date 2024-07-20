import {
    startTracking,
    endTracking,
    viewCurrentActive,
    viewUrlCollection,
} from "./storage.js";
// chrome.storage.local.clear();
const regex = /(?<=:\/\/)(?:www\.)?([^\/?#]+)(?:[\/?#]|$)/;

// let matchedUrl = prevUrl.match(regex);

/**
 * Tab Events
 */
// when the current tab updates
chrome.tabs.onUpdated.addListener(async (_, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        const urlGroups = tab.url.match(regex);
        await endTracking();
        await startTracking(urlGroups[1]);
        viewUrlCollection();
    }
});

// when the tab selection changes
chrome.tabs.onActivated.addListener((activeInfo) => {
    // console.log("tab: onActivated");
    // get the current tab info and match the url for the domain
    // console.log(activeInfo.tabId);
    chrome.tabs.get(activeInfo.tabId, async (tab) => {
        const urlGroups = tab.url.match(regex);
        // tab might not have a url set yet
        if (!urlGroups) {
            return;
        }
        // tab has a url set
        // console.log(urlGroups[1]);
        // end the previous tracking, and start this one
        await endTracking();
        await startTracking(urlGroups[1]);
    });
    viewUrlCollection();
});

// when a tab is closed
chrome.tabs.onRemoved.addListener(async () => {
    // console.log("tab: onRemoved");
    await endTracking();
    viewUrlCollection();
});

/**
 * Window events
 */

// chrome.windows.onCreated.addListener(() => {
//     console.log("Window: onCreated");
// });

// When another window is selected (even as a result of another
// window being closed)
chrome.windows.onFocusChanged.addListener(async (windowId) => {
    // console.log("window: onFocusChanged");
    // query active tab
    // console.log(windowId);
    if (windowId === -1) {
        return;
    }
    const windowDetails = await chrome.windows.get(windowId, {
        populate: true,
    });

    let siteUrl;
    windowDetails["tabs"].forEach((element) => {
        if (element.active === true) {
            siteUrl = element.url.match(regex)[1];
        }
    });
    await endTracking();
    if (siteUrl) {
        await startTracking(siteUrl);
    }
    viewUrlCollection();
});

// In case the window is closed brute force (and not tab by tab)
chrome.windows.onRemoved.addListener(async () => {
    // console.log("window: onRemoved");
    await endTracking();
    viewUrlCollection();
});

chrome.idle.onStateChanged.addListener(() =>
    console.log("window: onStateChanged")
);
