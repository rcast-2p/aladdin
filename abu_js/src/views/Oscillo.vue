<template>
  <div>
    <v-row>
      <v-col cols="4">
        <v-text-field
          label="receiver address"
          v-model="config.receiver.address"
          outlined
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          label="receiver port"
          v-model="config.receiver.port"
          outlined
          type="number"
        />
      </v-col>
      <v-col cols="4">
        <v-btn @click="receiverConfig">receiver</v-btn>
      </v-col>
      <v-col cols="4">
        <v-text-field
          label="sender address"
          v-model="config.sender.address"
          outlined
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          label="receiver port"
          v-model="config.sender.port"
          outlined
          type="number"
        />
      </v-col>
      <v-col cols="4">
        <v-btn @click="senderConfig">sender</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-text-field
          label="udp port"
          v-model.number="config.receiver.udpPort"
          outlined
        />
      </v-col>
      <v-col cols="4">
        <v-text-field label="count" v-model.number="config.count" outlined />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <h3>receiver</h3>
        <v-data-table :headers="resultHeader" :items="resultItem" />
      </v-col>
      <v-col cols="6">
        <h3>sender</h3>
        <v-data-table :headers="resultHeader" :items="senderResults" />
      </v-col>
    </v-row>
  </div>
</template>
<script>
// import Worker from "worker-loader!../worker/sample.worker";
import axios from "@/plugins/axios";
export default {
  data() {
    return {
      config: {
        receiver: {
          address: "0.0.0.0",
          port: 8072,
          udpPort: 60000,
        },
        sender: {
          address: "192.168.2.104",
          port: 8072,
        },
        count: 4,
      },
      resultHeader: [
        { text: "command", value: "command" },
        { text: "returncode", value: "returncode" },
        { text: "stdout", value: "stdout" },
        { text: "stderr", value: "stderr" },
      ],
      resultItem: [],
      senderResults: [],
    };
  },
  computed: {
    recvBaseURL() {
      return `http://${this.config.receiver.address}:${this.config.receiver.port}`;
    },
    sendBaseURL() {
      return `http://${this.config.sender.address}:${this.config.sender.port}`;
    },
  },
  created() {
    if (localStorage.getItem("senderConfig")) {
      this.config = JSON.parse(localStorage.getItem("senderConfig"));
    }
  },
  methods: {
    async senderConfig() {
      const retval = await axios({
        baseURL: this.sendBaseURL,
        url: "oscillo",
        data: this.config,
      });
      console.log(retval.data);
      this.senderResults = retval.data.retarr;
      localStorage.setItem("senderConfig", JSON.stringify(this.config));
    },
    async receiverConfig() {
      const retval = await axios({
        baseURL: this.recvBaseURL,
        url: "gnuplot",
        data: this.config,
      });
      console.log(retval.data);
      this.resultItem = retval.data.retarr;
      localStorage.setItem("senderConfig", JSON.stringify(this.config));
    },
    memorize() {},
  },
};
</script>
