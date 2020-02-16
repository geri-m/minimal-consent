"use strict";

import Utils from "./Utils";

const dateFormat = require('dateformat'); // from library
/**
 * This Listener is required to receive message from the Content-Script. Out of th Listener we trigger the backend Call.
 */
chrome.runtime.onMessage.addListener(messageHandler);

function messageHandler(request, sender, sendResponse) {
    Utils.log("messageHandler: " + JSON.stringify(request));
    // we make sure all relevant fields are set and then trigger the call.
    if (request.from === "contentscript" && request.cmp && request.cmpScripUrl && typeof request.pingResult !== 'undefined') {
        // for Security Reasons, we pass each Element separably over to the insert Method.
        logBackend(request.cmp, request.cmpScripUrl, sender.tab.url, request.pingResult);
    }
}

function logBackend(cmp, cmpScripUrl, url, pingResult) {
    // key for the storage to have the blocking history there.
    const historyKeyOfStorage = "history";
    let xhr = new XMLHttpRequest();
    xhr.open("POST", 'https://europe-west1-minimal-consent-chrome-ext.cloudfunctions.net/successfulConsent', true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/json");

    let requestJson = "{\n" +
        "    \"url\" : \"" + url + "\"," +
        "    \"cmp\": \"" + cmp + "\"," +
        "    \"cmpScriptUrl\": \"" + cmpScripUrl + "\"," +
        "    \"pingResult\" : " + JSON.stringify(pingResult) + "," +
        "    \"processed\" : \"true\"" +
        "}";

    // Sanity Check, so we only send correct data to the backend.
    Utils.log("requestJson:" + requestJson);
    JSON.parse(requestJson);
    chrome.browserAction.setIcon({path: "./images/icon-48x48-ok.png"});
    setTimeout(turnImageBack, 3000);
    xhr.send(requestJson);
    Utils.log("Backendcall done" + requestJson);

    let row = {};
    row.date = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    row.url = url;
    row.cmp = cmp;

    Utils.log(JSON.stringify(row));

    chrome.storage.sync.get(historyKeyOfStorage, function (result) {
        Utils.log("Result ist: " + JSON.stringify(result));

        if (result && result.history && result.history.length) {
            // in this case there is already some history.
        } else {
            // no history yet, create empty object.
            result.history = [];
        }

        // Adding the new Row;
        result.history.push(row);

        //let jsonfile = {};
        //jsonfile[historyKeyOfStorage] = result;
        chrome.storage.sync.set(result, function () {
            Utils.log('Saved');
        });

    });


}

function turnImageBack() {
    chrome.browserAction.setIcon({path: "./images/icon-48x48-trans.png"});
}




