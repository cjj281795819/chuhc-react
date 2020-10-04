const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('../util/merge');
const { getPages } = require('../enrty');
const { resolve } = require('../util');

module.exports = merge({
  mode: 'production',
  output: {
    filename: '[name]-[contentHash:5].js',
    path: resolve('dist')
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        libs: {
          test: /node_modules/, // 我们对依赖进行分包处理
          chunks: 'initial',
          name: 'libs'
        }
      }
    }
  },
  plugins: [
    ...getPages(true),
    new MiniCssExtractPlugin({
      filename: '[name]-[contentHash:5].css'
    })
  ]
});
