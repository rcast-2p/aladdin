<template>
  <v-row no-gutters>
    <v-col cols="2">DA server</v-col>
    <v-col cols="10">
      <v-row no-gutters>
        <v-col cols="3">
          <v-text-field
            label="DA host"
            v-model="daServer.host"
            outlined
            hide-details="auto"
            dense
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="DA port"
            v-model="daServer.port"
            outlined
            hide-details="auto"
            dense
            type="number"
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="DA path"
            v-model="daServer.path"
            outlined
            hide-details="auto"
            dense
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-switch
            label="DA thread"
            v-model="daServer.enabled"
            outlined
            dense
            color="orange darken-4"
            @change="updateState"
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
      daServer: {},
    };
  },
  mounted() {
    this.daServer = { ...this.$store.state.a.daServer };
  },
  computed: {
    generation() {
      return this.$store.state.g.generation;
    },
  },
  watch: {
    generation() {
      this.daServer = { ...this.$store.state.a.daServer };
    },
  },
  methods: {
    updateState() {
      this.$store.commit("setObject", {
        key: "daServer",
        content: JSON.stringify(this.daServer),
      });
    },
  },
};
</script>
