const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const base = require('./webpack.base');
const { merge } = require('webpack-merge');
const { resolve, getPages, devServerAfter } = require('../util');

module.exports = merge(base, {
  mode: 'development',
  output: {
    filename: '[name].js',
    path: resolve('dist'),
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    ...getPages(false),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  devServer: {
    contentBase: resolve('dist'),
    compress: true,
    port: 9999,
    stats: 'errors-only',
    hot: true,
    after: devServerAfter,
  },
});
