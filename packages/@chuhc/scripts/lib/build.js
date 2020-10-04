/**
 * webpack build
 */
const webpack = require('webpack');
const prodConfig = require('./config/webpack.prod');
const logSymbols = require('log-symbols');

module.exports = () => {
  const compiler = webpack(prodConfig);

  compiler.run((err, stats) => {
    if (err) {
      // 回调中接收错误信息。
      console.error(err);
    } else {
      console.log(logSymbols.success, '打包成功！');
    }
  });
};
