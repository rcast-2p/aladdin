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
          />
        </v-col>
        <v-col cols="3">
          <v-switch
            label="websocket thread"
            v-model="websocket.enabled"
            outlined
            dense
            color="red darken-4"
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
      image: {},
    };
  },
  mounted() {
    this.image = this.$store.state.image;
  },
  // computed: {
  //   count() {
  //     return this.$store.state.image.count;
  //   },
  // },
  // watch: {
  //   count() {
  //     this.image.count = this.count;
  //   },
  // },
  methods: {
    updateState() {
      console.log(this.image);
      this.$store.commit("setObject", "image", JSON.stringify(this.image));
    },
  },
};
</script>
