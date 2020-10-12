/**
 * webpack config
 */
const { merge } = require('webpack-merge');
const Config = require('webpack-chain');
const chuhcConfig = require(`${process.cwd()}/chuhc.config.js`);
const { setBaseConfig } = require('./util/merge');
const BASE = require('./config/webpack.base');
const DEVE = merge(BASE, require('./config/webpack.deve'));
const PROD = merge(BASE, require('./config/webpack.prod'));

const config = new Config();

const handleChuhcConfig = ({ plugins } = {}) => {
  if (plugins) {
    plugins.forEach(plugin => {
      require(plugin[0])(config, plugin[1]);
    });
  }
};

const getConfig = isDeve => {
  config.clear();

  setBaseConfig(isDeve ? DEVE : PROD, config);
  handleChuhcConfig(chuhcConfig);

  return merge(config.toConfig(), {
    plugins: isDeve ? DEVE.plugins : PROD.plugins
  });
};

exports.getDeveConfig = () => getConfig(true);

exports.getProdConfig = () => getConfig(false);
