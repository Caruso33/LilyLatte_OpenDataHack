<template>
  <div class="overflow-auto pa-2">
    <wallet-age :wallet="$route.params.address" />
    <cex-dex :wallet="$route.params.address" />
    <top-evm :wallet="$route.params.address" />
  </div>
</template>

<script setup>
import { useDune } from "@/composables/dune";
import { onBeforeUnmount, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import WalletAge from "@/components/profile/wallet-age.vue";
import CexDex from "@/components/profile/cex-dex.vue";
import TopEvm from "@/components/profile/top-evm.vue";

const store = useStore();
const route = useRoute();

onBeforeUnmount(() => {
  store.commit("setUserProfile", null);
});
</script>

<style></style>
