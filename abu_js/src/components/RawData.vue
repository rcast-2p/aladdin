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
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="debug"
            v-model="fileSave.debug"
            outlined
            hide-details="auto"
            dense
          />
        </v-col>
        <v-col cols="3">
          <v-switch label="galvo mode" v-model="galvo" outlined dense />
        </v-col>
        <v-col cols="3">
          <v-switch
            label="tiff save"
            v-model="fileSave.tiffSave"
            outlined
            dense
          />
        </v-col>
        <v-col cols="3">
          <v-switch
            label="raw data save"
            v-model="fileSave.rawDataSave"
            outlined
            dense
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
          />
        </v-col>
        <v-col cols="3">
          <v-switch
            label="verbosity"
            v-model="verbosity"
            outlined
            dense
            color="blue darken-4"
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
      rawdata: {},
    };
  },
  mounted() {
    this.rawdata = this.$store.state.rawdata;
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
    updateState() {
      console.log(this.rawdata);
      this.$store.commit("setObject", "rawdata", JSON.stringify(this.rawdata));
    },
  },
};
</script>
