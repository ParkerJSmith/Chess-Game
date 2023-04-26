<script lang="ts">
import ChessBoardSpace from './ChessBoardSpace.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      connection: new WebSocket('ws://localhost:8080'),
      focusedPiece: { piece: '', spaceName: '' },
      spaces: [
        { rank: 8, file: 'a', piece: '' },
        { rank: 8, file: 'b', piece: '' },
        { rank: 8, file: 'c', piece: '' },
        { rank: 8, file: 'd', piece: '' },
        { rank: 8, file: 'e', piece: '' },
        { rank: 8, file: 'f', piece: '' },
        { rank: 8, file: 'g', piece: '' },
        { rank: 8, file: 'h', piece: '' },

        { rank: 7, file: 'a', piece: 'blackPawn' },
        { rank: 7, file: 'b', piece: 'blackPawn' },
        { rank: 7, file: 'c', piece: 'blackPawn' },
        { rank: 7, file: 'd', piece: 'blackPawn' },
        { rank: 7, file: 'e', piece: 'blackPawn' },
        { rank: 7, file: 'f', piece: 'blackPawn' },
        { rank: 7, file: 'g', piece: 'blackPawn' },
        { rank: 7, file: 'h', piece: 'blackPawn' },

        { rank: 6, file: 'a', piece: '' },
        { rank: 6, file: 'b', piece: '' },
        { rank: 6, file: 'c', piece: '' },
        { rank: 6, file: 'd', piece: '' },
        { rank: 6, file: 'e', piece: '' },
        { rank: 6, file: 'f', piece: '' },
        { rank: 6, file: 'g', piece: '' },
        { rank: 6, file: 'h', piece: '' },

        { rank: 5, file: 'a', piece: '' },
        { rank: 5, file: 'b', piece: '' },
        { rank: 5, file: 'c', piece: '' },
        { rank: 5, file: 'd', piece: '' },
        { rank: 5, file: 'e', piece: '' },
        { rank: 5, file: 'f', piece: '' },
        { rank: 5, file: 'g', piece: '' },
        { rank: 5, file: 'h', piece: '' },

        { rank: 4, file: 'a', piece: '' },
        { rank: 4, file: 'b', piece: '' },
        { rank: 4, file: 'c', piece: '' },
        { rank: 4, file: 'd', piece: '' },
        { rank: 4, file: 'e', piece: '' },
        { rank: 4, file: 'f', piece: '' },
        { rank: 4, file: 'g', piece: '' },
        { rank: 4, file: 'h', piece: '' },

        { rank: 3, file: 'a', piece: '' },
        { rank: 3, file: 'b', piece: '' },
        { rank: 3, file: 'c', piece: '' },
        { rank: 3, file: 'd', piece: '' },
        { rank: 3, file: 'e', piece: '' },
        { rank: 3, file: 'f', piece: '' },
        { rank: 3, file: 'g', piece: '' },
        { rank: 3, file: 'h', piece: '' },

        { rank: 2, file: 'a', piece: 'whitePawn' },
        { rank: 2, file: 'b', piece: 'whitePawn' },
        { rank: 2, file: 'c', piece: 'whitePawn' },
        { rank: 2, file: 'd', piece: 'whitePawn' },
        { rank: 2, file: 'e', piece: 'whitePawn' },
        { rank: 2, file: 'f', piece: 'whitePawn' },
        { rank: 2, file: 'g', piece: 'whitePawn' },
        { rank: 2, file: 'h', piece: 'whitePawn' },

        { rank: 1, file: 'a', piece: '' },
        { rank: 1, file: 'b', piece: '' },
        { rank: 1, file: 'c', piece: '' },
        { rank: 1, file: 'd', piece: '' },
        { rank: 1, file: 'e', piece: '' },
        { rank: 1, file: 'f', piece: '' },
        { rank: 1, file: 'g', piece: '' },
        { rank: 1, file: 'h', piece: '' }
      ]
    }
  },
  methods: {
    setFocusedPiece(piece: string, space: string) {
      this.focusedPiece = { piece: piece, spaceName: space }
    },
    setUnfocused() {
      this.focusedPiece = { piece: '', spaceName: '' }
    },
    movePiece(spaceName: string) {
      this.connection.send('A piece was moved!')
      for (let space of this.spaces) {
        if (
          space.file === this.focusedPiece.spaceName.charAt(0) &&
          space.rank === parseInt(this.focusedPiece.spaceName.charAt(1))
        ) {
          space.piece = ''
        }
        if (space.file === spaceName.charAt(0) && space.rank === parseInt(spaceName.charAt(1))) {
          space.piece = this.focusedPiece.piece
        }
      }
      this.setUnfocused()
    },
    getPossibleMoves() {},
    getSpaceMovable(id: string) {
      if (this.focusedPiece.piece === '') {
        return false
      }
      switch (this.focusedPiece.piece) {
        case 'whitePawn':
          if (this.focusedPiece.spaceName.charAt(1) === '2') {
            if (
              id.charAt(0) === this.focusedPiece.spaceName.charAt(0) &&
              parseInt(id.charAt(1)) === parseInt(this.focusedPiece.spaceName.charAt(1)) + 2
            ) {
              return true
            }
          }
          if (
            id.charAt(0) === this.focusedPiece.spaceName.charAt(0) &&
            parseInt(id.charAt(1)) === parseInt(this.focusedPiece.spaceName.charAt(1)) + 1
          ) {
            return true
          }
          break
        case 'blackPawn':
          if (this.focusedPiece.spaceName.charAt(1) === '7') {
            if (
              id.charAt(0) === this.focusedPiece.spaceName.charAt(0) &&
              parseInt(id.charAt(1)) === parseInt(this.focusedPiece.spaceName.charAt(1)) - 2
            ) {
              return true
            }
          }
          if (
            id.charAt(0) === this.focusedPiece.spaceName.charAt(0) &&
            parseInt(id.charAt(1)) === parseInt(this.focusedPiece.spaceName.charAt(1)) - 1
          ) {
            return true
          }
          break
      }
      return false
    },
    logMessage(message: any) {
      console.log(message)
    }
  },
  computed: {},
  components: {
    ChessBoardSpace
  },
  created: function () {
    this.connection.onmessage = ({ data }) => {
      this.logMessage('Message from server: ')
      this.logMessage(data)
    }
  }
})
</script>

<template>
  <div class="chess-board-container" id="chessBoard">
    <div class="chess-board-grid">
      <ChessBoardSpace
        v-for="space in spaces"
        :key="space.file + space.rank"
        :piece="space.piece"
        :spaceName="space.file + space.rank"
        :isMovable="getSpaceMovable(space.file + space.rank)"
        :isFocused="focusedPiece.spaceName === space.file + space.rank + ''"
        @pieceFocused="(piece, spaceName) => setFocusedPiece(piece, spaceName)"
        @pieceUnfocused="setUnfocused"
        @movePiece="(spaceName) => movePiece(spaceName)"
      />
    </div>
  </div>
</template>

<style>
.chess-board-container {
  width: 100%;
  aspect-ratio: 1;
  margin: auto;
  user-select: none;
}

.chess-board-grid {
  width: 100%;
  height: 100%;
  background-color: purple;
  display: grid;
  grid-template-columns: 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5%;
  gap: 0;
}

@media only screen and (min-width: 700px) {
  .chess-board-container {
    width: 70vh;
  }
}
</style>
