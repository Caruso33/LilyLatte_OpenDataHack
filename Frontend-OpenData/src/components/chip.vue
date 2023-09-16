<template>
  <div class="chip f-g0">
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
});
</script>

<style scoped>
.chip {
  width: fit-content;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  background-color: v-bind(color);
  color: v-bind(textColor);
}
</style>
