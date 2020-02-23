window.addEventListener('load', function load(event) {
    let bkg = chrome.extension.getBackgroundPage();
    bkg.console.log("OptionsJS Loaded");

    chrome.runtime.sendMessage({
        from: "optionsScript",
        cmd: "getHistory"
    }, function (response) {
        bkg.console.log("Response: " + JSON.stringify(response) + ", Length: " + response.count);
        if (response && response.history && response.history.length) {

            // sort array by date.
            response.history.sort(function (a, b) {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b.date) - new Date(a.date);
            });

            response.history.forEach(myFunction);
        }
    });

    document.querySelector('#clear-history').addEventListener('click', function () {
        chrome.runtime.sendMessage({
            from: "optionsScript",
            cmd: "clearHistory"
        }, function (response) {
            bkg.console.log("Clear History");
        });
        window.close();
    });

    document.querySelector('#close-window').addEventListener('click', function () {
        // check if the browsers supports Option Pages.
        bkg.console.log("Closing Window");
        window.close();
    });
});


function myFunction(item, index) {
    let table = document.getElementById("history");
    let row = document.createElement('tr');

    let url = document.createElement('td');
    url.innerHTML = item.url;

    let date = document.createElement('td');
    date.innerHTML = item.date;

    let cmp = document.createElement('td');

    if (item.cmp === "na") {
        cmp.innerHTML = "unkown";
    } else {
        cmp.innerHTML = item.cmp;
    }

    let implemented = document.createElement('td');
    implemented.innerHTML = item.implemented;

    let tcfVersion = "not defined";
    if (typeof item.pingResult.gdprAppliesGlobally !== 'undefined' && typeof item.pingResult.cmpLoaded !== 'undefined') {
        tcfVersion = "TCP 1.1";
    } else if (typeof item.pingResult.gdprApplies !== 'undefined' && typeof item.pingResult.cmpLoaded !== 'undefined') {
        tcfVersion = "TCP 2.0";
    } else {

    }

    let tcf = document.createElement('td');
    tcf.innerHTML = tcfVersion;
    row.appendChild(date);
    row.appendChild(url);
    row.appendChild(cmp);
    row.appendChild(tcf);
    row.appendChild(implemented);
    table.appendChild(row);
}



