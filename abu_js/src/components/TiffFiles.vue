<template>
  <div>
    <v-row no-gutters>
      <v-col cols="3">
        <v-text-field label="minimum" type="number" v-model.number="minimum" />
        <v-slider v-model="minimumSli" max="65536" min="0" step="1"></v-slider>
      </v-col>
      <v-col cols="1">
        {{ imgMin }}
      </v-col>
      <v-col cols="3">
        <v-text-field label="maximum" type="number" v-model.number="maximum" />
        <v-slider v-model="maximumSli" max="65536" min="0" step="1"></v-slider>
      </v-col>
      <v-col cols="1">
        {{ imgMax }}
      </v-col>
      <v-col cols="4">
        <v-btn @click="increment" icon><v-icon>mdi-plus</v-icon></v-btn>
        <v-btn @click="increment(false)" icon><v-icon>mdi-minus</v-icon></v-btn>

        {{ pageIndex + 1 }}/{{ pageNum }}
        <v-btn @click="resetImgMaxMin" icon><v-icon>mdi-refresh</v-icon></v-btn>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="1">
        <v-btn text @click="windowId = (windowId + 1) % 2">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="10">
        <v-window v-model="windowId">
          <v-window-item :key="0">
            <v-row>
              <v-col cols="8">
                <v-file-input
                  accept="image/tiff"
                  v-model="file"
                  label="File input"
                  prepend-icon="mdi-paperclip"
                  @change="fileLoad"
                />
              </v-col>
            </v-row>
          </v-window-item>
          <v-window-item :key="1">
            <v-row>
              <v-col cols="3">
                <v-text-field v-model="folder" label="folder" />
              </v-col>
              <v-col cols="3">
                <v-btn @click="getFileList" icon
                  ><v-icon>mdi-refresh</v-icon></v-btn
                >
              </v-col>
              <v-col cols="4">
                <v-select
                  :items="fileList"
                  @change="getFiles"
                  v-model="filename"
                />
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-col>
      <v-col cols="1">
        <v-btn text @click="windowId = (windowId + 1) % 2">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <canvas ref="canvas" :style="canvasStyle" />
    </v-row>
    <v-row no-gutters>
      <v-text-field label="description" v-model="description"></v-text-field>
      <v-text-field
        label="canvasHeight"
        v-model.number="canvasHeight"
        type="number"
      ></v-text-field>
      <v-btn @click="writeJsonFile">write</v-btn>
    </v-row>
    <v-row no-gutters>
      <v-textarea label="json" v-model="configJson"></v-textarea>
    </v-row>
    <v-snackbar v-model="snackbar.show" v-text="snackbar.txt" />
  </div>
</template>
<script>
/* eslint comma-dangle:0 */
// import * as Tiff from "tiff.js";
import axios from "@/plugins/axios";
import * as tiff from "tiff";

export default {
  data() {
    return {
      file: {},
      width: 512,
      height: 512,
      tiffifd: {},
      maximum: 65536,
      maximumSli: 65536,
      minimum: 65000,
      minimumSli: 65000,
      colormap: [],
      pageIndex: 0,
      pageNum: 1,
      folder: "",
      filename: "",
      fileList: [],
      configJson: "",
      description: "",
      imgMax: 0,
      imgMin: 0,
      windowId: 0,
      snackbar: {
        show: false,
        txt: "",
      },
      canvasHeight: 512,
      updated: {},
    };
  },
  watch: {
    maximum(val) {
      if (this.maximumSli !== val) {
        this.maximumSli = val;
      }
      this.imageLoad();
    },
    minimum(val) {
      if (this.minimumSli !== val) {
        this.minimumSli = val;
      }
      this.imageLoad();
    },
    maximumSli(val) {
      if (this.maximum !== val) {
        this.maximum = val;
      }
    },
    minimumSli(val) {
      if (this.minimum !== val) {
        this.minimum = val;
      }
    },
  },
  mounted() {
    const cjso = JSON.parse(localStorage.getItem("colormap"));
    this.colormap = new Uint32Array(new Uint8Array(cjso).buffer);
    this.updated = new Date();
  },
  computed: {
    canvasStyle() {
      return {
        width: "512px",
        height: `${this.canvasHeight}px`,
      };
    },
  },
  methods: {
    resetImgMaxMin() {
      this.maximum = this.imgMax;
      this.minimum = this.imgMin;
    },
    increment(positive = true) {
      if (positive) {
        this.pageIndex = (this.pageIndex + 1) % this.pageNum;
      } else {
        this.pageIndex = (this.pageIndex + this.pageNum - 1) % this.pageNum;
      }
      this.imageLoad();
    },
    clamp256(val, max, min) {
      if (val > max) {
        return 255;
      }
      if (val < min) {
        return 0;
      }
      return Math.floor(((val - min) * 255) / (max - min));
    },
    imageLoad() {
      const imgBuffer = new ArrayBuffer(this.width * this.height * 4);
      const rgba = new Uint32Array(imgBuffer);
      let maxi = 0;
      let mini = 65536;
      for (let pI = 0; pI < this.width * this.height; pI += 1) {
        if (maxi < this.tiffifd[this.pageIndex].data[pI]) {
          maxi = this.tiffifd[this.pageIndex].data[pI];
        }
        if (
          mini > this.tiffifd[this.pageIndex].data[pI] &&
          this.tiffifd[this.pageIndex].data[pI] > 0
        ) {
          mini = this.tiffifd[this.pageIndex].data[pI];
        }
        rgba[pI] = this.colormap[
          this.clamp256(
            this.tiffifd[this.pageIndex].data[pI],
            this.maximum,
            this.minimum
          )
        ];
      }

      const arr = new Uint8ClampedArray(
        imgBuffer,
        0,
        // eslint-disable-next-line comma-dangle
        4 * this.height * this.width
      );
      const plusImageData = new ImageData(arr, this.width);
      const context = this.$refs.canvas.getContext("2d");
      context.putImageData(plusImageData, 0, 0);
      this.imgMax = maxi;
      this.imgMin = mini;
    },
    fileLoad() {
      this.pageIndex = 0;
      const reader = new FileReader();
      reader.onload = (buf) => {
        this.tiffifd = tiff.decode(buf.target.result);
        this.tiff2canvas();
        // const decoded = new Tiff({ buffer: buf.target.result });
      };

      reader.readAsArrayBuffer(this.file);
    },
    tiff2canvas() {
      this.pageNum = this.tiffifd.length;
      // eslint-disable-next-line prefer-destructuring
      this.width = this.tiffifd[0].fields.get(256);
      // eslint-disable-next-line prefer-destructuring
      this.height = this.tiffifd[0].fields.get(257);
      const { canvas } = this.$refs;
      canvas.width = this.width;
      canvas.height = this.height;
      this.imageLoad(0);
    },
    async getFileList() {
      const axres = await axios.get("http://localhost:8070/tiff/list", {
        params: { folder: this.folder },
      });
      this.fileList = axres.data.data.fileList;
    },
    getFiles() {
      this.getTiffFile();
      this.getJsonFile();
    },
    async getTiffFile() {
      const axres = await axios.get("http://localhost:8070/tiff/file", {
        params: {
          folder: this.folder,
          filename: this.filename,
          filetype: "tiff",
          renew: true,
        },
        responseType: "blob",
      });
      const blob = new Blob([axres.data]);
      const buf = await blob.arrayBuffer();
      const decoded = tiff.decode(buf);
      this.tiffifd = decoded;
      this.tiff2canvas();
    },
    async writeJsonFile() {
      try {
        const axres = await axios.post("http://localhost:8070/json/write", {
          description: this.description,
          filename: this.filename.replace("tiff", "json"),
        });
        this.snackbar = {
          show: true,
          text: `ファイル ${this.filename}への書き込みに成功しました。${axres.description}`,
        };
      } catch (e) {
        this.snackbar = {
          show: true,
          text: `ファイル ${this.filename}への書き込みエラーが発生しました。`,
        };
        console.error(e);
      }
    },
    async getJsonFile() {
      const axres = await axios.get("http://localhost:8070/tiff/file", {
        params: {
          folder: this.folder,
          filename: this.filename,
          filetype: "json",
        },
        responseType: "blob",
      });
      const blob = new Blob([axres.data]);
      const configJson = await blob.text();
      const parsedJson = JSON.parse(configJson);
      this.description = parsedJson.description;
      this.configJson = JSON.stringify(parsedJson, null, 2);
    },
  },
};
</script>
