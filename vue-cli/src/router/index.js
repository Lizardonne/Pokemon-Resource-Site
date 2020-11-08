import Vue from "vue";
import VueRouter from "vue-router";
import Team from "../views/Team.vue";
import Moves from "../views/Moves.vue";
import Typing from "../views/TypeCalculator.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Team",
    component: Team
  },
  {
    path: "/moves",
    name: "Moves",
    component: Moves
  },
  {
    path: "/typing",
    name: "Typing",
    component: Typing
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
