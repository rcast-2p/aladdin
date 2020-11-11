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
          <canvas id="canvas"></canvas>
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
          Math.floor(info.average)
        }}</span
        ><br />
        x0
        <span class="blue--text text--lighten-2 infofont">{{
          mouse.pos[0]
        }}</span
        ><br />
        y0
        <span class="blue--text text--lighten-2 infofont">{{
          mouse.pos[1]
        }}</span
        ><br />
        x1
        <span class="blue--text text--lighten-2 infofont">{{
          mouse.pos[2]
        }}</span
        ><br />
        y1
        <span class="blue--text text--lighten-2 infofont">{{
          mouse.pos[3]
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
        <v-btn @click="reflect">reflect</v-btn>
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
    <v-row no-gutters class="py-2">
      <v-col cols="1">UDP</v-col>
      <v-col cols="11">
        <v-row no-gutters>
          <v-col cols="3">
            <v-text-field
              label="udp port"
              v-model.number="udp.port"
              type="number"
              outlined
              hide-details="auto"
              dense
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="bufferSize"
              v-model.number="udp.bufferSize"
              type="number"
              suffix="byte"
              outlined
              hide-details="auto"
              dense
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="bufferNum"
              v-model.number="udp.bufferNum"
              type="number"
              outlined
              hide-details="auto"
              dense
            />
          </v-col>
          <v-col cols="3">
            <v-switch
              label="udp thread"
              v-model="udp.enabled"
              outlined
              dense
              disabled
              color="red darken-4"
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="inputFile"
              v-model="udp.inputFile"
              outlined
              hide-details="auto"
              dense
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="count"
              v-model.number="udp.count"
              outlined
              hide-details="auto"
              dense
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="home address"
              v-model.number="udp.homeAddress"
              outlined
              hide-details="auto"
              dense
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row no-gutters class="py-2">
      <v-col cols="1">Image</v-col>
      <v-col cols="11">
        <v-row no-gutters>
          <v-col cols="2">
            <v-text-field
              label="threshold"
              v-model.number="image.threshold"
              type="number"
              outlined
              hide-details="auto"
              dense
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="data channel"
              v-model.number="image.dataChan"
              type="number"
              outlined
              hide-details="auto"
              dense
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="file name"
              v-model.number="image.fileName"
              outlined
              hide-details="auto"
              dense
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              label="pixel max"
              v-model.number="image.pixelMax"
              outlined
              hide-details="auto"
              dense
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              label="pixel min"
              v-model.number="image.pixelMin"
              outlined
              hide-details="auto"
              dense
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2">WebSocket</v-col>
      <v-col cols="10">
        <v-row no-gutters>
          <v-col cols="3">
            <v-text-field
              label="address"
              v-model="websocket.address"
              outlined
              hide-details="auto"
              dense
              disabled
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="port"
              v-model.number="websocket.port"
              type="number"
              outlined
              hide-details="auto"
              dense
              disabled
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="interval (float)"
              v-model.number="websocket.interval"
              type="number"
              outlined
              hide-details="auto"
              suffix="msec"
              dense
            />
          </v-col>
          <v-col cols="3">
            <v-switch
              label="websocket thread"
              v-model="websocket.enabled"
              outlined
              dense
              color="red darken-4"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="2">raw data</v-col>
      <v-col cols="10">
        <v-row no-gutters>
          <v-col cols="3">
            <v-text-field
              label="raw data"
              v-model="fileSave.rawData"
              outlined
              hide-details="auto"
              dense
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="debug"
              v-model="fileSave.debug"
              outlined
              hide-details="auto"
              dense
            />
          </v-col>
          <v-col cols="3">
            <v-switch
              label="png save"
              v-model="fileSave.pngSave"
              outlined
              dense
            />
          </v-col>
          <v-col cols="3">
            <v-switch
              label="tiff save"
              v-model="fileSave.tiffSave"
              outlined
              dense
            />
          </v-col>
          <v-col cols="3">
            <v-switch
              label="raw data save"
              v-model="fileSave.rawDataSave"
              outlined
              dense
            />
          </v-col>
          <v-col cols="3">
            <v-switch
              label="save thread"
              v-model="fileSave.enabled"
              outlined
              dense
              disabled
              color="red darken-4"
            />
          </v-col>
          <v-col cols="3">
            <v-switch
              label="verbosity"
              v-model="verbosity"
              outlined
              dense
              color="blue darken-4"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="2">Servers</v-col>
      <v-col cols="10">
        <v-row no-gutters>
          <v-col cols="3">
            <v-text-field
              label="BBB address"
              v-model="prudaq.address"
              outlined
              hide-details="auto"
              dense
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="BBB port"
              v-model="prudaq.port"
              outlined
              hide-details="auto"
              dense
              type="number"
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="receiver address"
              v-model="receiver.address"
              outlined
              hide-details="auto"
              dense
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="receiver port"
              v-model="receiver.port"
              outlined
              hide-details="auto"
              dense
              type="number"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table :headers="resultHeader" :items="resultItem">
          <template v-slot:[`item.stderr`]="{ item }">
            <span class="red--text">{{ item.stderr }}</span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row no-gutters class="py-2">
      <v-btn @click="prudaqOnly" :loading="loading">PRUDAQ</v-btn>
      <v-btn @click="sendSignal(2)" dark color="indigo">SIGINT</v-btn>
      <v-btn @click="sendSignal(9)">SIGKILL</v-btn>
      <v-btn @click="showPs">PS</v-btn>
      <v-btn @click="clearStorage">clear recvMemory</v-btn>
    </v-row>
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
import axios from "@/plugins/axios";
import Roi from "@/components/Roi.vue";
import ShowColorMap from "@/components/ShowColorMap.vue";

export default {
  props: { config: Object, imgWidth: Number },
  components: { Roi, ShowColorMap },
  data() {
    return {
      mouse: {
        pos: [0, 0, 10, 10],
        state: 0,
      },
      colormap: {
        maximum: 1023,
        minimum: 0,
        maxauto: false,
        minauto: false,
      },
      loading: false,
      udp: {
        port: 60000,
        bufferSize: 64020,
        count: 0,
        bufferNum: 4096,
        enabled: true,
        inputFile: "",
        homeAddress: "192.168.2.100",
      },
      image: {
        width: this.imgWidth,
        height: this.config.yFSteps,
        threshold: 0,
        refactoryPeriod: 0,
        dataChan: 0,
        fileName: "",
        pixelMax: -1,
        pixelMin: 32767,
      },
      websocket: {
        address: "0.0.0.0",
        port: 8072,
        interval: 100.0,
        enabled: true,
      },
      fileSave: {
        rawData: "octo_test/",
        rawDataSave: false,
        debug: "octo_test/",
        pngSave: false,
        tiffSave: false,
        enabled: true,
      },
      verbosity: false,
      prudaq: {
        address: "192.168.2.104",
        port: 8070,
      },
      receiver: {
        address: "0.0.0.0",
        port: 8070,
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
      description: "",
      info: {
        maximum: 0,
        minimum: 0,
        average: 0,
      },
      showRoiGraph: true,
      roiStyle: {
        top: "20px",
        left: "20px",
        width: "200px",
        height: "100px",
      },
      dialog: { show: false, text: "", title: "" },
      count: 0,
    };
  },
  mounted() {
    const recvConfigText = localStorage.getItem("recvConfig") || null;
    if (recvConfigText) {
      const recvConfig = JSON.parse(recvConfigText);
      this.udp = recvConfig.udp;
      this.image = recvConfig.image;
      this.fileSave = recvConfig.fileSave;
      this.websocket = recvConfig.websocket;
      this.verbosity = recvConfig.verbosity;
      this.description = recvConfig.description;
    }
  },
  computed: {
    recvBaseURL() {
      return `http://${this.receiver.address}:${this.receiver.port}`;
    },
    prudaqURL() {
      return `http://${this.prudaq.address}:${this.prudaq.port}`;
    },
  },
  methods: {
    reflect() {
      this.worker.postMessage(this.colormap);
    },
    getDateString() {
      const da = new Date();
      const hashLetter0 = String.fromCharCode((da.getTime() % 26) + 97);
      const hashLetter1 = String.fromCharCode((da.getSeconds() % 26) + 97);
      const day =
        da.getFullYear() * 10000 + (da.getMonth() + 1) * 100 + da.getDate();
      const time =
        1000000 +
        da.getHours() * 10000 +
        da.getMinutes() * 100 +
        da.getSeconds();
      const timeStr = String(time).slice(1);
      return `${hashLetter0}${hashLetter1}${day}-${timeStr}`;
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
      const canvas = document.getElementById("canvas");
      console.log(this.config);
      const { imgWidth } = this;
      canvas.width = imgWidth;
      canvas.height = this.config.scanYLength / this.config.yFResolution;

      const offscreenCanvas = canvas.transferControlToOffscreen();
      this.worker = new Worker("/sample.js");
      console.log(typeof this.worker);

      localStorage.setItem("scanConfig", JSON.stringify(this.config));
      this.worker.postMessage(
        {
          canvas: offscreenCanvas,
          width: imgWidth,
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
        };
        this.count += 1;
      };

      canvas.addEventListener("mousedown", (e) => {
        const rect = e.target.getBoundingClientRect();
        const xpos = this.mouse.state * 2 + 0;
        const ypos = this.mouse.state * 2 + 1;
        const xdoublepos = e.clientX - rect.left;
        const ydoublepos = e.clientY - rect.top;
        this.mouse.pos[xpos] = xdoublepos;
        this.mouse.pos[ypos] = ydoublepos;
        let sx;
        let sy;
        let sw;
        let sh;
        if (this.mouse.state === 1) {
          if (this.mouse.pos[0] < this.mouse.pos[2]) {
            // eslint-disable-next-line
            sx = this.mouse.pos[0];
            sw = this.mouse.pos[2] - this.mouse.pos[0];
          } else {
            // eslint-disable-next-line
            sx = this.mouse.pos[2];
            sw = this.mouse.pos[0] - this.mouse.pos[1];
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
        }
        this.mouse.state = (this.mouse.state + 1) % 2;
      });
    },
    prudaqServe(uuid) {
      this.loading = true;
      const { bufferSize } = this.udp;
      return axios({
        baseURL: this.prudaqURL,
        url: "prudaq",
        data: {
          address: this.udp.homeAddress,
          udpPort: this.udp.port,
          count: this.udp.count,
          bufferSize,
          uuid,
        },
      });
    },
    async prudaqOnly() {
      const uuid = this.getDateString();
      try {
        const retval = await this.prudaqServe(uuid);
        console.log(retval.data);
        this.resultItem = retval.data.retarr;
      } catch (e) {
        console.error(e);
        this.dialog = {
          title: "prudaq api error",
          text: JSON.stringify(e, null, "\t"),
          show: true,
        };
      } finally {
        this.loading = false;
      }
    },
    async receiverOnly() {
      const uuid = this.getDateString();
      try {
        const retval = await this.receiverConfig(uuid);
        console.log(retval.data);
        this.resultItem = retval.data.retarr;
      } catch (e) {
        console.error(e);
        this.dialog = {
          title: "receiver api error",
          text: JSON.stringify(e, null, "\t"),
          show: true,
        };
      } finally {
        this.loading = false;
      }
    },
    receiverConfig(uuid) {
      const { udp, image, fileSave, websocket, verbosity, description } = this;
      image.width = this.imgWidth;
      image.height = this.config.yFSteps;
      image.xFSteps = this.config.xFSteps;
      image.yFSteps = this.config.yFSteps;
      image.zPages =
        this.config.zFSteps *
        this.config.xyRepeatNum *
        this.config.xyzRepeatNum;
      const data = {
        udp,
        image,
        fileSave,
        websocket,
        uuid,
        verbosity,
        description,
      };
      localStorage.setItem("recvConfig", JSON.stringify(data));
      return axios({
        baseURL: this.recvBaseURL,
        url: "receiver",
        data,
      });
    },
    async sendSignal(signum) {
      const retval = await axios({
        baseURL: this.recvBaseURL,
        url: "receiver/signal",
        data: { signum },
      });
      console.log(retval.data);
      this.resultItem = retval.data.retarr;
      this.dialog = {
        title: "signal",
        text: `singal ${signum}`,
        show: true,
      };
    },
    async showPs() {
      const retval = await axios({
        baseURL: this.recvBaseURL,
        url: "receiver/ps",
        data: {},
      });
      console.log(retval.data);
      this.resultItem = retval.data.retarr;
      this.dialog = {
        title: "ps receiver_main",
        text: JSON.stringify(this.resultItem),
        show: true,
      };
    },
    clearStorage() {
      localStorage.removeItem("recvConfig");
      this.dialog = {
        title: "localStorage.recvConfig",
        text: "cleared",
        show: true,
      };
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
