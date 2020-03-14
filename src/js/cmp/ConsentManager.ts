"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"

export default class ConsentManager implements ICmp {

    readonly _cmp: CMP;
    private readonly _name = "ConsentManager.net";

    constructor(node: Document, scriptUrl: string, backendCall: BackendCall) {
        backendCall.cmpData(31, this._name, scriptUrl, CmpType.WAIT_FOR_ASYNC_CALLBACK, true);
        this._cmp = new CMP(node, backendCall, this);
    }

    get name(): string {
        return this._name
    }

    handleCmp() {
        const deny = '#cmpbntnotxt';
        let buttonDeny = this._cmp.queryNodeSelector(deny);
        if (Utils.objectClickable(buttonDeny) && this._cmp.state === 0) {
            buttonDeny.click();
            this._cmp.reset();
        }

        // TODO: Requires a second Step for the ugly guis.
        // Currently there is a <a href='#' with an on Click Action which is a bit painful to handle
    }

}