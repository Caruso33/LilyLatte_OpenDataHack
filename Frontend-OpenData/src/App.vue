<template>
  <div class="app">
    <div class="app__content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import "@/assets/main.scss";
import { onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

onMounted(() => {
  if (!store.state.wallet) router.replace("/");
});
</script>

<style lang="scss">
.app {
  position: relative;
  display: flex;
  flex-direction: column;

  &__content {
    height: 100%;
  }
}
</style>
