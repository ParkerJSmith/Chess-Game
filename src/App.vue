<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavMenu from './components/NavMenu.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <NavMenu />
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
