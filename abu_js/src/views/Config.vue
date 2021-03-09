<template>
  <div>
    <h1>configuration</h1>
    <v-textarea label="stage hardware config" v-model="config"> </v-textarea>
    <v-btn @click="update">update</v-btn>
  </div>
</template>
<script>
export default {
  data: () => ({
    config: {},
  }),
  mounted() {
    this.config = JSON.stringify(
      JSON.parse(localStorage.getItem("stageHwConfig")),
      null,
      "\t"
    );
  },
  methods: {
    update() {
      try {
        localStorage.setItem(
          "stageHwConfig",
          JSON.stringify(JSON.parse(this.config))
        );
      } catch (e) {
        alert(e);
      }
    },
  },
};
</script>
