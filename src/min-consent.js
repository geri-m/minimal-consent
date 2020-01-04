// min-consent.js
// checkForUC();
var button_click = false;
var unset = false;


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

function handleEconda(){
    if (unset === false) {
        console.log("Looking for Banner ...");
        var msg = document.getElementById("privacyProtectionBanner");
        if (msg != null) {
            console.log("Overlay found.");
            // button found.
            var button = document.getElementById("buttonSettingsPage");
            if (button != null && button_click === false) {
                // open the details
                console.log("Clicking Button now");
                $("#buttonSettingsPage").click();
                button_click = true;
            }
        } else {
            console.log("Banner not found");
        }
        var checkbox = document.getElementById("profile_toggle");
        if (checkbox != null) {
            console.log("Checkbox found: " + checkbox.checked);
            if (checkbox.checked === true) {
                // Uncheck the checkbox
                $("profile_toggle").removeAttr("Checked");
                console.log("now unchecked");
            } else {
                console.log("Toggle is already unchecked.");
            }

            unset = true;

            // close overlay now
            console.log("Close overlay now");
            $("span.close").trigger("click");
            console.log("Unset");
        }
    }
}