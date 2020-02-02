"use strict";

import Utils from "./utils";

let state = 0;
const contentScript = "contentscript";

// this is some static stuff for the long tail.
const buttons = {
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
    let docHtml = document.documentElement.innerHTML;

    if (docHtml.includes('traffective.com') || docHtml.includes('traffective.mgr.consensu.org')) {
        selectCmpObserver.disconnect();
        observer = new MutationObserver(handleTraffective);
        observer.observe(targetNode, config);
    } else if (docHtml.includes('usercentrics.eu') || docHtml.includes('usercentrics.mgr.consensu.org')) {
        selectCmpObserver.disconnect();
        observer = new MutationObserver(handleUserCentrics);
        observer.observe(targetNode, config);
    } else if (docHtml.includes('consentmanager.mgr.consensu.org')) {
        selectCmpObserver.disconnect();
        observer = new MutationObserver(handleConsentManager);
        observer.observe(targetNode, config);
    } else if (docHtml.includes('truste.com') || docHtml.includes('trustarc.com') || docHtml.includes('trustarc.mgr.consensu.org')) {
        selectCmpObserver.disconnect();
        observer = new MutationObserver(handleTruste);
        observer.observe(targetNode, config);
    } else if (docHtml.includes('cookielaw.org') || docHtml.includes('cookiepro.com') || docHtml.includes('onetrust.mgr.consensu.org') || docHtml.includes('optanon')) {
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
    } else if (docHtml.includes('cookiebot.com') || docHtml.includes("cookiebot.mgr.consensu.org")) {
        selectCmpObserver.disconnect();
        observer = new MutationObserver(handleCookiebot);
        observer.observe(targetNode, config);
    } else {
        Utils.log('No CMP found yet - looking for general Cookie Banners ');
        let minimalConsent = document.querySelector(minimalConsentLink);
        if (state === 0) {
            for (let key in buttons) {
                let button = document.querySelector(key);
                if (objectClickable(button)) {
                    Utils.log("GDPR Button + Decline found: " + button);
                    let javaScript = 'javascript:function s(){ document.querySelector(\"' + key + '\").click();} s();';
                    Utils.createMinimalConsentButton(document, javaScript);
                    state = 1;
                    break;
                }
            }
        } else if (objectClickable(minimalConsent) && state === 1) {
            Utils.log("New button is here");
            minimalConsent.click();
            selectCmpObserver.disconnect();
            state = -1;
            Utils.log('Consent on denied.');
            chrome.runtime.sendMessage({cmp: "custom banner", cmp_version: "na", from: contentScript});
        }
    }
}

function handleTraffective() {
    Utils.log('handleTraffective');

    const gdprDiv = 'div.gdpr_popup_popup';
    let popup = document.queryCommandSupported(gdprDiv);

    const gdprCheckBoxes = 'input[type=checkbox].gdpr_switch_native';
    let checkboxes = document.querySelectorAll(gdprCheckBoxes);

    const gdprSaveButton = 'div.is-primary-button';
    let saveButton = document.querySelector(gdprSaveButton);

    if (objectClickable(popup) && state === 0) {
        Utils.log('Checkboxes found: ' + checkboxes.length);
        checkboxes.forEach(checkbox => checkbox.setAttribute("checked", "false"), Utils.log("Checkbox unset"));
        state = 1;
    } else if (objectClickable(saveButton) && state === 1) {
        Utils.log('Button found ...');
        saveButton.click();
        reset("Traffective", "0.0.0");
    }
}

function handleUserCentrics() {
    Utils.log('handleUserCentrics');

    const ucBannerContent = 'div.uc-banner-content';
    let banner = document.querySelector(ucBannerContent);

    // typeof button !== 'undefined' && button && typeof button.parentElement !== 'undefined'
    // case like on hse24.de
    if (objectClickable(banner) && state === 0) {
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
    const deny = '#cmpbntnotxt';
    let buttonDeny = document.querySelector(deny);


    if (objectClickable(buttonDeny) && state === 0) {
        buttonDeny.click();
        reset("Consent Manager", "0.0.0");
    }

    // TODO: Requires a second Step for the ugly guis.
    // Currently there is a <a href='#' with an on Click Action which is a bit painful to handle
}

function handleTruste() {
    Utils.log('handleTruste');
    // 1st Variant with iFrame
    const trusteBoxOverlay = "div.truste_box_overlay";
    let divTruste = document.querySelector(trusteBoxOverlay);
    let minimalConsentButton = document.querySelector(minimalConsentLink);

    // this is all happening in an iFrame, hence we are interacting via the notice.js with the iFrame.
    // <a href='javascript function s (){this.truste.eu.actmessage({"source":"preference_manager", "message":"submit_preferences", "data":"0"});this.truste.eu.actmessage({"source":"preference_manager", "message":"send_tracker_list", "data":{"Required Cookies":{"value":"0", "domains":{"forbes.com":"2", "www.forbes.com":"2"}}, "Functional Cookies":{"value":"1", "domains":{"accounts.bizzabo.com":"0", "bizzabo.com":"0", "realtime.bizzabo.com":"0", "ceros.com":"0", "view.ceros.com":"0", "documentcloud.org":"0", "www.documentcloud.org":"0", "dwcdn.net":"0", "dropboxusercontent.com":"0", "cdn.embedly.com":"0", "embedly.com":"0", "live.forbes.com":"0", "google.com":"0", "e.infogram.com":"0", "infogram.com":"0", "jifo.co":"0", "instana.io":"0", "nr-data.net":"0", "omny.fm":"0", "go.pardot.com":"0", "pardot.com":"0", "pi.pardot.com":"0", "podcastone.com":"0", "az1.qualtrics.com":"0", "forbesbi.az1.qualtrics.com":"0", "qualtrics.com":"0", "siteintercept.qualtrics.com":"0", "scorecardresearch.com":"0", "speechkit.io":"0", "spkt.io":"0", "spotify.com":"0", "consent-pref.trustarc.com":"0", "prefmgr-cookie.truste-svc.net":"0", "cdn.syndication.twimg.com":"0", "verse.com":"0", "www.verse.com":"0", "vimeo.com":"0"}}, "Advertising Cookies":{"value":"2", "domains":{"aaxads.com":"0", "addtoany.com":"0", "rss.art19.com":"0", "action.media6degrees.com":"0", "facebook.com":"0", "www.facebook.com":"0", "dialog.filepicker.io":"0", "www.filepicker.io":"0", "forbes8.forbes.com":"0", "learn.forbes.com":"0", "doubleclick.net":"0", "youtube.com":"0", "www.indeed.com":"0", "ads.linkedin.com":"0", "linkedin.com":"0", "www.linkedin.com":"0", "app-ab13.marketo.com":"0", "media.net":"0", "mathtag.com":"0", "gw.oribi.io":"0", "pingdom.net":"0", "m.stripe.com":"0", "twitter.com":"0", "walls.io":"0", "yahoo.com":"0", "ziprecruiter.com":"0"}}, "version":"1"}});this.truste.eu.prefclosebutton();} s();' class='minimal-consent'>Minimal Consent</a>
    if (objectClickable(divTruste) && state === 0) {
        Utils.log("Div Found and Message Listener Registered.");
        state = 1;
        window.addEventListener('message', (event) => {
            let eventJson = JSON.parse(event.data);
            if (eventJson.message === "cm_loading") {
                Utils.log("Adding Button");
                let javaScript = 'javascript:function s(){this.truste.eu.actmessage({"source":"preference_manager", "message":"submit_preferences", "data":"0"});this.truste.eu.actmessage({"source":"preference_manager", "message":"send_tracker_list", "data":{"Required Cookies":{"value":"0", "domains":{"forbes.com":"2", "www.forbes.com":"2"}}, "Functional Cookies":{"value":"1", "domains":{"accounts.bizzabo.com":"0", "bizzabo.com":"0", "realtime.bizzabo.com":"0", "ceros.com":"0", "view.ceros.com":"0", "documentcloud.org":"0", "www.documentcloud.org":"0", "dwcdn.net":"0", "dropboxusercontent.com":"0", "cdn.embedly.com":"0", "embedly.com":"0", "live.forbes.com":"0", "google.com":"0", "e.infogram.com":"0", "infogram.com":"0", "jifo.co":"0", "instana.io":"0", "nr-data.net":"0", "omny.fm":"0", "go.pardot.com":"0", "pardot.com":"0", "pi.pardot.com":"0", "podcastone.com":"0", "az1.qualtrics.com":"0", "forbesbi.az1.qualtrics.com":"0", "qualtrics.com":"0", "siteintercept.qualtrics.com":"0", "scorecardresearch.com":"0", "speechkit.io":"0", "spkt.io":"0", "spotify.com":"0", "consent-pref.trustarc.com":"0", "prefmgr-cookie.truste-svc.net":"0", "cdn.syndication.twimg.com":"0", "verse.com":"0", "www.verse.com":"0", "vimeo.com":"0"}}, "Advertising Cookies":{"value":"2", "domains":{"aaxads.com":"0", "addtoany.com":"0", "rss.art19.com":"0", "action.media6degrees.com":"0", "facebook.com":"0", "www.facebook.com":"0", "dialog.filepicker.io":"0", "www.filepicker.io":"0", "forbes8.forbes.com":"0", "learn.forbes.com":"0", "doubleclick.net":"0", "youtube.com":"0", "www.indeed.com":"0", "ads.linkedin.com":"0", "linkedin.com":"0", "www.linkedin.com":"0", "app-ab13.marketo.com":"0", "media.net":"0", "mathtag.com":"0", "gw.oribi.io":"0", "pingdom.net":"0", "m.stripe.com":"0", "twitter.com":"0", "walls.io":"0", "yahoo.com":"0", "ziprecruiter.com":"0"}}, "version":"1"}});this.truste.eu.prefclosebutton();} s();';
                Utils.createMinimalConsentButton(document, javaScript);
                state = 1;
                Utils.log("Button Added");
            }
        });
    } else if (objectClickable(minimalConsentButton) && state === 1) {
        minimalConsentButton.click();
        reset("Truste/Trustact (V1)", "0.0.0");
    }

    // 2nd variant with Div overlay
    const trusteSimpleOverlay = "#truste-consent-required";
    let divTrusteV2 = document.querySelector(trusteSimpleOverlay);

    const closeButton = "img[alt*='close button']";
    let buttomTrusteV2 = document.querySelector(closeButton);

    if (objectClickable(divTrusteV2) && state === 0) {
        divTrusteV2.click();
        Utils.log('Consent for Truste/Trustact (V2) denied.');
        state = 1;

        window.addEventListener('message', (event) => {
            let eventJson = JSON.parse(event.data);
            Utils.log(eventJson);
            // Now the Close Button is visible again.
            if (eventJson.source === "preference_manager" && eventJson.data === "true" && eventJson.message === "toggle_close_button") {
                Utils.log("We can close the iFrame. ");
                // this is a special case, in case the "decline" is failing when sending data to the backend (Marriot Case)
                if (objectClickable(buttomTrusteV2)) {
                    buttomTrusteV2.click();
                    reset("Truste/Trustact (V2)", "0.0.0");
                }
            }
        });
    }
}

function handleOneTrust() {
    Utils.log('handleOneTrust');

    const optanonDetailsSelectorV1 = "#onetrust-pc-btn-handler";
    let optananDetailsV1 = document.querySelector(optanonDetailsSelectorV1);

    const optanonSaveSettingsSelectorV1 = "button.save-preference-btn-handler";
    let optanonSaveSettingsV1 = document.querySelector(optanonSaveSettingsSelectorV1);

    const optanonCheckBoxesSelectorV1 = "checkbox.switch-checkbox";
    let optanonCheckboxesV1 = document.querySelectorAll(optanonCheckBoxesSelectorV1);

    const optanonDetailsV2 = "button.optanon-toggle-display";
    let optanonDetailsButton = document.querySelector(optanonDetailsV2);

    // this button is crappy to find, as there is no ID or class.
    const optanonSaveSettingsSelectorV2 = "button[onclick*='Save']"; //button.optanon-save-settings-button
    let optanonSaveSettingsV2 = document.querySelector(optanonSaveSettingsSelectorV2);

    const optanonListItemsSelectorV2 = "li.menu-item-on";
    let optanonListItemsV2 = document.querySelectorAll(optanonListItemsSelectorV2);

    const optanonCheckboxesSelectorV2 = "input[type*='checkbox']";
    let optanonCheckBoxesV2 = document.querySelectorAll(optanonCheckboxesSelectorV2);

    Utils.log(state);

    // Variant 1
    if (objectClickable(optananDetailsV1) && state === 0) {
        optananDetailsV1.click();
        state = 1;
    } else if (objectClickable(optanonSaveSettingsV1) && state === 1) {

        optanonCheckboxesV1.forEach(function (checkbox) {
            checkbox.setAttribute("checked", "false");
            Utils.log("Checkbox unset");
        });

        optanonSaveSettingsV1.click();
        reset("OneTrust (V1)", "0.0.0");
    }

    // Variant 2
    else if (objectClickable(optanonDetailsButton) && state === 0) {
        optanonDetailsButton.click();
        Utils.log("Details clicked");
        state = 2;
    } else if (objectClickable(optanonSaveSettingsV2) && state === 2) {
        Utils.log("Save Button found");
        optanonListItemsV2.forEach(function (listItem) {
            listItem.click();
            Utils.log("Checkbox unset");
            optanonCheckBoxesV2.forEach(function (checkbox) {
                checkbox.setAttribute("checked", "false");
                Utils.log("Checkbox unset");
            })
        });
        optanonSaveSettingsV2.click();
        reset("OneTrust (V2)", "0.0.0");
    }
}

function handleEvidon() {
    Utils.log('handleEvidonx');
    const evidonDenyAll = "button#_evidon-decline-button";

    let button = document.querySelector(evidonDenyAll);

    // we do require 3 attempts to decline the tracking
    if (objectClickable(button) && state === 0) {
        state = 1;
        button.click();
    } else if (objectClickable(button) && state === 1) {
        state = 2;
        button.click();
    } else if (objectClickable(button) && state === 2) {
        state = 3;
        button.click();
        reset("Evidon", "4957");
    }
}

function handleQuantcast() {
    Utils.log('handleQuantcast');

    const purpose = "a#qc-cmp-purpose-button";
    let purposeButton = document.querySelector(purpose);

    const denyAll = "button.qc-cmp-enable-button";
    let denyAllButton = document.querySelector(denyAll);

    const save = "button.qc-cmp-save-and-exit";
    let saveButton = document.querySelector(save);

    // press on "Options"
    if (objectClickable(purposeButton) && state === 0) {
        state = 1;
        purposeButton.click();
    }
    // disable all
    else if (objectClickable(denyAllButton) && state === 1) {
        state = 2;
        denyAllButton.click();
    }
    // save settings
    else if (objectClickable(saveButton) && state === 2) {
        saveButton.click();
        reset("Quantcast", "4957");
    }
}

function handleCookiebot() {
    Utils.log("handleCookiebot");

    const bannerSelector = "div#CybotCookiebotDialog";
    let bannerCookiebot = document.querySelector(bannerSelector);

    const cookiebotCheckboxesSelector = "input[type*='checkbox']";
    let cookiebotCheckBoxes = document.querySelectorAll(cookiebotCheckboxesSelector);

    const allowSelectedSelector = "a#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection";
    let allowAllButton = document.querySelector(allowSelectedSelector);

    const denyAllSelector = "a#CybotCookiebotDialogBodyButtonDecline";
    let denyAll = document.querySelector(denyAllSelector);


    Utils.log(denyAll);
    Utils.log("State: " + state);

    if (objectClickable(bannerCookiebot) && state === 0) {
        Utils.log("CookieBot Banner found");
        cookiebotCheckBoxes.forEach(function (checkbox) {
            checkbox.setAttribute("checked", "false");
            Utils.log("Checkbox unset");
        });
        state = 1;
    } else if (objectClickable(allowAllButton) && state === 1) {
        Utils.log("Click Save now");
        allowAllButton.click();
        reset("CookieBot", "0.0.0");
    }
    // this is a special Case for V2. The Banner was found and we only click on the Deny Button.
    else if (objectClickable(denyAll) && state === 1) {
        Utils.log("Click Deny All now");
        denyAll.click();
        reset("CookieBot", "0.0.0");
    }
}


function objectClickable(myObject) {
    return typeof myObject !== 'undefined' && myObject && typeof myObject.parentElement !== 'undefined';
}


function reset(cmp, cmpVersion) {
    // If everything is fine, remove the listener.
    observer.disconnect();
    state = -1;
    Utils.log('Consent for ' + cmp + ' denied.');
    chrome.runtime.sendMessage({cmp: cmp, cmp_version: cmpVersion, from: contentScript});
}





