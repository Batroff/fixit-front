const path = require('path');
const webpack = require('webpack');
const {argv} = require('yargs');

const isDev = argv.mode === 'dev';

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: isDev ? 'development' : 'production',

  entry: {
    common: ['@babel/polyfill', './js/common.js'],
    index: './js/',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist'
  },

  plugins: [
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery'
    }),
  ],

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve("babel-loader"),
          // query: {
          //   presets: ['@babel/preset-env', { modules: false }]
          // }
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}