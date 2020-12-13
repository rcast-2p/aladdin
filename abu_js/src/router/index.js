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
    path: "/colormap",
    name: "colormap",
    // eslint-disable-next-line
    component: () => import(/* webpackChunkName: "colormap" */ "../views/ColorMap.vue"),
  },
  {
    path: "/oscillo",
    name: "Oscillo",
    // eslint-disable-next-line
    component: () => import(/* webpackChunkName: "Oscillo" */ "../views/Oscillo.vue"),
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
    component: () => import(/* webpackChunkName: "ListTiff" */ "../views/ListTiff.vue"),
  },
  {
    path: "/camera",
    name: "Camera",
    // eslint-disable-next-line
    component: () => import(/* webpackChunkName: "Camera" */ "../views/Camera.vue"),
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
