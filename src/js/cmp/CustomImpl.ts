"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"

export default class CustomImpl implements ICmp {

    readonly _cmp: CMP;
    private readonly _name = "Custom Implementation";
    private readonly _button: string;

    constructor(node: Document, key: string, backendCall: BackendCall) {
        backendCall.cmpData(0, this._name, "na", CmpType.DO_NOT_WAIT, true);
        this._cmp = new CMP(node, backendCall, this);
        this._button = key;
    }

    public get name(): string {
        return this._name
    }

    public connect(): void {
        this._cmp.connect();
    }

    public handleCmp(): void {
        let button = this._cmp.queryNodeSelector(this._button);

        if (Utils.objectClickable(button) && this._cmp.state === 0) {
            Utils.log("Button Found, clicking");
            button.click();
            this._cmp.reset();
        }
    }

}