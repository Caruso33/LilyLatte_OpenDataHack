<template>
  <multi-steps :step="step" :steps="steps" :hasError="hasError" @retry="retry" />
</template>

<script setup>
import { inject, onMounted, ref } from "vue";
import MultiSteps from "@/components/chat/multi-steps.vue";
import { useToast } from "vue-toastification";
import { switchNetwork } from "@/constants/ethereum-functions";
import { FVM } from "@/constants/chains";

import { useTableLand } from "@/composables/tableLand";
import { useKeywords } from "@/composables/keywords";
import { useLatteEth } from "@/composables/latte";
import { useLighthouse } from "@/composables/lighthouse";
import { useLilyLatte } from "@/composables/lilylatte";
import { useMetamask } from "@/composables/metamask";
import { prompts } from "@/constants/prompts";
import { useRoute } from "vue-router";
import { useOpenAI } from "@/composables/openai";
import { constants } from "@/constants";
import { ethers } from "ethers";

const props = defineProps({
  chats: Array,
  isCompleted: {
    type: Boolean,
    default: false,
  },
  onFinish: Function,
});

const toast = useToast();
const route = useRoute();

const {
  setSigner,
  tableLandFunctions,
  loading: tableLandLoading,
} = useTableLand();

const { keywordFunctions } = useKeywords();
const { openAIFunctions } = useOpenAI();
const { lighthouseFunctions } = useLighthouse();
const { lilyLatteFunctions } = useLilyLatte();
const { metamaskFunctions } = useMetamask();
const latteEth = useLatteEth();

const selectedTopic = inject("selectedTopic");

const hasError = ref(false);

const keywords = ref([]);

const dialogCID = ref(""); // conversation file cid stored on lighthouse

const step = ref(0);

const steps = ref([
  {
    title: "Switch back to the FVM network",
    onRun: () => changeNetworkToFVM(),
  },
  {
    title: "Encrypt and save your dataDialog",
    onRun: () => storeEncryptedDialog(),
  },
  {
    title: "Mint an access token for this Dialogue",
    onRun: () => mintAccessToken(),
  },
  {
    title: "Mint your unique DAO membership NFT",
    onRun: () => mintNFT(),
  },
  {
    title: "Extract and add topics/opinions to Opinions of DAO dataGraph",
    onRun: () => uploadKeywords(),
  },
  {
    title: "Associate DAO opinion rowID with Lilylatte SC",
    onRun: () => addKeywordsToSC(),
  },
  {
    title: "Link your dialogue CID to your personal dataGraph",
    onRun: () => addCIDToTableLand(),
  },
]);

let signer;

onMounted(async () => {
  if (props.isCompleted) {
    step.value = steps.value.length;
    return;
  }

  await metamaskFunctions.connect();
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
    const _keywords = await fetchConversationKeywordsToOpenAI();
    keywords.value = _keywords.filter((val) => !!val);
    console.log("keywords", keywords.value);

    await addKeywordsToTableLand(_keywords);
    nextStep();
  } catch (error) {
    console.log(error);
    onError(error);
  }
};

const fetchConversationKeywordsToOpenAI = async () => {
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

const fetchConversationKeywordsToLilypad = async () => {
  try {
    const firstMessage = prompts.first_message
      .replaceAll("§question§", route.params.title)
      .replaceAll("§answer§", props.chats[1].message);

    // TODO: Still needs to be refined
    const promptCid = await lighthouseFunctions.uploadJson({
      template: `${firstMessage} \n \n {question}`,
      parameters: {
        question: chat.message
      }
    })

    const lilypadResults = await lilypadFunctions.sendAndGetNewResults(promptCid)

    if (lilypadResults) {
      const latestResult = lilypadResults[lilypadResults.length - 1]
      console.log(`Lilypad result ${latestResult}`)

      return latestResult
    }

    return [];
  } catch (error) {
    console.log(error);
  }
}

const addKeywordsToTableLand = async (keywords) => {
  const wallet = await metamaskFunctions.connect();

  const keywordsArr = keywords.reduce((arr, current, i) => {
    if (!current.length) return arr;

    const [keyword, opinion] = current.split("-");

    if (!keyword?.length || !opinion?.length) return arr;

    const str = `'${keyword.trim()}', '${wallet}', '${opinion.trim()}'`;

    return [...arr, str];
  }, []);

  console.log("values before insert", keywordsArr);
  const result = await keywordFunctions.insert(keywordsArr);
  console.log("addKeywordsToTableLand", result);

  // const wallet = await metamaskFunctions.connect();

  // const keywordsStr = keywords.reduce((str, current, i) => {
  //   if (!current.length) return str;

  //   const [keyword, opinion] = current.split("-");

  //   if (!keyword?.length || !opinion?.length) return str;

  //   str += `('${keyword.trim()}', '${opinion.trim()}', '${wallet}'), `;

  //   return str;
  // }, "");

  // const result = await tableLandFunctions.insertMultipleIntoTable(
  //   keywordsStr.slice(0, -2),
  //   constants.keywordsTable,
  //   "exchange,summarize,data_owner_id"
  // );
  // console.log("addKeywordsToTableLand", result);
};

const addKeywordsToSC = async () => {
  try {
    const rows = await tableLandFunctions.getRows(constants.keywordsTable);
    const lastTableRowId = rows.slice(-1)[0].id;

    console.log(
      "before addOpinionPolls",
      rows.slice(-1),
      lastTableRowId,
      keywords.value,
      Array(keywords.value.length)
        .fill(0)
        .map((_, i) => i + lastTableRowId + 1)
    );

    const addPollsResult = await lilyLatteFunctions.addOpinionPolls(
      Array(keywords.value.length)
        .fill(0)
        .map((_, i) => i + lastTableRowId + 1)
    );
    console.log("addKeywordsToSC", addPollsResult);

    nextStep();
  } catch (error) {
    console.log(error);
    onError(error);
  }
};

const changeNetworkToFVM = async () => {
  try {
    await switchNetwork(FVM.chainId);

    tableLandFunctions.initSigner();
    await keywordFunctions.initContract();
    await lilyLatteFunctions.initContract();

    nextStep();
  } catch (error) {
    onError(error);
  }
};

const mintAccessToken = async () => {
  try {
    console.log("before mintAccessToken", dialogCID.value);
    const result = await lilyLatteFunctions.addNewDialog(dialogCID.value);
    console.log("after addNewDialog", result, dialogCID.value);

    const dialog = await lilyLatteFunctions.getMintedTokenId(dialogCID.value);

    console.log("dialog in mintAccessToken", dialog);

    await lighthouseFunctions.putAccessConditions(
      signer,
      dialogCID.value,
      ethers.BigNumber.from(dialog.tokenId).toString()
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

    dialogCID.value = Hash;

    console.log("storeEncryptedDialog hash", Hash);

    nextStep();
  } catch (error) {
    onError(error);
  }
};

const getMyNFTTokenId = async (wallet) => {
  const { membershipTokenId } = await lilyLatteFunctions.getOwnerToData(wallet);

  console.log("membershipTokenId", membershipTokenId);
  if (!membershipTokenId) return;

  localStorage.setItem(
    "nftId",
    ethers.BigNumber.from(membershipTokenId).toString()
  );
};

const mintNFT = async () => {
  try {
    const wallet = await metamaskFunctions.connect();
    console.log("wallet in mintNFT", wallet);

    if (localStorage.getItem("nftId")) {
      nextStep();
      return;
    }

    const tableLandRef = localStorage.getItem("tableRef");
    if (!tableLandRef) throw "tableland ref not found";

    const nftCid = localStorage.getItem("nftCID");
    if (!nftCid) throw "nftCID ref not found";

    console.log("before addPFP", nftCid);
    await lilyLatteFunctions.addOwnerAsMember(nftCid);

    console.log("before getMyNFTTokenId", wallet);
    await getMyNFTTokenId(wallet);

    nextStep();
  } catch (error) {
    console.log(error);
    onError(error);
  }
};

const addCIDToTableLand = async () => {
  try {
    console.log(
      "before updateDataDialogWithTitle",
      dialogCID.value,
      selectedTopic.value.title?.trim()
    );
    await tableLandFunctions.updateDataDialogWithTitle(
      dialogCID.value,
      selectedTopic.value.title?.trim()
    );
    nextStep();
    props.onFinish();
  } catch (error) {
    console.log("error in addCIDToTableLand", error);
    // onError(error);
    nextStep();
    props.onFinish();
  }
};
</script>
