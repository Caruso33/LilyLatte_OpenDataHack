<template>
  <div
    class="chat-list-item flex-column f-g0 justify-center"
    :class="{ active: isActive, 'with-border': withBorder, distinct: distinct }"
  >
    <div class="ml-1 one-line-text">{{ title }}</div>
    <small v-if="subtitle" class="ml-1 one-line-text subtitle">
      {{ subtitle }}
    </small>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
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
  distinct: {
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
  gap: 6px;
  margin: 0.5rem 0;
  cursor: pointer;
  display: flex;
  padding: 10px;
  border-radius: var(--border-radius);
  text-align: left;
  transition: var(--hover-transition);

  &.active {
    background-color: #2a2b32;
  }

  &:hover {
    background-color: #2a2b32;
  }

  .subtitle {
    color: #ddd;
  }
}

.with-border {
  border: 1px solid #4d4d4f;

  &.distinct {
    border-color: #56ccf2;
  }
}

.new {
  padding: 4px 8px;
  border-radius: 10px;
  background: goldenrod;
  color: black;
}

.one-line-text {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
