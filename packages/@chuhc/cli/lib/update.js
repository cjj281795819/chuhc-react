/**
 * check update
 */
const semver = require('semver');
const pkg = require('../package.json');
const catchFn = require('./util/catchFn');
const { checkVersion } = require('./util/checkVersion');
const { hasCnpm } = require('./util/env');
const { execSync } = require('child_process');

const MANAGER = hasCnpm() ? 'cnpm' : 'npm';

const getNewVersion = () => {
  const lastV = checkVersion(true);

  if (semver.gt(lastV, pkg.version)) {
    console.log('ready to upgrade');
    execSync(`${MANAGER} update @chuhc/cli -g`);
  } else {
    console.log(`This is the latest version of ${pkg.version}`);
  }
};

module.exports = (...args) => catchFn(getNewVersion, ...args);
