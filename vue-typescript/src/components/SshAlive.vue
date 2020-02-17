<template>
  <div>
    <v-btn @click="connection_test"> connection test </v-btn>

    <v-chip v-if="alive" color="blue" dark>alive</v-chip>
    <v-chip v-else color="red" dark>dead</v-chip>
  </div>
</template>
<script>
import * as child from "child_process";
// const exec = require("child_process");
import axios from "axios";
export default {
  data() {
    return {
      alive: true,
    };
  },
  methods: {
    connection_test() {
      const command = `ssh debian@${this.$store.state.address} hostname -I`;
      const foo = child.exec(command, (error, stdout, stderr) => {
        if (error) {
          this.alive = false;
        } else {
          console.log(stdout);
          this.alive = true;
        }
      });
    },
  },
};
</script>
