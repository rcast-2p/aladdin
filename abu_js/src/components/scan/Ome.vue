<template>
  <v-row no-gutters class="py-2">
    <v-col cols="1">OME</v-col>
    <v-col cols="11">
      <v-row no-gutters>
        <span v-if="noConfigError">
          <v-icon color="red">mdi-alert</v-icon>please set
          <a to="config">optics options</a>
        </span>
        <v-col cols="6">
          <v-text-field
            label="description"
            v-model="ome.description"
            type="text"
            outlined
            hide-details="auto"
            dense
            @change="updateState"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            label="name"
            v-model="ome.imageName"
            type="text"
            outlined
            hide-details="auto"
            dense
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="laser power"
            v-model.number="ome.laserPower"
            type="number"
            outlined
            hide-details="auto"
            dense
            suffix="mW"
            message="after objective"
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="gain"
            v-model.number="ome.pmtGain"
            type="number"
            outlined
            hide-details="auto"
            dense
            @change="updateState"
          />
        </v-col>
        <v-col cols="6">
          <v-select
            label="objective"
            v-model="ome.objectiveName"
            outlined
            hide-details="auto"
            dense
            @change="updateState"
            :items="objectiveItems"
          />
        </v-col>
        <v-col cols="6">
          <v-select
            label="filter"
            v-model="ome.filterName"
            outlined
            hide-details="auto"
            dense
            @change="updateState"
            :items="filterItems"
          />
        </v-col>
        <v-col cols="6">
          <v-select
            label="dichroic"
            v-model="ome.dichroicName"
            outlined
            hide-details="auto"
            dense
            @change="updateState"
            :items="dichroicItems"
          />
        </v-col>
        <v-col cols="6">
          <v-select
            label="detector"
            v-model="ome.detectorName"
            outlined
            hide-details="auto"
            dense
            @change="updateState"
            :items="detectorItems"
          />
        </v-col>
        <v-col cols="3">
          <v-select
            label="base ome xml"
            v-model="ome.baseOme"
            outlined
            hide-details="auto"
            dense
            @change="updateState"
            :items="xmlItems"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
import opticsOptionsJson from "@/assets/json/optics_options.json";

export default {
  computed: {
    generation() {
      return this.$store.state.g.generation;
    },
  },
  data() {
    return {
      ome: {},
      dichroicItems: [],
      filterItems: [],
      objectiveItems: [],
      detectorItems: [],
      xmlItems: [],
      noConfigError: false,
    };
  },
  mounted() {
    this.ome = this.$store.state.a.omeMetaData;
    let opticsOptions = JSON.parse(localStorage.getItem("opticsOptions"));
    if (opticsOptions === null) {
      console.log(opticsOptionsJson);
      opticsOptions = opticsOptionsJson;
      this.noConfigError = true;
    }
    this.dichroicItems = opticsOptions.Dichroics.map((el) => el["@Model"]);
    this.filterItems = opticsOptions.Filters.map((el) => el["@Model"]);
    this.objectiveItems = opticsOptions.Objectives.map((el) => el["@Model"]);
    this.detectorItems = opticsOptions.Detectors.map((el) => el["@Model"]);
    this.$store.state.d.db.ome.find({}, (err, docs) => {
      this.xmlItems = docs.map((el) => el.name);
    });
  },
  watch: {
    generation() {
      this.ome = JSON.parse(JSON.stringify(this.$store.state.a.omeMetaData));
    },
  },
  methods: {
    updateState() {
      this.$store.commit("setObject", {
        key: "omeMetaData",
        content: JSON.stringify(this.ome),
      });
    },
  },
};
</script>
