<template>
  <MainLayout>
    <template v-slot:content>
      <div id="home">
        <PriceFeedListComponent></PriceFeedListComponent>
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/layouts/guest/MainLayout.vue";
import PriceFeedListComponent from "@/components/guest/home/PriceFeedsListComponent.vue";
</script>

<style scoped></style>
