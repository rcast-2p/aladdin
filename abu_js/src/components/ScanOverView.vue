<template></template>
<script>
export default {
  data() {},
  computed: {
    sizeX() {
      return this.$store.state.scanConfig.lengthX;
    },
    sizeY() {
      return (
        this.$store.state.scanConfig.lengthY /
        this.$store.state.scanConfig.yPrevEveryLength
      );
    },
    sizeZ() {
      return (
        this.$store.state.scanConfig.lengthZ /
        this.$store.state.scanConfig.scanZELength
      );
    },
  },
  methods: {
    scanOverview() {
      const {
        xFSteps,
        xBSteps,
        yFSteps,
        yBSteps,
        zFSteps,
        zBSteps,
      } = this.$store.state.image;
      const { yPrevEveryLength } = this.$store.state.scanConfig;
      const zMoveDuration = ((zFSteps + zBSteps) * this.sSpeed.z) / 1000;
      const totalDuration =
        (this.onePlaneDuration * this.zPageNum + zMoveDuration) *
        this.sCom.xyzRepeatNum;
      const totalMin = (totalDuration / 60000).toFixed(1);
      const packets = (totalDuration * this.config.samplingRate * 1000) / 16000;
      return [
        `single xy: ((${xFSteps}+${xBSteps}) x ${yFSteps} x ${this.sSpeed.x} + (${yPrevEverySteps} x ${yFSteps}+ ${yBSteps})x ${this.sSpeed.y}) / 1000=${this.onePlaneDuration} ms`,
        `z plane num: ${this.zPageNum} (${this.zFPlaneNum})`,
        `      total: (${this.onePlaneDuration} x ${this.zPageNum} + ${zMoveDuration}) x ${this.sCom.xyzRepeatNum} =  ${totalDuration} ms (${totalMin} min)`,
        `${packets.toFixed(1)} packets (${this.packetNum}) `,
      ];
    },
  },
};
</script>

