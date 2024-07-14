<template>
  <div class="top-of-list container">
    <CustomTextInputComponent
      name="search"
      type="text"
      label="Search"
      :showLabel="false"
      placeholder="Search..."
      v-model:value="searchKey"
    />
  </div>
  <div id="price-feed-list" class="container">
    <div
      v-for="symbol in filteredAssets"
      :key="symbol.fullSymbol"
      v-intersection-observer="() => loadSymbol(symbol.fullSymbol)"
      class="intersect-container"
    >
      <PriceFeedDataComponent
        v-if="visibleSymbols.includes(symbol.fullSymbol)"
        :symbol="symbol"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PriceFeedDataComponent from "@/components/custom/solana/PriceFeedDataComponent.vue";
import { useStore } from "vuex";
import { ref, computed, onBeforeMount } from "vue";
import CustomTextInputComponent from "@/components/custom/form/CustomTextInputComponent.vue";
import { PriceFeedSymbol } from "@/types";

const store = useStore();

const searchKey = ref("");

const symbolsOfAssets = computed(
  () => store.getters["asset/getSymbolsOfAssets"]
);

const filteredAssets = computed(() =>
  symbolsOfAssets.value.filter((symbol: PriceFeedSymbol) => {
    return symbol.fullSymbol
      ? symbol.fullSymbol.toLowerCase().includes(searchKey.value.toLowerCase())
      : null;
  })
);
const visibleSymbols = ref<Array<string>>([]);

onBeforeMount(async () => {
  if (symbolsOfAssets.value.length <= 0) {
    await store.dispatch("asset/getAllSymbolsOfAssets");
  }
});

const loadSymbol = (symbol: string) => {
  if (!visibleSymbols.value.includes(symbol)) {
    visibleSymbols.value.push(symbol);
  }
};
</script>

<style scoped></style>
