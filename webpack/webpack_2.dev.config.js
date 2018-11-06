const path = require('path');
const autoprefixer = require('autoprefixer');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { CEPH_SPRITE_URL } = process.env;

module.exports = {
    devtool: 'inline-source-map',
    entry: [
        'babel-polyfill',
        path.resolve(__dirname, 'src', 'index.js'),
        path.resolve(__dirname, 'src', 'index.less')
    ],
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/public/'
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'src'),
            'node_modules'
        ],
        extensions: ['.js', '.jsx'],
        plugins: [
            new ModuleScopePlugin(
                path.resolve(__dirname, 'src'),
                [path.resolve(__dirname, 'package.json')]
            )
        ],
    },
    devServer: {
        port: 5000,
        proxy: [{
            path: '/cvm/ceph/sprite.svg',
            target: CEPH_SPRITE_URL,
            ignorePath: true,
            changeOrigin: true
        }, {
            path: '/ceph',
            target: 'https://ceph.megafon.ru',
            pathRewrite: { '^/ceph': '' },
            changeOrigin: true
        }, {
            path: '/cvm/**',
            target: 'http://localhost:3000',
            pathRewrite: { '^/cvm': '' }
        }],
        historyApiFallback: {
            index: '/public/index.html'
        },
        clientLogLevel: 'error'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        'plugins': [
                            'transform-runtime',
                            'transform-decorators-legacy',
                            'transform-object-rest-spread',
                            'transform-class-properties',
                            'add-module-exports',
                            'react-hot-loader/babel'
                        ],
                        'presets': [
                            ['env', {
                                'targets': {
                                    'browsers': ['last 2 versions', 'ie >= 11']
                                },
                                'useBuiltIns': true
                            }],
                            'react'
                        ],
                        cacheDirectory: true
                    }
                }
            },
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                autoprefixer({
                                    browsers: ['last 4 versions'],
                                    flexbox: 'no-2009'
                                })
                            ]
                        }
                    },
                    { loader: 'less-loader' }
                ]
            },
            {
                test: /\.(png|jpg|svg)$/,
                use: [
                    {
                        loader: 'file-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        new HtmlWebpackPlugin({
            template: './template/index.html'
        })
    ],
};
