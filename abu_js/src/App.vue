<template>
  <v-app>
    <top-menu />
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
      <v-footer app dark img="@/assets/img/ikura_dark.png">
        <v-spacer></v-spacer>
        &copy; RCAST Kanzaki Lab 2020
      </v-footer>
    </v-main>
  </v-app>
</template>

<script>
import TopMenu from "./components/TopMenu.vue";
export default {
  name: "App",

  components: {
    TopMenu,
  },
};
</script>
