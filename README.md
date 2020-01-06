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

- Looking for div "gdpr_popup_popup"
- There are multiple checkboxes "gdpr_switch_native" => uncheck all. 
- div class "cell" clicken. 

- if there is already a button gdpr_opener_button -> press this. 
- class="gdpr_button_button gdpr_details_back -> press this.
- then start from top. 

## Examples

- https://www.mactechnews.de/forum/discussion/10-11-El-Capitan-Installation-schliesst-nicht-ab--324458.html
- https://traffective.com/cmp/

# UserCentry

<script type="application/javascript" src="https://app.usercentrics.eu/latest/main.js" id="uVkVWS92E"></script><script type="text/javascript" async="" src="https://app.usercentrics.eu/latest/bundle.js"></script>

# List of various data management platforms.