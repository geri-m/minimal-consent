window.addEventListener('load', function load(event) {

    let bkg = chrome.extension.getBackgroundPage();

    bkg.console.log("load");

    chrome.runtime.sendMessage({
        cmp: "getHistory",
        from: "popupScript"
    }, function (response) {
        bkg.console.log("Response: " + JSON.stringify(response));
    });
});