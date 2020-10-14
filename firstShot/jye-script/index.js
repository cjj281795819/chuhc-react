#!/usr/bin/env node

const program = require('commander');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const deveConfig = require('./webpackConfig/webpack.deve');
const prodConfig = require('./webpackConfig/webpack.prod');
const logSymbols = require('log-symbols');

program.command('dev').action(() => {
  const { devServer } = deveConfig;
  const compiler = webpack(deveConfig);
  const server = new WebpackDevServer(compiler, { ...devServer });

  server.listen(devServer.port);
});

program.command('build').action(() => {
  const compiler = webpack(prodConfig);

  compiler.run((err, stats) => {
    if (err) {
      // 回调中接收错误信息。
      console.error(err);
    } else {
      console.log(logSymbols.success, '打包成功！');
    }
  });
});

program.on('command:*', function() {
  console.log('error');
  process.exit(1);
});

program.parse(process.argv);
