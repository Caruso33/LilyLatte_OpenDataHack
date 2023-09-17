import { onMounted, ref } from "vue";
import { utils, providers, Contract } from "ethers";
import { LilyLatteAbi } from "@/constants/lilylatte-abi";
import { getWallet } from "@/constants/ethereum-functions";

// Lilylatte deployed Contract address
export const CONTRACT_ADDRESS = "0xB9Fb2370AE80B34CAC5b29CE0B98531A218b9FD0";

export const useLilyLatte = () => {
  let provider, contract, signer;

  const loading = ref(false);

  onMounted(async () => {
    provider = new providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new Contract(CONTRACT_ADDRESS, LilyLatteAbi, signer);
  });

  // todo: add other contract's functions
  const mintNewDialogToken = async (chatsCid) => {
    loading.value = true;
    try {
      const wallet = await getWallet();

      const overrides = {
        gasLimit: 3000000,
        value: utils.parseEther("4"),
      };

      const tx = await contract.mintNewDialogToken(wallet, chatsCid, overrides);

      const receipt = await tx.wait();

      loading.value = false;
      return receipt;
    } catch (error) {
      console.log("error generate", error);
      loading.value = false;
      return null;
    }
  };

  const addOwner = async (tableRef) => {
    loading.value = true;
    const overrides = {
      gasLimit: 3000000,
      // value: utils.parseEther("4"),
    };

    const tx = await contract.addOwner(tableRef, overrides);

    const receipt = await tx.wait();

    loading.value = false;
    return receipt;
  };

  const addOpinionPol = async (tableRef) => {
    loading.value = true;
    const overrides = {
      gasLimit: 3000000,
      // value: utils.parseEther("4"),
    };

    const tx = await contract.addOwner(tableRef, overrides);

    const receipt = await tx.wait();

    loading.value = false;
    return receipt;
  };

  const addNewDialog = async (dialogCID) => {
    loading.value = true;
    const overrides = {
      gasLimit: 3000000,
      // value: utils.parseEther("4"),
    };

    const tx = await contract.addNewDialog(dialogCID, overrides);

    const receipt = await tx.wait();

    loading.value = false;
    return receipt;
  };

  const lilyLatteFunctions = {
    mintNewDialogToken,
    addOwner,
    addNewDialog,
  };

  return {
    loading,
    lilyLatteFunctions,
  };
};
