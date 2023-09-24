<template>
  <div class="card pa-3">
    <div class="d-flex justify-space-between">
      <div>
        <h1>{{ item.exchange }}</h1>
        <chip
          class="mt-1"
          @click="$router.push(`/profiles/${item.data_owner_id}`)"
        >
          View Profile
        </chip>
      </div>
      <div v-if="hasButton">
        <chip color="green" textColor="white" class="cursor-pointer">
          AGREE
        </chip>
        <chip color="red" textColor="white" class="cursor-pointer mt-1">
          Disagree
        </chip>
      </div>
    </div>
    <div class="mt-1">
      <h3 class="my-2">{{ item.summarize }}</h3>
      <div class="d-flex mt-1">
        <detail title="1" desc="Rank" />
        <detail title="+12" desc="Net vote" class="ml-4" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Indicator from "@/components/indicator.vue";
import Chip from "@/components/chip.vue";
import Detail from "@/components/profile/detail.vue";
import { ref } from "vue";

const props = defineProps({
  wallet: String,
  item: Object,
  hasButton: {
    type: Boolean,
    default: false,
  },
});

const loading = ref(false);

const vote = async (agree) => {
  loading.value = true;
};
</script>

<style></style>
