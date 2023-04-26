<script lang="ts">
import { defineComponent } from 'vue'
import type { CSSProperties } from 'vue'
import blackPawn from '../../assets/images/black_pawn.png'
import whitePawn from '../../assets/images/white_pawn.png'

const absolutePosition: CSSProperties = { position: 'absolute' }
const userSelectNone: CSSProperties = { userSelect: 'none' }

export default defineComponent({
  props: {
    spaceName: String,
    piece: String,
    isFocused: Boolean
  },
  data() {
    return {
      id: this.spaceName! + this.piece,
      dragging: false,
      initialXPos: 0,
      initialYPos: 0,
      xPos: 0,
      yPos: 0,
      baseStyles: {
        absolutePosition,
        width: '100%',
        height: '100%',
        zIndex: 1,
        userSelectNone
      },
      draggingStyle: {
        cursor: 'grabbing'
      }
    }
  },
  methods: {
    startDrag(e: MouseEvent) {
      this.togglePieceFocus()
      this.dragging = true
      this.initialXPos = e.clientX
      this.initialYPos = e.clientY

      const bodyRect = document.getElementById(this.id)!.getBoundingClientRect()
      const width = bodyRect.right - bodyRect.left
      const centeringXOffset = e.clientX - bodyRect.left - width / 2

      const height = bodyRect.bottom - bodyRect.top
      const centeringYOffset = e.clientY - bodyRect.top - height / 2

      this.xPos += centeringXOffset
      this.yPos += centeringYOffset

      window.addEventListener('mouseup', this.stopDrag)
      window.addEventListener('mousemove', this.dragElement)
    },
    stopDrag() {
      this.dragging = false
      this.xPos = 0
      this.yPos = 0
      window.removeEventListener('mouseup', this.stopDrag)
      window.removeEventListener('mousemove', this.dragElement)
    },
    dragElement(e: MouseEvent) {
      if (!this.dragging) {
        return
      }
      e.preventDefault()
      const bodyRect = document.getElementById(this.id)!.getBoundingClientRect()

      const centeringXOffset = e.clientX - bodyRect.left - bodyRect.width / 2
      const centeringYOffset = e.clientY - bodyRect.top - bodyRect.height / 2

      const boardRect = document.getElementById('chessBoard')?.getBoundingClientRect()

      if (
        bodyRect.x + bodyRect.width / 2 + (e.clientX - this.initialXPos + centeringXOffset) >=
          boardRect!.left &&
        bodyRect.x + bodyRect.width / 2 + (e.clientX - this.initialXPos + centeringXOffset) <=
          boardRect!.right
      ) {
        this.xPos += e.clientX - this.initialXPos + centeringXOffset
      } else {
        if (e.clientX > boardRect!.right) {
          this.xPos += boardRect!.right - bodyRect.x - bodyRect.width / 2
        }
        if (e.clientX < boardRect!.left) {
          this.xPos += boardRect!.left - bodyRect.x - bodyRect.width / 2
        }
      }

      if (
        bodyRect.y + bodyRect.height / 2 + (e.clientY - this.initialYPos + centeringYOffset) >=
          boardRect!.top &&
        bodyRect.y + bodyRect.height / 2 + (e.clientY - this.initialYPos + centeringYOffset) <=
          boardRect!.bottom
      ) {
        this.yPos += e.clientY - this.initialYPos + centeringYOffset
      } else {
        if (e.clientY > boardRect!.bottom) {
          this.yPos += boardRect!.bottom - bodyRect.y - bodyRect.height / 2
        }
        if (e.clientY < boardRect!.top) {
          this.yPos += boardRect!.top - bodyRect.y - bodyRect.height / 2
        }
      }

      this.initialXPos = e.clientX
      this.initialYPos = e.clientY
    },
    togglePieceFocus() {
      if (!this.isFocused) {
        this.$emit('pieceFocused')
      } else {
        this.$emit('pieceUnfocused')
      }
    },
    logMessage(message: any) {
      console.log(message)
    }
  },
  computed: {
    getPieceImage() {
      switch (this.piece) {
        case 'whitePawn':
          return whitePawn
        case 'blackPawn':
          return blackPawn
      }
      return blackPawn
    },
    getPieceXPos() {
      if (this.dragging) {
        return this.xPos + 'px'
      }
      return this.xPos + 'px'
    },
    getPieceYPos() {
      if (this.dragging) {
        return this.yPos + 'px'
      }
      return this.yPos + 'px'
    },
    getStyle() {
      return this.dragging ? [this.baseStyles, this.draggingStyle] : this.baseStyles
    }
  }
})
</script>

<template>
  <div
    class="chess-piece"
    :id="id"
    @mousedown="(e) => startDrag(e)"
    :style="[getStyle, { top: getPieceYPos, left: getPieceXPos }]"
  >
    <img :src="getPieceImage" draggable="false" />
  </div>
</template>

<style>
.chess-piece {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  z-index: 1;
  -webkit-user-drag: none;
  user-select: none;
}

.chess-piece:hover {
  cursor: grab;
}

.chess-piece > img {
  height: 100%;
  width: 100%;
}
</style>
