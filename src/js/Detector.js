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

// this is some static stuff for the long tail.
const buttons = {
    '#hs-eu-decline-button': "npmjs.com",
    "#cookie_action_close_header": "tealium.com"
};

const config = {attributes: true, childList: true, subtree: true};

export default class Detector {

    constructor(node) {
        this.targetNode = node;
    }

    /**
     * Connection to the Observer is outsourced out of the Constructor in order to have the Object initialized first.
     * Only after that the observer can be registered in a save way.
     */

    connectObserver() {
        // Options for the observer (which mutations to observe)
        let self = this;
        this.selectCmpObserver = new MutationObserver(function (mutations) {
            self.handleCMP(mutations);
        });
        this.selectCmpObserver.observe(this.targetNode, config);
    }

    disconnectObserver() {
        this.selectCmpObserver.disconnect();
    }

    get initializedCmp() {
        return this._cmp;
    }

    handleCMP(mutations) {
        let allScriptTags = document.querySelectorAll("script");
        let scriptCounter;
        if (this._cmp) {
            Utils.log("CMP Defined");
            return;
        }
        // this is the jump point we required for the nested loop
        allScripts:
            for (scriptCounter = 0; scriptCounter < allScriptTags.length; scriptCounter++) {
                let urlOfScript = allScriptTags[scriptCounter].getAttribute("src");
                if (urlOfScript && typeof urlOfScript !== 'undefined') {
                    // if the script defined, make it lowercase.
                    urlOfScript = urlOfScript.toLowerCase();
                    Utils.log(urlOfScript);
                    if (urlOfScript.includes('truste.com') || urlOfScript.includes('trustarc.com') || urlOfScript.includes('trustarc.mgr.consensu.org')) {
                        this._cmp = new TrustArc(this.targetNode, urlOfScript);
                        break;
                    } else if (urlOfScript.includes('evidon.com') || urlOfScript.includes("evidon.mgr.consensu.org")) {
                        this._cmp = new Evidon(this.targetNode, urlOfScript);
                        break;
                    } else if (urlOfScript.includes('cookielaw.org') || urlOfScript.includes('cookiepro.com') || urlOfScript.includes('onetrust.mgr.consensu.org') || urlOfScript.includes('optanon')) {
                        this._cmp = new OneTrust(this.targetNode, urlOfScript);
                        break;
                    } else if (urlOfScript.includes('cookiebot.com') || urlOfScript.includes("cookiebot.mgr.consensu.org")) {
                        this._cmp = new CookieBot(this.targetNode, urlOfScript);
                        break;
                    } else if (urlOfScript.includes('usercentrics.eu') || urlOfScript.includes('usercentrics.mgr.consensu.org')) {
                        this._cmp = new UserCentrics(this.targetNode, urlOfScript);
                        break;
                    } else if (urlOfScript.includes('quantcast.com') || urlOfScript.includes("quantcast.mgr.consensu.org")) {
                        this._cmp = new QuantCast(this.targetNode, urlOfScript);
                        break;
                    } else if (urlOfScript.includes('traffective.com') || urlOfScript.includes('traffective.mgr.consensu.org') || urlOfScript.includes('cdntrf.com')) {
                        this._cmp = new Traffective(this.targetNode, urlOfScript);
                        break;
                    } else if (urlOfScript.includes('consentmanager.mgr.consensu.org')) {
                        this._cmp = new ConsentManager(this.targetNode, urlOfScript);
                        break;
                    }
                    /* ATTENTION - THIS IS GENERATED CODE FROM THE EXECL SHEET */
                    else if (urlOfScript.includes('chandago.com') || urlOfScript.includes('appconsent.mgr.consensu.org') || urlOfScript.includes('appconsent.io')) {
                        this._cmp = new NotYetImplementedCmp(2, this.targetNode, 'Chandago', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('faktor.io') || urlOfScript.includes('faktor.mgr.consensu.org') || urlOfScript.includes('liveramp.com')) {
                        this._cmp = new NotYetImplementedCmp(3, this.targetNode, 'Faktor BV', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('sourcepoint.com') || urlOfScript.includes('sourcepoint.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(6, this.targetNode, 'Sourcepoint Technologies, Inc.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('didomi.io') || urlOfScript.includes('didomi.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(7, this.targetNode, 'Didomi', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('baycloud.com') || urlOfScript.includes('consenthub.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(8, this.targetNode, 'Baycloud Systems Limited', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('getadmiral.com') || urlOfScript.includes('admiral.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(9, this.targetNode, 'Admiral', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('sovrn.com') || urlOfScript.includes('sovrn.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(11, this.targetNode, 'Sovrn Holdings Ince', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('oath.com') || urlOfScript.includes('oath.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(14, this.targetNode, 'Oath (EMEA) Limited', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('digitru.st') || urlOfScript.includes('digitrust.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(15, this.targetNode, 'Cookie Trust Working Group, Inc.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('skimlinks.com') || urlOfScript.includes('skimlinks.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(20, this.targetNode, 'Skimbit Ltd', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('conversantmedia.eu') || urlOfScript.includes('conversant.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(23, this.targetNode, 'Conversant Europe Ltd.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('sharethis.com') || urlOfScript.includes('sharethis.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(25, this.targetNode, 'ShareThis, Inc.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('dmgmedia.co.uk') || urlOfScript.includes('dmgmedia.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(27, this.targetNode, 'Associated Newspapers Ltd', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('captify.co.uk') || urlOfScript.includes('captify.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(29, this.targetNode, 'Captify Technologies Limited', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('richaudience.com') || urlOfScript.includes('richaudience.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(30, this.targetNode, 'Rich Audience International SL', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('system1.com') || urlOfScript.includes('system1.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(38, this.targetNode, 'System1 LLC', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('sortable.com') || urlOfScript.includes('sortable.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(39, this.targetNode, 'Snapsort Inc., operating as Sortable', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('netsprint.group') || urlOfScript.includes('netsprintgroup.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(41, this.targetNode, 'Grupa Netsprint Sp z o.o.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('madvertise.com') || urlOfScript.includes('madvertise.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(44, this.targetNode, 'Madvertise Media', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('ogury.com') || urlOfScript.includes('ogury.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(45, this.targetNode, 'Ogury Ltd', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('mediavine.com') || urlOfScript.includes('mediavine.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(46, this.targetNode, 'Mediavine, Inc.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('trustarc.com') || urlOfScript.includes('trustarc.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(47, this.targetNode, 'TrustArc Inc', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('sanoma.com') || urlOfScript.includes('smf.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(49, this.targetNode, 'Sanoma Media Finland Oy', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('etarget.eu') || urlOfScript.includes('etarget.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(50, this.targetNode, 'ETARGET SE', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('adroll.com') || urlOfScript.includes('adroll.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(54, this.targetNode, 'AdRoll, Inc', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('triboo.com') || urlOfScript.includes('triboo.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(55, this.targetNode, 'Triboo Media SRL', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('webedia-group.com') || urlOfScript.includes('webedia.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(57, this.targetNode, 'WEBEDIA', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('ciaopeople.it') || urlOfScript.includes('ciaopeople.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(58, this.targetNode, 'Ciao people s.r.l.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('deezer.com') || urlOfScript.includes('deezer.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(59, this.targetNode, 'Deezer', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('spolecznosci.pl') || urlOfScript.includes('spolecznosci.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(61, this.targetNode, 'Spolecznosci Sp. z o.o. Sp.k.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('gumtree.com') || urlOfScript.includes('gumtreecom.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(62, this.targetNode, 'Gumtree.com Ltd', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('gdpr.clickio.com') || urlOfScript.includes('clickio.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(63, this.targetNode, 'ALZ Software Ltd (trading as Clickio)', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('onetag.net') || urlOfScript.includes('onetag.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(65, this.targetNode, 'OneTag Ltd', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('uniconsent.com') || urlOfScript.includes('uniconsent.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(68, this.targetNode, 'Transfon Ltd', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('gremimedia.pl') || urlOfScript.includes('gmcmp.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(69, this.targetNode, 'Gremi Media SA', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('wp.pl') || urlOfScript.includes('wpm.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(72, this.targetNode, 'Wirtualna Polska Media S.A.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('relevant.fi') || urlOfScript.includes('relevant.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(74, this.targetNode, 'Relevant Digital Oy', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('vectaury.io') || urlOfScript.includes('vectaury.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(75, this.targetNode, 'VECTAURY', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('sibboventures.com') || urlOfScript.includes('sibboventures.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(76, this.targetNode, 'SIBBO VENTURES SLU', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('admetricspro.com') || urlOfScript.includes('cmp.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(77, this.targetNode, 'Teaching Aids, LLC', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('sfr.fr') || urlOfScript.includes('sfr.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(79, this.targetNode, 'SFR', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('oil.axelspringer.com') || urlOfScript.includes('oil.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(80, this.targetNode, 'Axel Springer SE', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('adtechfactory.com') || urlOfScript.includes('atf.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(82, this.targetNode, 'AdTech Factory GmbH & Co. KG', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('almamedia.fi') || urlOfScript.includes('almamedia.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(84, this.targetNode, 'Alma Media', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('ouest-france.fr') || urlOfScript.includes('sipaof.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(85, this.targetNode, 'SIPA', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('nouw.com') || urlOfScript.includes('nouw.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(86, this.targetNode, 'Nouw Media AB', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('commandersact.com') || urlOfScript.includes('commandersact.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(90, this.targetNode, 'Commanders Act', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('sirdata.com') || urlOfScript.includes('sddan.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(92, this.targetNode, 'SIRDATA', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('shinystat.com') || urlOfScript.includes('shinystat.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(96, this.targetNode, 'Triboo Data Analytics', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('offremedia.com') || urlOfScript.includes('cambiummedia.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(100, this.targetNode, 'Cambium Media', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('gemius.com') || urlOfScript.includes('gemius.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(104, this.targetNode, 'Gemius SA', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('dailymotion.com') || urlOfScript.includes('dailymotion.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(105, this.targetNode, 'DAILYMOTION SA', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('theguardian.com') || urlOfScript.includes('gnm.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(112, this.targetNode, 'Guardian News and Media', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('ultimate-guitar.com') || urlOfScript.includes('musiciansaudience.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(113, this.targetNode, 'Grand Play Media, LLC', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('adversal.com') || urlOfScript.includes('adversal.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(114, this.targetNode, 'Adversal Media, Inc.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('a-lehdet.fi') || urlOfScript.includes('a-lehdet.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(115, this.targetNode, 'A-lehdet Oy', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('curiositymedia.com') || urlOfScript.includes('curiositymedia.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(119, this.targetNode, 'Curiosity Media, Inc.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('webfinancialgroup.com') || urlOfScript.includes('vortex.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(122, this.targetNode, 'Web Financial Group S.A./Vortex', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('iubenda.com') || urlOfScript.includes('iubenda.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(123, this.targetNode, 'iubenda', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('liqwid.com') || urlOfScript.includes('liqwid.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(124, this.targetNode, 'LIQWID', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('ebay.com') || urlOfScript.includes('ebay.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(125, this.targetNode, 'eBay Inc', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('adevinta.com') || urlOfScript.includes('schibstedspain.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(129, this.targetNode, 'Adevinta Spain S.L.U.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('oriel.io') || urlOfScript.includes('oriel.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(131, this.targetNode, 'Oriel Ventures', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('improvedigital.com') || urlOfScript.includes('improvedigital.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(139, this.targetNode, 'Improve Digital International BV', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('wikia.comfandom') || urlOfScript.includes('fandom.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(141, this.targetNode, 'Wikia, Inc. (FANDOM)', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('caradisiac.com') || urlOfScript.includes('caradisiac.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(147, this.targetNode, 'Car&Boat Media', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('avocet.io') || urlOfScript.includes('avocet.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(153, this.targetNode, 'Avocet Systems Limted', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('yoc.com') || urlOfScript.includes('yoc.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(157, this.targetNode, 'YOC AG', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('innity.com') || urlOfScript.includes('innity.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(161, this.targetNode, 'Innity', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('cookieinformation.com') || urlOfScript.includes('cookieinformation.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(162, this.targetNode, 'Cookie Information APS', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('societe.com') || urlOfScript.includes('societe.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(164, this.targetNode, 'SOCIETE SAS', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('united-internet-media.de') || urlOfScript.includes('1und1.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(167, this.targetNode, '1&1 Mail & Media GmbH', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('outlook.live.com') || urlOfScript.includes('outlook.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(168, this.targetNode, 'Outlook.com - Microsoft Corporation', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('mappy.com') || urlOfScript.includes('mappy.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(169, this.targetNode, 'Mappy', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('agora.pl') || urlOfScript.includes('agora.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(170, this.targetNode, 'AGORA SA', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('natemat.pl') || urlOfScript.includes('natemat.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(175, this.targetNode, 'Glob 360 Sp. z o.o.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('marfeel.com') || urlOfScript.includes('marfeel.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(181, this.targetNode, 'Marfeel Solutions S.L', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('sub2tech.com') || urlOfScript.includes('2consent.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(183, this.targetNode, 'Sub2 Technologies Ltd', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('playwire.com') || urlOfScript.includes('playwire.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(185, this.targetNode, 'Playwire LLC', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('venatusmedia.com') || urlOfScript.includes('venatus.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(186, this.targetNode, 'Venatus Media Limited', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('rtp.pt') || urlOfScript.includes('rtp.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(193, this.targetNode, 'RTP SA', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('spilgames.com') || urlOfScript.includes('spilgames.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(194, this.targetNode, 'Spil Games B.V.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('nws.ai') || urlOfScript.includes('nws.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(196, this.targetNode, 'Newsroom AI Ltd.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('publy.comen') || urlOfScript.includes('publy.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(197, this.targetNode, 'Publy ltd', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('bitqueen.com') || urlOfScript.includes('bitqueen.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(205, this.targetNode, 'Bit Q Holdings Limited', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('pagesjaunes.fr') || urlOfScript.includes('pagesjaunes.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(206, this.targetNode, 'PAGESJAUNES', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('goldenbees.fr') || urlOfScript.includes('goldenbees.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(208, this.targetNode, 'Golden Bees', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('lifestreet.com') || urlOfScript.includes('lifestreet.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(209, this.targetNode, 'LifeStreet Corporation', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('singlespot.comen') || urlOfScript.includes('singlespot.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(212, this.targetNode, 'Singlespot', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('leboncoin.fr') || urlOfScript.includes('lbc.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(214, this.targetNode, 'LBC France', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('rgpd-smartclip.com') || urlOfScript.includes('smartcliplatam.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(215, this.targetNode, 'Smartclip Hispania S.L.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('listonic.com') || urlOfScript.includes('listonic.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(216, this.targetNode, 'Listonic sp. z o. o.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('bmind.es') || urlOfScript.includes('bmind.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(217, this.targetNode, 'BMIND SALES MAKER COMPANY S.L.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('rcspubblicita.it') || urlOfScript.includes('rcsmediagroup.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(218, this.targetNode, 'RCS MediaGroup S.p.A.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('allegro.pl') || urlOfScript.includes('allegro.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(220, this.targetNode, 'Allegro.pl Sp z o.o.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('dentsuaegisnetwork.de') || urlOfScript.includes('dan.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(221, this.targetNode, 'Dentsu Aegis Network Germany GmbH', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('paruvendu.fr') || urlOfScript.includes('paruvendu.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(222, this.targetNode, 'ParuVendu.fr', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('gedispa.it') || urlOfScript.includes('gedi.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(223, this.targetNode, 'Gedi Digital s.r.l.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('ensighten.com') || urlOfScript.includes('ensighten.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(224, this.targetNode, 'Ensighten, Inc', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('idmnet.grupazpr.pl') || urlOfScript.includes('idmnet.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(225, this.targetNode, 'Internetowy Dom Mediowy net S.A.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('gruppoathesis.it') || urlOfScript.includes('gruppoathesis.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(226, this.targetNode, 'Società Athesis S.p.A.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('healthline.com') || urlOfScript.includes('healthlinemedia.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(227, this.targetNode, 'Healthline Media, Inc.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('thirdfloor.it') || urlOfScript.includes('thirdfloor.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(228, this.targetNode, 'Thirdfloor SRL', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('snigelweb.com') || urlOfScript.includes('snigelweb.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(229, this.targetNode, 'Snigel Web Services Limited', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('prywatnosc.interia.pl') || urlOfScript.includes('interia.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(231, this.targetNode, 'Grupa Interia.pl Sp. z o.o. sp. k.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('adnuntius.com') || urlOfScript.includes('adnuntiusconsent.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(235, this.targetNode, 'Adnuntius AS', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('webads.nl') || urlOfScript.includes('webads.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(236, this.targetNode, 'WebAds B.V', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('tiempo.com') || urlOfScript.includes('meteored.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(237, this.targetNode, 'ALPRED SL', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('network-n.com') || urlOfScript.includes('networkn.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(240, this.targetNode, 'Network N Ltd', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('cafemedia.com') || urlOfScript.includes('cafemedia.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(241, this.targetNode, 'CafeMedia/AdThrive', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('nitropay.com') || urlOfScript.includes('nitropay.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(242, this.targetNode, 'GG Software, LLC', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('livinglymedia.com') || urlOfScript.includes('livinglymedia.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(244, this.targetNode, 'Livingly Media', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('overwolf.com') || urlOfScript.includes('overwolf.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(246, this.targetNode, 'Overwolf Ltd.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('seznam.cz') || urlOfScript.includes('seznam.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(247, this.targetNode, 'Seznam.cz, a.s.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('mairdumont-netletix.com') || urlOfScript.includes('mdnxcmp.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(252, this.targetNode, 'MAIRDUMONT NETLETIX GmbH&Co. KG', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('admatic.com.tr') || urlOfScript.includes('admatic.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(256, this.targetNode, 'AdMatic Medya AS', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('automattic.com') || urlOfScript.includes('automattic.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(258, this.targetNode, 'Automattic, Inc.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('truedata.co') || urlOfScript.includes('truedata.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(262, this.targetNode, 'TrueData Solutions, Inc.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('secureprivacy.ai') || urlOfScript.includes('secureprivacy.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(264, this.targetNode, 'Secure Privacy', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('advfn.com') || urlOfScript.includes('advfn.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(265, this.targetNode, 'ADVFN PLC', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('medme.pl') || urlOfScript.includes('pharmapartner.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(268, this.targetNode, 'Pharma Partner sp. z o.o.', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('next14.com') || urlOfScript.includes('next14.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(273, this.targetNode, 'Next14 SpA', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('allerholding.dk') || urlOfScript.includes('aller.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(274, this.targetNode, 'Aller Media', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('ringieraxelspringer.pl') || urlOfScript.includes('rasp.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(280, this.targetNode, 'Ringier Axel Springer Polska', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('pubnative.net') || urlOfScript.includes('pubnative.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(281, this.targetNode, 'PubNative GmbH', urlOfScript);
                        break;
                    } else if (urlOfScript.includes('thefreedictionary.com') || urlOfScript.includes('thefreedictionary.mgr.consensu.org')) {
                        this._cmp = new NotYetImplementedCmp(282, this.targetNode, 'Farlex Inc', urlOfScript);
                        break;
                    } else {
                        for (let key in buttons) {
                            let button = this.targetNode.querySelector(key);
                            if (Utils.objectClickable(button)) {
                                this._cmp = new CustomImpl(this.targetNode, key);
                                break allScripts;
                            }
                        }
                    } // Else
                } // IF - JavaScript is Defined
            } // For Loop

        if (this._cmp) {
            // remove Connection to the local Observer
            this.disconnectObserver();
            // now connect to the Observer.
            this._cmp.connect();
        } else {
            Utils.log("-- Run Thru completed. No Indicator for JavaScript of a CMP so far.");
        }
    }
}