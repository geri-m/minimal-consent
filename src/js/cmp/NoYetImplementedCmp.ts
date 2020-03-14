"use strict";

import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"

export default class NotYetImplementedCmp implements ICmp {

    readonly _cmp: CMP;
    private readonly _name: string;

    constructor(cmpId: number, name: string, node: Document, scriptUrl: string, backendCall: BackendCall) {
        this._name = name;
        backendCall.cmpData(cmpId, this._name, scriptUrl, CmpType.WAIT_FOR_TIME_FRAME, true);
        this._cmp = new CMP(node, backendCall, this);
    }

    public get name(): string {
        return this._name
    }

    public handleCmp(): void {
        this._cmp.reset();
    }
}
