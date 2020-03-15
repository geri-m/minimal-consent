"use strict";

import Utils from "../Utils";
import BackendCall from "../BackendCall"
import ICmp from "./ICmp";

const config = {attributes: true, childList: true, subtree: true};
const minimalConsentLink = "a.minimal-consent";
const maximalLimitOfDomChangeTillStop = 100;

export default class CMP {

    /**
     * Constructor for an Abstract CMP
     *
     * @param node Document Root Node
     * @param name Name for the CMP in Text
     * @param scriptUrl URL from with the CMP was loaded
     * @param type Enumeration on Type of CMP to determine when we need to trigger the backend call.
     */

    private readonly _node: Document;
    private _state: number;
    private _callCounter: number;
    private readonly _backendCall: BackendCall;
    private _observer: MutationObserver;
    private _cmpImplementation: ICmp;

    constructor(node : Document, backendCall: BackendCall, cmpImplementation: ICmp) {
        this._node = node;
        this._state = 0;
        this._callCounter = 0;
        this._cmpImplementation = cmpImplementation;
        this._backendCall = backendCall;
    }

    connect() :void {
        let _self = this;
        this._observer = new MutationObserver(function (mutations) {
            _self.mainCmpHandler(mutations);
        });
        this._observer.observe(this._node, config);

        // in case there is no DOM change on the site at this place, the Handler should run at least once.
        this.mainCmpHandler(null);
    }

    /**
     * Getting the Root Node of the Document where a CMP is runnning
     *
     * @returns {*}
     */

    get node() :Document{
        return this._node;
    }

    get state() :number  {
        return this._state;
    }

    set state(state)  {
        this._state = state;
    }

    get minimalConsentLink() :string {
        return minimalConsentLink;
    }

    /**
     * Handle which is called, when a modification is detected.
     *
     * @param mutations
     */

    mainCmpHandler(mutations: MutationRecord[]): void {
        Utils.log("Handling " + this._cmpImplementation.name);
        this._callCounter++;
        // if after x changes to the DOM there as not popup, we stop listening to the changes.
        if (this._callCounter < maximalLimitOfDomChangeTillStop) {
            this._cmpImplementation.handleCmp();
        } else {
            this._observer.disconnect();
            this._state = -1;
            this._callCounter = 0;
            Utils.log("Looks like, CMP was already given consent.");
        }
    }

    /**
     * Reset the state of the CMP if the Consent was successfully given. Might trigger a backend call.
     */

    reset() : void{
        // If everything is fine, remove the listener.
        this._observer.disconnect();
        this._state = -1;
        this._backendCall.successfulBlock();
        Utils.log('Consent for ' + this._cmpImplementation.name + ' denied.');
    }

    /**
     * Find a single Node via a CSS Selector
     * @param selector CSS Selector to search for
     * @returns {Element | any}
     */

    queryNodeSelector(selector: string): any {
        return this._node.querySelector(selector);
    }

    /**
     * Finds multiple Nodes via a CSS Selector.
     * @param selector CSS Selector to search for
     * @returns {NodeListOf<HTMLElementTagNameMap[*]> | NodeListOf<Element> | NodeListOf<SVGElementTagNameMap[*]>}
     */
    queryNodeSelectorAll(selector: string) : any {
        return this._node.querySelectorAll(selector)
    }
}