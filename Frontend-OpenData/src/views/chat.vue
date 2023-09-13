<template>
  <div class="d-flex flex-column expand">
    <chat-header />
    <div class="chat flex-1 expand">
      <sidebar v-model="selectedTopic" />

      <div class="content">
        <div class="d-flex flex-column expand">
          <chat-intro v-if="selectedTopic == null" />
          <chat-conversation v-else :topic="selectedTopic" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { provide, ref } from "vue";

import ChatHeader from "@/components/chat/header.vue";
import Sidebar from "@/components/chat/sidebar.vue";
import ChatIntro from "@/components/chat/intro.vue";
import ChatConversation from "@/components/chat/conversation.vue";

const selectedTopic = ref(null);
const topics = ref([]);

const setTopics = (_topics) => {
  topics.value = _topics;
};

provide("topics", topics);
provide("setTopics", setTopics);
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
  background-color: #343541;
}

h1 {
  font-size: 36px;
  color: #ececf1;
}

.default-chat {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.def-promt {
  width: 1000px;
  display: flex;
  justify-content: center;
  margin: auto;
  padding: 5px 150px;
  gap: 10px;
}

.prompt-A {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  background-color: #3e3f4b;
  text-align: center;
  padding: 15px 18px;
  margin-bottom: 5px;
  border-radius: 5px;
}

.prompt-A p {
  font-size: 14px;
}

.message-prompt {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rebeccapurple;
}

.final {
  justify-content: space-between;
  text-align: center;
  align-items: center;
}

.final p {
  font-size: 12px;
  color: #c5c5d2;
}
u {
  font-size: 12px;
  color: #c5c5d2;
}
</style>
