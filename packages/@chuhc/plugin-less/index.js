const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = config => {
  const _config = config.module.rule('less').test(/\.less$/);
  const use = [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'];
  use.forEach(item => {
    if (typeof item === 'string') {
      _config.use(item).loader(item);
    } else {
      throw new Error('这里待补齐');
    }
  });
};
