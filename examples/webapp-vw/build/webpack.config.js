const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const WebpackBar = require("webpackbar");
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const pathResolve = (pathUrl) => path.join(__dirname, pathUrl);
const mode = process.env.PROJECT_MODE;
// 读取环境变量配置
const dotenvFiles = [
  `${pathResolve(`../.env.${mode}.local`)}`,
  `${pathResolve(`../.env.${mode}`)}`,
  `${pathResolve(`../.env`)}`,
];

dotenvFiles.forEach((dotenvFile) => {
  if (fs.existsSync(dotenvFile)) {
    const config = dotenv.config({
      path: dotenvFile,
    });
    dotenvExpand.expand(config);
  }
});
module.exports = (env) => {
  return {
    mode: env.mode,
    devtool: env.mode === "development" ? "source-map" : false,
    entry: "./src/index.tsx",
    output: {
      filename: "[name]-[contenthash:8].js",
      path: path.resolve(__dirname, `../dist`),
      pathinfo: false, //webpack 会在输出的 bundle 中生成路径信息。然而，在打包数千个模块的项目中，这会带来垃圾回收性能的压力
      publicPath: mode?.includes("local_app") ? "./" : "/", //前端开发环境使用history路由的时候，这个publich很有用
    },
    resolve: {
      modules: [path.resolve(__dirname, "../src"), "node_modules"],
      extensions: [".ts", ".tsx", ".js"],
      alias: {
        "@": path.resolve(__dirname, "../src"),
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.less$/,
          // exclude: /node_modules/,
          use: [
            env.mode === "development"
              ? "style-loader"
              : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                //自己业务中的代码用到的样式表才开启模块化
                modules: {
                  localIdentName: "[local]_[hash:8]",
                },
                esModule: false, //解决生成多余文件问题
              },
            },
            "less-loader",
          ],
        },
        {
          test: /\.css$/,
          use: [
            env.mode === "development"
              ? "style-loader"
              : MiniCssExtractPlugin.loader,
            {
              //第三方的css样式表不开启模块化，否则会样式出问题
              loader: "css-loader",
              options: {
                esModule: false, //解决生成多余文件问题
                // importLoaders: 0
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          // flags to apply these rules, even if they are overridden (advanced option)
          loader: "url-loader",
          // options for the loader
          options: {
            limit: 10000,
            name: "images/[name].[contenthash:8].[ext]",
          },
        },
        // {
        //   test: /\.svg$/,
        //   use:["babel-loader",{loader:"@svgr/webpack",options:{babel:false,icon:true}}],
        //   // flags to apply these rules, even if they are overridden (advanced option)
        //   // options for the loader
        // },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        minChunks: 1,
        minSize: 100 * 1024,
        maxSize: 400 * 1024,
        enforceSizeThreshold: 1024 * 1024,
        cacheGroups: {
          vendors: {
            name: "vendors",
            reuseExistingChunk: true,
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
          },
          // commons: {
          //   reuseExistingChunk: true,
          //   name: "common",
          //   priority: 10,
          // },
        },
      },
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          },
        }),
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: path.resolve(__dirname, "../public/index.html"),
        inject: "body",
      }),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash:8].css",
        ignoreOrder: true,
      }),
      new webpack.DefinePlugin({
        "process.env": Object.keys(process.env).reduce((env, key) => {
          env[key] = JSON.stringify(process.env[key]);
          return env;
        }, {}),
      }),
      env.mode !== "development" &&
      new CompressionWebpackPlugin({
        // filename: "[path].gz[query]",
        // algorithm: "gzip", // 压缩格式 有：gzip、brotliCompress,
        // test: /.(js|css)$/,
        // threshold: 10 * 1024, // 只处理比这个值大的资源，按字节算
        // minRatio: 0.8, // 只有压缩率比这个值小的文件才会被处理，压缩率=压缩大小/原始大小，如果压缩后和原始文件大小没有太大区别，就不用压缩
        // deleteOriginalAssets: false, // 是否删除原文件，最好不删除
      }),
      // new BundleAnalyzerPlugin({ analyzerPort: 8091 }),
      env.mode === "development" && new ReactRefreshWebpackPlugin(),
      new CleanWebpackPlugin(),
      new WebpackBar({
        color: "#85d", // 默认green，进度条颜色支持HEX
        basic: false, // 默认true，启用一个简单的日志报告器
        profile: false, // 默认false，启用探查器。
      }),
    ].filter(Boolean),
    devServer: {
      host: "0.0.0.0",
      historyApiFallback: true, //是否启用html5历史记录模式，
      hot: true,
      liveReload: false,
      https: false,
      compress: false,
      // port: 3003,
      proxy: {
        // "/api": {
        //   target: "http://process.hcytech.io/form/",
        //   pathRewrite: { "^/api": "" },
        //   changeOrigin: true,
        // },
        "/api/upload": {
          target: "http://lang-test.hcytech.io/",
          // target: "http://172.16.10.26:18887/",
          // target: "http://attendance.hcytech.io/",
          // pathRewrite: { "^/api/gate/upload": "/api/upload" },
          changeOrigin: true,
        },
        "/api/": {
          target: "http://lang-test.hcytech.io/",
          // target: "http://staffh5gateid.hcytech.io/",
          // target: "http://172.16.10.26:18887/",
          // target: "http://attendance.hcytech.io/",
          // pathRewrite: { "^/api": "" },
          changeOrigin: true,
        },
      },
      client: {
        overlay: true,
        progress: true,
      },
    },
  };
};
