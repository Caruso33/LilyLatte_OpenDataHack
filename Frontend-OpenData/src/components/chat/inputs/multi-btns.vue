<template>
  <div class="row row-reverse">
    <SelectableBtn
      v-for="(item, i) in items"
      :key="i"
      class="col-6"
      v-bind="item"
      v-on="!disabled ? item : {}"
    />
  </div>
</template>

<script setup>
import SelectableBtn from "@/components/chat/inputs/selectable-btn.vue";

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
