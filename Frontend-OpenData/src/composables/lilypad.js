import { onMounted, ref } from "vue";
import { utils, providers, Contract } from "ethers";
import { LilypadAbi } from "@/constants/lilypad-abi";

// Lilypad deployed Contract address
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

  const requestAnswers = async (cid) => {
    loading.value = true;
    try {
      const overrides = {
        gasLimit: 3000000,
        value: utils.parseEther("4"),
      };

      const tx = await contract.runFastChat(
        `https://gateway.lighthouse.storage/ipfs/${cid}`,
        overrides
      );

      const receipt = await tx.wait();

      loading.value = false;
      return receipt;
    } catch (error) {
      console.log("error generate", error);
      loading.value = false;
      throw "error in running chat";
    }
  };

  const requestAndGetNewResults = async (cid) => {
    try {
      const previousResults = await getResults();

      const receipt = await requestAnswers(cid);

      const newResults = await new Promise((resolve) => {
        const intervalId = setInterval(async () => {
          const results = await getResults();

          console.log(
            "results in interval",
            results.length,
            previousResults.length,
            results
          );

          if (results.length > previousResults.length) {
            clearInterval(intervalId);
            resolve(results);
          }
        }, 2000);
      });

      console.log("requestAndGetNewResults", newResults);

      return newResults;
    } catch (error) {
      console.log(error);
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
    requestAnswers,
    requestAndGetNewResults,
  };

  return {
    loading,
    lilypadFunctions,
  };
};
