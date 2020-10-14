const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const resolve = _path => path.join(__dirname, _path);

const timePath = resolve('index.txt');

const MAX_TIME = 86400000;

const checkTime = () => {
  const lastTime = +fs.readFileSync(timePath).toString();
  const nowTime = new Date().getTime();

  if (lastTime && nowTime - lastTime <= MAX_TIME) {
    return;
  }

  fs.writeFileSync(timePath, nowTime);

  const lastV = execSync('npm view jye-react version', { encoding: 'utf8' });
  return lastV;
};

module.exports = {
  checkTime,
};
