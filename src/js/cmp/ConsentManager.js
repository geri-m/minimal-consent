"use strict";

import Utils from "../Utils";
import CMP from "./CMP";

export default class ConsentManager extends CMP {

    constructor(node) {
        super(node);
    }

    handleCmp() {
        Utils.log('handleConsentManager');
        const deny = '#cmpbntnotxt';
        let buttonDeny = super.node.querySelector(deny);
        if (Utils.objectClickable(buttonDeny) && super.state === 0) {
            buttonDeny.click();
            super.reset("Consent Manager", "0.0.0");
        }

        // TODO: Requires a second Step for the ugly guis.
        // Currently there is a <a href='#' with an on Click Action which is a bit painful to handle

    }

}