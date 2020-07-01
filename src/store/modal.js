export default {
  namespaced: true,
  state: () => ({
    isOpen: false
  }),
  mutations: {
    toggleModal (state) {
      state.isOpen = !state.isOpen;
    }
  },
  getters: {
    isOpen: state => state.isOpen
  }
};
