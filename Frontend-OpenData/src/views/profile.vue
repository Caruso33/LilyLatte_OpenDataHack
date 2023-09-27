<template>
  <div class="overflow-auto pa-2">
    <wallet-age :data="data" :loading="loading" />
    <cex-dex :data="data" :loading="loading" />
    <top-evm :data="data" :loading="loading" />
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
import { useLilyLatte } from "@/composables/lilylatte";

const route = useRoute();
const { tableLandFunctions } = useTableLand();
const { lilyLatteFunctions } = useLilyLatte();

const setTopics = inject("setTopics");

const loading = ref(false);
const data = ref({});

onMounted(async () => {
  tableLandFunctions.initSigner();
  getTable();

  // console.log(
  //   "balanceOf",
  //   await lilyLatteFunctions.balanceOf(
  //     "0xc546888bbe9b864f86eCFED38C5a2b7edc791C31",
  //     "10"
  //   )
  // );

  // console.log("get rows", await tableLandFunctions.getRows());
  // console.log(
  //   "updateDataDialogWithTitle",
  //   await tableLandFunctions.updateDataDialogWithTitle(
  //     "Qmc73QPLnLgMssN1rXJQLrcmxKtoJbpKPADiM1ic4Pfd9H",
  //     "5. As an experienced user in the web3 space, how do you see the future of decentralized finance (DeFi) and cryptocurrency trading evolving? Are there any trends or developments that youre particularly excited about?"
  //   )
  // );
  // console.log(
  //   "updateDataDialogWithTitle",
  //   await tableLandFunctions.tempupdate(
  //     "1. What factors influence your preference for using central exchanges compared to decentralized exchanges (CEX/DEX)?",
  //     "1. What factors influence your preference for using central exchanges compared to decentralized exchanges (CEX-DEX)?"
  //   )
  // );
  // console.log(
  //   "get rows",
  //   await tableLandFunctions.getRows("OpenData_314159_376")
  // );
  // console.log(
  //   "get rows",
  //   await tableLandFunctions.getRowsByTitle(
  //     "1. What factors influence your preference for using central exchanges compared to decentralized exchanges (CEX/DEX)?",
  //     route.params.name
  //   )
  // );
});

const getTable = async () => {
  loading.value = true;
  try {
    const rows = await tableLandFunctions.getRows(route.params.name);
    console.log("rows in getTable", rows);
    if (rows.length) {
      data.value = duneTitles.reduce(
        (obj, key) =>
          key in rows[0]
            ? {
                ...obj,
                [key]: rows[0][key] || "",
              }
            : obj,
        {}
      );

      data.value = {
        ...data.value,
        ...(rows[0].Features && rows[0].Features != "undefined"
          ? rows[0].Features[0]
          : {}),
      };
    }

    const conversations = rows
      .filter((row) => row.dataDialog)
      .map((row) => ({
        title: row.dataRequest,
        path: `${route.fullPath}/${row.dataDialog}/${row.dataRequest}`,
      }));

    setTopics([
      ...(conversations || []),
      {
        title: "Publish Interview Request",
        path: "publishInterview",
        disabled: true,
      },
    ]);

    console.log("rows", rows, data.value, conversations, route.fullPath);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style></style>
