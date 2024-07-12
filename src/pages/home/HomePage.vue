<template>
  <MainLayout>
    <template v-slot:content>
      <div id="home">Home Page</div>
    </template>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/layouts/guest/MainLayout.vue";
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
