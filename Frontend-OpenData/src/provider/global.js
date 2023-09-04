export const getWallet = async (provider) =>
  provider.request({
    method: "eth_requestAccounts",
  });
export default {
  getWallet,
};
