<template>
  <div>
    <h1>optics options</h1>
    <v-textarea label="optics options" v-model="config"> </v-textarea>
    <v-btn @click="update">update</v-btn>
    <v-dialog v-model="dialog.show"
      ><v-card
        ><v-card-title>{{ dialog.title }}</v-card-title
        ><v-card-text>{{ dialog.text }}</v-card-text></v-card
      ></v-dialog
    >
  </div>
</template>
<script>
export default {
  data: () => ({
    config: "",
    dialog: { show: false, text: "", title: "" },
  }),
  mounted() {
    this.config = JSON.stringify(
      JSON.parse(localStorage.getItem("opticsOptions")),
      null,
      "\t"
    );
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
          "opticsOptions",
          JSON.stringify(JSON.parse(this.config))
        );

        this.dialog = {
          show: true,
          title: "Congratulations",
          text: "opticsOptions was successfully set.",
        };
      } catch (e) {
        this.handleJsonParseError(e);
      }
    },
  },
};
</script>
