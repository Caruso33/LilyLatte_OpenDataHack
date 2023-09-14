import { onMounted, ref } from "vue";
import { utils, providers, Contract } from "ethers";
import { LilypadAbi } from "@/constants/lilypad-abi";

// My Lilypad deployed Contract address
const CONTRACT_ADDRESS = "0x86406BD74F67fB3245E380294d59A5d2350Ce20e";

export const useLilypad = () => {
  let provider, contract, signer;

  const loading = ref(false);

  onMounted(async () => {
    provider = new providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new Contract(CONTRACT_ADDRESS, LilypadAbi, signer);
  });

  const generate = async (prompt) => {
    loading.value = true;
    try {
      const overrides = {
        gasLimit: 3000000,
        value: utils.parseEther("4"),
      };

      const tx = await contract.runSDXL(prompt, overrides);

      const receipt = await tx.wait();

      loading.value = false;
      return receipt;
    } catch (error) {
      console.log("error generate", error);
      loading.value = false;
      return null;
    }
  };

  const getResults = async () => {
    const tx = await contract.fetchAllResults();

    return tx;
  };

  const lilypadFunctions = {
    generate,
    getResults,
  };

  return {
    loading,
    lilypadFunctions,
  };
};
