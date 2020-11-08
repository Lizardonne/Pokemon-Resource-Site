<template lang="html">
  <div id="team">
    <h1>Team</h1>
    <div class="pokemon">
      <template v-for="n in teamSize">
        <Pokemon :index="n - 1" :addOn="teamHTML" :key="n" />
      </template>
    </div>
  </div>
</template>

<script>
import Pokemon from "../components/Pokemon.vue";

export default {
  name: "Team",
  components: {
    Pokemon
  },
  computed: {
    teamSize() {
      return this.$root.$data.team.length;
    },
    teamHTML() {
      return '<div class="stats">' +
        '<div class="hp"></div>' +
        '<div class="atk"></div>' +
        '<div class="def"></div>' +
        '<div class="spa"></div>' +
        '<div class="spd"></div>' +
        '<div class="spe"></div>' +
      '</div>';
    }
  }
};
</script>

<style lang="css" scoped>
#team {
  display: flex;
  flex-direction: column;
}

.pokemon {
  display: flex;
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
