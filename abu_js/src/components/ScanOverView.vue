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
      return this.$store.state.scanConfig.lengthX;
    },
    sizeY() {
      return (
        this.$store.state.scanConfig.lengthY /
        this.$store.state.scanConfig.yFLengthPerSeq
      );
    },
    sizeZ() {
      return (
        this.$store.state.scanConfig.lengthZ /
        this.$store.state.scanConfig.zFLengthPerSeq
      );
    },
    zFLengthPerSeq() {
      return this.$store.state.scanConfig.zFLengthPerSeq;
    },
    xFSteps() {
      return (
        this.$store.state.scanConfig.lengthX /
        this.$store.state.scanDetailedConfig.sReso.xFResolution
      );
    },
    xBSteps() {
      return (
        this.$store.state.scanConfig.lengthX /
        this.$store.state.scanDetailedConfig.sReso.xBResolution
      );
    },
    yFStepSeqs() {
      return (
        this.$store.state.scanConfig.lengthY /
        this.$store.state.scanConfig.yFLengthPerSeq
      );
    },
    yFStepsPerSeq() {
      return (
        this.$store.state.scanConfig.yFLengthPerSeq /
        this.$store.state.scanDetailedConfig.sReso.yFResolution
      );
    },
    yBSteps() {
      return (
        this.$store.state.scanConfig.lengthY /
        this.$store.state.scanDetailedConfig.sReso.yBResolution
      );
    },
    zFStepSeqs() {
      return (
        this.$store.state.scanConfig.lengthZ /
        this.$store.state.scanConfig.zFLengthPerSeq
      );
    },
    zFStepsPerSeq() {
      return (
        this.$store.state.scanConfig.zFLengthPerSeq /
        this.$store.state.scanDetailedConfig.sReso.zFResolution
      );
    },
    zBSteps() {
      return (
        this.$store.state.scanConfig.lengthZ /
        this.$store.state.scanDetailedConfig.sReso.zBResolution
      );
    },
    durationUs() {
      const { stepPeriodX, stepPeriodY } = this.$store.state.scanConfig;
      const durationUs =
        (this.xFSteps + this.xBSteps) * stepPeriodX * this.yFStepSeqs +
        (this.yFStepSeqs * this.yFStepsPerSeq + this.yBSteps) * stepPeriodY;
      return durationUs;
    },
    onePlaneDuration() {
      const { stepPeriodX, stepPeriodY } = this.$store.state.scanConfig;
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
      } = this.$store.state.scanConfig;
      const wholeUs =
        ((this.durationUs * xyRepeatNum + stepPeriodZ * this.zFStepsPerSeq) *
          this.zFStepSeqs +
          this.zBSteps * stepPeriodZ) *
        xyzRepeatNum;
      return wholeUs;
    },
    samplingRate() {
      return this.$store.state.udp.samplingRate;
    },
    bufferSize() {
      return this.$store.state.udp.bufferSize;
    },
    extraCount() {
      return this.$store.state.udp.extraCount;
    },
    packetCount() {
      return Math.ceil((this.wholeUs * this.samplingRate) / this.bufferSize);
    },
    wholeScan() {
      const {
        stepPeriodZ,
        xyRepeatNum,
        xyzRepeatNum,
      } = this.$store.state.scanConfig;
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
    // scanOverview() {
    //   const { yFLengthPerSeq } = this.$store.state.scanConfig;
    //   const zMoveDuration = ((zFStepSeqs + zBSteps) * this.sSpeed.z) / 1000;
    //   const totalDuration =
    //     (this.onePlaneDuration * this.zPageNum + zMoveDuration) *
    //     this.sCom.xyzRepeatNum;
    //   const totalMin = (totalDuration / 60000).toFixed(1);
    //   const packets = (totalDuration * this.config.samplingRate * 1000) / 16000;
    //   return [
    //     `single xy: ((${xFSteps}+${xBSteps}) x ${yFStepSeqs} x ${this.sSpeed.x}
    // + (${yFStepSeqsPerSeq} x ${yFStepSeqs}+ ${yBSteps})x ${this.sSpeed.y})
    // / 1000=${this.onePlaneDuration} ms`,
    //     `z plane num: ${this.zPageNum} (${this.zFPlaneNum})`,
    //     `      total: (${this.onePlaneDuration} x ${this.zPageNum} +
    // ${zMoveDuration}) x ${this.sCom.xyzRepeatNum} =  ${totalDuration} ms (${totalMin} min)`,
    //     `${packets.toFixed(1)} packets (${this.packetNum}) `,
    //   ];
    // },
  },
};
</script>
