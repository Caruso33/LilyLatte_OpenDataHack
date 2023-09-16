<template>
  <div class="buy">
    <chat-item
      v-for="(item, i) in data.length ? data : chats"
      :key="i"
      :is-mine="item.isMine"
    >
      <span v-html="item.message" />
    </chat-item>
    <div v-if="!data.length" class="buy__blur-view">
      <div v-if="loading" class="d-flex flex-column flex-center">
        <indicator class="mb-1" />
        Loading...
      </div>
      <button v-else @click="$emit('onBuy')">buy this convo (0.1 FIL)</button>
    </div>
  </div>
</template>

<script setup>
import indicator from "@/components/indicator.vue";
import ChatItem from "@/components/chat/item.vue";
import { ref } from "vue";

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array,
    default: () => [],
  },
});

const chats = ref([
  {
    message:
      "Private Text Private Text Private Text Private Text Private Text Private Text Private Text ",
  },
  {
    message: "Private Text Private Text Private Text Private Text Private",
    isMine: true,
  },
  {
    message:
      "Private Text Private Text Private Text Private Text Private Text Private Text Private Text ",
  },
  {
    message: "Private Text Private Text Private Text Private Text Private",
    isMine: true,
  },
]);
</script>

<style scoped lang="scss">
.buy {
  position: relative;

  &__blur-view {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(0.5rem);

    display: flex;
    justify-content: center;
    align-items: center;

    button {
      border: unset;
      background-color: var(--sky-blue);
      padding: 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
    }
  }
}
</style>
