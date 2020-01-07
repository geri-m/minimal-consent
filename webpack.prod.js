const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new CopyWebpackPlugin([
            { from:  "./src/manifest.prod.json", to: './manifest.json' },
            { from: './src/images', to: './images' }])
    ]
});