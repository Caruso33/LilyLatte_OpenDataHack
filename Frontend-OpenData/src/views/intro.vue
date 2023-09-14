<template>
  <div class="row overflow-auto pa-3 justify-space-around">
    <div class="col-5 intro-type">
      <h1>MONETIZE YOUR OPINIONS</h1>
      <logo class="icon-80 my-2" />
      <h3>Earn by chatting with our AI researcher</h3>
      <div class="mt-2 mb-1">How this works?</div>
      <ul>
        <li>Lorem ipsum dolorem ipsum dolorem ipsum dolorem ipsum dolorem</li>
        <li>Domine fili Dei misere mei pecatoris</li>
      </ul>
      <base-button
        dark
        class="mx-auto mt-4"
        @click="$router.push('/chat/owner')"
      >
        START
      </base-button>
    </div>

    <div class="col-5 intro-type">
      <h1>AUTOMATED WEB3 RESEARCH</h1>
      <logo class="icon-80 my-2" />
      <h3>Gain insights from web3 citizens</h3>
      <div class="mt-2 mb-1">How this works?</div>
      <ul>
        <li>Conduct asynk research with verified degens.</li>
        <li>Outsoruce the chores to our Researcher Agent: Lily</li>
        <li>Cancel payment anytime, in case of no show</li>
      </ul>
      <base-button
        dark
        class="mx-auto mt-4"
        @click="$router.push('/chat/buyer')"
      >
        START
      </base-button>
    </div>
  </div>
</template>

<script setup>
import logo from "@/assets/icons/logo.vue";
</script>

<style scoped lang="scss">
.intro-type {
  color: #63657d;
  cursor: pointer;
  transition: var(--hover-transition);

  .base-button {
    opacity: 0;
  }

  &:hover {
    color: white;

    .base-button {
      opacity: 1;
    }
  }
}
</style>
