/**
 * Download Management
 */
const path = require('path');
const { execSync } = require('child_process');
const { hasYarn, hasCnpm } = require('./util/env');

const PM_CONFIG = {
  npm: {
    install: ['install', '--loglevel', 'error'],
    remove: ['uninstall', '--loglevel', 'error'],
  },
  yarn: {
    install: [],
    remove: ['remove'],
  },
};
PM_CONFIG.cnpm = PM_CONFIG.npm;

module.exports = class PackageManager {
  constructor({ pkgName }) {
    this.pkgName = pkgName;

    if (hasYarn()) {
      this.bin = 'yarn';
    } else if (hasCnpm()) {
      this.bin = 'cnpm';
    } else {
      this.bin = 'npm';
    }
  }

  cdPath() {
    const aimPath = path.join(process.cwd(), this.pkgName);

    process.chdir(aimPath);
  }

  runCommand(command, args = []) {
    const _commands = [this.bin, ...PM_CONFIG[this.bin][command], ...args];

    execSync(_commands.join(' '), { stdio: [0, 1, 2] });
  }

  install() {
    try {
      this.runCommand('install', ['--offline']);
    } catch (e) {
      this.runCommand('install');
    }
  }

  git() {
    try {
      execSync('git init');
      return true;
    } catch (e) {
      return false;
    }
  }
};
