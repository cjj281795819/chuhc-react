/**
 * @jye/template
 */
const fs = require('fs-extra');
const path = require('path');

const copyPageFiles = (cwd, tempSrc, options = {}) => {
  ['index', 'home'].forEach(item => {
    const src = path.join(tempSrc, `src/${item}/index`);
    const destSrc = `${cwd}/${item}/index`;

    let suffixs = [];

    if (options.tsx) {
      suffixs.push(['.tsx', '.tsx']);
    } else {
      suffixs.push(['.js', '.js']);
    }

    if (options.less) {
      suffixs.push(['.less', '.less']);
    } else {
      suffixs.push(['.less', '.css']);
    }

    suffixs.forEach(suffix => {
      fs.copySync(src + suffix[0], destSrc + suffix[1]);
    });
  });
};

module.exports = options => {
  const cwd = process.cwd();
  const tempSrc = path.join(__dirname, './template');
  const files = fs.readdirSync(tempSrc);

  files.forEach(file => {
    const src = path.join(tempSrc, file);
    const destSrc = `${cwd}/${file}`;
    if (file === 'src') {
      fs.ensureDirSync(destSrc);
      fs.emptyDirSync(`${destSrc}/index`);
      fs.emptyDirSync(`${destSrc}/home`);

      copyPageFiles(destSrc, tempSrc, options);
      return;
    }

    fs.copySync(src, destSrc);
    return;
  });
};
