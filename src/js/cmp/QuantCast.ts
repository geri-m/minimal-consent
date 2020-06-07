"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"
import Logger from "../Logger";

export default class QuantCast implements ICmp {

    readonly _cmp: CMP;
    private readonly _name = "Quantcast International Limited";

    constructor(node: Document, scriptUrl: string, backendCall: BackendCall) {
        backendCall.cmpData(10, this._name, scriptUrl, CmpType.WAIT_FOR_ASYNC_CALLBACK, true);
        this._cmp = new CMP(node, backendCall, this);
    }

    public get name(): string {
        return this._name
    }

    public connect(): void {
        this._cmp.connect();
    }

    public handleCmp(): void {
        const purpose = "a#qc-cmp-purpose-button";
        let purposeButton = this._cmp.queryNodeSelector(purpose);

        const denyAll = "button.qc-cmp-button.qc-cmp-secondary-button";
        let denyAllButton = this._cmp.queryNodeSelector(denyAll);

        const save = "button.qc-cmp-button.qc-cmp-save-and-exit";
        let saveButton = this._cmp.queryNodeSelector(save);

        // V2
        const moreInformation = "button[mode*='secondary']";
        var moreInformationCont = this._cmp.queryNodeSelector(moreInformation);


        // press on "Options"
        /* https://www.programiz.com/, https://wwd.com/ https://www.pronews.gr,  https://news.meine-buchhandlung.wien/, https://imgur.com/, https://www.independent.co.uk/ https://www.cyclingnews.com/ */
        if ((Utils.objectClickable(purposeButton) || Utils.objectClickable(denyAllButton)) && this._cmp.state === 0) {
            Logger.log("Case 1, Step 1");
            this._cmp.state = 1;
            if (Utils.objectClickable(purposeButton)) {
                purposeButton.click();
            } else if (Utils.objectClickable(denyAllButton)) {
                denyAllButton.click();
            } else {
                Logger.log("We should not end up here");
            }
        }
        // disable all
        else if (Utils.objectClickable(denyAllButton) && this._cmp.state === 1) {
            Logger.log("Case 1, Step 2");
            this._cmp.state = 2;
            denyAllButton.click();
        }
        // save settings
        else if (Utils.objectClickable(saveButton) && this._cmp.state === 2) {
            Logger.log("Case 1, Step 3 & Final");
            saveButton.click();
            this._cmp.reset();
        } else if (Utils.objectClickable(moreInformationCont) && this._cmp.state === 0) {
            Logger.log("Case 2, Step 1");
            this._cmp.state = 1;
            moreInformationCont.click();

            let _self = this;

            setTimeout(function () {

                const headlines = "li.qc-cmp2-list-item";
                let expandHeadlines = _self._cmp.queryNodeSelectorAll(headlines);
                Logger.log("expandHeadlines: " + expandHeadlines.length);
                expandHeadlines.forEach(function (value: any, key: number, parent: NodeList) {
                    Logger.log("Click Headline");
                    value.click();
                });

                const switchToggle = "button[aria-pressed='true']";
                let switchToogleButtons = _self._cmp.queryNodeSelectorAll(switchToggle);
                Logger.log("Checkboxes: " + switchToogleButtons.length);
                switchToogleButtons.forEach(function (value: any, key: number, parent: NodeList) {
                    Logger.log("Click Checkbox");
                    value.click();
                });

                moreInformationCont = _self._cmp.queryNodeSelector(moreInformation);
                Logger.log("Case 2, Step 2");
                moreInformationCont.click();
                _self._cmp.reset();
            }, 500);


        }
    }


}