/**
 * scripts dev
 */
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const deveConfig = require('./config/webpack.deve');

module.exports = () => {
  const { devServer } = deveConfig;
  const compiler = webpack(deveConfig);
  const server = new WebpackDevServer(compiler, { ...devServer });

  server.listen(devServer.port);
};
