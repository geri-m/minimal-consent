// min-consent.js
// checkForUC();
var button_click = false;
var unset = false;


// https://d35ojb8dweouoy.cloudfront.net/plugins/arp.privacy/arp.privacy.js
document.body.addEventListener('DOMSubtreeModified', function () {
    // console.log('DOM Changed at ' + new Date());
    if(unset === false){
        var msg = document.getElementById("privacyProtectionBanner");
        if (msg != null) {
            console.log("Overlay found.");
            // button found.
            var button = document.getElementById("buttonSettingsPage");
            if(button != null && button_click === false) {
                // open the details
                console.log("Clicking Button now");
                $("#buttonSettingsPage").click();
                button_click = true;
            }
        } // else is not required.
        var checkbox = document.getElementById("profile_toggle");
        if(checkbox != null){
            console.log("Checkbox found: " + checkbox.checked);
            if(checkbox.checked === true) {
                // Uncheck the checkbox
                $("profile_toggle").removeAttr("Checked");
                console.log("now unchecked");
            } else {
                console.log("Toggle is already unchecked.");
            }

            unset = true;

            // close overlay now
            console.log("Close overlay now");

            var highlightedItems = document.querySelectorAll("span.close")
            console.log(highlightedItems.length);

            $("span.close").trigger("click");

            /*
            var spans = document.getElementsByTagName("span")

            var i = 0;
            for (i = 0; i < spans.length; i++) {
                var attr_class = spans[0].getAttribute("class");
                if(attr_class != null && attr_class === "close") {
                    console.log("Span with Close Attribute found");
                    //Creates and dispatches a click event

                    break;
                }
            }
            */
            console.log("Unset");
        }
    }
}, false);
