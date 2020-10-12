const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { getPages } = require('../enrty');
const { resolve, devServerAfter } = require('../util');

module.exports = {
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
    hot: true,
    after: devServerAfter
  }
};
