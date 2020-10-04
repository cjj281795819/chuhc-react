/**
 * webpack merge
 */
const { merge } = require('webpack-merge');
const base = require('../config/webpack.base');
const config = require('../config');

module.exports = _config => merge(base, _config, config);
