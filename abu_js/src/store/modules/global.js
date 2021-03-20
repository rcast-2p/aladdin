export default {
  state: {
    position: [0, 0, 0],
    loading: false,
    generation: 0,
  },
  mutations: {
    loading(state, onoff) {
      state.loading = onoff;
    },
    updatePosition(state, position) {
      state.position = [...position];
    },
    genInc(state) {
      state.generation += 1;
    },
  },
  getters: {},
  actions: {},
  modules: {},
};
