<template>
  <div>
    <h1>Stage Scan</h1>
    <v-row>
      <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
        <h2>XY plane</h2>
        <v-row>
          <v-col cols="12">
            <v-btn @click="emergencyStop" dark color="red"
              >Emergency Stop</v-btn
            >
            <v-btn @click="configPost2BB" dark color="green">Post</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
              label="scanWidth"
              v-model.number="config.scanWidth"
              suffix="um"
              type="number"
              outlined
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="scanHeight"
              v-model.number="config.scanHeight"
              suffix="um"
              type="number"
              outlined
            />
          </v-col>
          <v-col cols="4">
            <v-select
              label="resolution"
              v-model="config.scanResolution"
              :items="resolutionOptions"
              outlined
            />
          </v-col>
        </v-row>
        <h2>Z axis</h2>
        <v-row>
          <v-col cols="4">
            <v-text-field
              label="zplainNum"
              v-model="config.zplainNum"
              suffix="plains"
              outlined
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="scanZscale"
              v-model="config.scanZscale"
              suffix="um each"
              outlined
            />
          </v-col>
          <v-col cols="4">
            <v-select
              label="invert"
              v-model.number="config.invert"
              :items="invertOptions"
              type="number"
              outlined
            />
          </v-col>
        </v-row>
        <v-row>
          {{ scanOverview }}
          <v-btn @click="showAdvConfig = !showAdvConfig">show adv config</v-btn>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
              label="return step"
              v-model.number="config.retStep"
              suffix="um"
              type="number"
              outlined
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="repeat num"
              v-model.number="config.repeatNum"
              type="number"
              outlined
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="speed"
              v-model.number="config.speed"
              suffix="ms"
              outlined
              type="number"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" v-if="fal" xs="12" sm="12" md="6" lg="6" xl="6">
        <h2>pin configuration</h2>
        <v-row>
          <v-col v-for="(pin, pkey) in config.pinConfig" :key="pkey" cols="3">
            <v-text-field
              :label="pin.name"
              type="number"
              v-model="pin.value"
              outlined
            />
          </v-col>
        </v-row>
        <h2>one pulse / two pulse</h2>
        <v-row>
          <v-col v-for="(pin, pkey) in config.pulseMode" :key="pkey" cols="4">
            <v-switch
              :label="pin.name"
              type="number"
              v-model="pin.value"
              outlined
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
              label="BB address"
              v-model="config.beagle.address"
              outlined
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="BB port"
              v-model="config.beagle.port"
              outlined
              type="number"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="RECV port"
              v-model="config.receiver.port"
              outlined
              type="number"
            />
          </v-col>
          <v-col cols="12">
            <v-data-table :headers="resultHeader" :items="resultItem" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import axios from "@/plugins/axios";
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
        beagle: {
          address: "192.168.2.101",
          port: 8070,
        },
        receiver: {
          port: 8060,
        },
        invert: 1,
        widthGo: 1,
        widthCome: 1,
        heightGo: 1,
        heightCome: 1,
        scanWidth: 100,
        scanHeight: 100,
        repeatNum: 10,
        zplainNum: 10,
        scanZscale: 10,
        scanResolution: 0.5,
        speed: 1,
        retStep: 10.0,
        pinConfig: [
          { name: "plsPin1", value: 0 },
          { name: "CWPin1", value: 1 },
          { name: "AWPin1", value: 2 },
          { name: "RSPin1", value: 3 },
          { name: "plsPin2", value: 4 },
          { name: "CWPin2", value: 5 },
          { name: "AWPin2", value: 6 },
          { name: "RSPin2", value: 7 },
          { name: "plsPin3", value: 8 },
          { name: "CWPin3", value: 9 },
          { name: "AWPin3", value: 10 },
          { name: "RSPin3", value: 11 },
        ],
        pulseMode: [
          { name: "Driver1", value: false },
          { name: "Driver2", value: false },
          { name: "Driver3", value: false },
        ],
      },
      resolutionOptions: [
        { text: "0.5um (40div 9)", value: 0.5 },
        { text: "0.8um (25div 8)", value: 0.8 },
        { text: "1.0um (20div 7)", value: 1.0 },
        { text: "2.0um (10div 6)", value: 2.0 },
        { text: "2.5um (8div 5)", value: 2.5 },
        { text: "4.0um (5div 4)", value: 5.0 },
      ],
      invertOptions: [
        { text: "false", value: 0 },
        { text: "true", value: 1 },
      ],
      showAdvConfig: true,
      fal: true,
    };
  },
  computed: {
    scanOverview() {
      const wPixel = this.config.scanWidth / this.config.scanResolution;
      const wRetPixel = this.config.scanWidth / this.config.retStep;
      const hPixel = this.config.scanHeight / this.config.scanResolution;
      const hRetPixel = this.config.scanHeight / this.config.retStep;
      const onePlaneDuration = (wPixel + wRetPixel) * hPixel + hRetPixel;
      return `(${wPixel}+${wRetPixel}) x ${hPixel} + ${wRetPixel}=${onePlaneDuration} ms`;
    },
    bbBaseURL() {
      return `http://${this.config.beagle.address}:${this.config.beagle.port}`;
    },
  },
  created() {
    if (localStorage.getItem("scanConfig")) {
      this.config = JSON.parse(localStorage.getItem("scanConfig"));
    }
  },
  methods: {
    async emergencyStop() {
      const retval = await axios({
        baseURL: this.bbBaseURL,
        // baseURL: "http://localhost:8101/tms/send/",
        url: "stop",
        // url: "contract_detail.php",
      });
      console.log(retval.data);
      this.resultItem = retval.data.retarr;
    },
    async configPost2BB() {
      this.config.widthGo = this.config.scanWidth / this.config.scanResolution;
      this.config.widthCome = this.config.scanWidth / this.config.retStep;
      this.config.heightGo =
        this.config.scanHeight / this.config.scanResolution;
      this.config.heightCome = this.config.scanHeight / this.config.retStep;
      localStorage.setItem("scanConfig", JSON.stringify(this.config));
      const retval = await axios({
        baseURL: this.bbBaseURL,
        // baseURL: "http://localhost:8101/tms/send/",
        url: "config",
        // url: "contract_detail.php",
        data: this.config,
      });
      this.resultItem = retval.data.retarr;
      // if(retval.data.status="success"){
      //   this.dialog=true;
      // }
    },
  },
  components: {},
};
</script>
