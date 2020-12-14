<template>
  <div>
    <v-data-table :headers="headers" :items="items" />
  </div>
</template>
<script>
import axios from "@/plugins/axios";

export default {
  data: () => ({
    headers: [{ text: "uuid", value: "uuid" }],
    items: [],
  }),
  mounted() {
    this.getAll();
  },
  methods: {
    async getAll() {
      const url = "http://localhost:8070/recv/config-json";
      const retval = await axios.post(url, {});
      this.items = retval.data.data;
    },
  },
};
</script>
