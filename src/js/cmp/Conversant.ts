"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"
import Logger from "../Logger";

export default class Conversant implements ICmp {

    readonly _cmp: CMP;
    private readonly _name = "CJ Affiliate/Conversant";

    constructor(node: Document, backendCall: BackendCall) {
        backendCall.cmpData(0, this._name, node.referrer, CmpType.DO_NOT_WAIT, true);
        this._cmp = new CMP(node, backendCall, this);
    }

    public get name(): string {
        return this._name
    }

    public connect(): void {
        this._cmp.connect();
    }

    public handleCmp(): void {
        let learnMoreButton = this._cmp.queryNodeSelector("button#learnMore");
        let checkboxes = this._cmp.queryNodeSelectorAll("input[type*='checkbox']");
        let continueToSite2 = this._cmp.queryNodeSelector("button#continueToSite2");

        if (Utils.objectClickable(learnMoreButton) && this._cmp.state === 0) {
            Logger.log("Button 1 Found, clicking");
            learnMoreButton.click();
            this._cmp.state = 1;
        } else if (checkboxes.length > 0 && Utils.objectClickable(continueToSite2) && this._cmp.state === 1) {
            Logger.log("Button 2: CookieBot Banner + Checkboxes found");
            checkboxes.forEach(function (checkbox: any) {
                checkbox.setAttribute("checked", "false");
                Logger.log("Checkbox unset");
            });
            continueToSite2.click();
            this._cmp.reset();
        }
    }


}