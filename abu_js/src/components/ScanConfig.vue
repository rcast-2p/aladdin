<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header>other configuration</v-expansion-panel-header>
      <v-expansion-panel-content>
        <h2>resolution & invert</h2>
        <v-row>
          <v-col cols="3" v-for="(_, sI) in scanConfig.sReso" :key="sI">
            <v-select
              :label="sI"
              v-model="scanConfig.sReso[sI]"
              :items="resolutionOptions"
              outlined
              hide-details="auto"
              dense
            />
          </v-col>
          <v-col cols="3">
            <v-select
              label="invert"
              v-model.number="scanConfig.sCom.invert"
              :items="invertOptions"
              type="number"
              outlined
              hide-details="auto"
              dense
            />
          </v-col>
          <v-col cols="3">
            <v-select
              label="aom open"
              :items="[
                { text: 'high', value: 1 },
                { text: 'low', value: 0 },
              ]"
              v-model.number="scanConfig.sCom.aomOpenHl"
              outlined
              type="number"
              hide-details="auto"
              dense
            />
          </v-col>
        </v-row>
        <h2>pin & address</h2>
        <v-row>
          <v-col
            v-for="(pin, pkey) in scanConfig.pinConfig"
            :key="pkey"
            cols="2"
          >
            <v-text-field
              :label="pin.name"
              type="number"
              v-model.number="pin.value"
              hide-details="auto"
              dense
              outlined
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="BBAI address"
              v-model="scanConfig.bbai.address"
              hide-details="auto"
              dense
              outlined
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="BBAI port"
              v-model.number="scanConfig.bbai.port"
              hide-details="auto"
              dense
              outlined
              type="number"
            />
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
export default {
  data() {
    return {
      scanConfig: { sCom: {}, sReso: {}, pinConfig: [], bbai: {} },
      resolutionOptions: [
        { text: "0.2 um (10 div 6)", value: 0.2 },
        { text: "0.25 um (8 div 5)", value: 0.25 },
        { text: "0.4 um (5 div 4)", value: 0.4 },
        { text: "0.5 um (4 div 3)", value: 0.5 },
        { text: "0.8 um (2.5 div 2)", value: 0.8 },
        { text: "1.0 um (2 div 1)", value: 1.0 },
        { text: "2.0 um (1 div 0)", value: 2.0 },
      ],
      invertOptions: [
        { text: "false", value: 0 },
        { text: "true", value: 1 },
      ],
    };
  },
  mounted() {
    this.scanConfig = this.$store.state.scanConfig;
  },
  methods: {
    updateState() {
      console.log(this.daServer);
      this.$store.commit(
        "setObject",
        "scanConfig",
        JSON.stringify(this.scanConfig)
      );
    },
  },
};
</script>
