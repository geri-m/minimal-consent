"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"
import Logger from "../Logger";

export default class Chandago implements ICmp {

    readonly _cmp: CMP;
    private readonly _name = "Chandago";

    constructor(node: Document, scriptUrl: string, backendCall: BackendCall) {
        backendCall.cmpData(2, this._name, scriptUrl, CmpType.WAIT_FOR_ASYNC_CALLBACK, true);
        this._cmp = new CMP(node, backendCall, this);
    }

    public get name(): string {
        return this._name
    }

    public connect(): void {
        this._cmp.connect();
    }

    public handleCmp(): void {
        const chandagoButtonDenyCss = "button.deny";
        let chandagoButtonDeny = this._cmp.queryNodeSelector(chandagoButtonDenyCss);

        if (Utils.objectClickable(chandagoButtonDeny) && this._cmp.state === 0) {
            Logger.log("Click Deny now");
            // looks like this does not work.
            chandagoButtonDeny.click();
            Logger.log('Consent on denied.');
            this._cmp.reset();
        }
    }
}