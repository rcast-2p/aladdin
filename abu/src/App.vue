<template>
  <v-app>
    <top-menu />
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import TopMenu from "./components/TopMenu.vue";
import Vue from "vue";

export default Vue.extend({
  name: "App",
  components: {
    TopMenu,
  },
  data: () => ({
    //
  }),
});
</script>
