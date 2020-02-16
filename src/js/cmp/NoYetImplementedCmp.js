"use strict";

import CMP from "./CMP";


export default class NotYetImplementedCmp extends CMP {

    constructor(cmpId, node, name, scriptUrl, backendCall) {
        // we use WAIT for Timeframe, as we don't know if it a TCF or a non-TCF CMP.
        super(cmpId, node, name, scriptUrl, CMP.cmpType.WAIT_FOR_TIME_FRAME, false, backendCall);
    }

    handleCmp() {
        super.reset();
    }
}