"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"

export default class Evidon implements ICmp {

    readonly _cmp: CMP;
    private readonly _name = "Evidon, Inc.";

    private _trigger1: boolean = false;

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
        const evidonOptions = "button#_evidon-option-button";
        let evidonOptionsButton = this._cmp.queryNodeSelector(evidonOptions);

        const evidonDecline = "button#evidon-prefdiag-decline";
        let evidonDenyAllButton = this._cmp.queryNodeSelector(evidonDecline);

        const evidonL2Decline = "button#evidon-l2-decline-button";
        let evidonL2DeclineButton = this._cmp.queryNodeSelector(evidonL2Decline);

        const evidonCookieBannerNext = "span#_evidon-banner-cookiebuttontext";
        let evidonCookieBannerNextSpan = this._cmp.queryNodeSelector(evidonCookieBannerNext);

        // we do require 3 attempts to decline the tracking
        if (Utils.objectClickable(evidonOptionsButton) && !this._trigger1) {
            this._trigger1 = true;
            await this.sleep(1000);
            Utils.log("Button 1, 300 ms waited. Trigger released");
            this._trigger1 = false;
            evidonOptionsButton.click();
        }

        // we do require 3 attempts to decline the tracking
        if (Utils.objectClickable(evidonCookieBannerNextSpan) && !this._trigger1) {
            this._trigger1 = true;
            await this.sleep(1000);
            Utils.log("Button 2, 300 ms waited. Trigger released");
            this._trigger1 = false;
            evidonCookieBannerNextSpan.click();
        }

        if (Utils.objectClickable(evidonL2DeclineButton) && !this._trigger1) {
            this._trigger1 = true;
            await this.sleep(1000);
            Utils.log("Button 3, 300 ms waited. Trigger released");
            this._trigger1 = false;
            evidonL2DeclineButton.click();
            // example evidon page here we do have a defined end.
            this._cmp.reset();
        }

        // Crownpeak => "options" by accident is the "decline" button, so options open ...
        if (Utils.objectClickable(evidonDenyAllButton) && !this._trigger1) {
            this._trigger1 = true;
            await this.sleep(1000);
            Utils.log("Button 4, 300 ms waited. Trigger released");
            this._trigger1 = false;
            evidonDenyAllButton.click();
            // example Crownpeak here we do have a defined end.
            this._cmp.reset();
        }

    }

    private sleep(milliseconds: number) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

}