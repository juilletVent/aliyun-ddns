const webpack = require("webpack");
const path = require("path");

module.exports = {
  target: "node",
  mode: "production",
  // devtool: "source-map",
  entry: {
    main: "./src/index.ts",
  },
  output: {
    // 绝对路径
    path: path.resolve(__dirname, "dist"),
    // initial chunk 的模块命名规则
    filename: "[name].js",
    // non-initial chunk 的模块命名规则（可以延迟加载的块）
    chunkFilename: "[name].chunk.js",
    publicPath: "/", // 目标部署路径，浏览器请求时的baseUrl
    // publicPath: "", // relative to HTML file
    // publicPath: "https://cdn.example.com/", // absolute URL
  },
  module: {
    rules: [
      {
        test: /\.(j|t)s$/,
        include: [path.resolve(__dirname, "src")],
        loader: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  optimization: {
    minimize: false,
    // 创建在所有chunk间共享的runtime模块
    runtimeChunk: "single",
    // 运行环境模式，用于设置process.env.NODE_ENV的值，
    nodeEnv: "production",
    // 模块id命名模式
    chunkIds: "deterministic",
    // 使用非默认的压缩处理插件
    // minimizer: [
    //   new TerserPlugin({
    //     parallel: true,
    //     terserOptions: {
    //       // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
    //     },
    //   }),
    // ],
    // 导入模块配置，对于懒加载与动态导入非常有用
    // splitChunks: {},
  },
  plugins: [
    new webpack.DefinePlugin({
      // Definitions...
    }),
  ],
  // 生产环境下会缓存编译结果加快构建速度
  cache: true,
};
