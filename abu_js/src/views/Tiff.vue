<template>
  <v-row>
    <v-col cols="6">
      <tiff-files ref="tiff0" />
    </v-col>
    <v-col cols="6">
      <tiff-files ref="tiff1" />
    </v-col>
    <v-col cols="6">
      <tiff-files ref="tiff2" />
    </v-col>
    <v-col cols="6">
      <tiff-files ref="tiff3" />
    </v-col>
  </v-row>
</template>
<script>
import TiffFiles from "../components/TiffFiles.vue";

export default {
  components: { TiffFiles },
  methods: {
    recvMessage(event) {
      if (event.data.debug === undefined) {
        return;
      }
      const folder = event.data.debug.replace("octo_test/", "");
      const { uuid, maximum, minimum } = event.data;
      const compNum = 4;
      const now = new Date();
      let oldest = now.setDate(now.getDate() + 1);
      let oldestArg = -1;
      for (let compI = 0; compI < compNum; compI += 1) {
        if (oldest > this.$refs[`tiff${compI}`].updated) {
          oldestArg = compI;
          oldest = this.$refs[`tiff${compI}`].updated;
        }
      }
      this.$refs[`tiff${oldestArg}`].glueParent(uuid, folder, maximum, minimum);
    },
  },
  mounted() {
    window.addEventListener("message", this.recvMessage, false);
  },
};
</script>
