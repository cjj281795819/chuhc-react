/**
 * some fn
 */
const { execSync } = require('child_process');
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
 * get last version
 */
const getNpmPkgVersion = name => {
  const version = execSync(`npm view ${name} version`).toString();
  return version.slice(0, version.length - 1);
};

/**
 * set package.json npm package
 */
const forEachSetV = (list, obj, key) => {
  list.forEach(item => {
    if (typeof item === 'object') {
      return forEachSetV(item, obj, key);
    }

    const version = getNpmPkgVersion(item);
    obj[key][item] = version;
  });
};

module.exports = {
  clear,
  validateName,
  getNpmPkgVersion,
  forEachSetV
};
