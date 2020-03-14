"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"

export default class Evidon implements ICmp {

    readonly _cmp: CMP;
    private readonly _name = "Evidon, Inc.";

    constructor(node: Document, scriptUrl: string, backendCall: BackendCall) {
        backendCall.cmpData(18, this._name, scriptUrl, CmpType.DO_NOT_WAIT, true);
        this._cmp = new CMP(node, backendCall, this);
    }

    public get name(): string {
        return this._name
    }

    public connect(): void {
        this._cmp.connect();
    }

    public async handleCmp() {
        const evidonDenyAll = "button#_evidon-decline-button";
        let button = this._cmp.queryNodeSelector(evidonDenyAll);

        const evidonOptions = "button#_evidon-option-button";
        let evidonOptionsButton = this._cmp.queryNodeSelector(evidonOptions);

        const evidonDeclineAll = "button#evidon-prefdiag-decline";
        let evidonDenyAllButton = this._cmp.queryNodeSelector(evidonDeclineAll);

        // we do require 3 attempts to decline the tracking
        if (Utils.objectClickable(evidonOptionsButton) && this._cmp.state === 0) {
            Utils.log("Clicking Button 1");
            this._cmp.state = 1;
            evidonOptionsButton.click();
        } else if (Utils.objectClickable(evidonDenyAllButton) && this._cmp.state === 1) {
            await this.sleep(1000); // Waiting for one second
            Utils.log("Clicking Button 2");
            evidonDenyAllButton.click();
            this._cmp.reset();
        } else if (Utils.objectClickable(button) && this._cmp.state === 0) {
            Utils.log("Clicking Button xxx");
            button.click();
            this._cmp.reset();
        }
    }

    private sleep(milliseconds: number) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

}