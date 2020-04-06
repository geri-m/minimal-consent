"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"

export default class TrustArcBanner implements ICmp {

    readonly _cmp: CMP;
    private readonly _name = "TrustArc Inc (Banner)";

    constructor(node: Document, scriptUrl: string, backendCall: BackendCall) {
        backendCall.cmpData(41, this._name, scriptUrl, CmpType.DO_NOT_WAIT, true);
        this._cmp = new CMP(node, backendCall, this);
    }

    public get name(): string {
        return this._name
    }

    public connect(): void {
        this._cmp.connect();
    }

    public handleCmp(): void {

        const content = "#truste-consent-content, .truste-consent-content";
        let contentDiv = this._cmp.queryNodeSelector(content);

        const required = "#truste-show-consent";
        let requiredButton = this._cmp.queryNodeSelector(required);
        Utils.log("details: " + requiredButton);

        Utils.log("State: " + this._cmp.state);

        if (Utils.objectClickable(requiredButton) && Utils.objectClickable(contentDiv) && this._cmp.state === 0) {
            Utils.log("detailsButton clicked");
            this.delayedClick(0);
            this._cmp.state = 1;
        }
    }

    private delayedClick(count: number): void {
        const required = "#truste-show-consent";
        let requiredButton = this._cmp.queryNodeSelector(required);
        requiredButton.click();
        Utils.log("Current Count:" + count);
        if (count < 1) {
            let _self = this;
            setTimeout(function () {
                _self.delayedClick(count + 1);
                Utils.log("Clicked");
            }, 1000);
        } else {
            Utils.log("maximum reached");
            this._cmp.reset();
        }

    }
}
