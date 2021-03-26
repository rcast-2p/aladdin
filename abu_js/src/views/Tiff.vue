<template>
  <v-row>
    <v-col cols="6">
      <tiff-files />
    </v-col>
    <v-col cols="6">
      <tiff-files />
    </v-col>
    <v-col cols="6">
      <tiff-files />
    </v-col>
    <v-col cols="6">
      <tiff-files />
    </v-col>
  </v-row>
</template>
<script>
import TiffFiles from "../components/TiffFiles.vue";

export default {
  components: { TiffFiles },
  methods: {
    recvMessage(event) {
      console.log(event.data);
    },
  },
  mounted() {
    window.addEventListener("message", this.recvMessage, false);
  },
};
</script>
