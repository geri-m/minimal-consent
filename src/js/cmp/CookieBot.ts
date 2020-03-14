"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"


export default class CookieBot implements ICmp {

    readonly _cmp: CMP;
    private readonly _name = "CookieBot";

    constructor(node: Document, scriptUrl: string, backendCall: BackendCall) {
        backendCall.cmpData(134, this._name, scriptUrl, CmpType.DO_NOT_WAIT, true);
        this._cmp = new CMP(node, backendCall, this);
    }

    public get name(): string {
        return this._name
    }

    public handleCmp(): void {
        const cookiebotCheckboxesSelector = "input[type*='checkbox']";
        let cookiebotCheckBoxes = this._cmp.queryNodeSelectorAll(cookiebotCheckboxesSelector);

        const allowSelectedSelector = "a#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection";
        let allowAllButton = this._cmp.queryNodeSelector(allowSelectedSelector);


        const allowSelectedSelector2 = "a#CybotCookiebotDialogBodyLevelButtonAccept";
        let allowAllButton2 = this._cmp.queryNodeSelector(allowSelectedSelector2);

        const denyAllSelector = "a#CybotCookiebotDialogBodyButtonDecline";
        let denyAll = this._cmp.queryNodeSelector(denyAllSelector);

        // Case 1:
        // if there is the option to deny already on the first page - do so.
        if (Utils.objectClickable(denyAll) && this._cmp.state === 0) {
            Utils.log("Click Deny All now");
            // looks like this does not work.
            denyAll.click();
            Utils.log('Consent on denied.');
            this._cmp.reset();
        }
        // Test Page: https://www.cookiebot.com/de/
        else if ((Utils.objectClickable(allowAllButton) || Utils.objectClickable(allowAllButton2)) && this._cmp.state === 0) {
            Utils.log("CookieBot Banner found");
            cookiebotCheckBoxes.forEach(function (checkbox: any) {
                checkbox.setAttribute("checked", "false");
                Utils.log("Checkbox unset");
            });
            this._cmp.state = 2;
        }
        // Test Page: https://www.possiblenow.com/
        else if (Utils.objectClickable(allowAllButton) && this._cmp.state === 2) {
            Utils.log("Click Save now");
            allowAllButton.click();
            this._cmp.reset();
        }
        // Test page: https://www.gitlab.com/
        else if (Utils.objectClickable(allowAllButton2) && this._cmp.state === 2) {
            Utils.log("Click Save2 now");
            allowAllButton2.click();
            this._cmp.reset();
        }
        // this is a special Case for V2. The Banner was found and we only click on the Deny Button.
    }

}