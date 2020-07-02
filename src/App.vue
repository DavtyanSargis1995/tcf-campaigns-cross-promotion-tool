<template>
  <div id="app" :class="{'purple-background': !user, 'gray-background': user}">
    <loading v-if="loading"/>
    <nav id="navbar" v-show="!loading">
      <ul class="d-flex justify-content-end" v-if="!user" >
        <li v-for="item in menuItems" :key="item.url">
          <router-link :to="item.url" :class="item.className">
            {{item.name}}
          </router-link>
        </li>
      </ul>
      <div class="d-flex justify-content-end" v-else>
        <create-campaign />
        <logout />
      </div>
    </nav>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<style lang="scss">
@import './assets/styles/style';
#app {
  min-height: 100vh;
}

#navbar {
  padding: 30px;
  height: 100px;
  background-color: #F4F5F7;
  -webkit-box-shadow: 0 1px 2px 0 rgba(34,36,38,.15);
  box-shadow: 0 1px 2px 0 rgba(34,36,38,.15);
  width: 100%;
  z-index: 13;
  position: fixed;
  top: 0;
  ul {
    list-style: none;
    width: 90%;
    margin: 0 auto;
    padding: 0 15px;
  }
}

main {
  padding-top: 140px;
}

</style>

<script>
import * as firebase from 'firebase';
import Loading from './components/UI/Loading';
import CreateCampaign from './components/Campaigns/CreateCampaign';
import Logout from './components/Auth/Logout';
export default {
  data () {
    return {
      menuItems: [
        { url: '/signup', name: 'Sign Up', className: 'btn btn-purple-outlined mr-3' },
        { url: '/login', name: 'Login', className: 'btn btn-purple-outlined px-4' }
      ]
    };
  },
  components: {
    Loading,
    Logout,
    CreateCampaign
  },
  created () {
    this.$store.commit('setLoading', true);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('user/autoSignIn', user);
      }
      this.$store.commit('setLoading', false);
    });
  },
  computed: {
    user () {
      return this.$store.getters['user/user'];
    },
    loading () {
      return this.$store.getters.loading;
    }
  }
};
</script>
