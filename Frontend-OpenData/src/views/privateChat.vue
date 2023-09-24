<template>
  <conversation :topic="selectedTopic" />
</template>

<script setup>
import { inject, onMounted, watch } from "vue";
import conversation from "@/components/chat/data-buyer/conversation.vue";
import { useRoute } from "vue-router";

const route = useRoute();

const selectedTopic = inject("selectedTopic");
const setSelectedTopic = inject("setSelectedTopic");

const topics = inject("topics");

const setTopic = () => {
  if (!route.params.dialogTitle) {
    setSelectedTopic(null);
    return;
  }

  const topic = topics.value.find((topic) =>
    topic.title.includes(route.params.dialogTitle)
  );
  setSelectedTopic(topic || null);
};

onMounted(() => {
  setTopic();
});

watch(
  route,
  () => {
    setTopic();
  },
  {
    immediate: true,
  }
);
</script>

<style></style>
