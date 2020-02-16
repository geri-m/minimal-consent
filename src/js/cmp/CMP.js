"use strict";

import Utils from "../Utils";

const contentScript = "contentscript";
const config = {attributes: true, childList: true, subtree: true};
const minimalConsentLink = "a.minimal-consent";
const maximalLimitOfDomChangeTillStop = 100;

const enumeration = {
    WAIT_FOR_ASYNC_CALLBACK: "We wait until the JavaScript Object on the Page for the CMP was found",
    WAIT_FOR_TIME_FRAME: "We wait till the Callback should fire (maximal 5 seconds; 25 x 200 ms",
    DO_NOT_WAIT: "We don't wait for a callback, as we know the CMP is not TCF compliant"
};

export default class CMP {

    constructor(node, name, scriptUrl, type) {
        this._type = type;
        this._node = node;
        this._name = name;
        this._scriptUrl = scriptUrl;
        let _self = this;
        this._observer = new MutationObserver(function (mutations) {
            _self.mainCmpHandler(mutations);
        });
        this._observer.observe(this._node, config);
        this._state = 0;
        this._callCounter = 0;

        // in case there is no DOM change on the site at this place, the Handler should run at least once.
        this.mainCmpHandler(null);
        this._pingResult = "no pingresult";
    }

    static get cmpType() {
        return enumeration;
    }

    get node() {
        return this._node;
    }

    get state() {
        return this._state;
    }

    set state(state) {
        this._state = state;
    }

    get minimalConsentLink() {
        return minimalConsentLink;
    }

    set pingResult(pingResult) {
        this._pingResult = pingResult;
        // check if there is a timeout and cancel if necessary.
        clearTimeout(this._timeoutForBackendCall);
        this.triggerBackendCall();
        Utils.log(pingResult);
    }

    mainCmpHandler(mutations) {
        this._callCounter++;
        // if after x changes to the DOM there as not popup, we stop listening to the changes.
        if (this._callCounter < maximalLimitOfDomChangeTillStop) {
            this.handleCmp(mutations);
        } else {
            this._observer.disconnect();
            this._state = -1;
            this._callCounter = 0;
            Utils.log("No CMP Found after 100 DOM Updates");
        }
    }

    handleCmp(mutations) {
        throw new Error("Calling 'handleCmp' Superclass handler");
    }

    reset() {
        // If everything is fine, remove the listener.
        this._observer.disconnect();
        this._state = -1;
        Utils.log('Consent for ' + this._name + ' denied.');
        // Sending to Background Script
        switch (this._type) {
            case enumeration.WAIT_FOR_ASYNC_CALLBACK:
                // if we wait for the callback, the backend call is done in the 'setPingResult';
                break;
            case enumeration.WAIT_FOR_TIME_FRAME:
                this._timeoutForBackendCall = setTimeout(this.triggerBackendCall, 5000);
                break;
            case enumeration.DO_NOT_WAIT:
                this.triggerBackendCall();
                break;
            default:
                throw new Error("Unknown CMP Type");
        }
    }

    triggerBackendCall() {
        chrome.runtime.sendMessage({
            cmp: this._name,
            cmpScripUrl: this._scriptUrl,
            pingResult: this._pingResult,
            from: contentScript
        });
    }

    queryNodeSelector(selector) {
        return this._node.querySelector(selector);
    }

    queryNodeSelectorAll(selector) {
        return this._node.querySelectorAll(selector)
    }
}