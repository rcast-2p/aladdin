<template>
  <div>
    <h1>Stage Scan</h1>
    <v-row>
      <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
        <v-tabs v-model="tab">
          <v-tab href="#camera"> camera </v-tab>
          <v-tab href="#scan"> scan </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item value="camera">
            <camera-pos />
          </v-tab-item>
          <v-tab-item value="scan">
            <scan-config />
            <scan-over-view />
            <circuit-config />
            <aom @error-dialog="errorDialog" />
            <move-ctrl @error-dialog="errorDialog" />
            <stop-ctrl @error-dialog="errorDialog" />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
      <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
        <viewer />
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
          ><v-textarea v-model="dialog.text" readonly /></v-card-text></v-card
    ></v-dialog>
  </div>
</template>
<script>
import MoveCtrl from "@/components/Move.vue";
import StopCtrl from "@/components/Stop.vue";
// import CameraPos from "@/components/CameraPos.vue";
// import axios from "@/plugins/axios";
import Viewer from "@/components/Viewer.vue";
import Aom from "@/components/Aom.vue";
import DAServer from "@/components/DAServer.vue";
import CircuitConfig from "@/components/CircuitConfig.vue";
import Images from "@/components/Image.vue";
import Servers from "@/components/Servers.vue";
import ScanConfig from "@/components/ScanConfig.vue";
import ScanOverView from "@/components/ScanOverView.vue";
import Udp from "@/components/Udp.vue";
import Websocket from "@/components/Websocket.vue";
import RawData from "../components/RawData.vue";

// import ScanConfig from "@/components/ScanConfig.vue";
// import AbuCommon from "@/assets/js/abu_common";
// import { mapState } from "vuex";

export default {
  components: {
    Aom,
    CircuitConfig,
    DAServer,
    MoveCtrl,
    Images,
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
  methods: {
    errorDialog(obj) {
      this.dialog = obj;
    },
  },
};
</script>
