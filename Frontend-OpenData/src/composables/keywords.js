import { onMounted, ref } from "vue";
import { providers, Contract } from "ethers";
import { KeywordsAbi } from "@/constants/keywords-abi";

// keywords deployed Contract address
const CONTRACT_ADDRESS = "0xF8c47fd0C37e02A022D43f72A3e839608359bB5c";

export const useKeywords = () => {
  let provider, contract, signer;

  const loading = ref(false);

  onMounted(async () => {
    initContract();
  });

  const initContract = async () => {
    provider = new providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new Contract(CONTRACT_ADDRESS, KeywordsAbi, signer);
  };

  const insert = async (values) => {
    loading.value = true;

    const overrides = {
      gasLimit: 90000000,
    };

    const tx = await contract.insert(values, 0, overrides);

    const receipt = await tx.wait();

    loading.value = false;
    return receipt;
  };

  const getTableId = async () => {
    return await contract._tableId();
  };

  const keywordFunctions = {
    initContract,
    insert,
    getTableId,
  };

  return {
    loading,
    keywordFunctions,
  };
};
