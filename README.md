# chuhc-cli 脚手架

## 前言

[掘金文章](https://juejin.im/post/6882681067971543047)

后面去看了`@vue/cli`的源码，不得不说，确实很正式很规范化。参考了@vue/cli 的部分功能，对脚手架进行修改。

## 效果栗子

![image](https://github.com/cjj281795819/chuhc-react/blob/master/static/example.gif)

## 项目结构

项目`chuhc-react`的结构分成了四个部分：

- `@chuhc/cli` 脚手架命令行内容，通过命令去初始化项目等等操作。
- `@chuhc/scripts` 项目编译运行打包内容，暂未接入部署等流程。
- `@chuhc/template` 模板文件。
- `@chuhc/plugin-xxx` 项目封装的插件，例如`@chuhc/plugin-typescript`等等。

## cli

之前是直接通过`inquirer`的一些交互命令，获取信息后，通过`download-git-repo`去对应`github`拉取模板文件，这样虽然比较简单，但是多个模板的话，维护就很难受了。

而在`@vue/cli`里，是通过多个插件组合成一个整体模板，在很多脚手架根目录下，都有一个`xxx.config.js`暴露出来。然后在运行`node`命令时，去读取配置文件，根据配置文件的内容去进行对应操作，例如：使用`webpack-chain`动态修改`config`，最后再调用`toConfig`去生成新的`webpack`配置内容。

### 插件判断，生成 pkg

一个基本的`package.json`模板，除了常规不变的`version`、`private`、`license`等等，像`name`，`scripts`，`dependencies`，`devDependencies`需要我们去手动添加进去。

`name`就使用脚手架初始化传入的参数，而`scripts`则是在成功引入`@chuhc/scripts`后，使用其运行命令。

像一些必备的，例如`react`，`react-dom`，我们可以直接放到`dependencies`里，而`devDependencies`一般是初始化时，用户手动选择的`plugins`。

借助`inquirer`去罗列插件，让用户选择需要引入哪些插件。

```javascript
const CHUHC_PLUGIN_CHECK = [
  {
    name: 'Typescript',
    value: ['tsx', '@chuhc/plugin-typescript'],
  },
  {
    name: 'Less',
    value: ['less', '@chuhc/plugin-less'],
  },
];

const { plugins } = await inquirer.prompt([
  {
    type: 'checkbox',
    name: 'plugins',
    message: 'Do you need these plugins',
    choices: CHUHC_PLUGIN_CHECK, // 一个结构，自己觉得怎么处理方便，怎么来
  },
]);
```

那么根据上面的`code`就可以获取到，用户需要哪些`plugin`了，那么可以将这些`plugin`放入到`json`的`devDependencies`里。

### 获取依赖最新版本

上述无论是`react`还是`plugin`，都需要一个版本号，我这里是采用命令行去获取最新版本，然后作为其`value`值。如果直接遍历运行`execSync`的话，会阻塞住，`ora`的`loading`也要卡着不动，于是选择`promise`去运行，通过`exec`回调来结束`promise`。

```javascript
const forEachSetV = (list, obj, key) => {
  const promises = [];
  const manager = hasCnpm() ? 'cnpm' : 'npm'; // 判断选择cnpm还是npm

  list.forEach((item) => {
    if (typeof item === 'object') {
      return forEachSetV(item, obj, key);
    }

    const newPromise = new Promise((res) => {
      exec(`${manager} view ${item} version`, (err, stdout, stderr) => {
        obj[key][item] = stdout.slice(0, stdout.length - 1);
        res(0);
      });
    });

    promises.push(newPromise);
  });

  return promises;
};

const promise = [
  ...forEachSetV(depe, pkg, 'dependencies'),
  ...forEachSetV(devD, pkg, 'devDependencies'),
];
await Promise.all(promise);
```

那么就获取到版本号后，再将其他数据一同填入到`json`中，将其作为`package.json`的值，在新项目目录下，新建它。

```javascript
const fs = require('fs-extra'); // fs-extra是系统fs模块的扩展
const path = require('path');

module.exports = (dir, files) => {
  Object.keys(files).forEach((name) => {
    const pathName = path.join(dir, name);
    fs.ensureDirSync(path.dirname(pathName)); // 如果没有文件夹则新建文件夹
    fs.writeFileSync(pathName, files[name]); // 新建文件
  });
};

writeFileTree(targetDir, {
  'package.json': JSON.stringify(pkg, null, 2),
});
```

### 选择包管理工具

因为`npm`的速度不甚理想，可以将其作为兜底处理。先判断当前环境中，是否有`yarn`、`cnpm`等等，然后优先选择前者，若都没有，则再使用`npm`进行操作。

```javascript
const PM_CONFIG = {
  npm: {
    install: ['install', '--loglevel', 'error'], // 打印error信息
    remove: ['uninstall', '--loglevel', 'error'],
  },
  yarn: {
    install: [],
    remove: ['remove'],
  },
};
PM_CONFIG.cnpm = PM_CONFIG.npm;

module.exports = class PackageManager {
  constructor({ pkgName }) {
    this.pkgName = pkgName;

    if (hasYarn()) {
      this.bin = 'yarn';
    } else if (hasCnpm()) {
      this.bin = 'cnpm';
    } else {
      this.bin = 'npm';
    }
  }

  // 封装了下运行命令函数
  runCommand(command, args = []) {
    const _commands = [this.bin, ...PM_CONFIG[this.bin][command], ...args];
    execSync(_commands.join(' '), { stdio: [0, 1, 2] });
  }

  install() {
    try {
      this.runCommand('install', ['--offline']); // offline指先去拉取缓存区里的，如果没有则去服务器拉
    } catch (e) {
      this.runCommand('install'); // 报错兜底
    }
  }

  git() {
    try {
      execSync('git init');
      return true;
    } catch (e) {
      return false;
    }
  }
};
```

而判断`yarn`和`cnpm`环境中是否存在，可以通过判断`version`等等方法，去看是否能够成功执行，若成功执行，则说明环境中存在，反之则否。

```javascript
const judgeEnv = (name) => {
  const envKey = `_has${name[0].toUpperCase()}${name.slice(1)}`; // 保存下结果

  if (_env[envKey] !== null) {
    return _env[envKey];
  }

  try {
    execSync(`${name} --version`, { stdio: 'ignore' }); // 不打印信息

    return (_env[envKey] = true);
  } catch (e) {
    return (_env[envKey] = false);
  }
};

const hasYarn = judgeEnv.bind(this, 'yarn');

const hasCnpm = judgeEnv.bind(this, 'cnpm');
```

然后通过`install`方法去安装依赖，再将一些参数传递给`@chuhc/template`去把一些基本模板复制过去。

## scripts

因为是多页面项目，`scripts`里主要做了以下几件事情：

- 通过`glob`去匹配入口，然后将其作为`entry`动态传入，并动态传入多个`html-webpack-plugin`给`plugins`。
- 通过读取项目根目录下的`chuhc.config.js`文件，来动态修改`webpack`配置内容并调用对应的插件。
- 最后生成最终的`webpack`配置文件，传入给`webpack`去进行编译运行打包等等操作。

### 匹配入口

匹配入口主要使用`glob`去匹配，只有满足匹配要求，才作为入口。然后通过匹配到的信息，去生成对应的`entry`内容，和`plugin`内容，传递给`webpack`配置文件。

```javascript
const SRC = './src/**/index.?(js|jsx|ts|tsx)';
/**
 * get webpack entry
 */
const getEntries = () => {
  if (entries) return entries;
  entries = {};

  const pages = glob.sync(SRC);
  pages.forEach((page) => {
    // 遍历传entry
    const dirname = path.dirname(page);
    const entry = path.basename(dirname);
    entries[entry] = page;
  });
  return entries;
};

/**
 * get pages info
 * @param {Boolean} isProd
 */
const getPages = (isProd) => {
  const plugins = [];
  let entries = getEntries();

  Object.keys(entries).map((dirname) => {
    // 遍历传plugin
    plugins.push(
      new HtmlWebpackPlugin({
        chunks: isProd ? ['libs', dirname] : [dirname],
        filename: `./${dirname}/index.html`,
        template: path.join(__dirname, './template/index.html'),
      })
    );
  });

  return plugins;
};
```

### 链式配置 config

链式配置推荐使用[webpack-chain](https://github.com/Yatoo2018/webpack-chain/tree/zh-cmn-Hans)，`@vue/cli`也是使用它。因为我们原本就有一些基本配置内容，可以通过`config.merge`将我们已有的配置对象合并到配置实例中。

但是不支持直接转化，需要我们对某些配置内容，进行手动去转化，例如：`module`。而`plugins`不支持已经`new`的`plugin`，我这边的处理是跳过对`plugin`的合并，最后再使用`webpack-merge`将`config.toConfig()`和`plugins`再合并成最终的配置对象。

```javascript
const Config = require('webpack-chain');
const chuhcConfig = require(`${process.cwd()}/chuhc.config.js`); // 读取根目录的配置文件
const { setBaseConfig } = require('./util/merge'); // 将已有的配置文件对象合并到配置实例
const BASE = require('./config/webpack.base'); // 配置对象base
const DEVE = merge(BASE, require('./config/webpack.deve')); // 配置对象 deve
const PROD = merge(BASE, require('./config/webpack.prod')); // 配置对象 prod

const config = new Config();

// 我这边就只是对plugin做一下处理，可以做其他很多事情，这里只是举个例子
const handleChuhcConfig = ({ plugins } = {}) => {
  // to do sth.
  if (plugins) {
    plugins.forEach((plugin) => {
      require(plugin[0])(config, plugin[1]);
    });
  }
};

const getConfig = (isDeve) => {
  config.clear(); // 清除配置

  setBaseConfig(isDeve ? DEVE : PROD, config);
  handleChuhcConfig(chuhcConfig);

  return merge(config.toConfig(), {
    plugins: isDeve ? DEVE.plugins : PROD.plugins,
  }); // 最后再合并
};
```

### 编译运行

在获取到`webpack config`后，那么可以根据是`dev`命令还是`build`命令，去调用对应的函数，进行编译运行打包等等操作了。(同理，根据`program.command`）

```javascript
// dev 运行
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { getDeveConfig } = require('./config');

module.exports = () => {
  const DEVE_CONFIG = getDeveConfig();
  const { devServer } = DEVE_CONFIG;
  const compiler = webpack(DEVE_CONFIG);
  const server = new WebpackDevServer(compiler, { ...devServer });
  server.listen(devServer.port);
};
```

```javascript
// build
const webpack = require('webpack');
const { getProdConfig } = require('./config');
const logSymbols = require('log-symbols');

module.exports = () => {
  const PROD_CONFIG = getProdConfig();
  const compiler = webpack(PROD_CONFIG);

  compiler.run((err, stats) => {
    if (err) {
      // 回调中接收错误信息。
      console.error(err);
    } else {
      console.log(logSymbols.success, '打包成功！');
    }
  });
};
```

## template

`template`主要就是通过传入的参数，来判断是否要`copy`对应的文件，同时根据`options`来去修改对应文件内容和后缀。代码过于无趣，就不贴了。

## plugin-xx

`plugin`的话，可以做的事情比较多，我这边目前就只是来链式修改`webpack`配置信息。这只是其中一种功能，还有很多例如：自己写一个`webpack plugin / loader`去传入，去做一些其他事情。

```javascript
// example
module.exports = (config) => {
  ['.tsx', '.ts'].forEach((item) => config.resolve.extensions.add(item));

  config.module
    .rule('js')
    .test(/\.(js|ts|tsx|jsx)$/)
    .use('babel-loader')
    .tap((options) => {
      options.presets.push('@babel/preset-typescript');
      return options;
    });
};
```
