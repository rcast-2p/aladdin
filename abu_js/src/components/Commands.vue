<template>
  <div>
    <v-data-table :headers="headers" :items="items"></v-data-table>
    <v-btn @click="load">load</v-btn>
    <v-btn @click="clearDatabase">clear</v-btn>
    <a target="_blank" :href="dlUrl">download data</a>
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
  }),
  async mounted() {
    try {
      this.items = await this.loadDatabase();
      console.log(this.items);
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
    clearDatabase() {
      this.$store.state.d.db.commands.remove(
        {},
        { multi: true },
        (err, numRemoved) => {
          if (err === null) {
            console.log(numRemoved);
            this.load();
          } else {
            console.error(err);
          }
        }
      );
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
