/**
 * create project
 */
const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');
const inquirer = require('inquirer');
const catchFn = require('./util/catchFn');
const PackageManager = require('./PackageManager');
const writeFileTree = require('./util/writeFileTree');
const template = require('@chuhc/template');
const { beforeCreate } = require('./util/checkVersion');
const { clear, validateName, forEachSetV } = require('./util');
const { setPkg, setPkgScripts, getPluginOptions } = require('./util/pkg');

const loading = ora();

const CHUHC_PLUGIN_CHECK = [
  {
    name: 'Typescript',
    value: ['tsx', '@chuhc/plugin-typescript'],
  },
  {
    name: 'Less',
    value: ['less', '@chuhc/plugin-less'],
  },
];

async function create(pkgName) {
  validateName(pkgName);

  const cwd = process.cwd();
  const targetDir = path.join(cwd, pkgName);

  await beforeCreate();

  if (fs.existsSync(targetDir)) {
    clear();

    const { overwrite } = await inquirer.prompt([
      {
        type: 'list',
        message: `Target directory already exists. Can I overwrite it`,
        name: 'overwrite',
        choices: [
          { name: 'Yes', value: true },
          { name: 'No', value: false },
        ],
      },
    ]);

    overwrite || process.exit(1);
    await fs.remove(targetDir);
  }

  clear();

  const { plugins: morePlugins } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'plugins',
      message: 'Do you need these plugins',
      choices: CHUHC_PLUGIN_CHECK,
    },
  ]);

  loading.start('loading');

  fs.mkdirSync(targetDir);

  const { options, plugins: devD } = getPluginOptions(morePlugins);
  const pm = new PackageManager({ pkgName });
  const pkg = setPkg({
    name: pkgName,
    dependencies: {},
    devDependencies: {},
  });
  const depe = ['react', 'react-dom'];

  options.config = {
    plugins: devD.map((item) => [item, {}]),
  };

  devD.push('babel-eslint', '@chuhc/scripts');

  const promise = [
    ...forEachSetV(depe, pkg, 'dependencies'),
    ...forEachSetV(devD, pkg, 'devDependencies'),
  ];

  await Promise.all(promise);

  setPkgScripts(pkg);
  pm.cdPath();

  writeFileTree(targetDir, {
    'package.json': JSON.stringify(pkg, null, 2),
  });

  loading.succeed('🚀 Initialization successful!');

  pm.install();

  options.git = pm.git();

  template(options);

  loading.succeed('🎉 Successfully created project!');
  console.log();
  console.log(`$ cd ${pkgName}`);
  console.log('$ npm run dev');
  console.log();
}

module.exports = (...args) => catchFn(create, ...args);
