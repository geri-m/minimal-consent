"use strict";

import Utils from "../Utils";
import CMP from "./CMP";


export default class Traffective extends CMP {

    constructor(node, scriptUrl) {
        super(node, "Traffective", scriptUrl, CMP.cmpType.WAIT_FOR_ASYNC_CALLBACK);
    }

    handleCmp() {
        Utils.log('handleTraffective');
        const gdprDiv = 'div.gdpr_popup_popup';
        let popup = super.queryNodeSelector(gdprDiv);

        const gdprCheckBoxes = 'input[type=checkbox].gdpr_switch_native';
        let checkboxes = super.queryNodeSelectorAll(gdprCheckBoxes);

        const gdprSaveButton = 'div.is-primary-button';
        let saveButton = super.queryNodeSelector(gdprSaveButton);

        if (Utils.objectClickable(popup) && super.state === 0) {
            Utils.log('Checkboxes found: ' + checkboxes.length);
            checkboxes.forEach(checkbox => checkbox.setAttribute("checked", "false"), Utils.log("Checkbox unset"));
            super.state = 1;
        } else if (Utils.objectClickable(saveButton) && super.state === 1) {
            Utils.log('Button found ...');
            saveButton.click();
            super.reset();
        }
    }
}