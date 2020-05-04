"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"

export default class TrustArcIFrame implements ICmp {

    readonly _cmp: CMP;
    private readonly _name = "TrustArc Inc (IFrame)";

    constructor(node: Document, scriptUrl: string, backendCall: BackendCall) {
        backendCall.cmpData(41, this._name, scriptUrl, CmpType.DO_NOT_WAIT, true);
        this._cmp = new CMP(node, backendCall, this);
    }

    public get name(): string {
        return this._name
    }

    public connect(): void {
        this._cmp.connect();
    }

    /*

        https://docs.oracle.com/
        https://newsroom.ibm.com/

     */

    public handleCmp(): void {

        // from within IFrame
        const moreInformation = ".shp";
        let moreInformationButton = this._cmp.queryNodeSelector(moreInformation);

        const advanced = ".advance";
        let advancedButton = this._cmp.queryNodeSelector(advanced);
        Utils.log("advanced: " + advancedButton);

        const spanOn = '.on';
        let spanOnGroup = this._cmp.queryNodeSelectorAll(spanOn);
        Utils.log(spanOnGroup);
        Utils.log("Span on Group Length: " + spanOnGroup.length);

        const submit = ".submit";
        let submitButton = this._cmp.queryNodeSelector(submit);
        Utils.log("submit: '" + submitButton + "' " + JSON.stringify(submitButton));

        const close = ".close";
        let closeButton = this._cmp.queryNodeSelector(close);
        Utils.log("Close: " + closeButton);
        Utils.log("State: " + this._cmp.state);


        if (Utils.objectClickable(moreInformationButton) && this._cmp.state < 1) {
            Utils.log("moreInformationButton clicked");
            moreInformationButton.click();
            this._cmp.state = 1;
        } else if (Utils.objectClickable(advancedButton) && this._cmp.state < 2) {
            Utils.log("advanced clicked");
            advancedButton.click();
            this._cmp.state = 2;
        } else if (spanOnGroup && spanOnGroup.length > 1 && this._cmp.state < 3) {
            spanOnGroup.forEach((span: any) => {
                Utils.log("Changing Button");
                span.click();
            });
            this._cmp.state = 3;
        } else if (Utils.objectClickable(submitButton) && this._cmp.state === 3) {
            Utils.log("Click Submit");
            submitButton.click();
            this._cmp.state = 4;
        } else if (Utils.objectClickable(closeButton) && this._cmp.state === 4) {
            Utils.log("closeButton clicked");
            closeButton.click();
            this._cmp.reset();
        }
    }
}