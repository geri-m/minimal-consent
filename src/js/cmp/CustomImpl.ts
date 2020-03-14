"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"

export default class CustomImpl implements ICmp {

    readonly _cmp: CMP;
    private readonly _name = "Custom Implementation";
    private readonly _button: string;

    constructor(node: Document, key: string, backendCall: BackendCall) {
        backendCall.cmpData(0, this._name, "na", CmpType.DO_NOT_WAIT, true);
        this._cmp = new CMP(node, backendCall, this);
        this._button = key;
    }

    public get name(): string {
        return this._name
    }

    public handleCmp(): void {
        let button = this._cmp.queryNodeSelector(this._button);
        let minimalConsent = this._cmp.queryNodeSelector(this._cmp.minimalConsentLink);

        if (Utils.objectClickable(button) && this._cmp.state === 0) {
            Utils.log("GDPR Button + Decline found: " + this._button);
            let javaScript = 'javascript:function s(){ document.querySelector(\"' + this._button + '\").click();} s();';
            Utils.createMinimalConsentButton(this._cmp.node, javaScript);
            this._cmp.state = 1;
        } else if (Utils.objectClickable(minimalConsent) && this._cmp.state === 1) {
            Utils.log("New button is here");
            minimalConsent.click();
            Utils.log('Consent on denied.');
            this._cmp.reset();
        }
    }

}