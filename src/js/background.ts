"use strict";

import Logger from "./Logger";
import Request from "./background/Request";
import History from "./background/History";
import Icon from "./background/Icon"
import URL from "./entities/URL";

import ResponseForPopup from "./entities/ResponseForPopup";
import PingResult from "./entities/PingResult";
import HistoryEntry from "./entities/HistoryEntry";
import DeviceId from "./background/DeviceId";

import ConstMessaging from "./ConstMessaging";

const dateFormat = require("dateformat");

class BackgroundScript {

    private readonly _request: Request;
    private readonly _history: History;
    private readonly _icon: Icon;
    private readonly _deviceId: DeviceId;



    constructor() {
        this._request = new Request();
        this._history = new History();
        this._icon = new Icon();
        this._deviceId = new DeviceId();
    }

    // only Required for Migrations on Startup.
    get history() {
        return this._history;
    }

    public init() {

        let _self = this;


        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            Logger.log("onMessage");
            return backgroundScript.messageHandler(request, sender, sendResponse);
        });

        /* Open Test and Option Pages on Startup */
        chrome.runtime.onInstalled.addListener(async function (details) {
            Logger.log("onInstalled");

            let u = await _self._deviceId.loadOrGenerate();
            let uuid = u.deviceId;

            if (process.env.NODE_ENV === 'development') {
                let pages = [
                    "/test/test-page/integration.html",
                    "/options/options.html",
                ];

                // When Extension is refreshed, load the Test Pages in the browser.
                if (details.reason === "install" || details.reason === "update") {
                    pages.forEach((url) => {
                        chrome.tabs.create({
                            active: false,
                            url: chrome.extension.getURL(url),
                        });
                    });
                }
            }
            // this is now for production
            else {
                // Only when the extension is installed for the first time
                // send information on install to backend.
                // make sure that the uninstall triggers a backend call
                let uninstallUrl = "https://europe-west1-minimal-consent-chrome-ext.cloudfunctions.net/status?uuid=";
                Logger.log("UUID for uninstall: " + uuid);
                Logger.log("Version for uninstall: " + chrome.runtime.getManifest().version);
                chrome.runtime.setUninstallURL(uninstallUrl + uuid + "&version=" + chrome.runtime.getManifest().version);
                let request = new Request();
                request.onInstall(details.reason, uuid, chrome.runtime.getManifest().version);
            }
        });
    }

    public messageHandler(request: any, sender: any, sendResponse: any): boolean {
        switch (request.from) {
            case ConstMessaging._backendCallFromPage:
                this.handleBackendCall(request, sender, sendResponse);
                break;
            case ConstMessaging._popUpFromPage:
                this.handlePopupScript(request, sender, sendResponse);
                break;
            case ConstMessaging._optionsFromPage:
                this.handleOptionsScript(request, sender, sendResponse);
                break;
            default:
                break;
        }
        return true;
    }

    private async handleBackendCall(request: any, sender: any, sendResponse: any) {
        Logger.log("Handle: " + ConstMessaging._backendCallFromPage);
        let link = await this.getUrl();

        // check, if we have already something in the local storage.
        let lastFound = await this._history.getLastFound(link.host);

        // if there is already something, don't process further.
        if (lastFound !== null) {
            Logger.log("The Page is already in the History. Don't consider further");
        }
        // only HTTP Pages will be supported
        else if (link.isHttp) {
            if (request.cmp && request.cmpScripUrl && typeof request.pingResult !== 'undefined' && typeof request.implemented !== 'undefined') {
                let pr = PingResult.class(request.pingResult);

                Logger.log("Ping Result: " + JSON.stringify(pr));
                // for Security Reasons, we pass each Element separably over to the insert Method.
                let now = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
                let he = new HistoryEntry(now, link.host, request.cmp, request.cmpScripUrl, pr, request.implemented);
                let uuid = await this._deviceId.loadOrGenerate();
                this.logBackend(he, uuid.deviceId, chrome.runtime.getManifest().version);
                this.switchIcon(he.implemented);
                this.storeRequest(he);
            }
        } else {
            Logger.log("handleBackendCall: Current Page is not HTTP/HTTPS");
        }
    }

    private async handlePopupScript(request: any, sender: any, sendResponse: any) {
        Logger.log("Handle: " + ConstMessaging._popUpFromPage);
        if (request.cmd === ConstMessaging._popUpCmdStartup) {
            let url = await this.getUrl();
            Logger.log("startup: Current URL: " + JSON.stringify(url));

            let lastFound: HistoryEntry;

            // only HTTP Pages will be supported
            if (url.isHttp) {
                lastFound = await this._history.getLastFound(url.host);
                Logger.log("handlePopupScript: lastFound: " + JSON.stringify(lastFound));
            } else {
                Logger.log("handlePopupScript: Current Page is not HTTP/HTTPS");
            }

            // counting all elements we blocked.
            let count = await this._history.getAmountOfUrlsBlocked();
            let response = new ResponseForPopup(url, lastFound, count);

            Logger.log("Response to Popup: " + JSON.stringify(response));
            sendResponse(response);
        } else if (request.cmd === ConstMessaging._popUpCmdUserRequest) {
            Logger.log("userRequest: Submit URL: " + request.url);
            let requestToBackend = new Request();
            let uuid = await this._deviceId.loadOrGenerate();
            Logger.log("UUID: " + uuid);
            Logger.log("Version: " + chrome.runtime.getManifest().version);
            requestToBackend.urlRequestToImplement(request.url, uuid.deviceId, chrome.runtime.getManifest().version);
        }
    }

    private async handleOptionsScript(request: any, sender: any, sendResponse: any) {
        Logger.log("Handle: " + ConstMessaging._optionsFromPage);
        if (request.cmd === ConstMessaging._optionsCmdGetHistory) {
            let hist = await this._history.load();
            sendResponse(hist);
        } else if (request.cmd === ConstMessaging._optionsCmdClearHistory) {
            await this._history.clearStorage();
        }
    }

    private getUrl(): Promise<URL> {
        return new Promise(function (resolve, reject) {
            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
                if (tabs.length > 0) {
                    let url = new URL(tabs[0].url);
                    resolve(url);
                } else {
                    Logger.log("Tabs length is 0");
                    reject();
                }
            });
        });
    }

    private logBackend(requestJson: any, uuid: string, version: string) {
        this._request.send(requestJson, uuid, version);
    }

    private async storeRequest(requestJson: any) {
        await this._history.save(requestJson);
    }

    private switchIcon(implemented: boolean) {
        this._icon.switchIcon(implemented);
    }
}


/**
 * This Listener is required to receive message from the Content-Script. Out of th Listener we trigger the backend Call.
 */

const backgroundScript = new BackgroundScript();
backgroundScript.init();