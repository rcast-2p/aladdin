import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "scan",
    component: () => import(/* webpackChunkName: "scan" */ "../views/Scan.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/graph",
    name: "graph",
    component: () =>
      import(/* webpackChunkName: "graph" */ "../views/Graph.vue"),
  },
  {
    path: "/pru",
    name: "pru",
    component: () => import(/* webpackChunkName: "pru" */ "../views/PRU.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
