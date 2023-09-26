<template>
  <div
    v-for="(item, i) in steps"
    :key="i"
    class="d-flex align-center"
    :class="{ 'disable-text': step < i }"
  >
    ({{ i + 1 }} / {{ steps.length }}) {{ item.title }}:
    <div
      v-if="step == i && hasError"
      class="cursor-pointer ml-1 retry error-text"
      @click="$emit('retry')"
    >
      Retry
    </div>
    <indicator v-else-if="step == i" class="ml-1" />
    <div v-else-if="step > i" class="ml-1 success-text">Success</div>
    <div v-else class="ml-1">Waiting for signature</div>
  </div>
</template>

<script setup>
import Indicator from "@/components/indicator.vue";

defineProps({
  step: Number,
  steps: Array,
  hasError: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.success-text {
  color: #0e0;
}

.error-text {
  color: red;
}

.disable-text {
  color: #777;
}

.retry {
  text-decoration: underline;
}
</style>
