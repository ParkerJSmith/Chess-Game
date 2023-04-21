<script lang="ts">
import { defineComponent } from 'vue'
import blackPawn from "../../assets/images/black_pawn.png";
import whitePawn from "../../assets/images/white_pawn.png";

export default defineComponent({
  props: {
    spaceName: String,
    piece: String
  },
  computed: {
    getSpaceColor() {
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
        switch(this.piece) {
            case "whitePawn": 
                return whitePawn;
            case "blackPawn": 
                return blackPawn;
            
        }
        return blackPawn;
    }
  }
})
</script>

<template>
  <div class="chess-board-space" :class="getSpaceColor">
    <h2>{{ spaceName }}</h2>
    <img :src="getPieceImage" alt=""/>
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

.chess-board-space > img{
    width: 70%;
    margin: auto;
    user-select: none;
    -webkit-user-drag: none;
}

.chess-board-space:hover {
  cursor: pointer;
  background-color: yellow;
}

.white-space {
  background-color: white;
}

.black-space {
  background-color: #003A41;
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
