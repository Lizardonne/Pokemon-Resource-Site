<template lang="html">
  <div id="type-calculator">
    <h1>Type Calculator</h1>
    <button @click="effectiveness">Refresh</button>
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
            <th :id="'header-' + (n - 1)" :key="n">
              <input  v-model="team[n - 1]"
                      :id="'input-' + (n - 1)"
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
            <th class="row-header" scope="col">{{ capitalize(type.name) }}</th>
            <template v-for="n in teamSize">
              <td :key="n" v-bind:id="cellID(type.name, n - 1)"></td>
            </template>
            <th v-bind:id="type.name + '-weak'"></th>
            <th v-bind:id="type.name + '-resist'"></th>
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
    var team = new Array(6);
    for(var i = 0; i < team.length; i++) {
      if(this.$root.$data.team[i] !== null) {
        team[i] = this.capitalize(this.$root.$data.team[i].name);
      }
    }

    return {
      types: [],
      team: team,
      effect: {
        noEffect: "0x",
        snve: "1/4x",
        nve: "1/2x",
        neutral: "",
        se: "2x",
        sse: "4x"
      }
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
  mounted() {
    this.$nextTick(() => {
      this.effectiveness();
      // FIXME: don't know why this isn't refreshing
      //  after populating the table, so the button
      //  will have to serve for now
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
    capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    updateTeam() {
      for (var col in this.team) {
        if (this.team[col] === "") {
          this.$root.$data.team[col] = null;
        }
        else if (this.team[col] !== undefined) {
          fetch("https://pokeapi.co/api/v2/pokemon/" + this.team[col])
            .then(response => {
              if(!response.ok) {
                throw new Error();
              }
              return response.json();
            })
            .then(json => {
              this.$root.$data.team[col] = json;
            })
            .catch(() => {
              this.$root.$data.team[col] = null;
            })
            .finally(() => {
              console.log("end u");
            });
        }
      }
    },
    effectiveness() {
      console.log("start e");
      const EMPTY = "";

      for(var col = 0; col < this.teamSize; col++) {
        var pkmn = this.$root.$data.team[col];
        if (pkmn === null) {
          this.types.forEach(type => {
            var currentCell = document
              .getElementById(this.cellID(type.name, col));
            currentCell.innerText = EMPTY;
            currentCell.style.backgroundColor = "inherit";
            currentCell.style.color = "inherit";
          });
        } else {
          this.team[col] = this.capitalize(pkmn.name);

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
                currentCell.style.backgroundColor = "#73be73";
                break;
              case 1:
                currentCell.innerText = this.effect.neutral;
                break;
              case 2:
                currentCell.innerText = this.effect.se;
                currentCell.style.backgroundColor = "#ff6666";
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
          for (var col in this.team) {
            var cellContents = document
              .getElementById(this.cellID(row, col)).innerText;
            if ((cellContents === this.effect.se) ||
              (cellContents === this.effect.sse)) {
              totalWeak++;
            } else if ((cellContents === this.effect.noEffect) ||
              (cellContents === this.effect.snve) ||
              (cellContents === this.effect.nve)) {
              totalResist++;
            }
            if(totalWeak > 0) {
              document.getElementById(row + "-weak").innerText = totalWeak;
            }
            if(totalResist > 0) {
              document.getElementById(row + "-resist").innerText = totalResist;
            }
          }
        });
      }
    }
  },
  watch: {
    team: ["updateTeam", "effectiveness"]
  }
};
</script>

<style lang="css" scoped>
table {
  border-spacing: 0;
}
button {
  padding: 0.5em 1em;
  border: none;
  border-radius: 1em 1em 0 0;
  background-color: gray;
}
button:hover {
  font-weight: bold;
}

input {
  width: 90%;
  padding: 0;
  text-align: center;
  border: none;
  border-bottom: 1px solid gray;
}
#header-weak , #header-resist {
  padding: 0.25em 0.25em 0 0.25em;
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
  background-color: #72bcd4;
}

table {
  border: 1px solid gray;
  border-radius: 1em;
  overflow: hidden;
}
.table-body, input {
  background-color: lightgray;
}
tbody tr:hover {
  background-color: black;
  color: lightgray;
}
</style>
