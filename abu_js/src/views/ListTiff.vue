<template>
  <div>
    <h1>List Tiff Files</h1>
    <v-text-field v-model="folder"></v-text-field>
    <v-btn @click="getFileList">get the file list</v-btn>
    <!-- :uuid="fileName.replace('.tiff', '')" -->
    <thumbnail
      :uuid="fileName.replace('.tiff', '')"
      v-for="(fileName, fI) in fileList"
      :key="fI"
      :folder="folder"
    />
  </div>
</template>
<script>
import axios from "@/plugins/axios";
import Thumbnail from "@/components/Thumbnail.vue";
// import * as tiff from "tiff";
export default {
  components: { Thumbnail },
  data: () => ({
    folder: "",
    fileList: [],
  }),
  methods: {
    createPath(fileName) {
      const pngName = fileName.replace(".tiff", "_imsave_thumb_nail_00.png");
      return `http://localhost:8070/tiff/file?folder=${this.folder}&filename=${pngName}&filetype=png`;
    },
    async getFileList() {
      const axres = await axios.get("http://localhost:8070/tiff/list", {
        params: { folder: this.folder },
      });
      this.fileList = axres.data.data.fileList;
    },
  },
};
</script>
