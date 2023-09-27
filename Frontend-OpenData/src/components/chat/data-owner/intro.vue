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
import { inject, nextTick, onMounted, ref } from "vue";

import ChatInput from "@/components/chat/inputs/input.vue";
import ChatItem from "@/components/chat/item.vue";
import MultiBtns from "@/components/chat/inputs/multi-btns.vue";
import MintGraph from "@/components/chat/data-owner/mint-graph.vue";
import GeneratedQuestionsMessage from "@/components/chat/data-owner/generated-questions-message.vue";

import { useMetamask } from "@/composables/metamask";
import { useStore } from "vuex";

const message = ref("");

const store = useStore();

const { metamaskFunctions } = useMetamask();

const setTopics = inject("setTopics");

const isInputsDisable = ref(false);

const step = ref(0);

const currentStepInputs = ref([
  [
    {
      title: "Sure, let's go!",
      click: () => gotIt(),
    },
  ],
  [
    {
      title: "Connect wallet",
      distinct: true,
      click: () => metamaskFunctions.connect(onSuccessConnectWallet),
    },
  ],
  [
    {
      title: "Let's do it!",
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
      "Welcome to Lilylatte! We're still in beta, so you'll encounter a few wallet (Metamask) confirmations along the way. Are you cool with that?",
  },
]);

onMounted(() => {
  // temp _ todo: remove it later
  if (
    localStorage.getItem("questions") &&
    localStorage.getItem("userType") == "owner"
  ) {
    const parsedQuestions = JSON.parse(localStorage.getItem("questions"));
    setTopics(
      parsedQuestions.map((question) => ({
        path: `/chat/owner/${question}`,
        title: question,
        withNewText: !localStorage.getItem(question),
      }))
    );
  }
});

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

const gotIt = () => {
  nextStep([
    {
      message: "Sure, let's go!",
      isMine: true,
    },
    {
      message:
        "Fantastic! Now let’s connect your wallet to get started. We’re going to look at your onchain activity. This helps us to personalize this experience and bring up topics that are most relevant to you. If your connected wallet has no history, your experience is less unique.",
    },
  ]);
};

const onSuccessConnectWallet = async () => {
  nextStep([
    {
      message: "Wallet connected.",
      isMine: true,
    },
    {
      message:
        "Awesome, you're in! Before we dive into your personalized interview, you'll need to approve a few actions. They'll need a bit of gas in FIL on Calibration testnet. Help yourself <a href='https://faucet.calibration.fildev.network/' target='_blank'>here</a>. <br/> Here are the steps you'll need to complete <br/> <br/><ul><li>(1/5) Mint Your dataGraph: This creates your unique data backpack holding all your digital footprints. </li><li>(2/5) Store Onchain Achievements: We'll add your achievements to your dataGraph for a richer profile.</li><li>(3/5) dataGraph to Lilylatte: Your dataGraph gets added to the Lilylatte Smart Contract. <br/> <div class='sky-blue-text'>(if you got stuck here on your second attempt, try jumping by choosing conversation starters on the left bar!)</div></li><li>(4/5) Network Change: We'll switch from FVM to Lilypad Network, my native environment. <br/> <br/> <div class='lilypad-network'><small>You need to manually add this network, since Lilypad’s RPC is HTTP: <br/> Network name: Lilypad Lalechuza testnet <br/>RPC URL: http://testnet.lilypadnetwork.org:8545 <br/> Chain ID: 1337 <br/> Currency symbol: lilETH (Help yourself <a href='http://testnet.lilypadnetwork.org/' target='_blank'>here</a>) <br/> Block explorer URL: (leave blank) <br/></small></div> <br/></li><li>(5/5) Summon Finally, you'll call upon me, Lily, to start your interview. </li></ul> <br/> <br/>Ready to begin?",
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
        "Hey there! I'm Lily, your AI interviewer. I've cooked up 5 conversation starters based on what we know about you. Take a look at the conversation openers on the left. Click on any topic that grabs your attention, and we'll dive right in!!! ",
    },
  ]);

  store.commit("setProfileFlag", true);
  localStorage.setItem("isProfileEnabled", true);

  generateQuestions();
};

const generateQuestions = async () => {
  setTopics(
    store.state.questions.map((question) => ({
      path: `/chat/owner/${question}`,
      title: question,
      withNewText: true,
    }))
  );
};
</script>

<style>
.lilypad-network {
  border: 2px solid var(--sky-blue);
  border-radius: 8px;
  padding: 10px;
  width: fit-content;
}

.sky-blue-text {
  color: var(--sky-blue);
}
</style>

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
