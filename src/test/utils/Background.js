"use strict";

let Background;

let waitInit = ( /* async */ () => {
    // Background = await chrome.runtime.getBackgroundPage();
    Background = chrome.extension.getBackgroundPage();
    window.Background = Background
})();

export {Background, waitInit}