"use strict";

import DetectorProprietary from "./DetectorProprietary";
import DetectorTCF from "./DetectorTCF";
import Utils from "./Utils";

const messageFrom = "FROM_MINIMAL_CONSENT";

// This is the script for checking whether there is a TCF 1.1 or TCF 2.0 compliant CMP.
let script = document.createElement('script');
script.type = 'text/javascript';
script.async = true;
script.text = 'window.addEventListener("load",function(){checkForCmp()},!1);let data={type:"FROM_MINIMAL_CONSENT"},counter=0,maxTimeoutForResearch=200,maxRetryForSearch=25;function checkForCmp(){console.log("checkForCmp"),this.__cmp?this.__cmp("ping",2,sendMessage):this.__tcfapi?this.__tcfapi("ping",2,sendMessage):this.frames&&this.frames.length&&this.frames.__tcfapiLocator?this.__tcfapi("ping",2,sendMessage):counter<maxRetryForSearch&&(setTimeout(checkForCmp,maxTimeoutForResearch),counter++)}function sendMessage(e,t){t&&(data.cmp=JSON.stringify(e),window.postMessage(data,"*"))}';
document.head.appendChild(script);

// Select the node that will be observed for mutations
const targetNode = document.getRootNode();

const detectorProp = new DetectorProprietary(targetNode);

window.addEventListener("message", function (event) {
    // We only accept messages from ourselves
    if (event.source !== window)
        return;

    // only if there TCF 1.1 or TFC 2.0 compliant CMP found, launch the appropriate detector.
    if (event.data.type && (event.data.type === messageFrom)) {
        // chancel looking for a proprietary CMP.
        detectorProp.disconnectObserver();
        const detectorTcf = new DetectorTCF(targetNode, JSON.stringify(event.data.cmp));
        Utils.log("Content script received message: " + JSON.stringify(event.data.cmp));
    }
});