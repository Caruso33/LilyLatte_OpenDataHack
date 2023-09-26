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

import { useMetamask } from "@/composables/metamask";
import { useRouter } from "vue-router";

const router = useRouter();
const { metamaskFunctions } = useMetamask();

const setTopics = inject("setTopics");

const message = ref("");

const isInputsDisable = ref(false);

const step = ref(0);

const currentStepInputs = ref([
  [
    {
      title: "Connect your wallet",
      distinct: true,
      click: () => metamaskFunctions.connect(onSuccessConnectWallet),
    },
  ],
  [
    {
      title: "Browse DAO Members",
      click: () => router.replace("/profiles"),
    },
    {
      title: "Opinions of DAO",
      click: () => router.replace("/opinions"),
    },
    {
      title: "Research Wizard",
      disabled: true,
    },
  ],
  [],
]);

const chats = ref([
  {
    message:
      "Welcome to Lilylatte! Are you curious to uncover the collective wisdom and insights from our vibrant community of web3 citizens? Great, you're in the right place! <br/>First things first, please connect your wallet to proceed.",
  },
]);

onMounted(() => {
  if (localStorage.getItem("userType") == "buyer") {
    setTopics([
      {
        path: `/chat/buyer`,
        title: "Intro",
      },
    ]);
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

const onSuccessConnectWallet = () => {
  nextStep([
    {
      message: "Wallet connected.",
      isMine: true,
    },
    {
      message:
        "Awesome, you're all set! Here's what we have lined up for you: <br/> <br/> <h3>Opinions of DAO:</h3> Step into our curated garden of opinions, harvested directly from meaningful dialogues among our DAO members & Lily. See an opinion that piques your interest? Click on the contributor's profile to learn more, or perhaps purchase access to their full dialogues. You can even initiate an interview with them. <br/> <br/><h3>OBrowse DAO Members:</h3>  Fancy a little profile hopping? Browse through our list of DAO members, each rich with onchain activities that might just catch your eye. Once you find a profile you're interested in, you can dive deeper by purchasing access to their full dialogues or even initiate an interview with them.<br/> <br/><h3>Research Wizard (Coming Soon):</h3> Ready to take your research to the next level? Meet your AI-powered Research Wizard, capable of assisting you in creating partially or fully autonomous surveys and interviews. Let technology amplify your capabilities!",
    },
  ]);
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
