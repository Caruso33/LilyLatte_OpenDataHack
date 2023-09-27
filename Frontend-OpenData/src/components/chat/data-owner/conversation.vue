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
    v-if="currentStepInputs != null && !isCompleted"
    class="d-flex flex-column justify-center align-center container mx-auto"
  >
    <chat-input
      v-if="typeof currentStepInputs == 'string'"
      v-model="message"
      :loading="loading"
      @onSend="send"
    />
    <multi-btns v-else-if="currentStepInputs" :items="currentStepInputs" />

    <base-button v-if="myMessages.length >= 5" dark @click="startMinting">
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

import { useStore } from "vuex";
import { useOpenAI } from "@/composables/openai";
import { prompts } from "@/constants/prompts";
import { useRoute } from "vue-router";
import { useLilypad } from "@/composables/lilypad";
import { useLighthouse } from "@/composables/lighthouse";
import { switchNetwork } from "@/constants/ethereum-functions";
import { Lilypad } from "@/constants/chains";

const props = defineProps({
  topic: String,
});

const message = ref("");

const loading = ref(false);

const store = useStore();
const route = useRoute();

const { lilypadFunctions } = useLilypad();

const { lighthouseFunctions } = useLighthouse();

const { openAIFunctions } = useOpenAI();

const step = ref(0);

const currentStepInputs = ref("");

const isCompleted = ref(false);

const chats = ref([
  {
    message:
      "Welcome to Lilylatte! We're still in beta, so you'll encounter a few wallet (Metamask) confirmations along the way. Are you cool with that?",
  },
]);

const myMessages = computed(() => chats.value.filter((chat) => chat.isMine));

onMounted(async () => {
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
  const storageValue = localStorage.getItem(props.topic.title.trim());

  if (storageValue) {
    const parsedData = JSON.parse(storageValue);
    chats.value = parsedData.chats;
    isCompleted.value = parsedData.isCompleted || false;
  } else isCompleted.value = false;
  store.commit("setProgressStep", {
    step: myMessages.value?.length || 0,
  });
  scrollToEnd();

  currentStepInputs.value = "";
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
      props.topic.title.trim(),
      JSON.stringify({
        chats: chats.value,
        isCompleted: isCompleted.value,
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

  const messages = [
    {
      role: "user",
      content: firstMessage,
    },
    ...chats.value.slice(2).map((chat) => ({
      role: chat.isMine ? "user" : "assistant",
      content: chat.message,
    })),
  ];

  // todo: convert from openAI to lilypad
  // const cid = await lighthouseFunctions.uploadJson(messages);
  // await lilypadFunctions.sendAndGetNewResults(cid);
  const { choices } = await openAIFunctions.sendMultiple(messages);

  if (choices.length && choices[0].message?.content)
    return choices[0].message?.content;

  return [];
};

const blockInputs = () => {
  chats.value.push({
    component: MintDataToken,
    chats: [...chats.value],
    onFinish: () => {
      console.log("in on finish");
      isCompleted.value = true;

      if (props.topic.title)
        localStorage.setItem(
          props.topic.title.trim(),
          JSON.stringify({
            chats: [
              ...chats.value.slice(0, -1),
              {
                message: "Conversation is finished.",
              },
            ],
            isCompleted: isCompleted.value,
          })
        );

      chats.value.push({
        message:
          "You've done it! Your opinions are now up for curation by our DAO, and your dialogues are available for purchase right on your profile. And remember, you call the shots. You decide the rules, and you give consent if and when someone can buy access to your dialogues. Now, I'd love to invite you to explore a few next steps: <br/> <br/> <h3>My profile:</h3> Take a sneak peek at your shiny new NFT and browse through your list of conversations. Claim any earnings from purchased dialogues or check if someone wants to conduct an interview with you through Lily <br/> <br/><h3>Opinions of DAO:</h3>  Jump into the mix and see what other DAO members are saying. Feel free to voice your opinions on their stances by polling agree or disagree. <br/> <br/><h3>More Conversations:</h3> Not done chatting? Pick more conversation starters from the sidebar and let's keep this party rolling!",
      });
    },
    isMine: true,
  });

  currentStepInputs.value = null;
};

const startMinting = async () => {
  chats.value.push({
    message:
      "Great conversation! Now, let's finalize a few things to make your data work for you and our DAO. Also, heads up! We've taken the liberty to extract some key topics and opinion statements from our chat. These will be up for curation by the DAO members, who can vote to agree or disagree with your views. Ready? <br/> <ul><li> (1/7) Switch back to the FVM network </li> <li>(2/7) Encrypt and save your dataDialog</li> <li>(3/7) Mint an access token for this Dialogue</li> <li>(4/7) Mint your unique DAO membership NFT</li> <li>(5/7) Extract and add topics/opinions to Opinions of DAO dataGraph</li> <li>(6/7) Associate DAO opinion rowID with Lilylatte SC</li> <li>(7/7) Link your dialogue CID to your personal dataGraph</li></ul>",
  });

  await fetchNFTCid();

  blockInputs();

  scrollToEnd();
};

const fetchNFTCid = async () => {
  try {
    if (localStorage.getItem("nftCID")) return;

    await switchNetwork(Lilypad.chainId);
    await lilypadFunctions.initContract();

    const data = await lilypadFunctions.getMyCIDs();
    console.log("data in fetchNFTCid", data);
    if (data.length) localStorage.setItem("nftCID", data.slice(-1)[0]?.cid);
  } catch (error) {
    console.log("error in fetchNFTCid", error);
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
