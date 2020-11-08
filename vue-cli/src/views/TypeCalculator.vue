<template lang="html">
  <div id="type-calculator">
    <h1>Type Calculator</h1>
    <table>
      <colgroup>
        <col class="row-header"/>
        <col class="table-body" v-bind:span="teamSize" />
        <col class="weak-total" />
        <col class="resist-total" />
      </colgroup>
      <thead>
        <tr>
          <th></th>
          <template v-for="n in teamSize">
            <th :id="'header-' + n" :key="n">
              <input  v-model="team[n - 1]"
                      class="input"
                      type="text"
                      placeholder="PKMN" />
            </th>
          </template>
          <th id="header-weak">Weak</th>
          <th id="header-resist">Resist</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="type in types">
          <tr :key="type.name">
            <th scope="col">{{ type.name }}</th>
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
  name: "TypeCalculator",
  data() {
    return {
      types: [],
      team: new Array(6),
      effect: {
        noEffect: "0",
        snve: "1/4",
        nve: "1/2",
        neutral: "",
        se: "2",
        sse: "4"
      }
    };
  },
  created() {
    for(var n in this.team) {
      this.team[n] = this.$root.$data.team[n].name;
    } // FIXME: persistence across pages

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
  computed: {
    teamSize() {
      return this.$root.$data.team.length;
    }
  },
  methods: {
    cellID(row, col) {
      return row + "-" + col;
    },
    updateTeam() {
      for(var index in this.team) {
        if(this.team[index] !== "") {
          this.getPokemon("https://pokeapi.co/api/v2/pokemon/" + this.name,
              index)
            .then(result => {
              if(result.json === null) {
                this.$root.$data.team[result.index] = null;
              }
              this.$root.$data.team[result.index] = result.json;
            })
            .catch(() => {
            });
        }
        else {
          this.$root.$data.team[this.index] = null;
        }
      }
    },
    effectiveness() {
      const EMPTY = "";
      for (var col in this.team) {
        this.getPokemon("https://pokeapi.co/api/v2/pokemon/" +
            this.team[col].toLowerCase(),
            col)
          .then(result => {
            var pkmn = result.json;
            var col = result.index;

            if (pkmn === null) {
              this.types.forEach(type => {
                var currentCell = document
                  .getElementById(this.cellID(type.name, col));
                currentCell.innerText = EMPTY;
                currentCell.style.backgroundColor = "inherit";
                currentCell.style.color = "inherit";
              });
            }
            else {
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
                  pkmnType.damage_relations.no_damage_from
                    .forEach(immunity => {
                      if (immunity.name === type.name) {
                        effectiveness *= 0;
                      }
                  });
                  pkmnType.damage_relations.double_damage_from
                    .forEach(weakness => {
                      if (weakness.name === type.name) {
                        effectiveness *= 2;
                      }
                  });
                  pkmnType.damage_relations.half_damage_from
                    .forEach(resistance => {
                      if (resistance.name === type.name) {
                        effectiveness *= 0.5;
                      }
                  });
                });

                var currentCell = document
                  .getElementById(this.cellID(type.name, col));
                currentCell.style.color = "black";
                switch (effectiveness) {
                  case 0:
                    currentCell.innerText = this.effect.noEffect;
                    currentCell.style.backgroundColor = "darkgreen";
                    break;
                  case 0.25:
                    currentCell.innerText = this.effect.snve;
                    currentCell.style.backgroundColor = "green";
                    break;
                  case 0.5:
                    currentCell.innerText = this.effect.nve;
                    currentCell.style.backgroundColor = "lightgreen";
                    break;
                  case 1:
                    currentCell.innerText = this.effect.neutral;
                    break;
                  case 2:
                    currentCell.innerText = this.effect.se;
                    currentCell.style.backgroundColor = "pink";
                    break;
                  case 4:
                    currentCell.innerText = this.effect.sse;
                    currentCell.style.backgroundColor = "red";
                    break;
                  default:
                    currentCell.innerText = EMPTY;
                    break;
                }
              });
          }

          this.types.forEach(type => {
            var row = type.name;
            var totalWeak = 0;
            var totalResist = 0;
            for(var col in this.team) {
              var cellContents = document
                .getElementById(this.cellID(row, col)).innerText;
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

    },
    getPokemon(url, index) {
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
            index: index
          };
        })
        .catch(() => {
          return {
            json: null,
            index: index
          };
        });
    }
  },
  watch: {
    team: {
      handler: ["updateTeam", "effectiveness"],
      deep: true
    }
  }
};
</script>

<style lang="css" scoped>
table {
  border-spacing: 0;
}

input {
  width: 90%;
  padding: 0;
  text-align: center;
  border: none;
  border-bottom: 1px solid gray;
}
#header-weak , #header-resist {
  padding: 0 0.25em;
}

.row-header {
  text-align: right;
  padding-right: 0.25em;
  background-color: gray;
}
.weak-total {
  background-color: #ff4040;
}
.resist-total {
  background-color: lightblue;
}

table {
  border: 1px solid gray;
  border-radius: 1em;
  overflow: hidden;
}
.table-body {
  background-color: white;
}
tbody tr:hover {
  background-color: black;
  color: lightgray;
}
</style>
