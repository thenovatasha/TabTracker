let spentTime = {};
let prevUrl = null;
let prevTime = null;

const regex = /(?<=:\/\/)(?:www\.)?([^\/?#]+)(?:[\/?#]|$)/;

// let matchedUrl = prevUrl.match(regex);

/**
 * Tab Events
 */
// when the current tab updates
chrome.tabs.onUpdated.addListener(() => console.log("TABUPDATED!"));

// // when the tab selection changes
chrome.tabs.onActivated.addListener(() => console.log("ACTIVATED"));

// // when a tab is closed
chrome.tabs.onRemoved.addListener(() => {
    console.log("REMOVED");
});

/**
 * Window events
 */

chrome.windows.onCreated.addListener(() => {
    console.log("Window created");
});

// When another window is selected (not created)
chrome.windows.onFocusChanged.addListener(() => {
    console.log("WINDOW FOCUS CHANGED");
    // query active tab
});
