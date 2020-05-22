"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"

export default class OathCmp implements ICmp {

    readonly _cmp: CMP;
    private readonly _name = "Oath Limited";

    constructor(node: Document, scriptUrl: string, backendCall: BackendCall) {
        backendCall.cmpData(14, this._name, scriptUrl, CmpType.DO_NOT_WAIT, true);
        this._cmp = new CMP(node, backendCall, this);
    }

    public get name(): string {
        return this._name
    }

    public connect(): void {
        this._cmp.connect();
    }

    /*
    - [tomshardware](https://www.tomshardware.com)
    - [techradar](https://global.techradar.com/de-de)
    */

    public handleCmp(): void {


        const moreInformation = '#mainMoreInfo';
        let moreInformationButton = this._cmp.queryNodeSelector(moreInformation);

        const rejectAll = "button.cmp-btn-rejectall";
        let rejectAllButton = this._cmp.queryNodeSelector(rejectAll);

        const leave = "#confirmLeave";
        let leaveButton = this._cmp.queryNodeSelector(leave);

        if (Utils.objectClickable(moreInformationButton) && this._cmp.state === 0) {
            Utils.log("Button 1 found");
            moreInformationButton.click();
            this._cmp.state = 1;
        } else if (Utils.objectClickable(rejectAllButton) && this._cmp.state === 1) {
            Utils.log("Button 2 found");
            rejectAllButton.click();
            this._cmp.state = 2;
        } else if (Utils.objectClickable(leaveButton) && this._cmp.state === 2) {
            Utils.log("Button 3 found");
            leaveButton.click();
            this._cmp.reset();
        }

    }
}