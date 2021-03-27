<template>
  <div>
    <v-file-input
      v-model="file"
      label="File input"
      prepend-icon="mdi-paperclip"
      @change="fileLoad"
      accept="image/*"
    />
    <div class="rect-mother">
      <img :src="cameraImage" :style="rotateStyle" />
      <div
        v-for="(arrE, arrI) in rectArr"
        :key="arrI"
        :style="arrE"
        class="rect-child"
      ></div>
    </div>
    <v-row>
      <v-slider
        max="2.0"
        step="0.05"
        min="0.0"
        type="number"
        cols="4"
        v-model.number="magnification"
        label="magnification"
      />
      <v-slider
        max="600"
        min="-600"
        type="number"
        cols="4"
        v-model.number="xOffset"
        label="xOffset"
      />
      <v-slider
        max="600"
        min="-600"
        type="number"
        cols="4"
        v-model.number="yOffset"
        label="yOffset"
      />
    </v-row>
    <v-text-field v-model.number="rotate" type="number" />
    <v-row>
      <v-col cols="4">
        <v-text-field
          label="origin x"
          v-model.number="origin.x"
          type="number"
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          label="origin y"
          v-model.number="origin.y"
          type="number"
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          label="origin z"
          v-model.number="origin.z"
          type="number"
        />
      </v-col>
    </v-row>
    <v-data-table :headers="headers" :items="history" :custom-sort="customSort">
      <template v-slot:[`item.command`]="{ item }">
        <v-chip v-if="item.command === 'move'" color="blue lighten-4">
          <v-icon v-text="computeIcon(item)" />
          {{ item.command }}:{{ dirArr[item.direction] }} {{ item.moveLength }}
        </v-chip>
        <v-chip v-else-if="item.scanData !== undefined" color="red lighten-4">
          scan:{{ item.scanData.lengthX }} x {{ item.scanData.lengthY }} x ({{
            item.scanData.zFESteps
          }}
          x {{ item.scanData.zFPlaneNum }})
        </v-chip>
        <v-chip v-else color="grey lighten-4">
          {{ item.command }}
        </v-chip>
      </template>
    </v-data-table>
    <v-btn @click="getAllData"><v-icon>mdi-refresh</v-icon></v-btn>
    <a target="_blank" :href="dlUrl">download data</a>
    <v-btn color="red" @click="clearData">delete log</v-btn>

    <v-file-input
      v-model="logJsonFile"
      placeholder="Upload log json file"
      label="File input"
      prepend-icon="mdi-paperclip"
      accept="text/json"
      @change="jsonFileLoad"
    />
    <v-textarea label="history load" v-model="historyLoadStr" />
    <v-btn color="blue" @click="loadData">load log</v-btn>
    <v-dialog v-model="dialog.show">
      <v-card>
        <v-card-title>{{ dialog.title }}</v-card-title>
        <v-card-text>{{ dialog.text }}</v-card-text>
        <v-card-actions
          ><v-btn @click="dialog.show = false">Close</v-btn></v-card-actions
        >
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      origin: { x: 0, y: 0, z: 0 },
      history: [],
      headers: [
        { text: "uuid", value: "uuid" },
        { text: "command", value: "command" },
        { text: "x", value: "x" },
        { text: "y", value: "y" },
        { text: "z", value: "z" },
      ],
      cameraImage: "",
      dirArr: ["x", "y", "z"],
      file: {},
      rectArr: [],
      magnification: 1.0,
      xOffset: 0,
      yOffset: 0,
      rotate: 180,
      dlUrl: "",
      historyLoadStr: [],
      dialog: {
        show: false,
        title: "",
        text: "",
      },
      logJsonFile: {},
    };
  },
  mounted() {
    this.cameraImage = localStorage.getItem("cameraImage");
    this.getAllData();
  },
  computed: {
    rotateStyle() {
      return { transform: `rotate(${this.rotate}deg)`, width: "100%" };
    },
  },
  watch: {
    magnification() {
      this.rectArr = this.createRectArr(this.history);
    },
    xOffset() {
      this.rectArr = this.createRectArr(this.history);
    },
    yOffset() {
      this.rectArr = this.createRectArr(this.history);
    },
  },
  methods: {
    jsonFileLoad() {
      const reader = new FileReader();
      reader.onload = (e) => {
        const { result } = e.target;
        this.historyLoadStr = result;
        this.loadData();
      };
      reader.readAsText(this.logJsonFile);
    },
    customSort(items, _, isDesc) {
      items.sort((a, b) => {
        const aDate = Number(a.uuid.slice(2, 10) + a.uuid.slice(11, 17));
        const bDate = Number(b.uuid.slice(2, 10) + b.uuid.slice(11, 17));
        if (!isDesc) {
          return aDate - bDate;
        }
        return bDate - aDate;
      });
      return items;
    },
    computeIcon(item) {
      if (item.moveLength > 0) {
        switch (item.direction) {
          case 0: {
            return "mdi-arrow-right";
          }
          case 1: {
            return "mdi-arrow-down";
          }
          default: {
            return "mdi-close-circle-outline";
          }
        }
      } else {
        switch (item.direction) {
          case 0: {
            return "mdi-arrow-left";
          }
          case 1: {
            return "mdi-arrow-up";
          }
          default: {
            return "mdi-adjust";
          }
        }
      }
    },
    createRectArr(docs) {
      const pos = { x: this.xOffset, y: this.yOffset };
      const rectArr = [];
      docs.sort((fizO, buzO) => {
        const fiz = fizO.uuid;
        const buz = buzO.uuid;
        const fizTime = Number(fiz.slice(2, 10) + fiz.slice(11));
        const buzTime = Number(buz.slice(2, 10) + buz.slice(11));
        return fizTime - buzTime;
      });
      let rectCount = 0;
      const colors = [
        "black",
        "blue",
        "red",
        "purple",
        "orange",
        "green",
        "indigo",
        "pink",
      ];
      docs.forEach((doc) => {
        if (doc.command === "scan") {
          rectArr.push({
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            width: `${doc.lengthX * this.magnification}px`,
            height: `${doc.lengthY * this.magnification}px`,
            "border-color": colors[rectCount],
          });
          rectCount += 1;
        } else if (doc.command === "move") {
          if (doc.direction === 0) {
            pos.x += doc.moveLength;
          } else if (doc.direction === 1) {
            pos.y += doc.moveLength;
          }
        }
      });
      return rectArr;
    },
    fileLoad() {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.cameraImage = e.target.result;
        localStorage.setItem("cameraImage", this.cameraImage);
      };
      reader.readAsDataURL(this.file);
    },
    clearData() {
      // eslint-disable-next-line
      const deleteOk = window.confirm("Is it OK to delete all log?");
      if (deleteOk) {
        const { db } = this.$store.state;
        db.commands.remove({}, { multi: true }, (err, numRemoved) => {
          console.log(numRemoved);
        });
      }
    },
    loadData() {
      try {
        const historyLoad = JSON.parse(this.historyLoadStr);
        const { db } = this.$store.state;
        db.commands.insert(historyLoad.data, (err, newDoc) => {
          if (err !== null) {
            this.dialog = { show: true, title: "nedb error", text: err };
          } else {
            this.getAllData();
            console.log(newDoc.length);
          }
        });
      } catch (e) {
        if (e instanceof SyntaxError) {
          this.dialog = { show: true, title: "json parse error", text: e };
        }
      }
    },
    addAbsolutePos(docs) {
      docs.sort((a, b) => {
        const aDate = Number(a.uuid.slice(2, 10) + a.uuid.slice(11, 17));
        const bDate = Number(b.uuid.slice(2, 10) + b.uuid.slice(11, 17));
        return aDate - bDate;
      });
      const retDocs = [];
      const currentOrigin = { ...this.origin };

      docs.forEach((ele) => {
        const newEle = { ...ele };
        if (ele.command === "move") {
          if (ele.direction === 0) {
            currentOrigin.x += ele.moveLength;
          } else if (ele.direction === 1) {
            currentOrigin.y += ele.moveLength;
          } else {
            currentOrigin.z += ele.moveLength;
          }
        }
        if (ele.scanData !== undefined) {
          newEle.x = currentOrigin.x;
          newEle.y = currentOrigin.y;
          newEle.z = currentOrigin.z;
        }
        retDocs.push({ ...newEle });
      });
      return retDocs;
    },
    getAllData() {
      const { db } = this.$store.state;
      db.commands.find({}, (err, docs) => {
        if (err !== null) {
          console.error(err);
        } else {
          this.history = this.addAbsolutePos(docs);
          this.rectArr = this.createRectArr(docs);
          this.dlUrl = URL.createObjectURL(
            new Blob([JSON.stringify({ data: docs })]),
            {
              type: "text/plain",
            }
          );
        }
      });
    },
  },
};
</script>
<style scoped>
.rect-mother {
  position: relative;
}
.rect-child {
  position: absolute;
  border: solid 2px black;
}
</style>
