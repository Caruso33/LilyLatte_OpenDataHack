<template>
  <button :disabled="loading" class="base-button" :class="{ dark: dark }">
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
  dark: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/styles/main.scss";

.base-button {
  --background: black;
  --hover-color: white;

  &.dark {
    --background: white;
    --hover-color: black;
  }

  min-width: 15rem;
  box-sizing: border-box;
  padding: 0.4rem 1rem;
  border-radius: 0.25rem;
  background-color: transparent;
  color: var(--background);
  font-weight: bold;
  transition: 0.2s ease-in-out all;
  cursor: pointer;
  font-size: 1rem;

  @extend .latte-border;

  border-color: var(--background);

  &:hover {
    background-color: var(--background);
    color: var(--hover-color);
  }
}
</style>
