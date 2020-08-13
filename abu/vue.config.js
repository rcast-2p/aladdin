module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
    },
  },
  // configureWebpack: config => {
  //   config.externals = {
  //     childprocess: 'require("electron").remote.require("child_process")'
  //   };
  // }
};
