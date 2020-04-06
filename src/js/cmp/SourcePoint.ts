"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"

export default class SourcePoint implements ICmp {

    readonly _cmp: CMP;
    private readonly _name = "Sourcepoint Technologies, Inc.";

    constructor(node: Document, scriptUrl: string, backendCall: BackendCall) {
        backendCall.cmpData(6, this._name, scriptUrl, CmpType.WAIT_FOR_ASYNC_CALLBACK, true);
        this._cmp = new CMP(node, backendCall, this);
    }

    public get name(): string {
        return this._name
    }

    public connect(): void {
        this._cmp.connect();
    }

    // Sample: https://www.stornowaygazette.co.uk/, https://www.thetimes.co.uk/
    // https://notice.sp-prod.net/?message_id=116465&amp;mms_origin=https://cmp.stornowaygazette.co.uk/mms/v2%22%20id=%22sp_message_iframe_116465
    // https://notice.sp-prod.net/?message_id=101175&amp;mms_origin=https://cmp.thetimes.co.uk/mms/v2%22%20id=%22sp_message_iframe_101175
    public handleCmp(): void {
        const allpopup = "button.message-button";
        let allpopupButtons = this._cmp.queryNodeSelectorAll(allpopup);


        // press on "Options"
        if (Utils.objectClickable(allpopupButtons[0]) && allpopupButtons.length > 0) {
            allpopupButtons[0].click();
            Utils.log("Details clicked.");
        }


        let _self = this;
        let _counter = 0;
        setTimeout(function () {
            _self.print(_self, _counter);
        }, 1000);
    }

    private print(_self: SourcePoint, _counter: number) {
        const left = "div.right";
        let leftCheckbox = this._cmp.queryNodeSelectorAll(left);
        Utils.log("leftCheckbox " + leftCheckbox.length);

        const save = "button.priv-save-btn";
        let saveButton = this._cmp.queryNodeSelector(save);
        Utils.log("saveButton " + saveButton);

        if (Utils.objectClickable(leftCheckbox[0]) && Utils.objectClickable(saveButton) && leftCheckbox.length > 0) {
            leftCheckbox.forEach((span: any) => {
                Utils.log("Changing Button");
                span.click();
            });

            _counter = 51;
            saveButton.click();
            this._cmp.reset();
        }

        if (_counter < 50) {
            setTimeout(function () {
                _self.print(_self, _counter);
            }, 1000);
            _counter++;
            Utils.log("Counter: " + _counter);
        }

    }

}
