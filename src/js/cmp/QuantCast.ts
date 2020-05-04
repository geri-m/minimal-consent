"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"

export default class QuantCast implements ICmp {

    readonly _cmp: CMP;
    private readonly _name = "Quantcast International Limited";

    constructor(node: Document, scriptUrl: string, backendCall: BackendCall) {
        backendCall.cmpData(10, this._name, scriptUrl, CmpType.WAIT_FOR_ASYNC_CALLBACK, true);
        this._cmp = new CMP(node, backendCall, this);
    }

    public get name(): string {
        return this._name
    }

    public connect(): void {
        this._cmp.connect();
    }

    /*
        https://wwd.com/
     */

    public handleCmp(): void {
        const purpose = "a#qc-cmp-purpose-button";
        let purposeButton = this._cmp.queryNodeSelector(purpose);

        const denyAll = "button.qc-cmp-enable-button";
        let denyAllButton = this._cmp.queryNodeSelector(denyAll);

        const save = "button.qc-cmp-save-and-exit";
        let saveButton = this._cmp.queryNodeSelector(save);

        const rejectAll = "button.qc-cmp-secondary-button";
        let rejectAllButton = this._cmp.queryNodeSelector(rejectAll);

        // press on "Options"
        if (Utils.objectClickable(purposeButton) && this._cmp.state === 0) {
            this._cmp.state = 1;
            purposeButton.click();
        }
        // disable all
        else if (Utils.objectClickable(denyAllButton) && this._cmp.state === 1) {
            this._cmp.state = 2;
            denyAllButton.click();
        }
        // save settings
        else if (Utils.objectClickable(saveButton) && this._cmp.state === 2) {
            saveButton.click();
            this._cmp.reset();
        }

        // separated Branch, if there is "Reject-All Button"
        else if (Utils.objectClickable(rejectAllButton) && this._cmp.state === 0) {
            rejectAllButton.click();
            this._cmp.reset();
        }
    }
}