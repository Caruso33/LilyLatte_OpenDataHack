<template>
  <div class="row row-reverse">
    <topic
      v-for="(item, i) in items"
      :key="i"
      class="col-6"
      :disabled="disabled"
      v-bind="item"
      v-on="!disabled ? item : {}"
    />
  </div>
</template>

<script setup>
import Topic from "@/components/chat/topic.vue";

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
.row-reverse {
  flex-direction: row-reverse;
}
</style>
