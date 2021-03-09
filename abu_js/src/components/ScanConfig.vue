<template>
  <v-row no-gutters class="py-2">
    <v-col cols="1">space </v-col>
    <v-col cols="11">
      <v-row no-gutters>
        <v-col cols="4">
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
        <v-col cols="4" offset="1">
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
        <v-col cols="3">
          <v-text-field
            label="yFLengthPerSeq"
            v-model.number="scanConfig.yFLengthPerSeq"
            suffix="um"
            type="number"
            outlined
            hide-details="auto"
            dense
          />
        </v-col>
        <v-col cols="4" offset="5">
          <v-text-field
            label="lengthZ"
            v-model.number="scanConfig.lengthZ"
            suffix="um"
            type="number"
            outlined
            hide-details="auto"
            dense
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="zFLengthPerSeq"
            v-model.number="scanConfig.zFLengthPerSeq"
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
        <v-col cols="4">
          <v-text-field
            label="xyRepeatNum"
            v-model.number="scanConfig.xyRepeatNum"
            type="number"
            outlined
            hide-details="auto"
            dense
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="xyzRepeatNum"
            v-model.number="scanConfig.xyzRepeatNum"
            type="number"
            outlined
            hide-details="auto"
            dense
          />
        </v-col>
        <v-col cols="4" offset="1">
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
        <v-col cols="4">
          <v-text-field
            label="stepPeriodX"
            v-model.number="scanConfig.stepPeriodX"
            type="number"
            outlined
            hide-details="auto"
            suffix="us"
            dense
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            label="stepPeriodY"
            v-model.number="scanConfig.stepPeriodY"
            type="number"
            outlined
            hide-details="auto"
            suffix="us"
            dense
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            label="stepPeriodZ"
            v-model.number="scanConfig.stepPeriodZ"
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
