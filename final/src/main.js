// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import firebase from 'firebase/app';
import store from './store';
import auth from 'firebase/auth';

Vue.config.productionTip = false;

// Initialize Firebase
var config = {
    apiKey: 'AIzaSyD89dSF5uMoN5Oig4mkUu0g4kDgf7f6cJ0',
    authDomain: 'vuexslack.firebaseapp.com',
    databaseURL: 'https://vuexslack.firebaseio.com',
    projectId: 'vuexslack',
    storageBucket: 'vuexslack.appspot.com',
    messagingSenderId: '520664506704'
};
firebase.initializeApp(config);

window.firebase = firebase;

const unsubscribe = firebase.auth().onAuthStateChanged(user => {
    // dispatch user
    store.dispatch('setUser', user);

    new Vue({
        el: '#app',
        router,
        store,
        components: { App },
        template: '<App/>'
    });
    // recursion - this function calls itself on auth state change
    unsubscribe();
});
