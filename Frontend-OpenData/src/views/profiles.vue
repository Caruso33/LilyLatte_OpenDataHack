<template>
  <div class="row overflow-auto pa-1">
    <profile-item v-for="i in 6" :key="i" class="col-6" />
  </div>
</template>

<script setup>
import ProfileItem from "@/components/profile/item.vue";
import { inject, onMounted } from "vue";

const setTopics = inject("setTopics");

onMounted(() => {
  setTopics([{ id: "chat/buyer", title: "researcher onboarding" }]);
});
</script>

<style></style>
