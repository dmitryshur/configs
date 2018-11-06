const path = require('path');
const autoprefixer = require('autoprefixer');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const { CEPH_SPRITE_URL } = process.env;

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: [
        '@babel/polyfill',
        path.resolve(__dirname, 'src', 'index.js'),
        path.resolve(__dirname, 'src', 'index.less')
    ],
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/public/',
        globalObject: "this"
    },
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        extensions: ['.js', '.jsx'],
        plugins: [new ModuleScopePlugin(path.resolve(__dirname, 'src'), [path.resolve(__dirname, 'package.json')])]
    },
    devServer: {
        port: 5000,
        proxy: [
            {
                path: '/cherdak/ceph/sprite.svg',
                target: CEPH_SPRITE_URL,
                ignorePath: true,
                changeOrigin: true
            },
            {
                path: '/ceph',
                target: 'https://ceph.megafon.ru',
                pathRewrite: { '^/ceph': '' },
                changeOrigin: true
            },
            {
                path: '/cherdak/**',
                target: 'http://localhost:3000',
                pathRewrite: { '^/cherdak': '' }
            }
        ],
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
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader' }
            },
            {
                test: /\.(less|css)$/,
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
        new HtmlWebpackPlugin({
            template: './template/index.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};
