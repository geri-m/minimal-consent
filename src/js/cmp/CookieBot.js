"use strict";

import Utils from "../Utils";
import CMP from "./CMP";

export default class CookieBot extends CMP {

    constructor(node) {
        super(node);
    }

    handleCmp() {
        Utils.log("handleCookiebot");

        const bannerSelector = "div#CybotCookiebotDialog";
        let bannerCookiebot = super.queryNodeSelector(bannerSelector);

        const cookiebotCheckboxesSelector = "input[type*='checkbox']";
        let cookiebotCheckBoxes = super.queryNodeSelectorAll(cookiebotCheckboxesSelector);

        const allowSelectedSelector = "a#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection";
        let allowAllButton = super.queryNodeSelector(allowSelectedSelector);

        const denyAllSelector = "a#CybotCookiebotDialogBodyButtonDecline";
        let denyAll = super.queryNodeSelector(denyAllSelector);


        Utils.log(denyAll);
        Utils.log("State: " + state);

        if (Utils.objectClickable(bannerCookiebot) && super.state === 0) {
            Utils.log("CookieBot Banner found");
            cookiebotCheckBoxes.forEach(function (checkbox) {
                checkbox.setAttribute("checked", "false");
                Utils.log("Checkbox unset");
            });
            super.state = 1;
        } else if (Utils.objectClickable(allowAllButton) && super.state === 1) {
            Utils.log("Click Save now");
            allowAllButton.click();
            super.reset("CookieBot", "0.0.0");
        }
        // this is a special Case for V2. The Banner was found and we only click on the Deny Button.
        else if (Utils.objectClickable(denyAll) && super.state === 1) {
            Utils.log("Click Deny All now");
            denyAll.click();
            super.reset("CookieBot", "0.0.0");
        }
    }

}