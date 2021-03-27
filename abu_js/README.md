# abu_js

This is a microscope controlling GUI. CI, CD (continuous integration and continuous delivery) are set, and when you push to `master` branch, GitHub actions automatically build the source and deploy it to https://rcast-2p.github.io/abu/.

## how to use

If you want to use https://rcast-2p.github.io/abu/ you need enable mixed content to access `http` (non `https`) API.
- [How Do I Enable Mixed Content in My Browser? | Adobe Target](https://experienceleague.adobe.com/docs/target/using/experiences/vec/troubleshoot-composer/mixed-content.html?lang=en#task_FF297A08F66E47A588C14FD67C037B3A)
Or you can build the source by yourself or get the product of build and run it on `docker nginx server` or equivalent server.

## setup base OME

- [Schema documentation for ome.xsd](https://www.openmicroscopy.org/Schemas/Documentation/Generated/OME-2016-06/ome.html)

## /prudaq

```json
{"address":"192.168.2.100","udpPort":60000,"count":2618,"bufferSize":64020,"uuid":"lh20201203-195507"}
```


## licenses


  "dependencies": {
    "@mdi/font": "^5.9.55", // Apache-2.0
    "apexcharts": "^3.26.0", // MIT
    "axios": "^0.21.1", // MIT
    "core-js": "^3.9.1", // MIT
    "nedb": "^1.8.0", // MIT
    "npm-check-updates": "^11.3.0", // Apache-2.0
    "sass-loader": "^10.1.1", // MIT
    "tiff": "^4.3.0", // MIT
    "vue": "^2.6.12", // MIT
    "vue-apexcharts": "^1.6.0", // MIT
    "vue-meta": "^2.4.0", // MIT
    "vue-router": "^3.5.1", // MIT
    "vuetify": "^2.4.7", // MIT
    "vuex": "^3.6.2" // MIT
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "^4.5.12", // MIT
    "@vue/cli-plugin-eslint": "^4.5.12", // MIT
    "@vue/cli-service": "^4.5.12", // MIT
    "@vue/eslint-config-airbnb": "^5.3.0", // MIT
    "@vue/eslint-config-prettier": "^6.0.0", // MIT
    "babel-eslint": "^10.1.0", // MIT
    "eslint": "^7.22.0", // MIT
    "eslint-plugin-import": "^2.22.1", // MIT
    "eslint-plugin-prettier": "^3.3.1", // MIT
    "eslint-plugin-vue": "^7.7.0", // MIT
    "prettier": "^2.2.1", // MIT
    "sass": "^1.32.8", // MIT
    "vue-cli-plugin-vuetify": "^2.3.1", // MIT
    "vue-template-compiler": "^2.6.12", // MIT
    "vuetify-loader": "^1.7.2" // MIT
  },

## show dependencies

```
npm ls
```

## develop
### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
