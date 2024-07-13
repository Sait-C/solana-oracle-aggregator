<template>
  <div>Price Feed Data Component</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import pythService from "@/services/feeds/pyth.service";
import chainlinkService from "@/services/feeds/chainlink.service";

onMounted(async () => {
  const priceFeedsFromPythService = await pythService.getAllPriceFeeds();
  const priceFeedsFromChainlinkService =
    await chainlinkService.getAllPriceFeeds();
  console.log(priceFeedsFromChainlinkService);
  console.log(priceFeedsFromPythService);
});
</script>
