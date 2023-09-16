<template>
  <div class="card pa-3">
    <div class="d-flex justify-space-between">
      <div>
        <h1>Uniswap</h1>
        <chip class="mt-1">View Profile</chip>
      </div>
      <div v-if="withButtons">
        <chip color="green" textColor="white" class="cursor-pointer">
          AGREE
        </chip>
        <chip color="red" textColor="white" class="cursor-pointer mt-1">
          Disagree
        </chip>
      </div>
    </div>
    <div class="mt-1">
      <div class="mt-2">some Desc here</div>
      <div class="d-flex mt-1">
        <detail title="1" desc="Rank" />
        <detail title="+12" desc="Net vote" class="ml-4" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDune } from "@/composables/dune";
import Indicator from "@/components/indicator.vue";
import Chip from "@/components/chip.vue";
import Detail from "@/components/profile/detail.vue";
import { onMounted, ref } from "vue";

const props = defineProps({
  wallet: String,
  item: Object,
  withButtons: {
    type: Boolean,
    default: false,
  },
});

const data = ref([]);
</script>

<style></style>
