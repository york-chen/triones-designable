const CracoLessPlugin = require('craco-less');
const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const resolve = (dir) => path.resolve(__dirname, dir);
// const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
module.exports = {
  // plugins: [
  //     {
  //         plugin: require('craco-babel-loader'),
  //         options: {
  //             includes: [
  //                 resolveApp('../../packages/shared'),
  //                 resolveApp('../../packages/core'),
  //                 resolveApp('../../packages/react'),
  //                 resolveApp('../../packages/react-settings-form'),
  //                 resolveApp('../../formily/antd'),
  //                 resolveApp('../../formily/setters'),
  //             ],
  //         },
  //     },
  // ],
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        // modifyLessRule: function (lessRule, _context) {
        //     lessRule.test = /\.(module)\.(less)$/;
        //     lessRule.exclude = /node_modules/;
        //     return lessRule;
        // },
        // cssLoaderOptions: {
        //     modules: {
        //         localIdentName: '[name]__[local]--[hash:base64:5]'
        //     }
        // },
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              'layout-header-background': '#333',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],

  webpack: {
    alias: {
      // "@alkaid/shared": resolve("src/alkaid/shared"),
      // "@alkaid/shared": resolve("../../packages/shared/src"),
      // "@alkaid/core": resolve("src/alkaid/core"),
      // "@alkaid/react": resolve("src/alkaid/react"),
      // "@alkaid/react-settings-form": resolve("src/alkaid/react-settings-form"),
      // "@alkaid/formily-antd": resolve("src/alkaid/antd"),
      // "@alkaid/formily-setters": resolve("src/alkaid/setters"),
    },
    // configure: (webpackConfig, { env, paths }) => {
    //     webpackConfig.output = {
    //         ...webpackConfig.output,
    //         path: path.resolve(__dirname, 'build'),
    //         publicPath: './'
    //     };
    //     return webpackConfig;
    // },
    configure: (webpackConfig, { env, paths }) => {
      // webpackConfig.module.rules.push({
      //   test: /\.(ts|tsx)$/,
      //   include: [
      //     path.resolve(__dirname, "src"), // 继续包含 src 目录
      //     path.resolve(__dirname, "../../node_modules"), // 包括 node_modules 目录
      //     path.resolve(__dirname, "node_modules"), // 包括 node_modules 目录
      //     path.resolve(__dirname, "../../packages"), // 包括 node_modules 目录
      //   ],
      //   use: {
      //     loader: 'babel-loader',
      //   },
      // });
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      );

      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      return webpackConfig;
    },
  },
};
