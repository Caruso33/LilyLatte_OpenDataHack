import { onMounted, ref } from "vue";
import { utils, providers, Contract } from "ethers";
import { LilyLatteAbi } from "@/constants/lilylatte-abi";
import { getWallet } from "@/constants/ethereum-functions";

// Lilylatte deployed Contract address
export const CONTRACT_ADDRESS = "0x4140c268adae01bb62f1aa8d043000c36e692731";

export const useLilyLatte = () => {
  let provider, contract, signer;

  const loading = ref(false);

  onMounted(async () => {
    provider = new providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new Contract(CONTRACT_ADDRESS, LilyLatteAbi, signer);
  });

  const addPfpToOwner = async (pfpCid) => {
    loading.value = true;

    try {
      const wallet = await getWallet();

      const tx = await contract.addPfpToOwner(pfpCid);

      const receipt = await tx.wait();

      return receipt;
    } catch (error) {
      console.log("error addPfpToOwner", error);
    } finally {
      loading.value = false;
    }
  };

  const addOwnerAsMember = async () => {
    loading.value = true;

    try {
      const wallet = await getWallet();

      const tx = await contract.addOwnerAsMember();

      const receipt = await tx.wait();

      return receipt;
    } catch (error) {
      console.log("error addOwnerAsMember", error);
    } finally {
      loading.value = false;
    }
  };

  const requestDialogTokenAccess = async (dialogCid) => {
    loading.value = true;

    try {
      const wallet = await getWallet();

      const tx = await contract.requestDialogTokenAccess(dialogCid);

      const receipt = await tx.wait();

      return receipt;
    } catch (error) {
      console.log("error requestDialogTokenAccess", error);
    } finally {
      loading.value = false;
    }
  };

  const receiveDialogPayout = async (dialogCid) => {
    loading.value = true;

    try {
      const wallet = await getWallet();

      const tx = await contract.receiveDialogPayout(dialogCid);

      const receipt = await tx.wait();

      return receipt;
    } catch (error) {
      console.log("error receiveDialogPayout", error);
    } finally {
      loading.value = false;
    }
  };
  const addOpinionPoll = async (tag, rowId, columnId) => {
    loading.value = true;

    try {
      const wallet = await getWallet();

      const tx = await contract.addOpinionPoll(tag, rowId, columnId);

      const receipt = await tx.wait();

      return receipt;
    } catch (error) {
      console.log("error addOpinionPoll", error);
    } finally {
      loading.value = false;
    }
  };
  const voteOpinionPoll = async (tag, pollIndex, votePro) => {
    loading.value = true;

    try {
      const wallet = await getWallet();

      const tx = await contract.voteOpinionPoll(tag, pollIndex, votePro);

      const receipt = await tx.wait();

      return receipt;
    } catch (error) {
      console.log("error voteOpinionPoll", error);
    } finally {
      loading.value = false;
    }
  };
  const addDataQuest = async (ownerAddr, questionCid) => {
    loading.value = true;

    try {
      const wallet = await getWallet();

      const tx = await contract.addDataQuest(ownerAddr, questionCid);

      const receipt = await tx.wait();

      return receipt;
    } catch (error) {
      console.log("error addDataQuest", error);
    } finally {
      loading.value = false;
    }
  };
  const receiveDataQuestPayout = async (dataQuestCid, answerCid) => {
    loading.value = true;

    try {
      const wallet = await getWallet();

      const tx = await contract.receiveDataQuestPayout(dataQuestCid, answerCid);

      const receipt = await tx.wait();

      return receipt;
    } catch (error) {
      console.log("error receiveDataQuestPayout", error);
    } finally {
      loading.value = false;
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
    addOwner,
    addPfpToOwner,
    addOwnerAsMember,
    addNewDialog,
    requestDialogTokenAccess,
    receiveDialogPayout,
    addOpinionPoll,
    voteOpinionPoll,
    addDataQuest,
    receiveDataQuestPayout,
  };

  return {
    loading,
    lilyLatteFunctions,
  };
};
