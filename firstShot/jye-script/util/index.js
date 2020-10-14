const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const logSymbols = require('log-symbols');

const _src = './src/**/index.tsx';
let entrys = null;
let onceDone = false;

const dirname = process.cwd();

/**
 * 获取路径，（根路径开始）
 * @param {String} src
 */
const resolve = src => path.join(dirname, src);

/**
 * 获取路径，（当前路径开始）
 * @param {String} src
 */
const nowPathResolve = src => path.join(__dirname, src);

/**
 * 获取入口地址
 */
const getEntrysInfo = () => {
  if (entrys) {
    return entrys;
  }

  entrys = {};

  let pages = glob.sync(_src);
  pages.map(p => {
    let dirname = path.dirname(p);
    dirname = dirname.slice(dirname.lastIndexOf('/') + 1);

    entrys[dirname] = p;
  });

  return entrys;
};

/**
 * 获取页面
 * @param {Boolean} isProd 是否生产环境
 */
const getPages = isProd => {
  const plugins = [];
  let entrysInfo = getEntrysInfo();

  Object.keys(entrysInfo).map(dirname => {
    plugins.push(
      new HtmlWebpackPlugin({
        chunks: isProd ? ['libs', dirname] : [dirname],
        filename: `./${dirname}/index.html`,
        template: nowPathResolve('../template/index.html'),
      }),
    );
  });

  return plugins;
};

/**
 * 清空屏幕
 */
const clearScreen = () => {
  process.stdout.write(
    process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H',
  );
};

/**
 * 挂载编译完成后hook
 * @param {*} app
 * @param {*} server
 * @param {*} compiler
 */
const devServerAfter = (app, server, compiler) => {
  const port = server.options.port;
  compiler.hooks.done.tap('done', () => {
    if (onceDone) {
      return;
    }

    onceDone = true;

    const entrys = getEntrysInfo();

    clearScreen();

    console.log(`
    `);

    Object.keys(entrys).map(entry =>
      console.log(
        logSymbols.success,
        `${entry}的入口：http://localhost:${port}/${entry}`,
      ),
    );

    console.log(`
    `);
  });
};

module.exports = {
  resolve,
  getEntrysInfo,
  getPages,
  devServerAfter,
};
