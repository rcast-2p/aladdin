<template>
  <div>
    <h1>Stage Scan</h1>
    <v-row>
      <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
        <v-tabs v-model="tab">
          <v-tab href="#camera"> camera </v-tab>
          <v-tab href="#scan"> scan </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item value="camera">
            <camera-pos />
          </v-tab-item>
          <v-tab-item value="scan">
            <move-ctrl
              ref="move"
              :config="{ sCom, sSpeed, pinConfig, sReso }"
              :bbBaseURL="bbBaseURL"
            />
            <v-row no-gutters class="py-2">
              <stop-ctrl
                ref="ctrl"
                :config="{ sCom, sSpeed, pinConfig }"
                :bbBaseURL="bbBaseURL"
              />
              <v-btn @click="scanOnly" dark color="green" :loading="loading"
                >Scan Only</v-btn
              >
              <v-btn
                @click="scanNReceive"
                dark
                color="green darken-4"
                :loading="loading"
                >Start</v-btn
              >
            </v-row>
            <v-row no-gutters class="py-2">
              <v-col cols="1">space </v-col>
              <v-col cols="11">
                <v-row no-gutters>
                  <v-col cols="2" v-for="(_, sI) in sLength" :key="sI">
                    <v-text-field
                      :label="sI"
                      v-model.number="sLength[sI]"
                      suffix="um"
                      type="number"
                      outlined
                      hide-details="auto"
                      dense
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row no-gutters class="py-2">
              <v-col cols="1">time</v-col>
              <v-col cols="11">
                <v-row no-gutters>
                  <v-col cols="3">
                    <v-text-field
                      label="xy repeat num"
                      v-model.number="sCom.xyRepeatNum"
                      type="number"
                      outlined
                      hide-details="auto"
                      dense
                    />
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      label="xyz repeat num"
                      v-model.number="sCom.xyzRepeatNum"
                      type="number"
                      outlined
                      hide-details="auto"
                      dense
                      readonly
                    />
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      label="aom open us"
                      v-model.number="sCom.aomOpenUs"
                      suffix="us"
                      outlined
                      type="number"
                      hide-details="auto"
                      dense
                    />
                  </v-col>
                  <v-col cols="3" v-for="(_, sI) in sSpeed" :key="sI">
                    <v-text-field
                      :label="sI + ' speed / pixel dwell time'"
                      v-model.number="sSpeed[sI]"
                      suffix="us"
                      outlined
                      type="number"
                      hide-details="auto"
                      dense
                    />
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      label="sampling rate"
                      v-model.number="config.samplingRate"
                      suffix="MHz"
                      outlined
                      type="number"
                      hide-details="auto"
                      dense
                    /> </v-col
                ></v-row>
              </v-col>
            </v-row>
            <v-row>
              <ul>
                <li
                  v-for="(scanOverviewE, scanOverviewI) in scanOverview"
                  :key="scanOverviewI"
                >
                  {{ scanOverviewE }}
                </li>
              </ul>
            </v-row>
            <aom
              ref="aom"
              :config="{ sCom, sSpeed, pinConfig }"
              :bbBaseURL="bbBaseURL"
            />
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header
                  >other configuration</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <h2>resolution & invert</h2>
                  <v-row>
                    <v-col cols="3" v-for="(_, sI) in sReso" :key="sI">
                      <v-select
                        :label="sI"
                        v-model="sReso[sI]"
                        :items="resolutionOptions"
                        outlined
                        hide-details="auto"
                        dense
                      />
                    </v-col>
                    <v-col cols="3">
                      <v-select
                        label="invert"
                        v-model.number="sCom.invert"
                        :items="invertOptions"
                        type="number"
                        outlined
                        hide-details="auto"
                        dense
                      />
                    </v-col>
                    <v-col cols="3">
                      <v-select
                        label="aom open"
                        :items="[
                          { text: 'high', value: 1 },
                          { text: 'low', value: 0 },
                        ]"
                        v-model.number="sCom.aomOpenHl"
                        outlined
                        type="number"
                        hide-details="auto"
                        dense
                      />
                    </v-col>
                  </v-row>
                  <h2>pin & address</h2>
                  <v-row>
                    <v-col
                      v-for="(pin, pkey) in pinConfig"
                      :key="pkey"
                      cols="2"
                    >
                      <v-text-field
                        :label="pin.name"
                        type="number"
                        v-model.number="pin.value"
                        hide-details="auto"
                        dense
                        outlined
                      />
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        label="BBAI address"
                        v-model="bbai.address"
                        hide-details="auto"
                        dense
                        outlined
                      />
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        label="BBAI port"
                        v-model.number="bbai.port"
                        hide-details="auto"
                        dense
                        outlined
                        type="number"
                      />
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <v-row no-gutters class="py-2">
              <v-col cols="12">
                <v-data-table :headers="resultHeader" :items="resultItem">
                  <template v-slot:[`item.stderr`]="{ item }">
                    <span class="red--text">{{ item.stderr }}</span>
                  </template>
                </v-data-table>
              </v-col>
              <v-col cols="12">
                <v-btn @click="clearStorage" color="red darken-4" dark
                  >clear scanMemory</v-btn
                >
                <v-btn @click="saveStorage" color="blue darken-4" dark
                  >save</v-btn
                >
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
      <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
        <viewer
          ref="viewer"
          :config="config"
          :sizeX="sizeX"
          :sizeY="sizeY"
          :lengthY="sLength.scanYLength"
          :zPageNum="zPageNum"
          :xFSteps="xFSteps"
          :packetNum="packetNum"
        />
      </v-col>
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
import MoveCtrl from "@/components/Move.vue";
import StopCtrl from "@/components/Stop.vue";
import CameraPos from "@/components/CameraPos.vue";
import axios from "@/plugins/axios";
import Viewer from "@/components/Viewer.vue";
import Aom from "@/components/Aom.vue";
import AbuCommon from "@/assets/js/abu_common";

export default {
  data() {
    return {
      resultItem: [],
      resultHeader: [
        { text: "command", value: "command" },
        { text: "returncode", value: "returncode" },
        { text: "stdout", value: "stdout" },
        { text: "stderr", value: "stderr" },
      ],
      tab: null,
      bbai: {
        address: "192.168.2.101",
        port: 8070,
      },
      sCom: {
        invert: 1,
        aomOpenUs: 1.0,
        aomOpenHl: 1,
        xyRepeatNum: 1,
        xyzRepeatNum: 1,
      },
      sSpeed: {
        x: 500,
        y: 500,
        z: 500,
      },
      sLength: {
        scanXLength: 100,
        scanYLength: 100,
        yPrevEveryLength: 5,
        scanZLength: 100,
        scanZELength: 100,
      },
      sReso: {
        xFResolution: 1.0,
        xBResolution: 1.0,
        yFResolution: 1.0,
        yBResolution: 1.0,
        zFResolution: 1.0,
        zBResolution: 1.0,
      },
      config: {
        samplingRate: 6.25,
      },
      pinConfig: [
        { name: "plsPin1", value: 1 },
        { name: "dirPin1", value: 2 },
        { name: "plsPin2", value: 3 },
        { name: "dirPin2", value: 4 },
        { name: "plsPin3", value: 5 },
        { name: "dirPin3", value: 6 },
        { name: "aomPin", value: 7 },
        { name: "aomRef", value: 8 },
      ],
      resolutionOptions: [
        { text: "0.2 um (10 div 6)", value: 0.2 },
        { text: "0.25 um (8 div 5)", value: 0.25 },
        { text: "0.4 um (5 div 4)", value: 0.4 },
        { text: "0.5 um (4 div 3)", value: 0.5 },
        { text: "0.8 um (2.5 div 2)", value: 0.8 },
        { text: "1.0 um (2 div 1)", value: 1.0 },
        { text: "2.0 um (1 div 0)", value: 2.0 },
      ],
      invertOptions: [
        { text: "false", value: 0 },
        { text: "true", value: 1 },
      ],
      loading: false,
      dialog: { show: false, text: "", title: "" },
    };
  },
  computed: {
    sizeX() {
      return this.sLength.scanXLength;
    },
    sizeY() {
      return this.sLength.scanYLength / this.sLength.yPrevEveryLength;
    },
    zPageNum() {
      return this.zFPlaneNum * this.sCom.xyRepeatNum * this.sCom.xyzRepeatNum;
    },
    onePlaneDuration() {
      const onePlaneXPulseNum = (this.xFSteps + this.xBSteps) * this.yFSteps;

      return (
        (onePlaneXPulseNum * this.sSpeed.x +
          (this.yFSteps * this.yPrevEverySteps + this.yBSteps) *
            this.sSpeed.y) /
        1000
      );
    },
    packetNum() {
      const zMoveDuration =
        ((this.zFSteps + this.zBSteps) * this.sSpeed.z) / 1000;
      const totalDuration =
        (this.onePlaneDuration * this.sCom.xyRepeatNum * this.zPageNum +
          zMoveDuration) *
        this.sCom.xyzRepeatNum;
      const packets = (totalDuration * this.config.samplingRate * 1000) / 16000;
      const packetPlus = (
        (5000 * this.config.samplingRate * 1000) / 16000 +
        packets
      ).toFixed(0);
      return Number(packetPlus);
    },
    scanOverview() {
      const {
        xFSteps,
        xBSteps,
        yFSteps,
        yBSteps,
        yPrevEverySteps,
        zFSteps,
        zBSteps,
      } = this;
      const zMoveDuration = ((zFSteps + zBSteps) * this.sSpeed.z) / 1000;
      const totalDuration =
        (this.onePlaneDuration * this.sCom.xyRepeatNum * this.zPageNum +
          zMoveDuration) *
        this.sCom.xyzRepeatNum;
      const totalMin = (totalDuration / 60000).toFixed(1);
      const packets = (totalDuration * this.config.samplingRate * 1000) / 16000;
      return [
        `single xy: ((${xFSteps}+${xBSteps}) x ${yFSteps} x ${this.sSpeed.x} + (${yPrevEverySteps} x ${yFSteps}+ ${yBSteps})x ${this.sSpeed.y}) / 1000=${this.onePlaneDuration} ms`,
        `z plane num: ${this.zPageNum} (${this.zFPlaneNum})`,
        `      total: (${this.onePlaneDuration} x ${this.sCom.xyRepeatNum} x ${this.zPageNum} + ${zMoveDuration}) x ${this.sCom.xyzRepeatNum} =  ${totalDuration} ms (${totalMin} min)`,
        `${packets.toFixed(1)} packets (${this.packetNum}) `,
      ];
    },
    bbBaseURL() {
      return `http://${this.bbai.address}:${this.bbai.port}`;
    },
    xFSteps() {
      return this.sLength.scanXLength / this.sReso.xFResolution;
    },
    xBSteps() {
      return this.sLength.scanXLength / this.sReso.xBResolution;
    },
    yFSteps() {
      return this.sLength.scanYLength / this.sLength.yPrevEveryLength;
    },
    yBSteps() {
      return this.sLength.scanYLength / this.sReso.yBResolution;
    },
    yPrevEverySteps() {
      return this.sLength.yPrevEveryLength / this.sReso.yFResolution;
    },
    zFSteps() {
      return this.sLength.scanZLength / this.sReso.zFResolution;
    },
    zBSteps() {
      return this.sLength.scanZLength / this.sReso.zBResolution;
    },
    zFESteps() {
      return this.sLength.scanZELength / this.sReso.zFResolution;
    },
    zFPlaneNum() {
      return this.sLength.scanZLength / this.sLength.scanZELength;
    },
  },
  created() {
    if (localStorage.getItem("abuConfig")) {
      this.loadStorage(JSON.parse(localStorage.getItem("abuConfig")));
    }
  },
  methods: {
    loadStorage(storage) {
      Object.keys(storage.scanner).forEach((key) => {
        Object.keys(storage.scanner[key]).forEach((key2) => {
          if (this[key][key2] !== undefined) {
            this[key][key2] = storage.scanner[key][key2];
          }
        });
      });
    },
    saveStorage() {
      const saveData = {
        viewer: {
          udp: this.$refs.viewer.udp,
          image: this.$refs.viewer.image,
          websocket: this.$refs.viewer.websocket,
          fileSave: this.$refs.viewer.fileSave,
          verbosity: this.$refs.viewer.verbosity,
          prudaq: this.$refs.viewer.prudaq,
          receiver: this.$refs.viewer.receiver,
        },
        scanner: {
          config: this.config,
          pinConfig: this.pinConfig,
          bbai: this.bbai,
          sCom: this.sCom,
          sSpeed: this.sSpeed,
          sLength: this.sLength,
          sReso: this.sReso,
        },
      };
      localStorage.setItem("abuConfig", JSON.stringify(saveData));
    },
    async scanNReceive() {
      const uuid = AbuCommon.getDateString();
      const sendData = this.createScanSendData(0.5);
      try {
        const retvals = await Promise.all([
          this.scan2BBAI(uuid, sendData),
          this.$refs.viewer.receiverConfig(uuid, sendData),
          this.$refs.viewer.prudaqServe(uuid),
        ]);
        console.log(retvals);
        this.resultItem = [
          ...retvals[0].data.retarr,
          ...retvals[1].data.retarr,
          ...retvals[2].data.retarr,
        ];
      } catch (e) {
        console.error(e);
        this.dialog.title = "scanNreceive api error";
        this.dialog.text = JSON.stringify(e, null, "\t");
        this.dialog.show = true;
      } finally {
        this.loading = false;
        this.$refs.viewer.loading = false;
      }
      this.$refs.viewer.webworkerStart();
    },
    async scanOnly() {
      const uuid = AbuCommon.getDateString();
      const sendData = this.createScanSendData(0);
      try {
        const retval = await this.scan2BBAI(uuid, sendData);
        this.resultItem = retval.data.retarr;
      } catch (e) {
        console.error(e);
        this.dialog.title = "scan api error";
        this.dialog.text = JSON.stringify(e, null, "\t");
        this.dialog.show = true;
      } finally {
        this.loading = false;
      }
    },
    createScanSendData(delay) {
      const sendC = {};
      sendC.lengthX = this.sLength.scanXLength;
      sendC.lengthY = this.sLength.scanYLength;
      sendC.xFSteps = this.xFSteps;
      sendC.xBSteps = this.xBSteps;
      sendC.yFSteps = this.yFSteps;
      sendC.yBSteps = this.yBSteps;
      sendC.yPrevEverySteps = this.yPrevEverySteps;
      sendC.zFESteps = this.zFESteps;
      sendC.zFPlaneNum = this.zFPlaneNum;
      sendC.zBSteps = this.zBSteps;
      sendC.description = this.$refs.viewer.description;
      // localStorage.setItem("scanConfig", JSON.stringify(this.config));

      const baseData = AbuCommon.commonScanConfig({
        sCom: this.sCom,
        sSpeed: this.sSpeed,
        pinConfig: this.pinConfig,
        sReso: this.sReso,
      });
      const sendData = {
        ...sendC,
        ...baseData,
        command: "scan",
        delay,
        ...this.sCom,
      };
      return sendData;
    },
    scan2BBAI(uuid, sendData) {
      this.loading = true;
      return axios({
        baseURL: this.bbBaseURL,
        url: "/stage/scan",
        data: sendData,
      });
    },
    clearStorage() {
      // localStorage.removeItem("scanConfig");
      this.dialog = {
        title: "localStorage.scanConfig",
        text: "cleared",
        show: true,
      };
    },
  },
  components: { MoveCtrl, CameraPos, StopCtrl, Viewer, Aom },
};
</script>
