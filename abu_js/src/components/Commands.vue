<template>
  <div>
    <v-data-table :headers="headers" :items="items"></v-data-table>
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
    ],
    items: [],
    dlUrl: "",
    dialog: {
      show: false,
      text: "",
      title: "",
    },
  }),
  async mounted() {
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
