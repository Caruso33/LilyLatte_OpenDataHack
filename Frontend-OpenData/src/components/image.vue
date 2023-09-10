<template>
  <div class="d-flex align-center justify-center flex-wrap">
    <Indicator v-if="loading" />
    <img
      v-show="!loading"
      class="img-cover"
      :src="source"
      @load="loading = false"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Indicator from "@/components/indicator.vue";

defineProps({
  src: String,
});

const loading = ref(true);
</script>

<style scoped lang="scss"></style>
