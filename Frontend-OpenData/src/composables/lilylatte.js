import { onMounted, ref } from "vue";
import { utils, providers, Contract } from "ethers";
import { LilyLatteAbi } from "@/constants/lilylatte-abi";
import { getWallet } from "@/constants/ethereum-functions";

// Lilylatte deployed Contract address
export const CONTRACT_ADDRESS = "0x3311bacc036f0007638cf63820a1bdee00903678";

export const useLilyLatte = () => {
  let provider, contract, signer;

  const loading = ref(false);

  onMounted(async () => {
    provider = new providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new Contract(CONTRACT_ADDRESS, LilyLatteAbi, signer);
  });

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
      gasLimit: 90000000,
      // value: utils.parseEther("4"),
    };

    const tx = await contract.addOwner(tableRef, overrides);

    const receipt = await tx.wait();

    loading.value = false;
    return receipt;
  };

  const addOwnerAsMember = async (nftCid) => {
    loading.value = true;
    const overrides = {
      gasLimit: 90000000,
      // value: utils.parseEther("4"),
    };

    const tx = await contract.addOwnerAsMember(nftCid, overrides);

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
      gasLimit: 90000000,
      // value: utils.parseEther("4"),
    };

    const tx = await contract.addNewDialog(dialogCID, overrides);

    const receipt = await tx.wait();

    loading.value = false;
    return receipt;
  };

  const getOwnerToData = async () => {
    loading.value = true;

    const wallet = await signer.getAddress();

    console.log("wallet", wallet);

    const tx = await contract.ownerToData(wallet);

    console.log("getOwnerToData", tx);

    loading.value = false;
    return tx;
  };

  const lilyLatteFunctions = {
    addOwner,
    addOwnerAsMember,
    addNewDialog,
    requestDialogTokenAccess,
    receiveDialogPayout,
    addOpinionPoll,
    voteOpinionPoll,
    addDataQuest,
    receiveDataQuestPayout,
    getOwnerToData,
  };

  return {
    loading,
    lilyLatteFunctions,
  };
};
