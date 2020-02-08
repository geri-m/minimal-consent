"use strict";

import Utils from "../Utils";
import CMP from "./CMP";

export default class Traffective extends CMP {

    constructor(node) {
        super(node);
    }

    handleCmp() {
        Utils.log('handleTraffective');
        const gdprDiv = 'div.gdpr_popup_popup';
        let popup = super.node.querySelector(gdprDiv);

        const gdprCheckBoxes = 'input[type=checkbox].gdpr_switch_native';
        let checkboxes = super.node.querySelectorAll(gdprCheckBoxes);

        const gdprSaveButton = 'div.is-primary-button';
        let saveButton = super.node.querySelector(gdprSaveButton);

        if (Utils.objectClickable(popup) && super.state === 0) {
            Utils.log('Checkboxes found: ' + checkboxes.length);
            checkboxes.forEach(checkbox => checkbox.setAttribute("checked", "false"), Utils.log("Checkbox unset"));
            super.state = 1;
        } else if (Utils.objectClickable(saveButton) && super.state === 1) {
            Utils.log('Button found ...');
            saveButton.click();
            super.reset("Traffective.js", "0.0.0");
        }
    }
}