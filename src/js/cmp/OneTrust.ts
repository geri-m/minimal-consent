"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"

export default class OneTrust implements ICmp {

    readonly _cmp: CMP;
    private readonly _name = "OneTrust LLC";

    constructor(node: Document, scriptUrl: string, backendCall: BackendCall) {
        backendCall.cmpData(28, this._name, scriptUrl, CmpType.WAIT_FOR_TIME_FRAME, true);
        this._cmp = new CMP(node, backendCall, this);
    }

    public get name(): string {
        return this._name
    }

    public connect(): void {
        this._cmp.connect();
    }

    public handleCmp(): void {
        const optanonDetailsSelectorV1 = "button#onetrust-pc-btn-handler";
        let optananDetailsV1 = this._cmp.queryNodeSelector(optanonDetailsSelectorV1);

        const optanonSaveSettingsSelectorV1 = "button.save-preference-btn-handler";
        let optanonSaveSettingsV1 = this._cmp.queryNodeSelector(optanonSaveSettingsSelectorV1);

        const optanonCheckBoxesSelectorV1 = "input[type*='checkbox'].switch-checkbox";
        let optanonCheckboxesV1 = this._cmp.queryNodeSelectorAll(optanonCheckBoxesSelectorV1);

        const optanonDetailsV2 = "button.optanon-toggle-display";
        let optanonDetailsButtonV2 = this._cmp.queryNodeSelector(optanonDetailsV2);

        // this button is crappy to find, as there is no ID or class.
        const optanonSaveSettingsSelectorV2 = "button[onclick*='Save']"; //button.optanon-save-settings-button
        let optanonSaveSettingsV2 = this._cmp.queryNodeSelector(optanonSaveSettingsSelectorV2);

        const optanonListItemsSelectorV2 = "li.menu-item-on";
        let optanonListItemsV2 = this._cmp.queryNodeSelectorAll(optanonListItemsSelectorV2);

        const optanonCheckboxesSelectorV2 = "input[type*='checkbox']";
        let optanonCheckBoxesV2 = this._cmp.queryNodeSelectorAll(optanonCheckboxesSelectorV2);


        const optanonOnetrustRejectAllandler = "button#onetrust-reject-all-handler";
        let optanonOnetrustRejectAllandlerButton = this._cmp.queryNodeSelector(optanonOnetrustRejectAllandler);


        // Variante 3 (Single-Press is prefered over others
        if (Utils.objectClickable(optanonOnetrustRejectAllandlerButton) && this._cmp.state === 0) {
            Utils.log("V3 (first click)");
            optanonOnetrustRejectAllandlerButton.click();
            Utils.log("Reject all clicked");
            this._cmp.state = 1;
        } else if (Utils.objectClickable(optanonOnetrustRejectAllandlerButton) && this._cmp.state === 1) {
            Utils.log("V3 (second click)");
            optanonOnetrustRejectAllandlerButton.click();
            Utils.log("Reject all clicked");
            this._cmp.reset();
        }
        // Variant 1
        else if (Utils.objectClickable(optananDetailsV1) && this._cmp.state === 0) {
            Utils.log("V1");
            optananDetailsV1.click();
            Utils.log("Details clicked");
            this._cmp.state = 1;
        } else if (Utils.objectClickable(optanonSaveSettingsV1) && optanonCheckboxesV1.length && this._cmp.state === 1) {
            Utils.log(optanonCheckboxesV1.length);
            optanonCheckboxesV1.forEach(function (checkbox: any) {
                checkbox.setAttribute("checked", "false");
                Utils.log("Checkbox unset");
            });
            optanonSaveSettingsV1.click();
            Utils.log("Save Settings Clicked click");
            this._cmp.state = 2;
        } else if (Utils.objectClickable(optanonOnetrustRejectAllandlerButton) && this._cmp.state === 2) {
            Utils.log("V1 (second click)");
            optanonOnetrustRejectAllandlerButton.click();
            Utils.log("Reject all clicked");
            this._cmp.reset();
        }

        // Variant 2
        else if (Utils.objectClickable(optanonDetailsButtonV2) && this._cmp.state === 0) {
            Utils.log("V2");
            optanonDetailsButtonV2.click();
            Utils.log("Details clicked");
            this._cmp.state = 3;
        } else if (Utils.objectClickable(optanonSaveSettingsV2) && this._cmp.state === 3) {
            Utils.log("Save Button found");
            optanonListItemsV2.forEach(function (listItem: any) {
                listItem.click();
                Utils.log("Checkbox unset");
                optanonCheckBoxesV2.forEach(function (checkbox: any) {
                    checkbox.setAttribute("checked", "false");
                    Utils.log("Checkbox unset");
                })
            });
            optanonSaveSettingsV2.click();
            this._cmp.reset();
        }
    }
}
