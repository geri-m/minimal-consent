window.addEventListener('load', function () {
    checkForCmp();
}, false);

let data = {type: "FROM_MINIMAL_CONSENT"};
let counter = 0;
let maxTimeoutForResearch = 200;
let maxRetryForSearch = 25;

function checkForCmp() {
    console.log("checkForCmp");
    if (this.__cmp) {
        this.__cmp("ping", 2, sendMessage);
    } else if (this.__tcfapi) {
        this.__tcfapi("ping", 2, sendMessage);
    } else if (this.frames && this.frames.length && this.frames['__tcfapiLocator']) {
        this.__tcfapi("ping", 2, sendMessage);
    } else {
        if (counter < maxRetryForSearch) {
            setTimeout(checkForCmp, maxTimeoutForResearch);
            counter++;
        }
    }


}

function sendMessage(pingReturn, success) {
    if (success) {
        data.cmp = JSON.stringify(pingReturn);
        window.postMessage(data, "*");
    }
}