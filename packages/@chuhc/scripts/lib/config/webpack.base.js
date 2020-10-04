const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { getEntries } = require('../enrty');

module.exports = {
  entry: getEntries(),
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            compact: true
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(jpg|png|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              name: 'img/[name].[hash:7].[ext]',
              esModule: false
            }
          }
        ]
      }
    ]
  },
  plugins: [new CleanWebpackPlugin()]
};
