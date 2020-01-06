// contentscript.js
import $ from 'jquery';
import Logger from 'js-logger';

var dateFormat = require('dateformat'); // from library

const mofifiedType = 'DOMSubtreeModified';

var state = 0;
var docHtml = document.documentElement.innerHTML;

// Adding Date to Log-output
Logger.useDefaults({
    formatter: function (messages, context) {
        messages.unshift(dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss.l'));
    }
});

Logger.info('Content Script Called.');

if (docHtml.includes('econda')) {
    Logger.info('econda');
    document.body.addEventListener(mofifiedType, handleEconda, false);
} else if (docHtml.includes('traffective')) {
    Logger.info('traffective');
    document.body.addEventListener(mofifiedType, handleTraffective, false);
} else {
    Logger.info('none');
}

function handleEconda () {
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
        if ($(toggleCheckbox).is(":checked")) {
            // Uncheck the checkbox
            $(toggleCheckbox).prop("checked", false );
            Logger.info('now unchecked');
        }

        // close overlay now
        Logger.info('Close overlay now');
        $(closeSpan).trigger('click');
        Logger.info('Consent for Econda denied');

        // If everything is fine, remove the listener.
        document.body.removeEventListener(mofifiedType, handleEconda, false);
        state = -1;

    }
}

function handleTraffective () {
    const gdprDiv = 'div.gdpr_popup_popup';
    const gdprCheckboxed ='input[type=checkbox].gdpr_switch_native';
    const gdprSaveButton ='div.is-primary-button';
    if ($(gdprDiv).length && state === 0) {
        var checkBoxes = $(gdprCheckboxed);
        Logger.info('Checkboxes found: ' + checkBoxes.length);

        $(gdprCheckboxed).each(function(){
            $(this).prop("checked", false );
        });

        if($(gdprSaveButton).length){
            Logger.info("Button found ...");
            $(gdprSaveButton).trigger('click');
            Logger.info("... and clicked")
        }

        Logger.info('Consent for Traffective denied');

        // If everything is fine, remove the listener.
        document.body.removeEventListener(mofifiedType, handleTraffective, false);
        state = -1;
    }

}