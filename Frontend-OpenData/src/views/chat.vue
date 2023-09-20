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
import { useStore } from "vuex";

const route = useRoute();
const store = useStore();

const selectedTopic = inject("selectedTopic");
const setSelectedTopic = inject("setSelectedTopic");

const topics = inject("topics");

onMounted(() => {
  if (localStorage.getItem("isProfileEnabled"))
    store.commit("setProfileFlag", true);
});

watch(
  route,
  () => {
    if (!route.params.title) {
      setSelectedTopic(null);
      return;
    }

    const topic = topics.value.find((topic) =>
      topic.title.includes(route.params.title)
    );
    setSelectedTopic(topic || null);
  },
  {
    immediate: true,
  }
);
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
