const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = env => {
    console.log('env: ', env);
    return merge(common, {
        mode: 'production',
        devtool: 'source-map',
        entry: {
            index: './index.ts',
        },
        optimization: {
            minimizer: [
                new TerserPlugin(),
            ],
        },
        output: {
            filename: '[name].[contenthash].js',
            path: __dirname + '/dist',
        },
        plugins: [
            new CleanWebpackPlugin(),
            new webpack.DefinePlugin({
                'process.env.MODE': JSON.stringify(env.MODE)
            })],
    });

}
