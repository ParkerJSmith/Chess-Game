<script lang="ts">
import ChessBoardSpace from './ChessBoardSpace.vue'
import { defineComponent } from 'vue'
import { getWhiteBoard, getBlackBoard, getInitialPosition } from '../../helpers/GenerateChessBoard'
import type { BoardSpace, Piece } from '../../helpers/GenerateChessBoard'
import { getMovableSpaces, getKing, isKingChecked } from '../../helpers/FindMoves'
import checkSound from '../../assets/sounds/check_sound.mp3'

export default defineComponent({
  props: ['socket', 'roomKey', 'playerColor'],
  data() {
    return {
      focusedPiece: -1,
      spaces: this.playerColor === 'w' ? getWhiteBoard() : getBlackBoard(),
      pieces: getInitialPosition(),
      enPassantPiece: {} as Piece,
      movableSpaces: [] as BoardSpace[],
      playersTurn: false,
      inCheck: false
    }
  },
  methods: {
    setFocusedPiece(focusPiece: string, focusSpace: string) {
      for (let i = 0; i < this.pieces.length; i++) {
        if (this.pieces[i].piece === focusPiece && this.pieces[i].spaceName === focusSpace) {
          if (
            (this.pieces[i].piece.includes('black') && this.playerColor !== 'b') ||
            (this.pieces[i].piece.includes('white') && this.playerColor !== 'w')
          ) {
            return
          }
          this.focusedPiece = i
        }
      }
    },
    setUnfocused() {
      this.focusedPiece = -1
    },
    movePiece(spaceName: string) {
      if (!this.playersTurn) {
        return
      }
      this.socket.emit(
        'piece-moved',
        this.pieces[this.focusedPiece].piece,
        this.pieces[this.focusedPiece].spaceName,
        spaceName,
        this.roomKey
      )
      if (this.enPassantPiece.piece !== undefined) {
        if (
          spaceName.charAt(0) === this.enPassantPiece.spaceName.charAt(0) &&
          Math.abs(
            parseInt(spaceName.charAt(1)) - parseInt(this.enPassantPiece.spaceName.charAt(1))
          ) === 1 &&
          this.pieces[this.focusedPiece].piece.includes('Pawn')
        ) {
          for (let i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i].spaceName === this.enPassantPiece.spaceName) {
              this.pieces.splice(i, 1)
              break
            }
          }
        }
      }
      this.enPassantPiece = {} as Piece
      if (
        this.pieces[this.focusedPiece].piece.includes('Pawn') &&
        Math.abs(
          parseInt(spaceName.charAt(1)) -
            parseInt(this.pieces[this.focusedPiece].spaceName.charAt(1))
        ) === 2
      ) {
        this.logMessage('the en passant piece is the playas now')
        this.enPassantPiece = this.pieces[this.focusedPiece]
      }
      this.pieces[this.focusedPiece].spaceName = spaceName
      for (let i = 0; i < this.pieces.length; i++) {
        if (
          this.pieces[i].spaceName === spaceName &&
          this.pieces[i].piece.charAt(0) !== this.playerColor
        ) {
          this.pieces.splice(i, 1)
          break
        }
      }
      this.playersTurn = false
      this.setUnfocused()
    },
    updateOpponentMove(oldSpace: string, newSpace: string) {
      this.logMessage(this.enPassantPiece.piece)
      for (let i = 0; i < this.pieces.length; i++) {
        if (
          this.pieces[i].spaceName.charAt(0) === newSpace.charAt(0) &&
          this.pieces[i].spaceName.charAt(1) === newSpace.charAt(1)
        ) {
          if (this.enPassantPiece.piece !== undefined) {
            if (
              newSpace.charAt(0) === this.enPassantPiece.spaceName.charAt(0) &&
              Math.abs(
                parseInt(newSpace.charAt(1)) - parseInt(this.enPassantPiece.spaceName.charAt(1))
              ) === 1 &&
              this.pieces[i].piece.includes('Pawn')
            ) {
              for (let j = 0; j < this.pieces.length; j++) {
                if (this.pieces[j].spaceName === this.enPassantPiece.spaceName) {
                  this.pieces.splice(j, 1)
                  break
                }
              }
            }
          }
          this.pieces.splice(i, 1)
          break
        }
      }
      for (let piece of this.pieces) {
        if (
          piece.spaceName.charAt(0) === oldSpace.charAt(0) &&
          piece.spaceName.charAt(1) === oldSpace.charAt(1)
        ) {
          this.enPassantPiece = {} as Piece
          if (
            piece.piece.includes('Pawn') &&
            Math.abs(parseInt(newSpace.charAt(1)) - parseInt(oldSpace.charAt(1))) === 2
          ) {
            this.logMessage('EN PASSANT DETECTED!')
            this.enPassantPiece = piece
          }
          piece.spaceName = newSpace
        }
      }
      const color = this.playerColor === 'w' ? 'white' : 'black'
      if (isKingChecked(getKing(this.pieces, color)!, this.pieces, this.enPassantPiece)) {
        let audio = new Audio(checkSound)
        audio.play()
      }
      this.playersTurn = true
    },
    updateMovableSpaces() {
      if (this.focusedPiece === -1) {
        this.movableSpaces = []
        return
      }
      this.movableSpaces = getMovableSpaces(
        this.pieces[this.focusedPiece],
        this.pieces,
        this.enPassantPiece
      )
    },
    getSpaceMovable(file: string, rank: string) {
      if (
        this.movableSpaces.filter((space) => space.file === file && space.rank === rank).length > 0
      ) {
        return true
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
      if (this.socket === undefined) {
        return
      }
      this.socket.on('opponent-moved', (piece: string, oldSpace: string, newSpace: string) => {
        this.updateOpponentMove(oldSpace, newSpace)
      })
      this.playersTurn = this.playerColor === 'w' ? true : false
    },
    playerColor() {
      this.spaces = this.playerColor === 'w' ? getWhiteBoard() : getBlackBoard()
    },
    focusedPiece() {
      this.updateMovableSpaces()
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
        :isMovable="getSpaceMovable(space.file, space.rank)"
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
  display: grid;
  grid-template-columns: 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5%;
  gap: 0;
}

@media only screen and (min-width: 700px) {
  .chess-board-container {
    max-width: min(80vh, 100%);
    height: min(80vh, 100vw);
    max-height: calc(90vh - max(55px, 6.5vh) - 32px);
  }
}
</style>
