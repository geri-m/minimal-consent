"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"
import Logger from "../Logger";

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
        Logger.log("advanced: " + advancedButton);

        const spanOn = '.on';
        let spanOnGroup = this._cmp.queryNodeSelectorAll(spanOn);
        Logger.log(spanOnGroup);
        Logger.log("Span on Group Length: " + spanOnGroup.length);

        const submit = ".submit";
        let submitButton = this._cmp.queryNodeSelector(submit);
        Logger.log("submit: '" + submitButton + "' " + JSON.stringify(submitButton));

        const close = ".close";
        let closeButton = this._cmp.queryNodeSelector(close);
        Logger.log("Close: " + closeButton);
        Logger.log("State: " + this._cmp.state);


        if (Utils.objectClickable(moreInformationButton) && this._cmp.state < 1) {
            Logger.log("moreInformationButton clicked");
            moreInformationButton.click();
            this._cmp.state = 1;
        } else if (Utils.objectClickable(advancedButton) && this._cmp.state < 2) {
            Logger.log("advanced clicked");
            advancedButton.click();
            this._cmp.state = 2;
        } else if (spanOnGroup && spanOnGroup.length > 1 && this._cmp.state < 3) {
            spanOnGroup.forEach((span: any) => {
                Logger.log("Changing Button");
                span.click();
            });
            this._cmp.state = 3;
        } else if (Utils.objectClickable(submitButton) && this._cmp.state === 3) {
            Logger.log("Click Submit");
            submitButton.click();
            this._cmp.state = 4;
        } else if (Utils.objectClickable(closeButton) && this._cmp.state === 4) {
            Logger.log("closeButton clicked");
            closeButton.click();
            this._cmp.reset();
        }
    }
}