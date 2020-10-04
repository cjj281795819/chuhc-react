/**
 * create project
 */
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const catchFn = require('./util/catchFn');
const PackageManager = require('./PackageManager');
const writeFileTree = require('./util/writeFileTree');
const { clear, validateName, forEachSetV } = require('./util');

const JYE_PLUGIN_CHECK = [
  {
    name: 'Typescript',
    value: ['@jye/typescript-plugin', '@types/react', '@types/react-dom']
  }
];

async function create(pkgName) {
  validateName(pkgName);

  const cwd = process.cwd();
  const targetDir = path.join(cwd, pkgName);

  if (fs.existsSync(targetDir)) {
    clear();

    const answer = await inquirer.prompt([
      {
        type: 'list',
        message: `Target directory already exists. Can I overwrite it`,
        name: 'lang',
        choices: [
          { name: 'Yes', value: true },
          { name: 'No', value: false }
        ]
      }
    ]);

    answer || process.exit(1);

    await fs.remove(targetDir);
  }

  clear();

  const { plugins } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'plugins',
      message: 'Do you need these plugins',
      choices: JYE_PLUGIN_CHECK
    }
  ]);

  fs.mkdirSync(targetDir);

  const pm = new PackageManager({ pkgName });

  const pkg = {
    name: pkgName,
    version: '1.0.0',
    private: true,
    dependencies: {},
    devDependencies: {}
  };

  const deps = ['react', 'react-dom', 'babel-eslint'];

  forEachSetV(deps, pkg, 'dependencies');
  forEachSetV(plugins, pkg, 'devDependencies');

  pm.cdPath();

  writeFileTree(targetDir, {
    'package.json': JSON.stringify(pkg, null, 2)
  });

  pm.install();
}

module.exports = (...args) => catchFn(create, ...args);
