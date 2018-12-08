import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// create state that holds data
const state = {
    currentUser: null,
    currentChannel: null,
    isPrivate: false
};

// update state data through mutations
const mutations = {
    SET_USER(state, user) {
        state.currentUser = user;
    },

    SET_CURRENT_CHANNEL(state, channel) {
        state.currentChannel = channel;
    },

    SET_PRIVATE(state, isPrivate) {
        state.isPrivate = isPrivate;
    }
};

// create actions for mutations with necessary data
const actions = {
    setUser(state, user) {
        state.commit('SET_USER', user);
    },

    setCurrentChannel({ commit }, channel) {
        commit('SET_CURRENT_CHANNEL', channel);
    },

    setPrivate({ commit }, isPrivate) {
        commit('SET_PRIVATE', isPrivate);
    }
};

// get data from state
const getters = {
    currentUser: state => state.currentUser,
    currentChannel: state => state.currentChannel,
    isPrivate: state => state.isPrivate
};

// create vuex store
const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters
});

export default store;
