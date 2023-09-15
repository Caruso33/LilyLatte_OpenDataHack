<template>
  <component
    v-if="selectedTopic == null"
    :is="$route.params.type == 'owner' ? ChatOwnerIntro : ChatBuyerIntro"
  />
  <chat-conversation v-else :topic="selectedTopic" />
</template>

<script setup>
import { inject, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

import ChatOwnerIntro from "@/components/chat/data-owner/intro.vue";
import ChatBuyerIntro from "@/components/chat/data-buyer/intro.vue";
import ChatConversation from "@/components/chat/data-owner/conversation.vue";
import { useDune } from "@/composables/dune";
import { useMetamask } from "@/composables/metamask";

const route = useRoute();

const { wallet, metamaskFunctions } = useMetamask();

const selectedTopic = inject("selectedTopic");
const setSelectedTopic = inject("setSelectedTopic");

const topics = inject("topics");

onMounted(async () => {
  await metamaskFunctions.connect();
});

watch(route, () => {
  if (!route.params.id) {
    setSelectedTopic(null);
    return;
  }

  const topic = topics.value.find((topic) => topic.id == +route.params.id);
  setSelectedTopic(topic || null);
});
</script>

<style scoped lang="scss">
.chat {
  display: flex;
  justify-content: center;
  flex: 1;
  overflow: hidden;
  color: white;

  &-container {
    overflow-y: auto;
  }
}

.content {
  width: 100%;
  height: 100%;
  background-color: var(--secondary);
}
</style>
