#!/usr/bin/env node
/**
 *  as a startup file
 */
const program = require('commander');
const pkg = require('../package.json');

program
  .version(`@jye/cli ${pkg.version}`, '-v -version')
  .usage('<command> [options]');

program
  .command('create <app-name>')
  .description('create project')
  .action(name => {
    require('../lib/create.js')(name);
  });

program.arguments('<command>').action(cmd => {
  program.outputHelp();
  console.log();
  console.log(`    ${chalk.red(`Unknown command ${chalk.yellow(cmd)}.`)}`);
  console.log();
});

program.program.parse(process.argv);
