<template>
  <div>
    <v-row>
      <v-col cols="4">
        <v-text-field
          label="BB address"
          v-model="config.receiver.address"
          outlined
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          label="BB port"
          v-model="config.receiver.port"
          outlined
          type="number"
        />
      </v-col>
      <v-col cols="4">
        <v-btn @click="reset" :disabled="!workerOn">Reset</v-btn>
        <v-btn @click="webworkerStart" :disabled="workerOn">Worker Start</v-btn>
        <v-btn @click="receiverConfig">receiver</v-btn>
        <v-btn @click="sendSignal(2)">sigint</v-btn>
        <v-btn @click="sendSignal(9)">sigkill</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-text-field label="width" v-model.number="config.width" outlined />
      </v-col>
      <v-col cols="4">
        <v-text-field label="height" v-model.number="config.height" outlined />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-switch label="verbosity" v-model="config.verbosity" />
      </v-col>
      <v-col cols="4">
        <v-text-field label="count" v-model.number="config.count" outlined />
      </v-col>
      <v-col cols="4">
        <v-text-field label="bufnum" v-model.number="config.bufnum" outlined />
      </v-col>
      <v-col cols="4">
        <v-text-field label="max" v-model.number="config.max" outlined />
      </v-col>
      <v-col cols="4">
        <v-text-field label="min" v-model.number="config.min" outlined />
      </v-col>
      <v-col cols="4">
        <v-text-field
          label="retSteps"
          v-model.number="config.retSteps"
          outlined
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          label="dataChan"
          v-model.number="config.dataChan"
          outlined
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          label="threshold"
          v-model.number="config.threshold"
          outlined
        />
      </v-col>
      <v-col cols="4">
        <v-switch label="img rebuild (no save)" v-model="config.imgRebuild" />
      </v-col>
    </v-row>
    <div id="canmom">
      <canvas id="canvas"></canvas>
    </div>
    <v-row>
      <v-col cols="12">
        <v-data-table :headers="resultHeader" :items="resultItem" />
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
        width: 20,
        height: 20,
        receiver: {
          address: "0.0.0.0",
          port: 8072,
        },
        count: 10000,
        bufnum: 15,
        verbosity: true,
        min: -1,
        max: -1,
        retSteps: 1,
        dataChan: 0,
        threshold: 100,
        imgRebuild: false,
      },
      workerOn: false,
      worker: "",
      resultHeader: [
        { text: "command", value: "command" },
        { text: "returncode", value: "returncode" },
        { text: "stdout", value: "stdout" },
        { text: "stderr", value: "stderr" },
      ],
      resultItem: [],
    };
  },
  computed: {
    recvBaseURL() {
      return `http://${this.config.receiver.address}:${this.config.receiver.port}`;
    },
  },
  methods: {
    reset() {
      if (typeof this.worker === "object") {
        this.workerOn = !this.workerOn;
        this.worker.terminate();
        const oldcanv = document.getElementById("canvas");
        const canmom = document.getElementById("canmom");
        canmom.removeChild(oldcanv);

        const canv = document.createElement("canvas");
        canv.id = "canvas";
        canmom.appendChild(canv);
      }
    },
    webworkerStart() {
      this.workerOn = !this.workerOn;
      const canvas = document.getElementById("canvas");
      canvas.width = this.config.width;
      canvas.height = this.config.height;
      const offscreenCanvas = canvas.transferControlToOffscreen();
      this.worker = new Worker("/sample.js");
      console.log(typeof this.worker);
      this.worker.postMessage(
        { canvas: offscreenCanvas, width: this.config.width },
        // eslint-disable-next-line
        [offscreenCanvas]
      );
      this.worker.onmessage = (e) => {
        console.log(e.data);
      };
    },
    async receiverConfig() {
      const retval = await axios({
        baseURL: this.recvBaseURL,
        // baseURL: "http://localhost:8101/tms/send/",
        url: "config",
        // url: "contract_detail.php",
        data: this.config,
      });
      console.log(retval.data);
      this.resultItem = retval.data.retarr;
    },
    async sendSignal(signum) {
      const retval = await axios({
        baseURL: this.recvBaseURL,
        // baseURL: "http://localhost:8101/tms/send/",
        url: "signal",
        // url: "contract_detail.php",
        data: { signum },
      });
      console.log(retval.data);
      this.resultItem = retval.data.retarr;
    },
  },
};
</script>
<style>
#canvas {
  border: solid 1px black;
  width: 512px;
  height: 512px;
}
</style>
