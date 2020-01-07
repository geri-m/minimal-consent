const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackExtensionReloaderPlugin = require('webpack-extension-reloader');
const merge = require('webpack-merge');
const parentWebPack = require('./webpack.common.js');

module.exports = merge(parentWebPack, {
    mode: 'development',
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
            { from: './src/manifest.dev.json', to: './manifest.json' },
            { from: './src/images/dev', to: './images' }])
    ]
});
