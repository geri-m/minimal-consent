const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackExtensionReloaderPlugin = require('webpack-extension-reloader');
const merge = require('webpack-merge');
const parentWebPack = require('./webpack.common.js');

module.exports = merge(parentWebPack, {
    mode: 'development',
    // FIX: Module not found: Error: Can't resolve 'fs'
    node: {fs: 'empty'},
    // ATTENTION: If we change this, the integration pages are not shown any more
    devtool: 'inline-source-map',
    plugins: [
        // Auto Start
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
            {from: './src/test/', to: './test/'},
            {from: './src/_locales/', to: './_locales/'}])
    ],
    /* This is how the test Page will be available on the page */
    entry: {
        './test/tests/integration/history.spec': './src/test/tests/integration/history.spec.ts',
        './test/tests/integration/deviceId.spec': './src/test/tests/integration/deviceId.spec.ts',
    }
});
