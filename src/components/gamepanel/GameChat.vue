<script lang="ts">
import { defineComponent } from 'vue'

export interface Message {
  sender: string
  message: string
  id: number
}

export interface ReceivedMessage {
  sender: string
  message: string
}

export default defineComponent({
  props: ['socket', 'roomKey'],
  data() {
    return {
      messages: [] as Message[],
      inputText: '' as string
    }
  },
  methods: {
    sendMessage() {
      this.messages.push({ sender: 'You', message: this.inputText, id: this.messages.length })
      this.socket.emit(
        'send-message',
        { sender: 'DoctorLoctor', message: this.inputText },
        this.roomKey
      )
      this.inputText = ''
    },
    logMessage(message: any) {
      console.log(message)
    }
  },
  watch: {
    socket() {
      if (this.socket === undefined) {
        return
      }
      this.socket.on('opponent-message', (opponentMessage: ReceivedMessage) => {
        this.messages.push({
          sender: opponentMessage.sender,
          message: opponentMessage.message,
          id: this.messages.length
        })
      })
    }
  },
  created() {
    if (this.socket === undefined) {
      return
    }
    this.socket.on('opponent-message', (opponentMessage: ReceivedMessage) => {
      this.messages.push({
        sender: opponentMessage.sender,
        message: opponentMessage.message,
        id: this.messages.length
      })
    })
  }
})
</script>

<template>
  <div class="game-chat-container">
    <div class="game-chat-message-area">
      <div
        v-for="message in messages"
        :key="message.id"
        class="game-chat-message"
        :class="message.sender === 'You' ? 'player-message' : 'opponent-message'"
      >
        {{ message.sender + ': ' + message.message }}
      </div>
    </div>
    <div class="game-chat-message-input-bar">
      <input type="text" placeholder="Enter message" v-model="inputText" />
      <button @click="sendMessage">
        <img src="https://cdn-icons-png.flaticon.com/512/3106/3106794.png" />
      </button>
    </div>
  </div>
</template>

<style>
.game-chat-container {
  width: 90%;
  height: 550px;
  background-color: #2a2a2a;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}

.game-chat-message-area {
  flex-basis: 95%;
  width: 100%;
  overflow-y: scroll;
}

.game-chat-message {
  word-wrap: break-word;
  margin-top: 4px;
  margin-bottom: 4px;
  margin-right: 10px;
  margin-left: 10px;
}

.player-message {
  color: #949494;
}

.opponent-message {
  color: white;
}

.game-chat-message-input-bar {
  width: 100%;
  height: 40px;
  display: flex;
}

.game-chat-message-input-bar > input {
  height: 25px;
  flex-grow: 1;
  margin: 5px 5px 0px 5px;
  outline: none;
  border: none;
  border-radius: 8px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 2px;
  font-size: 15px;
}

.game-chat-message-input-bar > button {
  flex-basis: 9%;
  border: none;
  outline: none;
  border-radius: 6px;
  height: 27px;
  margin: auto;
  margin-right: 4px;
}

.game-chat-message-input-bar > button:hover {
  cursor: pointer;
}

.game-chat-message-input-bar > button:active {
  background-color: #2a2a2a;
}

.game-chat-message-input-bar > button > img {
  max-height: 100%;
}

.game-chat-message-input-bar > button:active > img {
  filter: invert(1);
}
</style>
