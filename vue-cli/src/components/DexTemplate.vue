<template lang="html">
  <div id="dex-template">
    <h2>Dex Template</h2>
    <div class="pokemon" v-for="pokemon in fullDex" :key="pokemon.id"></div>
  </div>
</template>

<script>
export default {
  name: "DexTemplate",
  props: {
    dex: []
  },
  computed: {
    fullDex() {
      var dex = this.$root.$data.dex;
      if(dex === null) {
        return [];
      }
      return this.$root.$data.dex;
    }
  }
};
</script>

<style lang="css" scoped></style>
