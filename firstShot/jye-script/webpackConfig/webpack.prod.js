const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const base = require('./webpack.base');
const { merge } = require('webpack-merge');
const { resolve, getPages } = require('../util');

module.exports = merge(base, {
  mode: 'production',
  output: {
    filename: '[name]-[contentHash:5].js',
    path: resolve('dist'),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        libs: {
          test: /node_modules/, // 我们对依赖进行分包处理
          chunks: 'initial',
          name: 'libs',
        },
      },
    },
  },
  plugins: [
    ...getPages(true),
    new MiniCssExtractPlugin({
      filename: '[name]-[contentHash:5].css',
    }),
  ],
});
