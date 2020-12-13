<template>
  <div>
    <h3>{{ uuid }}</h3>
    <img :src="createPath()" :style="imageStyle" />
    <v-text-field v-model="description" />
    <v-textarea readonly v-model="configJson" />
  </div>
</template>
<script>
import axios from "@/plugins/axios";
// import * as tiff from "tiff";
export default {
  props: {
    uuid: { type: String },
    folder: { type: String },
  },
  data: () => ({
    description: "",
    configJson: "",
    parsedJson: {},
  }),
  mounted() {
    this.getJsonFile();
  },
  computed: {
    imageStyle() {
      return { width: this.parsedJson };
    },
  },
  methods: {
    createPath() {
      const pngName = `${this.uuid}_imsave_thumb_nail_00.png`;
      return `http://localhost:8070/tiff/file?folder=${this.folder}&filename=${pngName}&filetype=png`;
    },
    async getJsonFile() {
      const axres = await axios.get("http://localhost:8070/tiff/file", {
        params: {
          folder: this.folder,
          filename: `${this.uuid}.tiff`,
          filetype: "json",
        },
        responseType: "blob",
      });
      const blob = new Blob([axres.data]);
      const configJson = await blob.text();
      this.parsedJson = JSON.parse(configJson);
      this.description = this.parsedJson.description;
      this.configJson = JSON.stringify(this.parsedJson, null, 2);
    },
  },
};
</script>
