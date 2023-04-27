<script lang="ts">
import { defineComponent } from 'vue'
import { io } from 'socket.io-client'

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
    testRoom() {
      this.socket.emit('test-room-event', 'Testing the room :)', this.roomKey)
    },
    logMessage(message: any) {
      console.log(message)
    }
  },
  created() {
    this.socket.on('room-key-created', (room, playerColor) => {
        this.roomKey = room
        this.logMessage('Your assigned color is ' + playerColor)
        this.$emit('room-joined', this.socket, this.roomKey, playerColor)
    })
    this.socket.on('server-response', (message) => {
      this.logMessage(message)
    })
  }
})
</script>

<template>
  <div class="game-panel-container">
    <button @click="findGame">Find Game</button>
    <button @click="testRoom">Test the roomkey!</button>
  </div>
</template>

<style>
.game-panel-container {
  margin-top: 5vh;
  width: 100%;
  margin-left: 10px;
  margin-right: 10px;
  background-color: black;
}

@media only screen and (min-width: 950px) {
  .game-panel-container {
    margin-top: 5vh;
    width: 200px;
    height: 70vh;
    background-color: black;
  }
}
</style>
