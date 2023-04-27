<script lang="ts">
import ChessBoardSpace from './ChessBoardSpace.vue'
import { defineComponent } from 'vue'
import { getWhiteBoard, getBlackBoard, getInitialPosition } from '../../helpers/GenerateChessBoard'

export default defineComponent({
  props: ['socket', 'roomKey', 'playerColor'],
  data() {
    return {
      focusedPiece: -1,
      spaces: this.playerColor === 'w' ? getWhiteBoard() : getBlackBoard(),
      pieces: getInitialPosition()
    }
  },
  methods: {
    setFocusedPiece(focusPiece: string, focusSpace: string) {
      for (let i = 0; i < this.pieces.length; i++) {
        if (this.pieces[i].piece === focusPiece && this.pieces[i].spaceName === focusSpace) {
          this.focusedPiece = i
        }
      }
    },
    setUnfocused() {
      this.focusedPiece = -1
    },
    movePiece(spaceName: string) {
      this.socket.emit(
        'piece-moved',
        this.pieces[this.focusedPiece].piece,
        this.pieces[this.focusedPiece].spaceName,
        spaceName,
        this.roomKey
      )
      for (let space of this.spaces) {
        if (
          space.file === this.pieces[this.focusedPiece].spaceName.charAt(0) &&
          space.rank === this.pieces[this.focusedPiece].spaceName.charAt(1)
        ) {
          this.pieces[this.focusedPiece].spaceName = spaceName
        }
      }
      this.setUnfocused()
    },
    updateOpponentMove(oldSpace: string, newSpace: string) {
      for (let piece of this.pieces) {
        if (
          piece.spaceName.charAt(0) === oldSpace.charAt(0) &&
          piece.spaceName.charAt(1) === oldSpace.charAt(1)
        ) {
          piece.spaceName = newSpace
        }
      }
    },
    getPossibleMoves() {},
    getSpaceMovable(id: string) {
      if (this.focusedPiece === -1) {
        return false
      }
      switch (this.pieces[this.focusedPiece].piece) {
        case 'whitePawn':
          if (this.pieces[this.focusedPiece].spaceName.charAt(1) === '2') {
            if (
              id.charAt(0) === this.pieces[this.focusedPiece].spaceName.charAt(0) &&
              parseInt(id.charAt(1)) ===
                parseInt(this.pieces[this.focusedPiece].spaceName.charAt(1)) + 2
            ) {
              return true
            }
          }
          if (
            id.charAt(0) === this.pieces[this.focusedPiece].spaceName.charAt(0) &&
            parseInt(id.charAt(1)) ===
              parseInt(this.pieces[this.focusedPiece].spaceName.charAt(1)) + 1
          ) {
            return true
          }
          break
        case 'blackPawn':
          if (this.pieces[this.focusedPiece].spaceName.charAt(1) === '7') {
            if (
              id.charAt(0) === this.pieces[this.focusedPiece].spaceName.charAt(0) &&
              parseInt(id.charAt(1)) ===
                parseInt(this.pieces[this.focusedPiece].spaceName.charAt(1)) - 2
            ) {
              return true
            }
          }
          if (
            id.charAt(0) === this.pieces[this.focusedPiece].spaceName.charAt(0) &&
            parseInt(id.charAt(1)) ===
              parseInt(this.pieces[this.focusedPiece].spaceName.charAt(1)) - 1
          ) {
            return true
          }
          break
      }
      return false
    },
    getSpacePiece(space: string) {
      for (let piece of this.pieces) {
        if (piece.spaceName === space) {
          return piece.piece
        }
      }
      return ''
    },
    logMessage(message: any) {
      console.log(message)
    }
  },
  computed: {},
  components: {
    ChessBoardSpace
  },
  watch: {
    socket() {
      this.logMessage('The things shouold be updated...')
      if (this.socket === undefined) {
        return
      }
      this.socket.on('opponent-moved', (piece: string, oldSpace: string, newSpace: string) => {
        this.logMessage(`Opponent moved ${piece} from ${oldSpace} to ${newSpace}`)
        this.updateOpponentMove(oldSpace, newSpace)
      })
    },
    playerColor() {
      this.spaces = this.playerColor === 'w' ? getWhiteBoard() : getBlackBoard()
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
        :piece="getSpacePiece(space.file + space.rank)"
        :spaceName="space.file + space.rank"
        :isMovable="getSpaceMovable(space.file + space.rank)"
        :isFocused="
          focusedPiece !== -1
            ? pieces[focusedPiece].spaceName === space.file + space.rank + ''
            : false
        "
        @pieceFocused="(piece, spaceName) => setFocusedPiece(piece, spaceName)"
        @pieceUnfocused="setUnfocused"
        @movePiece="(spaceName) => movePiece(spaceName)"
      />
    </div>
  </div>
</template>

<style>
.chess-board-container {
  max-height: 60vh;
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
    max-width: 80vh;
    height: calc(90vh - max(55px, 6.5vh) - 32px);
    max-height: 80vh;
  }
}
</style>
