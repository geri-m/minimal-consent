"use strict";

import Utils from "../Utils";
import CMP from "./CMP";

export default class OneTrust extends CMP {

    constructor(node) {
        super(node);
    }

    handleCmp() {
        Utils.log('handleOneTrust');

        const optanonDetailsSelectorV1 = "#onetrust-pc-btn-handler";
        let optananDetailsV1 = super.queryNodeSelector(optanonDetailsSelectorV1);

        const optanonSaveSettingsSelectorV1 = "button.save-preference-btn-handler";
        let optanonSaveSettingsV1 = super.queryNodeSelector(optanonSaveSettingsSelectorV1);

        const optanonCheckBoxesSelectorV1 = "checkbox.switch-checkbox";
        let optanonCheckboxesV1 = super.queryNodeSelectorAll(optanonCheckBoxesSelectorV1);

        const optanonDetailsV2 = "button.optanon-toggle-display";
        let optanonDetailsButton = super.queryNodeSelector(optanonDetailsV2);

        // this button is crappy to find, as there is no ID or class.
        const optanonSaveSettingsSelectorV2 = "button[onclick*='Save']"; //button.optanon-save-settings-button
        let optanonSaveSettingsV2 = super.queryNodeSelector(optanonSaveSettingsSelectorV2);

        const optanonListItemsSelectorV2 = "li.menu-item-on";
        let optanonListItemsV2 = super.queryNodeSelectorAll(optanonListItemsSelectorV2);

        const optanonCheckboxesSelectorV2 = "input[type*='checkbox']";
        let optanonCheckBoxesV2 = super.queryNodeSelectorAll(optanonCheckboxesSelectorV2);

        // Variant 1
        if (Utils.objectClickable(optananDetailsV1) && super.state === 0) {
            optananDetailsV1.click();
            super.state = 1;
        } else if (Utils.objectClickable(optanonSaveSettingsV1) && super.state === 1) {

            optanonCheckboxesV1.forEach(function (checkbox) {
                checkbox.setAttribute("checked", "false");
                Utils.log("Checkbox unset");
            });

            optanonSaveSettingsV1.click();
            super.reset("OneTrust (V1)", "0.0.0");
        }

        // Variant 2
        else if (Utils.objectClickable(optanonDetailsButton) && super.state === 0) {
            optanonDetailsButton.click();
            Utils.log("Details clicked");
            super.state = 2;
        } else if (Utils.objectClickable(optanonSaveSettingsV2) && super.state === 2) {
            Utils.log("Save Button found");
            optanonListItemsV2.forEach(function (listItem) {
                listItem.click();
                Utils.log("Checkbox unset");
                optanonCheckBoxesV2.forEach(function (checkbox) {
                    checkbox.setAttribute("checked", "false");
                    Utils.log("Checkbox unset");
                })
            });
            optanonSaveSettingsV2.click();
            super.reset("OneTrust (V2)", "0.0.0");
        }
    }

}