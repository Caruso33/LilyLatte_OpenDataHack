import { onMounted } from "vue";
import ethers from "ethers";
import { LilypadAbi } from "@/constants/lilypad-abi";

// My Lilypad deployed Contract address
const CONTRACT_ADDRESS = "0x18F6c7059727D3D5a614c8D051D4956A47B6dFc9";

export const useLilypad = () => {
  let provider, contract, signer;

  const loading = ref(false);

  onMounted(async () => {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, LilypadAbi, signer);
  });

  const generate = async (prompt) => {
    const overrides = {
      gasLimit: 900000,
      value: ethers.parseEther("2"),
    };

    const tx = await contract.runSDXL(prompt, overrides);

    const receipt = await tx.wait();

    return receipt;
  };

  const lilypadFunctions = {
    generate,
  };

  return {
    loading,
    tableRef,
    lilypadFunctions,
  };
};
