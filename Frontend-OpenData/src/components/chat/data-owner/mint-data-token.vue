<template>
  <multi-steps :step="step" :steps="steps" :hasError="hasError" @retry="retry" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import MultiSteps from "@/components/chat/multi-steps.vue";
import { useToast } from "vue-toastification";
import { switchNetwork } from "@/constants/ethereum-functions";
import { FVM } from "@/constants/chains";

import { useTableLand } from "@/composables/tableLand";
import { useLatteEth } from "@/composables/latte";
import { useLighthouse } from "@/composables/lighthouse";
import { useLilyLatte } from "@/composables/lilylatte";
import { useMetamask } from "@/composables/metamask";
import { prompts } from "@/constants/prompts";
import { useRoute } from "vue-router";
import { useOpenAI } from "@/composables/openai";
import { constants } from "@/constants";

const props = defineProps({
  chats: Array,
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["onFinish"]);

const toast = useToast();
const route = useRoute();

const {
  setSigner,
  tableRef,
  tableLandFunctions,
  loading: tableLandLoading,
} = useTableLand();

const { openAIFunctions } = useOpenAI();
const { lighthouseFunctions } = useLighthouse();
const { lilyLatteFunctions } = useLilyLatte();
const { metamaskFunctions } = useMetamask();
const latteEth = useLatteEth();

const hasError = ref(false);

const conversationFileCID = ref("");

const step = ref(0);

const steps = ref([
  {
    title: "Change back to FVM network",
    onRun: () => changeNetworkToFVM(),
  },
  {
    title: "Mint your membership NFT",
    onRun: () => mintNFT(),
  },
  {
    title: "Upload Keywords",
    onRun: () => uploadKeywords(),
  },
  {
    title: "Encrypt and store your dialog",
    onRun: () => storeEncryptedDialog(),
  },
  {
    title: "Mint an access token",
    onRun: () => mintAccessToken(),
  },
  {
    title: "Add your dialog CID to your dataGraph",
    onRun: () => addCIDToTableLand(),
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

const uploadKeywords = async () => {
  try {
    const keywords = await fetchConversationKeywords();
    await addKeywordsToTableLand(keywords);
    nextStep();
  } catch (error) {
    nextStep();
  }
};

const fetchConversationKeywords = async () => {
  try {
    const firstMessage = prompts.first_message
      .replaceAll("§question§", route.params.title)
      .replaceAll("§answer§", props.chats[1].message);

    const { choices } = await openAIFunctions.sendMultiple([
      {
        role: "user",
        content: firstMessage,
      },
      ...props.chats.slice(2).map((chat) => ({
        role: chat.isMine ? "user" : "assistant",
        content: chat.message,
      })),
      {
        role: "user",
        content: prompts.keywords,
      },
    ]);

    if (choices.length && choices[0].message?.content)
      return choices[0].message?.content.replaceAll("\n", "").split("§");

    return [];
  } catch (error) {
    console.log(error);
  }
};

const addKeywordsToTableLand = async (keywords) => {
  try {
    const wallet = await metamaskFunctions.connect();

    const keywordsStr = keywords.reduce((str, current, i) => {
      if (!current.length) return str;

      const [keyword, opinion] = current.split("-");

      if (!keyword?.length || !opinion?.length) return str;

      str += `('${keyword.trim()}', '${opinion.trim()}', '${wallet}'), `;

      return str;
    }, "");

    const result = await tableLandFunctions.insertMultipleIntoTable(
      keywordsStr.slice(0, -2),
      constants.keywordsTable,
      "exchange,summarize,data_owner_id"
    );
    console.log("addKeywordsToTableLand", result);
  } catch (error) {
    console.log(error);
  }
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
    const result = await lilyLatteFunctions.addNewDialog(
      conversationFileCID.value
    );
    console.log("mintAccessToken", result);
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

    conversationFileCID.value = Hash;

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
    emit("afterMintGraph");
  } catch (error) {
    onError(error);
  }
};

const mintNFT = async () => {
  try {
    nextStep();
  } catch (error) {
    console.log(error);
    onError(error);
  }
};
</script>
