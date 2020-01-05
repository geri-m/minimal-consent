const path = require('path');
const fileSystem = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Code:    https://github.com/rubenspgcavalcante/webpack-extension-reloader
const WebpackExtensionReloaderPlugin = require('webpack-extension-reloader');


// load the secrets
const alias = {};

const secretsPath = path.join(__dirname, ('secrets.' + process.env.NODE_ENV + '.js'));

const fileExtensions = ['jpg', 'jpeg', 'png', 'gif', 'eot', 'otf', 'svg', 'ttf', 'woff', 'woff2'];

if (fileSystem.existsSync(secretsPath)) {
    alias.secrets = secretsPath;
}

const options = {
    mode: process.env.NODE_ENV || 'development',
    entry: {
        min_consent: path.join(__dirname, 'src', 'js', 'min_consent.js')
    },
    output: {
        path: path.join(__dirname, 'dist/'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
                exclude: /node_modules/
            },
            {
                test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
                loader: 'file-loader?name=[name].[ext]',
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        alias: alias
    },
    plugins: [
        /***********************************************************************/
        /* By default the plugin will work only when NODE_ENV is "development" */
        /***********************************************************************/
        new WebpackExtensionReloaderPlugin(),

        // clean the build folder
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            {from: './src/manifest.json'},
            {from: './src/libs', to: './libs'},
            {from: './src/images', to: './images'}
            ]),
    ]
};

if (process.env.NODE_ENV === 'development') {
    options.devtool = 'cheap-module-eval-source-map';
}

module.exports = options;
