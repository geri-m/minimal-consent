const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const parentWebPack = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(parentWebPack, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new CopyWebpackPlugin([
            {from: './src/manifest.prod.json', to: './manifest.json'},
            {from: './src/images/', to: './images/'},
            {from: './src/js/popup/popup.html', to: './popup/'},
            {from: './src/js/options/options.html', to: './options/'},
            {from: './src/_locales/', to: './_locales/'}])
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
