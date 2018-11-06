const path = require('path');
const autoprefixer = require('autoprefixer');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'inline-source-map',
    entry: [
        'babel-polyfill',
        path.resolve(__dirname, 'src', 'index.tsx'),
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
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        plugins: [
            new ModuleScopePlugin(
                path.resolve(__dirname, 'src'),
                [path.resolve(__dirname, 'package.json')]
            )
        ],
    },
    devServer: {
        proxy: [{
            path: '/jwt',
            target: 'http://localhost:8090'
        }, {
            path: '/public',
            target: 'http://localhost:8090'
        }, {
            path: '/ceph',
            target: 'http://localhost:8090'
        }, {
            path: '/sound',
            target: 'http://localhost:8090'
        }, {
            path: '/geticons',
            target: 'http://localhost:8090'
        }, {
            path: '/api',
            target: 'http://localhost:8090'
        }],
        historyApiFallback: {
            index: '/public/index.html'
        },
        clientLogLevel: "error"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: path.join(__dirname, 'src'),
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    transpileOnly: true
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
            '__DEV__': true,
            'process.env.NODE_ENV': JSON.stringify('development'),
            'window.__UNITE__.chat.proxy': JSON.stringify(""),
            'window.__UNITE__.chat.socketUrl': JSON.stringify(process.env.SOCKET_URL)
        }),
        new HtmlWebpackPlugin({
            title: 'Preact Chat',
            template: './template/index.html'
        })
    ],
};
