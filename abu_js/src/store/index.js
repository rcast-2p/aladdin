import Vue from "vue";
import Vuex from "vuex";
import abuconfig from "@/store/modules/abuconfig";
import db from "@/store/modules/db";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    a: abuconfig,
    d: db,
  },
});
