const path = require('path');
const autoprefixer = require('autoprefixer');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const webpack = require('webpack');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const extractLess = new ExtractTextPlugin({
    filename: 'bundle.css',
    allChunks: true
});


module.exports = {
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, 'src', 'index.js'),
    path.resolve(__dirname, 'src', 'index.less')
  ],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/cvm/'
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
            use: extractLess.extract({
                use: [
                    { loader: 'css-loader',
                        options: {
                            minimize: true
                        }
                    },
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
            })
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
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new WatchMissingNodeModulesPlugin(path.resolve(__dirname, 'node_modules')),
        new CaseSensitivePathsPlugin(),
        extractLess,
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false
                }
            }
        }),
        process.env.ANALYZE ? new BundleAnalyzerPlugin({ analyzerMode: 'static' }) : () => {},
        new HtmlWebpackPlugin({
            template: './template/index.html'
        })
    ]
};
