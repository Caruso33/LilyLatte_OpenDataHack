<template>
  <div class="card pa-5">
    <h1>top CEX-DEX volume</h1>
    <div class="row mt-1">
      <div class="col-6"></div>
      <div class="col-2 blue-text">ratio%</div>
      <div class="col-2">est.$</div>

      <div class="col-6 mt-2">CEX</div>
      <div class="col-2 mt-2 blue-text">2020 Jan - (3.5 y)</div>
      <div class="col-2 mt-2">2020 Jan - (3.5 y)</div>

      <div class="col-6 mt-2">DEX</div>
      <div class="col-2 mt-2 blue-text">0.4 year - (25 days till last)</div>
      <div class="col-2 mt-2">2020 Jan - (3.5 y)</div>

      <div class="col-6 mt-1 pl-2">Uniswap</div>
      <div class="col-2 mt-1 blue-text">30%</div>
      <div class="col-2 mt-1">~7000$</div>

      <div class="col-6 mt-1 pl-2">Uniswap</div>
      <div class="col-2 mt-1 blue-text">30%</div>
      <div class="col-2 mt-1">~7000$</div>

      <div class="col-6 mt-1 pl-2">Uniswap</div>
      <div class="col-2 mt-1 blue-text">30%</div>
      <div class="col-2 mt-1">~7000$</div>
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

const data = ref({});

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  try {
    const result = await duneFunctions.get(props.wallet, "dex");
    console.log("fetchData", result);
    if (result.rows?.length) data.value = result.rows[0];
  } catch (error) {
    console.log(error);
  }
};
</script>

<style></style>
