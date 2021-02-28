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
    const { speedX, speedY, speedZ } = state.scanConfig;
    const { aomOpenHl, invert } = state.scanDetailedConfig;

    const { bbai } = state.scanDetailedConfig;
    const bbaiBaseURL = `http://${bbai.host}:${bbai.port}`;
    return {
      bbaiBaseURL,
      baseData: {
        uuid,
        invert,
        speedX,
        speedY,
        speedZ,
        aomOpenHl,
        pinConfig: state.scanDetailedConfig.pinConfig,
      },
    };
  }
}
