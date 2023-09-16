<template>
  <div class="expand-width chat-item" :class="{ 'chat-item__mine': isMine }">
    <div class="content container d-flex mx-auto">
      <UserIcon v-if="isMine" class="icon-32" />
      <LogoIcon v-else class="icon icon-32" />

      <div class="flex-1 ml-4 text-justify">
        <slot>
          <span>{{ message }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import UserIcon from "@/assets/icons/user.vue";
import LogoIcon from "@/assets/icons/logo.vue";

defineProps({
  message: {
    type: String,
    default: "",
  },
  isMine: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
.chat-item {
  padding: 1rem;
  background-color: var(--primary);

  &__mine {
    background-color: transparent !important;
  }

  &__img {
    height: 2rem;
    width: 2rem;
  }
}
</style>
