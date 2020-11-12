import Vue from "vue";
import Vuex from "vuex";
import DataStore from "nedb";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    db: {},
  },
  mutations: {
    connect(state) {
      state.db.commands = new DataStore("commands.db");
      state.db.commands.loadDatabase();
    },
  },
  getters: {},
  actions: {},
  modules: {},
});
