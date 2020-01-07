// contentscript.js
import $ from 'jquery';
import Logger from 'js-logger';

var dateFormat = require('dateformat'); // from library

var state = 0;

// Adding Date to Log-output
Logger.useDefaults({
    formatter: function (messages, context) {
        messages.unshift(dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss.l'));
    }
});

Logger.info('Content Script Called.');

// Select the node that will be observed for mutations
const targetNode = document.getRootNode();

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// this one is global for all the other handlers.
var observer;

const selectCmpObserver = new MutationObserver(handleCMP);
selectCmpObserver.observe(targetNode, config);

function handleCMP () {
    var docHtml = document.documentElement.innerHTML;

    if (docHtml.includes('.traffective.com')) {
        selectCmpObserver.disconnect();
        observer = new MutationObserver(handleTraffective);
        observer.observe(targetNode, config);
    } else if (docHtml.includes('usercentrics.eu')) {
        selectCmpObserver.disconnect();
        observer = new MutationObserver(handleUserCentrics);
        observer.observe(targetNode, config);
    } else if (docHtml.includes('econda.de')) {
        selectCmpObserver.disconnect();
        observer = new MutationObserver(handleEconda);
        observer.observe(targetNode, config);
    } else {
        Logger.info('Nothing found yet ... ');
    }
}

function handleEconda () {
    Logger.info('handleEconda');
    const settingsButton = '#buttonSettingsPage';
    const toggleCheckbox = '#profile_toggle';
    const closeSpan = 'span.close';

    if ($(settingsButton).length && state === 0) {
        Logger.info('Overlay found.');
        Logger.info('Clicking Button now');
        $(settingsButton).click();
        state = 1;
    } else if ($(toggleCheckbox).length && state === 1) {
        Logger.info('Checkbox found: ' + $(toggleCheckbox).checked);
        if ($(toggleCheckbox).is(':checked')) {
            // Uncheck the checkbox
            $(toggleCheckbox).prop('checked', false);
            Logger.info('now unchecked');
        }

        // close overlay now
        Logger.info('Close overlay now');
        $(closeSpan).trigger('click');
        Logger.info('Consent for Econda denied');

        reset();
    }
}

function handleTraffective () {
    Logger.info('handleTraffective');
    const gdprDiv = 'div.gdpr_popup_popup';
    const gdprCheckboxed = 'input[type=checkbox].gdpr_switch_native';
    const gdprSaveButton = 'div.is-primary-button';
    if ($(gdprDiv).length && state === 0) {
        var checkBoxes = $(gdprCheckboxed);
        Logger.info('Checkboxes found: ' + checkBoxes.length);

        $(gdprCheckboxed).each(function () {
            $(this).prop('checked', false);
        });

        if ($(gdprSaveButton).length) {
            Logger.info('Button found ...');
            $(gdprSaveButton).trigger('click');
            Logger.info('... and clicked');
        }

        Logger.info('Consent for Traffective denied');
        reset();
    }
}
function handleUserCentrics () {
    Logger.info('handleUserCentrics');
    const customLink = 'a.minimal-consent';

    // case like on hse24.de
    if (state === 0) {
        Logger.info('Deny All button found');
        // add the the Body our new link
        $('body').append('<a href=\'javascript:function doDenyCall(counter){console.log(new Date().toUTCString() + "doDenyCall: " + counter);if(counter >= 100){console.log("Minimal Consent was unable to communicate with usercentrics");return; } if(typeof this.usercentrics !== "undefined" && typeof this.usercentrics.denyAllConsentsAndCloseInitialView !== "undefined"){ console.log("Close Popup now"); this.usercentrics.denyAllConsentsAndCloseInitialView(); } else { console.log("setTimeout again"); setTimeout(function() {doDenyCall(counter + 1)}, 25);  }}; doDenyCall(1);\' class=\'minimal-consent\'>Minimal Consent</a>');
        state = 1;
        Logger.info('Custom link added');
    } else if ($(customLink).length && state === 1) {
        $(customLink)[0].click();
        Logger.info('Consent for User Centric denied.');
        reset();
    }
}

function reset () {
    // If everything is fine, remove the listener.
    observer.disconnect();
    state = -1;
}
