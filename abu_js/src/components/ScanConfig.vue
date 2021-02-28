<template>
  <v-row no-gutters class="py-2">
    <v-col cols="1">space </v-col>
    <v-col cols="11">
      <v-row no-gutters>
        <v-col cols="2">
          <v-text-field
            label="lengthX"
            v-model.number="scanConfig.lengthX"
            suffix="um"
            type="number"
            outlined
            hide-details="auto"
            dense
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="lengthY"
            v-model.number="scanConfig.lengthY"
            suffix="um"
            type="number"
            outlined
            hide-details="auto"
            dense
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="yPrevEveryLength"
            v-model.number="scanConfig.yPrevEveryLength"
            suffix="um"
            type="number"
            outlined
            hide-details="auto"
            dense
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="scanZLength"
            v-model.number="scanConfig.scanZLength"
            suffix="um"
            type="number"
            outlined
            hide-details="auto"
            dense
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="scanZELength"
            v-model.number="scanConfig.scanZELength"
            suffix="um"
            type="number"
            outlined
            hide-details="auto"
            dense
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="1">time</v-col>
    <v-col cols="11">
      <v-row no-gutters>
        <v-col cols="2">
          <v-text-field
            label="xyRepeatNum"
            v-model.number="scanConfig.xyRepeatNum"
            type="number"
            outlined
            hide-details="auto"
            dense
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="xyzRepeatNum"
            v-model.number="scanConfig.xyzRepeatNum"
            type="number"
            outlined
            hide-details="auto"
            dense
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="aomOpenUs"
            v-model.number="scanConfig.aomOpenUs"
            type="number"
            outlined
            hide-details="auto"
            suffix="us"
            dense
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="speedX"
            v-model.number="scanConfig.speedX"
            type="number"
            outlined
            hide-details="auto"
            suffix="us"
            dense
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="speedY"
            v-model.number="scanConfig.speedY"
            type="number"
            outlined
            hide-details="auto"
            suffix="us"
            dense
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="speedZ"
            v-model.number="scanConfig.speedZ"
            type="number"
            outlined
            hide-details="auto"
            suffix="us"
            dense
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      scanConfig: {},
    };
  },
  mounted() {
    this.scanConfig = this.$store.state.scanConfig;
  },
  methods: {
    updateState() {
      console.log(this.scanConfig);
      this.$store.commit(
        "setObject",
        "scanConfig",
        JSON.stringify(this.scanConfig)
      );
    },
  },
};
</script>
