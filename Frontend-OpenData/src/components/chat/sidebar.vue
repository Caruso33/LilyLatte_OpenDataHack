<template>
  <div class="sideBar d-flex flex-column expand-height">
    <div class="chat-group flex-1">
      <transition-group>
        <topic
          v-for="topic in topics"
          :key="topic.path"
          :title="topic.title"
          :isActive="model?.path == topic.path"
          :withNewText="topic.withNewText"
          :disabled="topic.disabled || false"
          @click="!topic.disabled && $router.push(`${topic.path}`)"
        />
      </transition-group>
    </div>
    <div class="mt-auto">
      <topic
        v-if="userType == 'owner'"
        :title="'My profile'"
        :isActive="route.path == '/myprofile'"
        :withBorder="false"
        :disabled="!$store.state.isProfileEnabled"
        @click="$router.push(`/myprofile`)"
      />
      <topic
        v-else-if="userType == 'buyer'"
        :title="'Browse DAO Members'"
        :isActive="route.path == '/profiles'"
        :withBorder="false"
        @click="$router.push(`/profiles`)"
      />
      <topic
        :title="'Opinions of DAO'"
        :withBorder="false"
        @click="$router.push(`/opinions`)"
      />
      <topic :title="'Home'" :withBorder="false" @click="$router.push(`/`)" />
    </div>
  </div>
</template>

<script setup>
import Topic from "@/components/chat/topic.vue";
import { computed, inject } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);

const route = useRoute();

const topics = inject("topics");

const userType = computed(() => localStorage.getItem("userType") || "owner");

const model = computed({
  get() {
    return props.modelValue;
  },
  set(v) {
    emit("update:modelValue", v);
  },
});
</script>

<style scoped>
.sideBar {
  padding: 10px;
  background-color: #202123;
  height: 100%;
  width: min(30%, 300px);
  font-size: 14px;
  overflow-y: auto;
}

.btn {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.chat-group {
  overflow: auto;
}

.chat-group small {
  color: #8e8ea0;
  padding-bottom: 10px;
  display: block;
  font-size: 12px;
}
</style>
