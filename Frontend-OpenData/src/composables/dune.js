import { ref } from "vue";
import { DuneClient, QueryParameter } from "@cowprotocol/ts-dune-client";

// API key name: opendata
const API_KEY = "qxk2LaHPfNJxx8PPQiarTy4ouiIwjIac";

const QUERY_IDs = {
  wallet_age: 3024874,
  dex: 3024384,
  top_evm_holding: 3025013,
  number_of_tx_by_chain: 3025089,
};

export const duneTitles = ["meta", "dex", "top_5_evm", "tx_by_chain"];

export const useDune = () => {
  const loading = ref(false);

  const requestDune = async (walletAddress, queryName) => {
    const client = new DuneClient(API_KEY);
    const parameters = [QueryParameter.text("wallet_address", walletAddress)];
    // const parameters = [
    //   QueryParameter.text(
    //     "wallet_address",
    //     "0xB17b3e7910AF9d232Cb683C083eF73c34521FC8A"
    //     // "0x275ab2f4e5dd3cb7aa8ec4f16a79f4023cc5f7ef"
    //   ),
    // ];

    const { result } = await client.refresh(QUERY_IDs[queryName], parameters);

    return result;
  };

  const get = async (walletAddress, queryName) => {
    try {
      loading.value = true;
      const result = await requestDune(walletAddress, queryName);
      loading.value = false;
      return result;
    } catch (error) {
      console.log("error generate", error);
      loading.value = false;
      return null;
    }
  };

  const getAll = async (walletAddress) => {
    if (localStorage.getItem("duneFeatures"))
      return JSON.parse(localStorage.getItem("duneFeatures"));

    return Promise.all(
      Object.keys(QUERY_IDs).map((QUERY_ID) =>
        requestDune(walletAddress, QUERY_ID)
      )
    );
  };

  const duneFunctions = {
    get,
    getAll,
  };

  return {
    loading,
    duneFunctions,
  };
};
