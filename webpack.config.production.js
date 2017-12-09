const path = require('path');
const webpack = require('webpack');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const buildPath = path.resolve(__dirname, 'build');
const entry = path.resolve(__dirname, 'app', 'index.js');

module.exports = {
  context: __dirname,
  entry: [
    'babel-polyfill',
    entry,
  ],
  output: {
    path: buildPath,
    filename: 'stockIndicatorMappers.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: 'stockIndicatorMappers',
  },
  externals: {
    immutable: {
      commonjs: 'immutable',
      commonjs2: 'immutable',
      amd: 'immutable',
      root: 'Immutable',
    },
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
      root: '_',
    },
    moment: {
      commonjs: 'moment',
      commonjs2: 'moment',
      amd: 'moment',
      root: 'moment',
    },
    ramda: {
      commonjs: 'ramda',
      commonjs2: 'ramda',
      amd: 'ramda',
      root: 'R',
    },
    regression: {
      commonjs: 'regression',
      commonjs2: 'regression',
      amd: 'regression',
      root: 'regression',
    },
  },
  target: 'node',
  resolve: {
    alias: { // can do import Main from Components/Main/; instead of full path
      App: path.resolve(__dirname, 'app'),
      Constants: path.resolve(__dirname, 'app', 'constants'),
      Utils: path.resolve(__dirname, 'app', 'utils'),
      Indicators: path.resolve(__dirname, 'app', 'indicators'),
    },
    extensions: ['.js'],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: ['env', 'stage-1'],
        },
      },
    ],
  },
  plugins: [
    // new UglifyJSPlugin({
    //   sourecMap: true,
    // }),
    new webpack.EnvironmentPlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
};
