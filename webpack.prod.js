const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const parentWebPack = require('./webpack.common.js');
const JavaScriptObfuscator = require('webpack-obfuscator');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(parentWebPack, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new CopyWebpackPlugin([
            {from: './src/manifest.prod.json', to: './manifest.json'},
            {from: './src/images/', to: './images/'},
            {from: './src/popup/', to: './popup/'}]),
        new JavaScriptObfuscator({rotateUnicodeArray: true})
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                sourceMap: false, // We don't use Source Maps in Production
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                },
            }),
        ],
    },
});
