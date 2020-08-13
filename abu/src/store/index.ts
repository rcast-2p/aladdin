import Vue from "vue";
import Vuex from "vuex";
import { RootState } from "./types";

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
  state: {
    address: "",
  },
  mutations: {
    setAddress(state, address) {
      if (address !== "") {
        state.address = address;
        localStorage.setItem("address", address);
      } else {
        if (localStorage.getItem("address") !== undefined) {
          state.address = localStorage.getItem("address") as string;
        }
      }
    },
  },
  actions: {},
  modules: {},
});
