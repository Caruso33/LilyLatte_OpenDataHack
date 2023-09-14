<template>
  <div
    class="chat-list-item flex-column f-g0 justify-center"
    :class="{
      active: isActive,
      'with-border': withBorder,
      distinct,
      disabled,
    }"
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
  --border-color: var(--tertiary);
  --background: #2a2b32;
  --subtitle-color: #ddd;

  gap: 6px;
  margin: 0.5rem 0;
  cursor: pointer;
  display: flex;
  padding: 10px;
  border-radius: var(--border-radius);

  transition: var(--hover-transition);

  &.disabled {
    --border-color: #555;
    --background: transparent;
    --subtitle-color: #555;

    cursor: unset;
    color: #555 !important;
  }

  &.active {
    background-color: var(--border-color);
  }

  &:hover {
    background-color: var(--background);
  }

  .subtitle {
    color: var(--subtitle-color);
  }

  &.with-border {
    border: 1px solid var(--border-color);

    &.distinct {
      border-color: #56ccf2;
    }
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
