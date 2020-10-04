/**
 * environment
 */
const { execSync } = require('child_process');

let _env = {
  _hasYarn: null,
  _hasCnpm: null
};

/**
 * judge env
 */
const judgeEnv = name => {
  const envKey = `_has${name[0].toUpperCase()}${name.slice(1)}`;

  if (_env[envKey] !== null) {
    return _env[envKey];
  }

  try {
    execSync(`${name} --version`, { stdio: 'ignore' });

    return (_env[envKey] = true);
  } catch (e) {
    return (_env[envKey] = false);
  }
};

const hasYarn = judgeEnv.bind(this, 'yarn');

const hasCnpm = judgeEnv.bind(this, 'cnpm');

module.exports = {
  hasYarn,
  hasCnpm
};
