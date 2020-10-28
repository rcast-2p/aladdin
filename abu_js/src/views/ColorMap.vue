<template>
  <div>
    <canvas id="canvas" ref="canvas"></canvas>
    <v-file-input
      v-model="file"
      placeholder="Upload your colormap"
      label="File input"
      prepend-icon="mdi-paperclip"
      @change="fileLoad"
    />
  </div>
</template>
<script>
export default {
  data() {
    return { ctx: {}, file: {} };
  },
  mounted() {
    const { canvas } = this.$refs;
    canvas.width = 256;
    canvas.height = 1;
    this.ctx = canvas.getContext("2d");
  },
  methods: {
    fileLoad() {
      console.log(this.file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const arr = [];
        const { result } = e.target;
        const lines = result.split("\n");
        lines.forEach((el) => {
          const line = el.split("\t");
          let numberLine = false;
          for (let i = 1; i <= 3; i += 1) {
            if (!Number.isNaN(Number(line[i]))) {
              arr.push(Number(line[i]));
              numberLine = true;
            }
          }
          if (numberLine) {
            arr.push(255);
          }
        });
        console.log(arr);
        localStorage.setItem("colormap", JSON.stringify(arr));
        this.showColorMap(arr);
      };
      reader.readAsText(this.file);
    },
    showColorMap(colormap) {
      const arr = new Uint8ClampedArray(colormap);
      const plusImageData = new ImageData(arr, 256);
      this.ctx.putImageData(plusImageData, 0, 0);
    },
  },
};
</script>
<style>
#canvas {
  border: solid 1px black;
  width: 512px;
  height: 512px;
}
</style>
