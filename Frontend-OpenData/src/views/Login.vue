<template>
  <div class="expand d-flex flex-column flex-center client">
    <base-button @click="connect">Connect Wallet</base-button>
    <base-button class="mt-2" @click="addNetwork">
      Add FVM & Lilypad Networks
    </base-button>
    <base-button class="mt-2" @click="changeNetwork(FVM.chainId)">
      Change Network to FVM
    </base-button>
    <base-button class="mt-2" @click="changeNetwork(Lilypad.chainId)">
      Change Network to Lilypad
    </base-button>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useStore } from "vuex";

import metamask from "@/provider/metamask";
import { useRouter } from "vue-router";
import { FVM, Lilypad } from "@/constants/chains";
import { switchNetwork } from "@/constants/ethereum-functions";

/**
 * @type {metamask} metamaskInstance
 */
let metamaskInstance;

const store = useStore();

const router = useRouter();

onMounted(() => {
  metamaskInstance = metamask.create();
  store.commit("setWeb3", {
    web3: metamaskInstance.getProvider(),
  });
});

const connect = async () => {
  try {
    const wallet = await metamaskInstance.getWallet();

    store.commit("setWallet", {
      wallet,
    });

    console.log(wallet);

    router.push("/home");
  } catch (error) {
    console.log(error);
  }
};

const addNetwork = async () => {
  try {
    await metamaskInstance.addNetwork([FVM]);
    await metamaskInstance.addNetwork([Lilypad]);
  } catch (error) {
    console.log(error);
  }
};

const changeNetwork = async (chainId) => {
  try {
    await switchNetwork(chainId);
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped>
.client {
  max-width: 50rem;
  width: 100%;
  margin: 16px auto;
}
</style>
