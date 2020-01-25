var dateFormat = require('dateformat'); // from library

class Utils {
    static log(message) {
        console.log(dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss.l') + " " + message);
    }
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        Utils.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        Utils.log(request);
        if (request.from === "contentscript" && request.cmp && request.cmp_version) {
            logBackend(request.cmp, request.cmp_version, sender.tab.url);
        }
    });


function logBackend(cmp, cmpVersion, url) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'https://europe-west1-minimal-consent-chrome-ext.cloudfunctions.net/successfulConsent ', true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/json");
    var requestJson = "{\n" +
        "    \"cmp\": \"" + cmp + "\"," +
        "    \"cmp-version\": \"" + cmpVersion + "\"," +
        "    \"url\" : \"" + url + "\"" +
        "}";
    Utils.log(requestJson);
    xhr.send(requestJson);
}


