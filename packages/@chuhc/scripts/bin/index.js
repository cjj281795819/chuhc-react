#!/usr/bin/env node
const program = require('commander');

program.command('dev').action(() => {
  require('../lib/dev.js')();
});

program.command('build').action(() => {
  require('../lib/build.js')();
});

program.arguments('<command>').action(cmd => {
  program.outputHelp();
  console.log();
  console.log(`    ${chalk.red(`Unknown command ${chalk.yellow(cmd)}.`)}`);
  console.log();
});

program.parse(process.argv);
