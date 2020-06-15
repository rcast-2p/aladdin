<template>
  <div>
    <v-autocomplete
      v-model="values"
      :items="items"
      dense
      chips
      small-chips
      label="Solo"
      multiple
      solo
    ></v-autocomplete>
    <v-btn @click="driverRegister">ドライバ登録</v-btn> {{ values }}
  </div>
</template>
<script>
import * as child from "child_process";
export default {
  data() {
    return {
      items: ["241", "172", "128", "76"],
      values: []
    };
  },
  methods: {
    driverRegister() {
      let keyString = "";
      for (const item of this.values) {
        keyString += `${item} `;
      }
      const command =
        `ssh debian@${this.$store.state.address} ` +
        `sh /home/debian/pulse/sample.sh ${keyString}`;
      child.exec(command, (error, stdout, stderr) => {
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
