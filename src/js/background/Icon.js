"use strict";

const okIcon = "./images/icon-48x48-ok.png";
const devIcon = "./images/icon-48x48-dev.png";
const transIcon = "./images/icon-48x48-trans.png";

export default class Icon {

    constructor() {
    }


    switchIcon(implemented) {
        // implemented CMPs are shown in Green
        if (implemented) {
            chrome.browserAction.setIcon({path: okIcon});
        }
        // implemented CMPs are shown in red
        else {
            chrome.browserAction.setIcon({path: devIcon});
        }

        setTimeout(this.turnIconBack, 3000);
    }


    turnIconBack() {
        chrome.browserAction.setIcon({path: transIcon});
    }

}