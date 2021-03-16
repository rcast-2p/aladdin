<template>
  <div>
    <h1>ome xml</h1>
    <v-text-field label="name" v-model="name" />
    <v-text-field label="description" v-model="description" />
    <v-textarea label="ome xml" v-model="omeXml" />
    <v-btn @click="insert" v-text="'insert'" />
    <v-btn @click="deleteEntry" v-text="'delete'" />
    <v-btn @click="fetch" v-text="'fetch'" />
    <v-data-table :items="dbItems" :headers="dbHeaders" show-expand>
      <template v-slot:[`item.updatedAt`]="{ item }">
        {{ isostr(item.updatedAt) }}
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-textarea v-model="item.omeXml" readonly></v-textarea>
        </td>
      </template>
    </v-data-table>
    <v-dialog>
      <v-card>
        <v-card-title>{{ dialog.title }}</v-card-title>
        <v-card-text>{{ dialog.text }}</v-card-text>
        <v-card-actions
          >>
          <v-btn @click="dialog.show = false" text="OK" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import axios from "@/plugins/axios";

export default {
  data: () => ({
    name: "",
    description: "",
    omeXml: "",
    laserPower: 0,
    pmtGain: 0,
    objectiveName: "olympus",
    filterName: "",
    dichroicName: "",
    version: 0,
    dialog: {
      show: false,
      title: "",
      text: "",
    },
    dbItems: [],
    dbHeaders: [
      { text: "name", value: "name" },
      { text: "description", value: "description" },
      { text: "updatedAt", value: "updatedAt" },
    ],
  }),
  mounted() {
    this.fetch();
  },
  methods: {
    errorDialog(err) {
      this.dialog = {
        title: "エラー発生",
        text: err,
        show: true,
      };
    },
    isostr(dt) {
      dt.setHours(dt.getHours() + 9);
      return `${dt.toISOString().split("Z")[0]}+09:00`;
    },
    insert() {
      const insertData = {
        name: this.name,
        description: this.description,
        omeXml: this.omeXml,
      };
      this.$store.state.d.db.ome.insert(insertData, (err) => {
        if (err !== null) {
          this.errorDialog(err);
        }
      });
    },
    fetch() {
      this.$store.state.d.db.ome.find({}, (err, docs) => {
        if (err !== null) {
          this.errorDialog(err);
        }
        this.dbItems = docs;
      });
    },
    deleteEntry() {
      this.$store.state.d.db.ome.remove(
        { name: this.name },
        { multi: true },
        (err) => {
          this.errorDialog(err);
        }
      );
    },
    fileLoad() {
      const form = new FormData();
      form.append("uploadedFile", this.file);
      axios.post("http://192.168.1.148:8070/camera/upload", form, {
        headers: { "content-type": "multipart/form-data" },
      });
    },
  },
};
</script>
