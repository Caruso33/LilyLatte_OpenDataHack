require("dotenv").config()
const hre = require("hardhat")
const contractAbi = require("../artifacts/contracts/LilyLatte.sol/LilyLatte.json")

async function main() {
  const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

  //   const { deployments } = hre
  //   console.log({deployments})

  //   const contractName = "LilyLatte" // Replace with your contract name
  //   const deployment = await deployments.get(contractName)
  // console.log(`Deployment address: ${deployment.address}`)

  // hardhat run node first private key:
  const privateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  const signer = new hre.ethers.Wallet(privateKey, hre.ethers.provider)
  const contract = new hre.ethers.Contract(address, contractAbi.abi, signer)

  const tablelandRowIds = [1, 2, 3]
  const tx = await contract.addOpinionPolls(tablelandRowIds)

  await tx.wait()

  console.log("Opinion polls added successfully!")

  const result = await contract.getOpinionTablelandRowIds()

  console.log(`Opinion polls tablelandrowids ${result}`)
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
