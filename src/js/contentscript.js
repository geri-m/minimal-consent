// contentscript.js
import $ from 'jquery'
import Logger from 'js-logger'

var dateFormat = require('dateformat'); // from library

const mofifiedType = 'DOMSubtreeModified';

var state = 0;
var docHtml = document.documentElement.innerHTML;


// based on text-Strings we define what to do.
Logger.useDefaults({
    formatter: function (messages, context) {
        messages.unshift(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss.l"));
    }
});
Logger.info("Content Script Called.");

if (docHtml.includes('econda')) {
    Logger.info('econda');
    document.body.addEventListener(mofifiedType, handleEconda, false);
} else if (docHtml.includes('traffective')) {
    Logger.info('traffective');
} else {
    Logger.info('none');
}

function handleEconda () {
    const settingsDiv = '#buttonSettingsPage';
    const toggleCheckbox = '#profile_toggle';
    const closeSpan = 'span.close';

    Logger.info('Looking for Banner xxx ...');
    if ($(settingsDiv).length && state === 0) {
        Logger.info('Overlay found.');
        Logger.info('Clicking Button now');
        $(settingsDiv).click();
        state = 1;
    }

    if ($(toggleCheckbox).length && state === 1) {
        Logger.info('Checkbox found: ' + $(toggleCheckbox).checked);
        if ($(toggleCheckbox).checked === true) {
            // Uncheck the checkbox
            $(toggleCheckbox).removeAttr('Checked');
            Logger.info('now unchecked');
        }

        // If everything is fine, remove the listener.
        document.body.removeEventListener(mofifiedType, handleEconda, false);
        state = -1;
        // close overlay now
        Logger.info('Close overlay now');
        $(closeSpan).trigger('click');
        Logger.info('Successful Denied Econda');
    }
}
