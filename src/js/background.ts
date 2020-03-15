"use strict";

import Utils from "./Utils";
import Request from "./background/Request";
import History from "./background/History";
import Icon from "./background/Icon"
import URL from "./entities/URL";

import ResponseForPopup from "./entities/ResponseForPopup";
import PingResult from "./entities/PingResult";
import HistoryEntry from "./entities/HistoryEntry";

const dateFormat = require('dateformat'); // from library
let request = new Request();
let history = new History();
let icon = new Icon();

/**
 * This Listener is required to receive message from the Content-Script. Out of th Listener we trigger the backend Call.
 */

chrome.runtime.onMessage.addListener(messageHandler);

function messageHandler(request: any, sender: any, sendResponse: any): boolean {
    switch (request.from) {
        case "contentscript":
            handleContentScript(request, sender, sendResponse);
            break;
        case "popupScript":
            Utils.log("sendResponse");
            handlePopupScript(request, sender, sendResponse);
            break;
        case "optionsScript":
            handleOptionsScript(request, sender, sendResponse);
            break;
        default:
            break;
    }

    return true;
}


async function handleContentScript(request: any, sender: any, sendResponse: any) {
    Utils.log("handleContentScript");
    let link = await getUrl();

    // check, if we have already something in the local storage.
    let lastFound = await history.getLastFound(link.host);

    // if there is already something, don't process further.
    if (lastFound !== null) {
        Utils.log("The Page is already in the History. Don't consider further");
    }
    // only HTTP Pages will be supported
    else if (link.isHttp) {
        if (request.cmp && request.cmpScripUrl && typeof request.pingResult !== 'undefined' && typeof request.implemented !== 'undefined') {
            let pr = PingResult.classFromJson(request.pingResult);

            Utils.log("Ping Result: " + JSON.stringify(pr));
            // for Security Reasons, we pass each Element separably over to the insert Method.
            let now = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
            let he = new HistoryEntry(now, link.host, request.cmp, request.cmpScripUrl, pr, request.implemented);
            logBackend(he);
            switchIcon(he.implemented);
            storeRequest(he);
        }
    } else {
        Utils.log("handleContentScript: Current Page is not HTTP/HTTPS");
    }
}

async function handlePopupScript(request: any, sender: any, sendResponse: any) {
    let url = await getUrl();
    Utils.log("handlePopupScript: Current URL: " + JSON.stringify(url));

    let lastFound: HistoryEntry;

    // only HTTP Pages will be supported
    if (url.isHttp) {
        lastFound = await history.getLastFound(url.host);
        Utils.log("handlePopupScript: lastFound: " + JSON.stringify(lastFound));
    } else {
        Utils.log("handlePopupScript: Current Page is not HTTP/HTTPS");
    }

    // counting all elements we blocked.
    let count = await history.getAmountOfUrlsBlocked();
    let response = new ResponseForPopup(url, lastFound, count);

    Utils.log("Response to Popup: " + JSON.stringify(response));
    sendResponse(response);
}

async function handleOptionsScript(request: any, sender: any, sendResponse: any) {
    if (request.cmd === "getHistory") {
        let hist = await history.load();
        sendResponse(hist);
    } else if (request.cmd === "clearHistory") {
        await history.clearStorage();
    }
}

function getUrl(): Promise<URL> {
    return new Promise(function (resolve, reject) {
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            if (tabs.length > 0) {
                let url = new URL(tabs[0].url);
                resolve(url);
            } else {
                Utils.log("Tabs length is 0");
                reject();
            }
        });
    });
}

function logBackend(requestJson: any) {
    request.send(requestJson);
}

async function storeRequest(requestJson: any) {
    await history.save(requestJson);
}

function switchIcon(implemented: boolean) {
    icon.switchIcon(implemented);
}

/* Open Test and Option Pages on Startup */
chrome.runtime.onInstalled.addListener(function (details) {

    let pages = [
        "/test/test-page/integration.html",
        "/options/options.html",
        "/test/test-page/unit.html",
    ];

    // Only when the extension is installed for the first time
    if (details.reason === "install") {
        pages.forEach((url) => {
            chrome.tabs.create({
                active: false,
                url: chrome.extension.getURL(url),
            });
        });
    } else if (details.reason === "update") {
        pages.forEach((url) => {
            chrome.tabs.create({
                active: false,
                url: chrome.extension.getURL(url),
            });
        });
    }

    history.doMigration();

});


