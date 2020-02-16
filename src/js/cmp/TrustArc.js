"use strict";

import Utils from "../Utils";
import CMP from "./CMP";


export default class TrustArc extends CMP {

    constructor(node, scriptUrl, backendCall) {
        super(41, node, "TrustArc Inc", scriptUrl, CMP.cmpType.DO_NOT_WAIT, true, backendCall);
    }

    handleCmp() {
        // 1st Variant with iFrame
        const trusteBoxOverlay = "div.truste_box_overlay";
        let divTruste = super.queryNodeSelector(trusteBoxOverlay);
        let minimalConsentButton = super.queryNodeSelector(super.minimalConsentLink);

        // this is all happening in an iFrame, hence we are interacting via the notice.js with the iFrame.
        // <a href='javascript function s (){this.truste.eu.actmessage({"source":"preference_manager", "message":"submit_preferences", "data":"0"});this.truste.eu.actmessage({"source":"preference_manager", "message":"send_tracker_list", "data":{"Required Cookies":{"value":"0", "domains":{"forbes.com":"2", "www.forbes.com":"2"}}, "Functional Cookies":{"value":"1", "domains":{"accounts.bizzabo.com":"0", "bizzabo.com":"0", "realtime.bizzabo.com":"0", "ceros.com":"0", "view.ceros.com":"0", "documentcloud.org":"0", "www.documentcloud.org":"0", "dwcdn.net":"0", "dropboxusercontent.com":"0", "cdn.embedly.com":"0", "embedly.com":"0", "live.forbes.com":"0", "google.com":"0", "e.infogram.com":"0", "infogram.com":"0", "jifo.co":"0", "instana.io":"0", "nr-data.net":"0", "omny.fm":"0", "go.pardot.com":"0", "pardot.com":"0", "pi.pardot.com":"0", "podcastone.com":"0", "az1.qualtrics.com":"0", "forbesbi.az1.qualtrics.com":"0", "qualtrics.com":"0", "siteintercept.qualtrics.com":"0", "scorecardresearch.com":"0", "speechkit.io":"0", "spkt.io":"0", "spotify.com":"0", "consent-pref.trustarc.com":"0", "prefmgr-cookie.truste-svc.net":"0", "cdn.syndication.twimg.com":"0", "verse.com":"0", "www.verse.com":"0", "vimeo.com":"0"}}, "Advertising Cookies":{"value":"2", "domains":{"aaxads.com":"0", "addtoany.com":"0", "rss.art19.com":"0", "action.media6degrees.com":"0", "facebook.com":"0", "www.facebook.com":"0", "dialog.filepicker.io":"0", "www.filepicker.io":"0", "forbes8.forbes.com":"0", "learn.forbes.com":"0", "doubleclick.net":"0", "youtube.com":"0", "www.indeed.com":"0", "ads.linkedin.com":"0", "linkedin.com":"0", "www.linkedin.com":"0", "app-ab13.marketo.com":"0", "media.net":"0", "mathtag.com":"0", "gw.oribi.io":"0", "pingdom.net":"0", "m.stripe.com":"0", "twitter.com":"0", "walls.io":"0", "yahoo.com":"0", "ziprecruiter.com":"0"}}, "version":"1"}});this.truste.eu.prefclosebutton();} s();' class='minimal-consent'>Minimal Consent</a>
        if (Utils.objectClickable(divTruste) && super.state === 0) {
            Utils.log("Div Found and Message Listener Registered.");
            super.state = 1;
            window.addEventListener('message', (event) => {
                let eventJson = JSON.parse(event.data);
                if (eventJson.message === "cm_loading") {
                    Utils.log("Adding Button");
                    let javaScript = 'javascript:function s(){this.truste.eu.actmessage({"source":"preference_manager", "message":"submit_preferences", "data":"0"});this.truste.eu.actmessage({"source":"preference_manager", "message":"send_tracker_list", "data":{"Required Cookies":{"value":"0", "domains":{"forbes.com":"2", "www.forbes.com":"2"}}, "Functional Cookies":{"value":"1", "domains":{"accounts.bizzabo.com":"0", "bizzabo.com":"0", "realtime.bizzabo.com":"0", "ceros.com":"0", "view.ceros.com":"0", "documentcloud.org":"0", "www.documentcloud.org":"0", "dwcdn.net":"0", "dropboxusercontent.com":"0", "cdn.embedly.com":"0", "embedly.com":"0", "live.forbes.com":"0", "google.com":"0", "e.infogram.com":"0", "infogram.com":"0", "jifo.co":"0", "instana.io":"0", "nr-data.net":"0", "omny.fm":"0", "go.pardot.com":"0", "pardot.com":"0", "pi.pardot.com":"0", "podcastone.com":"0", "az1.qualtrics.com":"0", "forbesbi.az1.qualtrics.com":"0", "qualtrics.com":"0", "siteintercept.qualtrics.com":"0", "scorecardresearch.com":"0", "speechkit.io":"0", "spkt.io":"0", "spotify.com":"0", "consent-pref.trustarc.com":"0", "prefmgr-cookie.truste-svc.net":"0", "cdn.syndication.twimg.com":"0", "verse.com":"0", "www.verse.com":"0", "vimeo.com":"0"}}, "Advertising Cookies":{"value":"2", "domains":{"aaxads.com":"0", "addtoany.com":"0", "rss.art19.com":"0", "action.media6degrees.com":"0", "facebook.com":"0", "www.facebook.com":"0", "dialog.filepicker.io":"0", "www.filepicker.io":"0", "forbes8.forbes.com":"0", "learn.forbes.com":"0", "doubleclick.net":"0", "youtube.com":"0", "www.indeed.com":"0", "ads.linkedin.com":"0", "linkedin.com":"0", "www.linkedin.com":"0", "app-ab13.marketo.com":"0", "media.net":"0", "mathtag.com":"0", "gw.oribi.io":"0", "pingdom.net":"0", "m.stripe.com":"0", "twitter.com":"0", "walls.io":"0", "yahoo.com":"0", "ziprecruiter.com":"0"}}, "version":"1"}});this.truste.eu.prefclosebutton();} s();';
                    Utils.createMinimalConsentButton(document, javaScript);
                    super.state = 1;
                    Utils.log("Button Added");
                }
            });
        } else if (Utils.objectClickable(minimalConsentButton) && super.state === 1) {
            minimalConsentButton.click();
            super.reset();
        }

        // 2nd variant with Div overlay
        const trusteSimpleOverlay = "#truste-consent-required";
        let divTrusteV2 = super.queryNodeSelector(trusteSimpleOverlay);

        const closeButton = "img[alt*='close button']";
        let buttomTrusteV2 = super.queryNodeSelector(closeButton);

        if (Utils.objectClickable(divTrusteV2) && super.state === 0) {
            divTrusteV2.click();
            Utils.log('Consent for Truste/Trustact (V2) denied.');
            super.state = 1;

            window.addEventListener('message', (event) => {
                let eventJson = JSON.parse(event.data);
                Utils.log(eventJson);
                // Now the Close Button is visible again.
                if (eventJson.source === "preference_manager" && eventJson.data === "true" && eventJson.message === "toggle_close_button") {
                    Utils.log("We can close the iFrame. ");
                    // this is a special case, in case the "decline" is failing when sending data to the backend (Marriot Case)
                    if (Utils.objectClickable(buttomTrusteV2)) {
                        buttomTrusteV2.click();
                        super.reset();
                    }
                }
            });
        }
    }

}