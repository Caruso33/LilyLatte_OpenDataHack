<template>
  <h1 v-if="!chats.length" class="lily-text">Lilylatte</h1>

  <div id="chat-container" class="flex-1 chat-container">
    <chat-item v-for="(item, i) in chats" :key="i" :is-mine="item.isMine">
      <component
        v-if="item.component"
        :is="item.component"
        v-bind="item"
        v-on="item"
      />
      <span v-else v-html="item.message" />
    </chat-item>
  </div>

  <div class="d-flex flex-column justify-center align-center container mx-auto">
    <chat-input
      v-if="
        step <= currentStepInputs.length &&
        typeof currentStepInputs[step] == 'string'
      "
      v-model="message"
      :disabled="isInputsDisable"
      @send="send"
    />
    <multi-btns
      v-else
      :items="step <= currentStepInputs.length ? currentStepInputs[step] : []"
      :disabled="isInputsDisable"
    />
  </div>
</template>

<script setup>
import { inject, nextTick, ref } from "vue";

import ChatInput from "@/components/chat/inputs/input.vue";
import ChatItem from "@/components/chat/item.vue";
import MultiBtns from "@/components/chat/inputs/multi-btns.vue";
import MintGraph from "@/components/chat/data-owner/mint-graph.vue";
import GeneratedQuestionsMessage from "@/components/chat/data-owner/generated-questions-message.vue";

import { useMetamask } from "@/composables/metamask";

const message = ref("");

const { metamaskFunctions } = useMetamask();

const setTopics = inject("setTopics");

const isInputsDisable = ref(false);

const step = ref(0);

const currentStepInputs = ref([
  [
    {
      title: "Let's go! ",
      subtitle: "I get it, lots of Metamask popups, I’m used to it.",
      click: () => gotIt(),
    },
  ],
  [
    {
      title: "Connect your wallet",
      distinct: true,
      click: () => metamaskFunctions.connect(onSuccessConnectWallet),
    },
  ],
  [
    {
      title: "Contract interaction button (Step 1/4)",
      subtitle: "(est. gas fee: 0.05$)",
      distinct: true,
      click: () => startMinGraph(),
    },
  ],
  [],
  [],
]);

const chats = ref([
  {
    message:
      "Before we start: <br/> We are at beta, so this process will require several confirmation on metamask",
  },
]);

const scrollToEnd = async () => {
  await nextTick();

  const parentDiv = document.getElementById("chat-container");

  parentDiv.scrollTop = parentDiv.scrollHeight - parentDiv.clientHeight;
};

const nextStep = (newChats) => {
  chats.value.push(...newChats);
  step.value += 1;
  scrollToEnd();
  isInputsDisable.value = false;
};

const onSuccessConnectWallet = () => {
  nextStep([
    {
      message: "Wallet connected.",
      isMine: true,
    },
    {
      message:
        "<b>Nice! Almost there! Before we start your interview </b>  you need to accept several popups. This steps will needs a little gas fee. (Why?)  It wont cost you more than 2-3 (?) usd equivalent FIL. <br/> <br/><ul><li>Mint a dataGraph (Why?) </li><li>Change network to FIL (Why?) </li><li>Summon Lily, your AI Interviewer and start your first conversation </li><li>(Upload this to your profile)</li></ul> <br/> <br/>Can we start this?",
    },
  ]);
};

const gotIt = () => {
  nextStep([
    {
      message: "I get it, lots of metamask popups, I’m used to it.",
      isMine: true,
    },
    {
      message: "Connect your wallet please.",
    },
  ]);
};

const startMinGraph = () => {
  nextStep([
    {
      component: MintGraph,
      afterMintGraph: () => afterMintGraph(),
      isMine: true,
    },
  ]);

  isInputsDisable.value = true;
};

const afterMintGraph = () => {
  nextStep([
    {
      message:
        "🌺 Hey there, I'm Lily, your AI Interviewer! 🌺 <br/>I've just taken a quick peek at your on-chain behavior, and I must say, you're a true web3 citizen! 🚀 <br/>🤔 Curious Topics Await!You'll see some topics popping up on the left side of your screen. These are subjects I'm really curious to dive into with you. <br/>👈 Your Choice, Your Voice!Feel free to pick any topic that piques your interest. Remember, this is all about you and your thoughts!",
    },
  ]);

  generateQuestions();
};

const generateQuestions = () => {
  setTimeout(() => {
    setTopics([
      {
        id: 1,
        title: "how do you choose nfts?",
        isNew: true,
      },
      {
        id: 2,
        title: "why do you prefer DEX's?",
        isNew: true,
      },
    ]);

    nextStep([
      {
        component: GeneratedQuestionsMessage,
      },
    ]);
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
