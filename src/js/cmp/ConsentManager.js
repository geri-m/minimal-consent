"use strict";

import Utils from "../Utils";
import CMP from "./CMP";


export default class ConsentManager extends CMP {

    constructor(node, scriptUrl) {
        super(node, "ConsentManager", scriptUrl, CMP.cmpType.WAIT_FOR_ASYNC_CALLBACK);
    }


    handleCmp() {
        Utils.log('handleConsentManager');
        const deny = '#cmpbntnotxt';
        let buttonDeny = super.queryNodeSelector(deny);
        if (Utils.objectClickable(buttonDeny) && super.state === 0) {
            buttonDeny.click();
            super.reset();
        }

        // TODO: Requires a second Step for the ugly guis.
        // Currently there is a <a href='#' with an on Click Action which is a bit painful to handle

    }

}