import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default {
  state: {
    daServer: {
      enabled: false,
      host: "0.0.0.0",
      path: "/da/mock",
      port: 9090,
    },
    udp: {
      bufferNum: 4096,
      bufferSize: 64020,
      count: 0,
      enabled: true,
      host: "192.168.2.100",
      port: 60000,
      samplingRate: 6.25,
      extraCount: 300,
    },
    fileSave: {
      debug: "octo_test/0220/",
      enabled: true,
      rawData: "octo_test/0220/",
      rawDataSave: false,
      tiffSave: true,
    },
    globalConfig: {
      verbosity: false,
      galvo: false,
    },
    image: {
      dataChan: 0, // fixed by circuit
      pixelDataNum: 10,
      threshold: 100,
    },
    imageCalc: {
      sizeX: 100, // currently the same as lengthX
      sizeY: 100, // calculated from lengthY, yFResolution, yFLengthPerSeq
      sizeZ: 5, // calculated from lengthZ and zFLengthPerSeq, xyRepeatNum, xyzRepeatNum
      xFSteps: 400, // calculated from lengthX and xFResolution
      xBSteps: 400, // calculated from lengthX and xBResolution
      yFStepSeqs: 400, // calculated from lengthY and yFLengthPerSeq
      yFStepsPerSeq: 400, // calculated from yFResolution and yFLengthPerSeq
      yBSteps: 400, // calculated from lengthY and yBResolution
      zFStepSeqs: 400, // calculated from lengthZ and zFResolution
      zFStepsPerSeq: 400, // calculated from lengthZ and zFResolution
      zBSteps: 400, // calculated from lengthZ and zBResolution
    },
    websocket: {
      enabled: true,
      host: "0.0.0.0",
      interval: 100.0,
      port: 8072, // need to change
    },
    scanConfig: {
      lengthX: 100,
      lengthY: 100,
      lengthZ: 100,
      yFLengthPerSeq: 5,
      zFLengthPerSeq: 100,
      xyRepeatNum: 1,
      xyzRepeatNum: 1,
      aomOpenUs: 1.0,
      stepPeriodX: 75,
      stepPeriodY: 500,
      stepPeriodZ: 500,
    },
    scanDetailedConfig: {
      bbai: {
        host: "192.168.2.101",
        port: 8070,
      },
      invert: 1, // fixed by circuit
      aomOpenHl: 1, // fixed by circuit
      sReso: {
        // fixed by circuit
        xFResolution: 1.0,
        xBResolution: 1.0,
        yFResolution: 1.0,
        yBResolution: 1.0,
        zFResolution: 1.0,
        zBResolution: 1.0,
      },
      pinConfig: [
        // fixed by circuit
        { name: "plsPin1", value: 1 },
        { name: "dirPin1", value: 2 },
        { name: "plsPin2", value: 3 },
        { name: "dirPin2", value: 4 },
        { name: "plsPin3", value: 5 },
        { name: "dirPin3", value: 6 },
        { name: "aomPin", value: 7 },
        { name: "aomRef", value: 8 },
      ],
      delay: 1000,
    },
    prudaq: {
      host: "192.168.2.104",
      port: 8070,
    },
    receiver: {
      host: "0.0.0.0",
      port: 8070,
    },
    omeMetaData: {
      baseOme: "atto488",
      laserPower: 0,
      pmtGain: 0,
      objectiveName: "olympus",
      filterName: "",
      dichroicName: "",
      imageName: "",
      detectorName: "",
      description: "",
    },
    minMax: {
      minimum: 0,
      maximum: 65536,
    },
  },
  mutations: {
    setObject(state, obj) {
      state[obj.key] = JSON.parse(obj.content);
    },
    setScalar(state, obj) {
      state[obj.key0][obj.key1] = obj.content;
    },
    setState(state, statestr) {
      const stateB = JSON.parse(statestr);
      // state.scanDetailedConfig = stateB.scanDetailedConfig;
      // eslint-disable-next-line no-param-reassign
      state.daServer = stateB.daServer;
      state.udp = stateB.udp;
      state.fileSave = stateB.fileSave;
      state.globalConfig = stateB.globalConfig;
      state.image = stateB.image;
      state.imageCalc = stateB.imageCalc;
      state.websocket = stateB.websocket;
      state.scanConfig = stateB.scanConfig;
      state.scanDetailedConfig = stateB.scanDetailedConfig;
      state.prudaq = stateB.prudaq;
      state.receiver = stateB.receiver;
      state.omeMetaData = stateB.omeMetaData;
      state.minMax = stateB.minMax;
    },
  },
  getters: {},
  actions: {},
  modules: {},
};
