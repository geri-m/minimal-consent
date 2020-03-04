"use strict";

import Utils from "../Utils";
import CMP from "./CMP";


export default class Evidon extends CMP {

    constructor(node, scriptUrl, backendCall) {
        super(18, node, "Evidon, Inc.", scriptUrl, CMP.cmpType.DO_NOT_WAIT, true, backendCall);
    }

    async handleCmp() {
        const evidonDenyAll = "button#_evidon-decline-button";
        let button = super.queryNodeSelector(evidonDenyAll);

        const evidonOptions = "button#_evidon-option-button";
        let evidonOptionsButton = super.queryNodeSelector(evidonOptions);

        const evidonDeclineAll = "button#evidon-prefdiag-decline";
        let evidonDenyAllButton = super.queryNodeSelector(evidonDeclineAll);

        // we do require 3 attempts to decline the tracking
        if (Utils.objectClickable(evidonOptionsButton) && super.state === 0) {
            Utils.log("Clicking Button 1");
            super.state = 1;
            evidonOptionsButton.click();
        } else if (Utils.objectClickable(evidonDenyAllButton) && super.state === 1) {
            await this.sleep(1000); // Pausiert die Funktion für 3 Sekunden
            Utils.log("Clicking Button 2");
            evidonDenyAllButton.click();
            super.reset();
        } else if (Utils.objectClickable(button) && super.state === 0) {
            Utils.log("Clicking Button xxx");
            button.click();
            super.reset();
        }
    }

    sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

}