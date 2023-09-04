<template>
  <div class="expand d-flex flex-column flex-center client">
    <button @click="connect">Connect Wallet</button>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

import metamask from "@/provider/metamask";
import { useRouter } from "vue-router";

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

    // const web3 = new Web3("https://devnet.fhenix.io");

    // const result = await web3.eth.call({
    //   to: "0x0000000000000000000000000000000000000044",
    // });

    console.log(wallet);

    router.push("/home");
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
