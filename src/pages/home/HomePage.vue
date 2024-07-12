<template>
  <MainLayout>
    <template v-slot:content>
      <div id="home">
        <PriceFeedDataComponent
          priceFeedAddress="6PxBx93S8x3tno1TsFZwT5VqP8drrRCbCXygEXYNkFJe"
        />
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/layouts/guest/MainLayout.vue";
import PriceFeedDataComponent from "@/components/custom/solana/PriceFeedDataComponent.vue";
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
