<template lang="html">
  <div id="moves">
    <h1>Moves</h1>
    <div class="pokemon">
      <template v-for="n in teamSize">
        <Pokemon :index="n - 1" :addOn="movesHTML" :key="n" />
      </template>
    </div>
  </div>
</template>


<script>
import Pokemon from "../components/Pokemon.vue";
export default {
  name: "Moves",
  components: {
    Pokemon
  },
  computed: {
    teamSize() {
      return this.$root.$data.team.length;
    },
    movesHTML() {
      return "<form>" +
        "<select id='move-1' class='move'></select>" +
        "<select id='move-2' class='move'></select>" +
        "<select id='move-3' class='move'></select>" +
        "<select id='move-4' class='move'></select>" +
      "</form>";
    }
  }
}
</script>


<style lang="css" scoped>
#moves {
  display: flex;
  flex-direction: column;
}

.pokemon {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
