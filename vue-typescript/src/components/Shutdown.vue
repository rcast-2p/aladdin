<template>
  <div>
    <v-btn @click="valert = !valert">表示</v-btn>
    <v-row>
      <v-btn v-if="valert" color="red" dark @click="forceStop"
        >強制ストップ</v-btn
      >
      <v-btn v-if="valert" color="red" dark @click="shutdown"
        >シャットダウン</v-btn
      >
    </v-row>
  </div>
</template>
<script>
import * as child from "child_process";
export default {
  data() {
    return {
      valert: false
    };
  },
  methods: {
    forceStop() {
      const command =
        `ssh debian@${this.$store.state.address} ` +
        `sh /home/debian/pulse/forceStop.sh`;
      const foo = child.exec(command, (error, stdout, stderr) => {
        if (error) {
          this.alive = false;
          console.error(stderr);
        } else {
          console.log(stdout);
          this.alive = true;
        }
      });
    },
    shutdown() {
      const command =
        `ssh debian@${this.$store.state.address} ` +
        `sh /home/debian/pulse/shutdown.sh`;
      const foo = child.exec(command, (error, stdout, stderr) => {
        if (error) {
          this.alive = false;
          console.error(stderr);
        } else {
          console.log(stdout);
          this.alive = true;
        }
      });
    }
  }
};
</script>
