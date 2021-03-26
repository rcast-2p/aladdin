<template>
  <v-row no-gutters>
    <v-col cols="2">WebSocket</v-col>
    <v-col cols="10">
      <v-row no-gutters>
        <v-col cols="3">
          <v-text-field
            label="host"
            v-model="websocket.host"
            outlined
            hide-details="auto"
            dense
            disabled
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="port"
            v-model.number="websocket.port"
            type="number"
            outlined
            hide-details="auto"
            dense
            disabled
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="interval (float)"
            v-model.number="websocket.interval"
            type="number"
            outlined
            hide-details="auto"
            suffix="msec"
            dense
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-switch
            label="websocket thread"
            v-model="websocket.enabled"
            outlined
            dense
            color="red darken-4"
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
      websocket: {},
    };
  },
  mounted() {
    this.websocket = { ...this.$store.state.a.websocket };
  },
  computed: {
    generation() {
      return this.$store.state.g.generation;
    },
  },
  watch: {
    generation() {
      this.websocket = { ...this.$store.state.a.websocket };
    },
  },
  methods: {
    updateState() {
      this.$store.commit("setObject", {
        key: "websocket",
        content: JSON.stringify(this.websocket),
      });
    },
  },
};
</script>
