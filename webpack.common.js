const path = require('path');

const fileExtensions = ['jpg', 'jpeg', 'png', 'gif', 'eot', 'otf', 'svg', 'ttf', 'woff', 'woff2'];

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
    }
};

if (process.env.NODE_ENV === 'development') {
    options.devtool = 'cheap-module-eval-source-map';
}

module.exports = options;
