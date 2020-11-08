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
      return "<form class='moves'>" +
        "<select class='move'></select>" +
        "<select class='move'></select>" +
        "<select class='move'></select>" +
        "<select class='move'></select>" +
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

@media only screen and (min-width: 961px) {
  .pokemon {
    display: grid;
    grid-template-columns: auto auto auto;
  }
  Pokemon {
    width: 30vw;
  }
}
</style>
