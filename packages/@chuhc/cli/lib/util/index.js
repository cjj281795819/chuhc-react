/**
 * some fn
 */
const { exec } = require('child_process');
const { hasCnpm } = require('./env');
const chalk = require('chalk');
const validateNpmPackageName = require('validate-npm-package-name');

/**
 * clear screen
 */
const clear = () => {
  process.stdout.write(
    process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H'
  );
};

/**
 * judge package name
 */
const validateName = name => {
  const result = validateNpmPackageName(name);

  if (!result.validForNewPackages) {
    console.log(`Invalid project name: ${chalk.red(name)}`);

    result.warnings &&
      result.warnings.forEach(warn => {
        console.log(chalk.red.dim(`warn: ${warn}`));
      });

    result.errors &&
      result.errors.forEach(err => {
        console.log(chalk.red.dim(`err: ${err}`));
      });

    process.exit(1);
  }
};

/**
 * set package.json npm package
 */
const forEachSetV = (list, obj, key) => {
  const promises = [];
  const manager = hasCnpm() ? 'cnpm' : 'npm';

  list.forEach(item => {
    if (typeof item === 'object') {
      return forEachSetV(item, obj, key);
    }

    const newPromise = new Promise(res => {
      exec(`${manager} view ${item} version`, (err, stdout, stderr) => {
        obj[key][item] = stdout.slice(0, stdout.length - 1);
        res(0);
      });
    });

    promises.push(newPromise);
  });

  return promises;
};

module.exports = {
  clear,
  validateName,
  forEachSetV
};
