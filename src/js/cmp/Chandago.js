"use strict";

import Utils from "../Utils";
import CMP from "./CMP";


export default class Chandago extends CMP {

    constructor(node, scriptUrl, backendCall) {
        super(2, node, "Chandago", scriptUrl, CMP.cmpType.WAIT_FOR_ASYNC_CALLBACK, true, backendCall);
    }

    handleCmp() {
        const chandagoButtonDenyCss = "button.deny";
        let chandagoButtonDeny = super.queryNodeSelector(chandagoButtonDenyCss);

        if (Utils.objectClickable(chandagoButtonDeny) && super.state === 0) {
            Utils.log("Click Deny now");
            // looks like this does not work.
            chandagoButtonDeny.click();
            Utils.log('Consent on denied.');
            super.reset();
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