window.addEventListener('load', function load(event) {
    let bkg = chrome.extension.getBackgroundPage();
    bkg.console.log("PopupJS Loaded");

    chrome.runtime.sendMessage({
        from: "popupScript"
    }, function (response) {
        bkg.console.log("Response: " + JSON.stringify(response) + ", Length: " + response.count);

        document.getElementById("cmpCount").textContent = response.count;
        let details = document.getElementById("details");

        // LastFound is not empty.
        if (typeof response.lastFound !== 'undefined' && Object.entries(response.lastFound).length !== 0) {
            if (response.lastFound.implemented) {
                details.innerHTML = "Consent for <i>" + response.lastFound.url + "</i> denied on " + response.lastFound.date + ".";
            } else {
                // We don't implement
                if (response.lastFound.cmp === "na") {
                    details.innerHTML = "<i>" + response.lastFound.url + "</i> uses a solution for cookie banners we have not yet seen. <a href='#' id='submit-this-url'>Submit this URL</a>.";
                    document.querySelector('#submit-this-url').addEventListener('click', function () {
                        // check if the browsers supports Option Pages.
                        bkg.console.log("Feature Request from User for URL. Send to Backend");
                        window.close();
                    });
                } else {
                    details.innerHTML = "We aware of <i>" + response.lastFound.url + "</i>'s solution for Cookie Banner. We are working on it.";
                }

            }
        } else if (!response.currentUrl._isHttp) {
            bkg.console.log("Only HTTP(s) Pages are supported");
            details.innerHTML = "Only HTTP(s) Pages are supported";
        } else {
            bkg.console.log("Unknown CMP/No CMP detected");
            details.innerHTML = "Was there a cookie banner? You can <a href='#' id='submit-this-url'>submit this URL</a>.";
            document.querySelector('#submit-this-url').addEventListener('click', function () {
                // check if the browsers supports Option Pages.
                bkg.console.log("Feature Request from User for URL. Send to Backend");
                window.close();
            });
        }
    });


    document.querySelector('#go-to-options').addEventListener('click', function () {
        // check if the browsers supports Option Pages.
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('./options/options.html'));
        }
    });


});



