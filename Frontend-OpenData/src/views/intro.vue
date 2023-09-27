<template>
  <div class="row overflow-auto pa-3 justify-space-around">
    <div class="col-5 intro-type">
      <h1>Own Your Data, Share Your Insights</h1>
      <logo class="icon-80 my-2" />
      <h3>A Web3 Space Where Your Opinions Translate into Value</h3>
      <div class="mt-2 mb-1">How this works?</div>
      <ul>
        <li>Connect your wallet and let us look at your onchain footprint.</li>
        <li>
          Engage in dynamic conversations guided by our LLM model to explore
          relevant topics.
        </li>
        <li>
          Earn rewards by contributing your curated opinions and engaging in
          targeted interviews.
        </li>
      </ul>
      <base-button
        dark
        class="mx-auto mt-4"
        @click="routeTo('/chat/owner', 'owner')"
      >
        START
      </base-button>
    </div>

    <div class="col-5 intro-type">
      <h1>Access Curated Web3 Insights, Straight from the Source</h1>
      <logo class="icon-80 my-2" />
      <h3>
        Unlock Rich Data Sets and Real Opinions to Make Informed Decisions
      </h3>
      <div class="mt-2 mb-1">How this works?</div>
      <ul>
        <li>
          Browse through our DAO's curated topics and opinions, sorted by net
          votes.
        </li>
        <li>
          Purchase access tokens to view full dialogues or initiate your own
          interviews.
        </li>
        <li>
          Collect invaluable data and insights, hassle-free and directly from
          the web3 community.
        </li>
      </ul>
      <base-button
        dark
        class="mx-auto mt-4"
        @click="routeTo('/chat/buyer', 'buyer')"
      >
        START
      </base-button>
    </div>
  </div>
</template>

<script setup>
import logo from "@/assets/icons/logo.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const routeTo = (path, role) => {
  localStorage.setItem("userType", role);

  router.push(path);
};
</script>

<style scoped lang="scss">
.intro-type {
  color: #63657d;
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
