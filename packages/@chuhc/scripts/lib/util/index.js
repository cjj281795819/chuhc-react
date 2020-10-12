/**
 * some fn
 */
const path = require('path');
const { getEntries } = require('../enrty');

const dirname = process.cwd();

let onceDone = false;

const clearScreen = () => {
  process.stdout.write(
    process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H'
  );
};

exports.devServerAfter = (app, server, compiler) => {
  const port = server.options.port;
  compiler.hooks.done.tap('done', () => {
    if (onceDone) {
      return;
    }

    onceDone = true;

    const entrys = getEntries();

    clearScreen();

    console.log(`
    `);

    Object.keys(entrys).map(entry =>
      console.log(`🚀  ${entry}的入口：http://localhost:${port}/${entry}`)
    );

    console.log(`
    `);
  });
};

exports.resolve = src => path.join(dirname, src);
