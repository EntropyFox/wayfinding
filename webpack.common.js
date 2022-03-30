/* Configure HTMLWebpack plugin */
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const HtmlWebpackInjector = require('html-webpack-injector');


const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/index.html',
    filename: 'index.html',
    chunks: ['index']
});

/* Configure Copy */
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CopyWebpackPluginConfig = new CopyWebpackPlugin({
    patterns: [
        { from: 'assets', to: '' }
    ],
});

/* Configure ProgressBar */
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ProgressBarPluginConfig = new ProgressBarPlugin();

/* configure client environment vars */
const webpack = require('webpack');
require('dotenv').config();

/* Export configuration */
module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
            },
            {
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader' },
            },
            {
                test: /\.wasm$/,
                type:
                    "javascript/auto" /** this disables webpacks default handling of wasm */,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "wasm/[name].[hash].[ext]",
                            publicPath: "/dist/"
                        }
                    }
                ]
            },
            {
                test: /\.css$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                ],
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
        ],
    },
    resolve: { extensions: ['.web.ts', '.web.js', '.ts', '.js'] },
    plugins: [
        HTMLWebpackPluginConfig,
        CopyWebpackPluginConfig,
        ProgressBarPluginConfig,
        new webpack.ProvidePlugin({
            process: 'process/browser',
        })
    ],
};
