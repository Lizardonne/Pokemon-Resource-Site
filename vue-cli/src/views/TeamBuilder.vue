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
            <th v-bind:id="'header-' + n" :key="n">
              <input v-model="inputs[n]" class="input" type="text" placeholder="PKMN" />
            </th>
          </template>
          <th id="header-weak">Weak</th>
          <th id="header-resist">Resist</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="type in types">
          <tr :key="type.name">
            <th scope="col" class="row-header">{{ type.name }}</th>
            <template v-for="n in teamSize">
              <td :key="n" v-bind:id="cellID(type.name, n)"></td>
            </template>
            <th v-bind:id="type.name + '-weak'">0</th>
            <th v-bind:id="type.name + '-resist'">0</th>
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
      types: [],
      inputs: [],
      effect: {
        noEffect: "0",
        snve: "1/4",
        nve: "1/2",
        neutral: "",
        se: "2",
        sse: "4"
      },
      teamSize: 6
    };
  },
  created() {
    fetch("https://pokeapi.co/api/v2/type/")
      .then(response => {
        return response.json();
      })
      .then(json => {
        delete json.results[--json.count]; // remove Shadow type
        delete json.results[--json.count]; // remove Unknown type
        json.results.forEach(type => {
          fetch(type.url)
            .then(response => {
              return response.json();
            })
            .then(json => {
              this.types.push(json);
            });
        });
      });
  },
  methods: {
    cellID(row, col) {
      return row + "-" + col;
    },
    effectiveness() {
      const EMPTY = "";
      for (var col in this.inputs) {
        getPokemon("https://pokeapi.co/api/v2/pokemon/" + this.inputs[col].toLowerCase(), col)
          .then(result => {
            var pkmn = result.json;
            var col = result.col;

            if (pkmn === null) {
              this.types.forEach(type => {
                document.getElementById(this.cellID(type.name, col)).innerText = EMPTY;
              });
            }
            else {
              if (pkmn !== null) {
                var pkmnTypes = [];
                pkmn.types.forEach(obj => {
                  this.types.forEach(template => {
                    if (obj.type.name === template.name) {
                      pkmnTypes.push(template);
                    }
                  });
                });

                this.types.forEach(type => {
                  var effectiveness = 1;
                  pkmnTypes.forEach(pkmnType => {
                    pkmnType.damage_relations.no_damage_from.forEach(immunity => {
                      if (immunity.name === type.name) {
                        effectiveness *= 0;
                      }
                    });
                    pkmnType.damage_relations.double_damage_from.forEach(weakness => {
                      if (weakness.name === type.name) {
                        effectiveness *= 2;
                      }
                    });
                    pkmnType.damage_relations.half_damage_from.forEach(resistance => {
                      if (resistance.name === type.name) {
                        effectiveness *= 0.5;
                      }
                    });
                  });

                  var currentCell = document.getElementById(this.cellID(type.name, col));
                  switch (effectiveness) {
                    case 0:
                      currentCell.innerText = this.effect.noEffect;
                      break;
                    case 0.25:
                      currentCell.innerText = this.effect.snve;
                      break;
                    case 0.5:
                      currentCell.innerText = this.effect.nve;
                      break;
                    case 1:
                      currentCell.innerText = this.effect.neutral;
                      break;
                    case 2:
                      currentCell.innerText = this.effect.se;
                      break;
                    case 4:
                      currentCell.innerText = this.effect.sse;
                      break;
                    default:
                      currentCell.innerText = EMPTY;
                      break;
                  }
                });
              }
            }

            this.types.forEach(type => {
              var row = type.name;
              var totalWeak = 0;
              var totalResist = 0;
              for(var col in this.inputs) {
                var cellContents = document.getElementById(this.cellID(row, col)).innerText;
                console.log(cellContents);
                if((cellContents === this.effect.se) ||
                    (cellContents === this.effect.sse)) {
                  totalWeak++;
                }
                else if((cellContents === this.effect.noEffect) ||
                    (cellContents === this.effect.snve) ||
                    (cellContents === this.effect.nve)) {
                  totalResist++;
                }
                console.log(totalWeak, totalResist);
                document.getElementById(row + "-weak").innerText = totalWeak;
                document.getElementById(row + "-resist").innerText = totalResist;
              }
            });
          });
      }

      async function getPokemon(url, col) {
        return fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error();
            }
            return response.json();
          })
          .then(json => {
            return {
              json: json,
              col: col
            };
          })
          .catch(() => {
            return {
              json: null,
              col: col
            };
          });
      }
    }
  },
  watch: {
    inputs: {
      handler: "effectiveness",
      deep: true
    }
  }
};
</script>

<style lang="css" scoped>
input {
  width: 90%;
  padding: 0 5%;
  text-align: center;
}
.row-header {
  text-align: right;
}
</style>
