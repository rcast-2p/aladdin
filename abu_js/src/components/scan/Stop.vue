<template>
  <v-col cols="6" class="red lighten-4">
    <v-btn @click="stop(0)" dark color="red" :loading="loading">Stop</v-btn>
    <v-btn @click="stop(1)" dark color="red" :loading="loading">StopXY</v-btn>
    <v-btn @click="stop(2)" dark color="red" :loading="loading">StopXYZ</v-btn>
  </v-col>
</template>
<script>
import axios from "@/plugins/axios";
import AbuCommon from "@/assets/js/abu_common";

export default {
  data() {
    return { loading: false };
  },
  computed: {
    baseURL() {
      return `http://${this.$store.state.a.prudaq.host}:${this.$store.state.a.prudaq.port}`;
    },
  },
  methods: {
    async killLite() {
      const path = "/prudaq/kill-lite";
      await axios({
        data: {},
        baseURL: this.baseURL,
        url: path,
      });
    },
    async stop(goBack) {
      /**
       *@param {number} goBack
       */
      const path = "/stage/stop";
      try {
        this.loading = true;
        const { bbaiBaseURL, baseData } = AbuCommon.commonScanConfig(
          this.$store.state.a
        );
        this.killLite();
        await axios({
          data: {
            command: "stop",
            ...baseData,
            goBack,
          },
          baseURL: bbaiBaseURL,
          url: path,
        });
      } catch (e) {
        this.$emit("error-dialog", {
          title: this.baseURL + path,
          show: true,
          text: JSON.stringify(e, null, "\t"),
        });
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
