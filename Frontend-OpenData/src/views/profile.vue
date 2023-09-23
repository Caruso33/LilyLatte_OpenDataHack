<template>
  <div class="overflow-auto pa-2">
    <wallet-age :data="data" />
    <cex-dex :data="data" />
    <top-evm :data="data" />
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import WalletAge from "@/components/profile/wallet-age.vue";
import CexDex from "@/components/profile/cex-dex.vue";
import TopEvm from "@/components/profile/top-evm.vue";
import { useTableLand } from "@/composables/tableLand";
import { duneTitles } from "@/composables/dune";

const route = useRoute();
const { tableLandFunctions } = useTableLand();

const setTopics = inject("setTopics");

const loading = ref(false);
const data = ref({});

onMounted(() => {
  tableLandFunctions.initSigner();
  getTable();
});

const getTable = async () => {
  loading.value = true;
  try {
    const rows = await tableLandFunctions.getRows(route.params.name);
    if (rows.length) {
      data.value = duneTitles.reduce(
        (obj, key) =>
          key in rows[0]
            ? {
                ...obj,
                [key]:
                  rows[0][key] && rows[0][key] != "undefined"
                    ? JSON.parse(rows[0][key])
                    : "",
              }
            : obj,
        {}
      );

      data.value = {
        ...data.value,
        ...(rows[0].Feature && rows[0].Feature != "undefined"
          ? JSON.parse(rows[0].Feature)
          : {}),
      };
    }

    const conversations = rows
      .filter((row) => row.dataDialog)
      .map((row) => ({
        title: row.dataRequest,
        path: `${route.fullPath}/${row.dataDialog}`,
      }));

    if (conversations.length) setTopics(conversations);

    console.log("rows", rows, data.value, conversations, route.fullPath);
  } catch (error) {
    console.log(error);
  }
};
</script>

<style></style>
