<template>
  <div class="prompt-form d-flex expand-width">
    <input
      v-model="model"
      type="text"
      placeholder="Send a messages"
      class="flex-1"
    />

    <button class="mr-1" @click="$emit('onSend')">
      <indicator v-if="loading" />
      <send v-else />
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";

import Send from "@/assets/icons/send.vue";
import indicator from "@/components/indicator.vue";

const props = defineProps({
  modelValue: String,
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get() {
    return props.modelValue;
  },
  set(v) {
    emit("update:modelValue", v);
  },
});
</script>

<style scoped lang="scss">
.prompt-form {
  background-color: var(--primary);
  padding: 10px 20px;
  border-radius: var(--border-radius);
  width: 100%;
  box-shadow: 10px 10px 34px -15px rgba(0, 0, 0, 0.25);
  margin-bottom: 10px;

  input {
    color: white;
  }
}

.prompt-form input {
  background: none;
  border: none;
  width: 100%;
}

input:focus {
  outline: none;
}

::placeholder {
  color: #8e8ea0;
}

button {
  background: transparent;
  border: unset;
  cursor: pointer;
}
</style>
