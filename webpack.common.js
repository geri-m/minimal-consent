const path = require('path');

const options = {

    mode: process.env.NODE_ENV || 'development',
    entry: {
        "./contentscript": path.join(__dirname, './src/js/contentscript.ts'),
        "./background": path.join(__dirname, './src/js/background.ts'),
        './popup/popup': './src/js/popup/popup.ts',
        './options/options': './src/js/options/options.ts'
    },
    output: {
        path: path.join(__dirname, 'dist/'),
        filename: '[name].js',
        libraryTarget: 'umd',
        sourceMapFilename: '[name].js.map'
    },
    module: {
        rules: [
            // TypeScript Loader
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    }
};

module.exports = options;
