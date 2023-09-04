import { ethers } from "ethers";
import { ref } from "vue";

const NETWORK = "maticmum";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export const getWallet = async (provider) =>
  provider.request({
    method: "eth_requestAccounts",
  });

export const useLatteEth = () => {
  const instance = ref(null);
  const walletAddress = ref("");

  let signer;

  const getInstance = async () => {
    if (instance.value) return instance.value;

    signer = provider.getSigner();

    const wallet = await signer.getAddress();
    walletAddress.value = wallet;

    return signer;
  };

  const getTransactions = async () => {
    const ethScanProvider = new ethers.providers.EtherscanProvider(NETWORK);

    const signer = provider.getSigner();
    const wallet = await signer.getAddress();

    return await ethScanProvider.getHistory(wallet);
  };

  return {
    getTransactions,
  };
};
