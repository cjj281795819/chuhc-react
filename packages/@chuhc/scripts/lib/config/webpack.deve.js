const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('../util/merge');
const { getPages } = require('../enrty');
const { resolve } = require('../util');

module.exports = merge({
  mode: 'development',
  output: {
    filename: '[name].js',
    path: resolve('dist')
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    ...getPages(false),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  devServer: {
    contentBase: resolve('dist'),
    compress: true,
    port: 9999,
    stats: 'errors-only',
    hot: true
  }
});
