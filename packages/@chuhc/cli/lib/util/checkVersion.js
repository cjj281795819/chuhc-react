/**
 * version judge
 */
const semver = require('semver');
const inquirer = require('inquirer');
const pkg = require('../../package.json');
const fs = require('fs-extra');
const path = require('path');
const { hasCnpm } = require('./env');
const { execSync } = require('child_process');

const resolve = (_path) => path.join(__dirname, _path);

const timePath = resolve('index.txt');

const MAX_TIME = 86400000;

const MANAGER = hasCnpm() ? 'cnpm' : 'npm';

const checkVersion = (force = false) => {
  const lastTime = +fs.readFileSync(timePath).toString();
  const nowTime = new Date().getTime();

  if (!force && lastTime && nowTime - lastTime <= MAX_TIME) {
    return;
  }

  fs.writeFileSync(timePath, nowTime);

  const lastV = execSync(`${MANAGER} view @chuhc/cli version`, {
    encoding: 'utf8',
  });
  return lastV;
};

const beforeCreate = async () => {
  const lastV = checkVersion() || '1.0.0';

  if (semver.gt(lastV, pkg.version)) {
    const { update } = await inquirer.prompt([
      {
        type: 'list',
        message: `The latest version is ${lastV} do you need to upgrade`,
        name: 'update',
        choices: [
          { name: 'Yes', value: true },
          { name: 'No', value: false },
        ],
      },
    ]);

    update && execSync(`${MANAGER} update @chuhc/cli -g`);
  }

  return;
};

module.exports = {
  checkVersion,
  beforeCreate,
};
