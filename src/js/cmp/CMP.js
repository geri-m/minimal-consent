"use strict";

import Utils from "../Utils";

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
     * @param type Enumeration on Type of CMP to determine when we need to trigger the backend call.
     */
    constructor(cmpId, node, name, scriptUrl, type, implemented, backendCall) {
        this._node = node;
        this._name = name;
        this._state = 0;
        this._callCounter = 0;
        this._backendCall = backendCall;
        this._backendCall.cmpData(cmpId, name, scriptUrl, type, implemented);
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
     * Fetching the CMP Type Enumeration.
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
        this._backendCall.successfulBlock();
        Utils.log('Consent for ' + this._name + ' denied.');

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