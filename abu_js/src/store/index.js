import Vue from "vue";
import Vuex from "vuex";
import axios from "@/plugins/axios";
import qs from "qs";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
  },
  mutations: {
    login(state, info) {
      state.user.user_name = info.user_name;
      state.user.show_name = info.show_name;
      state.user.dr_id = info.dr_id;
      state.user.g_uid = "";
    },
    logout(state) {
      state.user = {};
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
  },
  actions: {
    async getShowName(ctx) {
      const retval = await axios({
        url: "send/contract_detail.php",
        data: qs.stringify({
          command: "get_show_name",
        }),
      });
      if (retval.data.has_session) {
        ctx.commit("login", retval.data);
        return true;
      } else {
        ctx.commit("logout");
        return false;
      }
    },
  },
  modules: {},
});
