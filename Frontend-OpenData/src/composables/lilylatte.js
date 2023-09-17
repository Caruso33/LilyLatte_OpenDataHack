import { onMounted, ref } from "vue"
import { utils, providers, Contract } from "ethers"
import { LilyLatteAbi } from "@/constants/lilylatte-abi"
import { getWallet } from "@/constants/ethereum-functions"

// Lilylatte deployed Contract address
export const CONTRACT_ADDRESS = "0xef6d29ddff75c3ac09c7aa37b3ea58aa2bb24eb5"

export const useLilyLatte = () => {
  let provider, contract, signer

  const loading = ref(false)

  onMounted(async () => {
    provider = new providers.Web3Provider(window.ethereum)
    signer = provider.getSigner()
    contract = new Contract(CONTRACT_ADDRESS, LilyLatteAbi, signer)
  })

  const addOwner = async (tableId) => {
    loading.value = true

    try {
      const wallet = await getWallet()

      const tx = await contract.addOwner(tableId)

      const receipt = await tx.wait()

      return receipt
    } catch (error) {
      console.log("error addOwner", error)
    } finally {
      loading.value = false
    }
  }
  const addPfpToOwner = async (pfpCid) => {
    loading.value = true

    try {
      const wallet = await getWallet()

      const tx = await contract.addPfpToOwner(pfpCid)

      const receipt = await tx.wait()

      return receipt
    } catch (error) {
      console.log("error addPfpToOwner", error)
    } finally {
      loading.value = false
    }
  }
  const addOwnerAsMember = async () => {
    loading.value = true

    try {
      const wallet = await getWallet()

      const tx = await contract.addOwnerAsMember()

      const receipt = await tx.wait()

      return receipt
    } catch (error) {
      console.log("error addOwnerAsMember", error)
    } finally {
      loading.value = false
    }
  }
  const addNewDialog = async (newDialogCid) => {
    loading.value = true

    try {
      const wallet = await getWallet()

      const tx = await contract.addNewDialog(newDialogCid)

      const receipt = await tx.wait()

      return receipt
    } catch (error) {
      console.log("error addNewDialog", error)
    } finally {
      loading.value = false
    }
  }
  const requestDialogTokenAccess = async (dialogCid) => {
    loading.value = true

    try {
      const wallet = await getWallet()

      const tx = await contract.requestDialogTokenAccess(dialogCid)

      const receipt = await tx.wait()

      return receipt
    } catch (error) {
      console.log("error requestDialogTokenAccess", error)
    } finally {
      loading.value = false
    }
  }
  const receiveDialogPayout = async (dialogCid) => {
    loading.value = true

    try {
      const wallet = await getWallet()

      const tx = await contract.receiveDialogPayout(dialogCid)

      const receipt = await tx.wait()

      return receipt
    } catch (error) {
      console.log("error receiveDialogPayout", error)
    } finally {
      loading.value = false
    }
  }
  const addOpinionPoll = async (tag, rowId, columnId) => {
    loading.value = true

    try {
      const wallet = await getWallet()

      const tx = await contract.addOpinionPoll(tag, rowId, columnId)

      const receipt = await tx.wait()

      return receipt
    } catch (error) {
      console.log("error addOpinionPoll", error)
    } finally {
      loading.value = false
    }
  }
  const voteOpinionPoll = async (tag, pollIndex, votePro) => {
    loading.value = true

    try {
      const wallet = await getWallet()

      const tx = await contract.voteOpinionPoll(tag, pollIndex, votePro)

      const receipt = await tx.wait()

      return receipt
    } catch (error) {
      console.log("error voteOpinionPoll", error)
    } finally {
      loading.value = false
    }
  }
  const addDataQuest = async (ownerAddr, questionCid) => {
    loading.value = true

    try {
      const wallet = await getWallet()

      const tx = await contract.addDataQuest(ownerAddr, questionCid)

      const receipt = await tx.wait()

      return receipt
    } catch (error) {
      console.log("error addDataQuest", error)
    } finally {
      loading.value = false
    }
  }
  const receiveDataQuestPayout = async (dataQuestCid, answerCid) => {
    loading.value = true

    try {
      const wallet = await getWallet()

      const tx = await contract.receiveDataQuestPayout(dataQuestCid, answerCid)

      const receipt = await tx.wait()

      return receipt
    } catch (error) {
      console.log("error receiveDataQuestPayout", error)
    } finally {
      loading.value = false
    }
  }

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
  }

  return {
    loading,
    lilyLatteFunctions,
  }
}
