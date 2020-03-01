import ResponseForPopup from "../entities/ResponseForPopup";

let bkg;

window.addEventListener('load', onLoad);

function onLoad() {
    bkg = chrome.extension.getBackgroundPage();
    bkg.console.log("PopupJS Loaded");

    chrome.runtime.sendMessage({
        from: "popupScript"
    }, handleResponse);

    document.querySelector('#go-to-options').addEventListener('click', openOptions);
}

function openOptions() {
    // check if the browsers supports Option Pages.
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('/options/options.html'));
    }
}

function handleResponse(response) {
    bkg.console.log("handleResponse: " + JSON.stringify(response) + ", Length: " + response.count);

    let popupMessage = ResponseForPopup.class(response);
    bkg.console.log("parsed: " + JSON.stringify(popupMessage));

    document.getElementById("cmpCount").textContent = popupMessage.count;
    let details = document.getElementById("details");

    // Possible Cases
    // (1) HTTP + Found + known + Implemented: We know and implemented (= block) the CMP. Now or in the past. (Script + Implementation)
    let messageCase1 = "Consent for <i>%URL</i> denied on %DATE.";
    // (2) HTTP + Found + known + Not Implemented: We know the CMP, but have no implemented it. We will do implement this in the future (Script found, maybe CMP Object)
    let messageCas2 = "We aware of <i>%URL</i>'s solution for Cookie Banner. We are working on it.";
    // (3) HTTP + Found + not known + Not Implemented: There is a CMP on the Page we don't know yet. (CMP Object on Page, but no Script)
    let messageCase3 = "<i>%URL</i> uses a solution for cookie banners we have not yet seen. <a href='#' id='submit-this-url'>Submit this URL</a>.";
    // (4) HTTP + not Found + not known + Not Implemented:
    let messageCase4 = "Was there a cookie banner on <i>%URL</i>? If yes, <a href='#' id='submit-this-url'>submit this URL</a>.";
    // (5) The Page is not a HTTP/HTTPs Page.
    let messageCase5 = "Only HTTP(s) Pages are supported";

    switch (popupMessage.case) {
        case 1:
            bkg.console.log("Case 1:" + messageCase1.replace("%URL", popupMessage.url.url).replace("%DATE", popupMessage.lastFound.date));
            details.innerHTML = messageCase1.replace("%URL", popupMessage.url.url).replace("%DATE", popupMessage.lastFound.date);
            break;

        case 2:
            bkg.console.log("Case 2: CMP '" + popupMessage.lastFound.cmp + "', which is not implemented yes");
            details.innerHTML = messageCas2.replace("%URL", popupMessage.url.url);
            break;

        case 3:
            bkg.console.log("Case 3: Unknown CMP Detected");
            details.innerHTML = messageCase3.replace("%URL", popupMessage.url.url);
            document.querySelector('#submit-this-url').addEventListener('click', function () {
                sendUrlToBackendForImplementation(popupMessage.url.url);
            });
            break;

        case 4:
            bkg.console.log("Case 4: No CMP detected");
            details.innerHTML = messageCase4.replace("%URL", popupMessage.url.url);
            document.querySelector('#submit-this-url').addEventListener('click', function () {
                sendUrlToBackendForImplementation(popupMessage.url.url);
            });
            break;

        default:
            bkg.console.log("Case 5: No HTTP Page");
            details.innerHTML = messageCase5;
    }
}

function sendUrlToBackendForImplementation(url) {
    // check if the browsers supports Option Pages.
    bkg.console.log("Feature Request from User for URL '" + url + "'. TODO: Send to Backend");
    window.close();
}