<template>
  <v-row class="blue lighten-4">
    <v-col cols="6">
      <v-text-field
        label="move length"
        v-model.number="moveLength"
        suffix="um"
        outlined
        type="number"
        hide-details="auto"
        dense
      />
    </v-col>
    <v-col cols="6">
      <v-btn @click="move(0)" dark color="blue" :loading="loading">X</v-btn>
      <v-btn @click="move(1)" dark color="indigo" :loading="loading">Y</v-btn>
      <v-btn @click="move(2)" dark color="purple" :loading="loading">Z</v-btn>
      <v-icon @click="moveLength = -moveLength">mdi-plus-minus</v-icon>
    </v-col>
  </v-row>
</template>
<script>
import axios from "@/plugins/axios";

export default {
  props: { config: Object, bbBaseURL: String },
  data() {
    return {
      moveLength: 0,
      loading: false,
    };
  },
  methods: {
    async move(direction) {
      try {
        this.loading = true;
        let steps = 0;
        switch (direction) {
          case 0: {
            if (this.moveLength > 0) {
              steps = this.moveLength / this.config.xFResolution;
            } else {
              steps = this.moveLength / this.config.xFResolution;
            }
            break;
          }
          case 1: {
            if (this.moveLength > 0) {
              steps = this.moveLength / this.config.yFResolution;
            } else {
              steps = this.moveLength / this.config.yFResolution;
            }
            break;
          }
          case 2: {
            if (this.moveLength > 0) {
              steps = this.moveLength / this.config.zFResolution;
            } else {
              steps = this.moveLength / this.config.zFResolution;
            }
            break;
          }
          default: {
            break;
          }
        }
        const { uuid, speed, aomOpenHl, invert, pinConfig } = this.config;
        const retval = await axios({
          data: {
            command: "move",
            invert,
            speed,
            uuid,
            aomOpenHl,
            direction,
            pinConfig,
            steps,
          },
          baseURL: this.bbBaseURL,
          url: "/stage/scan",
        });
        console.log(retval.data);
        this.resultItem = retval.data.retarr;
      } catch (e) {
        console.error(e);
        this.error.text = JSON.stringify(e, null, "\t");
        this.error.show = true;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
