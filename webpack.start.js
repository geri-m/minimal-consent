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
            },
            {from: './src/manifest.dev.json', to: './manifest.json'},
            {from: './src/images/', to: './images/'},
            {from: './src/js/popup/popup.html', to: './popup/'},
            {from: './src/js/options/options.html', to: './options/'},
            {from: './src/test/test-page/integration.html', to: './test/test-page/integration.html'},
            {from: './src/_locales/', to: './_locales/'}])
    ],
    /* This is how the test Page will be available on the page */
    entry: {
        './test/tests/integration/history.spec': './src/test/tests/integration/history.spec.ts',
    }
});
