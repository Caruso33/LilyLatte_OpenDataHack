import { ref } from "vue";
import lighthouse from "@lighthouse-web3/sdk";

const API_KEY = "d8be86a7.6e6cc09c17184503ae9119cead8c0a00";

export const useLighthouse = () => {
  const loading = ref(false);

  const encryptionSignature = async (signer) => {
    const address = await signer.getAddress();
    const messageRequested = (await lighthouse.getAuthMessage(address)).data
      .message;
    const signedMessage = await signer.signMessage(messageRequested);

    return {
      signedMessage: signedMessage,
      publicKey: address,
    };
  };

  const upload = async (buffer) => {
    loading.value = true;

    const _uploadResponse = await lighthouse.uploadBuffer(buffer, API_KEY);

    loading.value = false;

    return _uploadResponse.data;
  };

  const uploadJson = async (data) => {
    const blob = new Blob([JSON.stringify(data)], {
      type: "application/json;charset=utf-8",
    });

    const fileName = "question.json";
    blob.name = fileName;

    const result = await lighthouseFunctions.upload(blob);

    console.log("result of uploadFastChatQuestion", result);

    return result?.Hash || "";
  };

  const progressCallback = (progressData) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    console.log(percentageDone);
  };

  const uploadEncrypted = async (signer, text) => {
    loading.value = true;

    console.log("text", text);

    const signature = await encryptionSignature(signer);

    console.log("signature", signature);

    const { data } = await lighthouse.textUploadEncrypted(
      text,
      API_KEY,
      signature.publicKey,
      signature.signedMessage,
      "conversation_open_data",
      progressCallback
    );

    loading.value = false;

    return data;
  };

  const decrypt = async (signer, CID) => {
    loading.value = true;

    try {
      const { publicKey, signedMessage } = await encryptionSignature(signer);

      const keyObject = await lighthouse.fetchEncryptionKey(
        CID,
        publicKey,
        signedMessage
      );

      const decrypted = await lighthouse.decryptFile(CID, keyObject.data.key);
      console.log("decrypted", decrypted);

      loading.value = false;

      return new Promise((resolve, reject) => {
        let rejectTimeout = setTimeout(() => {
          reject(null);
        }, 60000);

        const reader = new FileReader();

        reader.onload = (event) => {
          if (rejectTimeout) clearTimeout(rejectTimeout);
          resolve(event.target.result);
        };

        reader.readAsText(decrypted);
      });
    } catch (error) {
      console.log("error", error);
      loading.value = false;
      return null;
    }
  };

  const putAccessConditions = async (signer, CID) => {
    loading.value = true;

    const conditions = [
      {
        id: 1,
        chain: "FVM",
        method: "balanceOf",
        standardContractType: "ERC20",
        contractAddress: "0x48c7f07f6B3d58C03bf39260189DbfEA2d73520B",
        returnValueTest: { comparator: ">=", value: "1" },
        parameters: [":userAddress"],
      },
    ];

    // Aggregator is what kind of operation to apply to access conditions
    // Suppose there are two conditions then you can apply ([1] and [2]), ([1] or [2]), !([1] and [2]).
    const aggregator = "([1])";
    const { publicKey, signedMessage } = await encryptionSignature(signer);

    const { data } = await lighthouse.applyAccessCondition(
      publicKey,
      CID,
      signedMessage,
      conditions,
      aggregator
    );

    console.log("putAccessConditions", data);
    loading.value = false;

    return data;
  };

  const getUploads = async (signer) => {
    const address = await signer.getAddress();
    console.log("address before getUploads", address);
    return await lighthouse.getUploads(address);
  };

  const lighthouseFunctions = {
    upload,
    uploadJson,
    uploadEncrypted,
    decrypt,
    getUploads,
    putAccessConditions,
  };

  return {
    loading,
    lighthouseFunctions,
  };
};
