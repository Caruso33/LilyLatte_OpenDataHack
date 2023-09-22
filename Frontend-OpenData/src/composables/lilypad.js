import { onMounted, ref } from "vue";
import { utils, providers, Contract } from "ethers";
import { LilypadAbi } from "@/constants/lilypad-abi";
import { switchNetwork } from "@/constants/ethereum-functions";
import { Lilypad } from "@/constants/chains";

// Lilypad deployed Contract address
const CONTRACT_ADDRESS = "0x4140c268adae01bb62f1aa8d043000c36e692731";

export const useLilypad = () => {
  let provider, contract, signer;

  const loading = ref(false);

  onMounted(async () => {
    initContract();
  });

  const initContract = async () => {
    provider = new providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new Contract(CONTRACT_ADDRESS, LilypadAbi, signer);
  };

  const generate = async (prompt) => {
    loading.value = true;
    try {
      await switchNetwork(Lilypad.chainId);
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
      throw error;
    }
  };

  const sendMessage = async (cid) => {
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

  const sendAndGetNewResults = async (cid) => {
    try {
      const previousResults = await getMyCIDs();

      const receipt = await sendMessage(cid);

      const newResults = await new Promise((resolve) => {
        const intervalId = setInterval(async () => {
          const results = await getMyCIDs();

          console.log(
            "results in interval from sendAndGetNewResults function",
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

      console.log("sendAndGetNewResults", newResults);

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

  const getMyCIDs = async () => {
    const wallet = await signer.getAddress();
    console.log("wallet before fetch data", wallet);

    const tx = await contract.returnUserOwner(wallet);

    console.log("getMyCIDs", tx);

    return tx;
  };

  const lilypadFunctions = {
    initContract,
    generate,
    getResults,
    getMyCIDs,
    sendMessage,
    sendAndGetNewResults,
  };

  return {
    loading,
    lilypadFunctions,
  };
};
