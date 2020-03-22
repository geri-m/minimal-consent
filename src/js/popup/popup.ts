"use strict";

import ResponseForPopup from "../entities/ResponseForPopup";
import OnPageLog from "../OnPageLog";
import Utils from "../Utils";

window.addEventListener('load', onLoad);

function onLoad() {
    let bkg = chrome.extension.getBackgroundPage();
    bkg.console.log("PopupJS Loaded");
    let popup: Popup;
    popup = new Popup(document);
    popup.init();
}

class Popup {

    private readonly _log: OnPageLog;
    private readonly _cmpCount: Element;
    private readonly _toOptionsLink: Element;
    private readonly _details: Element;

    constructor(document: Document) {
        this._log = new OnPageLog(chrome.extension.getBackgroundPage().console);
        this._toOptionsLink = document.getElementById('go-to-options');
        this._cmpCount = document.getElementById("cmpCount");
        this._details = document.getElementById("details");
    }

    public init(): void {
        let _self = this;
        this._toOptionsLink.addEventListener('click', this.openOptions);
        chrome.runtime.sendMessage({
            from: "popupScript"
        }, function (response) {
            _self.handleResponse(response, _self)
        });
    }


    private openOptions(): void {
        // check if the browsers supports Option Pages.
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('/options/options.html'));
        }
    }

    private handleResponse(response: ResponseForPopup, _self: Popup): void {
        if (Utils.checkIfDefinedAndNotNull(response)) {
            let popupMessage = ResponseForPopup.class(response);
            this._log.log("handleResponse: " + JSON.stringify(popupMessage) + ", Length: " + popupMessage.count);

            // document.getElementById("log").innerText = "handleResponse: " + JSON.stringify(popupMessage) + ", Length: " + popupMessage.count;

            // let popupMessage = ResponseForPopup.class(response);
            this._log.log("parsed: " + JSON.stringify(popupMessage));

            this._cmpCount.textContent = popupMessage.count + "";

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
                    this._log.log("Case 1:" + messageCase1.replace("%URL", popupMessage.url.host).replace("%DATE", popupMessage.lastFound.date));
                    this._details.innerHTML = messageCase1.replace("%URL", popupMessage.url.host).replace("%DATE", popupMessage.lastFound.date);
                    break;
                case 2:
                    this._log.log("Case 2: CMP '" + popupMessage.lastFound.cmp + "', which is not implemented yes");
                    this._details.innerHTML = messageCas2.replace("%URL", popupMessage.url.host);
                    break;
                case 3:
                    this._log.log("Case 3: Unknown CMP Detected");
                    this._details.innerHTML = messageCase3.replace("%URL", popupMessage.url.host);
                    document.querySelector('#submit-this-url').addEventListener('click', function () {
                        _self.sendUrlToBackendForImplementation(popupMessage.url.host);
                    });
                    break;
                case 4:
                    this._log.log("Case 4: No CMP detected");
                    this._details.innerHTML = messageCase4.replace("%URL", popupMessage.url.host);
                    document.querySelector('#submit-this-url').addEventListener('click', function () {
                        _self.sendUrlToBackendForImplementation(popupMessage.url.host);
                    });
                    break;
                default:
                    this._log.log("Case 5: No HTTP Page");
                    this._details.innerHTML = messageCase5;
            }
        } else {
            throw Error("Unable to parse 'ResponseForPopup' in popup.ts");
        }
    }


    private sendUrlToBackendForImplementation(url: string) {
        // check if the browsers supports Option Pages.
        this._log.log("Feature Request from User for URL '" + url + "'. TODO: Send to Backend");
        window.close();
    }
}



