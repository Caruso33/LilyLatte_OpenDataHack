<template>
  <multi-steps
    :step="step"
    :steps="steps"
    :hasError="hasError"
    @retry="retry"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import MultiSteps from "@/components/chat/multi-steps.vue";
import { useToast } from "vue-toastification";
import { addNetwork, switchNetwork } from "@/constants/ethereum-functions";
import { FVM } from "@/constants/chains";

import { useTableLand } from "@/composables/tableLand";
import { useLatteEth } from "@/composables/latte";
import { useLighthouse } from "@/composables/lighthouse";
import { useLilyLatte } from "@/composables/lilylatte";

const props = defineProps({
  chats: Array,
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["onFinish"]);

const toast = useToast();

const {
  setSigner,
  tableRef,
  tableLandFunctions,
  loading: tableLandLoading,
} = useTableLand();

const { lighthouseFunctions } = useLighthouse();

const { lilyLatteFunctions } = useLilyLatte();

const latteEth = useLatteEth();

const hasError = ref(false);

const step = ref(0);

const steps = ref([
  {
    title: "Change back to FVM network",
    onRun: () => changeNetworkToFVM(),
  },
  {
    title: "Mint an access token",
    onRun: () => mintAccessToken(),
  },
  {
    title: "Encrypt and store your dialog",
    onRun: () => storeEncryptedDialog(),
  },
  {
    title: "Add your dialog CID to your dataGraph",
    onRun: () => addCIDToTableLand(),
  },
  {
    title: "Mint your membership NFT",
    onRun: () => mintNFT(),
  },
]);

let signer;

onMounted(async () => {
  if (props.isCompleted) return;

  signer = await latteEth.getInstance();
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
};

const nextStep = () => {
  step.value += 1;
  if (step.value < steps.value.length) steps.value[step.value].onRun();
};

const changeNetworkToFVM = async () => {
  try {
    await switchNetwork(FVM.chainId);
    signer = await latteEth.getInstance();
    setSigner(signer);

    nextStep();
  } catch (error) {
    onError(error);
  }
};

const mintAccessToken = async () => {
  try {
    // todo: connect mint dataToken for data owner
    const result = await lilyLatteFunctions.mintNewDialogToken();

    nextStep();
  } catch (error) {
    onError(error);
  }
};

const storeEncryptedDialog = async () => {
  try {
    const { Hash } = await lighthouseFunctions.uploadEncrypted(
      signer,
      JSON.stringify(props.chats)
    );
    await lighthouseFunctions.putAccessConditions(signer, Hash);
    nextStep();
  } catch (error) {
    onError(error);
  }
};

const addCIDToTableLand = async () => {
  try {
    // todo: fill and test it later
    const result = await tableLandFunctions.insertIntoTable({
      features: "",
      dataDialog: "",
      dataRequest: "",
    });
    nextStep();
  } catch (error) {
    onError(error);
  }
};

const mintNFT = async () => {
  try {
    nextStep();
    emit("afterMintGraph");
  } catch (error) {
    console.log(error);
    onError(error);
  }
};
</script>
