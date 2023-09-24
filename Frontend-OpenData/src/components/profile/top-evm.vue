<template>
  <div class="card pa-5">
    <h1>Top EVM Holdings</h1>
    <div class="row mt-1">
      <div class="col-6"></div>
      <div class="col-2 blue-text">est. value</div>
      <div class="col-2 blue-text">total value</div>
      <!-- <div class="col-2">est.$</div>
      <div class="col-2">est.%</div> -->

      <template v-if="loading">
        <div class="col-6 mt-2">
          <indicator />
        </div>
        <div class="col-2 mt-2 blue-text">
          <indicator />
        </div>
        <div class="col-2 mt-2">
          <indicator />
        </div>
        <!-- <div class="col-2 mt-2">
          <indicator />
        </div> -->
      </template>
      <template v-else v-for="(item, i) in data.top_5_evm" :key="i">
        <div class="col-6 mt-2">{{ i + 1 }}. {{ item.blockchain }}</div>
        <div class="col-2 mt-2 blue-text">
          {{ Math.round(item.total_usd) }}
        </div>
        <div class="col-2 mt-2">
          {{ Math.round(item.total_value) }}
        </div>
        <!-- <div class="col-2 mt-2">~3003</div> -->
      </template>
    </div>
  </div>
</template>

<script setup>
import Indicator from "@/components/indicator.vue";

const props = defineProps({
  data: Object,
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>

<style></style>
