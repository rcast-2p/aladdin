import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    address:""
  },
  mutations: {
    set_address(state, address){
      if(address!==""){
      state.address=address;
      localStorage.setItem("address",address);
      }else{
        if(localStorage.getItem("address")!==undefined){

state.address=localStorage.getItem("address");
  }
      }
    }
  },
  actions: {
  },
  modules: {
  },
});
