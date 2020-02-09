"use strict";
import Utils from "./Utils";

import Truste from "./cmp/Truste";
import Evidon from "./cmp/Evidon"
import CustomImpl from "./cmp/CustomImpl";

// this is some static stuff for the long tail.
const buttons = {
    '#hs-eu-decline-button': "npmjs.com",
    "#cookie_action_close_header": "tealium.com"
};

const config = {attributes: true, childList: true, subtree: true};

export default class DetectorProprietary {

    constructor(node) {
        this.targetNode = node;
        // Options for the observer (which mutations to observe)
        let self = this;
        this.selectCmpObserver = new MutationObserver(function (mutations) {
            self.handleCMP(mutations);
        });
        this.selectCmpObserver.observe(this.targetNode, config);
    }

    disconnectObserver() {
        this.selectCmpObserver.disconnect();
    }

    handleCMP(mutations) {
        let allScriptTags = document.querySelectorAll("script");
        let scriptCounter;
        for (scriptCounter = 0; scriptCounter < allScriptTags.length; scriptCounter++) {
            let urlOfScript = allScriptTags[scriptCounter].getAttribute("src");
            if (urlOfScript && urlOfScript !== 'undefined') {
                if (urlOfScript.includes('truste.com') || urlOfScript.includes('trustarc.com') || urlOfScript.includes('trustarc.mgr.consensu.org')) {
                    this.disconnectObserver();
                    this.cmp = new Truste(this.targetNode, urlOfScript, "0.0.0");
                    return;
                } else if (urlOfScript.includes('evidon.com') || urlOfScript.includes("evidon.mgr.consensu.org")) {
                    this.disconnectObserver();
                    this.cmp = new Evidon(this.targetNode, urlOfScript, "0.0.0");
                    return;
                } else {
                    for (let key in buttons) {
                        let button = this.targetNode.querySelector(key);
                        if (Utils.objectClickable(button)) {
                            this.disconnectObserver();
                            this.cmp = new CustomImpl(this.targetNode, key, "0.0.0");
                            return;
                        }
                    }
                }
            }
        }
        Utils.log("-- Run Thru completed. No Indicator for JavaScript of a CMP so far.")
    }
}