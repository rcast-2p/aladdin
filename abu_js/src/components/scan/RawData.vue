<template>
  <v-row no-gutters>
    <v-col cols="2">raw data</v-col>
    <v-col cols="10">
      <v-row no-gutters>
        <v-col cols="3">
          <v-text-field
            label="raw data"
            v-model="fileSave.rawData"
            outlined
            hide-details="auto"
            dense
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="debug"
            v-model="fileSave.debug"
            outlined
            hide-details="auto"
            dense
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-switch
            label="galvo mode"
            v-model="globalConfig.galvo"
            outlined
            dense
            @change="updateGlobalConfig"
          />
        </v-col>
        <v-col cols="3">
          <v-switch
            label="tiff save"
            v-model="fileSave.tiffSave"
            outlined
            dense
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-switch
            label="raw data save"
            v-model="fileSave.rawDataSave"
            outlined
            dense
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-switch
            label="save thread"
            v-model="fileSave.enabled"
            outlined
            dense
            disabled
            color="red darken-4"
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-switch
            label="verbosity"
            v-model="globalConfig.verbosity"
            outlined
            dense
            color="blue darken-4"
            @change="updateGlobalConfig"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      fileSave: {},
      globalConfig: {},
    };
  },
  mounted() {
    this.globalConfig = this.$store.state.a.globalConfig;
    this.fileSave = this.$store.state.a.fileSave;
    const da = new Date();
    const daStr = da.toISOString();
    const savePath = `octo_test/${daStr.slice(5, 7) + daStr.slice(8, 10)}/`;
    this.fileSave.debug = savePath;
    this.fileSave.rawData = savePath;
  },
  // computed: {
  //   count() {
  //     return this.$store.state.rawdata.count;
  //   },
  // },
  // watch: {
  //   count() {
  //     this.rawdata.count = this.count;
  //   },
  // },
  methods: {
    updateGlobalConfig() {
      this.$store.commit("setObject", {
        key: "globalConfig",
        content: JSON.stringify(this.globalConfig),
      });
    },
    updateState() {
      this.$store.commit("setObject", {
        key: "fileSave",
        content: JSON.stringify(this.fileSave),
      });
    },
  },
};
</script>
