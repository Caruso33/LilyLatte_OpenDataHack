<template>
  <h1 v-if="!chats.length" class="lily-text">Lilylatte</h1>

  <div id="chat-container" class="flex-1 chat-container">
    <chat-item v-for="(item, i) in chats" :key="i" :is-mine="item.isMine">
      <component v-if="item.component" :is="item.component" v-bind="item" />
      <span v-else v-html="item.message" />
    </chat-item>
    <buy
      v-if="!hasBought || loading"
      :loading="loading"
      :data="data"
      @onBuy="buyDataToken"
    />
  </div>

  <div class="d-flex flex-column justify-center align-center container mx-auto">
    <multi-btns v-if="currentStepInputs" :items="currentStepInputs" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

import ChatItem from "@/components/chat/item.vue";
import MultiBtns from "@/components/chat/inputs/multi-btns.vue";
import buy from "@/components/chat/data-buyer/buy.vue";

import { useLighthouse } from "@/composables/lighthouse";
import { useTableLand } from "@/composables/tableLand";
import { useLatteEth } from "@/composables/latte";
import { useRoute } from "vue-router";
import { getWallet } from "@/constants/ethereum-functions";
import { useLilyLatte } from "@/composables/lilylatte";

const props = defineProps({
  topic: String,
});

const conversationCID = ref("");
const data = ref([]);

const loading = ref(false);
const hasBought = ref(false);

const route = useRoute();

const { lighthouseFunctions } = useLighthouse();
const { tableLandFunctions, setSigner } = useTableLand();
const { lilyLatteFunctions } = useLilyLatte();
const latteEth = useLatteEth();

const currentStepInputs = ref("");

const chats = ref([
  {
    message:
      "Before we start: <br/> We are at beta, so this process will require several confirmation on metamask",
  },
]);

let signer;

onMounted(async () => {
  if (props.topic)
    chats.value = [
      {
        message: props.topic.title,
      },
    ];

  await getWallet();

  signer = await latteEth.getInstance();
  setSigner(signer);

  if (route.params.cid) fetchFile();
});

watch(
  () => props.topic,
  () => {
    chats.value = [
      {
        message: props.topic.title,
      },
    ];
  }
);

// const fetchTableData = async () => {
//   loading.value = true;
//   try {
//     const tableRows = await tableLandFunctions.getRows("OpenData_314159_282");
//     console.log(tableRows);
//     const foundRow = tableRows.find(
//       (row) => row.dataRequest == route.params.title
//     );

//     if (!foundRow) throw "row not found!!!";

//     conversationCID.value = foundRow.dataDialog;
//     fetchFile();
//   } catch (error) {
//     console.log(error);
//   }
//   loading.value = false;
// };

const buyDataToken = async () => {
  console.log("buyDataToken", route.params.cid);
  loading.value = true;
  try {
    const result = await lilyLatteFunctions.requestDialogTokenAccess(
      route.params.cid
    );
    console.log("buyDataToken", result);
    await fetchFile();
  } catch (error) {
    console.log("buyDataToken", error);
  } finally {
    loading.value = false;
  }
};

const fetchFile = async () => {
  loading.value = true;
  try {
    const result = await lighthouseFunctions.decrypt(signer, route.params.cid);

    if (!result) throw "Access Denied";

    hasBought.value = true;
    data.value = JSON.parse(result);
    chats.value = JSON.parse(result).slice(0, -1);
    console.log("result of fetchFile", result, data.value);

    currentStepInputs.value = [
      {
        title: "Hire lily to interview for you",
      },
      {
        title: "CONVO PURSACHED",
      },
    ];
  } catch (error) {
    console.log(error);
    hasBought.value = false;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.chat {
  &-container {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
}

.lily-text {
  position: absolute;
  top: 50%;
  left: 50%;
  opacity: 0.2;
  transform: translate(50%);
}
</style>
