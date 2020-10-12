#!/usr/bin/env node
/**
 *  as a startup file
 */
const program = require('commander');
const pkg = require('../package.json');
const chalk = require('chalk');

program
  .version(`@chuhc/cli ${pkg.version}`, '-v -version')
  .usage('<command> [options]');

program
  .command('create <app-name>')
  .description('create project')
  .action((name) => {
    require('../lib/create.js')(name);
  });

program
  .command('update')
  .description('@chuhc/cli update')
  .action(() => {
    require('../lib/update.js')();
  });

program.arguments('<command>').action((cmd) => {
  program.outputHelp();
  console.log();
  console.log(`    ${chalk.red(`Unknown command ${chalk.yellow(cmd)}.`)}`);
  console.log();
});

program.program.parse(process.argv);
