window.addEventListener('load', function load(event) {
    console.log("load");
    chrome.runtime.sendMessage({greeting: "hello"}, function (response) {
        console.log(response.farewell);
    });

    chrome.runtime.sendMessage({
        cmp: "getHistory",
        from: "popupscript"
    });
});