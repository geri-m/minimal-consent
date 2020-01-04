// min-consent.js
var state = 0;

var docHtml = document.documentElement.innerHTML;

// based on text-Strings we define what to do.

if (docHtml.includes("econda")) {
    console.log("econda");
    document.body.addEventListener('DOMSubtreeModified', handleEconda, false)
} else if (docHtml.includes("traffective")) {
    console.log("traffective");
} else {
    console.log("none");
}

function handleEconda() {
    console.log("Looking for Banner ...");
    if ($("#buttonSettingsPage").length && state === 0) {
        console.log("Overlay found.");
        console.log("Clicking Button now");
        $("#buttonSettingsPage").click();
        state = 1;
    }

    if ($("#profile_toggle").length && state === 1) {
        console.log("Checkbox found: " + $("#profile_toggle").checked);
        if ($("#profile_toggle").checked === true) {
            // Uncheck the checkbox
            $("profile_toggle").removeAttr("Checked");
            console.log("now unchecked");
        }

        // If everything is fine, remove the listener.
        document.body.removeEventListener('DOMSubtreeModified', handleEconda, false);
        // close overlay now
        console.log("Close overlay now");
        $("span.close").trigger("click");
        console.log("Successful Denyed Econda.");
    }
}