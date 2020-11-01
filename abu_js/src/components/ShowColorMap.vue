<template>
  <canvas id="show-color-map" ref="canvas"></canvas>
</template>
<script>
export default {
  data() {
    return { ctx: {} };
  },
  mounted() {
    const { canvas } = this.$refs;
    canvas.width = 256;
    canvas.height = 1;
    this.ctx = canvas.getContext("2d");
    const colormap = JSON.parse(localStorage.getItem("colormap"));
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
