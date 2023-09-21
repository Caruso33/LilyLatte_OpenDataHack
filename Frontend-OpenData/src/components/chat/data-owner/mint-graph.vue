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
import { addNetwork, switchNetwork } from "@/constants/ethereum-functions";
import { FVM, Lilypad } from "@/constants/chains";

import { useTableLand } from "@/composables/tableLand";
import { useLatteEth } from "@/composables/latte";
import { useStore } from "vuex";
import { prompts } from "@/constants/prompts";
import { useDune } from "@/composables/dune";
import { useOpenAI } from "@/composables/openai";
import { useLilyLatte } from "@/composables/lilylatte";
import { useLilypad } from "@/composables/lilypad";

const emit = defineEmits(["afterMintGraph"]);

let dunePromise;

const store = useStore();
const { duneFunctions } = useDune();

const { openAIFunctions } = useOpenAI();

const { lilyLatteFunctions } = useLilyLatte();

const { lilypadFunctions } = useLilypad();

const {
  setSigner,
  tableLandFunctions,
  loading: tableLandLoading,
} = useTableLand();

const latteEth = useLatteEth();

const hasError = ref(false);

const step = ref(0);

const steps = ref([
  {
    title: "Mint Your DataGraph (Why?)",
    onRun: () => mintGraph(),
  },
  {
    title: "Store Your On-chain Achievements in Your DataGraph.",
    onRun: () => storeToTableLand(),
  },
  {
    title: "Add Your DataGraph to Lilylatte Smart Contract.",
    onRun: () => addDataToSC(),
  },
  {
    title: "Change network to Lily",
    onRun: () => changeNetworkToLily(),
  },
  {
    title: "Summon Lily, your AI Interviewer and start your first conversation",
    onRun: () => summonLily(),
  },
]);

onMounted(async () => {
  const signer = await latteEth.getInstance();
  setSigner(signer);
  steps.value[step.value].onRun();

  const wallet = await signer.getAddress();
  console.log("wallet before get dune features", wallet);
  dunePromise = duneFunctions.getAll(wallet);
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
    await addNetwork([FVM]);
    await switchNetwork(FVM.chainId);

    await lilyLatteFunctions.initContract();
    await lilypadFunctions.initContract();

    const signer = await latteEth.getInstance(true);
    setSigner(signer);

    if (localStorage.getItem("tableRef")) {
      nextStep();
      return;
    }

    await tableLandFunctions.createTable("OpenData");
    nextStep();
  } catch (error) {
    onError(error);
  }
};

const storeToTableLand = async () => {
  try {
    const questions = await fetchQuestionsFromOpenAI();
    console.log("result fetchQuestionsFromOpenAI", questions);

    store.commit("setQuestions", questions);
    localStorage.setItem("questions", JSON.stringify(questions));

    await insertToTableLand(questions);

    nextStep();
  } catch (error) {
    console.error(error);

    // todo: BIG PROBLEM here... remove comments and nextStep here
    // onError(error);
    nextStep();
  }
};

const changeNetworkToLily = async () => {
  try {
    await switchNetwork(Lilypad.chainId);

    await lilyLatteFunctions.initContract();
    await lilypadFunctions.initContract();

    nextStep();
  } catch (error) {
    onError(error);
  }
};

const summonLily = async () => {
  try {
    await lilypadFunctions.generate(prompts.nft_generate);
    nextStep();
    emit("afterMintGraph");
  } catch (error) {
    onError(error);
  }
};

const addDataToSC = async () => {
  try {
    const tableRef = localStorage.getItem("tableRef");
    await lilyLatteFunctions.addOwner(tableRef);
    nextStep();
  } catch (error) {
    console.log(error);
    onError(error);
  }
};

const formatDuneResultsAsStr = (results) => {
  const queryTitles = [
    "",
    "top dex volume",
    "top 5 holding evm",
    "top tx number by chain",
  ];

  const duneFeaturesStr = results.reduce((str, current, i) => {
    if (!current.rows.length) return str;
    str += queryTitles[i];

    const keys = Object.keys(current.rows[0]);
    str += keys.join(",");
    str += "\n";

    current.rows.forEach((obj) => {
      str += Object.values(obj).join(",") + "\n";
    });
    str += "\n";

    return str;
  }, "");

  return duneFeaturesStr;
};

const formatDuneResultsAsObj = (results) => {
  const queryTitles = ["meta", "dex", "top_5_evm", "tx_by_chain"];

  const duneFeaturesObj = results.reduce((obj, current, i) => {
    if (!current.rows.length) return obj;

    const title = queryTitles[i];

    obj[title] = JSON.stringify(current.rows);

    return obj;
  }, {});

  return duneFeaturesObj;
};

const fetchQuestionsFromOpenAI = async () => {
  const duneResults = await dunePromise;

  if (Array.isArray(duneResults))
    localStorage.setItem("duneFeatures", JSON.stringify(duneResults));

  const duneFeaturesStr = formatDuneResultsAsStr(duneResults);

  const prompt = prompts.pre + "\n" + duneFeaturesStr;

  const { choices } = await openAIFunctions.send(prompt);

  if (choices.length && choices[0].message?.content)
    return choices[0].message?.content
      .split("§")
      .slice(0, -1)
      .map((val) =>
        val.replaceAll(":", "").replaceAll("'", "").replaceAll("\n", "")
      );

  return [];
};

const insertToTableLand = async (data) => {
  const duneResults = await dunePromise;

  const duneFeaturesStr = formatDuneResultsAsObj(duneResults);

  const recordsStr = data.reduce((str, current) => {
    str += `('${current}', NULL, '${duneFeaturesStr.meta}', '${duneFeaturesStr.top_5_evm}', '${duneFeaturesStr.tx_by_chain}', '${duneFeaturesStr.dex}'), `;
    return str;
  }, "");

  const result = await tableLandFunctions.insertMultipleIntoTable(
    recordsStr.slice(0, -2)
  );
};
</script>
