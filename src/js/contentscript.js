"use strict";

import $ from 'jquery';
import Utils from "./utils";

var state = 0;
const contentScript = "contentscript";

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

    if (docHtml.includes('traffective.com')) {
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
    } else if (docHtml.includes('consentmanager.mgr.consensu.org')) {
        selectCmpObserver.disconnect();
        observer = new MutationObserver(handleConsentManager);
        observer.observe(targetNode, config);
    } else if (docHtml.includes('truste.com') || docHtml.includes('trustarc.com')) {
        selectCmpObserver.disconnect();
        observer = new MutationObserver(handleTruste);
        observer.observe(targetNode, config);
    } else if (docHtml.includes('cookielaw.org') || docHtml.includes('cookiepro.com')) {
        selectCmpObserver.disconnect();
        observer = new MutationObserver(handleOneTrust);
        observer.observe(targetNode, config);
    } else if (docHtml.includes('evidon.com') || docHtml.includes("evidon.mgr.consensu.org")) {
        selectCmpObserver.disconnect();
        observer = new MutationObserver(handleEvidon);
        observer.observe(targetNode, config);
    } else if (docHtml.includes('quantcast.com') || docHtml.includes("quantcast.mgr.consensu.org")) {
        selectCmpObserver.disconnect();
        observer = new MutationObserver(handleQuantcast);
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
        reset("Econda", "0.0.0");
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
        reset("Traffective", "0.0.0");
    }
}

function handleUserCentrics() {
    Utils.log('handleUserCentrics');
    const ucBannerContent = 'div.uc-banner-content';

    // case like on hse24.de
    if ($(ucBannerContent).length && state === 0) {
        Utils.log('Deny All button found');
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.text = 'function s(counter){if(counter >= 100){return; } if(typeof this.usercentrics !== "undefined" && typeof this.usercentrics.denyAllConsentsAndCloseInitialView !== "undefined"){ this.usercentrics.denyAllConsentsAndCloseInitialView(); } else { setTimeout(function() {s(counter + 1)}, 25);  }}; s(1);';
        document.getElementsByTagName('head')[0].appendChild(script);
        reset("UserCentrics", "0.0.0");
    }
}

function handleConsentManager() {
    Utils.log('handleConsentManager');
    const cmButtonDeny = '#cmpbntnotxt';

    if ($(cmButtonDeny).length) {
        $(cmButtonDeny).click();
        reset("Consent Manager", "0.0.0");
    }

    // TODO: Requires a second Step for the ugly guis.
    // Currently there is a <a href='#' with an on Click Action which is a bit painful to handle
}

function handleTruste() {
    Utils.log('handleTruste');
    // 1st Variant with iFrame
    const trusteDiv = "div.truste_box_overlay";

    // 2nd variant with Div overlay
    const trusteSimpleOverlay = "#truste-consent-required";
    const closeButton = "img[alt*='close button']";

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
                reset("Truste/Trustact (V1)", "0.0.0");
            }
        });
    }


    if ($(trusteSimpleOverlay).length && state === 0) {
        $(trusteSimpleOverlay).click();
        Utils.log('Consent for Truste/Trustact (V2) denied.');
        state = 1;

        window.addEventListener('message', (event) => {
            var eventJson = JSON.parse(event.data);
            Utils.log(eventJson);
            // Now the Close Button is visible again.
            if (eventJson.source === "preference_manager" && eventJson.data === "true" && eventJson.message === "toggle_close_button") {
                Utils.log("We can close the iFrame. ");
                // this is a special case, in case the "decline" is failing when sending data to the backend (Marriot Case)
                if ($(closeButton).length) {
                    $(closeButton).click();
                    reset("Truste/Trustact (V2)", "0.0.0");
                }
            }
        });
    }
}

function handleOneTrust() {
    Utils.log('handleOneTrust');

    const optanonDetailsV1 = "#onetrust-pc-btn-handler";
    const optanonSaveSettingsV1 = "button.save-preference-btn-handler";
    const optanonCheckBoxesV1 = "checkbox.switch-checkbox";

    const optanonDetailsV2 = "button.optanon-toggle-display";

    // this button is crappy to find, as there is no ID or class.
    const optanonSaveSettingsV2 = "button[onclick*='Save']";
    const optanonListItemForTabsV2 = "li.menu-item-on";
    const optanonCheckbox = "input[type*='checkbox']";

    Utils.log(state);

    // Variant 1
    if ($(optanonDetailsV1).length && state === 0) {
        $(optanonDetailsV1).click();
        state = 1;
    } else if ($(optanonSaveSettingsV1).length && state === 1) {
        $(optanonCheckBoxesV1).each(function () {
            $(this).prop('checked', false);
        });
        $(optanonSaveSettingsV1).click();
        reset("OneTrust (V1)", "0.0.0");
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
        reset("OneTrust (V2)", "0.0.0");
    }
}

function handleEvidon() {
    Utils.log('handleEvidonx');
    const evidonDenyAll = "button#_evidon-decline-button";

    let button = document.querySelector(evidonDenyAll);

    // we do require 3 attempts
    if (typeof button !== 'undefined' && button && typeof button.parentElement !== 'undefined' && state === 0) {
        state = 1;
        document.querySelector(evidonDenyAll).click();
    } else if (typeof button !== 'undefined' && button && typeof button.parentElement !== 'undefined' && state === 1) {
        state = 2;
        document.querySelector(evidonDenyAll).click();
    } else if (typeof button !== 'undefined' && button && typeof button.parentElement !== 'undefined' && state === 2) {
        state = 3;
        document.querySelector(evidonDenyAll).click();
        reset("Evidon", "4957");
    }
}

function handleQuantcast() {
    Utils.log('handleQuantcast');

    const puropse = "a#qc-cmp-purpose-button";
    let purposeButton = document.querySelector(puropse);

    const denyAll = "button.qc-cmp-enable-button";
    let denyAllButton = document.querySelector(denyAll);

    const save = "button.qc-cmp-save-and-exit";
    let saveButton = document.querySelector(save);

    if (typeof purposeButton !== 'undefined' && purposeButton && typeof purposeButton.parentElement !== 'undefined' && state === 0) {
        state = 1;
        purposeButton.click();
    } else if (typeof denyAllButton !== 'undefined' && denyAllButton && typeof denyAllButton.parentElement !== 'undefined' && state === 1) {
        state = 2;
        denyAllButton.click();
    } else if (typeof saveButton !== 'undefined' && saveButton && typeof saveButton.parentElement !== 'undefined' && state === 2) {
        saveButton.click();
        reset("Quantcast", "4957");
    }
}

function reset(cmp, cmpVersion) {
    // If everything is fine, remove the listener.
    observer.disconnect();
    state = -1;
    Utils.log('Consent for ' + cmp + ' denied.');
    chrome.runtime.sendMessage({cmp: cmp, cmp_version: cmpVersion, from: contentScript});
}





