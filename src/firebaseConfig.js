import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/auth';

// firebase init goes here
const firebaseConfig = {
  apiKey: 'AIzaSyAhUPn-q6KiwMayMirYtjS-Uku5yeyvuTs',
  authDomain: 'tcf-cross-promotion-tool.firebaseapp.com',
  databaseURL: 'https://tcf-cross-promotion-tool.firebaseio.com',
  projectId: 'tcf-cross-promotion-tool',
  storageBucket: 'tcf-cross-promotion-tool.appspot.com',
  messagingSenderId: '835715782045',
  appId: '1:835715782045:web:2c6f23b3cf40fb898d4b74'
};
firebase.initializeApp(firebaseConfig);

// firebase utils

const auth = firebase.auth();
const currentUser = auth.currentUser;

export {
  auth,
  currentUser
};
