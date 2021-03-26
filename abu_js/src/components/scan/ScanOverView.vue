<template>
  <v-row>
    <v-col>
      <v-icon>mdi-image</v-icon><b>tiff image size</b>{{ sizeX }} x
      {{ sizeY }} x {{ sizeZ }} <v-icon>mdi-cube</v-icon
      ><b>pixel size [um]</b> 1 x 1 x {{ zFLengthPerSeq }} <br />
      <v-icon>mdi-clock</v-icon>
      <b>one plane</b> {{ onePlaneDuration }} <br />
      <v-icon>mdi-clock</v-icon>
      <b>whole scan</b> {{ wholeScan }}
    </v-col>
  </v-row>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    sizeX() {
      return this.$store.state.a.scanConfig.lengthX;
    },
    sizeY() {
      return (
        this.$store.state.a.scanConfig.lengthY /
        this.$store.state.a.scanConfig.yFLengthPerSeq
      );
    },
    sizeZ() {
      return (
        this.$store.state.a.scanConfig.lengthZ /
        this.$store.state.a.scanConfig.zFLengthPerSeq
      );
    },
    zFLengthPerSeq() {
      return this.$store.state.a.scanConfig.zFLengthPerSeq;
    },
    xFSteps() {
      return (
        this.$store.state.a.scanConfig.lengthX /
        this.$store.state.a.scanDetailedConfig.sReso.xFResolution
      );
    },
    xBSteps() {
      return (
        this.$store.state.a.scanConfig.lengthX /
        this.$store.state.a.scanDetailedConfig.sReso.xBResolution
      );
    },
    yFStepSeqs() {
      return (
        this.$store.state.a.scanConfig.lengthY /
        this.$store.state.a.scanConfig.yFLengthPerSeq
      );
    },
    yFStepsPerSeq() {
      return (
        this.$store.state.a.scanConfig.yFLengthPerSeq /
        this.$store.state.a.scanDetailedConfig.sReso.yFResolution
      );
    },
    yBSteps() {
      return (
        this.$store.state.a.scanConfig.lengthY /
        this.$store.state.a.scanDetailedConfig.sReso.yBResolution
      );
    },
    zFStepSeqs() {
      return (
        this.$store.state.a.scanConfig.lengthZ /
        this.$store.state.a.scanConfig.zFLengthPerSeq
      );
    },
    zFStepsPerSeq() {
      return (
        this.$store.state.a.scanConfig.zFLengthPerSeq /
        this.$store.state.a.scanDetailedConfig.sReso.zFResolution
      );
    },
    zBSteps() {
      return (
        this.$store.state.a.scanConfig.lengthZ /
        this.$store.state.a.scanDetailedConfig.sReso.zBResolution
      );
    },
    durationUs() {
      const { stepPeriodX, stepPeriodY } = this.$store.state.a.scanConfig;
      const durationUs =
        (this.xFSteps + this.xBSteps) * stepPeriodX * this.yFStepSeqs +
        (this.yFStepSeqs * this.yFStepsPerSeq + this.yBSteps) * stepPeriodY;
      return durationUs;
    },
    onePlaneDuration() {
      const { stepPeriodX, stepPeriodY } = this.$store.state.a.scanConfig;
      let retStr = `(${this.xFSteps} + ${this.xBSteps}) x ${stepPeriodX} x ${this.yFStepSeqs} +`;
      retStr += `(${this.yFStepSeqs} x ${this.yFStepsPerSeq} + ${this.yBSteps}) x ${stepPeriodY} = `;
      retStr += (this.durationUs / 1000000).toFixed(2);
      retStr += ` [s]`;
      return retStr;
    },
    wholeUs() {
      const {
        stepPeriodZ,
        xyRepeatNum,
        xyzRepeatNum,
      } = this.$store.state.a.scanConfig;
      const wholeUs =
        ((this.durationUs * xyRepeatNum + stepPeriodZ * this.zFStepsPerSeq) *
          this.zFStepSeqs +
          this.zBSteps * stepPeriodZ) *
        xyzRepeatNum;
      return wholeUs;
    },
    samplingRate() {
      return this.$store.state.a.udp.samplingRate;
    },
    bufferSize() {
      return this.$store.state.a.udp.bufferSize;
    },
    extraCount() {
      return this.$store.state.a.udp.extraCount;
    },
    packetCount() {
      return Math.ceil(
        (this.wholeUs * this.samplingRate * 4) / this.bufferSize
      );
    },
    wholeScan() {
      const {
        stepPeriodZ,
        xyRepeatNum,
        xyzRepeatNum,
      } = this.$store.state.a.scanConfig;
      const wholeSec = (this.wholeUs / 1000000).toFixed(2);
      const wholeMin = (this.wholeUs / 60000000).toFixed(2);
      let retstr = `((${this.durationUs} x ${xyRepeatNum} + ${stepPeriodZ} x ${this.zFStepsPerSeq})`;
      retstr += ` x ${this.zFStepSeqs} + ${this.zBSteps} x ${stepPeriodZ}) x ${xyzRepeatNum} = ${wholeSec} [s] (${wholeMin} [min])`;
      retstr += ` ${this.packetCount} packets`;
      return retstr;
    },
  },

  watch: {
    wholeScan() {
      this.setImageCalc();
    },
  },
  mounted() {
    this.setImageCalc();
  },
  methods: {
    setImageCalc() {
      const imageCalc = {
        sizeX: this.sizeX,
        sizeY: this.sizeY,
        sizeZ: this.sizeZ,
        xFSteps: this.xFSteps,
        xBSteps: this.xBSteps,
        yFStepSeqs: this.yFStepSeqs,
        yFStepsPerSeq: this.yFStepsPerSeq,
        yBSteps: this.yBSteps,
        zFStepSeqs: this.zFStepSeqs,
        zFStepsPerSeq: this.zFStepsPerSeq,
        zBSteps: this.zBSteps,
      };
      this.$store.commit("setObject", {
        key: "imageCalc",
        content: JSON.stringify(imageCalc),
      });
      this.$store.commit("setScalar", {
        key0: "udp",
        key1: "count",
        content: this.packetCount + this.extraCount,
      });
    },
  },
};
</script>
