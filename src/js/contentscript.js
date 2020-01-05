// contentscript.js
import $ from 'jquery'

const mofifiedType = 'DOMSubtreeModified';

var state = 0;
var docHtml = document.documentElement.innerHTML;

// based on text-Strings we define what to do.

console.log("Demojjj.")


if (docHtml.includes('econda')) {
    console.log('econda');
    document.body.addEventListener(mofifiedType, handleEconda, false);
} else if (docHtml.includes('traffective')) {
    console.log('traffective');
} else {
    console.log('none');
}

function handleEconda () {
    const settingsDiv = '#buttonSettingsPage';
    const toggleCheckbox = '#profile_toggle';
    const closeSpan = 'span.close';

    console.log('Looking for Banner xxx ...');
    if ($(settingsDiv).length && state === 0) {
        console.log('Overlay found.');
        console.log('Clicking Button now');
        $(settingsDiv).click();
        state = 1;
    }

    if ($(toggleCheckbox).length && state === 1) {
        console.log('Checkbox found: ' + $(toggleCheckbox).checked);
        if ($(toggleCheckbox).checked === true) {
            // Uncheck the checkbox
            $(toggleCheckbox).removeAttr('Checked');
            console.log('now unchecked');
        }

        // If everything is fine, remove the listener.
        document.body.removeEventListener(mofifiedType, handleEconda, false);
        state = -1;
        // close overlay now
        console.log('Close overlay now');
        $(closeSpan).trigger('click');
        console.log('Successful Denyed Econda');
    }
}
