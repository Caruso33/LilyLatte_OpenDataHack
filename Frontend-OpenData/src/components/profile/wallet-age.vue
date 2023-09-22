<template>
  <div class="card pa-5">
    <h1>Wallet age and usage</h1>
    <div class="row mt-4">
      <div class="col-6">Wallet Age Days</div>
      <div class="col-6">
        <indicator v-if="loading" />
        <template v-else> {{ data?.wallet_age_days || 0 }} days</template>
      </div>

      <div class="col-6 mt-2">Longest inactive period</div>
      <div class="col-6 mt-2">
        <indicator v-if="loading" />
        <template v-else> {{ data?.inactive_since_in_days }} days</template>
      </div>

      <!-- <div class="col-6 mt-2">Avg tx / month</div> -->
      <div class="col-6 mt-2">First Transaction Date</div>
      <div class="col-6 mt-2">
        <indicator v-if="loading" />
        <template v-else> {{ data?.first_transaction_date || "" }} </template>
      </div>
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
  // fetchWalletAge();
});

const fetchWalletAge = async () => {
  try {
    const result = await duneFunctions.get(props.wallet, "wallet_age");
    console.log("fetchWalletAge", result);
    if (result.rows?.length) data.value = result.rows[0];
  } catch (error) {
    console.log(error);
  }
};
</script>

<style></style>
