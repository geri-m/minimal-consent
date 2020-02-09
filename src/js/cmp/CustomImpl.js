"use strict";

import Utils from "../Utils";
import CMP from "./CMP";

export default class CustomImpl extends CMP {

    constructor(node, buttonToClick, scriptUrl) {
        super(node, [], "Custom Implementation", scriptUrl);
        this._button = buttonToClick;
    }

    static urlPattern() {
        return urlPattern;
    }

    handleCmp() {
        Utils.log('Custom Implementation ');
        let button = super.queryNodeSelector(this._button);
        let minimalConsent = super.queryNodeSelector(super.minimalConsentLink);

        if (Utils.objectClickable(button) && super.state === 0) {
            Utils.log("GDPR Button + Decline found: " + this._button);
            let javaScript = 'javascript:function s(){ super.queryNodeSelector(\"' + this._button + '\").click();} s();';
            Utils.createMinimalConsentButton(super.node, javaScript);
            super.state = 1;
        } else if (Utils.objectClickable(minimalConsent) && super.state === 1) {
            Utils.log("New button is here");
            minimalConsent.click();
            Utils.log('Consent on denied.');
            super.reset("Custom Banner", "0.0.0");
        }

    }
}