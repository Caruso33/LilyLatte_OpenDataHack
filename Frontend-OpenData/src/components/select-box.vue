<template>
  <select v-model="model" class="latte-border">
    <option value="" disabled selected hidden v-if="placeholder">
      {{ placeholder }}
    </option>
    <option v-for="(item, key) in items" :key="'item' + key" :value="key">
      {{ item }}
    </option>
  </select>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: String,
  items: Object,
  placeholder: String,
});

const emits = defineEmits(["update:modelValue"]);

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits("update:modelValue", value);
  },
});
</script>

<style scoped lang="scss">
select {
  min-width: 20rem;
  padding: 0.5rem;

  border-radius: 0.25rem;
}
</style>
