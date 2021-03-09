<template>
  <v-row no-gutters class="py-2">
    <v-col cols="1">UDP</v-col>
    <v-col cols="11">
      <v-row no-gutters>
        <v-col cols="3">
          <v-text-field
            label="udp port"
            v-model.number="udp.port"
            type="number"
            outlined
            hide-details="auto"
            dense
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="bufferSize"
            v-model.number="udp.bufferSize"
            type="number"
            suffix="byte"
            outlined
            hide-details="auto"
            dense
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="bufferNum"
            v-model.number="udp.bufferNum"
            type="number"
            outlined
            hide-details="auto"
            dense
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-switch
            label="udp thread"
            v-model="udp.enabled"
            outlined
            dense
            disabled
            color="red darken-4"
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="packet count"
            v-model.number="udp.count"
            outlined
            hide-details="auto"
            dense
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="host"
            v-model.number="udp.host"
            outlined
            hide-details="auto"
            dense
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="sampling rate"
            v-model.number="udp.samplingRate"
            outlined
            hide-details="auto"
            dense
            suffix="MHz"
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="extra packet"
            v-model.number="udp.extraCount"
            outlined
            hide-details="auto"
            dense
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
      udp: {},
    };
  },
  mounted() {
    this.udp = this.$store.state.udp;
  },
  computed: {
    count() {
      return this.$store.state.udp.count;
    },
  },
  watch: {
    count() {
      this.udp.count = this.count;
    },
  },
  methods: {
    updateState() {
      this.$store.commit("setObject", {
        key: "udp",
        content: JSON.stringify(this.udp),
      });
    },
  },
};
</script>
