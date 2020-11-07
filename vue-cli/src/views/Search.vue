<template lang="html">
  <div id="search">
    <h1>Search</h1>
    <DexTemplate :dex="dex" />
  </div>
</template>

<script>
import DexTemplate from "../components/DexTemplate.vue";
export default {
  name: "Search",
  components: DexTemplate,
  computed: {
    dex() {
      // FIXME: fetch data
      // FIXME: filter data
      return [];
    }
  }
}
</script>

<style lang="css" scoped>
</style>
