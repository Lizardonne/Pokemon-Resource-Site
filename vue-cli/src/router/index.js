import Vue from "vue";
import VueRouter from "vue-router";
import Dex from "../views/Dex.vue";
import Search from "../views/Search.vue";
import TeamBuilder from "../views/TeamBuilder.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Dex",
    component: Dex
  },
  {
    path: "/search",
    name: "Search",
    component: Search
  },
  {
    path: "/teambuilder",
    name: "Team Builder",
    component: TeamBuilder
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
