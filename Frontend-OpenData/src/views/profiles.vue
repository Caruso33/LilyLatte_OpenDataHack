<template>
  <div class="row overflow-auto pa-1">
    <profile-item
      v-for="(item, i) in profiles"
      :key="i"
      :item="item"
      class="col-6"
    />
  </div>
</template>

<script setup>
import ProfileItem from "@/components/profile/item.vue";
import { useLilyLatte } from "@/composables/lilylatte";
import { FVM } from "@/constants/chains";
import {
  addNetwork,
  getWallet,
  switchNetwork,
} from "@/constants/ethereum-functions";
import { inject, onMounted, ref } from "vue";

const setTopics = inject("setTopics");

const { lilyLatteFunctions } = useLilyLatte();

const loading = ref(false);
const profiles = ref([]);

onMounted(async () => {
  setTopics([{ id: "chat/buyer", title: "researcher onboarding" }]);
  await getWallet();
  await switchToFVMNetwork();
  getData();
});

const switchToFVMNetwork = async () => {
  await addNetwork([FVM]);
  await switchNetwork(FVM.chainId);
  await lilyLatteFunctions.initContract();
};

const getData = async () => {
  loading.value = true;
  try {
    const wallets = await lilyLatteFunctions.getWallets();

    console.log("wallets", wallets);

    const data = await Promise.all(
      wallets.map((wallet) => getWalletData(wallet))
    );

    profiles.value = data;

    console.log("final data", data);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const getWalletData = async (wallet) => {
  return lilyLatteFunctions.getOwnerToData(wallet);
};
</script>

<style></style>
