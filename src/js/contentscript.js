// contentscript.js
import $ from 'jquery';
import Logger from 'js-logger';

var dateFormat = require('dateformat'); // from library

var state = 0;

// this is some static stuff for the long tail.
var buttons = {
    '#hs-eu-decline-button': "https://www.npmjs.com",
    "#cookie_action_close_header": "https://tealium.com/"
};
const minimalConsentLink = 'a.minimal-consent';

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
    } else if (docHtml.includes('.truste.com')) {
        selectCmpObserver.disconnect();
        observer = new MutationObserver(handleTruste);
        observer.observe(targetNode, config);
    } else {
        Logger.info('Nothing found yet ... ');

        for (var key in buttons) {
            if ($(key).length && state === 0) {
                Logger.info("Found a page with a basic button");
                Logger.info($(key));
                $('body').append('<a href=\'javascript:function s(){ document.getElementById("' + key.replace("#", "") + '").click();} s();\' class=\'minimal-consent\'>Minimal Consent</a>');
                state = 1;
                break;
            }
        }

        if ($(minimalConsentLink).length && state === 1) {
            Logger.info("New button is here");
            $(minimalConsentLink)[0].click();
            selectCmpObserver.disconnect();
        }
    }
}

function handleEconda() {
    Logger.info('handleEconda');
    const settingsButton = '#buttonSettingsPage';
    const toggleCheckbox = '#profile_toggle';
    const closeSpan = 'span.close';

    if ($(settingsButton).length && state === 0) {
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

function handleTraffective() {
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

function handleUserCentrics() {
    Logger.info('handleUserCentrics');
    const ucBannerContent = 'div.uc-banner-content';

    // case like on hse24.de
    if ($(ucBannerContent).length && state === 0) {
        Logger.info('Deny All button found');
        // add the the Body our new link
        // <a href=\'javascript:function doDenyCall(counter){console.log(new Date().toUTCString() + "doDenyCall: " + counter);if(counter >= 100){console.log("Minimal Consent was unable to communicate with usercentrics");return; } if(typeof this.usercentrics !== "undefined" && typeof this.usercentrics.denyAllConsentsAndCloseInitialView !== "undefined"){ console.log("Close Popup now"); this.usercentrics.denyAllConsentsAndCloseInitialView(); } else { console.log("setTimeout again"); setTimeout(function() {doDenyCall(counter + 1)}, 25);  }}; doDenyCall(1);\' class=\'minimal-consent\'>Minimal Consent</a>'
        $('body').append('<a href=\'javascript:function s(counter){if(counter >= 100){return; } if(typeof this.usercentrics !== "undefined" && typeof this.usercentrics.denyAllConsentsAndCloseInitialView !== "undefined"){ this.usercentrics.denyAllConsentsAndCloseInitialView(); } else { setTimeout(function() {s(counter + 1)}, 25);  }}; s(1);\' class=\'minimal-consent\'>Minimal Consent</a>');
        state = 1;
        Logger.info('Custom link added');
    } else if ($(minimalConsentLink).length && state === 1) {
        $(minimalConsentLink)[0].click();
        Logger.info('Consent for User Centric denied.');
        reset();
    }
}

function handleConsentManager() {
    Logger.info('handleConsentManager');
    const cmButtonDeny = '#cmpbntnotxt';

    if ($(cmButtonDeny).length) {
        $(cmButtonDeny).click();
        reset();
        Logger.info('Consent for Consent Manager denied.')
    }

    // TODO: Requires a second Step for the ugly guis ...
}

function handleTruste() {
    Logger.info('handleTruste');
    // 1st Variant with iFrame
    const trusteDiv = "div.truste_box_overlay";

    // 2nd variant with Div overlay
    const trusteSimpleOverlay = "#truste-consent-required";

    // this is all happening in an iFrame ...
    // <a href='javascript function s (){this.truste.eu.actmessage({"source":"preference_manager", "message":"submit_preferences", "data":"0"});this.truste.eu.actmessage({"source":"preference_manager", "message":"send_tracker_list", "data":{"Required Cookies":{"value":"0", "domains":{"forbes.com":"2", "www.forbes.com":"2"}}, "Functional Cookies":{"value":"1", "domains":{"accounts.bizzabo.com":"0", "bizzabo.com":"0", "realtime.bizzabo.com":"0", "ceros.com":"0", "view.ceros.com":"0", "documentcloud.org":"0", "www.documentcloud.org":"0", "dwcdn.net":"0", "dropboxusercontent.com":"0", "cdn.embedly.com":"0", "embedly.com":"0", "live.forbes.com":"0", "google.com":"0", "e.infogram.com":"0", "infogram.com":"0", "jifo.co":"0", "instana.io":"0", "nr-data.net":"0", "omny.fm":"0", "go.pardot.com":"0", "pardot.com":"0", "pi.pardot.com":"0", "podcastone.com":"0", "az1.qualtrics.com":"0", "forbesbi.az1.qualtrics.com":"0", "qualtrics.com":"0", "siteintercept.qualtrics.com":"0", "scorecardresearch.com":"0", "speechkit.io":"0", "spkt.io":"0", "spotify.com":"0", "consent-pref.trustarc.com":"0", "prefmgr-cookie.truste-svc.net":"0", "cdn.syndication.twimg.com":"0", "verse.com":"0", "www.verse.com":"0", "vimeo.com":"0"}}, "Advertising Cookies":{"value":"2", "domains":{"aaxads.com":"0", "addtoany.com":"0", "rss.art19.com":"0", "action.media6degrees.com":"0", "facebook.com":"0", "www.facebook.com":"0", "dialog.filepicker.io":"0", "www.filepicker.io":"0", "forbes8.forbes.com":"0", "learn.forbes.com":"0", "doubleclick.net":"0", "youtube.com":"0", "www.indeed.com":"0", "ads.linkedin.com":"0", "linkedin.com":"0", "www.linkedin.com":"0", "app-ab13.marketo.com":"0", "media.net":"0", "mathtag.com":"0", "gw.oribi.io":"0", "pingdom.net":"0", "m.stripe.com":"0", "twitter.com":"0", "walls.io":"0", "yahoo.com":"0", "ziprecruiter.com":"0"}}, "version":"1"}});this.truste.eu.prefclosebutton();} s();' class='minimal-consent'>Minimal Consent</a>
    if ($(trusteDiv).length && state === 0) {
        Logger.info("Div Found and Message Listener Registered.");
        window.addEventListener('message', (event) => {
            var eventJson = JSON.parse(event.data);
            if (eventJson.message === "cm_loading" && state === 1) {
                Logger.info("Adding Button");
                $('body').append('<a href=\'javascript:function s(){this.truste.eu.actmessage({"source":"preference_manager", "message":"submit_preferences", "data":"0"});this.truste.eu.actmessage({"source":"preference_manager", "message":"send_tracker_list", "data":{"Required Cookies":{"value":"0", "domains":{"forbes.com":"2", "www.forbes.com":"2"}}, "Functional Cookies":{"value":"1", "domains":{"accounts.bizzabo.com":"0", "bizzabo.com":"0", "realtime.bizzabo.com":"0", "ceros.com":"0", "view.ceros.com":"0", "documentcloud.org":"0", "www.documentcloud.org":"0", "dwcdn.net":"0", "dropboxusercontent.com":"0", "cdn.embedly.com":"0", "embedly.com":"0", "live.forbes.com":"0", "google.com":"0", "e.infogram.com":"0", "infogram.com":"0", "jifo.co":"0", "instana.io":"0", "nr-data.net":"0", "omny.fm":"0", "go.pardot.com":"0", "pardot.com":"0", "pi.pardot.com":"0", "podcastone.com":"0", "az1.qualtrics.com":"0", "forbesbi.az1.qualtrics.com":"0", "qualtrics.com":"0", "siteintercept.qualtrics.com":"0", "scorecardresearch.com":"0", "speechkit.io":"0", "spkt.io":"0", "spotify.com":"0", "consent-pref.trustarc.com":"0", "prefmgr-cookie.truste-svc.net":"0", "cdn.syndication.twimg.com":"0", "verse.com":"0", "www.verse.com":"0", "vimeo.com":"0"}}, "Advertising Cookies":{"value":"2", "domains":{"aaxads.com":"0", "addtoany.com":"0", "rss.art19.com":"0", "action.media6degrees.com":"0", "facebook.com":"0", "www.facebook.com":"0", "dialog.filepicker.io":"0", "www.filepicker.io":"0", "forbes8.forbes.com":"0", "learn.forbes.com":"0", "doubleclick.net":"0", "youtube.com":"0", "www.indeed.com":"0", "ads.linkedin.com":"0", "linkedin.com":"0", "www.linkedin.com":"0", "app-ab13.marketo.com":"0", "media.net":"0", "mathtag.com":"0", "gw.oribi.io":"0", "pingdom.net":"0", "m.stripe.com":"0", "twitter.com":"0", "walls.io":"0", "yahoo.com":"0", "ziprecruiter.com":"0"}}, "version":"1"}});this.truste.eu.prefclosebutton();} s();\' class=\'minimal-consent\'>Minimal Consent</a>');
                Logger.info("Button Added");
                $(minimalConsentLink)[0].click();
                Logger.info('Consent for Truste/Trustact denied.');
                reset();
            }
        });
        state = 1;
    }

    if ($(trusteSimpleOverlay).length && state === 0) {
        $(trusteSimpleOverlay).click();
        reset();
    }
}

function reset() {
    // If everything is fine, remove the listener.
    observer.disconnect();
    state = -1;
}
