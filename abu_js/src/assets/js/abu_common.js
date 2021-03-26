export default class AbuCommon {
  /**
   * create a date string
   * @return {string} uuid
   * @example
   * const uuid=AbuCommon.getDateString();
   * // uuid="fu20210320-184446";
   */
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

  /**
   * create common scan configuration
   * @param {object} state - this.$store.state
   * @return {object} common scan configuration.
   */
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

  /**
   * create an object for /prudaq
   * @param {object} state - this.$store.state
   * @return {object} create an object for /prudaq
   */
  static createPrudaqPostData(state) {
    const { prudaq } = state.a;
    const address = `http://${prudaq.host}:${prudaq.port}/prudaq`;
    const { count } = state.a.udp;
    const data = { count };
    return { address, data };
  }

  /**
   * create an object for /stage/scan
   * @param {object} state - this.$store.state
   * @return {object} create an object for /stage/scan
   */
  static createScanPostData(state) {
    const { bbai } = state.a.scanDetailedConfig;
    const bbaiAddress = `http://${bbai.host}:${bbai.port}/stage/scan`;
    const {
      pinConfig,
      invert,
      aomOpenHl,
    } = state.a.scanDetailedConfig.pinConfig;
    const {
      stepPeriodX,
      stepPeriodY,
      stepPeriodZ,
      aomOpenUs,
      xyRepeatNum,
      xyzRepeatNum,
    } = state.a.scanConfig;
    const {
      xFSteps,
      xBSteps,
      yFStepSeqs,
      yFStepsPerSeq,
      yBSteps,
      zFStepSeqs,
      zFStepsPerSeq,
      zBSteps,
    } = state.a.imageCalc;
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

  /**
   * create an object for /stage/scan
   * @param {object} state - this.$store.state
   * @param {string} uuid
   * @returns {Promise} if succeeded, return inserted data (array)
   */
  static async register2Db(state, command, uuid = null) {
    const doc = { ...state.a, position: state.g.position, command };
    if (uuid !== null) {
      doc.uuid = uuid;
    } else {
      doc.uuid = AbuCommon.getDateString();
    }
    return new Promise((resolve, reject) => {
      state.d.db.commands.insert(doc, (err, newDoc) => {
        if (err === null) {
          resolve(newDoc);
        } else {
          reject(err);
        }
      });
    });
  }

  /* eslint-disable implicit-arrow-linebreak */

  /**
   * create an object for /
   * @param {object} omeMetaData
   * @return {object} load detailed info of omeMetaData
   */
  static getOmeDetail(omeMetaData) {
    const opticsOptions = JSON.parse(localStorage.getItem("opticsOptions"));
    console.log(opticsOptions.Detectors);
    const detector = opticsOptions.Detectors.find(
      (doc) => doc["@Model"] === omeMetaData.detectorName
    );
    const filter = opticsOptions.Filters.find(
      (doc) => doc["@Model"] === omeMetaData.filterName
    );
    const dichroic = opticsOptions.Dichroics.find(
      (doc) => doc["@Model"] === omeMetaData.dichroicName
    );
    const objective = opticsOptions.Dichroics.find(
      (doc) => doc["@Model"] === omeMetaData.dichroicName
    );

    const {
      baseOme,
      laserPower,
      pmtGain,
      imageName,
      description,
    } = omeMetaData;
    return {
      detector,
      filter,
      dichroic,
      objective,
      baseOme,
      laserPower,
      pmtGain,
      imageName,
      description,
    };
  }

  /**
   * create an object for /
   * @param {object} state - this.$store.state
   * @param {string} uuid
   * @return {object} create an object for /receiver
   */
  static async createReceiverPostData(state) {
    const uuid = AbuCommon.getDateString();
    const {
      daServer,
      fileSave,
      omeMetaData,
      receiver,
      scanConfig,
      udp,
      websocket,
    } = state.a;
    const { position } = state.g;
    const { baseOme } = omeMetaData;
    const baseOmeObj = await new Promise((resolve, reject) => {
      state.d.db.ome.find(
        { name: baseOme },
        /* eslint implicit-arrow-linebreak: ["error", "below"] */
        (err, docs) => {
          if (err !== null) {
            console.error("error is ", err);
            reject(err);
          } else {
            resolve(docs);
          }
        }
      );
    });

    console.log(this.getOmeDetail(omeMetaData));
    const ome = {
      omeXml: baseOmeObj[0],
      ...this.getOmeDetail(omeMetaData),
    };
    const receiverAddress = `http://${receiver.host}:${receiver.port}/receiver`;
    const { sizeX, sizeY, sizeZ, xFSteps } = state.a.imageCalc;
    const image = {
      ...state.a.image,
      sizeX,
      sizeY,
      sizeZ,
      xFSteps,
    };
    const { galvo, verbosity } = state.a.globalConfig;
    const data = {
      daServer,
      fileSave,
      galvo,
      image,
      ome,
      position,
      scanConfig,
      udp,
      uuid,
      verbosity,
      websocket,
    };
    return { address: receiverAddress, data };
  }
}
