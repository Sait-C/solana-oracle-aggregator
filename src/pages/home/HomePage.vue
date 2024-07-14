<template>
  <MainLayout>
    <template v-slot:content>
      <div id="home">
        <HomeHeroSectionComponent />
        <PriceFeedListComponent></PriceFeedListComponent>
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/layouts/guest/MainLayout.vue";
import PriceFeedListComponent from "@/components/guest/home/PriceFeedsListComponent.vue";
import HomeHeroSectionComponent from "@/components/guest/home/HomeHeroSectionComponent.vue";
</script>

<style scoped></style>
