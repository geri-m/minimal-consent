/**
 * This the full code for searching the __cmp or __tcfapi object on the document.
 * If such objects have been found, notify the chrome extension via postMessage.
 */


window.addEventListener('load', checkForCmp, false);

let dataframeForPingReturn = {type: "FROM_MINIMAL_CONSENT"};
let checkForCmpCounter = 0;
let maxTimeoutForResearch = 200;
let maxRetryForSearch = 25;

function checkForCmp() {
    if (this.__cmp) {
        this.__cmp("ping", 2, sendMessage);
    } else if (this.__tcfapi) {
        this.__tcfapi("ping", 2, sendMessage);
    } else if (this.frames && this.frames.length && this.frames['__tcfapiLocator']) {
        this.__tcfapi("ping", 2, sendMessage);
    } else {
        if (checkForCmpCounter < maxRetryForSearch) {
            setTimeout(checkForCmp, maxTimeoutForResearch);
            checkForCmpCounter++;
        } else {
            window.removeEventListener('load', checkForCmp, false);
        }
    }
}

function sendMessage(pingReturn, success) {
    if (success) {
        dataframeForPingReturn.cmp = JSON.stringify(pingReturn);
        window.postMessage(dataframeForPingReturn, "*");
        window.removeEventListener('load', checkForCmp, false);
    }
}