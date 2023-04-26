<script lang="ts">
import { defineComponent } from 'vue'
import ChessPiece from './ChessPiece.vue'
import blackPawn from '../../assets/images/black_pawn.png'
import whitePawn from '../../assets/images/white_pawn.png'

export default defineComponent({
  props: {
    spaceName: String,
    piece: String,
    isMovable: Boolean,
    isFocused: Boolean
  },
  methods: {
    setFocusedSpace() {
      this.$emit('pieceFocused', this.piece, this.spaceName)
    },
    setUnfocusedSpace() {
      this.$emit('pieceUnfocused')
    },
    movePiece() {
      if (!this.isMovable) {
        return
      }
      this.$emit('movePiece', this.spaceName)
    },
    logMessage(message: any) {
      console.log(message)
    }
  },
  computed: {
    getSpaceColor() {
      if (this.isFocused) {
        return 'focused-space'
      }
      if (this.isMovable) {
        return 'movable-space'
      }
      if (
        this.spaceName?.charAt(0) === 'a' ||
        this.spaceName?.charAt(0) === 'c' ||
        this.spaceName?.charAt(0) === 'e' ||
        this.spaceName?.charAt(0) === 'g'
      ) {
        return parseInt(this.spaceName!.charAt(1)) % 2 === 0 ? 'white-space' : 'black-space'
      } else {
        return parseInt(this.spaceName!.charAt(1)) % 2 === 0 ? 'black-space' : 'white-space'
      }
    },
    getPieceImage() {
      switch (this.piece) {
        case 'whitePawn':
          return whitePawn
        case 'blackPawn':
          return blackPawn
      }
      return blackPawn
    }
  },
  components: { ChessPiece }
})
</script>

<template>
  <div class="chess-board-space" :class="getSpaceColor" @click="movePiece">
    <h2>{{ spaceName }}</h2>
    <ChessPiece
      @pieceFocused="setFocusedSpace"
      @pieceUnfocused="setUnfocusedSpace"
      :spaceName="spaceName"
      :piece="piece"
      :isFocused="isFocused"
      v-if="piece != ''"
    />
  </div>
</template>

<style>
.chess-board-space {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  margin: 0;
  display: flex;
}

.chess-board-space > img {
  width: 70%;
  margin: auto;
  user-select: none;
  -webkit-user-drag: none;
}

.focused-space {
  background-color: yellow;
}

.movable-space {
  background-color: cyan;
}

.white-space {
  background-color: white;
}

.black-space {
  background-color: #003a41;
}

h2 {
  position: absolute;
  font-size: calc(6px + 1vw);
  color: orange;
  margin: 0;
  left: 2px;
  top: 2px;
}
</style>
