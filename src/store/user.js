import router from '../router';
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  namespaced: true,
  state: {
    user: null,
    emailVerified: false,
    status: ''
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload;
    },
    setStatus (state, payload) {
      state.status = payload;
    },
    setVerified (state, payload) {
      state.emailVerified = payload;
    }
  },
  actions: {
    async signUserUp ({ commit }, payload) {
      commit('setLoading', true, { root: true });
      commit('clearError', null, { root: true });
      let user = null;
      try {
        await firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password);
        commit('setLoading', false, { root: true });
        user = firebase.auth().currentUser;
        await user.sendEmailVerification();
        await user.updateProfile({
          displayName: payload.name
        });
        commit('setStatus', 'success');
      } catch (error) {
        commit('setLoading', false, { root: true });
        commit('setError', error.message, { root: true });
      }
    },
    async signUserIn ({ commit }, payload) {
      commit('setLoading', true, { root: true });
      commit('clearError', null, { root: true });
      try {
        let user = null;
        await firebase.auth().signInWithEmailAndPassword(payload.email, payload.password);
        commit('setLoading', false, { root: true });
        commit('setStatus', 'success');
        user = firebase.auth().currentUser;
        if (!user.emailVerified) {
          commit('setVerified', false);
          return;
        }
        const newUser = {
          id: user.uid,
          name: user.displayName,
          email: user.email
        };
        commit('setUser', newUser);
        commit('setVerified', true);
        router.push({ path: '/campaigns' }).catch(error => {
          console.log('Everything is ok', error);
        });
      } catch (error) {
        commit('setLoading', false, { root: true });
        commit('setError', error.message, { root: true });
      }
    },
    autoSignIn ({ commit }, payload) {
      if (!payload.emailVerified) {
        return;
      }
      commit('setUser', {
        id: payload.uid,
        name: payload.displayName,
        email: payload.email
      });
      commit('setVerified', true);
      router.push({ path: '/campaigns' });
    },
    async resetPasswordWithEmail ({ commit }, payload) {
      const { email } = payload;
      commit('setLoading', true, { root: true });
      commit('clearError', null, { root: true });
      try {
        await firebase.auth().sendPasswordResetEmail(email);
        commit('setLoading', false, { root: true });
        return Promise.resolve('Please check you email to reset your password');
      } catch (error) {
        commit('setLoading', false, { root: true });
        commit('setError', error.message, { root: true });
      }
    },
    logout ({ commit }) {
      firebase.auth().signOut();
      commit('setUser', null);
      router.push({ path: '/login' });
    }
  },
  getters: {
    user: state => state.user,
    status: state => state.status,
    emailVerified: state => state.emailVerified
  }
};
