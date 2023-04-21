<script lang="ts">
import ChessBoardSpace from './ChessBoardSpace.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      spaces: [
        { rank: 8, file: 'a' },
        { rank: 8, file: 'b' },
        { rank: 8, file: 'c' },
        { rank: 8, file: 'd' },
        { rank: 8, file: 'e' },
        { rank: 8, file: 'f' },
        { rank: 8, file: 'g' },
        { rank: 8, file: 'h' },

        { rank: 7, file: 'a' },
        { rank: 7, file: 'b' },
        { rank: 7, file: 'c' },
        { rank: 7, file: 'd' },
        { rank: 7, file: 'e' },
        { rank: 7, file: 'f' },
        { rank: 7, file: 'g' },
        { rank: 7, file: 'h' },

        { rank: 6, file: 'a' },
        { rank: 6, file: 'b' },
        { rank: 6, file: 'c' },
        { rank: 6, file: 'd' },
        { rank: 6, file: 'e' },
        { rank: 6, file: 'f' },
        { rank: 6, file: 'g' },
        { rank: 6, file: 'h' },

        { rank: 5, file: 'a' },
        { rank: 5, file: 'b' },
        { rank: 5, file: 'c' },
        { rank: 5, file: 'd' },
        { rank: 5, file: 'e' },
        { rank: 5, file: 'f' },
        { rank: 5, file: 'g' },
        { rank: 5, file: 'h' },

        { rank: 4, file: 'a' },
        { rank: 4, file: 'b' },
        { rank: 4, file: 'c' },
        { rank: 4, file: 'd' },
        { rank: 4, file: 'e' },
        { rank: 4, file: 'f' },
        { rank: 4, file: 'g' },
        { rank: 4, file: 'h' },

        { rank: 3, file: 'a' },
        { rank: 3, file: 'b' },
        { rank: 3, file: 'c' },
        { rank: 3, file: 'd' },
        { rank: 3, file: 'e' },
        { rank: 3, file: 'f' },
        { rank: 3, file: 'g' },
        { rank: 3, file: 'h' },

        { rank: 2, file: 'a' },
        { rank: 2, file: 'b' },
        { rank: 2, file: 'c' },
        { rank: 2, file: 'd' },
        { rank: 2, file: 'e' },
        { rank: 2, file: 'f' },
        { rank: 2, file: 'g' },
        { rank: 2, file: 'h' },

        { rank: 1, file: 'a' },
        { rank: 1, file: 'b' },
        { rank: 1, file: 'c' },
        { rank: 1, file: 'd' },
        { rank: 1, file: 'e' },
        { rank: 1, file: 'f' },
        { rank: 1, file: 'g' },
        { rank: 1, file: 'h' }
      ]
    }
  },
  components: {
    ChessBoardSpace
  }
})
</script>

<template>
  <div class="chess-board-container">
    <div class="chess-board-grid">
      <ChessBoardSpace
        v-for="space in spaces"
        :key="space.file + space.rank"
        :spaceName="space.file + space.rank"
      />
    </div>
  </div>
</template>

<style>
.chess-board-container {
  width: 100%;
  aspect-ratio: 1;
  margin: auto;
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
