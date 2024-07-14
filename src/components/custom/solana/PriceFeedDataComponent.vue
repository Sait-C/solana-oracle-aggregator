<template>
  <div class="price-feed-card" v-if="result.data">
    <div class="header-of-card">
      <img
        v-if="result.data.image"
        :src="result.data.image"
        alt="Symbol Logo"
      />
      <div class="symbol">
        <span class="symbol-asset-type">{{
          result.data.symbol.assetType
        }}</span>
        <span class="symbol-name"
          >{{ result.data.symbol.fsyms }}/{{ result.data.symbol.tsyms }}</span
        >
      </div>
    </div>
    <div class="body-of-card">
      <span class="price" v-if="result.success">
        {{ result.data.priceSign }}{{ result.data.price }}
      </span>
    </div>
    <div class="footer-of-card">
      <h4 class="footer-head">Services:</h4>
      <ul class="services-list">
        <li
          v-for="service in result.data.services"
          v-bind:key="service"
          class="tag"
        >
          {{ service }}
        </li>
      </ul>
    </div>
  </div>
  <span v-if="result && !result.success">
    <div class="price-feed-card">
      <div class="header-of-card">
        <AnimatedPlaceHolder height="60px" width="60px" borderRadius="50%" />
        <div class="symbol">
          <span class="symbol-asset-type">
            <AnimatedPlaceHolder height="20px" width="40px" />
          </span>
          <span class="symbol-name"
            ><AnimatedPlaceHolder height="40px" width="130px"
          /></span>
        </div>
      </div>
      <div class="body-of-card">
        <AnimatedPlaceHolder
          v-if="!result.message"
          height="40px"
          width="200px"
        />
        <p v-if="result.message" class="error">
          {{ result.message }}
        </p>
      </div>
      <div class="footer-of-card">
        <h4 class="footer-head">
          <AnimatedPlaceHolder height="40px" width="200px" />
        </h4>
      </div>
    </div>
  </span>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { useSinglePriceFeed } from "@/composables/useSinglePriceFeed";
import { PriceFeedSymbol } from "@/types";
import AnimatedPlaceHolder from "@/components/custom/placeholder/AnimatedPlaceholder.vue";

const props = defineProps({
  symbol: { type: Object as () => PriceFeedSymbol, required: true },
});

const result = useSinglePriceFeed(props.symbol);
</script>
