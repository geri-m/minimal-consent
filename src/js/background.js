"use strict";

import Utils from "./Utils";

const dateFormat = require('dateformat'); // from library
/**
 * This Listener is required to receive message from the Content-Script. Out of th Listener we trigger the backend Call.
 */
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // we make sure all relevant fields are set and then trigger the call.
        if (request.from === "contentscript" && request.cmp && request.cmp_version) {
            logBackend(request.cmp, request.cmp_version, sender.tab.url);
        }
    });


function logBackend(cmp, cmpVersion, url) {
    // key for the storage to have the blocking history there.
    const historyKeyOfStorage = "history";
    let xhr = new XMLHttpRequest();
    xhr.open("POST", 'https://europe-west1-minimal-consent-chrome-ext.cloudfunctions.net/successfulConsent', true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/json");
    let requestJson = "{\n" +
        "    \"cmp\": \"" + cmp + "\"," +
        "    \"cmp-version\": \"" + cmpVersion + "\"," +
        "    \"url\" : \"" + url + "\"" +
        "}";
    chrome.browserAction.setIcon({path: "./images/icon-48x48-ok.png"});
    setTimeout(turnImageBack, 3000);
    xhr.send(requestJson);


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




