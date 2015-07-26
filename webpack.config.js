var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, 'lib/thermite.jsx'),
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'thermite.js',
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader'),
      },
      {
        test: /\.jsx+$/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
  ],
};
