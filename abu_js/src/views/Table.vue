<template>
  <div>
    <v-text-field label="url" v-model="url" />
    <v-text-field label="glob pattern" v-model="globPattern" />
    <v-text-field label="search" v-model="search" />
    <v-btn @click="getJson">get json</v-btn>
    <v-data-table :headers="headers" :items="items" :search="search">
    </v-data-table>
  </div>
</template>
<script>
import axios from "axios";

/**
 * @module views/Table
 * @vue-data {Array<object>} items
 * @vue-data {Array<object>} headers
 * @vue-data {String} url - url to get tiff informations
 * @vue-data {String} globPattern - glob pattern to filter tiff files
 * @vue-data {String} search - search keyword for the table
 */
export default {
  data() {
    return {
      items: [],
      headers: [],
      url: "",
      globPattern: "",
      search: "",
    };
  },
  mounted() {
    this.url = localStorage.getItem("url");
    this.globPattern = localStorage.getItem("globPattern");
  },
  methods: {
    /**
     * Return an object representing a row of the table.
     * @param {object} obj - each tiff file's metadata
     * @return {object} - An object for a row of table
     */
    extractKeys(obj) {
      const commentJson = JSON.parse(
        obj.OME.StructuredAnnotations.CommentAnnotation.Value
      );
      const { scanConfig } = commentJson;
      const {
        lengthX,
        lengthY,
        lengthZ,
        yFLengthPerSeq,
        zFLengthPerSeq,
      } = scanConfig;
      const description = obj.OME.Experiment.Description;
      const power = obj.OME.Instrument.Laser["@Power"];
      const gain = obj.OME.Instrument.Detector["@Gain"];
      const fileName = obj.OME.Image["@Name"];
      const filter = obj.OME.Instrument.Filter["@Model"];
      return {
        lengthX,
        lengthY,
        lengthZ,
        yFLengthPerSeq,
        zFLengthPerSeq,
        description,
        power,
        gain,
        fileName,
        filter,
      };
    },
    async getJson() {
      const axResult = await axios.post(this.url, { glob: this.globPattern });
      localStorage.setItem("url", this.url);
      localStorage.setItem("globPattern", this.globPattern);
      const { data } = axResult.data;
      this.items = data.map((ele) => this.extractKeys(ele));
      this.headers = Object.keys(this.items[0]).map((ele) => ({
        text: ele,
        value: ele,
      }));
    },
  },
};
</script>
