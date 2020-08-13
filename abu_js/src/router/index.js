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
    component: () =>
      import(
        /* webpackChunkName: "Polymerization" */ "../views/Polymerization.vue"
      ),
  },
  {
    path: "/viewer",
    name: "Viewer",
    component: () =>
      import(/* webpackChunkName: "Viewer" */ "../views/Viewer.vue"),
  },
  {
    path: "*",
    redirect: "/polymerization",
  },
];

const router = new VueRouter({
  mode: "history",
  // base: "tms/parser",
  base: process.env.BASE_URL,
  routes,
});

export default router;
