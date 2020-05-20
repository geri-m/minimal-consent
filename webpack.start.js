const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackExtensionReloaderPlugin = require('webpack-extension-reloader');
const merge = require('webpack-merge');
const parentWebPackDev = require('./webpack.dev.js');

module.exports = merge(parentWebPackDev, {
    plugins: [
        // Auto Start
        new WebpackExtensionReloaderPlugin({
            entries: {
                contentScript: 'contentscript',
                background: 'background'
            }
        })
    ]
});
