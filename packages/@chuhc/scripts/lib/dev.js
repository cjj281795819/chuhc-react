/**
 * scripts dev
 */
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { getDeveConfig } = require('./config');

module.exports = () => {
  const DEVE_CONFIG = getDeveConfig();
  const { devServer } = DEVE_CONFIG;
  const compiler = webpack(DEVE_CONFIG);
  const server = new WebpackDevServer(compiler, { ...devServer });
  server.listen(devServer.port);
};
