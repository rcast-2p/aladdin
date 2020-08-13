<template>
  <div class="pulse">
    <v-row>
      <v-col cols="4">
        <v-text-field label="scanWidth" v-model="scanWidth" suffix="um" />
      </v-col>
      <v-col cols="4">
        <v-text-field label="scanHeight" v-model="scanHeight" suffix="um" />
      </v-col>
      <v-col cols="4">
        <v-select
          label="resolution"
          v-model="scanResolution"
          suffix="um"
          :items="resolutionOptions"
        />
      </v-col>
    </v-row>
    {{ scanOverview }}
    <v-btn @click="showAdvConfig = !showAdvConfig">show adv config</v-btn>
    <template v-if="showAdvConfig">
      <v-text-field label="return step" v-model="retStep" suffix="um" />
    </template>
  </div>
</template>
<script>
export default {
  data() {
    return {
      scanWidth: 100,
      scanHeight: 100,
      resolutionOptions: [
        { text: "0.5um (40div 9)", value: 0.5 },
        { text: "0.8um (25div 8)", value: 0.8 },
        { text: "1.0um (20div 7)", value: 1.0 },
        { text: "2.0um (10div 6)", value: 2.0 },
        { text: "2.5um (8div 5)", value: 2.5 },
        { text: "4.0um (5div 4)", value: 5.0 },
      ],
      scanResolution: 0.5,
      retStep: 10.0,
      showAdvConfig: false,
    };
  },
  computed: {
    scanOverview() {
      const wPixel = this.scanWidth / this.scanResolution;
      const wRetPixel = this.scanWidth / this.retStep;
      const hPixel = this.scanHeight / this.scanResolution;
      const hRetPixel = this.scanHeight / this.retStep;
      const onePlaneDuration = (wPixel + wRetPixel) * hPixel + hRetPixel;
      return `(${wPixel}+${wRetPixel}) x ${hPixel} + ${wRetPixel}=${onePlaneDuration} ms`;
    },
  },
  components: {},
};
</script>
