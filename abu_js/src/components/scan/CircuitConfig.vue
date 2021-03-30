<template>
  <v-row>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header
          >other configuration
          <span v-if="noHwConfig">
            <v-icon color="red">mdi-alert</v-icon
            ><a to="config">please set hwconfig</a>
          </span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <h2>resolution & invert</h2>
          <v-row>
            <v-col
              cols="3"
              v-for="(_, sI) in scanDetailedConfig.sReso"
              :key="sI"
            >
              <v-select
                :label="sI"
                v-model="scanDetailedConfig.sReso[sI]"
                :items="resolutionOptions[sI.slice(0, 1)]"
                outlined
                hide-details="auto"
                dense
                @change="updateState"
              />
            </v-col>
            <v-col cols="3">
              <v-select
                label="invert"
                v-model.number="scanDetailedConfig.invert"
                :items="invertOptions"
                type="number"
                outlined
                hide-details="auto"
                dense
                @change="updateState"
              />
            </v-col>
            <v-col cols="3">
              <v-select
                label="aom open"
                :items="[
                  { text: 'high', value: 1 },
                  { text: 'low', value: 0 },
                ]"
                v-model.number="scanDetailedConfig.aomOpenHl"
                outlined
                type="number"
                hide-details="auto"
                dense
                @change="updateState"
              />
            </v-col>
          </v-row>
          <h2>pin & address</h2>
          <v-row>
            <v-col
              v-for="(pin, pkey) in scanDetailedConfig.pinConfig"
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
                @change="updateState"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="BBAI address"
                v-model="scanDetailedConfig.bbai.host"
                hide-details="auto"
                dense
                outlined
                @change="updateState"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="BBAI port"
                v-model.number="scanDetailedConfig.bbai.port"
                hide-details="auto"
                dense
                outlined
                type="number"
                @change="updateState"
              />
            </v-col>
          </v-row>
          <h2>delay</h2>
          <v-row>
            <v-col cols="4">
              <v-text-field
                label="delay"
                v-model.number="scanDetailedConfig.delay"
                hide-details="auto"
                dense
                outlined
                suffix="ms"
                type="number"
                @change="updateState"
              />
            </v-col>
          </v-row>
          <h2>range</h2>
          <v-row>
            <v-col cols="8">
              <ul>
                <li><b>x</b> {{ limits.x.min }} - {{ limits.x.max }} [um]</li>
                <li><b>y</b> {{ limits.y.min }} - {{ limits.x.max }} [um]</li>
                <li><b>z</b> {{ limits.z.min }} - {{ limits.x.max }} [um]</li>
              </ul>
            </v-col>
            <v-col cols="4">
              <v-btn to="hwconfig">HW config</v-btn>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
</template>
<script>
export default {
  computed: {
    generation() {
      return this.$store.state.g.generation;
    },
  },
  data() {
    return {
      scanDetailedConfig: { sReso: {}, pinConfig: [], bbai: {} },
      resolutionOptions: { x: [], y: [], z: [] },
      limits: {
        x: { min: 0, max: 100 },
        y: { min: 0, max: 100 },
        z: { min: 0, max: 100 },
      },
      invertOptions: [
        { text: "false", value: 0 },
        { text: "true", value: 1 },
      ],
      noHwConfig: false,
    };
  },
  mounted() {
    this.scanDetailedConfig = { ...this.$store.state.a.scanDetailedConfig };

    const stageHwConfig = JSON.parse(localStorage.getItem("stageHwConfig"));
    if (stageHwConfig === null) {
      this.noHwConfig = true;
      return;
    }
    this.resolutionOptions = stageHwConfig.resolutionOptions;
    this.limits = stageHwConfig.limits;
  },
  watch: {
    generation() {
      this.scanDetailedConfig = { ...this.$store.state.a.scanDetailedConfig };
    },
  },
  methods: {
    updateState() {
      this.$store.commit("setObject", {
        key: "scanDetailedConfig",
        content: JSON.stringify(this.scanDetailedConfig),
      });
    },
  },
};
</script>
