const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const parentWebPack = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const StringReplacePlugin = require('string-replace-webpack-plugin')

module.exports = merge(parentWebPack, {
    mode: 'production',
    plugins: [
        new CopyWebpackPlugin([
            {from: './src/manifest.prod.json', to: './manifest.json'},
            {from: './src/images/', to: './images/'},
            {from: './src/js/popup/popup.html', to: './popup/'},
            {from: './src/js/options/options.html', to: './options/'},
            {from: './src/_locales/', to: './_locales/'}]),
        // an instance of the plugin must be present
        new StringReplacePlugin()
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
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{
                    loader: StringReplacePlugin.replace({
                        replacements: [{
                            pattern: /Logger.log(.+)/g,
                            replacement: function (_match, _p1, _offset, _string) {
                                console.log("Replace happend");
                                return "";
                            }
                        }]
                    })
                }]
            }
        ]
    }
});
