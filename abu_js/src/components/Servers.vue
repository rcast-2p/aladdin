<template>
  <v-row no-gutters>
    <v-col cols="2">Servers</v-col>
    <v-col cols="10">
      <v-row no-gutters>
        <v-col cols="3">
          <v-text-field
            label="BBB host"
            v-model="prudaq.host"
            outlined
            hide-details="auto"
            dense
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="BBB port"
            v-model="prudaq.port"
            outlined
            hide-details="auto"
            dense
            type="number"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="receiver host"
            v-model="receiver.host"
            outlined
            hide-details="auto"
            dense
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="receiver port"
            v-model="receiver.port"
            outlined
            hide-details="auto"
            dense
            type="number"
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
      prudaq: {},
      receiver: {},
    };
  },
  mounted() {
    this.prudaq = this.$store.state.prudaq;
    this.receiver = this.$store.state.receiver;
  },
  // computed: {
  //   count() {
  //     return this.$store.state.servers.count;
  //   },
  // },
  // watch: {
  //   count() {
  //     this.servers.count = this.count;
  //   },
  // },
  methods: {
    updateState() {
      console.log(this.servers);
      this.$store.commit("setObject", "prudaq", JSON.stringify(this.prudaq));
      this.$store.commit(
        "setObject",
        "receiver",
        JSON.stringify(this.receiver)
      );
    },
  },
};
</script>
