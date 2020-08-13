module.exports = {
  transpileDependencies: ["vuetify"],
  outputDir: "qr",
  publicPath: process.env.VUE_APP_PUBLIC_PATH || "/",
  chainWebpack: (config) => {
    config.module
      .rule("worker-loader")
      .test(/\.worker\.js$/i)
      .use("worker-loader")
      .loader("worker-loader")
      .end();
  },
};
