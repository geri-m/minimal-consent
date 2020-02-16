"use strict";

import Utils from "../Utils";
import CMP from "./CMP";


export default class OneTrust extends CMP {

    constructor(node, scriptUrl) {
        super(28, node, "OneTrust LLC", scriptUrl, CMP.cmpType.WAIT_FOR_TIME_FRAME, true);
    }

    handleCmp() {
        const optanonDetailsSelectorV1 = "button#onetrust-pc-btn-handler";
        let optananDetailsV1 = super.queryNodeSelector(optanonDetailsSelectorV1);

        const optanonSaveSettingsSelectorV1 = "button.save-preference-btn-handler";
        let optanonSaveSettingsV1 = super.queryNodeSelector(optanonSaveSettingsSelectorV1);

        const optanonCheckBoxesSelectorV1 = "input[type*='checkbox'].switch-checkbox";
        let optanonCheckboxesV1 = super.queryNodeSelectorAll(optanonCheckBoxesSelectorV1);

        const optanonDetailsV2 = "button.optanon-toggle-display";
        let optanonDetailsButtonV2 = super.queryNodeSelector(optanonDetailsV2);

        // this button is crappy to find, as there is no ID or class.
        const optanonSaveSettingsSelectorV2 = "button[onclick*='Save']"; //button.optanon-save-settings-button
        let optanonSaveSettingsV2 = super.queryNodeSelector(optanonSaveSettingsSelectorV2);

        const optanonListItemsSelectorV2 = "li.menu-item-on";
        let optanonListItemsV2 = super.queryNodeSelectorAll(optanonListItemsSelectorV2);

        const optanonCheckboxesSelectorV2 = "input[type*='checkbox']";
        let optanonCheckBoxesV2 = super.queryNodeSelectorAll(optanonCheckboxesSelectorV2);


        // Variant 1
        if (Utils.objectClickable(optananDetailsV1) && super.state === 0) {
            Utils.log("V1");
            optananDetailsV1.click();
            Utils.log("Details clicked");
            super.state = 1;
        } else if (Utils.objectClickable(optanonSaveSettingsV1) && optanonCheckboxesV1.length && super.state === 1) {
            Utils.log(optanonCheckboxesV1.length);
            optanonCheckboxesV1.forEach(function (checkbox) {
                checkbox.setAttribute("checked", "false");
                Utils.log("Checkbox unset");
            });
            optanonSaveSettingsV1.click();
            Utils.log("Settings click");
            super.reset();
        }

        // Variant 2
        else if (Utils.objectClickable(optanonDetailsButtonV2) && super.state === 0) {
            Utils.log("V2");
            optanonDetailsButtonV2.click();
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
            super.reset();
        }
    }

}