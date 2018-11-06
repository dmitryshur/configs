const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackNodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');

const baseConfig = require('./webpack.base.config');

const serverConfig = webpackMerge(baseConfig, {
    devtool: 'inline-source-map',
    externals: [
        webpackNodeExternals({ whitelist: ['webpack/hot/poll?1000'] })
    ],
    module: {
        rules: [
            {
                test: /\.(bmp|gif|jpe?g|png|svgz?|webp)$/,
                loader: 'file-loader',
                options: {
                    outputPath: '/public/'
                }
            }
        ]
    },
    node: {
        __dirname: true,
        __filename: true
    },
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new webpack.DefinePlugin({
            __CLIENT__: false,
            __SERVER__: true
        })
    ],
    target: 'node'
});

const developmentServerConfig = webpackMerge(serverConfig, {
    entry: ['webpack/hot/poll?1000', './src/server/index'],
    plugins: [
        new StartServerPlugin('server.js')
    ],
    watch: true
});

const productionServerConfig = webpackMerge(serverConfig, {
    entry: './src/server/index'
});

module.exports = process.env.NODE_ENV === 'production'
    ? productionServerConfig
    : developmentServerConfig;
