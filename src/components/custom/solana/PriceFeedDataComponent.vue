<template>
  <div v-if="result.success">
    {{ result.data.symbol.fullSymbol }}
    {{ result.data.price }}
  </div>
  <div v-if="!result.success">
    {{ result.message }}
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { useSinglePriceFeed } from "@/composables/useSinglePriceFeed";
import { PriceFeedSymbol } from "@/types";

const props = defineProps({
  symbol: { type: Object as () => PriceFeedSymbol, required: true },
});

const result = useSinglePriceFeed(props.symbol);
</script>
