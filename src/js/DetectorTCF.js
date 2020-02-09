"use strict";

import Utils from "./Utils";
import UserCentrics from "./cmp/UserCentrics";
import Traffective from "./cmp/Traffective";
import ConsentManager from "./cmp/ConsentManager";
import CookieBot from "./cmp/CookieBot";
import QuantCast from "./cmp/QuantCast";
import OneTrust from "./cmp/OneTrust";


const config = {attributes: true, childList: true, subtree: true};

export default class DetectorTCF {

    constructor(node, ping) {
        this.targetNode = node;
        this._pingresult = ping;
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
                if (urlOfScript.includes('usercentrics.eu') || urlOfScript.includes('usercentrics.mgr.consensu.org')) {
                    this.disconnectObserver();
                    this.cmp = new UserCentrics(this.targetNode, urlOfScript, this._pingresult);
                    return;
                } else if (urlOfScript.includes('quantcast.com') || urlOfScript.includes("quantcast.mgr.consensu.org")) {
                    this.disconnectObserver();
                    this.cmp = new QuantCast(this.targetNode, urlOfScript, this._pingresult);
                    return;
                } else if (urlOfScript.includes('cookiebot.com') || urlOfScript.includes("cookiebot.mgr.consensu.org")) {
                    this.disconnectObserver();
                    this.cmp = new CookieBot(this.targetNode, urlOfScript, this._pingresult);
                    return;
                }
                if (urlOfScript.includes('traffective.com') || urlOfScript.includes('traffective.mgr.consensu.org')) {
                    this.disconnectObserver();
                    this.cmp = new Traffective(this.targetNode, urlOfScript, this._pingresult);
                    return;
                } else if (urlOfScript.includes('usercentrics.eu') || urlOfScript.includes('usercentrics.mgr.consensu.org')) {
                    this.disconnectObserver();
                    this.cmp = new UserCentrics(this.targetNode, urlOfScript, this._pingresult);
                    return;
                } else if (urlOfScript.includes('consentmanager.mgr.consensu.org')) {
                    this.disconnectObserver();
                    this.cmp = new ConsentManager(this.targetNode, urlOfScript, this._pingresult);
                    return;
                } else if (urlOfScript.includes('cookielaw.org') || urlOfScript.includes('cookiepro.com') || urlOfScript.includes('onetrust.mgr.consensu.org') || urlOfScript.includes('optanon')) {
                    this.disconnectObserver();
                    this.cmp = new OneTrust(this.targetNode, urlOfScript, "0.0.0");
                    return;
                }
                /*
                We don't use this for performance reasons.

                else {
                    Utils.log("Script is not relevant for a CMP.");
               }

                 */
            }
        }
        Utils.log("Page implements a CMP, we are not yet aware of.");
    }
}