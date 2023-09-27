<template>
  <div class="d-flex flex-column align-center">
    <indicator v-if="loading" />
    <h2 v-else>{{ title }}</h2>
    <small>{{ desc }}</small>
  </div>
</template>

<script setup>
import indicator from "@/components/indicator.vue";

defineProps({
  title: String,
  desc: String,
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>

<style></style>
