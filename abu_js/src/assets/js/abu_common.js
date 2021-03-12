export default class AbuCommon {
  static getDateString() {
    const da = new Date();
    const hashLetter0 = String.fromCharCode((da.getTime() % 26) + 97);
    const hashLetter1 = String.fromCharCode((da.getSeconds() % 26) + 97);
    const day =
      da.getFullYear() * 10000 + (da.getMonth() + 1) * 100 + da.getDate();
    const time =
      1000000 + da.getHours() * 10000 + da.getMinutes() * 100 + da.getSeconds();
    const timeStr = String(time).slice(1);
    return `${hashLetter0}${hashLetter1}${day}-${timeStr}`;
  }

  static commonScanConfig(state) {
    const uuid = this.getDateString();
    const { stepPeriodX, stepPeriodY, stepPeriodZ } = state.scanConfig;
    const { aomOpenHl, invert } = state.scanDetailedConfig;

    const { bbai } = state.scanDetailedConfig;
    const bbaiBaseURL = `http://${bbai.host}:${bbai.port}`;
    return {
      bbaiBaseURL,
      baseData: {
        uuid,
        invert,
        stepPeriodX,
        stepPeriodY,
        stepPeriodZ,
        aomOpenHl,
        pinConfig: state.scanDetailedConfig.pinConfig,
      },
    };
  }

  static createScanPostData(context) {
    const { bbai } = context.state.scanDetailedConfig;
    const bbaiAddress = `http://${bbai.host}:${bbai.port}`;
    const {
      pinConfig,
      invert,
      aomOpenHl,
    } = context.state.scanDetailedConfig.pinConfig;
    const {
      stepPeriodX,
      stepPeriodY,
      stepPeriodZ,
      aomOpenUs,
      xyRepeatNum,
      xyzRepeatNum,
    } = context.state.scanConfig;
    const {
      xFSteps,
      xBSteps,
      yFStepSeqs,
      yFStepsPerSeq,
      yBSteps,
      zFStepSeqs,
      zFStepsPerSeq,
      zBSteps,
    } = context.state.imageCalc;
    const data = {
      pinConfig,
      invert,
      stepPeriodX,
      stepPeriodY,
      stepPeriodZ,
      aomOpenHl,
      aomOpenUs,
      xFSteps,
      xBSteps,
      yFStepSeqs,
      yFStepsPerSeq,
      yBSteps,
      zFStepSeqs,
      zFStepsPerSeq,
      zBSteps,
      xyRepeatNum,
      xyzRepeatNum,
      command: "scan",
    };
    return { address: bbaiAddress, data };
  }

  static createReceiverPostData(context) {
    const uuid = AbuCommon.getDateString();
    const { daServer, fileSave, udp, websocket } = context.state;
    const receiverAddress = `http://${udp.host}:${udp.port}`;
    const { sizeX, sizeY, sizeZ, xFSteps } = context.state.imageCalc;
    const image = {
      ...context.state.image,
      sizeX,
      sizeY,
      sizeZ,
      xFSteps,
    };
    const { galvo, verbosity } = context.state.globalConfig;
    const data = {
      daServer,
      fileSave,
      galvo,
      image,
      verbosity,
      udp,
      websocket,
      uuid,
    };
    return { address: receiverAddress, data };
  }
}
