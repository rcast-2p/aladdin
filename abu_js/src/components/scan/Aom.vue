<template>
  <v-row class="orange lighten-4 px-4">
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

/**
 * @module components/scan/Aom
 * @vue-data {boolean} [loading=false]
 * @vue-data {boolean} [aomOnoff=false]
 */
export default {
  data() {
    return { loading: false, aomOnoff: false };
  },
  methods: {
    async aom(aomOnoff) {
      const { bbaiBaseURL, baseData } = AbuCommon.commonScanConfig(
        this.$store.state.a
      );
      const path = "/stage/aom";
      try {
        this.loading = true;
        const command = "aom";
        await axios({
          data: {
            ...baseData,
            aomOnoff,
            command,
          },
          baseURL: bbaiBaseURL,
          url: path,
        });
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
