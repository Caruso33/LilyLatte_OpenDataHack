<template>
  <div v-if="loading" class="d-flex flex-column flex-center">
    <indicator class="mb-1" />
    Loading...
  </div>
  <div v-else class="pa-2 overflow-auto">
    <div class="card pa-3">
      <div class="d-flex justify-space-between">
        <h1>Choose your keyword</h1>
        <h1 v-if="hasButton">VOTE</h1>
      </div>
      <div class="d-flex flex-wrap">
        <chip
          v-for="(keyword, i) in uniqueKeywords"
          :key="i"
          class="ma-1 ml-0 cursor-pointer"
          :outlined="selectedKeyword == keyword"
          :textColor="selectedKeyword != keyword ? 'white' : 'black'"
          @click="toggleKeywords(keyword)"
        >
          {{ keyword }}
        </chip>
      </div>
    </div>
    <opinion-item
      v-for="(item, i) in filteredData"
      :key="i"
      :item="item"
      :rank="i + 1"
      :hasButton="hasButton"
      :votesByRowId="votesByRowId"
      :pollIndexes="pollIndexes"
      @update="getTableLandData"
    />
  </div>
</template>

<script setup>
import OpinionItem from "@/components/opinions/item.vue";
import Chip from "@/components/chip.vue";
import { computed, onMounted, ref } from "vue";
import { useTableLand } from "@/composables/tableLand";
import { constants } from "@/constants";
import { getWallet, switchNetwork } from "@/constants/ethereum-functions";
import { FVM } from "@/constants/chains";
import indicator from "@/components/indicator.vue";
import { useLilyLatte } from "@/composables/lilylatte";
import { ethers } from "ethers";

const { tableLandFunctions } = useTableLand();
const { lilyLatteFunctions } = useLilyLatte();

const data = ref([]);
const uniqueKeywords = ref([]);
const votesByRowId = ref({});
const pollIndexes = ref([]);

const selectedKeyword = ref(null);

const hasButton = ref(false);
const loading = ref(false);

const filteredData = computed(() =>
  selectedKeyword.value
    ? data.value.filter((val) => val.exchange == selectedKeyword.value)
    : data.value
);

onMounted(async () => {
  await getWallet();
  await switchNetwork(FVM.chainId);

  hasButton.value =
    !!localStorage.getItem("nftId") &&
    localStorage.getItem("userType") == "owner";

  tableLandFunctions.initSigner();

  getTableLandData();
});

const getTableLandData = async () => {
  loading.value = true;
  try {
    const rows = await tableLandFunctions.getRows(constants.keywordsTable);
    uniqueKeywords.value = rows.reduce(
      (arr, current, i) =>
        rows.findIndex((row) => row.exchange == current.exchange) == i
          ? [...arr, current.exchange]
          : arr,
      []
    );

    const votes = await Promise.all(rows.map((row) => getOpinionData(row.id)));

    const votesObjById = votes.reduce(
      (obj, current) =>
        current?.tablelandRowId && bigNumToNum(current.tablelandRowId) != 0
          ? {
              ...obj,
              [bigNumToNum(current.tablelandRowId)]: {
                ...current,
                point: bigNumToNum(current.pro) - bigNumToNum(current.contra),
              },
            }
          : obj,
      {}
    );

    data.value = rows.sort(
      (a, b) =>
        (votesObjById[b.id]?.point ?? -99999) -
        (votesObjById[a.id]?.point ?? -99999)
    );

    votesByRowId.value = votesObjById;

    const rowIds = await lilyLatteFunctions.getOpinionTableLandRowIds();
    pollIndexes.value = rowIds.map((id) => bigNumToNum(id));

    console.log(
      "getTableLandData",
      uniqueKeywords.value,
      votes,
      votesObjById,
      pollIndexes.value
    );
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const bigNumToNum = (bigNum) => ethers.BigNumber.from(bigNum).toNumber();

const getOpinionData = async (rowId) => {
  try {
    const data = await lilyLatteFunctions.getOpinionPoll(rowId);
    return { rowId, ...data };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const toggleKeywords = (keyword) => {
  selectedKeyword.value = selectedKeyword.value == keyword ? null : keyword;
};
</script>

<style></style>
