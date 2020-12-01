<template>
  <div>
    <v-file-input
      accept="image/tiff"
      v-model="file"
      label="File input"
      prepend-icon="mdi-paperclip"
      @change="fileLoad"
    />
  </div>
</template>
<script>
import axios from "@/plugins/axios";

export default {
  data: () => ({
    file: {},
  }),
  methods: {
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
