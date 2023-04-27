<script lang="ts">
import { defineComponent } from 'vue'
import ChessBoard from '../components/chess/ChessBoard.vue'
import PlayerInfo from '@/components/chess/PlayerInfo.vue'
import GamePanel from '@/components/gamepanel/GamePanel.vue'

export default defineComponent({
  data() {
    return {
      roomKey: '',
      socket: undefined,
      playerColor: 'w'
    }
  },
  methods: {},
  components: {
    ChessBoard,
    PlayerInfo,
    GamePanel
  }
})
</script>

<template>
  <main>
    <div class="main-view-content-container">
      <div class="playing-area-container">
        <div class="playing-area">
          <PlayerInfo playerName="Doctor Loctor" playerRating="1200" boardPosition="top" />
          <ChessBoard :socket="socket" :roomKey="roomKey" :playerColor="playerColor" />
          <PlayerInfo playerName="Professor Disrepect" playerRating="1200" boardPosition="bottom" />
        </div>
      </div>
      <GamePanel
        @room-joined="(ioSocket, room: string, color) => {socket = ioSocket; roomKey = room; playerColor = color}"
      />
    </div>
  </main>
</template>

<style>
.main-view-content-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.playing-area-container {
  height: 100vh;
  width: calc(100% - 20px);
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  margin-right: 10px;
}

.playing-area {
  width: 100%;
  margin: auto;
}

@media only screen and (min-width: 700px) {
  .playing-area-container {
    margin: 0;
  }

  .playing-area {
    width: fit-content;
  }
}

@media only screen and (min-width: 950px) {
  .main-view-content-container {
    display: flex;
    flex-direction: row;
    width: min-content;
    margin: auto;
  }
}
</style>
