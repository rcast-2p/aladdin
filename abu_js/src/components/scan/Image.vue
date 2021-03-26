<template>
  <v-row no-gutters class="py-2">
    <v-col cols="1">Image</v-col>
    <v-col cols="11">
      <v-row no-gutters>
        <v-col cols="2">
          <v-text-field
            label="threshold"
            v-model.number="image.threshold"
            type="number"
            outlined
            hide-details="auto"
            dense
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="data channel"
            v-model.number="image.dataChan"
            type="number"
            outlined
            hide-details="auto"
            dense
            @change="updateState"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="pixel data num"
            v-model.number="image.pixelDataNum"
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
      image: {},
    };
  },
  mounted() {
    this.image = { ...this.$store.state.a.image };
  },
  watch: {
    generation() {
      this.image = { ...this.$store.state.a.image };
    },
  },
  computed: {
    generation() {
      return this.$store.state.g.generation;
    },
  },
  methods: {
    updateState() {
      console.log(this.image);
      this.$store.commit("setObject", "image", JSON.stringify(this.image));
    },
  },
};
</script>
