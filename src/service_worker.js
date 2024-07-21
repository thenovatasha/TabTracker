import {
    startTracking,
    endTracking,
    viewUrlCollection,
} from "./utils/storage.js";
const regex = /(?<=:\/\/)(?:www\.)?([^\/?#]+)(?:[\/?#]|$)/;

// Open the side panel
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

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
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    // get the current tab info and match the url for the domain
    chrome.tabs.get(activeInfo.tabId, async (tab) => {
        const urlGroups = tab.url.match(regex);
        // tab might not have a url set yet
        if (!urlGroups) {
            return;
        }
        // tab has a url set
        // end the previous tracking, and start this one
        await endTracking();
        await startTracking(urlGroups[1]);
    });
});

// when a tab is closed
chrome.tabs.onRemoved.addListener(async () => {
    await endTracking();
    viewUrlCollection();
});

/**
 * Window events
 */

// When another window is selected (even as a result of another
// window being closed)
chrome.windows.onFocusChanged.addListener(async (windowId) => {
    // check if there is a new window
    if (windowId === -1) {
        return;
    }
    // get all the details details window
    const windowDetails = await chrome.windows.get(windowId, {
        populate: true,
    });
    if (!windowDetails) {
        await endTracking();
        viewUrlCollection();
        return;
    }

    // query for the active tab in the new window
    let siteUrl;
    windowDetails["tabs"].forEach(async (element) => {
        if (element.active === true) {
            try {
                siteUrl = element.url.match(regex)[1];
            } catch (e) {
                console.log(`ERROR CAUGHT ${e}`);
            }
        }
    });

    // check if the tab has a url set, if not, onUpdate will handle it
    await endTracking();
    if (siteUrl) {
        await startTracking(siteUrl);
    }
    viewUrlCollection();
});

// In case the window is closed brute force (and not tab by tab)
chrome.windows.onRemoved.addListener(async () => {
    await endTracking();
    viewUrlCollection();
});

// seems to give inaccurate results when watching video, for future thought
chrome.idle.onStateChanged.addListener(() =>
    console.log("window: onStateChanged")
);
