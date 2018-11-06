const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const baseConfig = {
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                }
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                }
            }

        ]
    },
    plugins: [
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        })
    ],
    resolve: {
        extensions: ['.js', 'json', '.jsx'],
        modules: [
            path.resolve(__dirname, 'etc'),
            path.resolve(__dirname, 'src'),
            'node_modules'
        ]
    }
};

const baseDevelopmentConfig = webpackMerge(baseConfig, {
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
});

const baseProductionConfig = webpackMerge(baseConfig, {
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: false
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.LoaderOptionsPlugin({
            debug: false,
            minimize: true
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false
                }
            }
        })
    ]
});

module.exports = process.env.NODE_ENV === 'production'
    ? baseProductionConfig
    : baseDevelopmentConfig;
