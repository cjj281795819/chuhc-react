module.exports = config => {
  ['.tsx', '.ts'].forEach(item => config.resolve.extensions.add(item));

  config.module
    .rule('js')
    .test(/\.(js|ts|tsx|jsx)$/)
    .use('babel-loader')
    .tap(options => {
      options.presets.push('@babel/preset-typescript');
      return options;
    });
};
