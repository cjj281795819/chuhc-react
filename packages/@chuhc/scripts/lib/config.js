/**
 * webpack config
 */
const Config = require('webpack-chain');
const jyeConfig = require(`${process.cwd()}/jye.config.js`);

const config = new Config();

const handleJyeConfig = ({ plugins }) => {
  if (plugins) {
    plugins.forEach(plugin => {
      require(plugin[0])(config);
    });
  }
};

handleJyeConfig(jyeConfig);

module.exports = config.toConfig();
