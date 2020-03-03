import HistoryEntry from "../entities/HistoryEntry";

let bkg;

window.addEventListener('load', function load(event) {
    bkg = chrome.extension.getBackgroundPage();
    bkg.console.log("OptionsJS Loaded");

    chrome.runtime.sendMessage({
        from: "optionsScript",
        cmd: "getHistory"
    }, function (response) {
        handleResponse(response)
    });

    document.querySelector('#clear-history').addEventListener('click', clearHistory);
    document.querySelector('#close-window').addEventListener('click', closeWindow);
});

function handleResponse(response) {
    bkg.console.log("Response: " + JSON.stringify(response));
    if (response && response.history && response.history.length) {

        // sort array by date.
        response.history.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.date) - new Date(a.date);
        });

        response.history.forEach(createRow);
    }
}

function clearHistory() {
    chrome.runtime.sendMessage({
        from: "optionsScript",
        cmd: "clearHistory"
    }, function (response) {
        bkg.console.log("History cleared");
    });
    closeWindow();
}

function closeWindow() {
    // check if the browsers supports Option Pages.
    bkg.console.log("Closing Window");
    window.close();
}

function createRow(object, index) {
    let item = HistoryEntry.classFromDisk(object);

    let url = document.createElement('td');
    url.innerHTML = item.url;

    let date = document.createElement('td');
    date.innerHTML = item.date;

    let cmp = document.createElement('td');
    cmp.innerHTML = item.cmp;

    let implemented = document.createElement('td');
    implemented.innerHTML = String(item.implemented);

    let tcf = document.createElement('td');
    tcf.innerHTML = item.pingResult.tcfVersion;

    let row = document.createElement('tr');
    row.appendChild(date);
    row.appendChild(url);
    row.appendChild(cmp);
    row.appendChild(tcf);
    row.appendChild(implemented);

    let table = document.getElementById("history");
    table.appendChild(row);
}



