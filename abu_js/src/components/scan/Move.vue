<template>
  <v-row class="blue lighten-4">
    <v-col cols="4">
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
    <v-col cols="5">
      <v-btn @click="move(0)" dark color="blue" :loading="loading">X</v-btn>
      <v-btn @click="move(1)" dark color="indigo" :loading="loading">Y</v-btn>
      <v-btn @click="move(2)" dark color="purple" :loading="loading">Z</v-btn>
      <v-icon @click="moveLength = -moveLength">mdi-plus-minus</v-icon>
    </v-col>
    <v-col cols="3">
      {{ absolutePos }}
      <v-icon @click="dialog.show = true">mdi-pen</v-icon>
    </v-col>
    <v-dialog v-model="dialog.show">
      <v-card>
        <v-card-title>Fix Absolute Position</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field label="x" type="number" v-model.number="fix[0]" />
            </v-col>
            <v-col>
              <v-text-field label="y" type="number" v-model.number="fix[1]" />
            </v-col>
            <v-col>
              <v-text-field label="z" type="number" v-model.number="fix[2]" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog.show = false">Quit</v-btn>
          <v-btn @click="fixPos" color="red">Fix </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import axios from "@/plugins/axios";
import AbuCommon from "@/assets/js/abu_common";

export default {
  data() {
    return {
      moveLength: 0,
      loading: false,
      absolutePos: [0, 0, 0],
      dialog: {
        show: false,
      },
      fix: [0, 0, 0],
    };
  },
  methods: {
    fixPos() {
      this.dialog.show = false;
      this.absolutePos = this.fix.slice(); // clone
    },
    async move(direction) {
      const { bbaiBaseURL, baseData } = AbuCommon.commonScanConfig(
        this.$store.state.a
      );
      const path = "/stage/move";
      try {
        this.loading = true;
        let steps = 0;
        const {
          xFResolution,
          xBResolution,
          yFResolution,
          yBResolution,
          zFResolution,
          zBResolution,
        } = this.$store.state.a.scanDetailedConfig.sReso;
        switch (direction) {
          case 0: {
            if (this.moveLength > 0) {
              steps = this.moveLength / xFResolution;
            } else {
              steps = this.moveLength / xBResolution;
            }
            break;
          }
          case 1: {
            if (this.moveLength > 0) {
              steps = this.moveLength / yFResolution;
            } else {
              steps = this.moveLength / yBResolution;
            }
            break;
          }
          case 2: {
            if (this.moveLength > 0) {
              steps = this.moveLength / zFResolution;
            } else {
              steps = this.moveLength / zBResolution;
            }
            break;
          }
          default: {
            break;
          }
        }

        const sendData = {
          command: "move",
          ...baseData,
          direction,
          steps,
          moveLength: this.moveLength,
        };
        const { db } = this.$store.state.d.db;
        db.commands.insert(sendData, (err) => {
          if (err !== null) {
            console.error(err);
          }
        });
        const retval = await axios({
          data: sendData,
          baseURL: bbaiBaseURL,
          url: path,
        });
        console.log(retval.data);
        this.absolutePos[direction] += this.moveLength;
        this.resultItem = retval.data.retarr;
      } catch (e) {
        this.$emit("error-dialog", {
          title: bbaiBaseURL + path,
          show: true,
          text: JSON.stringify(e, null, "\t"),
        });
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
