<template>
  <div class="profile-item">
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
.profile-item {
  border: 1px solid #56ccf2;
  margin: 0.5rem 0;
  cursor: pointer;
  padding: 10px;
  border-radius: var(--border-radius);
  transition: var(--hover-transition);

  &:hover {
    background-color: var(--primary);
  }
}
</style>
