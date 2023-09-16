<template>
  <div class="pa-2">
    <div class="card pa-3">
      <div class="d-flex justify-space-between">
        <h1>Choose your keyword</h1>
        <h1 v-if="hasButton">VOTE</h1>
      </div>
      <div class="d-flex">
        <chip v-for="(item, i) in 3" :key="i" class="ma-1 ml-0"> Uniswap </chip>
      </div>
    </div>
    <opinion-item v-for="(item, i) in 4" :key="i" :hasButton="hasButton" />
  </div>
</template>

<script setup>
import OpinionItem from "@/components/opinions/item.vue";
import Chip from "@/components/chip.vue";
import { useRoute } from "vue-router";

const hasButton = true;
</script>

<style></style>
