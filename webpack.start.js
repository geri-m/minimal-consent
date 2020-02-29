const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackExtensionReloaderPlugin = require('webpack-extension-reloader');
const merge = require('webpack-merge');
const parentWebPack = require('./webpack.common.js');

module.exports = merge(parentWebPack, {
    mode: 'development',
    node: {fs: 'empty'},
    target: 'web',
    devtool: 'inline-source-map',
    plugins: [
        /***********************************************************************/
        /* By default the plugin will work only when NODE_ENV is "development" */
        /***********************************************************************/
        new WebpackExtensionReloaderPlugin({
            entries: {
                contentScript: 'contentscript',
                background: 'background'
            }
        }),

        new CopyWebpackPlugin([
            /* This is required for Integration Testing */
            {
                from: './node_modules/jasmine-core/lib/jasmine-core/*.*',
                to: './test/jasmine-core/',
                flatten: true,
            },/*
            {
                from: './node_modules/webextension-polyfill/dist/browser-polyfill.js',
                to: './lib/',
                flatten: true,
                transform: function (content, path) {
                    return content.toString().replace('//# sourceMappingURL=browser-polyfill.js.map', '')
                }
            },*/

            // "webextension-polyfill": "^0.6.0",

            {from: './src/manifest.dev.json', to: './manifest.json'},
            {from: './src/images/', to: './images/'},
            {from: './src/js/popup/', to: './popup/'},
            {from: './src/js/options/', to: './options/'},
            {from: './src/test/', to: './test/'},
            {from: './src/_locales/', to: './_locales/'}])
    ],
    /* This is how the test Page will be available on the page */
    entry: {
        /* './src/test/tests/unit/all.spec': './test/tests/unit/all.spec.js', */
        './test/tests/integration/all.spec': './src/test/tests/integration/all.spec.js',
    }
});
