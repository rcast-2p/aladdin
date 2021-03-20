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
      <v-btn @click="receiverOnly" color="cyan darken-2" dark>receiver</v-btn>
      <v-btn @click="prudaqOnly" :loading="loading">PRUDAQ</v-btn>
      <v-text-field
        v-model="description"
        placeholder="description"
        outlined
        dense
        hide-details="auto"
      />
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
    <roi :average="info.average" :count="count" v-if="showRoiGraph" />
    <v-dialog v-model="dialog.show"
      ><v-card
        ><v-card-title>{{ dialog.title }}</v-card-title
        ><v-card-text
          ><v-textarea v-model="dialog.text" readonly /></v-card-text></v-card
    ></v-dialog>
  </div>
</template>
<script>
// import Worker from "worker-loader!../worker/sample.worker";
import Roi from "@/components/Roi.vue";
import ShowColorMap from "@/components/ShowColorMap.vue";
import AbuCommon from "@/assets/js/abu_common";
import axios from "@/plugins/axios";

export default {
  props: {
    sizeX: Number,
    sizeY: Number,
    lengthY: Number,
    zPageNum: Number,
    packetNum: Number,
    xFSteps: Number,
  },
  components: { Roi, ShowColorMap },
  data() {
    return {
      mouse: {
        pos: [0, 0, 10, 10],
        showPos: [0, 0, 10, 10],
        state: 0,
      },
      colormap: {
        maximum: 28160,
        minimum: 0,
        maxauto: false,
        minauto: false,
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
      description: "",
      info: {
        maximum: 0,
        minimum: 0,
        average: 0,
        zIndex: 0,
      },
      showRoiGraph: false,
      roiStyle: {
        top: "20px",
        left: "20px",
        width: "200px",
        height: "100px",
      },
      dialog: { show: false, text: "", title: "" },
      count: 0,
      canvasStyle: {
        width: `512px`,
        height: `512px`,
      },
    };
  },
  mounted() {},
  computed: {
    recvBaseURL() {
      return `http://${this.receiver.host}:${this.receiver.port}`;
    },
    prudaqURL() {
      return `http://${this.prudaq.host}:${this.prudaq.port}`;
    },
  },
  methods: {
    async receiverOnly() {
      const { data, address } = await AbuCommon.createReceiverPostData(
        this.$store.state
      );
      try {
        await axios.post(address, data);
        const { uuid } = data;
        const newDoc = await AbuCommon.register2Db(this.$store.state, uuid);
        console.log(newDoc);
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
      this.worker.postMessage(this.colormap);
    },
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
      let styleWidth = 512;
      let styleHeight = 512;

      if (this.lengthY < this.sizeX) {
        styleHeight = Math.round((styleWidth * this.lengthY) / this.sizeX);
      } else {
        styleWidth = Math.round((styleHeight * this.sizeX) / this.lengthY);
      }
      this.canvasStyle = {
        width: `${styleWidth}px`,
        height: `${styleHeight}px`,
      };
      const canvas = document.getElementById("canvas");
      const { sizeX, sizeY } = this;
      canvas.width = sizeX;
      canvas.height = sizeY;
      const offscreenCanvas = canvas.transferControlToOffscreen();
      this.worker = new Worker("/sample.js");
      if (localStorage.getItem("colormap") === undefined) {
        // eslint-disable-next-line
        alert("localStorage colormap was undefined. Please set one colormap;");
        return;
      }

      // localStorage.setItem("scanConfig", JSON.stringify(this.config));
      this.worker.postMessage(
        {
          canvas: offscreenCanvas,
          width: sizeX,
          height: canvas.height,
          colormap: JSON.parse(localStorage.getItem("colormap")),
          maximum: this.colormap.maximum,
          minimum: this.colormap.minimum,
        },
        // eslint-disable-next-line
        [offscreenCanvas]
      );
      this.worker.onmessage = (e) => {
        this.info = {
          maximum: e.data.volMax,
          minimum: e.data.volMin,
          average: e.data.average,
          zIndex: e.data.zIndex,
        };
        this.count += 1;
      };

      canvas.addEventListener(
        "mousedown",
        (e) => {
          const rect = e.target.getBoundingClientRect();
          const xpos = this.mouse.state * 2 + 0;
          const ypos = this.mouse.state * 2 + 1;
          const xdoublepos = e.clientX - rect.left;
          const ydoublepos = e.clientY - rect.top;
          this.mouse.pos[xpos] = xdoublepos;
          this.mouse.pos[ypos] = ydoublepos;
          this.mouse.showPos[xpos] = (
            (xdoublepos / rect.width) *
            this.sizeX
          ).toFixed(0);
          this.mouse.showPos[ypos] = (
            (ydoublepos / rect.height) *
            this.lengthY
          ).toFixed(0);
          let sx;
          let sy;
          let sw;
          let sh;
          // if (this.mouse.state === 1) {
          if (this.mouse.pos[0] < this.mouse.pos[2]) {
            // eslint-disable-next-line
            sx = this.mouse.pos[0];
            sw = this.mouse.pos[2] - this.mouse.pos[0];
          } else {
            // eslint-disable-next-line
            sx = this.mouse.pos[2];
            sw = this.mouse.pos[0] - this.mouse.pos[2];
          }
          if (this.mouse.pos[1] < this.mouse.pos[3]) {
            // eslint-disable-next-line
            sy = this.mouse.pos[1];
            sh = this.mouse.pos[3] - this.mouse.pos[1];
          } else {
            // eslint-disable-next-line
            sy = this.mouse.pos[3];
            sh = this.mouse.pos[1] - this.mouse.pos[3];
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
