<template>
  <MainLayout>
    <template v-slot:content>
      <div id="home">
        <div v-if="symbolsOfAssets.length > 0">
          <PriceFeedDataComponent :symbol="symbolsOfAssets[0]" />
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/layouts/guest/MainLayout.vue";
import PriceFeedDataComponent from "@/components/custom/solana/PriceFeedDataComponent.vue";
import { useStore } from "vuex";
import { computed, onBeforeMount } from "vue";

const store = useStore();

const symbolsOfAssets = computed(
  () => store.getters["asset/getSymbolsOfAssets"]
);
onBeforeMount(async () => {
  await store.dispatch("asset/getAllSymbolsOfAssets");
});
</script>

<style scoped>
#home {
  width: 100%;
  height: 100vh;
  background-color: #efefef;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
