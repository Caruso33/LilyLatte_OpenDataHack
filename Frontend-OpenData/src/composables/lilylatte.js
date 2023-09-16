import { onMounted, ref } from "vue";
import { utils, providers, Contract } from "ethers";
import { LilyLatteAbi } from "@/constants/lilylatte-abi";
import { getWallet } from "@/constants/ethereum-functions";

// Lilylatte deployed Contract address
export const CONTRACT_ADDRESS = "0xef6d29ddff75c3ac09c7aa37b3ea58aa2bb24eb5";

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

  const lilyLatteFunctions = {
    mintNewDialogToken,
  };

  return {
    loading,
    lilyLatteFunctions,
  };
};
