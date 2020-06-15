<template>
  <div>
    <v-text-field label="path" v-model="path" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      filelist: []
    };
  },
  methods: {}
});
</script>
