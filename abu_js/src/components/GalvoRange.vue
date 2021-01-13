<template>
  <div>
    <v-text-field
      label="x min"
      type="number"
      v-model.number="scanRangeVal.xmin"
    />
    <v-text-field
      label="x max"
      type="number"
      v-model.number="scanRangeVal.xmax"
    />
    <v-text-field
      label="y min"
      type="number"
      v-model.number="scanRangeVal.ymin"
    />
    <v-text-field
      label="y max"
      type="number"
      v-model.number="scanRangeVal.ymax"
    />
    <v-textarea label="baseConfig" v-model="baseConfigStr" />
    <div>
      {{ optDegree }}
      {{ scanRange }}
      {{ speed }}
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      lbbit: 0,
      scanRangeVal: {
        xmin: -32767,
        xmax: 0,
        ymin: 0,
        ymax: 0,
      },
      baseConfigStr: "",
    };
  },
  created() {
    const baseConfig = JSON.parse(localStorage.getItem("galvoConfig"));
    this.baseConfigStr = JSON.stringify(baseConfig, null, "\t");
  },
  computed: {
    baseConfig() {
      try {
        const baseConfig = JSON.parse(this.baseConfigStr);
        localStorage.setItem("galvoConfig", this.baseConfigStr);
        return baseConfig;
      } catch {
        return {
          evm: { gain: 2, vref: 5 },
          objective: { focalLength: 9 },
          beamExpansion: 5,
          galvo: { voltsDegree: 0.5 },
        };
      }
    },
    voutCoef() {
      return (this.baseConfig.evm.gain * this.baseConfig.evm.vref) / 65536;
    },
    mechDegreeCoef() {
      return this.voutCoef / this.baseConfig.galvo.voltsDegree;
    },
    speed() {
      return this.voutCoef * 5e7;
    },
    scanRangeCoef() {
      return (
        ((1000 * this.baseConfig.objective.focalLength) /
          this.baseConfig.beamExpansion /
          180) *
        this.mechDegreeCoef *
        2 *
        3.14
      );
    },
    optDegree() {
      return {
        xmin: (this.mechDegreeCoef * this.scanRangeVal.xmin).toFixed(1),
        xmax: (this.mechDegreeCoef * this.scanRangeVal.xmax).toFixed(1),
        ymin: (this.mechDegreeCoef * this.scanRangeVal.ymin).toFixed(1),
        ymax: (this.mechDegreeCoef * this.scanRangeVal.ymax).toFixed(1),
      };
    },
    scanRange() {
      return {
        xmin: (this.scanRangeCoef * this.scanRangeVal.xmin).toFixed(1),
        xmax: (this.scanRangeCoef * this.scanRangeVal.xmax).toFixed(1),
        ymin: (this.scanRangeCoef * this.scanRangeVal.ymin).toFixed(1),
        ymax: (this.scanRangeCoef * this.scanRangeVal.ymax).toFixed(1),
      };
    },
  },
};
</script>
