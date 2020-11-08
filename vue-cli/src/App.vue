<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Team</router-link> |
      <router-link to="/moves">Moves</router-link> |
      <router-link to="/types">Types</router-link>
    </div>
    <div id="body">
      <router-view />
    </div>
    <div id="footer">
      <div>
        <a href="#">GitHub</a>
      </div>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  box-sizing: border-box;
}

#nav {
  padding: 30px;
}

#nav a, #footer a {
  padding: 0.5em;
  border-radius: 0.5em;
  font-weight: bold;
  color: black;
}

#nav a:hover, #footer a:hover {
  background-color: lightgray;
}

#nav a.router-link-exact-active {
  color: #ff4040;
}

#body {
  margin-bottom: auto;
}

#footer {
  margin-top: auto;
  padding: 2%;
  background-color: white;
}
#footer div {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

p {
  margin: 0;
}
</style>
