<template>
  <div>
    <h1>Polymerization Stage Scan</h1>
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
              label="size"
              v-model.number="config.size"
              suffix="step"
              outlined
              type="number"
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
          <v-col cols="4">
            <v-select
              label="shape"
              v-model.number="config.shape"
              :items="shapeOptions"
              outlined
            />
          </v-col>
          <v-col cols="4">
            <v-select
              label="invert"
              v-model.number="config.invert"
              :items="invertOptions"
              outlined
            />
          </v-col>
          <v-col cols="4"> {{ duration }}sec </v-col>
          <v-col cols="12">
            <v-data-table :headers="resultHeader" :items="resultItem" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" v-if="fal" xs="12" sm="12" md="6" lg="6" xl="6">
        <h2>pin configuration</h2>
        <v-row>
          <v-col v-for="(pin, pkey) in config.pinConfigs" :key="pkey" cols="3">
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
          <v-btn @click="shutdown" dark color="red">Shutdown</v-btn>
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
      resultHeader: [
        { text: "command", value: "command" },
        { text: "returncode", value: "returncode" },
        { text: "stdout", value: "stdout" },
        { text: "stderr", value: "stderr" },
      ],
      resultItem: [],
      config: {
        beagle: {
          address: "192.168.0.65",
          port: 8070,
        },
        receiver: {
          port: 8060,
        },
        size: 1000,
        speed: 1,
        shape: 0,
        invert: 1,
        pinConfigs: [
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
      shapeOptions: [
        { text: "E", value: 0 },
        { text: "F", value: 1 },
      ],
      invertOptions: [
        { text: "false", value: 0 },
        { text: "true", value: 1 },
      ],
      showAdvConfig: true,
      fal: true,
    };
  },
  created() {
    try {
      const config = localStorage.getItem("config");
      if (config) {
        this.config = JSON.parse(config);
      }
    } catch (e) {
      console.error(e);
    }
  },
  computed: {
    bbBaseURL() {
      return `http://${this.config.beagle.address}:${this.config.beagle.port}`;
    },
    duration() {
      if (this.config.shape === 0) {
        return (
          ((17 * (this.config.size / 5) * (this.config.size / 5) +
            this.config.size) *
            this.config.speed) /
          1000
        );
      } else {
        return (
          ((11 * (this.config.size / 5) * (this.config.size / 5) +
            this.config.size) *
            this.config.speed) /
          1000
        );
      }
    },
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
    async shutdown() {
      const retval = await axios({
        baseURL: this.bbBaseURL,
        // baseURL: "http://localhost:8101/tms/send/",
        url: "shutdown",
        // url: "contract_detail.php",
      });
      console.log(retval.data);
      this.resultItem = retval.data.retarr;
    },
    async configPost2BB() {
      localStorage.setItem("config", JSON.stringify(this.config));
      const retval = await axios({
        baseURL: this.bbBaseURL,
        // baseURL: "http://localhost:8101/tms/send/",
        url: "config",
        // url: "contract_detail.php",
        data: this.config,
      });
      console.log(retval.data);
      this.resultItem = retval.data.retarr;
      // if(retval.data.status="success"){
      //   this.dialog=true;
      // }
    },
  },
  components: {},
};
</script>
