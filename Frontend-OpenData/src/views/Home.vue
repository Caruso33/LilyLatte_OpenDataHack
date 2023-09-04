<template>
  <div class="expand d-flex flex-column client">
    <a
      v-if="uploadResponse"
      :href="`https://gateway.lighthouse.storage/ipfs/${uploadResponse.Hash}`"
      target="_blank"
      class="mb-2"
    >
      Link
    </a>

    <span v-if="uploadResponse">CID: {{ uploadResponse.Hash }}</span>
    <span v-else>Fetching Transactions...</span>
    <code class="mt-2">
      {{ uploadResponse }}
    </code>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useLatteEth } from "@/composables/latte";

import lighthouse from "@lighthouse-web3/sdk";

const uploadResponse = ref("");

const latteEth = useLatteEth();

const lightHouseAPIKey = "d8be86a7.6e6cc09c17184503ae9119cead8c0a00";

onMounted(async () => {
  const myTransactions = await latteEth.getTransactions();
  console.log(myTransactions);

  const data = JSON.stringify(myTransactions);
  const blob = new Blob([data], { type: "application/json;charset=utf-8" });

  const fileName = "myTransactions.json";
  blob.name = fileName;

  uploadToLightHouse(blob);
});

const uploadToLightHouse = async (buffer) => {
  const _uploadResponse = await lighthouse.uploadBuffer(
    buffer,
    lightHouseAPIKey
  );

  uploadResponse.value = _uploadResponse.data;

  console.log("uploadResponse", uploadResponse.value);
};
</script>

<style scoped>
.client {
  max-width: 50rem;
  width: 100%;
  margin: 16px auto;
}
</style>
