import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import metamask from "@/provider/metamask";

export const useMetamask = () => {
  /**
   * @type {metamask} metamaskInstance
   */
  let metamaskInstance;

  const store = useStore();

  const loading = ref(false);

  const wallet = computed(() => store.state.wallet);

  onMounted(() => {
    metamaskInstance = metamask.create();
    store.commit("setWeb3", {
      web3: metamaskInstance.getProvider(),
    });
  });

  const connect = async (resolve) => {
    try {
      const wallet = await metamaskInstance.getWallet();

      store.commit("setWallet", {
        wallet,
      });

      if (typeof resolve == "function") resolve(wallet);

      return wallet;
    } catch (error) {
      console.log(error);
    }
  };

  const disconnect = async () => {
    store.commit("setWallet", {
      wallet: null,
    });
  };

  const metamaskFunctions = {
    connect,
    disconnect,
  };

  return {
    loading,
    wallet,
    metamaskInstance,
    metamaskFunctions,
  };
};
