<template>
  <v-row no-gutters class="py-2">
    <v-btn @click="prudaqOnly" :loading="loading">PRUDAQ</v-btn>
    <v-btn @click="sendSignal(2)" dark color="indigo">SIGINT</v-btn>
    <v-btn @click="sendSignal(9)">SIGKILL</v-btn>
    <v-btn @click="showPs">PS</v-btn>
    <v-btn @click="clearStorage">clear recvMemory</v-btn>
  </v-row>
</template>
<script>
export default {
  methods: {
    prudaqServe(uuid) {
      this.loading = true;
      const { bufferSize } = this.udp;
      return axios({
        baseURL: this.prudaqURL,
        url: "prudaq",
        data: {
          host: this.udp.host,
          udpPort: this.udp.port,
          count: this.udp.count,
          bufferSize,
          uuid,
        },
      });
    },
    async prudaqOnly() {
      const uuid = AbuCommon.getDateString();
      try {
        const retval = await this.prudaqServe(uuid);
        console.log(retval.data);
        this.resultItem = retval.data.retarr;
      } catch (e) {
        console.error(e);
        this.dialog = {
          title: "prudaq api error",
          text: JSON.stringify(e, null, "\t"),
          show: true,
        };
      } finally {
        this.loading = false;
      }
    },
    async receiverOnly() {
      const uuid = AbuCommon.getDateString();
      try {
        const retval = await this.receiverConfig(uuid);
        console.log(retval.data);
        this.resultItem = retval.data.retarr;
      } catch (e) {
        console.error(e);
        this.dialog = {
          title: "receiver api error",
          text: JSON.stringify(e, null, "\t"),
          show: true,
        };
      } finally {
        this.loading = false;
      }
    },
    async sendSignal(signum) {
      const retval = await axios({
        baseURL: this.recvBaseURL,
        url: "receiver/signal",
        data: { signum },
      });
      this.resultItem = retval.data.retarr;
      this.dialog = {
        title: "signal",
        text: `singal ${signum}`,
        show: true,
      };
    },
    async showPs() {
      const retval = await axios({
        baseURL: this.recvBaseURL,
        url: "receiver/ps",
        data: {},
      });
      console.log(retval.data);
      this.resultItem = retval.data.retarr;
      this.dialog = {
        title: "ps receiver_main",
        text: JSON.stringify(this.resultItem),
        show: true,
      };
    },
    clearStorage() {
      localStorage.removeItem("recvConfig");
      this.dialog = {
        title: "localStorage.recvConfig",
        text: "cleared",
        show: true,
      };
    },
  },
};
</script>
<script>
</script>
