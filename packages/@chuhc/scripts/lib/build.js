/**
 * webpack build
 */
const webpack = require('webpack');
const { getProdConfig } = require('./config');
const logSymbols = require('log-symbols');

module.exports = () => {
  const PROD_CONFIG = getProdConfig();
  const compiler = webpack(PROD_CONFIG);

  compiler.run((err, stats) => {
    if (err) {
      // 回调中接收错误信息。
      console.error(err);
    } else {
      console.log(logSymbols.success, '打包成功！');
    }
  });
};
