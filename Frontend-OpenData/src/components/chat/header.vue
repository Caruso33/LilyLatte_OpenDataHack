<template>
  <header class="pr-4">
    <Logo class="icon icon-32 cursor-pointer" @click="$router.push('/')" />

    <div class="spacer" />

    <Progress v-if="$store.state.step != null" :progress="$store.state.step" />

    <div class="spacer" />

    <div v-if="wallet" class="d-flex cursor-pointer align-center">
      <div class="bullet green-bg mr-1"></div>
      <small>Wallet connected</small>
    </div>

    <div v-else class="d-flex cursor-pointer align-center">
      <div class="bullet mr-1"></div>
      <small>Connect Wallet</small>
    </div>
  </header>
</template>

<script setup>
import Logo from "@/assets/icons/logo.vue";
import { useMetamask } from "@/composables/metamask";
import Progress from "@/components/progress.vue";

const { metamaskFunctions, wallet } = useMetamask();
</script>

<style lang="scss" scoped>
header {
  padding: 0.75rem;
  display: flex;
  background-color: var(--primary);
  color: white;
  border-bottom: 1px solid black;

  a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;
    padding: 0.25rem 1rem;

    &:first-of-type {
      padding-left: 0;
    }

    &.router-link-exact-active {
      color: var(--sky-blue);
      text-decoration: underline;
    }
  }

  .logo {
    height: 2rem;
    width: 2rem;
  }

  .bullet {
    height: 0.5rem;
    width: 0.5rem;
    border-radius: 1rem;
    background-color: red;
  }

  .green-bg {
    background-color: green;
  }

  .spacer {
    margin-left: auto;
  }

  button {
    margin-left: auto;
  }
}
</style>
