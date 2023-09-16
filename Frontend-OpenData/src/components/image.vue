<template>
  <div class="d-flex align-center justify-center flex-wrap">
    <Indicator v-if="loading" />
    <div v-else-if="error">
      {{ error }}
      <div>Retry</div>
    </div>
    <img
      v-show="!loading"
      class="img-cover"
      :src="source"
      @load="loading = false"
      @error="onError"
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
const error = ref(null);

const onError = () => {
  loading.value = false;
  error.value = "Error in fetching image";
};
</script>

<style scoped lang="scss"></style>
