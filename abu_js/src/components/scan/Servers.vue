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
            @change="updateState"
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
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="receiver host"
            v-model="receiver.host"
            outlined
            hide-details="auto"
            dense
            @change="updateState"
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
      prudaq: {},
      receiver: {},
    };
  },
  computed: {
    generation() {
      return this.$store.state.g.generation;
    },
  },
  mounted() {
    this.prudaq = { ...this.$store.state.a.prudaq };
    this.receiver = { ...this.$store.state.a.receiver };
  },
  watch: {
    generation() {
      this.prudaq = { ...this.$store.state.a.prudaq };
      this.receiver = { ...this.$store.state.a.receiver };
    },
  },
  methods: {
    updateState() {
      this.$store.commit("setObject", {
        key: "prudaq",
        content: JSON.stringify(this.prudaq),
      });
      this.$store.commit("setObject", {
        key: "receiver",
        content: JSON.stringify(this.receiver),
      });
    },
  },
};
</script>
