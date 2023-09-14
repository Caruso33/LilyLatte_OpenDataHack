<template>
  <div class="d-flex flex-column align-center">
    <h1>{{ title }}</h1>
    <small>{{ desc }}</small>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  desc: String,
});
</script>

<style></style>
