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

  <div
    v-if="currentStepInputs != null"
    class="d-flex flex-column justify-center align-center container mx-auto"
  >
    <chat-input
      v-if="typeof currentStepInputs == 'string'"
      v-model="message"
      :loading="loading"
      @onSend="send"
    />
    <multi-btns v-else-if="currentStepInputs" :items="currentStepInputs" />

    <base-button v-if="myMessages.length > 5" dark @click="startMinting">
      Stop
    </base-button>
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
import MintDataToken from "@/components/chat/data-owner/mint-data-token.vue";
import indicator from "@/components/indicator.vue";

import { useLighthouse } from "@/composables/lighthouse";
import { useLilypad } from "@/composables/lilypad";
import { useStore } from "vuex";
import { switchNetwork } from "@/constants/ethereum-functions";
import { FVM } from "@/constants/chains";
import { useLilyLatte } from "@/composables/lilylatte";
import { useOpenAI } from "@/composables/openai";
import { prompts } from "@/constants/prompts";
import { useRoute } from "vue-router";
import { useTableLand } from "@/composables/tableLand";

const props = defineProps({
  topic: String,
});

const message = ref("");

const loading = ref(false);

const store = useStore();
const route = useRoute();

const { openAIFunctions } = useOpenAI();
const { tableLandFunctions } = useTableLand();

const step = ref(0);

const currentStepInputs = ref("");

const conversationId = ref(null);

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
  setConversationMetaData();
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

    setConversationMetaData();
  }
);

const setConversationMetaData = () => {
  const storageValue = localStorage.getItem(props.topic.title);
  if (storageValue) {
    const parsedData = JSON.parse(storageValue);
    chats.value = parsedData.chats;
    conversationId.value = parsedData.conversationId;
  }
  store.commit("setProgressStep", {
    step: myMessages.value?.length || 0,
  });
  scrollToEnd();
};

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

  const result = await sendMessageToOpenAI(message.value);

  chats.value.push({
    message: result,
  });

  if (props.topic.title)
    localStorage.setItem(
      props.topic.title,
      JSON.stringify({
        chats: chats.value,
        conversationId: conversationId.value,
      })
    );

  message.value = "";

  if (myMessages.value.length <= 5)
    store.commit("setProgressStep", {
      step: myMessages.value.length,
    });

  loading.value = false;

  // if (myMessages.value.length < 5) return;

  // currentStepInputs.value = [
  //   {
  //     title: "Conclude the conversation!",
  //     subtitle: "Lily got a generative surprise for you!",
  //     click: () => startMinting(),
  //   },
  // ];
};

const sendMessageToOpenAI = async () => {
  const firstMessage = prompts.first_message
    .replaceAll("§question§", route.params.title)
    .replaceAll("§answer§", chats.value[1].message);

  const { choices } = await openAIFunctions.sendMultiple([
    {
      role: "user",
      content: firstMessage,
    },
    ...chats.value.slice(2).map((chat) => ({
      role: chat.isMine ? "user" : "assistant",
      content: chat.message,
    })),
  ]);

  if (choices.length && choices[0].message?.content)
    return choices[0].message?.content;

  return [];
};

const startMinting = async () => {
  chats.value.push(
    {
      message:
        "Let’s go back to FVM Network. I can mint your surprise for you there :) There are some steps along the way that needs your signature.<br/> <br/> Step 1: Change back to FVM network. <br/> Step 2: Mint an access token to monetize your dialog with Lilly.<br/> Step 3: Encrypt and store your dialog. <br/> Step 4: Add your dialog CID to your dataGraph.<br/> Step 5: Mint your membership NFT. <br/> <br/> Let’s go!!!",
    },
    {
      component: MintDataToken,
      onFinish: () => {},
      isMine: true,
    }
  );

  currentStepInputs.value = null;

  scrollToEnd();

  const keywords = await fetchConversationKeywords();
  await addKeywordsToTableLand(keywords);
};

const fetchConversationKeywords = async () => {
  try {
    const firstMessage = prompts.first_message
      .replaceAll("§question§", route.params.title)
      .replaceAll("§answer§", chats.value[1].message);

    const { choices } = await openAIFunctions.sendMultiple([
      {
        role: "user",
        content: firstMessage,
      },
      ...chats.value.slice(2).map((chat) => ({
        role: chat.isMine ? "user" : "assistant",
        content: chat.message,
      })),
      {
        role: "user",
        content: prompts.keywords,
      },
    ]);

    if (choices.length && choices[0].message?.content)
      return choices[0].message?.content.split("§");

    return [];
  } catch (error) {
    console.log(error);
  }
};

const addKeywordsToTableLand = async (keywords) => {
  try {
    // todo: complete inserting keywords to our global table on tableland
    const result = await tableLandFunctions.insertIntoTable(
      { features: "", dataDialog: "", dataRequest: "" },
      "GLOBAL_TABLE_NAME"
    );
    return [];
  } catch (error) {
    console.log(error);
  }
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
