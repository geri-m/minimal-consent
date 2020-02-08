"use strict";

import Utils from "./Utils";
import Traffective from "./cmp/Traffective";
import UserCentrics from "./cmp/UserCentrics";
import ConsentManager from "./cmp/ConsentManager";
import Truste from "./cmp/Truste";
import OneTrust from "./cmp/OneTrust";
import Evidon from "./cmp/Evidon"
import CookieBot from "./cmp/CookieBot";
import CustomImpl from "./cmp/CustomImpl";


// this is some static stuff for the long tail.
const buttons = {
    '#hs-eu-decline-button': "npmjs.com",
    "#cookie_action_close_header": "tealium.com"
};

const config = {attributes: true, childList: true, subtree: true};

export default class Detector {

    constructor(node) {
        this.state = 0;
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
        let docHtml = document.documentElement.innerHTML;
        if (docHtml.includes('traffective.com') || docHtml.includes('traffective.mgr.consensu.org')) {
            this.disconnectObserver();
            this.cmp = new Traffective(this.targetNode);
        } else if (docHtml.includes('usercentrics.eu') || docHtml.includes('usercentrics.mgr.consensu.org')) {
            this.disconnectObserver();
            this.cmp = new UserCentrics(this.targetNode);
        } else if (docHtml.includes('consentmanager.mgr.consensu.org')) {
            this.disconnectObserver();
            this.cmp = new ConsentManager(this.targetNode);
        } else if (docHtml.includes('truste.com') || docHtml.includes('trustarc.com') || docHtml.includes('trustarc.mgr.consensu.org')) {
            this.disconnectObserver();
            this.cmp = new Truste(this.targetNode);
        } else if (docHtml.includes('cookielaw.org') || docHtml.includes('cookiepro.com') || docHtml.includes('onetrust.mgr.consensu.org') || docHtml.includes('optanon')) {
            this.disconnectObserver();
            this.cmp = new OneTrust(this.targetNode);
        } else if (docHtml.includes('evidon.com') || docHtml.includes("evidon.mgr.consensu.org")) {
            this.disconnectObserver();
            this.cmp = new Evidon(this.targetNode);
        } else if (docHtml.includes('quantcast.com') || docHtml.includes("quantcast.mgr.consensu.org")) {
            this.disconnectObserver();
            this.cmp = new QuantCast(this.targetNode);
        } else if (docHtml.includes('cookiebot.com') || docHtml.includes("cookiebot.mgr.consensu.org")) {
            this.disconnectObserver();
            this.cmp = new CookieBot(this.targetNode);
        } else {
            Utils.log('No CMP found yet - looking for general Cookie Banners ');
            for (let key in buttons) {
                let button = this.targetNode.querySelector(key);
                if (Utils.objectClickable(button)) {
                    this.disconnectObserver();
                    this.cmp = new CustomImpl(this.targetNode, key);
                    break;
                }
            }
        }
    }
}