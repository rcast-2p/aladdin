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
        <v-btn text @click="sendMessage(item)">{{ item.uuid }}</v-btn>
      </template>
      <template v-slot:[`item.updatedAt`]="{ item }">
        <v-btn @click="loadSwConfig(item)">load</v-btn>
      </template>
      <template v-slot:[`item.createdAt`]="{ item }">
        <span v-if="item.command === 'receiver'">
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
    <v-btn @click="load">load</v-btn>
    <v-btn @click="confirmClear">clear</v-btn>
    <a target="_blank" :href="dlUrl">download data</a>
    <v-dialog v-model="dialog.show"
      ><v-card
        ><v-card-title>{{ dialog.title }}</v-card-title
        ><v-card-text>{{ dialog.text }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog.show = false">cancel</v-btn>
          <v-btn @click="clearDatabase">OK</v-btn>
        </v-card-actions>
      </v-card></v-dialog
    >
  </div>
</template>
<script>
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
    },
    expanded: [],
    tiffViewer: {},
  }),
  async mounted() {
    this.tiffViewer = window.open("/tiff", "tiff");
    try {
      this.items = await this.loadDatabase();
    } catch (err) {
      console.error(err);
    }
  },
  methods: {
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
        title: "confirmation",
        text: "Is it ok to clear commands database?",
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
    sendMessage(item) {
      console.log(item.uuid);
      this.tiffViewer.postMessage(item.uuid);
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
