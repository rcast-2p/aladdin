<template>
  <div>
    <v-text-field label="url" v-model="url" />
    <v-text-field label="search" v-model="search" />
    <v-btn @click="getJson">get json</v-btn>
    <v-data-table
      :headers="tiffData.headers"
      :items="tiffData.items"
      :search="search"
    >
    </v-data-table>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      tiffData: {
        items: [],
        headers: [],
      },
      url: "",
      search: "",
    };
  },
  methods: {
    async getJson() {
      const axResult = await axios.get(this.url);
      const dataKeys = Object.keys(axResult.data.data[0]);
      this.tiffData.headers = dataKeys.reduce((acc, ele) => {
        acc.push({ text: ele, value: ele });
        return acc;
      }, []);
      this.tiffData.items = axResult.data.data;
      // console.log(json);
    },
  },
};
</script>
