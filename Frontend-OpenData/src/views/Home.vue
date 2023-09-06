<template>
  <div class="expand d-flex flex-column client">
    <div class="f">
      <base-button @click="prepareTransaction" class="ma-1">
        Upload to lighthouse
      </base-button>
      <base-button
        :loading="tableLandLoading"
        @click="createTable"
        class="ma-1"
      >
        Create Table in Tableland
      </base-button>
      <base-button
        :loading="tableLandLoading"
        @click="insertRecord"
        class="ma-1"
      >
        Insert Sample to Table
      </base-button>
      <base-button
        :loading="tableLandLoading"
        @click="fetchTableRecords"
        class="ma-1"
      >
        Fetch Data from Tableland
      </base-button>
    </div>

    <label>Table Name</label>
    <input v-model="tableName" />

    <div v-if="tableRef" class="mt-2">Table Ref: {{ tableRef }}</div>

    <table v-if="tableRecords.length" class="mt-3">
      <tr>
        <th>ID</th>
        <th>Value</th>
      </tr>
      <tr v-for="(record, i) in tableRecords" :key="'record' + i">
        <td>{{ record.id }}</td>
        <td>{{ record.val }}</td>
      </tr>
    </table>

    <a
      v-if="uploadResponse"
      :href="`https://gateway.lighthouse.storage/ipfs/${uploadResponse.Hash}`"
      target="_blank"
      class="mb-2"
    >
      Link
    </a>

    <span v-if="uploadResponse">CID: {{ uploadResponse.Hash }}</span>
    <span v-else-if="loading">Fetching Transactions...</span>
    <code class="mt-2">
      {{ uploadResponse }}
    </code>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useLatteEth } from "@/composables/latte";
// import tableLand from "@/constants/tableLand";
import { useTableLand } from "@/composables/tableLand";

import lighthouse from "@lighthouse-web3/sdk";

import { useToast } from "vue-toastification";

const loading = ref(false);
const uploadResponse = ref("");
const tableName = ref("");
const tableRecords = ref([]);

const latteEth = useLatteEth();
const {
  setSigner,
  tableRef,
  tableLandFunctions,
  loading: tableLandLoading,
} = useTableLand();

const toaster = useToast();

const lightHouseAPIKey = "d8be86a7.6e6cc09c17184503ae9119cead8c0a00";

onMounted(async () => {
  const signer = await latteEth.getInstance();
  setSigner(signer);

  tableName.value = tableRef.value ? tableRef.value.split("_")[0] : "";
});

const prepareTransaction = async () => {
  loading.value = true;

  const myTransactions = await latteEth.getTransactions();
  console.log(myTransactions);

  const data = JSON.stringify(myTransactions);
  const blob = new Blob([data], { type: "application/json;charset=utf-8" });

  const fileName = "myTransactions.json";
  blob.name = fileName;

  uploadToLightHouse(blob);
};

const uploadToLightHouse = async (buffer) => {
  const _uploadResponse = await lighthouse.uploadBuffer(
    buffer,
    lightHouseAPIKey
  );

  uploadResponse.value = _uploadResponse.data;

  console.log("uploadResponse", uploadResponse.value);
  loading.value = false;
};

const fetchTableRecords = async () => {
  if (!tableName.value.length) {
    toaster.error("Please create your table first");
    return;
  }

  const results = await tableLandFunctions.getRows();
  console.log(results);

  tableRecords.value = results;
};

const createTable = async () => {
  if (!tableName.value.length) {
    toaster.error("Please specify your table name first");
    return;
  }

  const tableRef = await tableLandFunctions.createTable(tableName.value);
  toaster.success(`Successfully created a table named ${tableRef}`);
};

const insertRecord = async () => {
  const tx = await tableLandFunctions.insertIntoTable();
};
</script>

<style scoped>
.client {
  max-width: 50rem;
  width: 100%;
  margin: 16px auto;
}

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #a873e9;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #bb95ea;
}
</style>
