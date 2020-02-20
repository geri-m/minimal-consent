window.addEventListener('load', function load(event) {
    let bkg = chrome.extension.getBackgroundPage();

    bkg.console.log("load");
    chrome.runtime.sendMessage({greeting: "hello"}, function (response) {
        bkg.console.log("REsponse: " + response);
    });

    chrome.runtime.sendMessage({
        cmp: "getHistory",
        from: "popupscript"
    });
});