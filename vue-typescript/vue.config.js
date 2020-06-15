module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        rules: {
          "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
          "no-debugger":
            process.env.NODE_ENV === "production" ? "error" : "off",
        },
        // options placed here will be merged with default configuration and passed to electron-builder
      },
    },
  },
  /*  configureWebpack: {
    module: {
      rules: [
        {
          "no-console": 0,
        },
      ],
    },
  },*/
};

