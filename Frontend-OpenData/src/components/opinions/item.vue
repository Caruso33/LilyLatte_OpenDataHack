<template>
  <div class="card pa-3">
    <div class="d-flex justify-space-between">
      <div>
        <h1>{{ item.exchange }}</h1>
        <chip
          class="mt-1"
          @click="$router.push(`/profiles/${item.data_owner_id}`)"
        >
          View Profile
        </chip>
      </div>
      <div v-if="hasButton && isVotingEnabled && !loading">
        <chip
          color="green"
          textColor="white"
          class="cursor-pointer"
          @click="vote(true)"
        >
          AGREE
        </chip>
        <chip
          color="red"
          textColor="white"
          class="cursor-pointer mt-1"
          @click="vote(false)"
        >
          Disagree
        </chip>
      </div>
      <indicator v-else-if="loading" />
    </div>
    <div class="mt-1">
      <h3 class="my-2">{{ item.summarize }}</h3>
      <div class="d-flex mt-1">
        <detail :title="rank" desc="Rank" />
        <detail
          :title="
            votesByRowId[item.id] != undefined
              ? `${votesByRowId[item.id]?.point > 0 ? '+' : ''}${
                  votesByRowId[item.id]?.point
                }`
              : '-'
          "
          desc="Net vote"
          class="ml-4"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Indicator from "@/components/indicator.vue";
import Chip from "@/components/chip.vue";
import Detail from "@/components/profile/detail.vue";
import { onMounted, ref } from "vue";
import { useLilyLatte } from "@/composables/lilylatte";

const props = defineProps({
  wallet: String,
  item: Object,
  rank: {
    type: Number,
    default: 1,
  },
  hasButton: {
    type: Boolean,
    default: false,
  },
  votesByRowId: {
    type: Object,
    default: () => {},
  },
  pollIndexes: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update"]);

const { lilyLatteFunctions } = useLilyLatte();

const loading = ref(false);

const isVotingEnabled = ref(true);

onMounted(async () => {
  const votedIds = getStoredVotes();
  isVotingEnabled.value = !votedIds.includes(props.item.id);
});

const vote = async (isAgree) => {
  loading.value = true;
  try {
    const result = await lilyLatteFunctions.voteOpinionPoll(
      props.item.id,
      isAgree
    );

    console.log("result vote", result);
    emit("update");
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;

    let votedIds = getStoredVotes();

    if (!votedIds.includes(props.item.id)) {
      votedIds = [...votedIds, props.item.id];
      localStorage.setItem("votedIds", JSON.stringify(votedIds));
      isVotingEnabled.value = false;
    }
  }
};

const getStoredVotes = () =>
  localStorage.getItem("votedIds")
    ? JSON.parse(localStorage.getItem("votedIds")) || []
    : [];
</script>

<style></style>
