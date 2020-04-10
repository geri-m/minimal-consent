"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"

export default class DiDoMi implements ICmp {

    readonly _cmp: CMP;
    private readonly _name = "Didomi.net";

    constructor(node: Document, scriptUrl: string, backendCall: BackendCall) {
        backendCall.cmpData(7, this._name, scriptUrl, CmpType.WAIT_FOR_ASYNC_CALLBACK, true);
        this._cmp = new CMP(node, backendCall, this);
    }

    public get name(): string {
        return this._name
    }

    public connect(): void {
        this._cmp.connect();
    }

    public handleCmp(): void {

        const details = "button#didomi-notice-agree-button";
        let detailsButton = this._cmp.queryNodeSelector(details);

        const span = "span";
        let spanElement = this._cmp.queryNodeSelectorAll(span);

        if (Utils.objectClickable(detailsButton) && this._cmp.state === 0) {
            Utils.log("Clicking to Details");
            detailsButton.click();
            this._cmp.state = 1;
        } else if (spanElement.lenght > 0 && this._cmp.state === 1) {

            Utils.log("Looking for Span1");
            let clicked: boolean = false;
            spanElement.forEach(function (span: any) {
                if (span.innerHTML.indexOf("Refuser") !== -1) {
                    span.click();
                    Utils.log("Clicked on Refuser");
                }
            });

            if (clicked) {
                this._cmp.state = 2;
            }

        } else if (spanElement.lenght > 0 && this._cmp.state === 2) {

            Utils.log("Looking for Span2");
            let clicked: boolean = false;
            spanElement.forEach(function (span: any) {
                if (span.innerHTML.indexOf("Enregistrer") !== -1) {
                    span.click();
                    Utils.log("Clicked on Enregistrer");
                }
            });

            if (clicked) {
                this._cmp.reset();
            }

        }

        // TODO: Requires a second Step for the ugly guis.
        // Currently there is a <a href='#' with an on Click Action which is a bit painful to handle
    }

}