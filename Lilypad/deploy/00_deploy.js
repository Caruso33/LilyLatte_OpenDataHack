require("hardhat-deploy")
require("hardhat-deploy-ethers")

const { networkConfig } = require("../helper-hardhat-config")

const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

module.exports = async ({ deployments }) => {
    const { deploy } = deployments
    console.log("Wallet Ethereum Address:", wallet.address)
    const chainId = network.config.chainId

    await deploy("LilypadClient", {
        from: wallet.address,
        args: ["0x422F325AA109A3038BDCb7B03Dd0331A4aC2cD1a"],
        log: true,
    })
}
