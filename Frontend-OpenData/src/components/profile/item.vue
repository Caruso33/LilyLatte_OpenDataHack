<template>
  <div class="profile-item" @click="routeToUserProfile">
    <div class="container mx-auto">
      <div class="d-flex justify-space-between">
        <div>
          <h2>{{ item.wallet.slice(0, 10) }}...{{ item.wallet.slice(-10) }}</h2>
          <!-- <div class="d-flex flex-wrap">
            <chip class="ma-1 ml-0"> fav dex: uniswap </chip>
            <chip class="ma-1 ml-0"> fav dex: uniswap </chip>
          </div> -->
        </div>

        <!-- <Image
          v-if="item.pfpCid"
          class="icon icon-80"
          :src="`https://ipfs.io/ipfs/${item.pfpCid}/outputs/image-0.png`"
        />
        <DAO v-else class="icon icon-80" /> -->
      </div>
    </div>
    <div
      class="container mx-auto profile__details d-flex justify-space-between"
    >
      <detail
        :title="`${walletAge} days`"
        desc="Wallet age"
        :loading="loading"
      />
      <detail :title="txNum" desc="Total TX" :loading="loading" />
      <detail :title="volume" desc="Total volume" :loading="loading" />
      <detail :title="QA" desc="Dialogues num" :loading="loading" />
    </div>
  </div>
</template>

<script setup>
import Chip from "@/components/chip.vue";
import Detail from "@/components/profile/detail.vue";
import DAO from "@/assets/icons/DAO.vue";
import Image from "@/components/image.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useTableLand } from "@/composables/tableLand";
import { onMounted, ref } from "vue";

const props = defineProps({
  item: Object,
});

const router = useRouter();
const store = useStore();

const { tableLandFunctions } = useTableLand();

const loading = ref(false);

const QA = ref(0);
const volume = ref(0);
const txNum = ref(0);
const walletAge = ref(0);

onMounted(() => {
  tableLandFunctions.initSigner();
  getTableLandData();
});

const routeToUserProfile = () => {
  console.log(props.item);
  router.push({
    name: "Profile",
    params: {
      name: props.item?.tableId || 1,
    },
  });
};

const getTableLandData = async () => {
  loading.value = true;
  try {
    const rows = await tableLandFunctions.getRows(props.item.tableId);

    QA.value = rows?.filter((val) => val.dataDialog)?.length || 0;

    if (rows.length) {
      const data = rows[0];

      if (data.Features?.length)
        walletAge.value = data.Features[0].wallet_age_days || 0;

      txNum.value =
        data.tx_by_chain?.reduce((sum, current) => (sum += current.n_tx), 0) ||
        0;

      volume.value =
        data.dex?.reduce((sum, current) => (sum += current.total_usd), 0) || 0;

      volume.value = Math.floor(volume.value);

      console.log(walletAge.value);
    }

    console.log("rows in getTableLandData", rows);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.profile-item {
  border: 1px solid var(--sky-blue);
  margin: 0.5rem 0;
  cursor: pointer;
  padding: 10px;
  border-radius: var(--border-radius);
  transition: var(--hover-transition);

  &:hover {
    background-color: var(--primary);
  }

  h2 {
    word-break: break-all;
  }
}
</style>
