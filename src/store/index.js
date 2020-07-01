import Vue from 'vue';
import Vuex from 'vuex';
import modal from './modal';
import shared from './shared';
import user from './user';
import campaigns from './campaigns';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user: user,
    shared: shared
  }
});

store.registerModule('campaigns', campaigns);
store.registerModule('modal', modal);

export default store;
