"use strict";

import Utils from "../Utils";
import CMP from "./CMP";

export default class UserCentrics extends CMP {

    constructor(node, scriptUrl, pingresult) {
        super(node, "UserCentrics", scriptUrl, pingresult);
    }

    handleCmp() {
        Utils.log('handleUserCentrics');

        const ucBannerContent = 'div.uc-banner-content';
        let banner = super.queryNodeSelector(ucBannerContent);

        // typeof button !== 'undefined' && button && typeof button.parentElement !== 'undefined'
        // case like on hse24.de
        if (Utils.objectClickable(banner) && super.state === 0) {
            Utils.log('Deny All button found');
            let script = super.node.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.text = 'function s(counter){if(counter >= 100){return; } if(typeof this.usercentrics !== "undefined" && typeof this.usercentrics.denyAllConsentsAndCloseInitialView !== "undefined"){ this.usercentrics.denyAllConsentsAndCloseInitialView(); } else { setTimeout(function() {s(counter + 1)}, 25);  }}; s(1);';
            super.node.head.appendChild(script);
            super.reset();
        }
    }

}