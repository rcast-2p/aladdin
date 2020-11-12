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
  props: { config: Object, bbBaseURL: String },
  data() {
    return { loading: false };
  },
  methods: {
    async stop(goBack) {
      try {
        this.loading = true;
        const baseData = AbuCommon.commonScanConfig(this.config);
        const retval = await axios({
          data: {
            ...baseData,
            command: "stop",
            goBack,
          },
          baseURL: this.bbBaseURL,
          url: "/stage/scan",
        });
        console.log(retval.data);
        this.resultItem = retval.data.retarr;
      } catch (e) {
        console.error(e);
        this.error.text = JSON.stringify(e, null, "\t");
        this.error.show = true;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
