<script lang="ts">
import ChessBoardSpace from './ChessBoardSpace.vue'
import { defineComponent } from 'vue'
import { getWhiteBoard, getBlackBoard, getInitialPosition } from '../../helpers/GenerateChessBoard'
import type { BoardSpace, Piece } from '../../helpers/GenerateChessBoard'
import { getMovableSpaces, getKing, isKingChecked, isCheckmated } from '../../helpers/FindMoves'
import checkSound from '../../assets/sounds/check_sound.mp3'
import loseSound from '../../assets/sounds/lose_sound.mp3'

export interface Move {
  oldPosition: Piece
  newPosition: Piece
}

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

      const movingPiece = this.pieces[this.focusedPiece]
      const movedList: Move[] = []

      movedList.push({
        oldPosition: {
          piece: this.pieces[this.focusedPiece].piece,
          spaceName: this.pieces[this.focusedPiece].spaceName
        },
        newPosition: { piece: this.pieces[this.focusedPiece].piece, spaceName: spaceName }
      })

      const takenPiece = this.getPieceAtSpace(spaceName)
      if (takenPiece !== null) {
        movedList.push({ oldPosition: takenPiece, newPosition: { piece: '', spaceName: '' } })
        this.removePiece(takenPiece)
      }
      const takenEnPassant = this.checkEnPassantTaken({
        piece: this.pieces[this.focusedPiece].piece,
        spaceName: spaceName
      })
      if (takenEnPassant !== null) {
        movedList.push({ oldPosition: takenEnPassant!, newPosition: { piece: '', spaceName: '' } })
        this.removePiece(takenEnPassant!)
      }
      movingPiece.spaceName = spaceName

      this.socket.emit('piece-moved', movedList, this.roomKey)

      this.playersTurn = false
      this.setUnfocused()
    },
    updateOpponentMove(movedPieces: Move[]) {
      for (const move of movedPieces) {
        if (move.newPosition.piece === '') {
          this.removePiece(move.oldPosition)
        } else {
          this.removePiece(move.oldPosition)
          this.pieces.push(move.newPosition)
        }
        this.checkEnPassant(move)
      }

      const color = this.playerColor === 'w' ? 'white' : 'black'
      const king = getKing(this.pieces, color)!
      if (isKingChecked(king, this.pieces, this.enPassantPiece)) {
        if (isCheckmated(king, this.pieces, this.enPassantPiece)) {
          this.playersTurn = false
          let audio = new Audio(loseSound)
          audio.play()
          return
        }
        let audio = new Audio(checkSound)
        audio.play()
      }
      this.playersTurn = true
    },
    removePiece(piece: Piece) {
      for (let i = 0; i < this.pieces.length; i++) {
        if (this.pieces[i].spaceName === piece.spaceName && this.pieces[i].piece === piece.piece) {
          this.pieces.splice(i, 1)
        }
      }
    },
    removePieceAtSpace(spaceName: string) {
      for (let i = 0; i < this.pieces.length; i++) {
        if (this.pieces[i].spaceName === spaceName) {
          this.pieces.splice(i, 1)
        }
      }
    },
    getPieceAtSpace(spaceName: string) {
      for (let i = 0; i < this.pieces.length; i++) {
        if (this.pieces[i].spaceName === spaceName) {
          return this.pieces[i]
        }
      }
      return null
    },
    checkEnPassant(move: Move) {
      if (!move.oldPosition.piece.includes('Pawn')) {
        return
      }
      if (
        Math.abs(
          parseInt(move.oldPosition.spaceName.charAt(1)) -
            parseInt(move.newPosition.spaceName.charAt(1))
        ) === 2
      ) {
        this.enPassantPiece = move.newPosition
      }
    },
    checkEnPassantTaken(piece: Piece) {
      const direction = this.playerColor === 'w' ? 1 : -1
      if (!piece.piece.includes('Pawn') || this.enPassantPiece.piece === undefined) {
        return null
      }
      if (
        parseInt(piece.spaceName.charAt(1)) ===
          parseInt(this.enPassantPiece.spaceName.charAt(1)) + 1 * direction &&
        piece.spaceName.charAt(0) === this.enPassantPiece.spaceName.charAt(0)
      ) {
        return this.enPassantPiece
      }
      return null
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
      this.socket.on('opponent-moved', (movedPieces: Move[]) => {
        this.updateOpponentMove(movedPieces)
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
