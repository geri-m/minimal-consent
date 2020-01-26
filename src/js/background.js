"use strict";

import Utils from "./utils";

/**
 * This Listener is required to receive message from the Content-Script. Out of th Listener we trigger the backend Call.
 */
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // we make sure all relevant fields are set and then trigger the call.
        if (request.from === "contentscript" && request.cmp && request.cmp_version) {
            logBackend(request.cmp, request.cmp_version, sender.tab.url);
        }
        // if there is something broken with the request, log the information.
        else {
            Utils.log("From: " + sender + ": " + request);
        }
    });


function logBackend(cmp, cmpVersion, url) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'https://europe-west1-minimal-consent-chrome-ext.cloudfunctions.net/successfulConsent ', true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/json");
    var requestJson = "{\n" +
        "    \"cmp\": \"" + cmp + "\"," +
        "    \"cmp-version\": \"" + cmpVersion + "\"," +
        "    \"url\" : \"" + url + "\"" +
        "}";
    chrome.browserAction.setIcon({path: "./images/icon-48x48-ok.png"});
    setTimeout(turnImageBack, 3000);
    xhr.send(requestJson);
}

function turnImageBack() {
    chrome.browserAction.setIcon({path: "./images/icon-48x48-trans.png"});
}




