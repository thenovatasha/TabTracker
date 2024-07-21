const response = await chrome.storage.local.get("url");
const div = document.querySelector("#myplot");
let urlTimePair;
try {
    urlTimePair = Object.entries(response.url);
} catch (e) {
    const noDataYet = document.createElement("h1");
    noDataYet.textContent =
        "⌛Waiting for some data to be collected first⌛\n Happy Browsing!";
    div.appendChild(noDataYet);
}
const msToHours = 3600000;

// organize the data into a format for the graph
let tabularData = [];
let totalTime = 0;
urlTimePair.forEach(([url, time]) => {
    tabularData.push({ URL: url, TIME: time / msToHours });
    totalTime += time;
});

let totalTimeHrs = totalTime / msToHours;

const plot2 = Plot.plot({
    height: 600,
    x: {
        tickRotate: -60,
        label: "",
    },
    y: {
        label: "Time Spent (Hrs)",
    },
    marginTop: 50,
    marginRight: 20,
    marginBottom: 150,
    marginLeft: 80,
    grid: true,
    marks: [
        Plot.barY(tabularData, {
            x: "URL",
            y: "TIME",
            dx: 2,
            dy: 2,
            sort: { x: "y", reverse: true, limit: 15 },
        }),
        Plot.barY(tabularData, {
            x: "URL",
            y: "TIME",
            fill: "#9147ff",
            dx: -2,
            dy: -2,
            sort: {
                x: "y",
                reverse: true,
                limit: 15,
            },
        }),
    ],
});

const title = document.createElement("h1");
title.textContent = "Summary of your time on the web";
div.append(title);

div.append(plot2);
const newElem = document.createElement("h2");
newElem.append(
    document.createTextNode(`Total Time Spent: ${totalTimeHrs.toFixed(2)} hrs`)
);
div.append(newElem);
