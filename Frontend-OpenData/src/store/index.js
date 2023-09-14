import { createStore } from "vuex";

export default createStore({
  state: {
    /**
     * @type {Web3} #provider
     */
    web3: null,
    wallet: null,
    step: null,
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
  },
  actions: {},
  modules: {},
});
