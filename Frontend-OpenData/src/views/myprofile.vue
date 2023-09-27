<template>
  <div class="primary-bg">
    <div class="container mx-auto">
      <div class="d-flex justify-space-between">
        <div>
          <h2>{{ walletAddress }}</h2>
        </div>

        <div class="d-flex flex-column align-center">
          <Image
            v-if="nftCID"
            class="icon icon-80"
            :src="`https://ipfs.io/ipfs/${nftCID}/outputs/image-0.png`"
          />
          <DAO v-else class="icon icon-80" />
        </div>
      </div>
    </div>
    <div class="container mx-auto align-center d-flex justify-space-between">
      <base-button dark class="mt-2 f-g0"> Claim data income </base-button>

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
  </div>
</template>

<script setup>
import Chip from "@/components/chip.vue";
import Detail from "@/components/profile/detail.vue";
import Image from "@/components/image.vue";
import DAO from "@/assets/icons/DAO.vue";
import { onMounted, ref } from "vue";
import { useTableLand } from "@/composables/tableLand";

const { tableLandFunctions } = useTableLand();

const loading = ref(false);

const QA = ref(0);
const volume = ref(0);
const txNum = ref(0);
const walletAge = ref(0);
const walletAddress = ref("");

const nftCID = ref(null);

onMounted(() => {
  tableLandFunctions.initSigner();
  getTableLandData();

  const cid = localStorage.getItem("nftCID");
  if (cid) nftCID.value = cid;
});

const getTableLandData = async () => {
  loading.value = true;
  try {
    const rows = await tableLandFunctions.getRows();

    QA.value = rows?.filter((val) => val.dataDialog)?.length || 0;

    if (rows.length) {
      const data = rows[0];

      if (data.Features?.length) {
        walletAge.value = data.Features[0].wallet_age_days || 0;
        walletAddress.value = data.Features[0].wallet_address || "-";
      }

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
.profile {
  &__details {
    max-width: 30rem;
  }
}
</style>
