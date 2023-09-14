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

import { useMetamask } from "@/composables/metamask";

const message = ref("");

const { metamaskFunctions } = useMetamask();

const setTopics = inject("setTopics");

const isInputsDisable = ref(false);

const step = ref(0);

const currentStepInputs = ref([
  [
    {
      title: "Start Research Wizard to determine ",
      subtitle: "your research objectives and interview questions ",
      disabled: true,
    },
    {
      title: "Browse Profiles of verified degens",
      subtitle: "to conduct your research",
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
