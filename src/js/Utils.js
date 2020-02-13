"use strict";

const dateFormat = require('dateformat'); // from library
const arrayOfPatterns = {};

export default class Utils {
    static log(message) {
        console.log(dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss.l') + " " + message);
    }

    static createMinimalConsentButton(document, javaScript) {
        let link = document.createElement('a');
        link.text = 'Minimal Consent';
        link.setAttribute("class", "minimal-consent");
        link.href = javaScript;
        document.body.appendChild(link);
    }

    static objectClickable(myObject) {
        return typeof myObject !== 'undefined' && myObject && typeof myObject.parentElement !== 'undefined' && myObject.offsetParent;
    }

    static objectVisible(myObject) {
        return typeof myObject !== 'undefined' && myObject && typeof myObject.parentElement !== 'undefined'
    }
}