export async function getChainId() {
  return window.ethereum.request({
    method: "eth_chainId",
  });
}

export async function switchNetwork(chainId) {
  const currentChainId = await getChainId();
  if (currentChainId == chainId) return;

  return window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId }],
  });
}
