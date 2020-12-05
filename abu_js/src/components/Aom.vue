<template>
  <v-row class="orange lighten-4">
    <v-btn @click="aom(1)" dark color="yellow darken-2" :loading="loading"
      >AOM ON</v-btn
    >
    <v-btn @click="aom(0)" dark color="yellow darken-4" :loading="loading"
      >AOM OFF</v-btn
    >
    <v-switch v-model="aomOnoff" />
  </v-row>
</template>
<script>
import axios from "@/plugins/axios";
import AbuCommon from "@/assets/js/abu_common";

export default {
  props: { config: Object, bbBaseURL: String },
  data() {
    return { loading: false, aomOnoff: false };
  },
  methods: {
    async aom(aomOnoff) {
      const baseData = AbuCommon.commonScanConfig(this.config);
      try {
        this.loading = true;
        const retval = await axios({
          data: {
            ...baseData,
            aomOnoff,
          },
          baseURL: this.bbBaseURL,
          url: "/stage/aom",
        });
        console.log(retval.data);
        this.resultItem = retval.data.retarr;
        this.aomOnoff = aomOnoff === 1;
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
