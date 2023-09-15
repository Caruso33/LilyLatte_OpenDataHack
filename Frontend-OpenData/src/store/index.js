import { createStore } from "vuex";

export default createStore({
  state: {
    /**
     * @type {Web3} #provider
     */
    web3: null,
    wallet: null,
    step: null,
    isProfileEnabled: false,
    selectedUser: null,
  },
  getters: {},
  mutations: {
    setWeb3(state, { web3 }) {
      state.web3 = web3;
    },
    setWallet(state, { wallet }) {
      state.wallet = wallet;
    },
    setProgressStep(state, { step }) {
      state.step = step;
    },
    setProfileFlag(state, isProfileEnabled) {
      state.isProfileEnabled = isProfileEnabled;
    },
    setUserProfile(state, selectedUser) {
      state.selectedUser = selectedUser;
    },
  },
  actions: {},
  modules: {},
});
