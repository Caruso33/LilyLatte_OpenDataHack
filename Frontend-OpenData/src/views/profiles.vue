<template>
  <div class="row overflow-auto pa-1">
    <profile-item v-for="i in 6" :key="i" class="col-6" />
  </div>
</template>

<script setup>
import ProfileItem from "@/components/profile/item.vue";
import { useLilyLatte } from "@/composables/lilylatte";
import { inject, onMounted, ref } from "vue";

const setTopics = inject("setTopics");

const { lilyLatteFunctions } = useLilyLatte();

const loading = ref(false);
const profiles = ref([]);

onMounted(() => {
  setTopics([{ id: "chat/buyer", title: "researcher onboarding" }]);

  getData();
});

const getData = async () => {
  loading.value = true;
  try {
    const wallets = await lilyLatteFunctions.getWallets();

    const data = await Promise.all(
      wallets.map((wallet) => getWalletData(wallet))
    );

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
