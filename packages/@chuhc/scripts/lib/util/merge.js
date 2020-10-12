/**
 * webpack merge
 */
const RE_SUFFIX = ['js', 'css', 'jpg'];

const reSuffix = test => {
  const strRe = test.toString();
  for (let i = 0; i < RE_SUFFIX.length; i++) {
    if (strRe.includes(RE_SUFFIX[i])) {
      return RE_SUFFIX[i];
    }
  }

  throw new Error(`not exist module.rules.test: ${test}`);
};

exports.setBaseConfig = (base, config) => {
  Object.keys(base).forEach(key => {
    const val = {};
    val[key] = base[key];

    switch (key) {
      case 'plugins': {
        break;
      }
      case 'module': {
        const modules = base[key];
        modules.rules.forEach(rule => {
          const { test, use } = rule;
          const _config = config.module.rule(reSuffix(test)).test(test);
          if (use instanceof Array) {
            use.forEach(item => {
              if (typeof item === 'string') {
                _config.use(item).loader(item);
              } else {
                throw new Error('这里待补齐');
              }
            });
          } else {
            const { loader, options } = use;
            _config
              .use(loader)
              .loader(loader)
              .options(options);
          }
        });
        break;
      }
      default:
        config.merge(val);
    }
  });
};
