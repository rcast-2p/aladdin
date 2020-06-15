<template>
  <div>
    <v-btn @click="connectionTest"> connection test </v-btn>

    <v-chip v-if="alive" color="blue" dark>alive</v-chip>
    <v-chip v-else color="red" dark>dead</v-chip>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { exec } from "child_process";
export default Vue.extend({
  data() {
    return {
      alive: true
    };
  },
  methods: {
    connectionTest() {
      const command = `ssh debian@${this.$store.state.address} hostname -I`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(stderr);
          this.alive = false;
        } else {
          console.log(stdout);
          this.alive = true;
        }
      });
    }
  }
});
</script>
