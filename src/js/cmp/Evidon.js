"use strict";

import Utils from "../Utils";
import CMP from "./CMP";


export default class Evidon extends CMP {

    constructor(node, scriptUrl) {
        super(node, "Evidon", scriptUrl);
    }


    handleCmp() {
        Utils.log('handleEvidonx');
        const evidonDenyAll = "button#_evidon-decline-button";

        let button = super.queryNodeSelector(evidonDenyAll);

        // we do require 3 attempts to decline the tracking
        if (Utils.objectClickable(button) && super.state === 0) {
            super.state = 1;
            button.click();
        } else if (Utils.objectClickable(button) && super.state === 1) {
            super.state = 2;
            button.click();
        } else if (Utils.objectClickable(button) && super.state === 2) {
            super.state = 3;
            button.click();
            super.reset("Evidon", "4957");
        }
    }
}