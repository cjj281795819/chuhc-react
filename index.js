#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const program = require('commander');
const packageJson = require('./package.json');
const download = require('download-git-repo');
const inputer = require('inquirer');
const ora = require('ora');
const logSymbols = require('log-symbols');
const semver = require('semver');
const colors = require('colors');
const { checkTime } = require('./util');
const { exec } = require('child_process');

const loading = ora('Loading unicorns');

program.version(packageJson.version, '-v, --version');

const LANG_LIST = {
  typescript: 'master',
  javascript: 'lang/js'
};

const downloadAdress = lang =>
  `cjj281795819/jiangyuer-react#${LANG_LIST[lang]}`;

const downloadCallback = async (answer, err) => {
  loading.stop();

  if (err) {
    console.log(logSymbols.error, '我好像遇到问题了');
    return;
  }

  console.log(logSymbols.success, '项目创建成功！');

  const filename = `${answer.name}/package.json`;

  if (fs.existsSync(filename)) {
    let _newPagJson = fs.readFileSync(filename).toString();

    _newPagJson = JSON.parse(_newPagJson);

    _newPagJson.name = answer.name;
    _newPagJson.author = answer.author;
    _newPagJson.description = answer.description;

    _newPagJson = JSON.stringify(_newPagJson, null, '\t');

    fs.writeFileSync(filename, _newPagJson);

    loading.color = 'green';
    loading.text = '正在疯狂为你拉node_modules';

    loading.start();

    const pullNodeModules = new Promise(res => {
      process.chdir(path.join(process.cwd(), answer.name));
      exec('npm i', () => {
        res(1);
      });
    });

    await pullNodeModules;

    loading.stop();

    console.log(logSymbols.success, '成功了同学，来吧，展示！');
    console.log(`
    `);
    console.log(logSymbols.info, `first setp：$ cd ${answer.name}`.blue);
    console.log(logSymbols.info, `second setp：$ npm run dev`.blue);
    console.log(`
    `);
  } else {
    console.log(logSymbols.error, '我好像遇到问题了');
  }
};

program
  .command('init')
  .description('初始化项目')
  .action(async () => {
    const checkResult = checkTime();

    if (checkResult && semver.gt(checkResult, packageJson.version)) {
      console.log(
        logSymbols.error,
        `当前版本过低，请及时更新版本至${checkResult}`
      );

      process.exit(1);
    }

    const answer = await inputer.prompt([
      {
        type: 'input',
        name: 'name',
        message: '请输入项目名称'
      },
      {
        type: 'input',
        name: 'author',
        message: '请输入项目作者名'
      },
      {
        type: 'input',
        name: 'description',
        message: '请输入项目介绍'
      },
      {
        type: 'list',
        message: '使用哪种语言进行开发',
        name: 'lang',
        choices: ['typescript', 'javascript']
      }
    ]);

    download(
      downloadAdress(answer.lang),
      `./${answer.name}`,
      downloadCallback.bind(null, answer)
    );

    loading.color = 'green';
    loading.text = '我正在疯狂为你加载中';
    loading.start();
  });

program.on('command:*', function() {
  console.log('请输入help查阅指令');
  process.exit(1);
});

program.parse(process.argv);
