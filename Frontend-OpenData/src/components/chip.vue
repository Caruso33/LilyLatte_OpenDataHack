<template>
  <div class="chip f-g0" :class="{ chip__background: outlined }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: "lightskyblue",
  },
  textColor: {
    type: String,
    default: "black",
  },
  outlined: {
    type: Boolean,
    default: true,
  },
});
</script>

<style scoped lang="scss">
.chip {
  width: fit-content;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  color: v-bind(textColor);
  transition: var(--hover-transition);
  border: 0.125rem solid v-bind(color);

  &__background {
    background-color: v-bind(color);
  }
}
</style>
