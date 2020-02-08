"use strict";

import Utils from "./Utils";

const contentScript = "contentscript";
const config = {attributes: true, childList: true, subtree: true};

export default class CMP {

    constructor(node) {
        this.node = node;
        let self = this;
        this.observer = new MutationObserver(function (mutations) {
            self.handleCmp(mutations);
        });
        this.observer.observe(this.node, config);
        this.processState = 0;
    }

    get state() {
        return this.processState;
    }

    set state(state) {
        this.processState = state;
    }

    handleCmp() {
        throw new Error("Calling Superclass handler");
    }

    objectClickable(myObject) {
        return typeof myObject !== 'undefined' && myObject && typeof myObject.parentElement !== 'undefined';
    }

    reset(cmp, cmpVersion) {
        // If everything is fine, remove the listener.
        this.observer.disconnect();
        this.processState = -1;
        Utils.log('Consent for ' + cmp + ' denied.');
        chrome.runtime.sendMessage({cmp: cmp, cmp_version: cmpVersion, from: contentScript});
    }
}