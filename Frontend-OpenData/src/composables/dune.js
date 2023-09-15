import { ref } from "vue";
import { DuneClient, QueryParameter } from "@cowprotocol/ts-dune-client";

// API key name: opendata
const API_KEY = "SLGkV11PY5yhtQYvmOFTazP8aRwSqNUV";

const QUERY_IDs = {
  wallet_age: 3024874,
  dex: 3024384,
  top_evm_holding: 3025013,
  number_of_tx_by_chain: 3025089,
};

export const useDune = () => {
  const loading = ref(false);

  const get = async (walletAddress, queryName) => {
    loading.value = true;
    try {
      const client = new DuneClient(API_KEY);
      // const parameters = [QueryParameter.text("wallet_address", walletAddress)];
      const parameters = [
        QueryParameter.text(
          "wallet_address",
          "0x275ab2f4e5dd3cb7aa8ec4f16a79f4023cc5f7ef"
        ),
      ];

      const { result } = await client.refresh(QUERY_IDs[queryName], parameters);

      loading.value = false;
      return result;
    } catch (error) {
      console.log("error generate", error);
      loading.value = false;
      return null;
    }
  };

  const duneFunctions = {
    get,
  };

  return {
    loading,
    duneFunctions,
  };
};
