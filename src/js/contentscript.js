// contentscript.js
import $ from 'jquery';
import Logger from 'js-logger';

var dateFormat = require('dateformat'); // from library

var state = 0;
var docHtml = document.documentElement.innerHTML;

// Adding Date to Log-output
Logger.useDefaults({
    formatter: function (messages, context) {
        messages.unshift(dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss.l'));
    }
});

Logger.info('Content Script Called.');

// Select the node that will be observed for mutations
const targetNode = document.getElementsByTagName('body')[0];

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

var observer;

if (docHtml.includes('traffective')) {
    observer = new MutationObserver(handleTraffective);
    observer.observe(targetNode, config);
 } else if (docHtml.includes('uc-banner-content')  || docHtml.includes("usercentrics") || docHtml.includes("#uc-")) {
    observer = new MutationObserver(handleUserCentrics);
    observer.observe(targetNode, config);
 } else if (docHtml.includes('econda')) {
    observer = new MutationObserver(handleEconda);
    observer.observe(targetNode, config);
 } else {
    Logger.info('none');
    Logger.info(docHtml);
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
    }

    if ($(toggleCheckbox).length && state === 1) {
        Logger.info('Checkbox found: ' + $(toggleCheckbox).checked);
        if ($(toggleCheckbox).is(':checked')) {
            // Uncheck the checkbox
            $(toggleCheckbox).prop('checked', false );
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
    const gdprCheckboxed ='input[type=checkbox].gdpr_switch_native';
    const gdprSaveButton ='div.is-primary-button';
    if ($(gdprDiv).length && state === 0) {
        var checkBoxes = $(gdprCheckboxed);
        Logger.info('Checkboxes found: ' + checkBoxes.length);

        $(gdprCheckboxed).each(function(){
            $(this).prop('checked', false );
        });

        if($(gdprSaveButton).length){
            Logger.info('Button found ...');
            $(gdprSaveButton).trigger('click');
            Logger.info('... and clicked')
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
        Logger.info("Deny All button found");
        // add the the Body our new link
        $('body').append('<a href="javascript:this.usercentrics.denyAllConsentsAndCloseInitialView();" class="minimal-consent">Minimal Consent</a>');
        state = 1;
        Logger.info('Custom link added');
    } else if ($(customLink).length && state === 1) {
        Logger.info("Custom Link Found");
        $(customLink)[0].click();
        reset();
    }
}

function reset() {
    // If everything is fine, remove the listener.
    observer.disconnect();
    state = -1
}