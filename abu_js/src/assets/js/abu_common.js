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

  static commonScanConfig(config) {
    const uuid = this.getDateString();
    const speedX = config.sSpeed.x;
    const speedY = config.sSpeed.y;
    const speedZ = config.sSpeed.z;
    const { aomOpenHl, invert } = config.sCom;
    return {
      uuid,
      invert,
      speedX,
      speedY,
      speedZ,
      aomOpenHl,
      pinConfig: config.pinConfig,
    };
  }
}
