<template>
  <div>
    <!--loadingbar-->
    <v-progress-linear
      :indeterminate="loading"
      class="webview-progress-bar"
    ></v-progress-linear>

    <!--toolbar-->
    <v-toolbar fixed class="webview-toolbar" height="50">
      <v-btn @click="goBack" icon>
        <v-icon>mdi-arrow_back</v-icon>
      </v-btn>
      <v-btn @click="goForward" icon>
        <v-icon>arrow_forward</v-icon>
      </v-btn>
      <v-btn @click="reload" icon>
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-btn @click="goHome" icon>
        <v-icon>home</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-text-field v-model="url" @keypress.enter="loadUrl"></v-text-field>
    </v-toolbar>

    <!--webview-->
    <webview id="webview" :src="initUrl"></webview>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      loading: false,
      url: "",
      webview: "",
    };
  },
  props: {
    initUrl: { type: String, require: true, default: "https://qiita.com" },
  },
  methods: {
    goBack() {
      this.webview.canGoBack() && this.webview.goBack();
    },
    goForward() {
      this.webview.canGoForward() && this.webview.goForward();
    },
    goHome() {
      this.webview.loadURL(this.initUrl);
    },
    reload() {
      this.webview.reload();
    },
    loadUrl() {
      this.url.match(/^https?:\/\//)
        ? this.webview.loadURL(this.url)
        : this.webview.loadURL(`http://${this.url}`);
    },
    setUrlBar(event) {
      if (event.isMainFrame) {
        this.url = event.url;
      }
    },
  },
  mounted() {
    // 初期URLの設定
    this.url = this.initUrl;

    // webviewの取得・設定
    this.webview = document.getElementById("webview");

    // loading eventの付与
    this.webview.addEventListener("did-start-loading", () => {
      this.loading = true;
    });
    this.webview.addEventListener("did-stop-loading", () => {
      this.loading = false;
    });

    // commit eventの付与
    this.webview.addEventListener("load-commit", (e) => {
      this.setUrlBar(e);
    });
  },
};
</script>

<style scoped lang="scss">
.webview-progress-bar {
  position: fixed;
  margin: 0;
  z-index: 999999;
}

#webview {
  margin-top: 57px;
  display: inline-flex;
  width: 1000px;
  height: 563px;
}

.webview-toolbar {
  margin-top: 7px !important;
}
</style>
