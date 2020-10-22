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

export default {
  props: { config: Object, bbBaseURL: String },
  data() {
    return { loading: false, aomOnoff: false };
  },
  methods: {
    async aom(aomOnoff) {
      try {
        this.loading = true;
        const { uuid, speed, aomOpenHl, invert, pinConfig } = this.config;
        const retval = await axios({
          data: {
            uuid,
            command: "aom",
            invert,
            speed,
            aomOpenHl,
            aomOnoff,
            pinConfig,
          },
          baseURL: this.bbBaseURL,
          url: "/stage/scan",
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
