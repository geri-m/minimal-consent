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

    /*  https://www.cookiebot.com/de/
        https://www.gitlab.com/
        https://www.applause.com/
        https://www.galeria.de/
        https://signrequest.com/#/ => CookieBot
        https://volksblatt.at/ => Cookie Bot
        https://www.zusammengegencorona.de/
        https://de.scalable.capital/ => not working!

     */
    public handleCmp(): void {
        const cookiebotCheckboxesSelector = "input[type*='checkbox']";
        let cookiebotCheckBoxes = this._cmp.queryNodeSelectorAll(cookiebotCheckboxesSelector);
        Utils.log("cookiebotCheckBoxes: " + cookiebotCheckBoxes.length);

        const allowSelectedSelector1 = "a#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection";
        let allowAllButton1 = this._cmp.queryNodeSelector(allowSelectedSelector1);

        const allowSelectedSelector2 = "a#CybotCookiebotDialogBodyLevelButtonAccept";
        let allowAllButton2 = this._cmp.queryNodeSelector(allowSelectedSelector2);

        const allowSelectedSelector3 = "a#CybotCookiebotDialogBodyButtonAccept";
        const allowAllButton3 = this._cmp.queryNodeSelector(allowSelectedSelector3);


        const detailsSelector1 = "a#CybotCookiebotDialogBodyButtonDetails";
        const detailsButton1 = this._cmp.queryNodeSelector(detailsSelector1);

        const detailsSelector2 = "a#CybotCookiebotDialogBodyLevelDetailsButton";
        const detailsButton2 = this._cmp.queryNodeSelector(detailsSelector2);


        // Case 1:
        // if there is the option to deny already on the first page - do so.
        // Test Page: https://www.possiblenow.com/, https://emojiterra.com/ (click on "only relevant cookies)
        if ((Utils.objectClickable(detailsButton1) || Utils.objectClickable(detailsButton2)) && this._cmp.state === 0) {
            Utils.log("Step 1: Show Details");

            if (Utils.objectClickable(detailsButton1)) {
                Utils.log("Details Type 1");
                detailsButton1.click();
            }

            if (Utils.objectClickable(detailsButton2)) {
                Utils.log("Details Type 2");
                detailsButton2.click();
            }

            this._cmp.state = 1;
        } // Test Page: https://www.cookiebot.com/de/, https://www.gitlab.com/, https://www.applause.com/ (check boxes on Banner)
        else if (cookiebotCheckBoxes.length > 0 && (Utils.objectClickable(allowAllButton1) || Utils.objectClickable(allowAllButton2) || Utils.objectClickable(allowAllButton3)) && this._cmp.state === 1) {
            Utils.log("Case 2: CookieBot Banner + Checkboxes found");
            cookiebotCheckBoxes.forEach(function (checkbox: any) {
                checkbox.setAttribute("checked", "false");
                Utils.log("Checkbox unset");
            });

            if (Utils.objectClickable(allowAllButton1)) {
                Utils.log("Accept Type 1");
                allowAllButton1.click();
                setTimeout(allowAllButton1.click(), 500);
            }

            if (Utils.objectClickable(allowAllButton2)) {
                Utils.log("Accept Type 2");
                allowAllButton2.click();
                setTimeout(allowAllButton2.click(), 500);
            }

            if (Utils.objectClickable(allowAllButton3)) {
                Utils.log("Accept Type 3");
                allowAllButton3.click();
                setTimeout(allowAllButton3.click(), 500);
            }

            this._cmp.reset();
        }

        // this is a special Case for V2. The Banner was found and we only click on the Deny Button.
    }

}