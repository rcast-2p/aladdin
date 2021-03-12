import DataStore from "nedb";

export default {
  state: {
    db: {},
  },
  mutations: {
    connect(state) {
      state.db.commands = new DataStore({
        filename: "commands.db",
        timestampData: true,
      });
      state.db.ome = new DataStore({ filename: "ome.db", timestampData: true });
      state.db.mechanics = new DataStore({
        filename: "mechanics.db",
        timestampData: true,
      });
      state.db.commands.loadDatabase();
      state.db.ome.loadDatabase();
      state.db.mechanics.loadDatabase();
    },
  },
  getters: {},
  actions: {},
  modules: {},
};
