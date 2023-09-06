<template>
  <button :disabled="loading" @click="$emit('click')">
    <div class="d-flex align-center justify-center">
      <Indicator v-if="loading" />
      <slot v-else />
    </div>
  </button>
</template>

<script setup>
import Indicator from "./indicator.vue";

defineProps({
  loading: Boolean,
});
</script>

<style scoped lang="scss">
@import "@/assets/main.scss";

button {
  min-width: 15rem;
  box-sizing: border-box;
  padding: 0.4rem 1rem;
  border-radius: 0.25rem;
  background-color: transparent;
  color: black;
  font-weight: bold;
  transition: 0.2s ease-in-out all;
  cursor: pointer;
  font-size: 1rem;

  @extend .latte-border;

  &:hover {
    @extend .fill-btn;
  }
}
</style>
