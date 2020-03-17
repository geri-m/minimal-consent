"use strict";
import Utils from "./Utils";
import ICmp from "./cmp/ICmp";
import TrustArc from "./cmp/TrustArc";
import Evidon from "./cmp/Evidon"
import CustomImpl from "./cmp/CustomImpl";
import OneTrust from "./cmp/OneTrust";
import CookieBot from "./cmp/CookieBot";
import UserCentrics from "./cmp/UserCentrics";
import QuantCast from "./cmp/QuantCast";
import Traffective from "./cmp/Traffective";
import ConsentManager from "./cmp/ConsentManager";
import NotYetImplementedCmp from "./cmp/NoYetImplementedCmp";
import BackendCall from "./BackendCall";
import Chandago from "./cmp/Chandago";
import PingResult from "./entities/PingResult";
import OathCmp from "./cmp/OathCmp";

// this is some static stuff for the long tail.
const buttons = {
    '#hs-eu-decline-button': "npmjs.com",
    "#cookie_action_close_header": "tealium.com",
    "#gdpr-banner-accept": "ebay.com & ebay-kleinanzeigen.com",
    "#acceptAllButton": "PayPal"
};

const config = {attributes: true, childList: true, subtree: true};

export default class Detector {

    _document: Document;
    _backendCall: BackendCall;
    _observerForScriptSource: MutationObserver;
    _cmp: ICmp;
    _inIFrame: boolean;

    constructor(document: Document, inIframe: boolean) {
        this._document = document;
        this._backendCall = new BackendCall();
        this._inIFrame = inIframe;
    }

    set pingResult(pingResult: PingResult) {
        this._backendCall.pingResult = pingResult;
    }

    /**
     * Connection to the Observer is outsourced out of the Constructor in order to have the Object initialized first.
     * Only after that the observer can be registered in a save way.
     */

    connectObserver() {
        // Options for the observer (which mutations to observe)
        let self = this;
        this._observerForScriptSource = new MutationObserver(function (mutations) {
            self.handleCMP(mutations);
        });
        // Select the node that will be observed for mutations
        this._observerForScriptSource.observe(this._document.getRootNode(), config);
    }

    disconnectObserver() {
        this._observerForScriptSource.disconnect();
    }

    handleCMP(mutations: MutationRecord[]) {
        let allScriptTags = document.querySelectorAll("script");
        let scriptCounter;
        if (this._cmp) {
            Utils.log("CMP Defined (we should never end up here, as the observer will disconnect, if this.__cmp is set");
            return;
        }


        // some CMPs run in iFrames and therefore require different handling.
        if (this._inIFrame) {
            Utils.log("Detector in IFrame");
            for (scriptCounter = 0; scriptCounter < allScriptTags.length; scriptCounter++) {
                Utils.log("Iterating over Script");
                let urlOfScript = allScriptTags[scriptCounter].getAttribute("src");
                if (urlOfScript && typeof urlOfScript !== 'undefined') {
                    // if the script defined, make it lowercase.
                    urlOfScript = urlOfScript.toLowerCase();
                    Utils.log(urlOfScript);

                    // OATH.com
                    if (urlOfScript.includes('cmpui.js')) {
                        this._cmp = new OathCmp(this._document, urlOfScript, this._backendCall);
                        break;
                    }
                } // if of SRC Tak
            } // for Script
        } else {
            // this is the jump point we required for the nested loop
            allScripts:
                for (scriptCounter = 0; scriptCounter < allScriptTags.length; scriptCounter++) {
                    let urlOfScript = allScriptTags[scriptCounter].getAttribute("src");
                    if (urlOfScript && typeof urlOfScript !== 'undefined') {
                        // if the script defined, make it lowercase.
                        urlOfScript = urlOfScript.toLowerCase();
                        // Utils.log(urlOfScript);
                        if (urlOfScript.includes('truste.com') || urlOfScript.includes('trustarc.com') || urlOfScript.includes('trustarc.mgr.consensu.org')) {
                            this._cmp = new TrustArc(this._document, urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('evidon.com') || urlOfScript.includes("evidon.mgr.consensu.org")) {
                            this._cmp = new Evidon(this._document, urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('cookielaw.org') || urlOfScript.includes('cookiepro.com') || urlOfScript.includes('onetrust.mgr.consensu.org') || urlOfScript.includes('optanon')) {
                            this._cmp = new OneTrust(this._document, urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('cookiebot.com') || urlOfScript.includes("cookiebot.mgr.consensu.org")) {
                            this._cmp = new CookieBot(this._document, urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('usercentrics.eu') || urlOfScript.includes('usercentrics.mgr.consensu.org')) {
                            this._cmp = new UserCentrics(this._document, urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('quantcast.com') || urlOfScript.includes("quantcast.mgr.consensu.org")) {
                            this._cmp = new QuantCast(this._document, urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('traffective.com') || urlOfScript.includes('traffective.mgr.consensu.org') || urlOfScript.includes('cdntrf.com')) {
                            this._cmp = new Traffective(this._document, urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('consentmanager.mgr.consensu.org')) {
                            this._cmp = new ConsentManager(this._document, urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('chandago.com') || urlOfScript.includes('appconsent.mgr.consensu.org') || urlOfScript.includes('appconsent.io')) {
                            this._cmp = new Chandago(this._document, urlOfScript, this._backendCall);
                            break;
                        }
                        /* ATTENTION - THIS IS GENERATED CODE FROM THE EXECL SHEET */
                        else if (urlOfScript.includes('faktor.io') || urlOfScript.includes('faktor.mgr.consensu.org') || urlOfScript.includes('liveramp.com')) {
                            this._cmp = new NotYetImplementedCmp(3, this._document, 'Faktor BV', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('sourcepoint.com') || urlOfScript.includes('sourcepoint.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(6, this._document, 'Sourcepoint Technologies, Inc.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('didomi.io') || urlOfScript.includes('didomi.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(7, this._document, 'Didomi', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('baycloud.com') || urlOfScript.includes('consenthub.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(8, this._document, 'Baycloud Systems Limited', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('getadmiral.com') || urlOfScript.includes('admiral.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(9, this._document, 'Admiral', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('sovrn.com') || urlOfScript.includes('sovrn.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(11, this._document, 'Sovrn Holdings Ince', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('digitru.st') || urlOfScript.includes('digitrust.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(15, this._document, 'Cookie Trust Working Group, Inc.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('skimlinks.com') || urlOfScript.includes('skimlinks.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(20, this._document, 'Skimbit Ltd', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('conversantmedia.eu') || urlOfScript.includes('conversant.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(23, this._document, 'Conversant Europe Ltd.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('sharethis.com') || urlOfScript.includes('sharethis.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(25, this._document, 'ShareThis, Inc.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('dmgmedia.co.uk') || urlOfScript.includes('dmgmedia.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(27, this._document, 'Associated Newspapers Ltd', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('captify.co.uk') || urlOfScript.includes('captify.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(29, this._document, 'Captify Technologies Limited', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('richaudience.com') || urlOfScript.includes('richaudience.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(30, this._document, 'Rich Audience International SL', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('system1.com') || urlOfScript.includes('system1.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(38, this._document, 'System1 LLC', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('sortable.com') || urlOfScript.includes('sortable.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(39, this._document, 'Snapsort Inc., operating as Sortable', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('netsprint.group') || urlOfScript.includes('netsprintgroup.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(41, this._document, 'Grupa Netsprint Sp z o.o.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('madvertise.com') || urlOfScript.includes('madvertise.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(44, this._document, 'Madvertise Media', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('ogury.com') || urlOfScript.includes('ogury.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(45, this._document, 'Ogury Ltd', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('mediavine.com') || urlOfScript.includes('mediavine.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(46, this._document, 'Mediavine, Inc.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('trustarc.com') || urlOfScript.includes('trustarc.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(47, this._document, 'TrustArc Inc', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('sanoma.com') || urlOfScript.includes('smf.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(49, this._document, 'Sanoma Media Finland Oy', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('etarget.eu') || urlOfScript.includes('etarget.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(50, this._document, 'ETARGET SE', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('adroll.com') || urlOfScript.includes('adroll.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(54, this._document, 'AdRoll, Inc', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('triboo.com') || urlOfScript.includes('triboo.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(55, this._document, 'Triboo Media SRL', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('webedia-group.com') || urlOfScript.includes('webedia.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(57, this._document, 'WEBEDIA', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('ciaopeople.it') || urlOfScript.includes('ciaopeople.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(58, this._document, 'Ciao people s.r.l.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('deezer.com') || urlOfScript.includes('deezer.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(59, this._document, 'Deezer', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('spolecznosci.pl') || urlOfScript.includes('spolecznosci.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(61, this._document, 'Spolecznosci Sp. z o.o. Sp.k.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('gumtree.com') || urlOfScript.includes('gumtreecom.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(62, this._document, 'Gumtree.com Ltd', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('gdpr.clickio.com') || urlOfScript.includes('clickio.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(63, this._document, 'ALZ Software Ltd (trading as Clickio)', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('onetag.net') || urlOfScript.includes('onetag.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(65, this._document, 'OneTag Ltd', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('uniconsent.com') || urlOfScript.includes('uniconsent.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(68, this._document, 'Transfon Ltd', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('gremimedia.pl') || urlOfScript.includes('gmcmp.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(69, this._document, 'Gremi Media SA', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('wp.pl') || urlOfScript.includes('wpm.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(72, this._document, 'Wirtualna Polska Media S.A.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('relevant.fi') || urlOfScript.includes('relevant.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(74, this._document, 'Relevant Digital Oy', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('vectaury.io') || urlOfScript.includes('vectaury.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(75, this._document, 'VECTAURY', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('sibboventures.com') || urlOfScript.includes('sibboventures.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(76, this._document, 'SIBBO VENTURES SLU', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('admetricspro.com') || urlOfScript.includes('cmp.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(77, this._document, 'Teaching Aids, LLC', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('sfr.fr') || urlOfScript.includes('sfr.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(79, this._document, 'SFR', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('oil.axelspringer.com') || urlOfScript.includes('oil.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(80, this._document, 'Axel Springer SE', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('adtechfactory.com') || urlOfScript.includes('atf.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(82, this._document, 'AdTech Factory GmbH & Co. KG', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('almamedia.fi') || urlOfScript.includes('almamedia.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(84, this._document, 'Alma Media', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('ouest-france.fr') || urlOfScript.includes('sipaof.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(85, this._document, 'SIPA', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('nouw.com') || urlOfScript.includes('nouw.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(86, this._document, 'Nouw Media AB', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('commandersact.com') || urlOfScript.includes('commandersact.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(90, this._document, 'Commanders Act', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('sirdata.com') || urlOfScript.includes('sddan.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(92, this._document, 'SIRDATA', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('shinystat.com') || urlOfScript.includes('shinystat.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(96, this._document, 'Triboo Data Analytics', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('offremedia.com') || urlOfScript.includes('cambiummedia.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(100, this._document, 'Cambium Media', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('gemius.com') || urlOfScript.includes('gemius.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(104, this._document, 'Gemius SA', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('dailymotion.com') || urlOfScript.includes('dailymotion.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(105, this._document, 'DAILYMOTION SA', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('theguardian.com') || urlOfScript.includes('gnm.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(112, this._document, 'Guardian News and Media', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('ultimate-guitar.com') || urlOfScript.includes('musiciansaudience.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(113, this._document, 'Grand Play Media, LLC', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('adversal.com') || urlOfScript.includes('adversal.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(114, this._document, 'Adversal Media, Inc.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('a-lehdet.fi') || urlOfScript.includes('a-lehdet.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(115, this._document, 'A-lehdet Oy', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('curiositymedia.com') || urlOfScript.includes('curiositymedia.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(119, this._document, 'Curiosity Media, Inc.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('webfinancialgroup.com') || urlOfScript.includes('vortex.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(122, this._document, 'Web Financial Group S.A./Vortex', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('iubenda.com') || urlOfScript.includes('iubenda.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(123, this._document, 'iubenda', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('liqwid.com') || urlOfScript.includes('liqwid.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(124, this._document, 'LIQWID', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('ebay.com') || urlOfScript.includes('ebay.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(125, this._document, 'eBay Inc', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('adevinta.com') || urlOfScript.includes('schibstedspain.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(129, this._document, 'Adevinta Spain S.L.U.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('oriel.io') || urlOfScript.includes('oriel.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(131, this._document, 'Oriel Ventures', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('improvedigital.com') || urlOfScript.includes('improvedigital.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(139, this._document, 'Improve Digital International BV', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('wikia.comfandom') || urlOfScript.includes('fandom.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(141, this._document, 'Wikia, Inc. (FANDOM)', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('caradisiac.com') || urlOfScript.includes('caradisiac.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(147, this._document, 'Car&Boat Media', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('avocet.io') || urlOfScript.includes('avocet.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(153, this._document, 'Avocet Systems Limted', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('yoc.com') || urlOfScript.includes('yoc.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(157, this._document, 'YOC AG', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('innity.com') || urlOfScript.includes('innity.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(161, this._document, 'Innity', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('cookieinformation.com') || urlOfScript.includes('cookieinformation.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(162, this._document, 'Cookie Information APS', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('societe.com') || urlOfScript.includes('societe.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(164, this._document, 'SOCIETE SAS', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('united-internet-media.de') || urlOfScript.includes('1und1.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(167, this._document, '1&1 Mail & Media GmbH', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('outlook.live.com') || urlOfScript.includes('outlook.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(168, this._document, 'Outlook.com - Microsoft Corporation', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('mappy.com') || urlOfScript.includes('mappy.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(169, this._document, 'Mappy', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('agora.pl') || urlOfScript.includes('agora.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(170, this._document, 'AGORA SA', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('natemat.pl') || urlOfScript.includes('natemat.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(175, this._document, 'Glob 360 Sp. z o.o.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('marfeel.com') || urlOfScript.includes('marfeel.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(181, this._document, 'Marfeel Solutions S.L', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('sub2tech.com') || urlOfScript.includes('2consent.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(183, this._document, 'Sub2 Technologies Ltd', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('playwire.com') || urlOfScript.includes('playwire.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(185, this._document, 'Playwire LLC', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('venatusmedia.com') || urlOfScript.includes('venatus.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(186, this._document, 'Venatus Media Limited', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('rtp.pt') || urlOfScript.includes('rtp.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(193, this._document, 'RTP SA', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('spilgames.com') || urlOfScript.includes('spilgames.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(194, this._document, 'Spil Games B.V.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('nws.ai') || urlOfScript.includes('nws.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(196, this._document, 'Newsroom AI Ltd.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('publy.comen') || urlOfScript.includes('publy.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(197, this._document, 'Publy ltd', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('bitqueen.com') || urlOfScript.includes('bitqueen.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(205, this._document, 'Bit Q Holdings Limited', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('pagesjaunes.fr') || urlOfScript.includes('pagesjaunes.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(206, this._document, 'PAGESJAUNES', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('goldenbees.fr') || urlOfScript.includes('goldenbees.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(208, this._document, 'Golden Bees', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('lifestreet.com') || urlOfScript.includes('lifestreet.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(209, this._document, 'LifeStreet Corporation', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('singlespot.comen') || urlOfScript.includes('singlespot.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(212, this._document, 'Singlespot', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('leboncoin.fr') || urlOfScript.includes('lbc.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(214, this._document, 'LBC France', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('rgpd-smartclip.com') || urlOfScript.includes('smartcliplatam.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(215, this._document, 'Smartclip Hispania S.L.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('listonic.com') || urlOfScript.includes('listonic.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(216, this._document, 'Listonic sp. z o. o.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('bmind.es') || urlOfScript.includes('bmind.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(217, this._document, 'BMIND SALES MAKER COMPANY S.L.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('rcspubblicita.it') || urlOfScript.includes('rcsmediagroup.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(218, this._document, 'RCS MediaGroup S.p.A.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('allegro.pl') || urlOfScript.includes('allegro.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(220, this._document, 'Allegro.pl Sp z o.o.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('dentsuaegisnetwork.de') || urlOfScript.includes('dan.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(221, this._document, 'Dentsu Aegis Network Germany GmbH', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('paruvendu.fr') || urlOfScript.includes('paruvendu.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(222, this._document, 'ParuVendu.fr', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('gedispa.it') || urlOfScript.includes('gedi.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(223, this._document, 'Gedi Digital s.r.l.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('ensighten.com') || urlOfScript.includes('ensighten.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(224, this._document, 'Ensighten, Inc', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('idmnet.grupazpr.pl') || urlOfScript.includes('idmnet.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(225, this._document, 'Internetowy Dom Mediowy net S.A.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('gruppoathesis.it') || urlOfScript.includes('gruppoathesis.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(226, this._document, 'Società Athesis S.p.A.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('healthline.com') || urlOfScript.includes('healthlinemedia.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(227, this._document, 'Healthline Media, Inc.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('thirdfloor.it') || urlOfScript.includes('thirdfloor.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(228, this._document, 'Thirdfloor SRL', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('snigelweb.com') || urlOfScript.includes('snigelweb.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(229, this._document, 'Snigel Web Services Limited', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('prywatnosc.interia.pl') || urlOfScript.includes('interia.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(231, this._document, 'Grupa Interia.pl Sp. z o.o. sp. k.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('adnuntius.com') || urlOfScript.includes('adnuntiusconsent.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(235, this._document, 'Adnuntius AS', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('webads.nl') || urlOfScript.includes('webads.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(236, this._document, 'WebAds B.V', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('tiempo.com') || urlOfScript.includes('meteored.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(237, this._document, 'ALPRED SL', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('network-n.com') || urlOfScript.includes('networkn.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(240, this._document, 'Network N Ltd', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('cafemedia.com') || urlOfScript.includes('cafemedia.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(241, this._document, 'CafeMedia/AdThrive', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('nitropay.com') || urlOfScript.includes('nitropay.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(242, this._document, 'GG Software, LLC', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('livinglymedia.com') || urlOfScript.includes('livinglymedia.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(244, this._document, 'Livingly Media', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('overwolf.com') || urlOfScript.includes('overwolf.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(246, this._document, 'Overwolf Ltd.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('seznam.cz') || urlOfScript.includes('seznam.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(247, this._document, 'Seznam.cz, a.s.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('mairdumont-netletix.com') || urlOfScript.includes('mdnxcmp.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(252, this._document, 'MAIRDUMONT NETLETIX GmbH&Co. KG', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('admatic.com.tr') || urlOfScript.includes('admatic.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(256, this._document, 'AdMatic Medya AS', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('automattic.com') || urlOfScript.includes('automattic.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(258, this._document, 'Automattic, Inc.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('truedata.co') || urlOfScript.includes('truedata.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(262, this._document, 'TrueData Solutions, Inc.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('secureprivacy.ai') || urlOfScript.includes('secureprivacy.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(264, this._document, 'Secure Privacy', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('advfn.com') || urlOfScript.includes('advfn.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(265, this._document, 'ADVFN PLC', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('medme.pl') || urlOfScript.includes('pharmapartner.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(268, this._document, 'Pharma Partner sp. z o.o.', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('next14.com') || urlOfScript.includes('next14.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(273, this._document, 'Next14 SpA', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('allerholding.dk') || urlOfScript.includes('aller.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(274, this._document, 'Aller Media', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('ringieraxelspringer.pl') || urlOfScript.includes('rasp.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(280, this._document, 'Ringier Axel Springer Polska', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('pubnative.net') || urlOfScript.includes('pubnative.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(281, this._document, 'PubNative GmbH', urlOfScript, this._backendCall);
                            break;
                        } else if (urlOfScript.includes('thefreedictionary.com') || urlOfScript.includes('thefreedictionary.mgr.consensu.org')) {
                            this._cmp = new NotYetImplementedCmp(282, this._document, 'Farlex Inc', urlOfScript, this._backendCall);
                            break;
                        } else {
                            for (let key in buttons) {
                                let button = this._document.querySelector(key);
                                if (Utils.objectClickable(button)) {
                                    Utils.log("Backend: " + this._backendCall);
                                    this._cmp = new CustomImpl(this._document, key, this._backendCall);
                                    break allScripts;
                                }
                            }
                        } // Else
                    } // IF - JavaScript is Defined
                } // For Loop
        }


        if (this._cmp) {
            Utils.log("CMP is set now. Connect to Observer in new context");
            // remove Connection to the local Observer
            this.disconnectObserver();
            // now connect to the Observer.
            this._cmp.connect();
        } else {
            Utils.log("-- Run Thru completed. No Indicator for JavaScript of a CMP so far.");
        }
    }

    private inIframe() {

    }


}