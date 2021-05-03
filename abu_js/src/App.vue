<template>
  <v-app>
    <top-menu />
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
      <v-footer app dark img="@/assets/img/ikura_dark.png">
        <v-spacer></v-spacer>
        {{ version }}
      </v-footer>
    </v-main>
  </v-app>
</template>

<script>
/**
 * @vue-data {Number} version - current version
 */
import TopMenu from "./components/TopMenu.vue";
import pack from "../package.json";

export default {
  name: "App",

  data: () => ({
    version: pack.version,
  }),
  components: {
    TopMenu,
  },
};
</script>
