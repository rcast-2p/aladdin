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
    component: () => import(/* webpackChunkName: "Scan" */ "../views/Main.vue"),
  },
  {
    path: "/tiff",
    name: "Tiff",
    // eslint-disable-next-line
    component: () => import(/* webpackChunkName: "Tiff" */ "../views/Tiff.vue"),
  },
  {
    path: "/list-tiff",
    name: "ListTiff",
    // eslint-disable-next-line
    component: () => import(/* webpackChunkName: "ListTiff" */ "../views/Tiff.vue"),
  },
  {
    path: "/list-json",
    name: "ListJson",
    // eslint-disable-next-line
    component: () => import(/* webpackChunkName: "ListTiff" */ "../views/ListJson.vue"),
  },
  {
    path: "/ome",
    name: "ome",
    // eslint-disable-next-line
    component: () => import(/* webpackChunkName: "Camera" */ "../views/Ome.vue"),
  },
  {
    path: "/galvo",
    name: "Galvo",
    // eslint-disable-next-line
    component: () => import(/* webpackChunkName: "Galvo" */ "@/views/Galvo.vue"),
  },
  {
    path: "/stimuli",
    name: "Stimuli",
    // eslint-disable-next-line
    component: () => import(/* webpackChunkName: "Stimuli" */ "@/views/Stimuli.vue"),
  },
  {
    path: "/table",
    name: "Table",
    // eslint-disable-next-line
    component: () => import(/* webpackChunkName: "Table" */ "@/views/Table.vue"),
  },
  {
    path: "/hwconfig",
    name: "Hwconfig",
    // eslint-disable-next-line
    component: () => import(/* webpackChunkName: "Config" */ "@/views/Config.vue"),
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
