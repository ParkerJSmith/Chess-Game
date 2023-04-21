<script setup lang="ts">
import ChessBoard from '../components/chess/ChessBoard.vue'
import PlayerInfo from '@/components/chess/PlayerInfo.vue'
</script>

<template>
  <main>
    <div class="playing-area-container">
      <div class="playing-area">
        <PlayerInfo playerName="Doctor Loctor" playerRating="1200" boardPosition="top" />
        <ChessBoard />
        <PlayerInfo playerName="Professor Disrepect" playerRating="1200" boardPosition="bottom" />
      </div>
    </div>
  </main>
</template>

<style>

.playing-area-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.playing-area {
  width: 100%;
  margin: auto;
}

@media only screen and (min-width: 700px) {
  .playing-area {
    max-width: max(600px, 80vh);
  }
}
</style>
