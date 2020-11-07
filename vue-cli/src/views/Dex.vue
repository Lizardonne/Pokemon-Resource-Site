<template lang="html">
  <div class="dex">
    <h1>Dex</h1>
    <DexTemplate />
  </div>
</template>

<script>
import DexTemplate from "../components/DexTemplate.vue";

export default {
  name: "Dex",
  components: {
    DexTemplate
  },
  created() {
    var url = this.$root.$data.urlBase + "pokemon/";
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(json => {
        delete json.results[--json.count];  // remove Shadow type
        delete json.results[--json.count];  // remove Unknow type
        this.$root.$data.dex = json;
      });
  }
};
</script>

<style lang="css" scoped>
</style>
