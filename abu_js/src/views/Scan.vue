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
              v-model="config.scanWidth"
              suffix="um"
              outlined
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="scanHeight"
              v-model="config.scanHeight"
              suffix="um"
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
        </v-row>
        <v-row>
          {{ scanOverview }}
          <v-btn @click="showAdvConfig = !showAdvConfig">show adv config</v-btn>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
              label="return step"
              v-model="config.retStep"
              suffix="um"
              outlined
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
      config: {
        beagle: {
          address: "0.0.0.0",
          port: 8070,
        },
        receiver: {
          port: 8060,
        },
        scanWidth: 100,
        scanHeight: 100,
        zplainNum: 10,
        scanZscale: 10,
        scanResolution: 0.5,
        retStep: 10.0,
        pinConfig: [
          { name: "plsPin1", value: 1 },
          { name: "CWPin1", value: 2 },
          { name: "AWPin1", value: 3 },
          { name: "RSPin1", value: 4 },
          { name: "plsPin2", value: 5 },
          { name: "CWPin2", value: 6 },
          { name: "AWPin2", value: 7 },
          { name: "RSPin2", value: 8 },
          { name: "plsPin3", value: 9 },
          { name: "CWPin3", value: 10 },
          { name: "AWPin3", value: 11 },
          { name: "RSPin3", value: 12 },
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
  methods: {
    async emergencyStop() {
      alert("Emergency Stop");
    },
    async configPost2BB() {
      const retval = await axios({
        baseURL: this.bbBaseURL,
        // baseURL: "http://localhost:8101/tms/send/",
        url: "config",
        // url: "contract_detail.php",
        data: this.config,
      });
      console.log(retval.data);
      // if(retval.data.status="success"){
      //   this.dialog=true;
      // }
    },
  },
  components: {},
};
</script>
