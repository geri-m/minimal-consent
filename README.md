# Chrome Extension for Minimal Consent on Websites. 

## Development Setup

Dependency management is done using `yarn` as it is a package manager for JavaScript/Node. 

To Install `yarn` use `brew install yarn` on macOS via homebrew. 

To Clean and Build the code

```yarn build```

To Clean and Start Hot Deploy

```yarn start```

## Continuos Integration with Circle CI

https://circleci.com/blog/continuously-deploy-a-chrome-extension/
https://medium.com/slido-dev-blog/chrome-extensions-and-continuous-integration-392206f7e414


## Running the extension

1) Open Chrome on your computer
2) Enter `chrome://extensions/` in the address bar
3) On the top right, there is a switch "Developer Mode". Turn it on
4) Choose "Load unpacked"
5) Point the file finder to `build` directory.

## Econda

- https://www.econda.de/ used arp.privacy.js (Loaded from https://d35ojb8dweouoy.cloudfront.net/plugins/arp.privacy/arp.privacy.js)
- Looking for privacyProtectionBanner
- Unchecking the Checkbox
- Banner will be opened on each new Session. 


# traffective: https://traffective.com/cmp/

## Variant with Div Overlay with several buttons

- Looking for div "gdpr_popup_popup"
- There are multiple checkboxes "gdpr_switch_native" => uncheck all. 
- div class "cell" clicken. 

- if there is already a button gdpr_opener_button -> press this. 
- class="gdpr_button_button gdpr_details_back -> press this.
- then start from top. 

## Examples

[MactechNews](https://www.mactechnews.de/)
[traffective](https://traffective.com/cmp/)

# usercentrics

## Variant with Links with '#'

All page which is usercentrics inlcude the Main(https://app.usercentrics.eu/latest/main.js) or Bundle(https://app.usercentrics.eu/latest/bundle.js) - please validate this!

The Issue with this integration is, that we can not click Links with a ```<a href="#">Button</a>```. JQuery can not trigger
a click Event on this button. Also using the DOM method ```click()````` on the Object is an issue, as this causes to page
to relead and therefore end up in an endless loop of loading. 

So what we do, is inject a button which contains a javascript and then press this button from the outside. Hacky, but works. 


## Examples

[Hirmer](https://www.hirmer.de/)
[Heise](https://www.heise.de/)
[fitnessfirst](https://www.fitnessfirst.come/)
[usercentrics](https://www.usercentrics.de/)

# Truste

## Variante iFrame 

### Version v1.7 (Release up from 220)

Truste integrates a JavaScript on the Page as well as an iFrame. The [iFrame](https://consent-pref.trustarc.com/?type=forbes&site=forbes.com&action=notice&country=de&locale=de&behavior=expressed&layout=default_eu&from=https://consent.trustarc.com/) holds the UI for the interaction with the 
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

#### Sample Pages

[Forbes](https://www.forbes.com)

### Other functions in the notice.js

#### Versions

- this.truste.cma.version => Version 1.7
- this.truste.eu.version => Version 1.7-1
- this.truste.eu.bindMap: holds all relevant information on the notice script including version etc. 

# List of various data management platforms.1
