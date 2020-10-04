/**
 * get webpack entry info
 */
const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let entries = null;

const SRC = './src/**/index.?(js|jsx|ts|tsx)';

/**
 * get webpack entry
 */
const getEntries = () => {
  if (entries) return entries;

  entries = {};

  const pages = glob.sync(SRC);
  pages.forEach(page => {
    const dirname = path.dirname(page);
    const entry = path.basename(dirname);

    entries[entry] = page;
  });

  return entries;
};

/**
 * get pages info
 * @param {Boolean} isProd
 */
const getPages = isProd => {
  const plugins = [];
  let entries = getEntries();

  Object.keys(entries).map(dirname => {
    plugins.push(
      new HtmlWebpackPlugin({
        chunks: isProd ? ['libs', dirname] : [dirname],
        filename: `./${dirname}/index.html`,
        template: path.join(__dirname, './template/index.html')
      })
    );
  });

  return plugins;
};

module.exports = {
  getEntries,
  getPages
};
