<template>
  <div class="primary-bg">
    <div class="container mx-auto">
      <div class="d-flex justify-space-between">
        <div>
          <h2>walletAddress</h2>
          <div class="d-flex flex-wrap">
            <chip class="ma-1 ml-0"> fav dex: uniswap </chip>
            <chip class="ma-1 ml-0"> fav dex: uniswap </chip>
          </div>
        </div>

        <DAO class="icon icon-80" />
      </div>
    </div>
    <div
      class="container mx-auto profile__details d-flex justify-space-between"
    >
      <detail title="+2y" desc="wallet age" />
      <detail title="+100" desc="total tx" />
      <detail title="$10k" desc="total holdings" />
      <detail title="57" desc="Q&A" />
    </div>
  </div>
</template>

<script setup>
import Chip from "@/components/chip.vue";
import Detail from "@/components/profile/detail.vue";
import DAO from "@/assets/icons/DAO.vue";
</script>

<style scoped lang="scss">
.profile {
  &__details {
    max-width: 30rem;
  }
}
</style>
