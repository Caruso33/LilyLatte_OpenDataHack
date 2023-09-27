<template>
  <div class="card pa-5">
    <h1>Wallet age and usage</h1>
    <div class="row mt-4">
      <div class="col-6">Wallet Age</div>
      <div class="col-6">
        <indicator v-if="loading" />
        <template v-else> {{ data?.wallet_age_days || 0 }} days</template>
      </div>

      <div class="col-6 mt-2">Inactive since</div>
      <div class="col-6 mt-2">
        <indicator v-if="loading" />
        <template v-else> {{ data?.inactive_since_in_days }} days</template>
      </div>

      <!-- <div class="col-6 mt-2">Avg tx / month</div> -->
      <div class="col-6 mt-2">Wallet address</div>
      <div class="col-6 mt-2">
        <indicator v-if="loading" />
        <template v-else> {{ data?.wallet_address || "" }} </template>
      </div>
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
