import $ from 'jquery';

var dateFormat = require('dateformat'); // from library

class Utils {
    static log(message) {
        console.log(dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss.l') + " " + message);
    }
}

var state = 0;

// this is some static stuff for the long tail.
var buttons = {
    '#hs-eu-decline-button': "https://www.npmjs.com",
    "#cookie_action_close_header": "https://tealium.com/"
};
const minimalConsentLink = 'a.minimal-consent';

// Select the node that will be observed for mutations
const targetNode = document.getRootNode();

// Options for the observer (which mutations to observe)
const config = {attributes: true, childList: true, subtree: true};

// this one is global for all the other handlers.
var observer;

const selectCmpObserver = new MutationObserver(handleCMP);
selectCmpObserver.observe(targetNode, config);


function handleCMP() {
    var docHtml = document.documentElement.innerHTML;

    if (docHtml.includes('.traffective.com')) {
        selectCmpObserver.disconnect();
        observer = new MutationObserver(handleTraffective);
        observer.observe(targetNode, config);
    } else if (docHtml.includes('.usercentrics.eu')) {
        selectCmpObserver.disconnect();
        observer = new MutationObserver(handleUserCentrics);
        observer.observe(targetNode, config);
    } else if (docHtml.includes('.econda.de')) {
        selectCmpObserver.disconnect();
        observer = new MutationObserver(handleEconda);
        observer.observe(targetNode, config);
    } else if (docHtml.includes('consentmanager.mgr.consensu.org')) {
        selectCmpObserver.disconnect();
        observer = new MutationObserver(handleConsentManager);
        observer.observe(targetNode, config);
    } else if (docHtml.includes('.truste.com') || docHtml.includes('.trustarc.com')) {
        selectCmpObserver.disconnect();
        observer = new MutationObserver(handleTruste);
        observer.observe(targetNode, config);
    } else if (docHtml.includes('.cookielaw.org')) {
        selectCmpObserver.disconnect();
        observer = new MutationObserver(handleOneTrust);
        observer.observe(targetNode, config);
    } else if (docHtml.includes('.evidon.com')) {
        selectCmpObserver.disconnect();
        observer = new MutationObserver(handleEvidon);
        observer.observe(targetNode, config);
    } else {
        Utils.log('Nothing found yet ... ');

        for (var key in buttons) {
            if ($(key).length && state === 0) {
                Utils.log("Found a page with a basic button");
                Utils.log($(key));
                $('body').append('<a href=\'javascript:function s(){ document.getElementById("' + key.replace("#", "") + '").click();} s();\' class=\'minimal-consent\'>Minimal Consent</a>');
                state = 1;
                break;
            }
        }

        if ($(minimalConsentLink).length && state === 1) {
            Utils.log("New button is here");
            $(minimalConsentLink)[0].click();
            selectCmpObserver.disconnect();
        }
    }
}

function handleEconda() {
    Utils.log('handleEconda');
    const settingsButton = '#buttonSettingsPage';
    const toggleCheckbox = '#profile_toggle';
    const closeSpan = 'span.close';

    if ($(settingsButton).length && state === 0) {
        Utils.log('Clicking Button now');
        $(settingsButton).click();
        state = 1;
    } else if ($(toggleCheckbox).length && state === 1) {
        Utils.log('Checkbox found: ' + $(toggleCheckbox).checked);
        if ($(toggleCheckbox).is(':checked')) {
            // Uncheck the checkbox
            $(toggleCheckbox).prop('checked', false);
            Utils.log('now unchecked');
        }

        // close overlay now
        Utils.log('Close overlay now');
        $(closeSpan).trigger('click');
        Utils.log('Consent for Econda denied');

        reset();
    }
}

function handleTraffective() {
    Utils.log('handleTraffective');
    const gdprDiv = 'div.gdpr_popup_popup';
    const gdprCheckboxed = 'input[type=checkbox].gdpr_switch_native';
    const gdprSaveButton = 'div.is-primary-button';
    if ($(gdprDiv).length && state === 0) {
        var checkBoxes = $(gdprCheckboxed);
        Utils.log('Checkboxes found: ' + checkBoxes.length);

        $(gdprCheckboxed).each(function () {
            $(this).prop('checked', false);
        });

        if ($(gdprSaveButton).length) {
            Utils.log('Button found ...');
            $(gdprSaveButton).trigger('click');
            Utils.log('... and clicked');
        }

        Utils.log('Consent for Traffective denied');
        reset();
    }
}

function handleUserCentrics() {
    Utils.log('handleUserCentrics');
    const ucBannerContent = 'div.uc-banner-content';

    // case like on hse24.de
    if ($(ucBannerContent).length && state === 0) {
        Utils.log('Deny All button found');
        // add the the Body our new link
        // <a href=\'javascript:function doDenyCall(counter){console.log(new Date().toUTCString() + "doDenyCall: " + counter);if(counter >= 100){console.log("Minimal Consent was unable to communicate with usercentrics");return; } if(typeof this.usercentrics !== "undefined" && typeof this.usercentrics.denyAllConsentsAndCloseInitialView !== "undefined"){ console.log("Close Popup now"); this.usercentrics.denyAllConsentsAndCloseInitialView(); } else { console.log("setTimeout again"); setTimeout(function() {doDenyCall(counter + 1)}, 25);  }}; doDenyCall(1);\' class=\'minimal-consent\'>Minimal Consent</a>'
        $('body').append('<a href=\'javascript:function s(counter){if(counter >= 100){return; } if(typeof this.usercentrics !== "undefined" && typeof this.usercentrics.denyAllConsentsAndCloseInitialView !== "undefined"){ this.usercentrics.denyAllConsentsAndCloseInitialView(); } else { setTimeout(function() {s(counter + 1)}, 25);  }}; s(1);\' class=\'minimal-consent\'>Minimal Consent</a>');
        state = 1;
        Utils.log('Custom link added');
    } else if ($(minimalConsentLink).length && state === 1) {
        $(minimalConsentLink)[0].click();
        Utils.log('Consent for User Centric denied.');
        chrome.runtime.sendMessage({
            cmp: "Usercentrcis",
            cmp_version: "5.5.5",
            from: "contentscript"
        }, function (response) {
            console.log(response.farewell);
        });
        reset();
    }
}

function handleConsentManager() {
    Utils.log('handleConsentManager');
    const cmButtonDeny = '#cmpbntnotxt';

    if ($(cmButtonDeny).length) {
        $(cmButtonDeny).click();
        reset();
        Utils.log('Consent for Consent Manager denied.')
    }

    // TODO: Requires a second Step for the ugly guis ...
}

function handleTruste() {
    Utils.log('handleTruste');
    // 1st Variant with iFrame
    const trusteDiv = "div.truste_box_overlay";

    // 2nd variant with Div overlay
    const trusteSimpleOverlay = "#truste-consent-required";

    // this is all happening in an iFrame, hence we are interacting via the notice.js with the iFrame.
    // <a href='javascript function s (){this.truste.eu.actmessage({"source":"preference_manager", "message":"submit_preferences", "data":"0"});this.truste.eu.actmessage({"source":"preference_manager", "message":"send_tracker_list", "data":{"Required Cookies":{"value":"0", "domains":{"forbes.com":"2", "www.forbes.com":"2"}}, "Functional Cookies":{"value":"1", "domains":{"accounts.bizzabo.com":"0", "bizzabo.com":"0", "realtime.bizzabo.com":"0", "ceros.com":"0", "view.ceros.com":"0", "documentcloud.org":"0", "www.documentcloud.org":"0", "dwcdn.net":"0", "dropboxusercontent.com":"0", "cdn.embedly.com":"0", "embedly.com":"0", "live.forbes.com":"0", "google.com":"0", "e.infogram.com":"0", "infogram.com":"0", "jifo.co":"0", "instana.io":"0", "nr-data.net":"0", "omny.fm":"0", "go.pardot.com":"0", "pardot.com":"0", "pi.pardot.com":"0", "podcastone.com":"0", "az1.qualtrics.com":"0", "forbesbi.az1.qualtrics.com":"0", "qualtrics.com":"0", "siteintercept.qualtrics.com":"0", "scorecardresearch.com":"0", "speechkit.io":"0", "spkt.io":"0", "spotify.com":"0", "consent-pref.trustarc.com":"0", "prefmgr-cookie.truste-svc.net":"0", "cdn.syndication.twimg.com":"0", "verse.com":"0", "www.verse.com":"0", "vimeo.com":"0"}}, "Advertising Cookies":{"value":"2", "domains":{"aaxads.com":"0", "addtoany.com":"0", "rss.art19.com":"0", "action.media6degrees.com":"0", "facebook.com":"0", "www.facebook.com":"0", "dialog.filepicker.io":"0", "www.filepicker.io":"0", "forbes8.forbes.com":"0", "learn.forbes.com":"0", "doubleclick.net":"0", "youtube.com":"0", "www.indeed.com":"0", "ads.linkedin.com":"0", "linkedin.com":"0", "www.linkedin.com":"0", "app-ab13.marketo.com":"0", "media.net":"0", "mathtag.com":"0", "gw.oribi.io":"0", "pingdom.net":"0", "m.stripe.com":"0", "twitter.com":"0", "walls.io":"0", "yahoo.com":"0", "ziprecruiter.com":"0"}}, "version":"1"}});this.truste.eu.prefclosebutton();} s();' class='minimal-consent'>Minimal Consent</a>
    if ($(trusteDiv).length && state === 0) {
        Utils.log("Div Found and Message Listener Registered.");
        state = 1;
        window.addEventListener('message', (event) => {
            var eventJson = JSON.parse(event.data);
            if (eventJson.message === "cm_loading") {
                Utils.log("Adding Button");
                $('body').append('<a href=\'javascript:function s(){this.truste.eu.actmessage({"source":"preference_manager", "message":"submit_preferences", "data":"0"});this.truste.eu.actmessage({"source":"preference_manager", "message":"send_tracker_list", "data":{"Required Cookies":{"value":"0", "domains":{"forbes.com":"2", "www.forbes.com":"2"}}, "Functional Cookies":{"value":"1", "domains":{"accounts.bizzabo.com":"0", "bizzabo.com":"0", "realtime.bizzabo.com":"0", "ceros.com":"0", "view.ceros.com":"0", "documentcloud.org":"0", "www.documentcloud.org":"0", "dwcdn.net":"0", "dropboxusercontent.com":"0", "cdn.embedly.com":"0", "embedly.com":"0", "live.forbes.com":"0", "google.com":"0", "e.infogram.com":"0", "infogram.com":"0", "jifo.co":"0", "instana.io":"0", "nr-data.net":"0", "omny.fm":"0", "go.pardot.com":"0", "pardot.com":"0", "pi.pardot.com":"0", "podcastone.com":"0", "az1.qualtrics.com":"0", "forbesbi.az1.qualtrics.com":"0", "qualtrics.com":"0", "siteintercept.qualtrics.com":"0", "scorecardresearch.com":"0", "speechkit.io":"0", "spkt.io":"0", "spotify.com":"0", "consent-pref.trustarc.com":"0", "prefmgr-cookie.truste-svc.net":"0", "cdn.syndication.twimg.com":"0", "verse.com":"0", "www.verse.com":"0", "vimeo.com":"0"}}, "Advertising Cookies":{"value":"2", "domains":{"aaxads.com":"0", "addtoany.com":"0", "rss.art19.com":"0", "action.media6degrees.com":"0", "facebook.com":"0", "www.facebook.com":"0", "dialog.filepicker.io":"0", "www.filepicker.io":"0", "forbes8.forbes.com":"0", "learn.forbes.com":"0", "doubleclick.net":"0", "youtube.com":"0", "www.indeed.com":"0", "ads.linkedin.com":"0", "linkedin.com":"0", "www.linkedin.com":"0", "app-ab13.marketo.com":"0", "media.net":"0", "mathtag.com":"0", "gw.oribi.io":"0", "pingdom.net":"0", "m.stripe.com":"0", "twitter.com":"0", "walls.io":"0", "yahoo.com":"0", "ziprecruiter.com":"0"}}, "version":"1"}});this.truste.eu.prefclosebutton();} s();\' class=\'minimal-consent\'>Minimal Consent</a>');
                Utils.log("Button Added");
                $(minimalConsentLink)[0].click();
                Utils.log('Consent for Truste/Trustact (V1) denied.');
                reset();
            }
        });
        reset();

    }


    if ($(trusteSimpleOverlay).length && state === 0) {
        $(trusteSimpleOverlay).click();
        Utils.log('Consent for Truste/Trustact (V2) denied.');
        state = 1;

        window.addEventListener('message', (event) => {
            var eventJson = JSON.parse(event.data);
            Utils.log(eventJson);
            // Now the Close Button is visbile again.
            if (eventJson.source === "preference_manager" && eventJson.data === "true" && eventJson.message === "toggle_close_button") {
                Utils.log("We can close the iFrame. ");
                // this is a special case, in case the "decline" is failing when sending data to the backend (Marriot Case)
                if ($("img[alt*='close button']").length) {
                    $("img[alt*='close button']").click();
                    reset();
                }
            }
        });
        reset();
    }


}

function handleOneTrust() {
    Utils.log('handleOneTrust');

    const optanonDetailsV1 = "#onetrust-pc-btn-handler";
    const optanonSaveSettingsV1 = "button.save-preference-btn-handler";
    const optanonCheckBoxesV1 = "checkbox.switch-checkbox";

    const optanonDetailsV2 = "button.optanon-toggle-display";

    // this button is crappy to find, as there is no ID or class.
    const optanonSaveSettingsV2 = "button[title*='Save']";
    const optanonListItemForTabsV2 = "li.menu-item-on";
    const optanonCheckbox = "input[type*='checkbox']";

    // Variant 1
    if ($(optanonDetailsV1).length && state === 0) {
        $(optanonDetailsV1).click();
        state = 1;
    } else if ($(optanonSaveSettingsV1).length && state === 1) {
        $(optanonCheckBoxesV1).each(function () {
            $(this).prop('checked', false);
        });
        $(optanonSaveSettingsV1).click();
        Utils.log('Consent for OneTrust (V1) denied.');
        reset();
    }
    // Variant 2
    else if ($(optanonDetailsV2).length && state === 0) {
        $(optanonDetailsV1).trigger('click');
        Utils.log("Details clicked");
        state = 2;
    } else if ($(optanonSaveSettingsV2).length && state === 2) {
        Utils.log("Save Button found");
        $(optanonListItemForTabsV2).each(function () {
            Utils.log("Tab Found");
            $(this).click();
            $(optanonCheckbox).each(function () {
                Utils.log("Checkbox Unchecked");
                $(this).prop('checked', false);
            });
        });
        $(optanonSaveSettingsV2).click();
        Utils.log('Consent for OneTrust (V2) denied.');
        reset();
    }
}

function handleEvidon() {
    Utils.log('handleEvidon');
    const evidonBannerV1 = "#_evidon_banner:visible";
    const evidonDeclineAllV1 = "#_evidon-decline-button:visible";
    // Variant 1
    if ($(evidonBannerV1).length && state === 0) {
        $(evidonDeclineAllV1).trigger('click');
        Utils.log('Consent for Evidon (V1) denied.');
        reset();
    }
}

function reset() {
    // If everything is fine, remove the listener.
    observer.disconnect();
    state = -1;
}





