<template>
  <div
    class="chat-list-item"
    :class="{ active: isActive, 'with-border': withBorder, disabled: disabled }"
  >
    <small class="one-line-text mr-1">{{ title }}</small>
    <small v-if="withNewText" class="new ml-auto">New</small>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  isActive: {
    type: Boolean,
    default: false,
  },
  withBorder: {
    type: Boolean,
    default: true,
  },
  withNewText: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
.chat-list-item {
  --border-color: var(--tertiary);
  --background: #2a2b32;

  gap: 6px;
  margin: 0.5rem 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: var(--border-radius);

  transition: var(--hover-transition);

  &.disabled {
    --border-color: grey;
    --background: grey;
  }

  &.active {
    background-color: var(--border-color);
  }

  &:hover {
    background-color: var(--background);
  }

  &.with-border {
    border: 1px solid var(--border-color);
  }
}

.new {
  padding: 4px 8px;
  border-radius: 10px;
  background: lightblue;
  color: black;
  font-size: 0.5rem;
}

.one-line-text {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
