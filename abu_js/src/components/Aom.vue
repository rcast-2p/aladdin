<template>
  <v-row class="orange lighten-4">
    <v-btn @click="aom(1)" dark color="yellow darken-2" :loading="loading"
      >AOM ON</v-btn
    >
    <v-btn @click="aom(0)" dark color="yellow darken-4" :loading="loading"
      >AOM OFF</v-btn
    >
    <v-switch v-model="aomOnoff" readonly />
  </v-row>
</template>
<script>
import axios from "@/plugins/axios";
import AbuCommon from "@/assets/js/abu_common";

export default {
  data() {
    return { loading: false, aomOnoff: false };
  },
  methods: {
    async aom(aomOnoff) {
      const { bbaiBaseURL, baseData } = AbuCommon.commonScanConfig(
        this.$store.state
      );
      const path = "/stage/aom";
      try {
        this.loading = true;
        const retval = await axios({
          data: {
            ...baseData,
            aomOnoff,
          },
          bbaiBaseURL,
          url: path,
        });
        console.log(retval.data);
        this.resultItem = retval.data.retarr;
        this.aomOnoff = aomOnoff === 1;
      } catch (e) {
        this.$emit("error-dialog", {
          title: bbaiBaseURL + path,
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
