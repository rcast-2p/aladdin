<template>
  <div>
    <v-file-input
      v-model="file"
      label="File input"
      prepend-icon="mdi-paperclip"
      @change="fileLoad"
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
    <v-data-table :headers="headers" :items="history">
      <template v-slot:[`item.command`]="{ item }">
        <v-chip v-if="item.command === 'move'" color="blue lighten-4">
          <v-icon v-text="computeIcon(item)" />
          {{ item.command }}:{{ dirArr[item.direction] }} {{ item.moveLength }}
        </v-chip>
        <v-chip v-else-if="item.command === 'scan'" color="red lighten-4">
          {{ item.command }}:{{ dirArr[item.direction] }} {{ item.lengthX }} x
          {{ item.lengthY }}
        </v-chip>
      </template>
    </v-data-table>
    <v-btn @click="getAllData"><v-icon>mdi-refresh</v-icon></v-btn>
    <a target="_blank" :href="dlUrl">download data</a>
    <v-btn color="blue" @click="getAllData">fetch log</v-btn>
    <v-btn color="red" @click="clearData">delete log</v-btn>
  </div>
</template>
<script>
export default {
  data() {
    return {
      history: [],
      headers: [
        { text: "uuid", value: "uuid" },
        { text: "command", value: "command" },
      ],
      cameraImage: "",
      dirArr: ["x", "y", "z"],
      file: {},
      rectArr: [],
      magnification: 1.0,
      xOffset: 0,
      yOffset: 0,
      rotate: 0,
      dlUrl: "",
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
    computeIcon(item) {
      console.log(item);
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
            left: `${pos.x * this.magnification}px`,
            top: `${pos.y * this.magnification}px`,
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
      const deleteOk = window.confirm("Is it OK to delete all log?");
      if (deleteOk) {
        const { db } = this.$store.state;
        db.commands.remove({}, { multi: true }, (err, numRemoved) => {
          console.log(numRemoved);
        });
      }
    },
    getAllData() {
      const { db } = this.$store.state;
      db.commands.find({}, (err, docs) => {
        if (err !== null) {
          console.error(err);
        } else {
          this.history = docs;
          this.rectArr = this.createRectArr(docs);
          this.dlUrl = URL.createObjectURL(new Blob([JSON.stringify(docs)]), {
            type: "text/plain",
          });
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
