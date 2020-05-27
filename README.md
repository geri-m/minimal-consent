# Chrome Extension, Opera, FireFox, Safari and Microsoft Edge AddOn form Minimal Consent


## Extension Description for Publishing

The extension blocks various Consent Management Platforms (CMP) asking the user for consent to drop 
cookies or for tracking purpose. The extension in the current version blocks already 10 CMPs such as Quantcast, 
OneTrust or UserCentrics.

How to Test
1) Load Extension
2) Open a Webpage with a CMP (eg: https://www.quancast.com)
3) CMP will be managed and the Icon with switch to green for 3 seconds. 

## Development Setup

This extension requires `webpack` for bundling/minifing/obfuscating and debugging. 

Dependency management is done using `yarn` as it is a package manager for JavaScript/Node. 

The extensions is written in TypeScript.

Unit tests base on Karma and Jasmine and can be u

### Requirements

We run builds on OSX 10.15.5
We currently use Yarn 1.22.4 (latest 1.x Build)
We use npm version 6.14.4  (latest)
We use node version 14.1.0 (latest)
We use zip 3.0 to create the package for upload

### Setup on OSX 

To install `yarn` use `brew install yarn` on macOS terminal to install via homebrew. You can also download the package
manager manually from the [website](https://yarnpkg.com/)

To install `node` use `brew install node` on macOS terminal to install via homebrew. You can also download the package
manually from the [website](https://nodejs.org/en/download/)

To install `npm` download the package manually from the [website](https://nodejs.org/en/download/). To upgrade to the
latest version use `npm install npm@latest -g`.

In order to install all required dependencies for the project run `yarn install`. It will download all libraries stated
in `package.json` and store them locally in `./node_modules`.

## Commands to Use


To install all dependencies for the build via yarn, pls delete all lock files `rm *.lock` and run `yarn install` to down
load the node modules.

To run Units test, there is a setup with Karma and Jasmine: `yarn test`. Integration Tests base on Jasmine and are
run directly in the Browser. (requires Chrome)

To Clean and Build the code for production: `yarn build`
- `./dist/` Folder is removed.
- JavaScript Source is bundled and minified in new `./dist/` folder.
- Logging is removed
- `./minimal-consent-prod.zip` with all required sources is created.

To Clean and Build the code for development: `yarn build-dev`
- `./dist/` Folder is removed.
- JavaScript Source is bundled and minified in new `./dist/` folder.
- `./minimal-consent-dev.zip` with all required sources is created.

To Clean and Start Hot Deploy for the browser: `yarn start`
- `./dist/` Folder is removed.
- JavaScript Source is bundle and minified in new `./dist/` folder.
- WebpackExtensionReloaderPlugin Plugin is started for Hot Deploy.

To create a Source Code Bundle for Review at Firefox use: `yarn source-zip`
- Create a ZIP with package.json, webpack-files, Licence File and Source Code in `./src/`

The JavaScript is minified using `terser-webpack-plugin`.

## Development 

For Development you would only use `yarn start`.

If you make changes to `manifest.json` or `webpack.js` please restart as these files are not covered during hot deploy.

Source code and images are located in `./src/`.

After installation in the browser the pages for testing will open automatically. This functionally is triggered from
the backend script.

## Permission

The extension requires the following permissions

- *https://\*.cloudfunctions.net/:* This is the URL we successful blocks of Consent Banners are stored. Also see data 
protection regulation. 
- Storage: We are already storing all blocked Consent Banners also in local storage, so the user can see, what we block.
- Tabs: Required to get the URL of the current site, as we are logging this information in case the block of the consent
was successful.
- ActiveTabs: 

## Running the extension in chrome

1) Open Chrome on your computer
2) Enter `chrome://extensions/` in the address bar
3) On the top right, there is a switch "Developer Mode". Turn it on
4) Choose "Load unpacked"
5) Point the file finder to `./dist/` directory.

# History

## Version 1.0.8

- Further Improvement of Performance
- Integration of First Affiliate Notwork Conversion Junction
- Separation of Imports to decrease File Size of Backend Script

## Version 1.0.7

- Add Russian Translation.
- Performance Improvements (Fix Config on Observer)
- Safari Integration
- Fix Build for Application Distribution (Firefox, Opera)

## Version 1.0.6

- Update for OneTrust

## Version 1.0.5

- Limit Backend Calls in Permissions to `https://europe-west1-minimal-consent-chrome-ext.cloudfunctions.net/`

## Version 1.0.4

- Remove Active Tabs Permission
- Update Dependencies

## Version 1.0.3

- Remove Obfuscation
- Adding DiDoMi
- Adding Version and Device UUID to each call.