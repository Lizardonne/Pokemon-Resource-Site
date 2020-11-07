<template lang="html">
  <div id="team-builder">
    <h1>Team Builder</h1>
    <table>
      <colgroup>
        <col />
        <col v-bind:span="teamSize" />
        <col />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th></th>
          <template v-for="n in teamSize">
            <th :key="n">
              <input v-model="inputs[n]" class="input" type="text" placeholder="PKMN" />
            </th>
          </template>
          <th>Weak</th>
          <th>Resist</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="type in types">
          <tr :key="type.name">
            <th scope="col" class="row-header">{{ type.name }}</th>
            <template v-for="n in teamSize">
              <td :key="n" v-bind:id="type.name + '-' + n"></td>
            </template>
            <th></th>
            <th></th>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "TeamBuilder",
  data() {
    return {
      types: Array,
      inputs: [],
      teamSize: 6,
      effect: {
        noEffect: 0,
        snve: 0.25,
        nve: 0.5,
        neutral: 1,
        se: 2,
        sse: 4,
        empty: "*"
      }
    };
  },
  created() {
    fetch("https://pokeapi.co/api/v2/type/")
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.types = json.results;
        delete this.types[--this.types.length];  // remove Shadow type
        delete this.types[--this.types.length];  // remove Unknown type
      });
  },
  methods: {
    effectiveness() {
      for(var col in this.inputs) {
        fetch("https://pokeapi.co/api/v2/pokemon/" + this.inputs[col])
          .then(response => {
            return response.json();
          })
          .then(json => {
            var pkmn = json;
            if(pkmn !== null) {
              var pkmnTypes = [];
              pkmn.types.forEach(obj => {
                this.types.forEach(template => {
                  if(obj.type.name === template.name) {
                    pkmnTypes.push(template);
                  }
                });
              });

              this.types.forEach(type => {
                // FIXME: calculate effectiveness, assign to cell
                //eff = offType->defType
                var effectiveness = 1;
                var result;
                switch (effectiveness) {
                  case 0.25:
                    result = this.effect.snve;
                    break;
                  case 0.5:
                    result = this.effect.nve;
                    break;
                  case 1:
                    result = this.effect.neutral;
                    break;
                  case 2:
                    result = this.effect.se;
                    break;
                  case 4:
                    result = this.effect.sse;
                    break;
                  default:
                    result = this.effect.empty;
                    break;
                }
                var id = type.name + "-" + col;
                document.getElementById(id).innerText = result;
              });
            }
          })
          .catch(error => console.error(error));
      }
    }
  },
  watch: {
    inputs: "effectiveness"
  }
};
</script><style lang="css" scoped></style>
