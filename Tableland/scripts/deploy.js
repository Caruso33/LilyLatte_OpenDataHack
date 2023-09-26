// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat")

async function main() {
  const [deployer] = await hre.ethers.getSigners()

  const OpenData = await hre.ethers.getContractFactory("LilyLatte", deployer)
  console.log("Deploying contracrt . . .")

  const contractNFTaddress = "0x717ab48149c1ae01cf4e23fdb577b058c9b630a0"
  const open_data = await OpenData.deploy(contractNFTaddress,{
    from: deployer.address,
    args: [],
    // gasLimit: 1000000000
  })

  await open_data.waitForDeployment()

  console.log(`Contract deploy on this address ${await open_data.getAddress()}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
