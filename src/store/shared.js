export default {
  state: {
    loading: false,
    error: null
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload;
    },
    setError (state, payload) {
      state.error = payload;
    },
    clearError (state) {
      state.error = null;
    }
  },
  getters: {
    loading: state => state.loading,
    error: state => state.error
  }
};
