<template>
  <div class="circular-indicator"></div>
</template>

<style lang="scss" scoped>
.circular-indicator {
  border: 3px solid #dadada;
  border-radius: 50%;
  border-top: 3px solid #00baba;
  width: 1rem;
  height: 1rem;
  animation: spin 1s cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.15s infinite;
  z-index: 9;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
