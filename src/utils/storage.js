/*
 * set the currentActive to the current site url, with the time as current time
 */
export async function startTracking(siteUrl) {
    // set the currentActive to this site
    console.log("starting tracking");
    let currentTime = Date.now();
    await chrome.storage.local.set({ currentActive: [currentTime, siteUrl] });

    // check if the site has a time recorded
    // if no time is recorded, set it to 0
    let urlCollection = await chrome.storage.local.get("url");
    if (Object.keys(urlCollection).length === 0) {
        urlCollection = { url: {} };
        urlCollection["url"][siteUrl] = 0;
        await chrome.storage.local.set({ url: urlCollection["url"] });
    }
    if (urlCollection["url"][siteUrl] === undefined) {
        urlCollection["url"][siteUrl] = 0;
        await chrome.storage.local.set({ url: urlCollection["url"] });
    }
    await chrome.storage.local.get("url");
}

/*
 * Calculate the time spent, end the tracking by setting the active to null
 */
export async function endTracking() {
    console.log("ending tracking");
    let currentTime = Date.now();

    // calculate the time between this tab's start and end
    let active = await chrome.storage.local.get("currentActive");

    // if the user starts with an activity that never got recorded
    if (!active.currentActive) {
        // console.log("current active was null");
        return;
    }
    let activeStarted = active.currentActive[0];
    let activeUrl = active.currentActive[1];
    let delta = currentTime - activeStarted;

    // set the time in the url colection and set currentActive to null
    let urlCollection = await chrome.storage.local.get("url");
    urlCollection["url"][activeUrl] += delta;
    // console.log("WAS CHECKING URL COLL: ", urlCollection);
    // update the urlCollection to reflect the change
    await chrome.storage.local.set({ url: urlCollection["url"] });
    // disable the currentActive
    await chrome.storage.local.set({ currentActive: null });
}

export function viewUrlCollection() {
    chrome.storage.local.get("url").then((result) => {
        // console.log("URL view\n");
        console.log(result);
    });
}

export function viewCurrentActive() {
    chrome.storage.local.get("currentActive").then((result) => {
        console.log("Current Active\n");
        console.log(result);
    });
}

export async function setActiveId(id) {
    await chrome.storage.local.set({"activeId": id});
}

export async function disableActiveId() {
    await chrome.storage.local.set({"activeId": null});
}