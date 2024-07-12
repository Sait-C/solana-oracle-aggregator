<template>
  <div>{{ latestPrice }}</div>
</template>

<script setup lang="ts">
import { PriceFeedDataProps } from "@/types";
import { runQuery } from "@/services/pyth.service";
import { pullPriceFeed } from "@/services/chainlink.service";
import { ref, onMounted, defineProps } from "vue";

const latestPrice = ref();
const props = defineProps<PriceFeedDataProps>();

onMounted(async () => {
  console.log(props.priceFeedAddress);
  latestPrice.value = await pullPriceFeed(props.priceFeedAddress);
  console.log(latestPrice.value);
  await runQuery();
});
</script>
