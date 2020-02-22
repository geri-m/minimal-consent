window.addEventListener('load', function load(event) {

    let bkg = chrome.extension.getBackgroundPage();

    bkg.console.log("load");

    chrome.runtime.sendMessage({
        cmp: "getHistory",
        from: "popupScript"
    }, function (response) {
        bkg.console.log("Response: " + JSON.stringify(response) + ", Length: " + response.count);
        document.getElementById("cmpCount").textContent = response.count;
        let details = document.getElementById("details");
        bkg.console.log("Last found: " + response.lastFound);
        if (typeof response.lastFound !== 'undefined') {
            if (response.lastFound.implemented === true) {
                details.innerHTML = "Consent for '" + response.lastFound.url + "' for denied at " + response.lastFound.date;
            } else {
                if (response.lastFound.cmp === "na") {
                    details.innerHTML = "'" + response.lastFound.url + "' uses a CMP haven't seen yet. Click here to let us know.";
                } else {
                    details.innerHTML = "'" + response.lastFound.url + "' uses a CMP '" + response.lastFound.cmp + "' that we have not yet implemented. We are working hard on it";
                }

            }
        } else {
            details.innerHTML = "You can submit this URL and we will add this as a feature request, if there was a consent banner.";
        }
    });
});