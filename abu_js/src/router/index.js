import Vue from "vue";
import VueRouter from "vue-router";
import VueMeta from "vue-meta";

Vue.use(VueRouter);
Vue.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true,
});
const routes = [
  {
    path: "/scan",
    name: "Scan",
    component: () => import(/* webpackChunkName: "Scan" */ "../views/Scan.vue"),
  },
  {
    path: "/polymerization",
    name: "Polymerization",
    // eslint-disable-next-line
    component: () => import(/* webpackChunkName: "Polymerization" */ "../views/Polymerization.vue"),
  },
  {
    path: "/viewer",
    name: "Viewer",
    // eslint-disable-next-line
    component: () => import(/* webpackChunkName: "Viewer" */ "../views/OldViewer.vue"),
  },
  {
    path: "/viewer-test",
    name: "Test",
    // eslint-disable-next-line
    component: () => import(/* webpackChunkName: "Test" */ "../views/Test.vue"),
  },
  {
    path: "/oscillo",
    name: "Oscillo",
    // eslint-disable-next-line
    component: () => import(/* webpackChunkName: "Oscillo" */ "../views/Oscillo.vue"),
  },
  {
    path: "*",
    redirect: "/scan",
  },
];

const router = new VueRouter({
  mode: "history",
  // base: "tms/parser",
  base: process.env.BASE_URL,
  routes,
});

export default router;
