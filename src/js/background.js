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
    if (request.from === "contentscript" && request.cmp && request.cmpScripUrl && typeof request.pingResult !== 'undefined' && typeof request.implemented !== 'undefined') {
        // for Security Reasons, we pass each Element separably over to the insert Method.
        let requestJson = {};
        requestJson.date = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
        requestJson.url = sender.tab.url;
        requestJson.cmp = request.cmp;
        requestJson.cmpScriptUrl = request.cmpScripUrl;
        requestJson.pingResult = request.pingResult;
        requestJson.implemented = request.implemented;


        logBackend(requestJson);
        storeRequest(requestJson);
        switchIcon(requestJson.implemented);
    }
}

function logBackend(requestJson) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", 'https://europe-west1-minimal-consent-chrome-ext.cloudfunctions.net/successfulConsent', true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/json");
    // Sanity Check, so we only send correct data to the backend.
    xhr.send(JSON.stringify(requestJson));
    Utils.log("Backendcall done:" + JSON.stringify(requestJson));
}

function storeRequest(requestJson) {
    // key for the storage to have the blocking history there.
    const historyKeyOfStorage = "history";
    chrome.storage.sync.get(historyKeyOfStorage, function (result) {
        Utils.log("Result ist: " + JSON.stringify(result));

        if (result && result.history && result.history.length) {
            // in this case there is already some history.
        } else {
            // no history yet, create empty object.
            result.history = [];
        }

        // Adding the new Row;
        result.history.push(requestJson);
        chrome.storage.sync.set(result, function () {
            Utils.log('Saved new history object to Chrome Storage.');
        });
    });
}


function switchIcon(implemented) {
    // implemented CMPs are shown in Green
    if (implemented) {
        chrome.browserAction.setIcon({path: "./images/icon-48x48-ok.png"});
    }
    // implemented CMPs are shown in red
    else {
        chrome.browserAction.setIcon({path: "./images/icon-48x48-dev.png"});
    }

    setTimeout(turnIconBack, 3000);
}


function turnIconBack() {
    chrome.browserAction.setIcon({path: "./images/icon-48x48-trans.png"});
}




