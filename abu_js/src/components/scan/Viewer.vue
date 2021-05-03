<template>
  <div class="yellow lighten-4">
    <v-row no-gutters class="py-2">
      <v-btn @click="reset" :disabled="!workerOn">Reset</v-btn>
      <v-btn
        @click="webworkerStart"
        :disabled="workerOn"
        color="yellow lighten-2"
        >Worker Start</v-btn
      >
      <v-btn @click="receiverOnly" color="cyan darken-2" dark
        ><v-icon>mdi-record-rec</v-icon>receiver</v-btn
      >
      <v-btn @click="prudaqOnly" :loading="loading">PRUDAQ</v-btn>
      <v-btn @click="sendSignal(2)" dark color="indigo">SIGINT</v-btn>
      <v-btn @click="sendSignal(9)">SIGKILL</v-btn>
    </v-row>
    <v-row>
      <v-col cols="9">
        <div id="canmom">
          <canvas id="canvas" :style="canvasStyle"></canvas>
          <div class="roi" :style="roiStyle" />
        </div>
      </v-col>

      <v-col cols="3">
        max
        <span class="red--text text--darken-4 infofont">{{ info.maximum }}</span
        ><br />
        min
        <span class="red--text text--lighten-2 infofont">{{
          info.minimum
        }}</span
        ><br />
        ave
        <span class="pink--text text--darken-2 infofont">{{
          info.average
        }}</span
        ><br />
        z
        <span class="green--text text--darken-2 infofont">{{
          info.zIndex
        }}</span
        ><br />
        x0
        <span class="blue--text text--lighten-2 infofont">{{
          mouse.showPos[0]
        }}</span
        ><br />
        y0
        <span class="blue--text text--lighten-2 infofont">{{
          mouse.showPos[1]
        }}</span
        ><br />
        x1
        <span class="blue--text text--lighten-2 infofont">{{
          mouse.showPos[2]
        }}</span
        ><br />
        y1
        <span class="blue--text text--lighten-2 infofont">{{
          mouse.showPos[3]
        }}</span
        ><br />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="2">
        <v-text-field
          label="min"
          v-model.number="colormap.minimum"
          type="number"
          offset="9"
          cols="2"
          hide-details="auto"
          dense
        />
      </v-col>
      <v-col cols="6" offset="2">
        <v-btn @click="update">update</v-btn>
      </v-col>
      <v-col cols="2">
        <v-text-field
          label="max"
          v-model.number="colormap.maximum"
          type="number"
          hide-details="auto"
          dense
        />
      </v-col>
    </v-row>
    <show-color-map />
    <v-switch v-model="showRoiGraph" />
    <roi
      :average="info.average"
      :roiGeneration="roiGeneration"
      v-if="showRoiGraph"
    />
    <v-dialog v-model="dialog.show"
      ><v-card
        ><v-card-title>{{ dialog.title }}</v-card-title
        ><v-card-text
          ><v-textarea v-model="dialog.text" readonly /></v-card-text></v-card
    ></v-dialog>
  </div>
</template>
<script>
import Roi from "@/components/Roi.vue";
import ShowColorMap from "@/components/ShowColorMap.vue";
import AbuCommon from "@/assets/js/abu_common";
import axios from "@/plugins/axios";
import pack from "../../../package.json";

/**
 * @module components/scan/Viewer
 */
export default {
  components: { Roi, ShowColorMap },
  data() {
    return {
      mouse: {
        rawPos: [0, 0, 10, 10],
        showPos: [0, 0, 10, 10],
        state: 0, // 0 (UPPER LEFT) or 1 (LOWER RIGHT)
      },
      colormap: {
        maximum: 28160,
        minimum: 0,
      },
      loading: false,
      workerOn: false,
      worker: "",
      resultHeader: [
        { text: "command", value: "command" },
        { text: "returncode", value: "returncode" },
        { text: "stdout", value: "stdout" },
        { text: "stderr", value: "stderr" },
      ],
      resultItem: [],
      info: {
        maximum: 0,
        minimum: 0,
        average: 0,
        zIndex: 0,
      },
      showRoiGraph: false,
      dialog: { show: false, text: "", title: "" },
      roiGeneration: 0,
      roiStyle: {
        top: "20px",
        left: "20px",
        width: "200px",
        height: "100px",
      },
      canvasStyle: {
        width: `512px`,
        height: `512px`,
      },
    };
  },
  computed: {
    generation() {
      return this.$store.state.g.generation;
    },
  },
  watch: {
    generation() {
      this.$nextTick(() => {
        this.colormap = { ...this.$store.state.a.minMax };
      });
    },
  },
  methods: {
    getLatest() {
      return new Promise((resolve, reject) => {
        this.$store.state.d.db.commands
          .find({})
          .sort({ updatedAt: -1 })
          .limit(1)
          .exec((err, docs) => {
            if (err === null) {
              resolve(docs);
            } else {
              reject(err);
            }
          });
      });
    },
    async recordMinMax(dialog = false) {
      const docs = await this.getLatest();
      const { uuid } = docs[0];
      this.updateLatestMinMax(uuid, this.colormap, dialog);
    },

    updateLatestMinMax(uuid, minMax, dialog) {
      this.$store.state.d.db.commands.update(
        { uuid },
        { $set: { minMax } },
        (err, numReplaced) => {
          if (err === null && numReplaced === 1) {
            this.$emit("error-dialog", {
              title: `${uuid} scan complete`,
              show: dialog,
              text: `${uuid} scan has been completed.`,
            });
            this.$emit("load-commands-db");
          } else {
            this.$emit("error-dialog", {
              title: "db update error",
              show: true,
              text: JSON.stringify(err, null, "\t"),
            });
            console.error(err);
          }
        }
      );
    },

    /**
     * post request to /receiver
     * @param {number} signum
     */
    async sendSignal(signum) {
      const { receiver } = this.$store.state.a;
      const address = `http://${receiver.host}:${receiver.port}/receiver/signal`;
      const data = { signum };
      try {
        await axios.post(address, data);
      } catch (e) {
        this.$emit("error-dialog", {
          title: address,
          show: true,
          text: JSON.stringify(e, null, "\t"),
        });
        console.error(e);
      }
    },

    /**
     * post request to /receiver
     */
    async receiverOnly() {
      const { data, address } = await AbuCommon.createReceiverPostData(
        this.$store.state
      );
      data.apiVersion = pack.version;
      try {
        await axios.post(address, data);
        const { uuid } = data;
        await AbuCommon.register2Db(this.$store.state, "receiver", uuid);
        this.$emit("load-commands-db");
      } catch (e) {
        this.$emit("error-dialog", {
          title: address,
          show: true,
          text: JSON.stringify(e, null, "\t"),
        });
        console.error(e);
      }
    },
    async prudaqOnly() {
      /**
       * post request to /prudaq
       */
      const { data, address } = await AbuCommon.createPrudaqPostData(
        this.$store.state
      );
      try {
        await axios.post(address, data);
      } catch (e) {
        this.$emit("error-dialog", {
          title: address,
          show: true,
          text: JSON.stringify(e, null, "\t"),
        });
        console.error(e);
      }
    },
    update() {
      /**
       * send colormap to web worker (sample.js)
       */
      this.worker.postMessage(this.colormap);
      this.recordMinMax();
    },
    webworkerRefresh() {
      if (this.workerOn) {
        this.reset();
      }
      this.webworkerStart();
    },
    reset() {
      /**
       * terminate the web worker and reset canvas.
       */
      if (typeof this.worker !== "object") {
        return;
      }
      this.workerOn = false;
      this.worker.terminate();
      const oldcanv = document.getElementById("canvas");
      const canmom = document.getElementById("canmom");
      canmom.removeChild(oldcanv);

      const canv = document.createElement("canvas");
      canv.id = "canvas";
      canmom.appendChild(canv);
    },
    setCanvasPhysicalSize() {
      /**
       * called from webworkerStart()
       * @param {number} lengthX
       * @param {number} lengthY
       */

      const canvas = document.getElementById("canvas");
      const { lengthX, lengthY } = this.$store.state.a.scanConfig;
      let styleWidth = 512;
      let styleHeight = 512;
      if (lengthY < lengthX) {
        styleHeight = Math.round((styleWidth * lengthY) / lengthX);
      } else {
        styleWidth = Math.round((styleHeight * lengthX) / lengthY);
      }
      this.canvasStyle = {
        width: `${styleWidth}px`,
        height: `${styleHeight}px`,
      };
      canvas.style.width = `${styleWidth}px`;
      canvas.style.height = `${styleHeight}px`;
      return new Promise((resolve) => {
        this.$nextTick(() => {
          resolve(canvas);
        });
      });
    },
    /**
     * start a webworker and give canvas control to the web worker.
     * Also set up communicator with webworker.
     */
    async webworkerStart() {
      this.workerOn = true;
      const canvas = await this.setCanvasPhysicalSize();
      const { sizeX, sizeY } = this.$store.state.a.imageCalc;
      canvas.width = sizeX;
      canvas.height = sizeY;
      const offscreenCanvas = canvas.transferControlToOffscreen();
      this.worker = new Worker(`${process.env.VUE_APP_PUBLIC_PATH}/sample.js`);
      if (localStorage.getItem("colormap") === null) {
        // eslint-disable-next-line
        alert("localStorage colormap was undefined. Please set one colormap;");
        return;
      }

      // localStorage.setItem("scanConfig", JSON.stringify(this.config));
      this.worker.postMessage(
        {
          canvas: offscreenCanvas,
          width: sizeX,
          height: sizeY,
          colormap: JSON.parse(localStorage.getItem("colormap")),
          maximum: this.colormap.maximum,
          minimum: this.colormap.minimum,
        },
        // eslint-disable-next-line
        [offscreenCanvas]
      );
      this.worker.onmessage = (e) => {
        if (e.data === "end") {
          this.recordMinMax(true);
          this.$emit("load-commands-db");
          return;
        }
        this.info = {
          maximum: e.data.volMax,
          minimum: e.data.volMin,
          average: e.data.average,
          zIndex: e.data.zIndex + 1,
        };
        this.roiGeneration += 1;
      };

      canvas.addEventListener(
        "mousedown",
        (e) => {
          const rect = e.target.getBoundingClientRect();
          const xpos = this.mouse.state * 2 + 0;
          const ypos = this.mouse.state * 2 + 1;
          const xdoublepos = e.clientX - rect.left;
          const ydoublepos = e.clientY - rect.top;
          this.mouse.rawPos[xpos] = xdoublepos;
          this.mouse.rawPos[ypos] = ydoublepos;
          this.mouse.showPos[xpos] = (
            (xdoublepos / rect.width) *
            sizeX
          ).toFixed(0);
          this.mouse.showPos[ypos] = (
            (ydoublepos / rect.height) *
            sizeY
          ).toFixed(0);
          let sx;
          let sy;
          let sw;
          let sh;
          // if (this.mouse.state === 1) {
          if (this.mouse.rawPos[0] < this.mouse.rawPos[2]) {
            // eslint-disable-next-line
            sx = this.mouse.rawPos[0];
            sw = this.mouse.rawPos[2] - this.mouse.rawPos[0];
          } else {
            // eslint-disable-next-line
            sx = this.mouse.rawPos[2];
            sw = this.mouse.rawPos[0] - this.mouse.rawPos[2];
          }
          if (this.mouse.rawPos[1] < this.mouse.rawPos[3]) {
            // eslint-disable-next-line
            sy = this.mouse.rawPos[1];
            sh = this.mouse.rawPos[3] - this.mouse.rawPos[1];
          } else {
            // eslint-disable-next-line
            sy = this.mouse.rawPos[3];
            sh = this.mouse.rawPos[1] - this.mouse.rawPos[3];
          }
          this.roiStyle = {
            top: `${sy}px`,
            left: `${sx}px`,
            width: `${sw}px`,
            height: `${sh}px`,
          };
          sx = Math.floor((sx * canvas.width) / 512);
          sy = Math.floor((sy * canvas.height) / 512);
          sw = Math.floor((sw * canvas.width) / 512);
          sh = Math.floor((sh * canvas.height) / 512);
          if (sw === 0) {
            sw = 1;
          }
          if (sh === 0) {
            sh = 1;
          }
          this.worker.postMessage([sx, sy, sw, sh]);
          // }
          this.mouse.state = (this.mouse.state + 1) % 2;
        },
        // eslint-disable-next-line comma-dangle
        { passive: true }
      );
    },
  },
};
</script>
<style>
#canmom {
  position: relative;
}
#canvas {
  border: solid 1px black;
  width: 512px;
  height: 512px;
}
.infofont {
  font-size: 2rem;
}
.roi {
  position: absolute;
  border: solid 2px black;
}
</style>
