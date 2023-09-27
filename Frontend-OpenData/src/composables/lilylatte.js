import { onMounted, ref } from "vue";
import { utils, providers, Contract } from "ethers";
import { LilyLatteAbi } from "@/constants/lilylatte-abi";
import { getWallet } from "@/constants/ethereum-functions";

// Lilylatte deployed Contract address
export const CONTRACT_ADDRESS = "0x7b1ed1a7783cc58619147191719cee8e9702888e";

export const useLilyLatte = () => {
  let provider, contract, signer;

  const loading = ref(false);

  onMounted(async () => {
    initContract();
  });

  const initContract = async () => {
    provider = new providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new Contract(CONTRACT_ADDRESS, LilyLatteAbi, signer);
  };

  const requestDialogTokenAccess = async (dialogCid) => {
    loading.value = true;

    try {
      const overrides = {
        gasLimit: 90000000,
        value: utils.parseEther("0.1"),
      };

      const tx = await contract.requestDialogTokenAccess(dialogCid, overrides);

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

  const addOpinionPolls = async (tablelandRowIds) => {
    loading.value = true;

    const overrides = {
      gasLimit: 900000000,
    };

    const tx = await contract.addOpinionPolls(tablelandRowIds, overrides);

    const receipt = await tx.wait();

    loading.value = false;

    return receipt;
  };

  const getOpinionPoll = async (rowId) => {
    loading.value = true;

    const tx = await contract.opinionPollMap(rowId);

    loading.value = false;

    return tx;
  };

  const voteOpinionPoll = async (tablelandRowId, votePro) => {
    loading.value = true;

    const overrides = {
      gasLimit: 90000000,
    };

    const tx = await contract.voteOpinionPoll(
      tablelandRowId,
      votePro,
      overrides
    );

    const receipt = await tx.wait();

    loading.value = false;
    return receipt;
  };

  const getOpinionTableLandRowIds = async () => {
    loading.value = true;

    const tx = await contract.getOpiniontablelandRowIds();

    console.log("getOpiniontablelandRowIds", tx);

    loading.value = false;
    return tx;
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
    console.log("tx addOwner", tx);

    const receipt = await tx.wait();
    console.log("receipt addOwner", receipt);

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

  const getOwnerToData = async (wallet) => {
    loading.value = true;

    const tx = await contract.ownerToData(wallet);

    loading.value = false;
    return tx;
  };

  const getWallets = async () => {
    loading.value = true;

    const tx = await contract.getOwnerList();

    console.log("getWallets", tx);

    loading.value = false;
    return tx;
  };

  const getMintedTokenId = async (dialogCID) => {
    loading.value = true;

    const tx = await contract.dialogMap(dialogCID);

    console.log("getMintedTokenId", tx);

    loading.value = false;
    return tx;
  };

  const balanceOf = async (wallet, tokenId) => {
    loading.value = true;

    const tx = await contract.balanceOf(wallet, tokenId);

    console.log("balanceOf", tx);

    loading.value = false;
    return tx;
  };

  const lilyLatteFunctions = {
    initContract,
    addOwner,
    addOwnerAsMember,
    addNewDialog,
    requestDialogTokenAccess,
    receiveDialogPayout,
    addOpinionPolls,
    voteOpinionPoll,
    addDataQuest,
    receiveDataQuestPayout,
    getOwnerToData,
    getWallets,
    getMintedTokenId,
    balanceOf,
    getOpinionTableLandRowIds,
    getOpinionPoll,
  };

  return {
    loading,
    lilyLatteFunctions,
  };
};
