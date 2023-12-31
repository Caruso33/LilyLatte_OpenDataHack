import { ethers, Signer } from "ethers";
import { ref } from "vue";

const NETWORK = "maticmum";

let provider = new ethers.providers.Web3Provider(window.ethereum);

export const getWallet = async (provider) =>
  provider.request({
    method: "eth_requestAccounts",
  });

export const useLatteEth = () => {
  const instance = ref(null);
  const walletAddress = ref("");

  let signer;

  /**
   * @returns {Promise<Signer>} ethers signer
   */
  const getInstance = async (force = false) => {
    if (instance.value && !force) return instance.value;

    provider = new ethers.providers.Web3Provider(window.ethereum);

    signer = provider.getSigner();

    const wallet = await signer.getAddress();
    walletAddress.value = wallet;

    return signer;
  };

  const changeNetwork = async () => {
    provider.Network.add({
      name: "customNetwork",
      chainId: 3141,
      _defaultProvider: () =>
        new ethers.providers.JsonRpcProvider(
          "https://customnetwork-rpc-url.com"
        ),
    });
  };

  const getTransactions = async () => {
    const ethScanProvider = new ethers.providers.EtherscanProvider(NETWORK);

    const signer = provider.getSigner();
    const wallet = await signer.getAddress();

    return await ethScanProvider.getHistory(wallet);
  };

  return {
    getInstance,
    getTransactions,
  };
};
