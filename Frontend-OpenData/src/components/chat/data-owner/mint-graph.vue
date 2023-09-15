<template>
  <div
    v-for="(item, i) in steps"
    :key="i"
    class="d-flex align-center"
    :class="{ 'disable-text': step < i, 'error-text': step == i && hasError }"
  >
    ({{ i + 1 }} / {{ steps.length }}) {{ item.title }}:
    <div
      v-if="step == i && hasError"
      class="cursor-pointer ml-1 retry"
      @click="retry"
    >
      Retry
    </div>
    <indicator v-else-if="step == i" class="ml-1" />
    <div v-else-if="step > i" class="ml-1">Success</div>
    <div v-else class="ml-1">Waiting for signature</div>
  </div>
  <!-- <div
    class="d-flex align-center"
    :class="{ 'error-text': hasError }"
  >
    ({{ step + 1 }} / {{ steps.length }}) {{ steps[step].title }}:
    <div v-if="hasError" class="cursor-pointer ml-1 retry" @click="retry">
      Retry
    </div>
    <indicator v-else class="ml-1" />
  </div> -->
</template>

<script setup>
import { onMounted, ref } from "vue";
import Indicator from "@/components/indicator.vue";
import { useToast } from "vue-toastification";
import { addNetwork, switchNetwork } from "@/constants/ethereum-functions";
import { FVM, Lilypad } from "@/constants/chains";

import { useTableLand } from "@/composables/tableLand";
import { useLatteEth } from "@/composables/latte";

const toast = useToast();

const {
  setSigner,
  tableRef,
  tableLandFunctions,
  loading: tableLandLoading,
} = useTableLand();

const latteEth = useLatteEth();

const emit = defineEmits(["afterMintGraph"]);

const hasError = ref(false);

const step = ref(0);

const steps = ref([
  {
    title: "Minting dataGraph",
    onRun: () => mintGraph(),
  },
  {
    title: "Change network to Lily",
    onRun: () => changeNetworkToLily(),
  },
  {
    title: "Summon Lily, your AI Interviewer and start your first conversation",
    onRun: () => summonLily(),
  },
  {
    title: "(Upload this to your profile)",
    onRun: () => uploadProfile(),
  },
]);

onMounted(async () => {
  const signer = await latteEth.getInstance();
  setSigner(signer);
  steps.value[step.value].onRun();
});

const retry = () => {
  hasError.value = false;
  steps.value[step.value].onRun();
};

const onError = (error) => {
  console.log("error", error);
  hasError.value = true;
  // if (steps.value[step.value]?.title)
  //   toast.error(
  //     `Something went wrong in '${
  //       steps.value[step.value]?.title
  //     }' step. please try again`
  //   );
};

const nextStep = () => {
  step.value += 1;
  if (step.value < steps.value.length) steps.value[step.value].onRun();
};

const mintGraph = async () => {
  try {
    if (localStorage.getItem("tableRef")) {
      nextStep();
      return;
    }

    await addNetwork([FVM]);
    await switchNetwork(FVM.chainId);
    await tableLandFunctions.createTable("OpenData");
    nextStep();
  } catch (error) {
    onError(error);
  }
};

const changeNetworkToLily = async () => {
  try {
    await switchNetwork(Lilypad.chainId);

    setTimeout(() => {
      nextStep();
    }, 1000);
    // nextStep();
  } catch (error) {
    onError(error);
  }
};

const summonLily = async () => {
  try {
    setTimeout(() => {
      nextStep();
    }, 1000);
    // nextStep();
  } catch (error) {
    onError(error);
  }
};

const uploadProfile = async () => {
  console.log("in uploadProfile");
  try {
    emit("afterMintGraph");
    nextStep();
    console.log("afterMintGraph in uploadProfile");
  } catch (error) {
    console.log(error);
    onError(error);
  }
};
</script>

<style scoped>
.error-text {
  color: red;
}

.disable-text {
  color: #777;
}

.retry {
  text-decoration: underline;
}
</style>
