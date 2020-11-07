<template lang="html">
  <div class="dex">
    <h1>Dex</h1>
    <DexTemplate :dex="dex" />
  </div>
</template>

<script>
import DexTemplate from "../components/DexTemplate.vue";
export default {
  name: "Dex",
  components: DexTemplate,
  computed: {
    dex() {
      // FIXME: fetch info
      return [];
    }
  }
};
</script>

<style lang="css" scoped>
</style>
