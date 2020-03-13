"use strict";

import Utils from "../Utils";
import CMP from "./CMP";


export default class CookieBot extends CMP {

    constructor(node, scriptUrl, backendCall) {
        super(134, node, "CookieBot", scriptUrl, CMP.cmpType.DO_NOT_WAIT, true, backendCall);
    }

    handleCmp() {
        const cookiebotCheckboxesSelector = "input[type*='checkbox']";
        let cookiebotCheckBoxes = super.queryNodeSelectorAll(cookiebotCheckboxesSelector);

        const allowSelectedSelector = "a#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection";
        let allowAllButton = super.queryNodeSelector(allowSelectedSelector);


        const allowSelectedSelector2 = "a#CybotCookiebotDialogBodyLevelButtonAccept";
        let allowAllButton2 = super.queryNodeSelector(allowSelectedSelector2);

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
        }
        // Test Page: https://www.cookiebot.com/de/
        else if ((Utils.objectClickable(allowAllButton) || Utils.objectClickable(allowAllButton2)) && super.state === 0) {
            Utils.log("CookieBot Banner found");
            cookiebotCheckBoxes.forEach(function (checkbox) {
                checkbox.setAttribute("checked", "false");
                Utils.log("Checkbox unset");
            });
            super.state = 2;
        }
        // Test Page: https://www.possiblenow.com/
        else if (Utils.objectClickable(allowAllButton) && super.state === 2) {
            Utils.log("Click Save now");
            allowAllButton.click();
            super.reset();
        }
        // Test page: https://www.gitlab.com/
        else if (Utils.objectClickable(allowAllButton2) && super.state === 2) {
            Utils.log("Click Save2 now");
            allowAllButton2.click();
            super.reset();
        }
        // this is a special Case for V2. The Banner was found and we only click on the Deny Button.

    }

}