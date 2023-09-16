<template>
  <div class="progress-container text-center">
    <small>Conversation progress</small>
    <div class="progress-bar">
      <div
        class="progress-bar-inner"
        :style="{ width: (progress * 100) / length + '%' }"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  progress: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100,
  },
  length: {
    type: Number,
    default: 5,
  },
});
</script>

<style scoped lang="scss">
.progress-container {
  flex: 1;
  max-width: 300px;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;

  &-inner {
    height: 100%;
    background-color: #42b983;
    transition: width 0.3s ease;
  }
}
</style>
