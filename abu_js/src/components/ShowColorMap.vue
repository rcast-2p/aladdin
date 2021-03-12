<template>
  <div>
    <span v-if="nocolormap">
      <v-icon color="red">mdi-alert</v-icon>please set colormap
    </span>
    <canvas id="show-color-map" ref="canvas"></canvas>
  </div>
</template>
<script>
export default {
  data() {
    return {
      nocolormap: false,
      ctx: {},
    };
  },
  mounted() {
    const { canvas } = this.$refs;
    canvas.width = 256;
    canvas.height = 1;
    this.ctx = canvas.getContext("2d");
    const colormap = JSON.parse(localStorage.getItem("colormap"));
    if (colormap === null) {
      this.nocolormap = true;
      return;
    }
    this.showColorMap(colormap);
  },
  methods: {
    showColorMap(colormap) {
      const arr = new Uint8ClampedArray(colormap);
      const plusImageData = new ImageData(arr, 256);
      this.ctx.putImageData(plusImageData, 0, 0);
    },
  },
};
</script>
<style scoped>
#show-color-map {
  border: solid 1px black;
  width: 512px;
  height: 8px;
}
</style>
