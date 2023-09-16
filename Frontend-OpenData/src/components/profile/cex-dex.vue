<template>
  <div class="card pa-5">
    <h1>top CEX-DEX volume</h1>
    <div class="row mt-1">
      <div class="col-6"></div>
      <!-- <div class="col-2 blue-text">ratio%</div> -->
      <div class="col-6">est.$</div>

      <div class="col-6 mt-2">CEX</div>
      <div class="col-6 mt-2 blue-text">(NOT A REAL VALUE)!!!</div>
      <!-- <div class="col-2 mt-2">2020 Jan - (3.5 y)</div> -->

      <div class="col-6 mt-2">DEX</div>
      <div class="col-6 mt-2 blue-text">(NOT A REAL VALUE)!!!</div>
      <!-- <div class="col-2 mt-2">2020 Jan - (3.5 y)</div> -->

      <template v-if="loading">
        <div class="col-6 mt-1 pl-2">
          <indicator />
        </div>
        <div class="col-6 mt-1 blue-text">
          <indicator />
        </div>
        <!-- <div class="col-2 mt-1">
          <indicator />
        </div> -->
      </template>
      <template v-else v-for="(item, i) in data" :key="i">
        <div class="col-6 mt-1 pl-2">{{ item.project }}</div>
        <div class="col-6 mt-1 blue-text">{{ Math.floor(item.total_usd) }}</div>
        <!-- <div class="col-2 mt-1">~7000$</div> -->
      </template>
    </div>
  </div>
</template>

<script setup>
import { useDune } from "@/composables/dune";
import Indicator from "@/components/indicator.vue";
import { onMounted, ref } from "vue";

const props = defineProps({
  wallet: String,
});

const { duneFunctions, loading } = useDune();

const data = ref([]);

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  try {
    const result = await duneFunctions.get(props.wallet, "dex");
    console.log("fetchData dex", result);
    if (result.rows?.length) data.value = result.rows;
  } catch (error) {
    console.log(error);
  }
};
</script>

<style></style>
