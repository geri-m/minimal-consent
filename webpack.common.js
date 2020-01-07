const path = require('path');
const fileSystem = require('fs');

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
        contentscript: path.join(__dirname, 'src', 'js', 'contentscript.js'),
        background: path.join(__dirname, 'src', 'js', 'background.js')
    },
    output: {
        path: path.join(__dirname, 'dist/'),
        filename: '[name].bundle.js',
        libraryTarget: 'umd'
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
    }
};

if (process.env.NODE_ENV === 'development') {
    options.devtool = 'cheap-module-eval-source-map';
}

module.exports = options;
