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

    public connect(): void {
        this._cmp.connect();
    }

    public handleCmp(): void {
        const cookiebotCheckboxesSelector = "input[type*='checkbox']";
        let cookiebotCheckBoxes = this._cmp.queryNodeSelectorAll(cookiebotCheckboxesSelector);
        Utils.log("cookiebotCheckBoxes: " + cookiebotCheckBoxes[0] + " " + Utils.objectClickable(cookiebotCheckBoxes[0]) + " " + (typeof cookiebotCheckBoxes[0] !== 'undefined') + " " + cookiebotCheckBoxes[0] + " " + (typeof cookiebotCheckBoxes[0].parentElement !== 'undefined') + " " + cookiebotCheckBoxes[0].offsetParent);
        Utils.log("cookiebotCheckBoxes: " + cookiebotCheckBoxes.length);


        const allowSelectedSelector = "a#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection";
        let allowAllButton = this._cmp.queryNodeSelector(allowSelectedSelector);


        const allowSelectedSelector2 = "a#CybotCookiebotDialogBodyLevelButtonAccept";
        let allowAllButton2 = this._cmp.queryNodeSelector(allowSelectedSelector2);

        const denyAllSelector = "a#CybotCookiebotDialogBodyButtonDecline";
        let denyAll = this._cmp.queryNodeSelector(denyAllSelector);

        const details = "a#CybotCookiebotDialogBodyButtonDetails";
        const detailsButton = this._cmp.queryNodeSelector(details);

        const acceptVersion3 = "a#CybotCookiebotDialogBodyButtonAccept";
        const acceptVersion3Button = this._cmp.queryNodeSelector(acceptVersion3);
        Utils.log("OK: " + acceptVersion3Button);

        // Case 1:
        // if there is the option to deny already on the first page - do so.
        if (Utils.objectClickable(denyAll) && this._cmp.state === 0) {
            Utils.log("Click Deny All now");
            // looks like this does not work.
            denyAll.click();
            Utils.log('Consent on denied.');
            this._cmp.reset();
        }
        // Test Page: https://www.cookiebot.com/de/, https://www.gitlab.com/ (check boxes on Banner)
        else if ((Utils.objectClickable(allowAllButton) || Utils.objectClickable(allowAllButton2)) && this._cmp.state === 0) {
            Utils.log("CookieBot Banner found");
            cookiebotCheckBoxes.forEach(function (checkbox: any) {
                checkbox.setAttribute("checked", "false");
                Utils.log("Checkbox unset");
            });
            this._cmp.state = 2;
        }
        // Test Page: https://www.possiblenow.com/ (click on "only relevant cookies)
        else if (Utils.objectClickable(allowAllButton) && this._cmp.state === 2) {
            Utils.log("Click Save now");
            allowAllButton.click();
            this._cmp.reset();
        }
        // Test page:  (check boxes on Banner)
        else if (Utils.objectClickable(allowAllButton2) && this._cmp.state === 2) {
            Utils.log("Click Save2 now");
            allowAllButton2.click();
            this._cmp.reset();
            // Galeria.de
        } else if (Utils.objectClickable(detailsButton) && this._cmp.state === 0) {
            Utils.log("Details");
            detailsButton.click();
            this._cmp.state = 1;

            // Test Page: Galeria.de
        } else if (Utils.objectClickable(detailsButton) && this._cmp.state === 0) {
            Utils.log("Details");
            detailsButton.click();
            this._cmp.state = 1;
        } else if (Utils.objectClickable(cookiebotCheckBoxes[0]) && cookiebotCheckBoxes.length > 0 && this._cmp.state === 1) {
            Utils.log("Clicking on Checkboxes");
            cookiebotCheckBoxes.forEach(function (checkbox: any) {
                checkbox.setAttribute("checked", "false");
                Utils.log("Checkbox unset");
            });
            Utils.log("Click Accept now");
            acceptVersion3Button.click();
            this._cmp.reset();
        }


        // this is a special Case for V2. The Banner was found and we only click on the Deny Button.
    }

}