import Vue from 'vue';
import VueRouter from 'vue-router';
import Signup from '../views/Signup.vue';
import Login from '../views/Login.vue';
import { GuardForAuthPages, GuardForNotAuthPages } from './auth-guard';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    beforeEnter: GuardForNotAuthPages
  },
  {
    path: '/reset-password',
    name: 'ResetPass',
    component: () => import('../views/ResetPassword.vue'),
    beforeEnter: GuardForNotAuthPages
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: GuardForNotAuthPages
  },
  {
    path: '/campaigns',
    name: 'Campaigns',
    component: () => import('../views/Campaigns.vue'),
    beforeEnter: GuardForAuthPages
  },
  {
    path: '*',
    component: () => import('../views/PageNotFound.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
