<template>
  <div>
    <h1>Stage Scan</h1>
    <v-row>
      <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
        <move-ctrl ref="move" :config="config" :bbBaseURL="bbBaseURL" />
        <v-row no-gutters class="py-2">
          <stop-ctrl ref="ctrl" :config="config" :bbBaseURL="bbBaseURL" />
          <v-btn @click="scanOnly" dark color="green" :loading="loading"
            >Scan Only</v-btn
          >
          <v-btn
            @click="scanNReceive"
            dark
            color="green darken-4"
            :loading="loading"
            >Scan</v-btn
          >
        </v-row>
        <v-row no-gutters class="py-2">
          <v-col cols="1">space </v-col>
          <v-col cols="11">
            <v-row no-gutters>
              <v-col cols="4">
                <v-text-field
                  label="scan x length"
                  v-model.number="config.scanXLength"
                  suffix="um"
                  type="number"
                  outlined
                  hide-details="auto"
                  dense
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="scanYLength"
                  v-model.number="config.scanYLength"
                  suffix="um"
                  type="number"
                  outlined
                  hide-details="auto"
                  dense
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="scanZLength"
                  v-model.number="config.scanZLength"
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
                  v-model.number="config.xyRepeatNum"
                  type="number"
                  outlined
                  hide-details="auto"
                  dense
                />
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="xyz repeat num"
                  v-model.number="config.xyzRepeatNum"
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
                  v-model.number="config.aomOpenUs"
                  suffix="us"
                  outlined
                  type="number"
                  hide-details="auto"
                  dense
                />
              </v-col>
              <v-col cols="3">
                <v-text-field
                  label="speed / pixel dwell time"
                  v-model.number="config.speed"
                  suffix="us"
                  outlined
                  type="number"
                  hide-details="auto"
                  dense
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <ul>
            <li>
              {{ scanOverview[0] }}
            </li>
            <li>
              {{ scanOverview[1] }}
            </li>
            <li>
              {{ scanOverview[2] }}
            </li>
          </ul>
        </v-row>
        <aom ref="aom" :config="config" :bbBaseURL="bbBaseURL" />
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header
              >other configuration</v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <h2>resolution & invert</h2>
              <v-row>
                <v-col cols="3">
                  <v-select
                    label="x forward resolution"
                    v-model="config.xFResolution"
                    :items="resolutionOptions"
                    outlined
                    hide-details="auto"
                    dense
                  />
                </v-col>
                <v-col cols="3">
                  <v-select
                    label="x backward resolution"
                    v-model="config.xBResolution"
                    :items="resolutionOptions"
                    outlined
                    hide-details="auto"
                    dense
                  />
                </v-col>
                <v-col cols="3">
                  <v-select
                    label="y forward resolution"
                    v-model="config.yFResolution"
                    :items="resolutionOptions"
                    outlined
                    hide-details="auto"
                    dense
                  />
                </v-col>
                <v-col cols="3">
                  <v-select
                    label="y backward resolution"
                    v-model="config.yBResolution"
                    :items="resolutionOptions"
                    outlined
                    hide-details="auto"
                    dense
                  />
                </v-col>
                <v-col cols="3">
                  <v-select
                    label="z forward resolution"
                    v-model="config.zFResolution"
                    :items="resolutionOptions"
                    outlined
                    hide-details="auto"
                    dense
                  />
                </v-col>
                <v-col cols="3">
                  <v-select
                    label="z backward resolution"
                    v-model="config.zBResolution"
                    :items="resolutionOptions"
                    outlined
                    hide-details="auto"
                    dense
                  />
                </v-col>
                <v-col cols="3">
                  <v-select
                    label="invert"
                    v-model.number="config.invert"
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
                    v-model.number="config.aomOpenHl"
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
                  v-for="(pin, pkey) in config.pinConfig"
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
                    v-model="config.beagle.address"
                    hide-details="auto"
                    dense
                    outlined
                  />
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="BBAI port"
                    v-model.number="config.beagle.port"
                    hide-details="auto"
                    dense
                    outlined
                    type="number"
                  />
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    label="RECV port"
                    v-model.number="config.receiver.port"
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
            <v-btn @click="clearStorage">clear scanMemory</v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
        <viewer ref="viewer" :config="config" :imgWidth="imgWidth" />
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
import axios from "@/plugins/axios";
import Viewer from "@/components/Viewer.vue";
import Aom from "@/components/Aom.vue";

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
      config: {
        uuid: "rcast_2p",
        beagle: {
          address: "192.168.2.101",
          port: 8070,
        },
        receiver: {
          port: 8060,
        },
        error: "",
        invert: 1,
        xFSteps: 1,
        xBSteps: 1,
        yFSteps: 1,
        yBSteps: 1,
        scanXLength: 100,
        scanYLength: 100,
        scanZLength: 100,
        repeatNum: 10,
        zplainNum: 10,
        scanZscale: 10,
        xFResolution: 1.0,
        xBResolution: 1.0,
        yFResolution: 1.0,
        yBResolution: 1.0,
        zFResolution: 1.0,
        zBResolution: 1.0,
        speed: 1,
        aomOpenUs: 1.0,
        aomOpenHl: 1,
        retStep: 10.0,
        pinConfig: [
          { name: "plsPin1", value: 1 },
          { name: "dirPin1", value: 2 },
          { name: "plsPin2", value: 3 },
          { name: "dirPin2", value: 4 },
          { name: "plsPin3", value: 5 },
          { name: "dirPin3", value: 6 },
          { name: "aomPin", value: 7 },
        ],
        pulseMode: [
          { name: "Driver1", value: false },
          { name: "Driver2", value: false },
          { name: "Driver3", value: false },
        ],
        xyRepeatNum: 1,
        xyzRepeatNum: 1,
      },
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
      showAdvConfig: true,
      loading: false,
      dialog: { show: false, text: "", title: "" },
    };
  },
  computed: {
    imgWidth() {
      return this.config.scanXLength;
    },
    scanOverview() {
      const wPixel = this.config.scanXLength / this.config.xFResolution;
      const wRetPixel = this.config.scanXLength / this.config.xBResolution;
      const hPixel = this.config.scanYLength / this.config.yFResolution;
      const hRetPixel = this.config.scanYLength / this.config.yFResolution;
      const onePlanePulseNum = (wPixel + wRetPixel) * hPixel + hRetPixel;
      const onePlaneDuration = (onePlanePulseNum * this.config.speed) / 1000;
      const zPixel = this.config.scanZLength / this.config.zFResolution;
      const zRetPixel = this.config.scanZLength / this.config.zBResolution;
      const totalDuration =
        ((onePlanePulseNum * this.config.xyRepeatNum * zPixel + zRetPixel) *
          this.config.speed) /
        1000;
      const packets = totalDuration / 1.6;
      return [
        `single xy: (${wPixel}+${wRetPixel}) x ${hPixel} + ${hRetPixel}=${onePlaneDuration} ms`,
        `      total: (${onePlaneDuration} x ${this.config.xyRepeatNum} x ${zPixel} + ${zRetPixel}) x ${this.config.xyzRepeatNum} =  ${totalDuration} ms`,
        `${packets} packets`,
      ];
    },
    bbBaseURL() {
      return `http://${this.config.beagle.address}:${this.config.beagle.port}`;
    },
    xFSteps() {
      return this.config.scanXLength / this.config.xFResolution;
    },
    xBSteps() {
      return this.config.scanXLength / this.config.xBResolution;
    },
    yFSteps() {
      return this.config.scanYLength / this.config.yFResolution;
    },
    yBSteps() {
      return this.config.scanYLength / this.config.yBResolution;
    },
    zFSteps() {
      return this.config.scanZLength / this.config.zFResolution;
    },
    zBSteps() {
      return this.config.scanZLength / this.config.zBResolution;
    },
  },
  watch: {
    xFSteps(val) {
      this.config.xFSteps = val;
    },
    xBSteps(val) {
      this.config.xBSteps = val;
    },
    yFSteps(val) {
      this.config.yFSteps = val;
    },
    yBSteps(val) {
      this.config.yBSteps = val;
    },
    zFSteps(val) {
      this.config.zFSteps = val;
    },
    zBSteps(val) {
      this.config.zBSteps = val;
    },
  },
  created() {
    if (localStorage.getItem("scanConfig")) {
      this.config = JSON.parse(localStorage.getItem("scanConfig"));
    }
  },
  methods: {
    async scanNReceive() {
      const uuid = this.$refs.viewer.getDateString();
      try {
        const retvals = await Promise.all([
          this.scan2BBAI(uuid, 0.5),
          this.$refs.viewer.receiverConfig(uuid),
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
      const uuid = this.$refs.viewer.getDateString();
      try {
        const retval = await this.scan2BBAI(uuid, 0);
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
    scan2BBAI(uuid, delay = 0) {
      console.log(delay);
      this.config.uuid = uuid;
      this.config.xFSteps = this.xFSteps;
      this.config.xBSteps = this.xBSteps;
      this.config.yFSteps = this.yFSteps;
      this.config.yBSteps = this.yBSteps;
      this.config.zFSteps = this.zFSteps;
      this.config.zBSteps = this.zBSteps;
      localStorage.setItem("scanConfig", JSON.stringify(this.config));
      this.loading = true;
      return axios({
        baseURL: this.bbBaseURL,
        url: "/stage/scan",
        data: { ...this.config, command: "scan", delay },
      });
    },
    clearStorage() {
      localStorage.removeItem("scanConfig");
      this.dialog = {
        title: "localStorage.scanConfig",
        text: "cleared",
        show: true,
      };
    },
  },
  components: { MoveCtrl, StopCtrl, Viewer, Aom },
};
</script>
