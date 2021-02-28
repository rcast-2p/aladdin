import Vue from "vue";
import Vuex from "vuex";
import DataStore from "nedb";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    db: {},
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
    },
    fileSave: {
      debug: "octo_test/0220/",
      enabled: true,
      rawData: "octo_test/0220/",
      rawDataSave: false,
      tiffSave: true,
    },
    image: {
      dataChan: 0, // fixed by circuit
      pixelDataNum: 10,
      sizeX: 100, // currently the same as lengthX
      sizeY: 100, // calculated from lengthY, yFResolution, yPrevEveryLength
      sizeZ: 5, // calculated from scanZLength and scanZELength
      threshold: 100,
      xFSteps: 400, // calculated from lengthX and xFResolution
      xBSteps: 400, // calculated from lengthX and xBResolution
      yFSteps: 400, // calculated from lengthY and yFResolution
      yBSteps: 400, // calculated from lengthY and yBResolution
      zFSteps: 400, // calculated from lengthZ and zFResolution
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
      yPrevEveryLength: 5,
      lengthZ: 100,
      scanZELength: 100,
      xyRepeatNum: 1,
      xyzRepeatNum: 1,
      aomOpenUs: 1.0,
      speedX: 75,
      speedY: 500,
      speedZ: 500,
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
      description: "",
    },
  },
  mutations: {
    connect(state) {
      state.db.commands = new DataStore({
        filename: "commands.db",
        timestampData: true,
      });
      state.db.ome = new DataStore({ filename: "ome.db", timestampData: true });
      state.db.commands.loadDatabase();
      state.db.ome.loadDatabase();
    },
    setObject(state, key, objstr) {
      state[key] = JSON.parse(objstr);
    },
  },
  getters: {},
  actions: {},
  modules: {},
});
