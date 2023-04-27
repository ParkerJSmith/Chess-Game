<script lang="ts">
import { defineComponent } from 'vue'
import hamburgerIcon from '../assets/images/hamburger.png'

export default defineComponent({
  data: function () {
    return {
      hamburgerIcon: hamburgerIcon,
      menuOpen: false
    }
  }
})
</script>

<template>
  <div class="hamburger-menu-banner">
    <button @click="menuOpen = !menuOpen">
      <img :src="hamburgerIcon" />
    </button>
  </div>
  <div v-if="menuOpen" class="hamburger-menu-screen"></div>
</template>

<style>
.hamburger-menu-banner {
  height: 45px;
  width: 100%;
  background-color: black;
}

.hamburger-menu-banner > button {
  height: 100%;
  aspect-ratio: 1;
  background-color: #00000000;
  border: none;
  outline: none;
}

.hamburger-menu-banner > button:hover {
  cursor: pointer;
}

.hamburger-menu-banner > button > img {
  height: 100%;
}

.hamburger-menu-screen {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: black;
  z-index: 100000;
}

@media only screen and (min-width: 700px) {
  .hamburger-menu-banner {
    visibility: hidden;
    height: 0px;
  }
}
</style>
