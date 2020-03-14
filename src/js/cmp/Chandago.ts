"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"


export default class Chandago implements ICmp {

    readonly _cmp: CMP;
    private readonly _name = "Chandago";

    constructor(node: Document, scriptUrl: string, backendCall: BackendCall) {
        backendCall.cmpData(2, this._name, scriptUrl, CmpType.WAIT_FOR_ASYNC_CALLBACK, true);
        this._cmp = new CMP(node, backendCall, this);
    }

    public get name(): string {
        return this._name
    }

    public connect(): void {
        this._cmp.connect();
    }

    public handleCmp(): void {
        const chandagoButtonDenyCss = "button.deny";
        let chandagoButtonDeny = this._cmp.queryNodeSelector(chandagoButtonDenyCss);

        if (Utils.objectClickable(chandagoButtonDeny) && this._cmp.state === 0) {
            Utils.log("Click Deny now");
            // looks like this does not work.
            chandagoButtonDeny.click();
            Utils.log('Consent on denied.');
            this._cmp.reset();
        }

        /*
        const allowSelectedSelector = "a#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection";
        let allowAllButton = super.queryNodeSelector(allowSelectedSelector);

        const denyAllSelector = "a#CybotCookiebotDialogBodyButtonDecline";
        let denyAll = super.queryNodeSelector(denyAllSelector);


        // Case 1:
        // if there is the option to deny already on the first page - do so.
        if (Utils.objectClickable(denyAll) && super.state === 0) {
            Utils.log("Click Deny All now");
            // looks like this does not work.
            denyAll.click();
            Utils.log('Consent on denied.');
            super.reset();
        } else if (Utils.objectClickable(allowAllButton) && super.state === 0) {
            Utils.log("CookieBot Banner found");
            cookiebotCheckBoxes.forEach(function (checkbox) {
                checkbox.setAttribute("checked", "false");
                Utils.log("Checkbox unset");
            });
            super.state = 2;
        } else if (Utils.objectClickable(allowAllButton) && super.state === 2) {
            Utils.log("Click Save now");

            // TODO: Make button for Integration to Click.
            allowAllButton.click();
            super.reset();
        }
        */

        // this is a special Case for V2. The Banner was found and we only click on the Deny Button.

    }
}