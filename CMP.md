# Comments

## Adobe

You can opt out [here](https://www.adobe.com/de/privacy/opt-out.html) from Adobe Tracking

## Google Analytics

There is a [Chrome Extensions](https://tools.google.com/dlpage/gaoptout?hl=de) for Disabling Google Analytics.

# CMP in General

## Lists

[CMP List](https://cmplist.consensu.org/cmp-list.json)
[Vendor List](https://vendorlist.consensu.org/vendorlist.json)

## Specifications

[CMP 2.0](
https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20CMP%20API%20v2.md)

[CMP 1.1](
https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/CMP%20JS%20API%20v1.1%20Final.md#consent-management-provider-javascript-api-v11-transparency--consent-framework)


Quick Check für JavaScript Integration
```
this.__cmp("ping", 2, function(pingResult, success){alert(JSON.stringify(pingResult));});
```

# [traffective](https://traffective.com/cmp/)

## Variant with Div Overlay with several buttons

- Looking for div "gdpr_popup_popup"
- There are multiple checkboxes "gdpr_switch_native" => uncheck all. 
- div class "cell" clicken. 

- if there is already a button gdpr_opener_button -> press this. 
- class="gdpr_button_button gdpr_details_back -> press this.
- then start from top. 

## Examples

- [MactechNews](https://www.mactechnews.de/)

# [usercentrics](https://www.usercentrics.eu/)

## Variant with Links with '#'

All page which is usercentrics inlcude the [Main](https://app.usercentrics.eu/latest/main.js) or [Bundle](https://app.usercentrics.eu/latest/bundle.js) - please validate this!

The Issue with this integration is, that we can not click Links with a ```<a href="#">Button</a>```. JQuery can not trigger
a click Event on this button. Also using the DOM method ```click()````` on the Object is an issue, as this causes to page
to relead and therefore end up in an endless loop of loading. 

So what we do, is inject a button which contains a javascript and then press this button from the outside. Hacky, but works. 


## Examples



# [Trustarc](https://www.trustarc.com) aka TrustArcIFrame

## Variant 1 iFrame 

### Version v1.7 (Release up from 220)

TrustArcIFrame integrates a JavaScript on the Page as well as an iFrame. The [iFrame](https://consent-pref.trustarc.com/?type=forbes&site=forbes.com&action=notice&country=de&locale=de&behavior=expressed&layout=default_eu&from=https://consent.trustarc.com/) holds the UI for the interaction with the 
customer. The WebSite (JavaScript [notice.js](https://consent.trustarc.com/asset/notice.js/v/v1.7-220)) uses Message passing
via ```iframe.postMessage()``` to send and ```window.addEventListener()``` to receive information from the iFrame. 

For the initialization, ```notice.js``` calls ```this.truste.eu.init()``` and create the cookie storage. After the iFrame
is fully loaded, the webseite receive a message ```cm_loading``` the iFrame has finished loading. Now it is our turn. 

We inject a JavaScript bound to a button creating the following sequence of Events

```javascript
// sets the amount of cookies we want to have. 0 = function, 0,1 = function and performance, 0,1,2 = funct, perf + marketing. 
this.truste.eu.actmessage({"source":"preference_manager", "message":"submit_preferences", "data":"0"});
// sending the data to the backend and storing all information in a cookie in order not to have the popup come again. 
this.truste.eu.actmessage({"source":"preference_manager", "message":"send_tracker_list", "data":{"Required Cookies":{"value":"0", "domains":{"forbes.com":"2", "www.forbes.com":"2"}}, "Functional Cookies":{"value":"1", "domains":{"accounts.bizzabo.com":"0", "bizzabo.com":"0", "realtime.bizzabo.com":"0", "ceros.com":"0", "view.ceros.com":"0", "documentcloud.org":"0", "www.documentcloud.org":"0", "dwcdn.net":"0", "dropboxusercontent.com":"0", "cdn.embedly.com":"0", "embedly.com":"0", "live.forbes.com":"0", "google.com":"0", "e.infogram.com":"0", "infogram.com":"0", "jifo.co":"0", "instana.io":"0", "nr-data.net":"0", "omny.fm":"0", "go.pardot.com":"0", "pardot.com":"0", "pi.pardot.com":"0", "podcastone.com":"0", "az1.qualtrics.com":"0", "forbesbi.az1.qualtrics.com":"0", "qualtrics.com":"0", "siteintercept.qualtrics.com":"0", "scorecardresearch.com":"0", "speechkit.io":"0", "spkt.io":"0", "spotify.com":"0", "consent-pref.trustarc.com":"0", "prefmgr-cookie.truste-svc.net":"0", "cdn.syndication.twimg.com":"0", "verse.com":"0", "www.verse.com":"0", "vimeo.com":"0"}}, "Advertising Cookies":{"value":"2", "domains":{"aaxads.com":"0", "addtoany.com":"0", "rss.art19.com":"0", "action.media6degrees.com":"0", "facebook.com":"0", "www.facebook.com":"0", "dialog.filepicker.io":"0", "www.filepicker.io":"0", "forbes8.forbes.com":"0", "learn.forbes.com":"0", "doubleclick.net":"0", "youtube.com":"0", "www.indeed.com":"0", "ads.linkedin.com":"0", "linkedin.com":"0", "www.linkedin.com":"0", "app-ab13.marketo.com":"0", "media.net":"0", "mathtag.com":"0", "gw.oribi.io":"0", "pingdom.net":"0", "m.stripe.com":"0", "twitter.com":"0", "walls.io":"0", "yahoo.com":"0", "ziprecruiter.com":"0"}}, "version":"1"}});
// Automatically closes the Windows; Calls prefclose() and also call _dispatch Event "Close"
this.truste.eu.prefclosebutton();
```

## Sample Pages

- [Forbes](https://www.forbes.com)
- [twilio](https://www.twilio.com/)
- [wacom](https://www.wacom.com/de-de)
- [F5](https://f5.com/)
- [Docker](https://www.docker.com)
- [iRobot](https://www.irobot.de/)
- [IBM](https://newsroom.ibm.com/)

### Other functions in the notice.js

#### Versions

- this.truste.cma.version => Version 1.7
- this.truste.eu.version => Version 1.7-1
- this.truste.eu.bindMap: holds all relevant information on the notice script including version etc. 

# Varinate 2 - Decline only

Look for #truste-consent-required, press and all good. 

Und dann nochmal auf #gwt-debug-close_id clicken, falls erforderlich.  

### Sample Pages


---

# [OneTrust](https://www.onetrust.com/) - Product Name 'Optanon', Host: cookielaw.org

## Variant 1 (3 checkboxes, which are unchecked)

[JavaScript](https://cdn.cookielaw.org/consent/576b8520-2cc6-4e55-b8a5-1259ebe5cc15.js) can be found here.

- Look for Checkboxes
- Uncheck all checkboxes.
- Save

## Sample Pages

- [CookieLaw](https://www.cookielaw.org/)

## Variant 2 (Multiple Tabs in a <li>)

[JavaScript](https://cdn.cookielaw.org/scripttemplates/5.9.0/otBannerSdk.js) con be found here.

- Look for li.menu-item-on
- Look for checkbox
- Uncheck all checkboxes.
- Save. 

## Sample Pages

- [Mena](https://www.mona.nl/)
- [Allianz](https://www.allianz.de/)
- [Springer](https://www.springer.com/gp)
- [haglofs](https://www.haglofs.com/de/de-de/)
- [ARS Technica](https://arstechnica.com/)

# [Evidon](https://www.evidon.com/) from CrownPark => broken

## Sample Pages

- [RSA](http://www.rsa.com/) => Implementierung Broken, auch auf der Evidon Seite selbst auch. Später nochmal probieren.
- [Crownpark](https://www.crownpeak.com/)
- [Telegraph](https://www.telegraph.co.uk/)

# [Nymity](https://www.nymity.com/) as aquired by Trustarc

## Sample Pages
- No Pages yet


# [ConsentManager](https://www.consentmanager.net/)

## Sample Pages


### V1
- https://www.getraenkewelt.de/
- https://www.goslarsche.de/

### V2
- https://www.monsterzeug.de/
- https://hyscore.io/ (links unten)

# [Cookiebot](https://www.cookiebot.com/de/)


## SamplePages
- [SAI Global](https://www.saiglobal.com/) => Bad Example  as there is no Deny

## V1 directly select cookies in banner and save

## SamplePages

- [Cookiebot](https://www.cookiebot.com/de/)
- [Gitlab](https://www.gitlab.com/)
- [applause](https://www.applause.com/)

## v2 you can deny all right on the banner

- [Possible Now](https://www.possiblenow.com/)

# [OIL](https://www.oiljs.org/) by Springer

## Sample Pages
- [Welt](https://www.welt.de/) => broken

# [EZ CMP](https://www.ezoic.com/)

This [JavaScript](https://www.idownloadblog.com/cmp/cmp.js) is installed locally on the website. Contains various information
to consensu.org.

## Sample Pages
- [iDownlaodPages](https://www.idownloadblog.com/)
-  [Conversant](https://www.conversantmedia.eu/de/)
- [JavaScript](https://cdn.conversant.mgr.consensu.org/gdpr/cmp/2.6.6/gdpr-cmp-ui.js) is also already loaded via consensu.org

## Sample Pages
- [Inc.com](https://www.inc.com/)

# QuantCast
- [Quantcast](https://www.quantcast.com/)
- [programiz](https://www.programiz.com/)
- [Doodle](https://www.doodle.com)
- [Quantcast](https://www.pronews.gr)
- [Imgur](https://imgur.com/)


# [SoloCMP](https://www.solocpm.com)

- [FarFetch](https://www.farfetch.com)

# Chandago


# Oath

- [tomshardware](https://www.tomshardware.com)
- [techradar](https://global.techradar.com/de-de)

# SourcePoint

- [stornowaygazette](https://www.stornowaygazette.co.uk/)
- [thetimes](https://www.thetimes.co.uk/)
- [duden](https://www.duden.de)


# Factor.io
- [LeMonde](https://www.lemonde.fr/)

# Uncovered CMPs

# Other pages covered

- [NPM](https://www.npmjs.com/)
- [Tealium](https://tealium.com/) - There is more to do here.

# Misc

- [ARD](https://www.ard.de/) - There are not cookies
- [Spiegel](https://www.spiegel.de) - There are cookies, but no Banner => Watch!


