<template>
  <v-row>
    <v-col cols="6">
      <tiff-files />
    </v-col>
    <v-col cols="6">
      <tiff-files />
    </v-col>
  </v-row>
</template>
<script>
import axios from "@/plugins/axios";
import TiffFiles from "../components/TiffFiles.vue";

export default {
  components: { TiffFiles },
  data() {
    return {
      folder: "",
      filename: "",
      fileList: [],
    };
  },
  methods: {
    async getFileList() {
      const axres = await axios.get("http://localhost:8070/tiff/list", {
        params: { folder: this.folder },
      });
      this.fileList = axres.data.data.fileList;
    },
    async getTiffFile() {
      const axres = await axios.get("http://localhost:8070/tiff/file", {
        params: { folder: this.folder, filename: this.filename },
      });
      const blob = new Blob([axres.data], { type: "image/tiff" });
      console.log(blob);
    },
  },
};
</script>
