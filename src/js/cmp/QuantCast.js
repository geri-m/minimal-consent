"use strict";

import Utils from "../Utils";
import CMP from "./CMP";

export default class QuantCast extends CMP {

    constructor(node) {
        super(node);
    }

    handleCmp() {
        Utils.log('handleQuantcast');

        const purpose = "a#qc-cmp-purpose-button";
        let purposeButton = document.querySelector(purpose);

        const denyAll = "button.qc-cmp-enable-button";
        let denyAllButton = document.querySelector(denyAll);

        const save = "button.qc-cmp-save-and-exit";
        let saveButton = document.querySelector(save);

        // press on "Options"
        if (Utils.objectClickable(purposeButton) && super.state === 0) {
            super.state = 1;
            purposeButton.click();
        }
        // disable all
        else if (Utils.objectClickable(denyAllButton) && super.state === 1) {
            super.state = 2;
            denyAllButton.click();
        }
        // save settings
        else if (Utils.objectClickable(saveButton) && super.state === 2) {
            saveButton.click();
            super.reset("Quantcast", "4957");
        }
    }
}