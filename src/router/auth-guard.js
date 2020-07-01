import store from '../store';

export const GuardForAuthPages = (to, from, next) => {
  const isAuthenticated = store.getters['user/user'];
  if (isAuthenticated) {
    next();
  } else {
    next('/login');
  }
};

export const GuardForNotAuthPages = (to, from, next) => {
  const isAuthenticated = store.getters['user/user'];
  if (isAuthenticated) {
    next('/campaigns');
  } else {
    next();
  }
};
