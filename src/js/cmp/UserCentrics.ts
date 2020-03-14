"use strict";

import Utils from "../Utils";
import CMP from "./CMP";
import ICmp from "./ICmp"
import CmpType from "./CmpType";
import BackendCall from "../BackendCall"

export default class UserCentrics implements ICmp {

    readonly _cmp: CMP;
    private readonly _name = "Usercentrics GmbH";

    constructor(node: Document, scriptUrl: string, backendCall: BackendCall) {
        backendCall.cmpData(5, this._name, scriptUrl, CmpType.WAIT_FOR_ASYNC_CALLBACK, true);
        this._cmp = new CMP(node, backendCall, this);
    }

    public get name(): string {
        return this._name
    }

    handleCmp() {
        // we are looking for a banner and if this banner is visible, we then inject the javascript.
        const ucBannerContent = 'div.uc-banner-content';
        let banner = this._cmp.queryNodeSelector(ucBannerContent);

        // typeof button !== 'undefined' && button && typeof button.parentElement !== 'undefined'
        // case like on hse24.de
        if (Utils.objectVisible(banner) && this._cmp.state === 0) {
            Utils.log('Deny All button found');
            let script = this._cmp.node.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.text = 'function s(counter){if(counter >= 100){return; } if(typeof this.usercentrics !== "undefined" && typeof this.usercentrics.denyAllConsentsAndCloseInitialView !== "undefined"){ this.usercentrics.denyAllConsentsAndCloseInitialView(); } else { setTimeout(function() {s(counter + 1)}, 25);  }}; s(1);';
            this._cmp.node.head.appendChild(script);
            this._cmp.reset();
        }
    }

}