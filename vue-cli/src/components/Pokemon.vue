<template lang="html">
  <div id="pokemon">
    <div class="header">
      <input :id="index + '-name'" class="name" v-model="name" type="text" placeholder="PKMN">
      <div v-if="!isEmpty" :id="index + '-types'" class="types"></div>
    </div>
    <div class="body" v-if="!isEmpty">
      <div :id="index + '-sprite'" class="sprite"></div>
      <div :id="index + '-abilities'" class="abilities"></div>
      <div :id="index + '-insert-data-here'" class="insert-data-here"></div>
    </div>
    <!-- FIXME: later implementation...?
    <div class="footer">
      <p :id="index + '-flavor-text'" class="flavor-text">-</p>
      <div :id="index + '-dex-num'" class="dex-num">-</div>
    </div>
  -->
  </div>
</template>


<script>
export default {
  name: "Pokemon",
  props: {
    index: {
      type: Number,
      required: true
    },
    addOn: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      name: ""
    };
  },
  created() {
    var mon = this.$root.$data.team[this.index];
    if(mon !== null) {
      this.name = mon.name;
    }
  },
  methods: {
    updateTeam() {
      if(this.name !== "") {
        fetch("https://pokeapi.co/api/v2/pokemon/" + this.name)
          .then(response => {
            if(!response.ok) {
              throw new Error();
            }
            return response.json();
          })
          .then(json => {
            this.$root.$data.team[this.index] = json;
          })
          .catch(() => {
            this.$root.$data.team[this.index] = null;
          });
      }
      else {
        this.$root.$data.team[this.index] = null;
      }
    },
    populateCard() {
      fetch("https://pokeapi.co/api/v2/pokemon/" + this.name)
        .then(response => {
          if(!response.ok) {
            throw new Error();
          }
          return response.json();
        })
        .then(json => {
          var name = this.capitalize(json.name);
          document.getElementById(this.index + "-name").value = name;

          var types = "";
          json.types.forEach(type => {
            types += "<p>" + type.type.name.toUpperCase() + "</p>";
          });
          document.getElementById(this.index + "-types").innerHTML = types;

          var sprite = "<img src='" + json.sprites.front_default + "' alt='sprite'>";
          document.getElementById(this.index + "-sprite").innerHTML = sprite;

          var abilitiesElement = document.getElementById(this.index + "-abilities");
          if(abilitiesElement !== null) {
            var abilities = "";
            for(var n in json.abilities) {
              var ability = json.abilities[n].ability.name;
              abilities += "<p>" + this.capitalize(ability) + "</p>";
              abilitiesElement.innerHTML = abilities;
            }
          }

          document.getElementById(this.index + "-insert-data-here").innerHTML = this.addOn;
          var placeholder = document.getElementById(this.index + "-insert-data-here").children[0];
          if(placeholder.className === "stats") {
            for(var i = 0; i < placeholder.childElementCount; i++) {
              placeholder.children[i].innerText = json.stats[i].base_stat;
              var statStyle = placeholder.children[i].style;
              statStyle.width = json.stats[i].base_stat + "%";
              statStyle.height = "5%";
              statStyle.margin = "0.5em";
              statStyle.paddingLeft = "0.5em";
              statStyle.backgroundColor = "white";
              statStyle.borderRadius = "1em";
              statStyle.textAlign = "left";
            }
          }
          else if(placeholder.className === "moves") {
            placeholder.style.display = "grid";
            placeholder.style.gridTemplateColumns = "auto auto";

            var options = "";
            json.moves.forEach(move => {
              options += "<option>" + this.capitalize(move.move.name) + "</option>"
            });
            for(var j = 0; j < placeholder.childElementCount; j++) {
              placeholder[j].innerHTML = options;
              var moveStyle = placeholder[j].style;
              moveStyle.borderRadius = "1em 0 0 1em";
              moveStyle.border = "none";
              moveStyle.overflow = "hidden";
              moveStyle.margin = "0.5em";
            }
          }

          var flavorText = "Flavor text not found";
          document.getElementById(this.index + "-flavor-text").innerText = flavorText;

          var dexNum = "000";
          document.getElementById(this.index + "-dex-num").innerText = dexNum;
        })
        .catch(() => {
          return null;
        });
    },
    capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  },
  computed: {
    isEmpty() {
      return this.name === "";
    }
  },
  watch: {
    name: ["updateTeam", "populateCard"]
  }
};
</script>


<style lang="css" scoped>
#pokemon {
  margin: 2%;
  padding: 2%;
  width: 80vw;
  background-color: lightgray;
  border-radius: 1em;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  padding: 0 5%;
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}
input {
  font-size: 2em;
  width: 50%;
  border: none;
  border-bottom: 1px solid gray;
  background-color: lightgray;
}
.types {
  display: flex;
  flex-direction: column;
  padding: 0.5em;
}

.body {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.abilities {
  width: 100%;
  padding: 0.25em;
  margin-bottom: 0.5em;
  display: flex;
  flex-direction: row;
  flex-flow: wrap;
  justify-content: space-around;
  align-items: center;
}

.insert-data-here {
  width: 100%;
}

.types, .abilities {
  background-color: #ff4040;
  border-radius: 1em;
  overflow: hidden;
}

.footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

@media only screen and (min-width: 961px) {
  #pokemon {
    width: auto;
  }
}
</style>
