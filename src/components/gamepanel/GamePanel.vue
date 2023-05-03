<script lang="ts">
import { defineComponent } from 'vue'
import { io } from 'socket.io-client'
import GameChat from './GameChat.vue'

export default defineComponent({
  data() {
    return {
      socket: io('http://localhost:8080'),
      roomKey: String
    }
  },
  methods: {
    findGame() {
      this.socket.emit('request-match')
    },
    logMessage(message: any) {
      console.log(message)
    }
  },
  created() {
    this.socket.on('room-key-created', (room, playerColor) => {
      this.roomKey = room
      this.$emit('room-joined', this.socket, this.roomKey, playerColor)
    })
    this.socket.on('server-response', (message) => {
      this.logMessage(message)
    })
  },
  components: {
    GameChat
  }
})
</script>

<template>
  <div class="game-panel-container">
    <button @click="findGame">Find Game</button>
    <GameChat :socket="socket" :roomKey="roomKey" />
  </div>
</template>

<style>
.game-panel-container {
  margin-top: 5vh;
  width: 100%;
  margin-left: 10px;
  margin-right: 10px;
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-panel-container > button {
  border: none;
  outline: none;
  width: 90%;
  height: 80px;
  border-radius: 10px;
}

.game-panel-container > button:hover {
  cursor: pointer;
}

.game-panel-container > button:active {
  background-color: orange;
}

@media only screen and (min-width: 1350px) {
  .game-panel-container {
    margin-top: 1vh;
    width: 500px;
    height: calc(90vh - max(55px, 6.5vh) - 32px);
    max-height: 80vh;
    background-color: black;
    border-radius: 10px;
    margin-left: 20px;
  }
}
</style>
