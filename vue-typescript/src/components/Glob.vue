<template>
  <div>
    <v-text-field label="path" v-model="path" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import glob from "glob";
export default Vue.extend({
  data() {
    return {
      filelist: [],
    };
  },
  methods: {
    globsearch() {},
  },
});
</script>
