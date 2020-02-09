"use strict";

import Utils from "../Utils";

const contentScript = "contentscript";
const config = {attributes: true, childList: true, subtree: true};
const minimalConsentLink = "a.minimal-consent";

export default class CMP {

    constructor(node) {
        this._node = node;
        let _self = this;
        this._observer = new MutationObserver(function (mutations) {
            _self.handleCmp(mutations);
        });
        this._observer.observe(this._node, config);
        this._state = 0;
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

    handleCmp() {
        throw new Error("Calling Superclass handler");
    }

    reset(cmp, cmpVersion) {
        // If everything is fine, remove the listener.
        this._observer.disconnect();
        this._state = -1;
        Utils.log('Consent for ' + cmp + ' denied.');
        // Sending to Background Script
        chrome.runtime.sendMessage({cmp: cmp, cmp_version: cmpVersion, from: contentScript});
    }

    queryNodeSelector(selector) {
        return this._node.querySelector(selector);
    }

    queryNodeSelectorAll(selector) {
        return this._node.querySelectorAll(selector)
    }
}