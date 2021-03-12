<template>
  <div>
    <h1>hardware configuration</h1>
    <v-textarea label="stage hardware config" v-model="config"> </v-textarea>
    <v-btn @click="update">update</v-btn>

    <h1>software configuration</h1>
    <v-textarea label="stage software config" v-model="softwareConfig">
    </v-textarea>
    <v-btn @click="scUpdate">update</v-btn>

    <h1>colormap</h1>
    <color-map />
    <v-dialog v-model="dialog.show"
      ><v-card
        ><v-card-title>{{ dialog.title }}</v-card-title
        ><v-card-text>{{ dialog.text }}</v-card-text></v-card
      ></v-dialog
    >
  </div>
</template>
<script>
import ColorMap from "@/components/config/ColorMap.vue";

export default {
  data: () => ({
    config: "",
    softwareConfig: "",
    dialog: { show: false, text: "", title: "" },
  }),
  components: { ColorMap },
  mounted() {
    this.config = JSON.stringify(
      JSON.parse(localStorage.getItem("stageHwConfig")),
      null,
      "\t"
    );
    this.softwareConfig = JSON.stringify(this.$store.state.a, null, "\t");
  },
  methods: {
    handleJsonParseError(error) {
      if (error instanceof SyntaxError) {
        this.dialog = {
          show: true,
          title: "JSON syntax error",
          text: error.message,
        };
      } else {
        this.dialog = {
          show: true,
          title: "Other error",
          text: error.message,
        };
        console.error(error);
      }
    },
    update() {
      try {
        localStorage.setItem(
          "stageHwConfig",
          JSON.stringify(JSON.parse(this.config))
        );

        this.dialog = {
          show: true,
          title: "Congratulations",
          text: "stageHwConfig was successfully set.",
        };
      } catch (e) {
        this.handleJsonParseError(e);
      }
    },
    scUpdate() {
      try {
        this.$store.commit("setState", this.softwareConfig);
        this.dialog = {
          show: true,
          title: "Congratulations",
          text: "successfully set.",
        };
      } catch (e) {
        this.handleJsonParseError(e);
      }
    },
  },
};
</script>
