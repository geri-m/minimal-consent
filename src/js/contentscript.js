"use strict";
import Detector from "./Detector";
import Utils from "./Utils";

// only execute the content script
// - if there is doc type
// - if there is body with a defined length
// - if there are some child nodes in the body
if (document.doctype && document.body.innerHTML.length > 100 && document.body.childNodes.length > 5) {
    const messageFrom = "FROM_MINIMAL_CONSENT";

    // This is the script for checking whether there is a TCF 1.1 or TCF 2.0 compliant CMP.
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.text = 'window.addEventListener("load",checkForCmp,!1);let dataframeForPingReturn={type:"FROM_MINIMAL_CONSENT"},checkForCmpCounter=0,maxTimeoutForResearch=200,maxRetryForSearch=25;function checkForCmp(){this.__cmp?this.__cmp("ping",2,sendMessage):this.__tcfapi?this.__tcfapi("ping",2,sendMessage):this.frames&&this.frames.length&&this.frames.__tcfapiLocator?this.__tcfapi("ping",2,sendMessage):checkForCmpCounter<maxRetryForSearch?(setTimeout(checkForCmp,maxTimeoutForResearch),checkForCmpCounter++):window.removeEventListener("load",checkForCmp,!1)}function sendMessage(e,t){t&&(dataframeForPingReturn.cmp=JSON.stringify(e),window.postMessage(dataframeForPingReturn,"*"),window.removeEventListener("load",checkForCmp,!1))}';
    document.head.appendChild(script);

    // Select the node that will be observed for mutations
    const targetNode = document.getRootNode();

    const detector = new Detector(targetNode);
    detector.connectObserver();
    window.addEventListener("message", function (event) {
        // We only accept messages from ourselves
        if (event.source !== window)
            return;

        // only if there TCF 1.1 or TFC 2.0 compliant CMP found, launch the appropriate detector.
        // if the proprietary initialization already worked out, don't initialize the CMP again.
        if (event.data.type && (event.data.type === messageFrom)) {
            // setting the Ping Result for the CMP;
            detector.initializedCmp.pingResult = event.data.cmp;
            Utils.log("Content script received message: " + JSON.stringify(event.data.cmp));
        }
    });
}
