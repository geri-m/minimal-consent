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


    /**
     * Constructor for an Abstract CMP
     *
     * @param node Document Root Node
     * @param name Name for the CMP in Text
     * @param scriptUrl URL from with the CMP was loaded
     * @param type Enumation on Type of CMP to determin when we need to trigger the backedn call.
     */
    constructor(cmpId, node, name, scriptUrl, type, implemented) {
        this._cmpId = cmpId;
        this._type = type;
        this._node = node;
        this._name = name;
        this._scriptUrl = scriptUrl;
        this._state = 0;
        this._callCounter = 0;
        this._pingResult = false;
        this._reset = false;
        this._implemented = implemented;
    }

    connect() {
        let _self = this;
        this._observer = new MutationObserver(function (mutations) {
            _self.mainCmpHandler(mutations);
        });
        this._observer.observe(this._node, config);

        // in case there is no DOM change on the site at this place, the Handler should run at least once.
        this.mainCmpHandler(null);
    }


    /**
     * Fetching the CMP Type Enumation.
     *
     * @returns {{DO_NOT_WAIT: string, WAIT_FOR_ASYNC_CALLBACK: string, WAIT_FOR_TIME_FRAME: string}}
     */

    static get cmpType() {
        return enumeration;
    }

    /**
     * Getting the Root Node of the Document where a CMP is runnning
     *
     * @returns {*}
     */

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

    /**
     * Setter for the Ping Result, if we find a CMP on the Page
     *
     * @param pingResult
     */

    set pingResult(pingResult) {
        this._pingResult = JSON.parse(pingResult);
        // check if there is a timeout and cancel if necessary.
        clearTimeout(this._timeoutForBackendCall);

        // if the CMP was already clicked, do the backend call
        if (this._reset) {
            this.triggerBackendCall();
        } else {
            // ping result was set, so we wait for the reset to kick in.
        }
        Utils.log("PingResult:" + pingResult);
    }

    /**
     * Handle which is called, when a modification is detected.
     *
     * @param mutations
     */

    mainCmpHandler(mutations) {
        Utils.log("Handling " + this._name);
        this._callCounter++;
        // if after x changes to the DOM there as not popup, we stop listening to the changes.
        if (this._callCounter < maximalLimitOfDomChangeTillStop) {
            this.handleCmp(mutations);
        } else {
            this._observer.disconnect();
            this._state = -1;
            this._callCounter = 0;
            Utils.log("Looks like, CMP was already given consent.");
        }
    }

    /**
     * Abstract Method which need to be overwritten by the extending classes.
     *
     * @param mutations
     */

    handleCmp(mutations) {
        throw new Error("Calling 'handleCmp' Superclass handler");
    }

    /**
     * Reset the state of the CMP if the Consent was successfully given. Might trigger a backend call.
     */

    reset() {
        // If everything is fine, remove the listener.
        this._observer.disconnect();
        this._state = -1;
        Utils.log('Consent for ' + this._name + ' denied.');
        // Sending to Background Script
        switch (this._type) {
            case enumeration.WAIT_FOR_ASYNC_CALLBACK:
                // if we wait for the callback, the backend call is done in the 'setPingResult';
                // we already have click away the CMP so, wait for the pingresult and go.
                if (this._pingResult) {
                    this.triggerBackendCall();
                } else {
                    this._reset = true;
                }
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

    /**
     * Actual Method to trigger the backend call. Can be triggered from various functions
     */

    triggerBackendCall() {
        // in this case, there is no pingResult, so we replace the variable by an Object
        if (this._pingResult === false)
            this._pingResult = {};

        // we add this manually
        this._pingResult.cmpId = this._cmpId;

        chrome.runtime.sendMessage({
            cmp: this._name,
            cmpScripUrl: this._scriptUrl,
            pingResult: this._pingResult,
            implemented: this._implemented,
            from: contentScript
        });
    }

    /**
     * Find a single Node via a CSS Selector
     * @param selector CSS Selector to search for
     * @returns {Element | any}
     */

    queryNodeSelector(selector) {
        return this._node.querySelector(selector);
    }

    /**
     * Finds multiple Nodes via a CSS Selector.
     * @param selector CSS Selector to search for
     * @returns {NodeListOf<HTMLElementTagNameMap[*]> | NodeListOf<Element> | NodeListOf<SVGElementTagNameMap[*]>}
     */
    queryNodeSelectorAll(selector) {
        return this._node.querySelectorAll(selector)
    }
}