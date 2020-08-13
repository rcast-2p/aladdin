<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      dark
      temporary
      app
      src="@/assets/img/aladdin.png"
    >
      <v-list dense nav>
        <v-list-item v-for="(menuEle, mI) in menu" :key="mI" :to="menuEle.to">
          <v-list-item-icon>
            <v-icon>{{ menuEle.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ menuEle.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="secondary" dark app src="@/assets/img/aladdin.png">
      <v-app-bar-nav-icon @click="drawer = !drawer"> </v-app-bar-nav-icon>
      <v-toolbar-title>Abu</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      drawer: false,
      menu: [
        { icon: "mdi-home", text: "PRU", to: "pru" },
        { icon: "mdi-auto-fix", text: "about", to: "about" },
        { icon: "mdi-merge", text: "graph", to: "graph" },
        { icon: "mdi-cog", text: "home", to: "home" },
      ],
    };
  },
});
</script>
