import { ref } from "vue";
import { DuneClient, QueryParameter } from "@cowprotocol/ts-dune-client";

// API key name: opendata
const API_KEY = "SLGkV11PY5yhtQYvmOFTazP8aRwSqNUV";

const QUERY_ID = 3020734;

export const useDune = () => {
  const loading = ref(false);

  const get = async (walletAddress) => {
    loading.value = true;
    try {
      const client = new DuneClient(API_KEY);
      const parameters = [QueryParameter.text("wallet_address", walletAddress)];

      const { result } = await client.refresh(QUERY_ID, parameters);

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
