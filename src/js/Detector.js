"use strict";
import Utils from "./Utils";

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

// this is some static stuff for the long tail.
const buttons = {
    '#hs-eu-decline-button': "npmjs.com",
    "#cookie_action_close_header": "tealium.com"
};

const config = {attributes: true, childList: true, subtree: true};

export default class Detector {

    constructor(node) {
        this._targetNode = node;
        this._backendCall = new BackendCall();
    }

    set pingResult(pingResult) {
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
        this._observerForScriptSource.observe(this._targetNode, config);
    }

    disconnectObserver() {
        this._observerForScriptSource.disconnect();
    }

    handleCMP(mutations) {
        let allScriptTags = document.querySelectorAll("script");
        let scriptCounter;
        if (this._cmp) {
            Utils.log("CMP Defined (we should never end up here, as the observer will disconnect, if this.__cmp is set");
            return;
        }
        // this is the jump point we required for the nested loop
        allScripts:
            for (scriptCounter = 0; scriptCounter < allScriptTags.length; scriptCounter++) {
                let urlOfScript = allScriptTags[scriptCounter].getAttribute("src");
                if (urlOfScript && typeof urlOfScript !== 'undefined') {
                    // if the script defined, make it lowercase.
                    urlOfScript = urlOfScript.toLowerCase();
                    // Utils.log(urlOfScript);
                    if (urlOfScript.includes('truste.com') || urlOfScript.includes('trustarc.com') || urlOfScript.includes('trustarc.mgr.consensu.org')) {
                        this._cmp = new TrustArc(this._targetNode, urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('evidon.com') || urlOfScript.includes("evidon.mgr.consensu.org")) {
                        this._cmp = new Evidon(this._targetNode, urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('cookielaw.org') || urlOfScript.includes('cookiepro.com') || urlOfScript.includes('onetrust.mgr.consensu.org') || urlOfScript.includes('optanon')) {
                        this._cmp = new OneTrust(this._targetNode, urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('cookiebot.com') || urlOfScript.includes("cookiebot.mgr.consensu.org")) {
                        this._cmp = new CookieBot(this._targetNode, urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('usercentrics.eu') || urlOfScript.includes('usercentrics.mgr.consensu.org')) {
                        this._cmp = new UserCentrics(this._targetNode, urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('quantcast.com') || urlOfScript.includes("quantcast.mgr.consensu.org")) {
                        this._cmp = new QuantCast(this._targetNode, urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('traffective.com') || urlOfScript.includes('traffective.mgr.consensu.org') || urlOfScript.includes('cdntrf.com')) {
                        this._cmp = new Traffective(this._targetNode, urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('consentmanager.mgr.consensu.org')) {
                        this._cmp = new ConsentManager(this._targetNode, urlOfScript, this._backendCall);
                        break;
                    }
                    /* ATTENTION - THIS IS GENERATED CODE FROM THE EXECL SHEET */
                    else if (urlOfScript.includes('chandago.com') || urlOfScript.includes('appconsent.mgr.consensu.org') || urlOfScript.includes('appconsent.io')) {
                        this._cmp = new NotYetImplementedCmp(2, this._targetNode, 'Chandago', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('faktor.io') || urlOfScript.includes('faktor.mgr.consensu.org') || urlOfScript.includes('liveramp.com')) {
                        this._cmp = new NotYetImplementedCmp(3, this._targetNode, 'Faktor BV', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('sourcepoint.com') || urlOfScript.includes('sourcepoint.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(6, this._targetNode, 'Sourcepoint Technologies, Inc.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('didomi.io') || urlOfScript.includes('didomi.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(7, this._targetNode, 'Didomi', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('baycloud.com') || urlOfScript.includes('consenthub.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(8, this._targetNode, 'Baycloud Systems Limited', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('getadmiral.com') || urlOfScript.includes('admiral.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(9, this._targetNode, 'Admiral', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('sovrn.com') || urlOfScript.includes('sovrn.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(11, this._targetNode, 'Sovrn Holdings Ince', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('oath.com') || urlOfScript.includes('oath.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(14, this._targetNode, 'Oath (EMEA) Limited', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('digitru.st') || urlOfScript.includes('digitrust.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(15, this._targetNode, 'Cookie Trust Working Group, Inc.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('skimlinks.com') || urlOfScript.includes('skimlinks.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(20, this._targetNode, 'Skimbit Ltd', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('conversantmedia.eu') || urlOfScript.includes('conversant.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(23, this._targetNode, 'Conversant Europe Ltd.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('sharethis.com') || urlOfScript.includes('sharethis.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(25, this._targetNode, 'ShareThis, Inc.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('dmgmedia.co.uk') || urlOfScript.includes('dmgmedia.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(27, this._targetNode, 'Associated Newspapers Ltd', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('captify.co.uk') || urlOfScript.includes('captify.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(29, this._targetNode, 'Captify Technologies Limited', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('richaudience.com') || urlOfScript.includes('richaudience.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(30, this._targetNode, 'Rich Audience International SL', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('system1.com') || urlOfScript.includes('system1.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(38, this._targetNode, 'System1 LLC', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('sortable.com') || urlOfScript.includes('sortable.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(39, this._targetNode, 'Snapsort Inc., operating as Sortable', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('netsprint.group') || urlOfScript.includes('netsprintgroup.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(41, this._targetNode, 'Grupa Netsprint Sp z o.o.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('madvertise.com') || urlOfScript.includes('madvertise.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(44, this._targetNode, 'Madvertise Media', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('ogury.com') || urlOfScript.includes('ogury.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(45, this._targetNode, 'Ogury Ltd', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('mediavine.com') || urlOfScript.includes('mediavine.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(46, this._targetNode, 'Mediavine, Inc.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('trustarc.com') || urlOfScript.includes('trustarc.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(47, this._targetNode, 'TrustArc Inc', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('sanoma.com') || urlOfScript.includes('smf.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(49, this._targetNode, 'Sanoma Media Finland Oy', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('etarget.eu') || urlOfScript.includes('etarget.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(50, this._targetNode, 'ETARGET SE', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('adroll.com') || urlOfScript.includes('adroll.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(54, this._targetNode, 'AdRoll, Inc', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('triboo.com') || urlOfScript.includes('triboo.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(55, this._targetNode, 'Triboo Media SRL', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('webedia-group.com') || urlOfScript.includes('webedia.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(57, this._targetNode, 'WEBEDIA', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('ciaopeople.it') || urlOfScript.includes('ciaopeople.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(58, this._targetNode, 'Ciao people s.r.l.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('deezer.com') || urlOfScript.includes('deezer.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(59, this._targetNode, 'Deezer', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('spolecznosci.pl') || urlOfScript.includes('spolecznosci.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(61, this._targetNode, 'Spolecznosci Sp. z o.o. Sp.k.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('gumtree.com') || urlOfScript.includes('gumtreecom.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(62, this._targetNode, 'Gumtree.com Ltd', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('gdpr.clickio.com') || urlOfScript.includes('clickio.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(63, this._targetNode, 'ALZ Software Ltd (trading as Clickio)', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('onetag.net') || urlOfScript.includes('onetag.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(65, this._targetNode, 'OneTag Ltd', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('uniconsent.com') || urlOfScript.includes('uniconsent.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(68, this._targetNode, 'Transfon Ltd', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('gremimedia.pl') || urlOfScript.includes('gmcmp.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(69, this._targetNode, 'Gremi Media SA', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('wp.pl') || urlOfScript.includes('wpm.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(72, this._targetNode, 'Wirtualna Polska Media S.A.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('relevant.fi') || urlOfScript.includes('relevant.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(74, this._targetNode, 'Relevant Digital Oy', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('vectaury.io') || urlOfScript.includes('vectaury.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(75, this._targetNode, 'VECTAURY', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('sibboventures.com') || urlOfScript.includes('sibboventures.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(76, this._targetNode, 'SIBBO VENTURES SLU', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('admetricspro.com') || urlOfScript.includes('cmp.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(77, this._targetNode, 'Teaching Aids, LLC', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('sfr.fr') || urlOfScript.includes('sfr.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(79, this._targetNode, 'SFR', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('oil.axelspringer.com') || urlOfScript.includes('oil.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(80, this._targetNode, 'Axel Springer SE', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('adtechfactory.com') || urlOfScript.includes('atf.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(82, this._targetNode, 'AdTech Factory GmbH & Co. KG', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('almamedia.fi') || urlOfScript.includes('almamedia.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(84, this._targetNode, 'Alma Media', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('ouest-france.fr') || urlOfScript.includes('sipaof.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(85, this._targetNode, 'SIPA', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('nouw.com') || urlOfScript.includes('nouw.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(86, this._targetNode, 'Nouw Media AB', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('commandersact.com') || urlOfScript.includes('commandersact.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(90, this._targetNode, 'Commanders Act', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('sirdata.com') || urlOfScript.includes('sddan.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(92, this._targetNode, 'SIRDATA', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('shinystat.com') || urlOfScript.includes('shinystat.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(96, this._targetNode, 'Triboo Data Analytics', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('offremedia.com') || urlOfScript.includes('cambiummedia.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(100, this._targetNode, 'Cambium Media', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('gemius.com') || urlOfScript.includes('gemius.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(104, this._targetNode, 'Gemius SA', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('dailymotion.com') || urlOfScript.includes('dailymotion.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(105, this._targetNode, 'DAILYMOTION SA', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('theguardian.com') || urlOfScript.includes('gnm.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(112, this._targetNode, 'Guardian News and Media', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('ultimate-guitar.com') || urlOfScript.includes('musiciansaudience.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(113, this._targetNode, 'Grand Play Media, LLC', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('adversal.com') || urlOfScript.includes('adversal.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(114, this._targetNode, 'Adversal Media, Inc.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('a-lehdet.fi') || urlOfScript.includes('a-lehdet.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(115, this._targetNode, 'A-lehdet Oy', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('curiositymedia.com') || urlOfScript.includes('curiositymedia.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(119, this._targetNode, 'Curiosity Media, Inc.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('webfinancialgroup.com') || urlOfScript.includes('vortex.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(122, this._targetNode, 'Web Financial Group S.A./Vortex', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('iubenda.com') || urlOfScript.includes('iubenda.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(123, this._targetNode, 'iubenda', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('liqwid.com') || urlOfScript.includes('liqwid.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(124, this._targetNode, 'LIQWID', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('ebay.com') || urlOfScript.includes('ebay.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(125, this._targetNode, 'eBay Inc', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('adevinta.com') || urlOfScript.includes('schibstedspain.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(129, this._targetNode, 'Adevinta Spain S.L.U.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('oriel.io') || urlOfScript.includes('oriel.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(131, this._targetNode, 'Oriel Ventures', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('improvedigital.com') || urlOfScript.includes('improvedigital.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(139, this._targetNode, 'Improve Digital International BV', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('wikia.comfandom') || urlOfScript.includes('fandom.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(141, this._targetNode, 'Wikia, Inc. (FANDOM)', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('caradisiac.com') || urlOfScript.includes('caradisiac.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(147, this._targetNode, 'Car&Boat Media', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('avocet.io') || urlOfScript.includes('avocet.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(153, this._targetNode, 'Avocet Systems Limted', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('yoc.com') || urlOfScript.includes('yoc.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(157, this._targetNode, 'YOC AG', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('innity.com') || urlOfScript.includes('innity.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(161, this._targetNode, 'Innity', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('cookieinformation.com') || urlOfScript.includes('cookieinformation.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(162, this._targetNode, 'Cookie Information APS', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('societe.com') || urlOfScript.includes('societe.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(164, this._targetNode, 'SOCIETE SAS', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('united-internet-media.de') || urlOfScript.includes('1und1.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(167, this._targetNode, '1&1 Mail & Media GmbH', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('outlook.live.com') || urlOfScript.includes('outlook.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(168, this._targetNode, 'Outlook.com - Microsoft Corporation', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('mappy.com') || urlOfScript.includes('mappy.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(169, this._targetNode, 'Mappy', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('agora.pl') || urlOfScript.includes('agora.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(170, this._targetNode, 'AGORA SA', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('natemat.pl') || urlOfScript.includes('natemat.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(175, this._targetNode, 'Glob 360 Sp. z o.o.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('marfeel.com') || urlOfScript.includes('marfeel.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(181, this._targetNode, 'Marfeel Solutions S.L', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('sub2tech.com') || urlOfScript.includes('2consent.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(183, this._targetNode, 'Sub2 Technologies Ltd', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('playwire.com') || urlOfScript.includes('playwire.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(185, this._targetNode, 'Playwire LLC', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('venatusmedia.com') || urlOfScript.includes('venatus.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(186, this._targetNode, 'Venatus Media Limited', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('rtp.pt') || urlOfScript.includes('rtp.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(193, this._targetNode, 'RTP SA', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('spilgames.com') || urlOfScript.includes('spilgames.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(194, this._targetNode, 'Spil Games B.V.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('nws.ai') || urlOfScript.includes('nws.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(196, this._targetNode, 'Newsroom AI Ltd.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('publy.comen') || urlOfScript.includes('publy.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(197, this._targetNode, 'Publy ltd', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('bitqueen.com') || urlOfScript.includes('bitqueen.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(205, this._targetNode, 'Bit Q Holdings Limited', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('pagesjaunes.fr') || urlOfScript.includes('pagesjaunes.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(206, this._targetNode, 'PAGESJAUNES', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('goldenbees.fr') || urlOfScript.includes('goldenbees.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(208, this._targetNode, 'Golden Bees', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('lifestreet.com') || urlOfScript.includes('lifestreet.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(209, this._targetNode, 'LifeStreet Corporation', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('singlespot.comen') || urlOfScript.includes('singlespot.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(212, this._targetNode, 'Singlespot', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('leboncoin.fr') || urlOfScript.includes('lbc.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(214, this._targetNode, 'LBC France', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('rgpd-smartclip.com') || urlOfScript.includes('smartcliplatam.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(215, this._targetNode, 'Smartclip Hispania S.L.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('listonic.com') || urlOfScript.includes('listonic.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(216, this._targetNode, 'Listonic sp. z o. o.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('bmind.es') || urlOfScript.includes('bmind.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(217, this._targetNode, 'BMIND SALES MAKER COMPANY S.L.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('rcspubblicita.it') || urlOfScript.includes('rcsmediagroup.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(218, this._targetNode, 'RCS MediaGroup S.p.A.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('allegro.pl') || urlOfScript.includes('allegro.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(220, this._targetNode, 'Allegro.pl Sp z o.o.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('dentsuaegisnetwork.de') || urlOfScript.includes('dan.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(221, this._targetNode, 'Dentsu Aegis Network Germany GmbH', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('paruvendu.fr') || urlOfScript.includes('paruvendu.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(222, this._targetNode, 'ParuVendu.fr', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('gedispa.it') || urlOfScript.includes('gedi.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(223, this._targetNode, 'Gedi Digital s.r.l.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('ensighten.com') || urlOfScript.includes('ensighten.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(224, this._targetNode, 'Ensighten, Inc', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('idmnet.grupazpr.pl') || urlOfScript.includes('idmnet.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(225, this._targetNode, 'Internetowy Dom Mediowy net S.A.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('gruppoathesis.it') || urlOfScript.includes('gruppoathesis.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(226, this._targetNode, 'Società Athesis S.p.A.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('healthline.com') || urlOfScript.includes('healthlinemedia.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(227, this._targetNode, 'Healthline Media, Inc.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('thirdfloor.it') || urlOfScript.includes('thirdfloor.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(228, this._targetNode, 'Thirdfloor SRL', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('snigelweb.com') || urlOfScript.includes('snigelweb.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(229, this._targetNode, 'Snigel Web Services Limited', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('prywatnosc.interia.pl') || urlOfScript.includes('interia.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(231, this._targetNode, 'Grupa Interia.pl Sp. z o.o. sp. k.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('adnuntius.com') || urlOfScript.includes('adnuntiusconsent.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(235, this._targetNode, 'Adnuntius AS', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('webads.nl') || urlOfScript.includes('webads.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(236, this._targetNode, 'WebAds B.V', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('tiempo.com') || urlOfScript.includes('meteored.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(237, this._targetNode, 'ALPRED SL', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('network-n.com') || urlOfScript.includes('networkn.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(240, this._targetNode, 'Network N Ltd', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('cafemedia.com') || urlOfScript.includes('cafemedia.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(241, this._targetNode, 'CafeMedia/AdThrive', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('nitropay.com') || urlOfScript.includes('nitropay.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(242, this._targetNode, 'GG Software, LLC', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('livinglymedia.com') || urlOfScript.includes('livinglymedia.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(244, this._targetNode, 'Livingly Media', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('overwolf.com') || urlOfScript.includes('overwolf.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(246, this._targetNode, 'Overwolf Ltd.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('seznam.cz') || urlOfScript.includes('seznam.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(247, this._targetNode, 'Seznam.cz, a.s.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('mairdumont-netletix.com') || urlOfScript.includes('mdnxcmp.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(252, this._targetNode, 'MAIRDUMONT NETLETIX GmbH&Co. KG', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('admatic.com.tr') || urlOfScript.includes('admatic.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(256, this._targetNode, 'AdMatic Medya AS', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('automattic.com') || urlOfScript.includes('automattic.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(258, this._targetNode, 'Automattic, Inc.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('truedata.co') || urlOfScript.includes('truedata.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(262, this._targetNode, 'TrueData Solutions, Inc.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('secureprivacy.ai') || urlOfScript.includes('secureprivacy.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(264, this._targetNode, 'Secure Privacy', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('advfn.com') || urlOfScript.includes('advfn.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(265, this._targetNode, 'ADVFN PLC', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('medme.pl') || urlOfScript.includes('pharmapartner.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(268, this._targetNode, 'Pharma Partner sp. z o.o.', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('next14.com') || urlOfScript.includes('next14.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(273, this._targetNode, 'Next14 SpA', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('allerholding.dk') || urlOfScript.includes('aller.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(274, this._targetNode, 'Aller Media', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('ringieraxelspringer.pl') || urlOfScript.includes('rasp.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(280, this._targetNode, 'Ringier Axel Springer Polska', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('pubnative.net') || urlOfScript.includes('pubnative.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(281, this._targetNode, 'PubNative GmbH', urlOfScript, this._backendCall);
                        break;
                    } else if (urlOfScript.includes('thefreedictionary.com') || urlOfScript.includes('thefreedictionary.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(282, this._targetNode, 'Farlex Inc', urlOfScript, this._backendCall);
                        break;
                    } else {
                        for (let key in buttons) {
                            let button = this._targetNode.querySelector(key);
                            if (Utils.objectClickable(button)) {
                                Utils.log("Backend: " + this._backendCall);
                                this._cmp = new CustomImpl(this._targetNode, key, this._backendCall);
                                break allScripts;
                            }
                        }
                    } // Else
                } // IF - JavaScript is Defined
            } // For Loop

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
}