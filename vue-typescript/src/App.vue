<template>
  <v-app>
    <v-app-bar app color="indigo" dark>
      <div class="d-flex align-center">Pulse</div>
      <v-spacer></v-spacer>
      <v-btn to="/webview">webview</v-btn>
      <v-btn to="/">home</v-btn>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",

  data: () => ({
    //
  })
});
</script>
