<template>
  <div class="home">
    <v-row>
      <v-col cols="3" v-for="(pruEle, pruInd) in pru" :key="pruInd">
        <v-switch
          :label="pruEle.name"
          @click="pruOnOff(pruInd)"
          v-model="pruEle.power"
          :loading="pruEle.loading"
          color="red"
        ></v-switch>
        {{ pruEle.assigned }}
      </v-col>
    </v-row>
    pru
  </div>
</template>

<script>
// @ is an alias to /src

import { exec } from "child_process";
export default {
  name: "pru",
  data() {
    return {
      pru: [
        {
          name: "pru1_0",
          power: false,
          assigned: "pru10program",
          loading: false,
        },
        {
          name: "pru1_1",
          power: false,
          assigned: "pru10program",
          loading: false,
        },
        {
          name: "pru2_0",
          power: false,
          assigned: "pru10program",
          loading: false,
        },
        {
          name: "pru2_1",
          power: false,
          assigned: "pru10program",
          loading: false,
        },
      ],
    };
  },
  methods: {
    pruOnOff(pruInd) {
      this.pru[pruInd]["loading"] = "warning";

      //const command = `ssh debian@192.168.0.65 hostname -I`;
      const command = `ls -alt`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(stderr);
          this.pru[pruInd]["loading"] = false;
        } else {
          console.log(stdout);
          this.pru[pruInd]["loading"] = false;
          this.pru[pruInd]["power"] = !this.pru[pruInd]["power"];
        }
      });
      // setTimeout(() => {
      //   this.pru[pruInd]["loading"] = false;
      // }, 2000);
    },
  },
};
</script>
