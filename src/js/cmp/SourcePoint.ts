"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"

export default class SourcePoint implements ICmp {

    readonly _cmp: CMP;
    private readonly _name = "Sourcepoint Technologies, Inc.";
    private _firstStepCompleted: boolean = false;
    private _secondStepCompleted: boolean = false;
    private _firstTimeout: ReturnType<typeof setTimeout>;
    private _secondTimeout: ReturnType<typeof setTimeout>;

    constructor(node: Document, scriptUrl: string, backendCall: BackendCall) {
        backendCall.cmpData(6, this._name, scriptUrl, CmpType.DO_NOT_WAIT, true);
        this._cmp = new CMP(node, backendCall, this);
    }

    public get name(): string {
        return this._name
    }

    public connect(): void {
        this._cmp.connect();
    }

    // Sample: https://www.stornowaygazette.co.uk/, https://www.thetimes.co.uk/, https://www.duden.de/
    // https://notice.sp-prod.net/?message_id=116465&amp;mms_origin=https://cmp.stornowaygazette.co.uk/mms/v2%22%20id=%22sp_message_iframe_116465
    // https://notice.sp-prod.net/?message_id=101175&amp;mms_origin=https://cmp.thetimes.co.uk/mms/v2%22%20id=%22sp_message_iframe_101175
    // https://www.doodle.com
    // https://www.openthesaurus.de/ => not working.
    // https://www.vice.com/de

    public handleCmp(): void {

        // This is the first Iframe, we need to handle. Here we click on details.
        // for some reason the Observer does not detect the changes.
        if (document.location.toString().includes("sp-prod.net") && !this._firstStepCompleted) {
            Utils.log("in 1st IFrame");
            let _self = this;
            let _counter = 0;
            this._firstTimeout = setTimeout(function () {
                _self.firstButton(_self, _counter);
            }, 1000);
        }

        // This is the Second Iframe, we need to handle. Here we uncheck all the checkboxes and save.
        // for some reason the Observer does not detect the changes.
        if (document.location.toString().includes("sourcepoint.mgr.consensu.org") && !this._secondStepCompleted) {
            Utils.log("in 2nd IFrame");
            let _self = this;
            let _counter = 0;
            this._secondTimeout = setTimeout(function () {
                _self.secondButton(_self, _counter);
            }, 1000);
        }
    }

    private firstButton(_self: SourcePoint, _counter: number): void {
        const allpopup = "button.message-button";
        let allpopupButtons = _self._cmp.queryNodeSelectorAll(allpopup);

        // press on "Options"
        if (Utils.objectClickable(allpopupButtons[0]) && allpopupButtons.length > 0) {

            Utils.log("Details clicked.");
            _counter = 51;
            _self._firstStepCompleted = true;
            clearTimeout(_self._firstTimeout);
            allpopupButtons[0].click();
        } else if (_counter < 50) {
            _self._firstTimeout = setTimeout(function () {
                _self.secondButton(_self, _counter);
            }, 1000);
            _counter++;
            Utils.log("Counter: (1st Button)" + _counter);
        }
    }

    private secondButton(_self: SourcePoint, _counter: number) {
        const switchesAll = "div.sp-switch-arrow-block";
        let switchesAllDiv = _self._cmp.queryNodeSelectorAll(switchesAll);
        Utils.log("All switchesAll: " + switchesAllDiv.length);

        const switchesOn = "div.sp-switch-arrow-block a.on";
        let switchesOnDiv = _self._cmp.queryNodeSelectorAll(switchesOn);
        Utils.log("On switchesAll: " + switchesOnDiv.length);

        const save = "button.priv-save-btn";
        let saveButton = _self._cmp.queryNodeSelector(save);
        Utils.log("Save Button: " + saveButton);

        const save2 = "button#tab-saveandexit";
        let saveButton2 = _self._cmp.queryNodeSelector(save2);
        Utils.log("Save2 Button: " + saveButton2);

        // if there is at least one switch and if there is at least on switch "ON"
        if (switchesAllDiv.length > 0 && (Utils.objectClickable(saveButton) || Utils.objectClickable(saveButton2))) {

            // if there as switches to switch off, do so.
            if (switchesOnDiv.length > 0) {
                switchesOnDiv.forEach((href: any) => {
                    Utils.log("Changing Button from ON to Off");
                    href.click();
                });
            }

            // now confirm.
            if (Utils.objectClickable(saveButton)) {
                saveButton.click();
            } else {
                saveButton2.click();
            }

            _counter = 51;
            _self._secondStepCompleted = true;
            clearTimeout(_self._secondTimeout);

            _self._cmp.reset();
        } else if (_counter < 50) {
            _self._secondTimeout = setTimeout(function () {
                _self.secondButton(_self, _counter);
            }, 1000);
            _counter++;
            Utils.log("Counter (2nd Button): " + _counter);
        }
    }

}
