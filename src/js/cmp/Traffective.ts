"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"

export default class Traffective implements ICmp {

    readonly _cmp: CMP;
    private readonly _name = "Traffective GmbH";

    constructor(node: Document, scriptUrl: string, backendCall: BackendCall) {
        backendCall.cmpData(21, this._name, scriptUrl, CmpType.WAIT_FOR_ASYNC_CALLBACK, true);
        this._cmp = new CMP(node, backendCall, this);
    }

    public get name(): string {
        return this._name
    }

    public connect(): void {
        this._cmp.connect();
    }

    // https://www.mactechnews.de/

    public handleCmp(): void {
        const gdprDiv = 'div.gdpr_popup_popup';
        let popup = this._cmp.queryNodeSelector(gdprDiv);

        const gdprCheckBoxes = 'input[type=checkbox].gdpr_switch_native';
        let checkboxes = this._cmp.queryNodeSelectorAll(gdprCheckBoxes);

        const gdprSaveButton = 'div.is-primary-button';
        let saveButton = this._cmp.queryNodeSelector(gdprSaveButton);

        if (Utils.objectVisible(popup) && this._cmp.state === 0) {
            Utils.log('Checkboxes found: ' + checkboxes.length);
            checkboxes.forEach((checkbox: { setAttribute: (arg0: string, arg1: string) => any; }) => checkbox.setAttribute("checked", "false"), Utils.log("Checkbox unset"));
            this._cmp.state = 1;
        } else if (Utils.objectClickable(saveButton) && this._cmp.state === 1) {
            Utils.log('Button found ...');
            saveButton.click();
            this._cmp.reset();
        }
    }
}