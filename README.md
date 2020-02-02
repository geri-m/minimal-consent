# Chrome Extension and FireFox AddOn for Minimal Consent on Websites. 

## Development Setup

This extension requires `webpack` for bundling/minifing/obfuscating and debugging. 

Dependency management is done using `yarn` as it is a package manager for JavaScript/Node. 

### Requirements

We run builds on OSX 10.15.2
We currently use Yarn 1.21.1 (latest 1.x Build)
We use npm version 6.13.7  (latest)
We use node version 13.7.0 (latest)
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

## Commands to User

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

## Development 

For Development you would only use `yarn start`.

If you make changes to `manifest.json` or `webpack.js` please restart as these files are not covered during hot deploy.

Source code and images are located in `./src/`.

## Running the extension in chrome

1) Open Chrome on your computer
2) Enter `chrome://extensions/` in the address bar
3) On the top right, there is a switch "Developer Mode". Turn it on
4) Choose "Load unpacked"
5) Point the file finder to `./dist/` directory.

