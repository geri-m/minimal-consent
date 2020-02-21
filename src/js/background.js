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
    Utils.log("sender: " + JSON.stringify(sender));
    Utils.log("messageHandler: " + JSON.stringify(request));
    // we make sure all relevant fields are set and then trigger the call.

    switch (request.from) {
        case "contentscript":
            handleContentScript(request, sender, sendResponse);
            break;
        case "popupScript":
            handlePopupScript(request, sender, sendResponse);
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
    let hist = await history.load();

    let responseJson = {};
    responseJson.from = backgroundScript;
    responseJson.hist = hist;
    Utils.log("Send History to Popup: " + JSON.stringify(responseJson));
    sendResponse(responseJson);
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


