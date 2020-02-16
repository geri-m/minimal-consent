"use strict";
import Utils from "./Utils";

import Truste from "./cmp/Truste";
import Evidon from "./cmp/Evidon"
import CustomImpl from "./cmp/CustomImpl";
import OneTrust from "./cmp/OneTrust";
import CookieBot from "./cmp/CookieBot";
import UserCentrics from "./cmp/UserCentrics";
import QuantCast from "./cmp/QuantCast";
import Traffective from "./cmp/Traffective";
import ConsentManager from "./cmp/ConsentManager";

// this is some static stuff for the long tail.
const buttons = {
    '#hs-eu-decline-button': "npmjs.com",
    "#cookie_action_close_header": "tealium.com"
};

const config = {attributes: true, childList: true, subtree: true};

export default class Detector {

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

    get initializedCmp() {
        return this._cmp;
    }

    handleCMP(mutations) {
        let allScriptTags = document.querySelectorAll("script");
        let scriptCounter;
        if (this._cmp) {
            Utils.log("CMP Defined");
            return;
        }
        for (scriptCounter = 0; scriptCounter < allScriptTags.length; scriptCounter++) {
            let urlOfScript = allScriptTags[scriptCounter].getAttribute("src");
            if (urlOfScript && urlOfScript !== 'undefined') {
                Utils.log(urlOfScript);
                if (urlOfScript.includes('truste.com') || urlOfScript.includes('trustarc.com') || urlOfScript.includes('trustarc.mgr.consensu.org')) {
                    this.disconnectObserver();
                    this._cmp = new Truste(this.targetNode, urlOfScript);
                    return;
                } else if (urlOfScript.includes('evidon.com') || urlOfScript.includes("evidon.mgr.consensu.org")) {
                    this.disconnectObserver();
                    this._cmp = new Evidon(this.targetNode, urlOfScript);
                    return;
                } else if (urlOfScript.includes('cookielaw.org') || urlOfScript.includes('cookiepro.com') || urlOfScript.includes('onetrust.mgr.consensu.org') || urlOfScript.includes('optanon')) {
                    this.disconnectObserver();
                    Utils.log("OneTrust");
                    this._cmp = new OneTrust(this.targetNode, urlOfScript);
                    return;
                } else if (urlOfScript.includes('cookiebot.com') || urlOfScript.includes("cookiebot.mgr.consensu.org")) {
                    this.disconnectObserver();
                    this._cmp = new CookieBot(this.targetNode, urlOfScript);
                    return;
                } else if (urlOfScript.includes('usercentrics.eu') || urlOfScript.includes('usercentrics.mgr.consensu.org')) {
                    this.disconnectObserver();
                    Utils.log("UserCentrics");
                    this._cmp = new UserCentrics(this.targetNode, urlOfScript);
                    return;
                } else if (urlOfScript.includes('quantcast.com') || urlOfScript.includes("quantcast.mgr.consensu.org")) {
                    this.disconnectObserver();
                    this._cmp = new QuantCast(this.targetNode, urlOfScript);
                    return;
                } else if (urlOfScript.includes('traffective.com') || urlOfScript.includes('traffective.mgr.consensu.org') || urlOfScript.includes('cdntrf.com')) {
                    this.disconnectObserver();
                    this._cmp = new Traffective(this.targetNode, urlOfScript);
                    return;
                } else if (urlOfScript.includes('consentmanager.mgr.consensu.org')) {
                    this.disconnectObserver();
                    this._cmp = new ConsentManager(this.targetNode, urlOfScript);
                    return;
                } else {
                    for (let key in buttons) {
                        let button = this.targetNode.querySelector(key);
                        if (Utils.objectClickable(button)) {
                            this.disconnectObserver();
                            this._cmp = new CustomImpl(this.targetNode, key);
                            return;
                        }
                    }
                } // Else
            } // IF - JavaScript is Defined
        } // For Loop
        Utils.log("-- Run Thru completed. No Indicator for JavaScript of a CMP so far.");
    }
}