const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const { getPages } = require('../enrty');
const { resolve } = require('../util');

module.exports = {
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
    }),
    new OptimizeCssAssetsWebpackPlugin()
  ]
};
