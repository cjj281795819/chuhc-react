/**
 * write Files
 */
const fs = require('fs-extra');
const path = require('path');

module.exports = (dir, files) => {
  Object.keys(files).forEach((name) => {
    const pathName = path.join(dir, name);
    fs.ensureDirSync(path.dirname(pathName));
    fs.writeFileSync(pathName, files[name]);
  });
};
