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
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            label="pixel data num"
            v-model.number="image.pixelDataNum"
            outlined
            hide-details="auto"
            dense
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="pixel max"
            v-model.number="image.pixelMax"
            outlined
            hide-details="auto"
            dense
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="pixel min"
            v-model.number="image.pixelMin"
            outlined
            hide-details="auto"
            dense
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
