import Vue from "vue";
import Vuex from "vuex";
import DataStore from "nedb";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    db: {},
    daServer: {
      enabled: false,
      host: "0.0.0.0",
      path: "/da/mock",
      port: 9090,
    },
    scanConfig: {
      bbai: {
        address: "192.168.2.101",
        port: 8070,
      },
      sCom: {
        invert: 1,
        aomOpenUs: 1.0,
        aomOpenHl: 1,
        xyRepeatNum: 1,
        xyzRepeatNum: 1,
      },
      sReso: {
        xFResolution: 1.0,
        xBResolution: 1.0,
        yFResolution: 1.0,
        yBResolution: 1.0,
        zFResolution: 1.0,
        zBResolution: 1.0,
      },
      pinConfig: [
        { name: "plsPin1", value: 1 },
        { name: "dirPin1", value: 2 },
        { name: "plsPin2", value: 3 },
        { name: "dirPin2", value: 4 },
        { name: "plsPin3", value: 5 },
        { name: "dirPin3", value: 6 },
        { name: "aomPin", value: 7 },
        { name: "aomRef", value: 8 },
      ],
    },
  },
  mutations: {
    connect(state) {
      state.db.commands = new DataStore({
        filename: "commands.db",
        timestampData: true,
      });
      state.db.ome = new DataStore({ filename: "ome.db", timestampData: true });
      state.db.commands.loadDatabase();
      state.db.ome.loadDatabase();
    },
    setObject(state, key, objstr) {
      state[key] = JSON.parse(objstr);
    },
  },
  getters: {},
  actions: {},
  modules: {},
});
