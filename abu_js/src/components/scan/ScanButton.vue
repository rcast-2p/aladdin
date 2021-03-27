<template>
  <v-col cols="6" class="green lighten-4">
    <v-btn @click="motorTest" dark color="green" :loading="loading"
      ><v-icon>mdi-record-rec</v-icon> motor test</v-btn
    >
    <v-btn @click="start" dark color="green darken-4" :loading="loading"
      ><v-icon>mdi-record-rec</v-icon> start</v-btn
    >
  </v-col>
</template>
<script>
import axios from "@/plugins/axios";
import AbuCommon from "@/assets/js/abu_common";
import pack from "../../../package.json";

export default {
  data: () => ({
    loading: false,
  }),
  methods: {
    async motorTest() {
      const { address, data } = AbuCommon.createScanPostData(this.$store.state);
      try {
        await axios.post(address, data);
        await AbuCommon.register2Db(this.$store.state, "motorTest");
      } catch (e) {
        this.$emit("error-dialog", {
          title: address,
          show: true,
          text: JSON.stringify(e, null, "\t"),
        });
        console.error(e);
      }
    },
    async start() {
      const prudaqPostData = await AbuCommon.createPrudaqPostData(
        this.$store.state
      );
      const scanPostData = AbuCommon.createScanPostData(this.$store.state);
      const recvPostData = await AbuCommon.createReceiverPostData(
        this.$store.state
      );
      try {
        const prudaqPost = axios.post(
          prudaqPostData.address,
          prudaqPostData.data
        );
        scanPostData.data.delay = this.$store.state.a.scanDetailedConfig.delay;
        recvPostData.data.apiVersion = pack.version;
        const scanPost = axios.post(scanPostData.address, scanPostData.data);
        const recvPost = axios.post(recvPostData.address, recvPostData.data);
        await Promise.all([prudaqPost, scanPost, recvPost]);

        this.$emit("start-webworker");
        await AbuCommon.register2Db(
          this.$store.state,
          "scan",
          recvPostData.data.uuid
        );
        this.$emit("load-commands-db");
      } catch (e) {
        this.$emit("error-dialog", {
          title: "start error",
          show: true,
          text: JSON.stringify(e, null, "\t"),
        });
        console.error(e);
      }
    },
  },
};
</script>
