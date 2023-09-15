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
      v-else-if="currentStepInputs"
      :items="step <= currentStepInputs.length ? currentStepInputs[step] : []"
    />
  </div>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";

import ChatInput from "@/components/chat/inputs/input.vue";
import ChatItem from "@/components/chat/item.vue";
import MultiBtns from "@/components/chat/inputs/multi-btns.vue";
import indicator from "@/components/indicator.vue";

import { useLighthouse } from "@/composables/lighthouse";
import { useLilypad } from "@/composables/lilypad";
import { useStore } from "vuex";
import { switchNetwork } from "@/constants/ethereum-functions";
import { FVM } from "@/constants/chains";
import { useLilyLatte } from "@/composables/lilylatte";

const props = defineProps({
  topic: String,
});

const message = ref("");

const loading = ref(false);

const store = useStore();

const { lighthouseFunctions } = useLighthouse();
const { lilypadFunctions } = useLilypad();
const { lilyLatteFunctions } = useLilyLatte();

const step = ref(0);

const currentStepInputs = ref("");

const chats = ref([
  {
    message:
      "Before we start: <br/> We are at beta, so this process will require several confirmation on metamask",
  },
]);

const myMessages = computed(() => chats.value.filter((chat) => chat.isMine));

onMounted(() => {
  if (props.topic)
    chats.value = [
      {
        message: props.topic.title,
      },
    ];

  const storageValue = localStorage.getItem(props.topic);
  if (storageValue) chats.value = JSON.parse(storageValue);
  store.commit("setProgressStep", {
    step: myMessages.value?.length || 0,
  });
});

onBeforeUnmount(() => {
  store.commit("setProgressStep", {
    step: null,
  });
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

const send = async () => {
  loading.value = true;

  chats.value.push({
    message: message.value,
    isMine: true,
  });

  scrollToEnd();

  const cid = await uploadFastChatQuestion(message.value);

  const newChats = await requestFastChatAnswers(cid);

  chats.value.push({
    message: newChats.slice(-1),
  });

  localStorage.setItem(props.topic, JSON.stringify());

  message.value = "";

  if (myMessages.value.length < 5) return;

  currentStepInputs.value = null;

  await switchNetwork(FVM.chainId);

  const chatsCid = await lighthouseFunctions.uploadJson(chats.value);

  mintDataToken(chatsCid);
};

const uploadFastChatQuestion = async () => {
  const template = {
    template:
      "You are a friendly chatbot assistant that responds conversationally to users' questions. \n Keep the answers short, unless specifically asked by the user to elaborate on something. \n \n Question: {question} \n \n Answer:",
    parameters: {
      question: "Ask me 3 random questions and separate them with #",
    },
  };

  const cid = await lighthouseFunctions.uploadJson(template);

  return cid;
};

const requestFastChatAnswers = async (cid) => {
  const results = await lilypadFunctions.requestAndGetNewResults(cid);

  console.log(results);

  return results;
};

const mintDataToken = async (chatsCid) => {
  const result = await lilyLatteFunctions.mintNewDialogToken(chatsCid);
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
