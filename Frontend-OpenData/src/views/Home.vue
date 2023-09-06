<template>
  <div class="expand d-flex flex-column client">
    <div class="d-flex">
      <base-button
        :loading="lighthouseLoading || loading"
        @click="uploadEncryptedTransactions"
        class="ma-1"
      >
        Upload to lighthouse
      </base-button>
      <base-button
        :loading="lighthouseLoading"
        @click="decryptFile"
        class="ma-1"
      >
        Decrypt lighthouse file
      </base-button>
      <!-- <base-button
        :loading="lighthouseLoading"
        @click="getUploads"
        class="ma-1"
      >
        Get Uploads
      </base-button> -->
    </div>

    <div class="d-flex">
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

    <label>File CID</label>
    <input v-model="CID" />

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
import { useTableLand } from "@/composables/tableLand";
import { useLighthouse } from "@/composables/lighthouse";

import { useToast } from "vue-toastification";

const loading = ref(false);
const CID = ref("");
const uploadResponse = ref("");
const tableName = ref("");
const tableRecords = ref([]);

const latteEth = useLatteEth();

const { lighthouseFunctions, loading: lighthouseLoading } = useLighthouse();

const {
  setSigner,
  tableRef,
  tableLandFunctions,
  loading: tableLandLoading,
} = useTableLand();

const toaster = useToast();

let signer = null;

onMounted(async () => {
  signer = await latteEth.getInstance();
  setSigner(signer);

  tableName.value = tableRef.value ? tableRef.value.split("_")[0] : "";
});

const uploadTransactions = async () => {
  loading.value = true;

  const myTransactions = await latteEth.getTransactions();
  console.log(myTransactions);

  const data = JSON.stringify(myTransactions);
  const blob = new Blob([data], { type: "application/json;charset=utf-8" });

  const fileName = "myTransactions.json";
  blob.name = fileName;

  const result = await lighthouseFunctions.upload(blob);

  uploadResponse.value = result;

  console.log("after upload data", result);
  loading.value = false;
};

const uploadEncryptedTransactions = async () => {
  loading.value = true;

  const myTransactions = await latteEth.getTransactions();
  console.log(myTransactions);

  const result = await lighthouseFunctions.uploadEncrypted(
    signer,
    JSON.stringify(myTransactions)
  );

  uploadResponse.value = result;

  console.log("after upload data (encrypted)", result);
  loading.value = false;
};

const decryptFile = async () => {
  if (!CID.value.length) {
    toaster.error("Please set CID first");
    return;
  }

  const result = await lighthouseFunctions.decrypt(signer, CID.value);

  console.log("result", result);
};

const getUploads = async () => {
  console.log(await lighthouseFunctions.getUploads(signer));
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
