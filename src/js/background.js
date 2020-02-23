"use strict";

import Utils from "./Utils";
import Request from "./background/Request";
import History from "./background/History";
import Icon from "./background/Icon"
import URL from "./entities/URL";

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

async function handleContentScript(request, sender, sendResponse) {
    Utils.log("handleContentScript");
    let link = await getUrl();

    // only HTTP Pages will be supported
    if (link.isHttp) {
        if (request.cmp && request.cmpScripUrl && typeof request.pingResult !== 'undefined' && typeof request.implemented !== 'undefined') {
            // for Security Reasons, we pass each Element separably over to the insert Method.
            let requestJson = {};
            requestJson.date = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
            requestJson.url = link.host;
            requestJson.cmp = request.cmp;
            requestJson.cmpScriptUrl = request.cmpScripUrl;
            requestJson.pingResult = request.pingResult;
            requestJson.implemented = request.implemented;
            logBackend(requestJson);
            storeRequest(requestJson);
            switchIcon(requestJson.implemented);
        }
    } else {
        Utils.log("handleContentScript: Current Page is not HTTP/HTTPS");
    }
}

async function handlePopupScript(request, sender, sendResponse) {
    let url = await getUrl();
    Utils.log("handlePopupScript: Current URL: " + url);

    let hist = await history.load();
    let lastFound = {};

    // only HTTP Pages will be supported
    if (url.isHttp) {
        for (let i = 0; i < hist.history.length; i++) {
            if (hist.history[i].url.includes(url.host)) {
                lastFound = hist.history[i];
                break;
            }
        }
    } else {
        Utils.log("handlePopupScript: Current Page is not HTTP/HTTPS");
    }

    // counting all elements we blocked.
    let count = hist.history.filter((historyItem) => historyItem.implemented === true).length;

    let responseJson = {};
    responseJson.from = backgroundScript;
    responseJson.count = count;
    responseJson.lastFound = lastFound;
    responseJson.currentUrl = url;
    sendResponse(responseJson);
}

async function handleOptionsScript(request, sender, sendResponse) {
    let hist = await history.load();
    sendResponse(hist);
}

function getUrl() {
    return new Promise(function (resolve, reject) {
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            let url = new URL(tabs[0].url);
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
