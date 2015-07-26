var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './lib/thermite.jsx',
  output: {
    path: './dist',
    publicPath: '/dist/',
    filename: 'thermite.js',
  },
  module: {
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
