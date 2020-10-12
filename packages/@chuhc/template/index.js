/**
 * @jye/template
 */
const fs = require('fs-extra');
const path = require('path');

const copyPageFiles = (cwd, tempSrc, { tsx, less }) => {
  ['index', 'home'].forEach(item => {
    const src = path.join(tempSrc, `src/${item}/index`);
    const destSrc = `${cwd}/${item}/index`;

    let suffixs = [['.js'], ['.css']];

    suffixs[0][1] = tsx ? '.tsx' : '.js';
    suffixs[1][1] = less ? '.less' : '.css';

    suffixs.forEach((suffix, index) => {
      if (index === 0 && less) {
        let content = fs.readFileSync(src + suffix[0]).toString();
        content = content.replace(/.css/g, '.less');

        fs.writeFile(destSrc + suffix[1], content);
        return;
      }

      fs.copySync(src + suffix[0], destSrc + suffix[1]);
    });
  });
};

module.exports = ({ tsx, less, git, config = {} }) => {
  const cwd = process.cwd();
  const tempSrc = path.join(__dirname, './template');
  const files = fs.readdirSync(tempSrc);

  files.forEach(file => {
    const src = path.join(tempSrc, file);
    const destSrc = `${cwd}/${file}`;

    switch (file) {
      case 'src': {
        fs.ensureDirSync(destSrc);
        fs.emptyDirSync(`${destSrc}/index`);
        fs.emptyDirSync(`${destSrc}/home`);

        copyPageFiles(destSrc, tempSrc, { tsx, less });
        break;
      }

      case 'tsconfig.json': {
        if (!tsx) {
          break;
        }
      }

      case '.gitignore': {
        if (!git) {
          break;
        }
      }

      case 'chuhc.config.js': {
        const content = `module.exports = ${JSON.stringify(config, null, 2)}`;
        fs.writeFileSync(destSrc, content);
        break;
      }

      default:
        fs.copySync(src, destSrc);
    }
  });
};
