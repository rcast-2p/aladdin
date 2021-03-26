<template>
  <div>
    <v-row>
      <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
        <h1>Stage Scan</h1>
        <v-tabs v-model="tab">
          <v-tab href="#camera"> camera </v-tab>
          <v-tab href="#scan"> scan </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item value="camera">
            <camera-pos />
          </v-tab-item>
          <v-tab-item value="scan">
            <move-ctrl
              @error-dialog="errorDialog"
              @load-commands-db="loadCommandsDB"
            />
            <v-row>
              <stop-ctrl @error-dialog="errorDialog" />

              <scan-button
                @error-dialog="errorDialog"
                @load-commands-db="loadCommandsDB"
              />
            </v-row>
            <scan-config />
            <scan-over-view />
            <circuit-config />
            <aom @error-dialog="errorDialog" />
            <commands @error-dialog="errorDialog" ref="commands" />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
      <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
        <ome />
        <viewer
          @error-dialog="errorDialog"
          @load-commands-db="loadCommandsDB"
        />
        <udp />
        <images />
        <websocket />
        <raw-data />
        <servers />
        <d-a-server />
      </v-col>
    </v-row>
    <v-dialog v-model="dialog.show"
      ><v-card
        ><v-card-title>{{ dialog.title }}</v-card-title
        ><v-card-text
          ><v-textarea v-model="dialog.text" readonly
        /></v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog.show = false">OK</v-btn>
        </v-card-actions>
      </v-card></v-dialog
    >
  </div>
</template>
<script>
import MoveCtrl from "@/components/scan/Move.vue";
import StopCtrl from "@/components/scan/Stop.vue";
import Commands from "@/components/scan/Commands.vue";
import CameraPos from "@/components/scan/CameraPos.vue";
// import axios from "@/plugins/axios";
import Viewer from "@/components/scan/Viewer.vue";
import Aom from "@/components/scan/Aom.vue";
import DAServer from "@/components/scan/DAServer.vue";
import CircuitConfig from "@/components/scan/CircuitConfig.vue";
import Images from "@/components/scan/Image.vue";
import Ome from "@/components/scan/Ome.vue";
import Servers from "@/components/scan/Servers.vue";
import ScanConfig from "@/components/scan/ScanConfig.vue";
import ScanButton from "@/components/scan/ScanButton.vue";
import ScanOverView from "@/components/scan/ScanOverView.vue";
import Udp from "@/components/scan/Udp.vue";
import Websocket from "@/components/scan/Websocket.vue";
import RawData from "@/components/scan/RawData.vue";

// import ScanConfig from "@/components/ScanConfig.vue";
// import { mapState } from "vuex";

export default {
  components: {
    Aom,
    CameraPos,
    CircuitConfig,
    Commands,
    DAServer,
    MoveCtrl,
    Images,
    Ome,
    ScanButton,
    ScanConfig,
    Servers,
    StopCtrl,
    ScanOverView,
    Udp,
    Viewer,
    Websocket,
    RawData,
  },
  data() {
    return {
      // resultItem: [],
      // resultHeader: [
      //   { text: "command", value: "command" },
      //   { text: "returncode", value: "returncode" },
      //   { text: "stdout", value: "stdout" },
      //   { text: "stderr", value: "stderr" },
      // ],
      dialog: { show: false, text: "", title: "" },
      tab: "scan",
    };
  },
  async created() {
    try {
      const latest = await this.getLatest();
      if (latest.length > 0) {
        this.$store.commit("setState", JSON.stringify(latest[0]));
        this.$store.commit("genInc");
        const gen = this.$store.state.g.generation;
        this.dialog = {
          show: true,
          text: `${latest[0].uuid} was loaded. Current generation was ${gen}`,
          title: "previous config was set.",
        };
      }
    } catch (e) {
      console.error(e);
      this.dialog = {
        title: "dbload error",
        show: true,
        text: JSON.stringify(e, null, "\t"),
      };
    }
  },

  methods: {
    loadCommandsDB() {
      this.$refs.commands.load();
    },
    getLatest() {
      return new Promise((resolve, reject) => {
        this.$store.state.d.db.commands
          .find({})
          .sort({ updatedAt: -1 })
          .limit(1)
          .exec((err, docs) => {
            if (err === null) {
              resolve(docs);
            } else {
              reject(err);
            }
          });
      });
    },
    errorDialog(obj) {
      this.dialog = obj;
    },
  },
};
</script>
