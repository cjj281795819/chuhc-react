module.exports = config => {
  config.module
    .rule('js')
    .test(/\.(js|ts|tsx|jsx)$/)
    .use('babel-loader')
    .tap(options => {
      options.presets.push('@babel/preset-typescript');
      return options;
    });
};
