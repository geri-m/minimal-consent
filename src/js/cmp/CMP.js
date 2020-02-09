"use strict";

import Utils from "../Utils";

const contentScript = "contentscript";
const config = {attributes: true, childList: true, subtree: true};
const minimalConsentLink = "a.minimal-consent";
const maximalLimitOfDomChangeTillStop = 100;

export default class CMP {

    constructor(node, name, scriptUrl, pingResult) {
        this._node = node;
        this._name = name;
        this._pingResult = pingResult;
        this._scriptUrl = scriptUrl;
        let _self = this;
        this._observer = new MutationObserver(function (mutations) {
            _self.mainCmpHandler(mutations);
        });
        this._observer.observe(this._node, config);
        this._state = 0;
        this._callCounter = 0;
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

    get urlPattern() {
        return this._urlPattern;
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
        chrome.runtime.sendMessage({cmp: this._name, cmp_version: this._scriptUrl, from: contentScript});
    }

    queryNodeSelector(selector) {
        return this._node.querySelector(selector);
    }

    queryNodeSelectorAll(selector) {
        return this._node.querySelectorAll(selector)
    }
}