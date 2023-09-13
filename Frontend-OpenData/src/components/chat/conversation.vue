<template>
  <h1 v-if="!chats.length" class="lily-text">Lilylatte</h1>

  <div id="chat-container" class="flex-1 chat-container">
    <chat-item v-for="(item, i) in chats" :key="i" :is-mine="item.isMine">
      <component v-if="item.component" :is="item.component" v-bind="item" />
      <span v-else v-html="item.message" />
    </chat-item>
    <chat-item v-if="loading">
      <div class="d-flex align-center">
        <indicator class="mr-1" />
        Loading...
      </div>
    </chat-item>
  </div>

  <div class="d-flex flex-column justify-center align-center container mx-auto">
    <chat-input
      v-if="typeof currentStepInputs == 'string'"
      v-model="message"
      :loading="loading"
      @onSend="send"
    />
    <multi-btns
      v-else
      :items="step <= currentStepInputs.length ? currentStepInputs[step] : []"
    />
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from "vue";

import ChatInput from "@/components/chat/inputs/input.vue";
import ChatItem from "@/components/chat/item.vue";
import MultiBtns from "@/components/chat/inputs/multi-btns.vue";
import { useMetamask } from "@/composables/metamask";
import indicator from "@/components/indicator.vue";

const props = defineProps({
  topic: String,
});

const message = ref("");

const loading = ref(false);

const { metamaskFunctions } = useMetamask();

const step = ref(0);

const currentStepInputs = ref("");

const chats = ref([
  {
    message:
      "Before we start: <br/> We are at beta, so this process will require several confirmation on metamask",
  },
]);

onMounted(() => {
  if (props.topic)
    chats.value = [
      {
        message: props.topic.title,
      },
    ];
});

watch(
  () => props.topic,
  () => {
    chats.value = [
      {
        message: props.topic.title,
      },
    ];
  }
);

const scrollToEnd = async () => {
  await nextTick();

  const parentDiv = document.getElementById("chat-container");

  parentDiv.scrollTop = parentDiv.scrollHeight - parentDiv.clientHeight;
};

const send = () => {
  loading.value = true;

  chats.value.push({
    message: message.value,
    isMine: true,
  });

  message.value = "";

  scrollToEnd();

  setTimeout(() => {
    loading.value = false;
  }, 3000);
};
</script>

<style scoped lang="scss">
.chat {
  &-container {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
}

.lily-text {
  position: absolute;
  top: 50%;
  left: 50%;
  opacity: 0.2;
  transform: translate(50%);
}
</style>
