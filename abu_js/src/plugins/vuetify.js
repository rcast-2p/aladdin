import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#357451",
        accent: "#f6ffb3",
        info: "#c3d825",
      },
    },
  },
});
