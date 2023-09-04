import Web3, { Contract } from "web3";

class MetamaskProvider {
  /**
   * @type {Web3} #provider
   */
  #provider;
  #wallet;
  #definedChainId = "0x89";

  constructor({ provider }) {
    this.#provider = this.createWeb3Instance(provider);
  }

  /**
   *
   * @returns {Promise.<Object>} - MetamaskProvider instance as promise
   */
  static create() {
    return new MetamaskProvider({ provider: window.ethereum });
  }

  createWeb3Instance(provider) {
    return new Web3(provider);
  }

  /**
   * @returns {any} wallet
   */
  get wallet() {
    return this.#wallet;
  }

  /**
   * @returns {Web3} provider
   */
  getProvider() {
    return this.#provider;
  }

  async getChainId() {
    return this.#provider.currentProvider.request({
      method: "eth_chainId",
    });
  }

  async addNetwork(params) {
    return this.#provider.currentProvider.request({
      method: "wallet_addEthereumChain",
      params,
    });
  }

  async switchNetwork(chainId) {
    return this.#provider.currentProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId }],
    });
  }

  /**
   *
   * @returns {Contract} contract
   */
  createContract(ABI, address) {
    const contract = new this.#provider.eth.Contract(ABI, address);
    return contract;
  }

  async getBalance() {
    return await this.#provider.eth.getBalance(this.#wallet);
  }

  /**
   *
   * @returns {any} wallet
   */
  async getWallet() {
    // try {
    //   const chainId = await this.getChainId();

    //   if (chainId !== this.#definedChainId) {
    //     const polygonParams = [
    //       {
    //         chainId: this.#definedChainId,
    //         chainName: "Polygon Mainnet",
    //         nativeCurrency: {
    //           name: "MATIC",
    //           symbol: "MATIC",
    //           decimals: 18,
    //         },
    //         rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
    //         blockExplorerUrls: ["https://polygonscan.com/"],
    //       },
    //     ];

    //     await this.addNetwork(polygonParams);

    //     await this.switchNetwork(this.#definedChainId);
    //   }
    // } catch (error) {
    //   const errorNumber = error.code;
    //   const errorCode = this._getErrorCode(errorNumber);

    //   throw {
    //     code: errorCode ?? "unknown",
    //     message: error.message,
    //     details: error,
    //   };
    // }

    const [walletId] = await this.#provider.currentProvider.request({
      method: "eth_requestAccounts",
    });

    this.#wallet = walletId;

    return this.#wallet;
  }
}

export default MetamaskProvider;
