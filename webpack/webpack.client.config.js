const os = require('os');
const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const AssetsPlugin = require('assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');

const baseConfig = require('./webpack.base.config');

const clientConfig = webpackMerge(baseConfig, {
    module: {
        rules: [
            {
                test: /\.(bmp|gif|jpe?g|png|svgz?|webp)$/,
                loader: 'file-loader'
            },
            {
                test: /\.less$/,
                use: process.env.NODE_ENV === 'production'
                    ? ExtractTextPlugin.extract({
                        use: ['css-loader', 'postcss-loader', 'less-loader']
                    })
                    : ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
            }
        ]
    },
    output: {
        filename: 'bundle.[chunkhash:8].js',
        path: path.resolve(__dirname, 'public'),
        publicPath: '/public/'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.[chunkhash:8].js',
            minChunks: ({ context }) => context && context.indexOf('node_modules') >= 0
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'babel-polyfill',
            filename: 'babel-polyfill.[chunkhash:8].js',
            minChunks: ({ context }) => {
                return context && (context.indexOf('babel-polyfill') >= 0 ||
                    context.indexOf('core-js') >= 0);
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
            filename: "manifest.[hash].js",
            minChunks: Infinity
        }),
        new webpack.DefinePlugin({
            __CLIENT__: true,
            __SERVER__: false
        }),
        new AssetsPlugin({
            filename: 'assets.json',
            path: path.join(__dirname, 'etc')
        }),
        new CaseSensitivePathsPlugin(),
        new WatchMissingNodeModulesPlugin(path.resolve(__dirname, 'node_modules'))
    ],
    resolve: {
        plugins: [
            new ModuleScopePlugin(
                path.resolve(__dirname, 'src'),
                [path.resolve(__dirname, 'package.json')]
            )
        ]
    },
    target: 'web'
});

if (process.env.npm_config_report) {
    clientConfig.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
}

const developmentClientConfig = webpackMerge(clientConfig, {
    devServer: {
        allowedHosts: [
            '.react-universal-unite.local'
        ],
        historyApiFallback: true,
        host: '0.0.0.0',
        hot: true,
        port: 4000,
        publicPath: '/public/'
    },
    devtool: 'inline-source-map',
    entry: [
        'react-hot-loader/patch',
        `webpack-dev-server/client?http://moscow.${os.hostname()}.local:4000`,
        'webpack/hot/only-dev-server',
        './src/client/index.js'
    ]
});

const productionClientConfig = webpackMerge(clientConfig, {
    devtool: false,
    entry: './src/client/index.js',
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new ExtractTextPlugin({ filename: 'bundle.css' })
    ]
});

module.exports = process.env.NODE_ENV === 'production'
    ? productionClientConfig
    : developmentClientConfig;
