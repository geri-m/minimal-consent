"use strict";

import Utils from "./Utils";
import Request from "./background/Request";
import History from "./background/History";
import Icon from "./background/Icon"

const dateFormat = require('dateformat'); // from library
let request = new Request();
let history = new History();
let icon = new Icon();
const backgroundScript = "backgroundscript";

/**
 * This Listener is required to receive message from the Content-Script. Out of th Listener we trigger the backend Call.
 */
chrome.runtime.onMessage.addListener(messageHandler);

function messageHandler(request, sender, sendResponse) {
    switch (request.from) {
        case "contentscript":
            handleContentScript(request, sender, sendResponse);
            break;
        case "popupScript":
            handlePopupScript(request, sender, sendResponse);
            break;
        case "optionsScript":
            handleOptionsScript(request, sender, sendResponse);
            break;
        default:
            break;
    }
}

function handleContentScript(request, sender, sendResponse) {
    Utils.log("handleContentScript");
    if (request.cmp && request.cmpScripUrl && typeof request.pingResult !== 'undefined' && typeof request.implemented !== 'undefined') {
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

async function handlePopupScript(request, sender, sendResponse) {
    let tabLink = await getUrl();
    Utils.log("Current URL: " + tabLink);

    let hist = await history.load();
    let parser = document.createElement('a');
    parser.href = String(tabLink);
    let host = parser.hostname;

    let lastFound = {};

    // sort array by date.
    hist.history.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.date) - new Date(a.date);
    });

    // counting all elements we blocked.
    let count = hist.history.filter((obj) => obj.implemented === true).length;

    for (let i = 0; i < hist.history.length; i++) {
        if (hist.history[i].url.includes(host)) {
            lastFound = hist.history[i];
            break;
        }
    }

    let responseJson = {};
    responseJson.from = backgroundScript;
    responseJson.count = count;
    responseJson.lastFound = lastFound;
    sendResponse(responseJson);
}

async function handleOptionsScript(request, sender, sendResponse) {
    let hist = await history.load();
    sendResponse(hist);
}

function getUrl() {
    return new Promise(function (resolve, reject) {
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            let url = tabs[0].url;
            resolve(url);
        });
    });
}

function logBackend(requestJson) {
    request.send(requestJson);
}

async function storeRequest(requestJson) {
    await history.save(requestJson);
}

function switchIcon(implemented) {
    icon.switchIcon(implemented);
}


