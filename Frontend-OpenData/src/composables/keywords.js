import { onMounted, ref } from "vue";
import { providers, Contract } from "ethers";
import { KeywordsAbi } from "@/constants/keywords-abi";

// keywords deployed Contract address
const CONTRACT_ADDRESS = "0xD417cd80aAB1Acb46D3E677e87f692B241a608e6";

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
