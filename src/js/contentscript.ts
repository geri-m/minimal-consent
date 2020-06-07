"use strict";
import Detector from "./Detector";
import Logger from "./Logger";

// This is required as for Safari the script is injected at the beginning. For Chrome is at the end.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', afterDOMLoaded);
} else {
    afterDOMLoaded();
}

function afterDOMLoaded() {
    if (typeof safari !== 'undefined') {
        Logger.log("+++ Running on Safari +++");
    } else if (typeof chrome !== 'undefined') {
        Logger.log("+++ Running on Chromium Platform +++")
    } else {
        Logger.log("+++ Running on some other Platform +++")
    }

    // only execute the content script
    // - if there is doc type
    // - if there is body with a defined length
    // - if there are some child nodes in the body
    Logger.log("Consent Script Parameter: " + JSON.stringify(document.doctype) + ", Len: " + document.body.innerHTML.length + ", Nodes: " + document.body.childNodes.length);


    let inFrame: boolean = false;

    try {
        inFrame = window.self !== window.top;
        Logger.log("Running in IFrame: " + inFrame);
    } catch (e) {
        Logger.log("Error Figuring out if we are running in an iFrame");
    }

    /* only process files
       - with a Doc Type => NOT. (document.doctype) -> eg. https://de.scalable.capital/
       - which are longer than 100 chars
       - which are HTTPS or HTTP file
     */
    if (document.body.innerHTML.length > 100 && (document.location.href.toLowerCase().startsWith("https://") || document.location.href.toLowerCase().startsWith("http://"))) {
        Logger.log("Triggering Content Script");
        const messageFrom = "FROM_MINIMAL_CONSENT";

        // This is the script for checking whether there is a TCF 1.1 or TCF 2.0 compliant CMP.
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.text = 'window.addEventListener("load",checkForCmp,!1);let dataframeForPingReturn={type:"FROM_MINIMAL_CONSENT"},checkForCmpCounter=0,maxTimeoutForResearch=200,maxRetryForSearch=25;function checkForCmp(){this.__cmp?this.__cmp("ping",2,sendMessage):this.__tcfapi?this.__tcfapi("ping",2,sendMessage):this.frames&&this.frames.length&&this.frames.__tcfapiLocator?this.__tcfapi("ping",2,sendMessage):checkForCmpCounter<maxRetryForSearch?(setTimeout(checkForCmp,maxTimeoutForResearch),checkForCmpCounter++):window.removeEventListener("load",checkForCmp,!1)}function sendMessage(e,t){t&&(dataframeForPingReturn.cmp=JSON.stringify(e),window.postMessage(dataframeForPingReturn,"*"),window.removeEventListener("load",checkForCmp,!1))}';
        document.head.appendChild(script);
        const detector = new Detector(document, inFrame);
        detector.connectObserver();

        window.addEventListener("message", function (event) {
            // We only accept messages from ourselves
            if (event.source !== window)
                return;

            // only if there TCF 1.1 or TFC 2.0 compliant CMP found, launch the appropriate detector.
            // if the proprietary initialization already worked out, don't initialize the CMP again.
            if (event.data.type && event.data.type === messageFrom) {
                // given the Ping Result to the Detector Object.
                detector.pingResult = event.data.cmp;
            }
        });
    }
}

