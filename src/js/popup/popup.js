window.addEventListener('load', function load(event) {
    let bkg = chrome.extension.getBackgroundPage();
    bkg.console.log("PopupJS Loaded");

    chrome.runtime.sendMessage({
        from: "popupScript"
    }, function (response) {
        bkg.console.log("Response: " + JSON.stringify(response) + ", Length: " + response.count);
        document.getElementById("cmpCount").textContent = response.count;
        let details = document.getElementById("details");
        bkg.console.log("Last found: " + JSON.stringify(response.lastFound) + ", Len: " + Object.entries(response.lastFound).length + ", Const: " + response.lastFound.constructor);
        // LastFound is not empty.
        if (typeof response.lastFound !== 'undefined' && Object.entries(response.lastFound).length !== 0 /*&& response.lastFound.constructor !== Object*/) {
            if (response.lastFound.implemented === true) {
                details.innerHTML = "Consent for '" + response.currentHost + "' for denied at " + response.lastFound.date;
            } else {
                // We don't implement
                if (response.lastFound.cmp === "na") {
                    details.innerHTML = "'" + response.currentHost + "' uses a CMP haven't seen yet. Click here to let us know.";
                } else {
                    details.innerHTML = "'" + response.currentHost + "' uses a CMP '" + response.lastFound.cmp + "' that we have not yet implemented. We are working hard on it";
                }

            }
        } else if (!response.currentUrl.includes("http://") || !response.currentUrl.includes("https://")) {
            details.innerHTML = "Only HTTP(s) Pages are supported";
        } else {
            details.innerHTML = "You can submit this URL and we will add this as a feature request, if there was a consent banner.";
        }
    });


    document.querySelector('#go-to-options').addEventListener('click', function () {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('./options/options.html'));
        }
    });

});



