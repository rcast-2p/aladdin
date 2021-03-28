<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      show-expand
      single-expand
      :expanded.sync="expanded"
      item-key="uuid"
      sort-by="updatedAt"
      :sort-desc="true"
    >
      <template v-slot:[`item.uuid`]="{ item }">
        <v-btn
          v-if="commandJudgeImage(item.command)"
          text
          @click="sendMessage(item)"
          small
          ><v-icon>mdi-image</v-icon>{{ item.uuid }}</v-btn
        ><span v-else>{{ item.uuid }}</span>
      </template>
      <template v-slot:[`item.updatedAt`]="{ item }">
        <v-btn @click="loadSwConfig(item)">load</v-btn>
      </template>
      <template v-slot:[`item.createdAt`]="{ item }">
        <span v-if="commandJudge(item.command)">
          {{ item.scanConfig.lengthX }} x {{ item.scanConfig.lengthY }} x ({{
            item.imageCalc.sizeZ
          }}
          x {{ item.scanConfig.zFLengthPerSeq }})
        </span>
        <span v-else-if="item.command === 'move'"> move </span>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-textarea
            readonly
            :value="JSON.stringify(item, null, '\t')"
          ></v-textarea>
        </td>
      </template>
    </v-data-table>
    <v-btn @click="load">reload</v-btn>
    <v-btn @click="insertShow = !insertShow">insert</v-btn>
    <v-btn @click="confirmClear">clear</v-btn>
    <a target="_blank" :href="dlUrl">download data</a>

    <v-card v-if="insertShow" class="blue lighten-4" :elevation="10">
      <h1>insert software configuration</h1>
      <v-textarea label="custom software config" v-model="insertConfig">
      </v-textarea>
      <v-btn @click="insert">insert</v-btn>
    </v-card>
    <v-dialog v-model="dialog.show"
      ><v-card
        ><v-card-title>{{ dialog.title }}</v-card-title
        ><v-card-text>{{ dialog.text }}</v-card-text>
        <v-card-actions v-if="dialog.type === 'clear'">
          <v-spacer />
          <v-btn @click="dialog.show = false">cancel</v-btn>
          <v-btn @click="clearDatabase">OK</v-btn>
        </v-card-actions>
        <v-card-actions v-else>
          <v-spacer />
          <v-btn @click="dialog.show = false">OK</v-btn>
        </v-card-actions>
      </v-card></v-dialog
    >
  </div>
</template>
<script>
import AbuCommon from "@/assets/js/abu_common";

export default {
  data: () => ({
    headers: [
      { text: "uuid", value: "uuid" },
      { text: "position", value: "position" },
      { text: "command", value: "command" },
      { text: "load", value: "updatedAt" },
      { text: "summary", value: "createdAt" },
    ],
    items: [],
    dlUrl: "",
    dialog: {
      show: false,
      text: "",
      title: "",
      type: "",
    },
    expanded: [],
    tiffViewer: "",
    insertShow: false,
    insertConfig: "",
  }),

  async mounted() {
    try {
      this.items = await this.loadDatabase();
    } catch (err) {
      console.error(err);
    }
  },
  methods: {
    handleJsonParseError(error) {
      if (error instanceof SyntaxError) {
        this.dialog = {
          show: true,
          title: "JSON syntax error",
          text: error.message,
        };
      } else {
        this.dialog = {
          show: true,
          title: "Other error",
          text: error.message,
        };
        console.error(error);
      }
    },
    async insert() {
      try {
        const insertObj = JSON.parse(this.insertConfig);
        const { uuid } = insertObj;
        this.$store.commit("setState", this.insertConfig);
        await AbuCommon.register2Db(this.$store.state, "outside", uuid);
        this.dialog = {
          show: true,
          title: "Congratulations",
          text: "successfully set.",
        };
        this.load();
      } catch (e) {
        this.handleJsonParseError(e);
      }
    },
    commandJudgeImage(command) {
      return ["scan", "receiver"].some((ele) => ele === command);
    },
    commandJudge(command) {
      return ["scan", "receiver", "outside"].some((ele) => ele === command);
    },
    async load() {
      try {
        this.items = await this.loadDatabase();
      } catch (err) {
        console.error(err);
      }
    },
    loadSwConfig(item) {
      this.$store.commit("setState", JSON.stringify(item));
      this.$store.commit("genInc");

      const gen = this.$store.state.g.generation;
      const dialog = {
        show: true,
        text: `${item.uuid} was loaded. Current generation was ${gen}`,
        title: "previous config was set.",
      };
      this.$emit("error-dialog", dialog);
    },
    createDlLink(docs) {
      return URL.createObjectURL(new Blob([JSON.stringify({ data: docs })]), {
        type: "text/plain",
      });
    },
    confirmClear() {
      this.dialog = {
        title: "clear confirmation",
        text: "Is it ok to clear commands database?",
        type: "clear",
        show: true,
      };
    },
    clearDatabase() {
      this.$store.state.d.db.commands.remove({}, { multi: true }, (err) => {
        if (err === null) {
          this.dialog.show = false;
          this.load();
        } else {
          console.error(err);
        }
      });
    },
    async sendMessage(item) {
      if (typeof this.tiffViewer !== "object") {
        this.tiffViewer = window.open(
          `${process.env.VUE_APP_PUBLIC_PATH}/tiff`,
          "tiff"
        );
        await new Promise((resolve) => {
          setTimeout(resolve, 3000, 3000);
        });
      }
      this.tiffViewer.postMessage({
        uuid: item.uuid,
        debug: item.fileSave.debug,
        maximum: item.minMax.maximum,
        minimum: item.minMax.minimum,
      });
      this.tiffViewer.focus();
    },
    async loadDatabase() {
      return new Promise((resolve, reject) => {
        this.$store.state.d.db.commands.find({}, (err, docs) => {
          if (err === null) {
            this.dlUrl = this.createDlLink(docs);
            resolve(docs);
          } else {
            reject(err);
          }
        });
      });
    },
  },
};
</script>
