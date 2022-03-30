const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const webpack = require('webpack');

module.exports = env => {
    console.log('env: ', env);
    return merge(common, {
        mode: 'development',
        devtool: 'inline-source-map',
        devServer: {
            inline: true,
            historyApiFallback: true,
            compress: true,
            port: 8080,
            host: '0.0.0.0',
            https: true,
        },
        module: {
            rules: [],
        },
        entry: {
            index: './index.ts',
        },
        output: {
            filename: '[name].[contentHash].js',
            path: __dirname + '/temp',
            publicPath: '/',
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.MODE': JSON.stringify(env.MODE)
            })

        ],
    });    
};
